import { ImageResponse } from "next/og";
import { readContent } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Project";

export async function generateStaticParams() {
  const { projects } = await readContent();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { projects, site } = await readContent();
  const project = projects.find((p) => p.slug === slug);
  const [from, to] = project?.tint ?? ["#e8461c", "#450a0a"];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: `linear-gradient(140deg, ${from}, ${to})`,
        padding: 64,
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 22,
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.85)",
          textTransform: "uppercase",
          display: "flex",
        }}
      >
        {[project?.category, project?.year].filter(Boolean).join(" · ")}
      </div>
      <div
        style={{
          fontSize: 116,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.045em",
          lineHeight: 1,
          marginTop: 18,
          textTransform: "uppercase",
          display: "flex",
        }}
      >
        {project?.title ?? site.name}
      </div>
      <div
        style={{
          marginTop: 26,
          fontSize: 26,
          color: "rgba(255,255,255,0.8)",
          maxWidth: 900,
          display: "flex",
        }}
      >
        {site.name} — {site.role}
      </div>
    </div>,
    size,
  );
}
