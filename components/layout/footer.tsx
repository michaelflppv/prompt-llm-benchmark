import Link from "next/link";

import { Logo } from "@/components/ui/logo";

const CONTACT_EMAIL = "support@promptllmbench.com";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p className="note">Built for teams that care about transparent prompt quality.</p>
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
            <a href={`mailto:${CONTACT_EMAIL}`}>Support</a>
          </div>
        </div>
        <div>
          <div className="footer-title">Legal</div>
          <div className="footer-links">
            {/*
              TODO: add Imprint / Privacy Policy / Terms links here once the
              /legal/* pages ship (blocked on operator legal details). A link to
              a non-existent policy is worse than no link, so they are omitted
              for now.
            */}
            <a
              href="https://github.com/michaelflppv/prompt-llm-benchmark/blob/main/SECURITY.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Security
            </a>
          </div>
        </div>
        <div>
          <div className="footer-title">Get in touch</div>
          <div className="footer-links">
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <Link href="/#contact">Contact form</Link>
          </div>
        </div>
      </div>
      <div className="container footer-meta">
        <div className="note">© {year} Prompt LLM Bench. All rights reserved.</div>
      </div>
    </footer>
  );
}
