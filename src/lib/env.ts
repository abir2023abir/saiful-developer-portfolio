/**
 * Vercel injects "secret" environment variables at runtime only, so a
 * statically analysable `process.env.FOO` can be replaced at build time before
 * the real value arrives. Looking the key up through a variable cannot be
 * inlined, so the read happens when the function actually runs.
 *
 * An empty string is treated as unset: a variable saved with a blank value in a
 * host's dashboard is a mistake, not a deliberate empty configuration, and
 * `?? fallback` would otherwise keep the blank.
 */
export function env(key: string): string | undefined {
  const value = process.env[key];
  return value === undefined || value === "" ? undefined : value;
}
