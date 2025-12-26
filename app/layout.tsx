import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Prompt LLM Bench Desktop",
  description: "Download the Prompt LLM Bench desktop app for macOS, Windows, and Linux."
};

export const viewport: Viewport = {
  themeColor: "#000000"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className="app-shell">{children}</body>
    </html>
  );
}
