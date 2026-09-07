import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * TEMPORARY diagnostic. Reports whether the admin variables reached the runtime
 * and how long they are — never their contents. Delete once the deploy is sane.
 */
export async function GET() {
  const names = ["ADMIN_USER", "ADMIN_PASSWORD_HASH", "AUTH_SECRET", "STORAGE"];
  return NextResponse.json({
    vars: Object.fromEntries(
      names.map((n) => {
        const v = env(n);
        return [n, { present: v !== undefined, length: v?.length ?? 0 }];
      })
    ),
    matchingKeysInEnv: Object.keys(process.env)
      .filter((k) => /^(ADMIN_|AUTH_|STORAGE|BLOB_)/.test(k))
      .sort(),
    vercelEnv: env("VERCEL_ENV") ?? null,
  });
}
