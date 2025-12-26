"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { newsletterSchema, containsSuspiciousPatterns } from "@/lib/validation";

export function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // First-line defense: check for obvious attack patterns
    if (containsSuspiciousPatterns(email)) {
      setError("Invalid input detected");
      return;
    }

    // Validate and sanitize input
    const result = newsletterSchema.safeParse({ email });

    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid email");
      return;
    }

    setIsSubmitting(true);

    try {
      // In production, this would call your newsletter API
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 500));

      setSuccess(true);
      setEmail("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit input length client-side
    const value = e.target.value.slice(0, 254);
    setEmail(value);
    setError("");
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p className="note">Built for teams that demand transparent prompt quality.</p>
        </div>
        <div>
          <div className="footer-title">Home</div>
          <div className="footer-links">
            <Link href="/#home">Overview</Link>
            <Link href="/#features">Features</Link>
            <Link href="/#faq">FAQ</Link>
            <Link href="/download">Download</Link>
          </div>
        </div>
        <div>
          <div className="footer-title">Resources</div>
          <div className="footer-links">
            <Link href="/download#release-notes">Release notes</Link>
            <Link href="/download#checksums">Checksums</Link>
            <a href="mailto:support@promptllmbench.com">Support</a>
          </div>
        </div>
        <div>
          <div className="footer-title">Legal</div>
          <div className="footer-links">
            <Link href="/#">Privacy</Link>
            <Link href="/#">Terms</Link>
            <Link href="/#">Security</Link>
          </div>
        </div>
        <div>
          <div className="footer-title">Stay updated</div>
          <form className="footer-form" onSubmit={handleSubmit} noValidate>
            <input
              className="input"
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Email address"
              maxLength={254}
              required
              disabled={isSubmitting}
              aria-label="Email address"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "email-error" : undefined}
            />
            <Button
              variant="secondary"
              size="sm"
              type="submit"
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
            {error && (
              <span className="note" style={{ color: 'hsl(0 70% 60%)' }} id="email-error" role="alert">
                {error}
              </span>
            )}
            {success && (
              <span className="note" style={{ color: 'hsl(120 50% 60%)' }} role="status">
                Successfully subscribed!
              </span>
            )}
            {!error && !success && (
              <span className="note">Monthly updates. No spam.</span>
            )}
          </form>
        </div>
      </div>
      <div className="container footer-meta">
        <div className="note">© 2025 Prompt LLM Bench. All rights reserved.</div>
      </div>
    </footer>
  );
}
