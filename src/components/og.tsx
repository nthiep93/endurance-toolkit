import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card (default font, no network fetch needed at build time). */
export function ogCard(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#16181d",
          color: "#eceef2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 32, fontWeight: 700 }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#e8542b",
              color: "#fff",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
            }}
          >
            ET
          </div>
          {SITE.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 30, color: "#9aa1ad" }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", height: 10, width: "100%", background: "#e8542b", borderRadius: 5 }} />
      </div>
    ),
    ogSize,
  );
}
