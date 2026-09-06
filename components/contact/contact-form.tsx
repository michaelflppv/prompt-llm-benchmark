'use client';

import { useState, useEffect, useRef } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // Honeypot field
  });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDismissing, setIsDismissing] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss the success message only. Error messages stay until the user
  // acts on them (WCAG 2.2.1 Timing Adjustable).
  useEffect(() => {
    if (status !== 'success') return;

    const dismissTimer = setTimeout(() => {
      setIsDismissing(true);
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
        setIsDismissing(false);
      }, 300); // Match fade-out animation duration
    }, 6000);

    return () => clearTimeout(dismissTimer);
  }, [status]);

  // Move focus to the result message so it is announced and reachable.
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      alertRef.current?.focus();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      setStatus('error');
      setErrorMessage('Please confirm you agree to be contacted about your enquiry.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Submit to our own hardened API route (rate limiting, sanitisation,
      // honeypot and third-party delivery all happen server-side).
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          website: formData.website,
          consent
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', website: '' });
        setConsent(false);
      } else {
        setStatus('error');
        setErrorMessage(data.error || data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form" aria-describedby="contact-form-status">
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
            autoComplete="name"
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
            autoComplete="email"
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

      <div className="form-field form-consent">
        <label htmlFor="consent" className="checkbox-label">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <span>
            I agree that the details I provide will be used to contact me about my enquiry. Your
            message is delivered by email and not used for any other purpose.
          </span>
        </label>
      </div>

      <div id="contact-form-status" aria-live="polite">
        {status === 'error' && (
          <div
            ref={alertRef}
            tabIndex={-1}
            role="alert"
            className={`alert alert-error ${isDismissing ? 'dismissing' : ''}`}
          >
            <div className="alert-content">
              <strong>Error</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div
            ref={alertRef}
            tabIndex={-1}
            role="status"
            className={`alert alert-success ${isDismissing ? 'dismissing' : ''}`}
          >
            <div className="alert-content">
              <strong>Thank you!</strong>
              <span>Your message has been sent. We&apos;ll get back to you soon.</span>
            </div>
          </div>
        )}
      </div>

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
