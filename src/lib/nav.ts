import type { NavLink } from "@/components/Nav";
import type { Content } from "./types";

export function navLinks(content: Content): NavLink[] {
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Work", href: "/work", count: pad(content.projects.length) },
    { label: "Services", href: "/services", count: pad(content.services.length) },
    { label: "Contact", href: "/contact" },
  ];
}
