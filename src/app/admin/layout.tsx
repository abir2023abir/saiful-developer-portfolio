import type { Metadata } from "next";

export const metadata: Metadata = {
  // Absolute, so the root layout does not append the site name a second time.
  title: { absolute: "Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-smoke">{children}</div>;
}
