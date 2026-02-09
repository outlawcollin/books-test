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

  // Return a 1x1 transparent PNG so useTexture never throws
  const FALLBACK_PNG = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
    0x0b, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0x60, 0x00, 0x02, 0x00,
    0x00, 0x05, 0x00, 0x01, 0xe9, 0xfa, 0xdc, 0xd8, 0x00, 0x00, 0x00, 0x00,
    0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);

  return new NextResponse(FALLBACK_PNG, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
