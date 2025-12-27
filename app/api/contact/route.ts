import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput, sanitizeHTML, containsSuspiciousPatterns } from '@/lib/validation';
import validator from 'validator';

// Runtime configuration for Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONTACT_EMAIL = 'promptllmbench@gmail.com';

// Rate limiting specifically for contact form (stricter than global)
const CONTACT_RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const CONTACT_RATE_LIMIT_MAX = 3; // Max 3 submissions per hour per IP
const contactRateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup function (serverless-compatible)
function cleanupExpiredContactEntries() {
  const now = Date.now();
  for (const [ip, data] of contactRateLimitStore.entries()) {
    if (now > data.resetTime) {
      contactRateLimitStore.delete(ip);
    }
  }
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;
  return 'unknown';
}

function checkContactRateLimit(ip: string): { allowed: boolean; resetIn?: number } {
  const now = Date.now();
  let rateLimitData = contactRateLimitStore.get(ip);

  if (!rateLimitData || now > rateLimitData.resetTime) {
    rateLimitData = {
      count: 0,
      resetTime: now + CONTACT_RATE_LIMIT_WINDOW
    };
    contactRateLimitStore.set(ip, rateLimitData);
  }

  rateLimitData.count++;

  if (rateLimitData.count > CONTACT_RATE_LIMIT_MAX) {
    const resetIn = Math.ceil((rateLimitData.resetTime - now) / 1000 / 60);
    return { allowed: false, resetIn };
  }

  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // Clean up expired entries (serverless-safe)
    if (Math.random() < 0.1) { // 10% chance to cleanup
      cleanupExpiredContactEntries();
    }

    // Check contact-specific rate limit
    const ip = getClientIP(request);
    const rateLimitCheck = checkContactRateLimit(ip);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many contact form submissions. Please try again in ${rateLimitCheck.resetIn} minutes.`
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot field check (anti-spam)
    if (body.website || body.url || body.honeypot) {
      // Silent fail - likely a bot
      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 200 }
      );
    }

    // Validate and sanitize inputs (double sanitization for extra safety)
    const name = sanitizeHTML(sanitizeInput(body.name || '', 100));
    const email = sanitizeInput(body.email || '', 254).toLowerCase();
    const subject = sanitizeHTML(sanitizeInput(body.subject || '', 200));
    const message = sanitizeHTML(sanitizeInput(body.message || '', 5000));

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Length validation (after sanitization)
    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (subject.length < 3) {
      return NextResponse.json(
        { error: 'Subject must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check for suspicious patterns (XSS, injection attempts)
    if (containsSuspiciousPatterns(name) ||
        containsSuspiciousPatterns(subject) ||
        containsSuspiciousPatterns(message)) {
      return NextResponse.json(
        { error: 'Invalid characters detected in your message' },
        { status: 400 }
      );
    }

    // Additional validation: no URLs in name field
    if (validator.isURL(name)) {
      return NextResponse.json(
        { error: 'Name cannot contain URLs' },
        { status: 400 }
      );
    }

    // Skip Web3Forms if no access key OR if in dev mode without explicit enable flag
    const isDevelopment = process.env.NODE_ENV === 'development';
    const enableEmailInDev = process.env.ENABLE_EMAIL_IN_DEV === 'true';

    if (!process.env.WEB3FORMS_ACCESS_KEY || (isDevelopment && !enableEmailInDev)) {
      console.log('Contact form submission (development mode - no email sent):', {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json(
        {
          success: true,
          message: isDevelopment
            ? 'Message logged to console (development mode). Set ENABLE_EMAIL_IN_DEV=true to send real emails.'
            : 'Message received. Email delivery requires WEB3FORMS_ACCESS_KEY environment variable.'
        },
        { status: 200 }
      );
    }

    // Send to Web3Forms using their API
    const web3formsResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        name: name,
        email: email,
        subject: `Contact Form: ${subject}`,
        message: message,
        from_name: name,
        replyto: email,
        to: CONTACT_EMAIL
      })
    });

    // Check if response is OK and is JSON before parsing
    if (!web3formsResponse.ok) {
      const errorText = await web3formsResponse.text();
      console.error('Web3Forms API error:', {
        status: web3formsResponse.status,
        statusText: web3formsResponse.statusText,
        body: errorText.substring(0, 500) // Log first 500 chars
      });
      throw new Error(`Web3Forms API returned ${web3formsResponse.status}`);
    }

    const contentType = web3formsResponse.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const responseText = await web3formsResponse.text();
      console.error('Web3Forms returned non-JSON response:', {
        contentType,
        body: responseText.substring(0, 500)
      });
      throw new Error('Web3Forms API returned invalid response format');
    }

    const web3formsData = await web3formsResponse.json();

    if (web3formsData.success) {
      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 200 }
      );
    } else {
      console.error('Web3Forms error:', web3formsData);
      throw new Error(web3formsData.message || 'Failed to send email');
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Handle GET requests (return method not allowed)
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit contact form.' },
    { status: 405 }
  );
}
