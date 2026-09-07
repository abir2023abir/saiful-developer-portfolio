import Link from "next/link";
import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/auth";
import { logout } from "../actions";

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/site", label: "Site & profile" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
        <div>
          <p className="eyebrow text-black/55">Signed in as {admin}</p>
          <h1 className="font-display text-2xl font-bold tracking-tight">Content admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-white"
          >
            View site ↗
          </Link>
          <form action={logout}>
            <button className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55 transition-colors hover:text-brand-ink">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <nav className="flex flex-wrap gap-1 border-b border-black/10 py-3">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="px-3 py-2 text-sm text-black/60 transition-colors hover:bg-white hover:text-ink"
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="py-8">{children}</div>
    </div>
  );
}
