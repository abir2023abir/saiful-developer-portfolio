"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/types";

type State = "idle" | "sending" | "sent" | "error";

const field =
  "mt-1.5 w-full border border-black/10 bg-smoke px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-black/45 focus:border-brand focus-visible:ring-2 focus-visible:ring-brand/40";

export default function ContactForm({ site }: { site: SiteSettings }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      form.reset();
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  return (
    <div className="border border-black/10 bg-white">
      <div
        className="relative h-40"
        style={{
          background: "linear-gradient(120deg, #e8461c 0%, #c8340f 30%, #6366f1 65%, #0ea5e9 100%)",
        }}
      >
        <div className="grid-lines absolute inset-0 opacity-30" aria-hidden />
        <span className="absolute inset-0 grid place-items-center font-display text-2xl font-bold text-white">
          {site.name}
          <sup className="ml-1 text-[0.55em] font-normal">®</sup>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8">
        <h3 className="text-center font-display text-xl font-bold tracking-tight">Reach out to me</h3>

        <label className="block">
          <span className="text-sm font-medium">Full Name*</span>
          <input name="name" required maxLength={120} placeholder="Emily Johnson" className={field} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">E-mail*</span>
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            placeholder="emilyjohnson@gmail.com"
            className={field}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Message*</span>
          <textarea
            name="message"
            required
            rows={4}
            minLength={10}
            maxLength={5000}
            placeholder="What are you building?"
            className={`${field} resize-none`}
          />
        </label>

        {/* Honeypot: off-screen rather than display:none so bots still fill it. */}
        <div className="absolute left-[-9999px]" aria-hidden>
          <label>
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <button
          type="submit"
          disabled={state === "sending"}
          className="w-full bg-ink py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send your message"}
        </button>

        <p aria-live="polite" className="min-h-[1.25rem] text-center text-xs">
          {state === "sent" && (
            <span className="text-emerald-700">Thank you — your message landed. I reply within a day.</span>
          )}
          {state === "error" && <span className="text-brand-ink">{error}</span>}
        </p>
      </form>
    </div>
  );
}
