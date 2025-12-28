export type OSKey = "mac" | "windows" | "linux";

export const releaseInfo = {
  version: "0.1.0",
  releaseDate: "2025-01-15",
  releaseNotesUrl: "/download#release-notes",
  changelog: "https://github.com/prompt-llm-bench/releases",
  minimumRequirements: {
    mac: "macOS 13 (Ventura) or later",
    windows: "Windows 11 ARM64",
    linux: "glibc 2.35+ (Ubuntu 22.04, Fedora 36, or equivalent)"
  }
};

export type DownloadOption = {
  key: OSKey;
  label: string;
  fileName: string;
  href: string;
  architecture: string;
  requirements: string;
  steps: string[];
};

export const downloads: Record<OSKey, DownloadOption> = {
  mac: {
    key: "mac",
    label: "macOS",
    fileName: "Prompt LLM Bench-0.1.0-arm64.dmg",
    href: "/api/download/mac",
    architecture: "Apple Silicon (ARM64)",
    requirements: "Requires macOS 13+",
    steps: [
      "Open the downloaded DMG.",
      "Drag Prompt LLM Bench into Applications.",
      "Launch the app and approve permissions."
    ]
  },
  windows: {
    key: "windows",
    label: "Windows",
    fileName: "Prompt LLM Bench Setup 0.1.0.exe",
    href: "/api/download/windows",
    architecture: "ARM64",
    requirements: "Requires Windows 11",
    steps: [
      "Run the installer to start setup.",
      "Keep the default install directory.",
      "Launch Prompt LLM Bench from the Start menu."
    ]
  },
  linux: {
    key: "linux",
    label: "Linux",
    fileName: "Prompt LLM Bench-0.1.0-arm64.AppImage",
    href: "/api/download/linux",
    architecture: "ARM64",
    requirements: "Requires glibc 2.35+",
    steps: [
      "Mark the AppImage as executable.",
      "Run the AppImage from your file manager or terminal.",
      "Pin it to your launcher for quick access."
    ]
  }
};

export function detectOS(userAgent?: string): OSKey {
  if (!userAgent) {
    return "mac";
  }

  const ua = userAgent.toLowerCase();
  if (ua.includes("win")) {
    return "windows";
  }
  if (ua.includes("mac")) {
    return "mac";
  }
  if (ua.includes("linux")) {
    return "linux";
  }
  return "mac";
}
