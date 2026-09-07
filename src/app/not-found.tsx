import Link from "next/link";
import PageShell from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <section className="grid min-h-[60svh] place-items-center bg-paper px-6 py-24 text-center sm:px-10">
        <div>
          <span className="eyebrow inline-flex items-center gap-2 bg-smoke px-3 py-1.5">
            <span className="text-brand-ink">✳</span> 404
          </span>
          <h1 className="display mt-6 text-[18vw] leading-[0.84] sm:text-[9rem]">
            Not <span className="text-black/45">here.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-sm text-[0.95rem] leading-relaxed text-black/60">
            That page does not exist — or it moved. The work is all still where it was.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/work"
              className="bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand"
            >
              See the work
            </Link>
            <Link
              href="/"
              className="border border-ink px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-white"
            >
              Back home
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
