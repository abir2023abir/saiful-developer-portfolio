import { promises as fs } from "node:fs";
import path from "node:path";
import { env } from "./env";

/**
 * The admin panel writes at runtime, and a serverless filesystem is read-only —
 * on Vercel a save would appear to work and quietly vanish on the next request.
 * So every read and write goes through one of these adapters, chosen by env.
 *
 *   STORAGE=fs      (default) writes into ./content and ./public/projects
 *   STORAGE=blob    Vercel Blob — needs BLOB_READ_WRITE_TOKEN
 *
 * `readJson`/`writeJson` handle content, `putFile` handles uploads.
 */

export type Storage = {
  readJson<T>(key: string): Promise<T | null>;
  writeJson(key: string, value: unknown): Promise<void>;
  /** Returns the public URL the browser should use for the stored file. */
  putFile(name: string, body: Buffer, contentType: string): Promise<string>;
};

/**
 * A serverless host gives no writable disk, and says so in several ways: EROFS
 * when the mount is read-only, and ENOENT when the directory was never bundled
 * in the first place. Say what to do about it rather than surface a raw errno.
 */
const NO_WRITABLE_DISK = new Set(["EROFS", "EACCES", "EPERM", "ENOENT"]);

function readOnly(error: unknown): Error {
  const code = (error as NodeJS.ErrnoException)?.code;
  if (NO_WRITABLE_DISK.has(String(code))) {
    return new Error(
      "This host has no writable filesystem, so the change was not saved. " +
        "Create a Vercel Blob store, then set STORAGE=blob and BLOB_READ_WRITE_TOKEN " +
        "in the project's environment variables and redeploy."
    );
  }
  return error instanceof Error ? error : new Error("Could not write to storage.");
}

const fsStorage: Storage = {
  async readJson<T>(key: string): Promise<T | null> {
    try {
      return JSON.parse(await fs.readFile(path.join(process.cwd(), "content", key), "utf8")) as T;
    } catch {
      return null;
    }
  },

  async writeJson(key, value) {
    const file = path.join(process.cwd(), "content", key);
    try {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8");
    } catch (e) {
      throw readOnly(e);
    }
  },

  async putFile(name, body) {
    const dir = path.join(process.cwd(), "public", "projects");
    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, name), body);
    } catch (e) {
      throw readOnly(e);
    }
    return `/projects/${name}`;
  },
};

/**
 * Vercel Blob over its REST API rather than the SDK, so the project keeps its
 * dependency list to what it actually renders with.
 */
function blobStorage(token: string): Storage {
  const base = "https://blob.vercel-storage.com";
  const auth = { Authorization: `Bearer ${token}` };

  async function urlFor(key: string): Promise<string | null> {
    const res = await fetch(`${base}?prefix=${encodeURIComponent(key)}&limit=1`, {
      headers: auth,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const { blobs } = (await res.json()) as { blobs: Array<{ pathname: string; url: string }> };
    return blobs.find((b) => b.pathname === key)?.url ?? null;
  }

  async function put(key: string, body: BodyInit, contentType: string): Promise<string> {
    const res = await fetch(`${base}/${encodeURI(key)}`, {
      method: "PUT",
      headers: {
        ...auth,
        "x-api-version": "7",
        "x-content-type": contentType,
        // Content is addressed by key, so the same key must overwrite rather
        // than accumulate randomly-suffixed copies.
        "x-add-random-suffix": "0",
        "x-cache-control-max-age": "60",
      },
      body,
    });
    if (!res.ok) throw new Error(`Blob upload failed: ${res.status} ${await res.text()}`);
    const { url } = (await res.json()) as { url: string };
    return url;
  }

  return {
    async readJson<T>(key: string): Promise<T | null> {
      const url = await urlFor(key);
      if (!url) return null;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return null;
      return (await res.json()) as T;
    },

    async writeJson(key, value) {
      await put(key, JSON.stringify(value, null, 2), "application/json");
    },

    async putFile(name, body, contentType) {
      return put(`projects/${name}`, new Uint8Array(body), contentType);
    },
  };
}

let cached: Storage | null = null;

export function storage(): Storage {
  if (cached) return cached;

  const mode = env("STORAGE") ?? "fs";
  if (mode === "blob") {
    const token = env("BLOB_READ_WRITE_TOKEN");
    if (!token) throw new Error("STORAGE=blob needs BLOB_READ_WRITE_TOKEN.");
    cached = blobStorage(token);
  } else {
    cached = fsStorage;
  }
  return cached;
}
