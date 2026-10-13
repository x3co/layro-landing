import { ImageResponse } from "next/og";
import { BRAND_NAME, PRICE_FROM_LABEL } from "@/config/site";

export const runtime = "edge";
export const alt = `${BRAND_NAME} — Layout conceptual GMP`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0B0F1A",
          color: "#ffffff",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#93C5FD" }}>{BRAND_NAME}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.05, maxWidth: 980 }}>
            Layout conceptual GMP en 5 días
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 28, color: "#CBD5E1", maxWidth: 860 }}>
            Tres variantes, zonificación ISO 14644 / Anexo 1, flujos y modelo 3D. Revisión experta.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 32 }}>{PRICE_FROM_LABEL}</div>
      </div>
    ),
    { ...size },
  );
}
