import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/data";

export const alt = "Angel Roberto Martínez Castro — Ingeniero de Software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const profile = await getProfile();
  const name = profile?.name ?? "Angel Roberto Martínez Castro";
  const title = profile?.title ?? "Ingeniero de Software";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#05070d",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 30% 0%, rgba(34,211,238,0.18), transparent), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(52,211,153,0.12), transparent)",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#22d3ee", fontFamily: "monospace" }}>
          $ whoami
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 68,
            fontWeight: 700,
            color: "#e6edf3",
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 32,
            color: "#34d399",
            maxWidth: 900,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size },
  );
}
