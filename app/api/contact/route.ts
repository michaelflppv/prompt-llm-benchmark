import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput, validateEmail } from '@/lib/validation';

const CONTACT_EMAIL = 'promptllmbench@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate and sanitize inputs
    const name = sanitizeInput(body.name || '', 100);
    const email = sanitizeInput(body.email || '', 254);
    const subject = sanitizeInput(body.subject || '', 200);
    const message = sanitizeInput(body.message || '', 5000);

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
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
