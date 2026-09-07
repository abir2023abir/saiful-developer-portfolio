import { NextResponse } from "next/server";
import { addMessage } from "@/lib/messages";
import { readContent } from "@/lib/content";
import { env } from "@/lib/env";

export const runtime = "nodejs";

/** In-process, per-IP. Enough for a single-instance portfolio; not a shared limiter. */
const hits = new Map<string, number[]>();
const WINDOW = 60_000;
const LIMIT = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

async function forwardByEmail(name: string, email: string, body: string): Promise<boolean> {
  const key = env("RESEND_API_KEY");
  const to = env("CONTACT_TO");
  if (!key || !to) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env("CONTACT_FROM") ?? "Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Project enquiry from ${name}`,
      text: `${body}\n\n— ${name} <${email}>`,
    }),
  });
  return res.ok;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "local";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Try again in a minute." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const data = payload as Record<string, unknown>;

  // Bots fill every field they find, including the one no human can see.
  if (typeof data.company === "string" && data.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const body = String(data.message ?? "").trim();

  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
    return NextResponse.json(
      { error: "That email address does not look right." },
      { status: 400 },
    );
  }
  if (body.length < 10 || body.length > 5000) {
    return NextResponse.json(
      { error: "Tell me a little more — at least ten characters." },
      { status: 400 },
    );
  }

  // Two independent delivery routes, and a message only has to survive one of
  // them. The store is read-only on a serverless host unless Blob is
  // configured, and email needs a Resend key — neither is guaranteed, so
  // neither is allowed to take the other down with it.
  let stored = false;
  let emailed = false;

  try {
    await addMessage({ name, email, body });
    stored = true;
  } catch {
    // fall through to email
  }

  try {
    emailed = await forwardByEmail(name, email, body);
  } catch {
    // fall through to the failure response
  }

  if (!stored && !emailed) {
    // Losing an enquiry silently is the worst outcome, so say so and hand the
    // visitor an address that does not depend on this server.
    const { site } = await readContent();
    return NextResponse.json(
      {
        error: `Sorry — I could not save your message. Please email me directly at ${site.email}.`,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
