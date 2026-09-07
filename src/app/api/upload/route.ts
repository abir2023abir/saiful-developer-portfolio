import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { currentAdmin } from "@/lib/auth";
import { storage } from "@/lib/storage";

export const runtime = "nodejs";

const ACCEPTED = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_BYTES = 12 * 1024 * 1024;
const MAX_WIDTH = 1600;

export async function POST(request: Request) {
  if (!(await currentAdmin())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (!ACCEPTED.has(file.type)) {
    return NextResponse.json(
      { error: "PNG, JPEG or WebP only." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That file is over 12 MB." },
      { status: 413 },
    );
  }

  const source = Buffer.from(await file.arrayBuffer());

  // A photo straight off a phone is several megabytes and four thousand pixels
  // wide; the card renders it at under 800. Re-encode once here rather than
  // paying for it on every visit.
  let optimised: Buffer;
  try {
    optimised = await sharp(source)
      .rotate() // honour EXIF orientation before it is stripped
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "That file is not a readable image." },
      { status: 422 },
    );
  }

  // The name is generated rather than taken from the upload, so a crafted
  // filename cannot traverse out of the uploads directory.
  const name = `${randomUUID()}.jpg`;

  try {
    const path = await storage().putFile(name, optimised, "image/jpeg");
    return NextResponse.json({ path, bytes: optimised.length });
  } catch (e) {
    // Storage explains itself — a host with no writable disk names the remedy.
    // Let that reach the form instead of an HTML error page the client cannot
    // parse as JSON.
    const error = e instanceof Error ? e.message : "Could not save the image.";
    console.error("upload failed:", e);
    return NextResponse.json({ error }, { status: 503 });
  }
}
