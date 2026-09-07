/**
 * Vercel injects "secret" environment variables at runtime only — they are not
 * present during the build. A bundler that statically replaces `process.env.FOO`
 * therefore bakes in `undefined` before the real value ever arrives. Looking the
 * key up through a variable cannot be inlined, so the read happens when the
 * function actually runs.
 */
export function env(key: string): string | undefined {
  return process.env[key];
}
