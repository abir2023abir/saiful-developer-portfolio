import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { env } from "./env";

const COOKIE = "sip_admin";
const MAX_AGE = 60 * 60 * 8;

function secret(): string {
  const s = env("AUTH_SECRET");
  if (!s || s.length < 24) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Copy .env.example to .env.local and fill it in.",
    );
  }
  return s;
}

/**
 * Constant-time compare that cannot throw. timingSafeEqual requires equal byte
 * lengths, and a caller-supplied string of equal *character* length can still
 * differ in bytes once UTF-8 encoded — so comparing `.length` first is not
 * enough, and the RangeError it raised turned an attacker-chosen cookie into a
 * 500 on the sign-in page.
 */
function equals(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** `salt:hash`, both hex. Generate one with: node scripts/hash-password.js <password> */
export function hashPassword(
  password: string,
  salt = randomBytes(16).toString("hex"),
): string {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function passwordMatches(password: string, stored: string): boolean {
  const [salt, want] = stored.split(":");
  if (!salt || !want) return false;
  const got = scryptSync(password, salt, 64);
  const expected = Buffer.from(want, "hex");
  return got.length === expected.length && timingSafeEqual(got, expected);
}

/** True when the admin credentials are present in the environment at all. */
export function isConfigured(): boolean {
  return Boolean(
    env("ADMIN_USER") && env("ADMIN_PASSWORD_HASH") && env("AUTH_SECRET"),
  );
}

export function verifyCredentials(username: string, password: string): boolean {
  const user = env("ADMIN_USER");
  const hash = env("ADMIN_PASSWORD_HASH");
  if (!user || !hash) return false;

  // Both checks run regardless of the first result, so a wrong username and a
  // wrong password cost the same time.
  const userOk = equals(username, user);
  const passOk = passwordMatches(password, hash);
  return userOk && passOk;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export async function createSession(username: string): Promise<void> {
  // JSON rather than a delimiter-joined string: a username containing the
  // delimiter would split wrong and drop the expiry silently, leaving a session
  // that never ends.
  const payload = JSON.stringify({
    u: username,
    exp: Date.now() + MAX_AGE * 1000,
  });
  const token = `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/**
 * Never throws. Every failure — malformed cookie, bad signature, expired, or a
 * missing AUTH_SECRET — means "not signed in", so the caller redirects to the
 * login page instead of returning a 500 the owner cannot navigate away from.
 */
export async function currentAdmin(): Promise<string | null> {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return null;

    const [encoded, mac] = token.split(".");
    if (!encoded || !mac) return null;

    const payload = Buffer.from(encoded, "base64url").toString();
    if (!equals(mac, sign(payload))) return null;

    const { u, exp } = JSON.parse(payload) as { u?: unknown; exp?: unknown };
    if (typeof u !== "string" || !u) return null;
    if (typeof exp !== "number" || !Number.isFinite(exp) || exp < Date.now())
      return null;
    return u;
  } catch {
    return null;
  }
}
