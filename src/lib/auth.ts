import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "sip_admin";
const MAX_AGE = 60 * 60 * 8;

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 24) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Copy .env.example to .env.local and fill it in."
    );
  }
  return s;
}

/** `salt:hash`, both hex. Generate one with: node scripts/hash-password.js <password> */
export function hashPassword(password: string, salt = randomBytes(16).toString("hex")): string {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function passwordMatches(password: string, stored: string): boolean {
  const [salt, want] = stored.split(":");
  if (!salt || !want) return false;
  const got = scryptSync(password, salt, 64);
  const expected = Buffer.from(want, "hex");
  // Lengths must match before timingSafeEqual, and it must be the only comparison
  // so a wrong password cannot be found one byte at a time.
  return got.length === expected.length && timingSafeEqual(got, expected);
}

/** True when the admin credentials are present in the environment at all. */
export function isConfigured(): boolean {
  return Boolean(process.env.ADMIN_USER && process.env.ADMIN_PASSWORD_HASH && process.env.AUTH_SECRET);
}

export function verifyCredentials(username: string, password: string): boolean {
  const user = process.env.ADMIN_USER;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!user || !hash) return false;

  const userOk =
    username.length === user.length &&
    timingSafeEqual(Buffer.from(username), Buffer.from(user));
  const passOk = passwordMatches(password, hash);
  return userOk && passOk;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export async function createSession(username: string): Promise<void> {
  const payload = `${username}.${Date.now() + MAX_AGE * 1000}`;
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

export async function currentAdmin(): Promise<string | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const [encoded, mac] = token.split(".");
  if (!encoded || !mac) return null;

  const payload = Buffer.from(encoded, "base64url").toString();
  const want = sign(payload);
  if (mac.length !== want.length) return null;
  if (!timingSafeEqual(Buffer.from(mac), Buffer.from(want))) return null;

  const [username, expiry] = payload.split(".");
  if (!username || Number(expiry) < Date.now()) return null;
  return username;
}
