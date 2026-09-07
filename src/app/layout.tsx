import type { Metadata } from "next";
import { Archivo, Inter_Tight } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import { readContent } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-archivo",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
});

const description =
  "Full stack web developer building production-shaped web applications: Next.js, TypeScript, Node and Laravel, from the data model up to the interface.";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await readContent();
  const title = `${site.name} — ${site.role}`;

  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s — ${site.name}` },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url: "/",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { site } = await readContent();

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    url: siteUrl(),
    address: { "@type": "PostalAddress", addressLocality: site.location },
    knowsAbout: site.stack,
    sameAs: [site.upwork, site.github, site.linkedin].filter(Boolean),
  };

  return (
    <html lang="en" className={`${archivo.variable} ${interTight.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <Cursor />
        {children}
        <script
          type="application/ld+json"
          // Server-rendered from our own content file, not from user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      </body>
    </html>
  );
}
