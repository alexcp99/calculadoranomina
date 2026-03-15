import Link from "next/link";
import Calculator from "@/components/Calculator";

export default function HomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      {/* Radial gradient spotlight */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.13) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ── Header ── */}
        <header className="pt-8 pb-4 px-4 text-center md:pt-14 md:pb-10">
          {/* Badge row */}
          <div className="inline-flex items-center gap-3 mb-4 md:mb-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.22)",
                color: "#818CF8",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }}
              />
              Actualizado · AEAT 2026
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#7c7ca0",
              }}
            >
              Blog →
            </Link>
          </div>

          {/* H1 — grande y prominente en móvil */}
          <h1
            className="font-syne font-extrabold tracking-tight leading-tight mb-3 md:mb-4"
            style={{
              fontSize: "clamp(1.5rem, 7vw, 4rem)",
              color: "#f0f0ff",
            }}
          >
            Calculadora de{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #6366f1 0%, #818cf8 45%, #a5b4fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Nómina 2026
            </span>
          </h1>

          {/* Subtítulo */}
          <p
            className="text-sm md:text-lg max-w-lg mx-auto leading-relaxed mb-3 md:mb-4"
            style={{ color: "#a0a0c0" }}
          >
            Calcula tu salario neto desde el bruto, o el bruto que necesitas para un neto deseado.{" "}
            <span className="inline">IRPF y Seguridad Social 2026 incluidos.</span>
          </p>

          {/* Párrafo SEO — solo desktop */}
          <p
            className="hidden md:block text-sm max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#4a4a6a" }}
          >
            Calcula al instante cuánto cobras en neto aplicando los{" "}
            <strong style={{ color: "#5a5a80", fontWeight: 600 }}>
              tramos del IRPF 2026
            </strong>{" "}
            y las cotizaciones a la{" "}
            <strong style={{ color: "#5a5a80", fontWeight: 600 }}>
              Seguridad Social
            </strong>
            . Introduce tu{" "}
            <strong style={{ color: "#5a5a80", fontWeight: 600 }}>
              salario bruto anual o mensual
            </strong>{" "}
            y obtén el{" "}
            <strong style={{ color: "#5a5a80", fontWeight: 600 }}>
              salario neto
            </strong>{" "}
            exacto según las tablas oficiales de la AEAT para España. También
            funciona al revés: indica el neto deseado y te calculamos el bruto
            necesario.
          </p>
        </header>

        {/* ── Calculator ── */}
        <section
          className="w-full flex-1 px-4 pb-8 md:pb-16"
          aria-label="Calculadora de nómina"
        >
          <Calculator />
        </section>

        {/* ── Footer ── */}
        <footer className="pb-8 px-4 text-center">
          <p className="text-xs" style={{ color: "#3e3e60" }}>
            Datos oficiales AEAT · España · {currentYear}
          </p>
        </footer>
      </div>
    </main>
  );
}
