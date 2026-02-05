import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies Gutenberg cover images to avoid CORS issues with Three.js TextureLoader.
 * Tries the primary `url` first; if it fails and a `fallback` is provided, tries that.
 * Usage: /api/cover?url=FULL_RES_URL&fallback=MEDIUM_RES_URL
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const fallback = request.nextUrl.searchParams.get("fallback");

  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  // Only allow Gutenberg URLs
  const isValidUrl = (u: string) => u.startsWith("https://www.gutenberg.org/");
  if (!isValidUrl(url) || (fallback && !isValidUrl(fallback))) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 403 });
  }

  // Try primary URL first, then fallback
  const urls = fallback ? [url, fallback] : [url];

  for (const targetUrl of urls) {
    try {
      const res = await fetch(targetUrl);
      if (!res.ok) continue;

      const buffer = await res.arrayBuffer();
      const contentType = res.headers.get("content-type") || "image/jpeg";

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, immutable",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch {
      continue;
    }
  }

  return NextResponse.json({ error: "All sources failed" }, { status: 502 });
}
