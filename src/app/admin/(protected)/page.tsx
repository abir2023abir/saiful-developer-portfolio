import Link from "next/link";
import { readContent } from "@/lib/content";
import { readMessages } from "@/lib/messages";

export default async function AdminHome() {
  const content = await readContent();
  const messages = await readMessages();
  const unread = messages.filter((m) => !m.read).length;

  const cards = [
    {
      href: "/admin/projects",
      label: "Projects",
      value: String(content.projects.length),
      note: `${content.projects.filter((p) => p.image).length} with a screenshot`,
    },
    {
      href: "/admin/services",
      label: "Services",
      value: String(content.services.length),
      note: "Shown on the home page and /services",
    },
    {
      href: "/admin/messages",
      label: "Messages",
      value: String(messages.length),
      note: unread ? `${unread} unread` : "All read",
    },
    {
      href: "/admin/site",
      label: "Site & profile",
      value: "—",
      note: "Name, tagline, links, stats, testimonial",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="border border-black/10 bg-white p-6 transition-colors hover:border-brand"
        >
          <span className="eyebrow text-black/55">{c.label}</span>
          <p className="display mt-4 text-5xl">{c.value}</p>
          <p className="mt-2 text-sm text-black/55">{c.note}</p>
        </Link>
      ))}
    </div>
  );
}
