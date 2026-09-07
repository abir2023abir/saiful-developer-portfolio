import { ImageResponse } from "next/og";
import { readContent } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Saiful Islam — Full Stack Web Developer";

export default async function OpenGraphImage() {
  const { site } = await readContent();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "#e8461c",
        padding: "64px",
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          fontSize: 260,
          fontWeight: 800,
          color: "rgba(255,255,255,0.16)",
          letterSpacing: "-0.05em",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {site.name.split(" ")[0].toUpperCase()}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.85)",
            textTransform: "uppercase",
          }}
        >
          {site.role}
        </div>
        <div
          style={{
            fontSize: 132,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.045em",
            lineHeight: 1,
            marginTop: 18,
            textTransform: "uppercase",
          }}
        >
          {site.name}
        </div>
      </div>
    </div>,
    size,
  );
}
