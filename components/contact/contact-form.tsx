'use client';

import { useState, useEffect } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // Honeypot field
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDismissing, setIsDismissing] = useState(false);

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const dismissTimer = setTimeout(() => {
        setIsDismissing(true);
        // Wait for fade-out animation to complete before hiding
        setTimeout(() => {
          setStatus('idle');
          setErrorMessage('');
          setIsDismissing(false);
        }, 300); // Match animation duration
      }, 5000);

      return () => clearTimeout(dismissTimer);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check (client-side)
    if (formData.website) {
      // Silent fail for bots
      setStatus('success');
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      }, 1000);
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Submit directly to Web3Forms API (client-side)
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY_HERE',
          name: formData.name,
          email: formData.email,
          subject: `Contact Form: ${formData.subject}`,
          message: formData.message,
          from_name: formData.name,
          replyto: formData.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? `Error: ${error.message}`
          : 'Network error. Please check your connection and try again.'
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {/* Honeypot field - hidden from users, but bots will fill it */}
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleChange}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input"
            placeholder="Your name"
          />
        </div>

        <div className="form-field">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="subject" className="form-label">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="input"
          placeholder="What is this about?"
        />
      </div>

      <div className="form-field">
        <label htmlFor="message" className="form-label">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          className="textarea"
          placeholder="Your message..."
          rows={6}
        />
      </div>

      {status === 'error' && (
        <div className={`alert alert-error ${isDismissing ? 'dismissing' : ''}`}>
          <div className="alert-content">
            <strong>Error</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className={`alert alert-success ${isDismissing ? 'dismissing' : ''}`}>
          <div className="alert-content">
            <strong>Thank you!</strong>
            <span>Your message has been sent. We'll get back to you soon.</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn btn-primary"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
