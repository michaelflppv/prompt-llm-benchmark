/**
 * GitHub Releases Configuration
 *
 * This file contains configuration for downloading desktop application installers
 * from GitHub releases instead of serving them from the repository.
 */

const GITHUB_OWNER = "michaelflppv";
const GITHUB_REPO = "prompt-llm-benchmark";
const RELEASE_TAG = "latest";

export const GITHUB_RELEASE_CONFIG = {
  owner: GITHUB_OWNER,
  repo: GITHUB_REPO,
  tag: RELEASE_TAG,
  baseUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${RELEASE_TAG}`,
} as const;

export const PLATFORM_FILENAMES = {
  mac: "Prompt LLM Bench-0.1.0-arm64.dmg",
  windows: "Prompt LLM Bench Setup 0.1.0.exe",
  linux: "Prompt LLM Bench-0.1.0-arm64.AppImage",
} as const;

export type Platform = keyof typeof PLATFORM_FILENAMES;

/**
 * Get the GitHub release download URL for a specific platform
 */
export function getDownloadUrl(platform: Platform): string {
  const filename = PLATFORM_FILENAMES[platform];
  return `${GITHUB_RELEASE_CONFIG.baseUrl}/${encodeURIComponent(filename)}`;
}

/**
 * Check if a platform is valid
 */
export function isValidPlatform(platform: string): platform is Platform {
  return platform in PLATFORM_FILENAMES;
}
