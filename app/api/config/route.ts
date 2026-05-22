import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.AHREFS_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return NextResponse.json({ configured: false, keyPreview: null });
  }
  const keyPreview =
    apiKey.slice(0, 4) + "****" + apiKey.slice(-4);
  return NextResponse.json({ configured: true, keyPreview });
}
