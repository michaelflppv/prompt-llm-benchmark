import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 100;

// In-memory store for rate limiting (per IP)
// Note: On Vercel, this is per-instance and may not be shared across edge functions
// For production rate limiting, consider using Vercel KV, Upstash, or similar
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup function (called on-demand instead of setInterval for serverless compatibility)
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}

function getClientIP(request: NextRequest): string {
  // Try various headers for client IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return 'unknown';
}

export function middleware(request: NextRequest) {
  // Clean up expired entries periodically (serverless-safe)
  if (Math.random() < 0.01) { // 1% chance to cleanup on each request
    cleanupExpiredEntries();
  }

  const ip = getClientIP(request);
  const now = Date.now();

  // Get or create rate limit data for this IP
  let rateLimitData = rateLimitStore.get(ip);

  if (!rateLimitData || now > rateLimitData.resetTime) {
    // Create new rate limit window
    rateLimitData = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW
    };
    rateLimitStore.set(ip, rateLimitData);
  }

  // Increment request count
  rateLimitData.count++;

  // Check if limit exceeded
  if (rateLimitData.count > RATE_LIMIT_MAX_REQUESTS) {
    const resetIn = Math.ceil((rateLimitData.resetTime - now) / 1000 / 60); // minutes

    return new NextResponse(
      JSON.stringify({
        error: 'Rate limit exceeded',
        message: `Too many requests. Please try again in ${resetIn} minutes.`,
        limit: RATE_LIMIT_MAX_REQUESTS,
        window: '1 hour'
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitData.resetTime.toString(),
          'Retry-After': (resetIn * 60).toString()
        }
      }
    );
  }

  // Add rate limit headers to response
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
  response.headers.set('X-RateLimit-Remaining', (RATE_LIMIT_MAX_REQUESTS - rateLimitData.count).toString());
  response.headers.set('X-RateLimit-Reset', rateLimitData.resetTime.toString());

  // Security headers
  // Content Security Policy - Prevents XSS, clickjacking, and other code injection attacks
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-eval in dev
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "media-src 'self' blob:",
    "connect-src 'self' https://api.web3forms.com", // Allow Web3Forms API
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspHeader);

  // Prevent clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Enable browser XSS protection (legacy, but doesn't hurt)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Require HTTPS (only for production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Permissions Policy - Disable unnecessary browser features
  response.headers.set('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '));

  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
