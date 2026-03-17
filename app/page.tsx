import Link from "next/link";
import Calculator from "@/components/Calculator";
import SiteFooter from "@/components/SiteFooter";

const SALARY_CARDS = [
  { slug: "20000", bruto: "20.000 €", neto: "1.575 €", irpf: "9,8 %",  accent: "#6366f1", accentSoft: "rgba(99,102,241,0.15)"  },
  { slug: "25000", bruto: "25.000 €", neto: "1.911 €", irpf: "13,7 %", accent: "#818cf8", accentSoft: "rgba(129,140,248,0.15)" },
  { slug: "30000", bruto: "30.000 €", neto: "2.274 €", irpf: "17,7 %", accent: "#a78bfa", accentSoft: "rgba(167,139,250,0.15)" },
  { slug: "40000", bruto: "40.000 €", neto: "2.876 €", irpf: "22,1 %", accent: "#c084fc", accentSoft: "rgba(192,132,252,0.15)" },
  { slug: "50000", bruto: "50.000 €", neto: "3.414 €", irpf: "25,1 %", accent: "#e879f9", accentSoft: "rgba(232,121,249,0.15)" },
];

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

        {/* ── Salary quick links ── */}
        <section className="px-4 pb-12 md:pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h2
                className="font-syne font-bold mb-1"
                style={{ fontSize: "clamp(1.1rem, 3vw, 1.35rem)", color: "#e0e0ff" }}
              >
                Sueldos más consultados en España
              </h2>
              <p className="text-sm" style={{ color: "#5a5a80" }}>
                Neto mensual en Madrid · Soltero/a sin hijos · 2026
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {SALARY_CARDS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/cuanto-es-${c.slug}-euros-brutos-neto`}
                  className="salary-quick-card group flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
                  style={{
                    background: "rgba(13,13,26,0.9)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {/* Accent top bar */}
                  <div style={{ height: "3px", background: `linear-gradient(90deg, ${c.accent}, transparent)` }} />

                  <div className="p-4 flex flex-col gap-2.5">
                    {/* Bruto badge */}
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full self-start"
                      style={{ background: c.accentSoft, color: c.accent }}
                    >
                      {c.bruto} brutos
                    </span>

                    {/* Neto — número principal */}
                    <div>
                      <div
                        className="font-syne font-extrabold leading-none whitespace-nowrap"
                        style={{ fontSize: "clamp(1.4rem, 3.5vw, 1.75rem)", color: "#f0f0ff" }}
                      >
                        {c.neto}
                      </div>
                      <div className="text-xs mt-1 font-medium" style={{ color: "#7c7ca0" }}>
                        netos al mes
                      </div>
                    </div>

                    {/* IRPF footer */}
                    <div
                      className="flex items-center justify-between pt-2"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <span className="text-xs" style={{ color: "#4a4a6a" }}>IRPF ef.</span>
                      <span className="text-xs font-semibold" style={{ color: c.accent }}>{c.irpf}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <SiteFooter year={currentYear} />
      </div>
    </main>
  );
}
