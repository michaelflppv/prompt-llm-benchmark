import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Prompt LLM Bench Desktop",
  description: "Download the Prompt LLM Bench desktop app for macOS, Windows, and Linux."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#000000"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="app-shell">
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
        {/*
          Vercel Analytics is cookieless and stores nothing on the visitor's
          device, so it runs without a consent gate. It is disclosed in the
          privacy policy.
        */}
        <Analytics />
      </body>
    </html>
  );
}
