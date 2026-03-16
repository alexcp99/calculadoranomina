import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Calculadora de Nómina 2026 — Salario Bruto y Neto | IRPF y Seguridad Social";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#080810",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.35) 0%, transparent 65%)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 999,
            border: "1px solid rgba(99,102,241,0.35)",
            background: "rgba(99,102,241,0.1)",
            color: "#818cf8",
            fontSize: 18,
            fontWeight: 500,
            marginBottom: 32,
          }}
        >
          ✦ Actualizado · AEAT 2026
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#f0f0ff",
            textAlign: "center",
            lineHeight: 1.15,
            letterSpacing: "-1px",
            marginBottom: 20,
            maxWidth: 900,
          }}
        >
          Calculadora de{" "}
          <span style={{ color: "#818cf8" }}>Nómina 2026</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: "#7c7ca0",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
            marginBottom: 48,
          }}
        >
          Salario bruto → neto · IRPF + Seguridad Social
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: 12 }}>
          {["Bruto → Neto", "Neto → Bruto", "19 CCAA", "Gratis"].map((t) => (
            <div
              key={t}
              style={{
                padding: "10px 20px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "#a0a0c0",
                fontSize: 18,
              }}
            >
              {t}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            fontSize: 20,
            color: "#3e3e60",
          }}
        >
          calculadoranomina.org
        </div>
      </div>
    ),
    { ...size }
  );
}
