"use client";

import { useEffect, useRef, useState } from "react";
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
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Keyboard + focus management for the mobile drawer.
  useEffect(() => {
    if (!open) return;

    const toggle = toggleRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Move focus into the drawer when it opens.
    const firstLink = panelRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Return focus to the control that opened the drawer.
      toggle?.focus();
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
        <button
          ref={toggleRef}
          type="button"
          className="btn btn-icon mobile-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span aria-hidden="true">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {open ? (
        <div className="mobile-drawer open" id="mobile-drawer">
          <div className="mobile-overlay" aria-hidden="true" onClick={() => setOpen(false)} />
          <div className="mobile-panel" role="dialog" aria-modal="true" aria-label="Navigation" ref={panelRef}>
            <button
              type="button"
              className="btn btn-ghost mobile-close"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <div className="mobile-links">
              {navItems.map((item) => (
                <Link key={item.label} className="nav-link" href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <Button href="/download" variant="primary" onClick={() => setOpen(false)}>
              Download
            </Button>
            <Button href="/download#release-notes" variant="secondary" onClick={() => setOpen(false)}>
              Release notes
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
