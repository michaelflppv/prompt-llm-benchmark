import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export function Footer() {
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
          <form className="footer-form">
            <input className="input" type="email" name="email" placeholder="Email address" />
            <Button variant="secondary" size="sm">
              Subscribe
            </Button>
            <span className="note">Monthly updates. No spam.</span>
          </form>
        </div>
      </div>
      <div className="container footer-meta">
        <div className="note">© 2025 Prompt LLM Bench. All rights reserved.</div>
      </div>
    </footer>
  );
}
