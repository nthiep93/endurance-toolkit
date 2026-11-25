import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#c2410c",
          color: "#fff",
          borderRadius: 14,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        ET
      </div>
    ),
    size,
  );
}
