import { NextResponse } from "next/server";
import {
  getDownloadUrl,
  isValidPlatform,
  type Platform,
} from "@/lib/github-releases";

/**
 * Download API Route
 *
 * Handles download requests for desktop application installers.
 * Validates the platform and redirects to the corresponding GitHub release asset.
 *
 * Platforms: mac, windows, linux
 *
 * Example: GET /api/download/mac
 */
export async function GET(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const { platform } = params;

  // Validate platform parameter
  if (!isValidPlatform(platform)) {
    return NextResponse.json(
      {
        error: "Invalid platform",
        message: `Platform must be one of: mac, windows, linux. Received: ${platform}`,
      },
      { status: 400 }
    );
  }

  // Optional: Log download analytics
  // This can be extended to track downloads in your analytics service
  if (process.env.NODE_ENV === "development") {
    console.log("[Download]", {
      platform,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    });
  }

  // Construct GitHub release download URL
  const downloadUrl = getDownloadUrl(platform as Platform);

  // Redirect to GitHub release asset
  // The browser will handle the download automatically
  return NextResponse.redirect(downloadUrl, { status: 302 });
}
