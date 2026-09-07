/**
 * Per-instance, in-memory. On a serverless host each instance keeps its own
 * counters, so this throttles a single attacker's burst rather than enforcing a
 * global budget — worth having for the cost, but do not mistake it for a real
 * limiter. A shared store (Vercel KV / Upstash) is the upgrade.
 *
 * Entries are swept on every call, so the map cannot grow without bound on a
 * long-lived process the way a prune-only-what-you-touch version would.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();

  for (const [k, times] of buckets) {
    if (now - times[times.length - 1] >= windowMs) buckets.delete(k);
  }

  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  return recent.length > limit;
}

/**
 * The client-supplied leftmost x-forwarded-for entry is trivially spoofed, which
 * would let one attacker mint unlimited buckets. Vercel sets x-real-ip itself,
 * so prefer it and fall back to the *last* forwarded hop.
 */
export function clientIp(request: Request): string {
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    if (hops.length) return hops[hops.length - 1];
  }
  return "local";
}
