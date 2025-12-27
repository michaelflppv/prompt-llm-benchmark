"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Features", href: "/#features" },
  { label: "Download", href: "/download" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.label} className="nav-link" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Button href="/download" variant="primary" size="sm">
            Download
          </Button>
          <Button href="/download#release-notes" variant="ghost" size="sm">
            Release notes
          </Button>
        </div>
        <Button
          variant="icon"
          className="mobile-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "×" : "≡"}
        </Button>
      </div>

      <div className={`mobile-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="mobile-overlay" onClick={() => setOpen(false)} />
        <div className="mobile-panel">
          <div className="mobile-links">
            {navItems.map((item) => (
              <Link key={item.label} className="nav-link" href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
          <Button href="/download" variant="primary">
            Download
          </Button>
          <Button href="/download#release-notes" variant="secondary">
            Release notes
          </Button>
        </div>
      </div>
    </header>
  );
}
