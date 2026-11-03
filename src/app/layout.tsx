import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Archivo, Inter_Tight } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ScrollRail from "@/components/ScrollRail";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/JsonLd";
import { readContent } from "@/lib/content";
import { siteJsonLd } from "@/lib/seo";
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
  "Saiful Islam is a full stack web developer in Dhaka. He builds production web applications with Next.js, TypeScript, Node and Laravel, from the data model to the interface.";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await readContent();
  const title = `${site.name} — ${site.role} in Dhaka`;

  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s — ${site.name}` },
    description,
    authors: [{ name: site.name, url: siteUrl() }],
    creator: site.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { site } = await readContent();

  return (
    <html lang="en" className={`${archivo.variable} ${interTight.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <Cursor />
        <ScrollRail />
        <WhatsAppButton />
        {children}
        <Analytics />
        <JsonLd data={siteJsonLd(site, description)} />
      </body>
    </html>
  );
}
