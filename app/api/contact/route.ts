import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput, sanitizeHTML, containsSuspiciousPatterns } from '@/lib/validation';
import validator from 'validator';

const CONTACT_EMAIL = 'promptllmbench@gmail.com';

// Rate limiting specifically for contact form (stricter than global)
const CONTACT_RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const CONTACT_RATE_LIMIT_MAX = 3; // Max 3 submissions per hour per IP
const contactRateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of contactRateLimitStore.entries()) {
    if (now > data.resetTime) {
      contactRateLimitStore.delete(ip);
    }
  }
}, 10 * 60 * 1000);

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

    // Create mailto link (fallback approach - works without backend email service)
    // In production, you'd use a service like Resend, SendGrid, or Nodemailer
    const emailBody = `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
    `.trim();

    // For now, we'll use a simple approach with Web3Forms or similar
    // You can replace this with Resend, SendGrid, etc.
    const formData = new FormData();
    formData.append('access_key', process.env.WEB3FORMS_ACCESS_KEY || '');
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', `Contact Form: ${subject}`);
    formData.append('message', message);
    formData.append('to', CONTACT_EMAIL);

    // If WEB3FORMS_ACCESS_KEY is not set, return instructions
    if (!process.env.WEB3FORMS_ACCESS_KEY) {
      console.log('Contact form submission:', { name, email, subject, message });

      return NextResponse.json(
        {
          success: true,
          message: 'Form logged. To enable email delivery, set WEB3FORMS_ACCESS_KEY in environment variables.'
        },
        { status: 200 }
      );
    }

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 200 }
      );
    } else {
      throw new Error(data.message || 'Failed to send email');
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
