import { Suspense } from "react";
import Link from "next/link";
import HomeCalculatorTabs from "@/components/HomeCalculatorTabs";
import SiteFooter from "@/components/SiteFooter";
import SeoFaqAccordion from "@/components/SeoFaqAccordion";
import { getAllPosts } from "@/lib/blog";
import { SALARIO_DATA, fmt } from "@/lib/salario-data";

// ─── Salary cards (colores hardcoded, neto/irpf desde computeCalc) ────────────

const ACCENT_DATA = [
  { slug: "15000",  accent: "#38bdf8", accentSoft: "rgba(56,189,248,0.15)"  },
  { slug: "16000",  accent: "#4fb8f5", accentSoft: "rgba(79,184,245,0.15)"  },
  { slug: "18000",  accent: "#5aa8f2", accentSoft: "rgba(90,168,242,0.15)"  },
  { slug: "20000",  accent: "#6366f1", accentSoft: "rgba(99,102,241,0.15)"  },
  { slug: "22000",  accent: "#6d7cf4", accentSoft: "rgba(109,124,244,0.15)" },
  { slug: "24000",  accent: "#7b87f6", accentSoft: "rgba(123,135,246,0.15)" },
  { slug: "25000",  accent: "#818cf8", accentSoft: "rgba(129,140,248,0.15)" },
  { slug: "28000",  accent: "#9a84fb", accentSoft: "rgba(154,132,251,0.15)" },
  { slug: "30000",  accent: "#a78bfa", accentSoft: "rgba(167,139,250,0.15)" },
  { slug: "32000",  accent: "#ae8bfb", accentSoft: "rgba(174,139,251,0.15)" },
  { slug: "35000",  accent: "#b48bfb", accentSoft: "rgba(180,139,251,0.15)" },
  { slug: "40000",  accent: "#c084fc", accentSoft: "rgba(192,132,252,0.15)" },
  { slug: "45000",  accent: "#d47dfd", accentSoft: "rgba(212,125,253,0.15)" },
  { slug: "50000",  accent: "#e879f9", accentSoft: "rgba(232,121,249,0.15)" },
  { slug: "60000",  accent: "#f472d0", accentSoft: "rgba(244,114,208,0.15)" },
  { slug: "70000",  accent: "#f472b6", accentSoft: "rgba(244,114,182,0.15)" },
  { slug: "80000",  accent: "#f86f9e", accentSoft: "rgba(248,111,158,0.15)" },
  { slug: "100000", accent: "#fb7185", accentSoft: "rgba(251,113,133,0.15)" },
];

const SALARY_CARDS = ACCENT_DATA.map(({ slug, accent, accentSoft }) => {
  const d = SALARIO_DATA[slug];
  return {
    slug,
    bruto:      `${d.brutoLabel} €`,
    neto:       `${fmt(d.netoMensual)} €`,
    irpf:       `${d.irpfEf} %`,
    accent,
    accentSoft,
  };
});

// ─── FAQ JSON-LD ──────────────────────────────────────────────────────────────

const d30 = SALARIO_DATA["30000"];

// ─── CCAA mini-cards para 30.000 € (derivadas de computeCalc) ─────────────────

const d30Mad = d30.ccaaTable.find((r) => r.ccaa === "Comunidad de Madrid")!;
const d30Val = d30.ccaaTable.find((r) => r.ccaa === "Comunitat Valenciana")!;
const d30Cat = d30.ccaaTable.find((r) => r.ccaa === "Cataluña")!;

const CCAA_MINI_CARDS = [
  { label: "Madrid",   emoji: "🏛️", neto: `${fmt(d30Mad.neto)} €/mes`, delta: "Menos impuestos",                                      color: "#34d399", bg: "rgba(52,211,153,0.07)",  border: "rgba(52,211,153,0.2)"  },
  { label: "Valencia", emoji: "🌊", neto: `${fmt(d30Val.neto)} €/mes`, delta: `−${fmt(d30Mad.neto - d30Val.neto)} €/mes vs Madrid`,    color: "#818cf8", bg: "rgba(99,102,241,0.07)",  border: "rgba(99,102,241,0.2)"  },
  { label: "Cataluña", emoji: "🏔️", neto: `${fmt(d30Cat.neto)} €/mes`, delta: `−${fmt(d30Mad.neto - d30Cat.neto)} €/mes vs Madrid`,   color: "#f87171", bg: "rgba(248,113,113,0.07)", border: "rgba(248,113,113,0.2)" },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { q: "¿Cuánto me queda neto de 30.000€ brutos?", a: `Con 30.000€ brutos anuales en Madrid, soltero/a y sin hijos, cobras aproximadamente ${fmt(d30.netoMensual)}€ netos al mes (${fmt(d30.netoAnual)}€ netos al año). De tu salario bruto se descuentan ${fmt(d30.ssEuros)}€ de cotización a la Seguridad Social (6,50%) y ${fmt(d30.irpfEuros)}€ de retención IRPF (tipo efectivo ${d30.irpfEf}%). El resultado varía según tu comunidad autónoma y situación familiar.` },
    { q: "¿Cómo afecta tener hijos al IRPF?", a: "Tener hijos reduce la base imponible del IRPF gracias a los mínimos familiares. Con un hijo menor de 25 años, el mínimo por descendiente es de 2.400€; con dos hijos, 2.700€ por el segundo. En la práctica, esto supone entre 20€ y 70€ más al mes en el salario neto dependiendo del nivel salarial." },
    { q: "¿El cálculo de nómina es el mismo en toda España?", a: "No. La cotización a la Seguridad Social (6,50%) sí es igual en todo el territorio. Sin embargo, el IRPF tiene una parte estatal y una parte autonómica, y cada comunidad fija sus propios tramos. Madrid tiene los tipos autonómicos más bajos del régimen común, mientras que Cataluña o Valencia aplican tipos más altos." },
    { q: "¿Qué diferencia hay entre cobrar en 12 o 14 pagas?", a: "La paga bruta anual es la misma, pero el IRPF retenido cambia. Con 14 pagas, dos mensualidades adicionales se cobran en meses concretos, lo que puede alterar el tipo de retención. El neto anual total es prácticamente idéntico; la diferencia está en cómo se distribuye a lo largo del año." },
    { q: "¿Cuánto le cuesta un empleado a la empresa?", a: `Además del salario bruto, la empresa paga sus propias cotizaciones a la Seguridad Social (≈30,48% adicional). Para un empleado con 30.000€ brutos, el coste total para la empresa es de aproximadamente ${fmt(d30.costeEmpresa)}€ al año.` },
  ].map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

// ─── SEO section shared components ───────────────────────────────────────────

function SeoH2({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}
      >
        {icon}
      </div>
      <h2 className="font-syne font-bold" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
        <span style={{ color: "#6366f1", marginRight: "0.4em" }}>●</span>
        {children}
      </h2>
    </div>
  );
}

function SeoTh({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
      style={{
        background: "rgba(99,102,241,0.2)",
        color: "#9090c8",
        borderBottom: "1px solid rgba(99,102,241,0.2)",
      }}
    >
      {children}
    </th>
  );
}

function SeoTd({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <td
      className="px-4 py-3 text-sm"
      style={{
        color: highlight ? "#e0e0ff" : "#a0a0c0",
        fontWeight: highlight ? 600 : 400,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {children}
    </td>
  );
}

function SeoSectionDivider() {
  return <div className="seo-divider" />;
}

// ─── IRPF data with bar widths ────────────────────────────────────────────────

const IRPF_TRAMOS = [
  { rango: "Hasta 12.450 €",        tipo: "9,50%",  bar: 39,  color: "#34d399" },
  { rango: "12.450 € – 20.200 €",   tipo: "12,00%", bar: 49,  color: "#6ee7b7" },
  { rango: "20.200 € – 35.200 €",   tipo: "15,00%", bar: 61,  color: "#818cf8" },
  { rango: "35.200 € – 60.000 €",   tipo: "18,50%", bar: 76,  color: "#a78bfa" },
  { rango: "60.000 € – 300.000 €",  tipo: "22,50%", bar: 92,  color: "#f87171" },
  { rango: "Más de 300.000 €",       tipo: "24,50%", bar: 100, color: "#ef4444" },
];

const SEO_SALARY_COLORS: Record<string, string> = {
  "15000": "#38bdf8", "20000": "#6366f1", "25000": "#818cf8", "30000": "#a78bfa",
  "35000": "#b48bfb", "40000": "#c084fc", "50000": "#e879f9", "60000": "#f472d0",
  "80000": "#f86f9e", "100000": "#fb7185",
};

const SEO_SALARY_TABLE = ["15000","20000","25000","30000","35000","40000","50000","60000","80000","100000"].map((slug) => {
  const d = SALARIO_DATA[slug];
  return { bruto: `${d.brutoLabel} €`, neto: `${fmt(d.netoMensual)} €/mes`, slug, color: SEO_SALARY_COLORS[slug] };
});

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const currentYear = new Date().getFullYear();
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

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
          <h1
            className="font-syne font-extrabold tracking-tight leading-snug mb-3 md:mb-4"
            style={{ fontSize: "clamp(1.5rem, 7vw, 4rem)", color: "#f0f0ff" }}
          >
            Calculadora de{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #818cf8 45%, #a5b4fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                paddingBottom: "0.1em",
              }}
            >
              Nómina 2026
            </span>
          </h1>

          <p
            className="text-sm md:text-lg max-w-lg mx-auto leading-relaxed mb-3 md:mb-4"
            style={{ color: "#a0a0c0" }}
          >
            Calcula tu <strong style={{ color: "#c0c0d8" }}>salario neto desde el bruto</strong> — o el bruto necesario para un neto deseado. <strong style={{ color: "#c0c0d8" }}>IRPF 2026</strong>, Seguridad Social y <strong style={{ color: "#c0c0d8" }}>19 comunidades autónomas</strong>. Gratis y sin registro.
          </p>

          <p
            className="hidden md:block text-sm max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#9090b8" }}
          >
            Calcula al instante cuánto cobras en neto aplicando los{" "}
            <strong style={{ color: "#c0c0e0", fontWeight: 600 }}>tramos del IRPF 2026</strong>{" "}
            y las cotizaciones a la{" "}
            <strong style={{ color: "#c0c0e0", fontWeight: 600 }}>Seguridad Social</strong>.
            Introduce tu{" "}
            <strong style={{ color: "#c0c0e0", fontWeight: 600 }}>salario bruto anual o mensual</strong>{" "}
            y obtén el{" "}
            <strong style={{ color: "#c0c0e0", fontWeight: 600 }}>salario neto</strong>{" "}
            exacto según las tablas oficiales de la AEAT para España. Selecciona tu comunidad autónoma entre las{" "}
            <strong style={{ color: "#c0c0e0", fontWeight: 600 }}>19 CCAA disponibles</strong>{" "}
            — porque el mismo bruto da distinto neto en Madrid que en Cataluña. También funciona al revés:
            indica el neto deseado y te calculamos el bruto necesario.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-4 mb-2">
            <span
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}
            >
              ✓ Datos oficiales AEAT 2026
            </span>
            <span
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              ✓ 19 comunidades autónomas
            </span>
            <span
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              ✓ Gratis · Sin registro
            </span>
          </div>
        </header>

        {/* ── Calculator ── */}
        <section className="w-full flex-1 px-4 pb-8 md:pb-16" aria-label="Calculadora de nómina">
          <Suspense fallback={<div style={{ minHeight: 400 }} />}>
            <HomeCalculatorTabs />
          </Suspense>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {SALARY_CARDS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/cuanto-es-${c.slug}-euros-brutos-neto`}
                  className="salary-quick-card group flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
                  style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div style={{ height: "3px", background: `linear-gradient(90deg, ${c.accent}, transparent)` }} />
                  <div className="p-4 flex flex-col gap-2.5">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full self-start whitespace-nowrap"
                      style={{ background: c.accentSoft, color: c.accent }}
                    >
                      {c.bruto} brutos
                    </span>
                    <div>
                      <div
                        className="font-syne font-extrabold leading-none whitespace-nowrap"
                        style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", color: "#f0f0ff" }}
                      >
                        {c.neto}
                      </div>
                      <div className="text-xs mt-1 font-medium" style={{ color: "#7c7ca0" }}>netos al mes</div>
                    </div>
                    <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="text-xs" style={{ color: "#4a4a6a" }}>IRPF ef.</span>
                      <span className="text-xs font-semibold" style={{ color: c.accent }}>{c.irpf}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Other tools ── */}
        <section className="px-4 pb-12 md:pb-14">
          <div className="max-w-5xl mx-auto">
            <div className="mb-5">
              <h2
                className="font-syne font-bold mb-1"
                style={{ fontSize: "clamp(1.1rem, 3vw, 1.35rem)", color: "#e0e0ff" }}
              >
                Más herramientas fiscales
              </h2>
              <p className="text-sm" style={{ color: "#5a5a80" }}>
                Calculadoras especializadas para decisiones salariales
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/calculadora-retencion-irpf"
                className="group flex items-start gap-4 rounded-2xl p-5 transition-all duration-200"
                style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.35)"; (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.background = "rgba(13,13,26,0.9)"; }}
              >
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
                  <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="#818cf8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="7" cy="7" r="5.5" /><path d="M4.5 9.5l5-5M5 5.5h.01M9 8.5h.01" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: "#e0e0ff" }}>Retención IRPF</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>Calcula el porcentaje exacto que Hacienda retiene en tu nómina según tu situación familiar.</p>
                </div>
                <svg className="shrink-0 mt-1 opacity-30 group-hover:opacity-60 transition-opacity" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="#818cf8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              <Link
                href="/calculadora-cambio-trabajo"
                className="group flex items-start gap-4 rounded-2xl p-5 transition-all duration-200"
                style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(52,211,153,0.35)"; (e.currentTarget as HTMLElement).style.background = "rgba(52,211,153,0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.background = "rgba(13,13,26,0.9)"; }}
              >
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
                  <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4.5h10M9 2l3 2.5L9 7" /><path d="M12 9.5H2M5 7l-3 2.5L5 12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: "#e0e0ff" }}>Cambio de trabajo</span>
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>Nuevo</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>¿Te compensa la nueva oferta? Compara neto real, bonus, vacaciones y teletrabajo en un solo clic.</p>
                </div>
                <svg className="shrink-0 mt-1 opacity-30 group-hover:opacity-60 transition-opacity" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Latest blog posts ── */}
        <section className="px-4 pb-14 md:pb-16">
              <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
                  <div>
                    <h2
                      className="font-syne font-bold mb-1"
                      style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)", color: "#e0e0ff" }}
                    >
                      Últimas guías sobre nóminas e IRPF
                    </h2>
                    <p className="text-sm" style={{ color: "#5a5a80" }}>
                      Artículos prácticos para entender tu salario y pagar menos impuestos
                    </p>
                  </div>
                  <Link
                    href="/blog"
                    className="shrink-0 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    style={{ color: "#818cf8" }}
                  >
                    Ver todos
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {latestPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group home-blog-card flex flex-col rounded-2xl p-5 transition-all duration-200"
                    >
                      {/* Keywords */}
                      {post.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.keywords.slice(0, 2).map((kw) => (
                            <span
                              key={kw}
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: "rgba(99,102,241,0.1)",
                                border: "1px solid rgba(99,102,241,0.2)",
                                color: "#818cf8",
                              }}
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h3
                        className="font-syne font-bold mb-2 flex-1 group-hover:text-indigo-300 transition-colors"
                        style={{ fontSize: "0.95rem", color: "#e0e0ff", lineHeight: 1.45 }}
                      >
                        {post.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-xs leading-relaxed mb-4 line-clamp-2"
                        style={{ color: "#a0a0c0" }}
                      >
                        {post.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-xs" style={{ color: "#6060a0" }}>
                          <span>{new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(new Date(post.date))}</span>
                          <span>·</span>
                          <span>{post.readTime}</span>
                        </div>
                        <span
                          className="text-xs font-semibold transition-transform duration-200 group-hover:translate-x-1"
                          style={{ color: "#6366f1" }}
                        >
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View all button */}
                <div className="mt-6 text-center">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                    style={{
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.22)",
                      color: "#818cf8",
                    }}
                  >
                    Ver todos los artículos →
                  </Link>
                </div>
              </div>
            </section>

        {/* ══════════════════════════════════════════════════════════════════
            SEO CONTENT BLOCK
        ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full">
          <SeoSectionDivider />

          {/* ── Sección 1: Cómo calcular ── */}
          <section className="px-4 py-14 md:py-16">
            <div className="max-w-4xl mx-auto">
              <SeoH2 icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="2" y="2" width="7" height="5" rx="1.5" fill="#818cf8" opacity="0.9"/>
                  <rect x="11" y="2" width="7" height="5" rx="1.5" fill="#818cf8" opacity="0.45"/>
                  <rect x="2" y="9" width="7" height="3.5" rx="1.5" fill="#818cf8" opacity="0.45"/>
                  <rect x="11" y="9" width="7" height="3.5" rx="1.5" fill="#818cf8" opacity="0.45"/>
                  <rect x="2" y="14.5" width="7" height="3.5" rx="1.5" fill="#818cf8" opacity="0.45"/>
                  <rect x="11" y="14.5" width="7" height="3.5" rx="1.5" fill="#818cf8" opacity="0.9"/>
                </svg>
              }>
                ¿Cómo calcular tu salario neto en España en 2026?
              </SeoH2>

              <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#c0c0d8" }}>
                <p>
                  El <strong style={{ color: "#e0e0ff" }}>salario bruto</strong> es la cantidad total que figura en tu contrato antes de cualquier descuento. El <strong style={{ color: "#e0e0ff" }}>salario neto</strong> es lo que realmente ingresas en tu cuenta bancaria cada mes, después de que tu empresa retenga dos conceptos obligatorios: las cotizaciones a la Seguridad Social y la retención del IRPF.
                </p>
                <p>
                  Las <strong style={{ color: "#e0e0ff" }}>cotizaciones a la Seguridad Social</strong> del trabajador suponen un 6,50% del salario bruto y son iguales en toda España. Son independientes de tu situación personal: las paga cualquier asalariado en la misma proporción.
                </p>
                <p>
                  La <strong style={{ color: "#e0e0ff" }}>retención del IRPF</strong> es más compleja. Se calcula sobre la base imponible (bruto menos SS y mínimos personales) y depende de los tramos estatales más los tramos autonómicos. Por eso el mismo salario bruto genera distinto neto en Madrid que en Cataluña o Galicia. Además, tu situación familiar —si tienes hijos, si estás casado o eres monoparental— puede reducir significativamente la retención.
                </p>

                {/* CTA box */}
                <div
                  className="rounded-xl px-5 py-4 flex gap-3 items-start"
                  style={{
                    background: "rgba(99,102,241,0.08)",
                    borderLeft: "3px solid rgba(99,102,241,0.6)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderLeftWidth: "3px",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M9 2L11.5 7H16.5L12.5 10.5L14 16L9 13L4 16L5.5 10.5L1.5 7H6.5L9 2Z" fill="#818cf8" opacity="0.9"/>
                  </svg>
                  <p className="text-sm leading-relaxed" style={{ color: "#b0b0d8" }}>
                    El proceso manual implica calcular la base de cotización, aplicar cada tramo de la escala estatal y autonómica, restar los mínimos personales y familiares, y dividir entre 12 o 14 pagas.{" "}
                    <strong style={{ color: "#a5b4fc" }}>
                      Usa la calculadora de nómina de arriba para obtener tu resultado exacto en segundos, con los datos oficiales de la AEAT 2026.
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <SeoSectionDivider />

          {/* ── Sección 2: Seguridad Social ── */}
          <section className="px-4 py-14 md:py-16" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="max-w-4xl mx-auto">
              <SeoH2 icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 2L3 6V10C3 13.9 6.1 17.5 10 18.5C13.9 17.5 17 13.9 17 10V6L10 2Z" fill="#818cf8" opacity="0.7"/>
                  <path d="M7 10L9 12L13 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }>
                Cotizaciones a la Seguridad Social 2026
              </SeoH2>

              <p className="text-base leading-relaxed mb-5" style={{ color: "#c0c0d8" }}>
                La cotización del trabajador a la Seguridad Social se divide en cuatro conceptos. El tipo total es del <strong style={{ color: "#e0e0ff" }}>6,50%</strong> sobre el salario bruto y es uniforme en todo el territorio español.
              </p>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
                style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", color: "#34d399" }}>
                <span>✓</span> Igual en todas las comunidades autónomas
              </div>

              <div className="overflow-x-auto rounded-xl mb-5" style={{ border: "1px solid rgba(99,102,241,0.18)" }}>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr><SeoTh>Concepto</SeoTh><SeoTh>Tipo trabajador</SeoTh></tr>
                  </thead>
                  <tbody>
                    <tr><SeoTd>Contingencias comunes</SeoTd><SeoTd>4,70%</SeoTd></tr>
                    <tr><SeoTd>Desempleo (contrato indefinido)</SeoTd><SeoTd>1,55%</SeoTd></tr>
                    <tr><SeoTd>Formación Profesional</SeoTd><SeoTd>0,10%</SeoTd></tr>
                    <tr><SeoTd>Mecanismo de Equidad Intergeneracional (MEI)</SeoTd><SeoTd>0,15%</SeoTd></tr>
                    <tr style={{ background: "rgba(99,102,241,0.15)" }}>
                      <td className="px-4 py-3 text-sm font-bold" style={{ color: "#f0f0ff", borderBottom: "none" }}>Total trabajador</td>
                      <td className="px-4 py-3 text-sm font-bold" style={{ color: "#f0f0ff", borderBottom: "none" }}>6,50%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm leading-relaxed" style={{ color: "#8080a8" }}>
                Además, la empresa cotiza por separado: contingencias comunes (23,60%), desempleo (5,50%), FOGASA (0,20%) y FP (0,60%). Esto eleva el coste real del empleado en aproximadamente un <strong style={{ color: "#a0a0c0" }}>29,90% adicional</strong> sobre el bruto.
              </p>
            </div>
          </section>

          <SeoSectionDivider />

          {/* ── Sección 3: Tramos IRPF ── */}
          <section className="px-4 py-14 md:py-16">
            <div className="max-w-4xl mx-auto">
              <SeoH2 icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="2" y="13" width="3" height="5" rx="1" fill="#34d399" opacity="0.9"/>
                  <rect x="6.5" y="10" width="3" height="8" rx="1" fill="#818cf8" opacity="0.7"/>
                  <rect x="11" y="7" width="3" height="11" rx="1" fill="#a78bfa" opacity="0.7"/>
                  <rect x="15.5" y="3" width="3" height="15" rx="1" fill="#f87171" opacity="0.7"/>
                </svg>
              }>
                Tramos del IRPF 2026 en España
              </SeoH2>

              <p className="text-base leading-relaxed mb-6" style={{ color: "#c0c0d8" }}>
                El <strong style={{ color: "#e0e0ff" }}>IRPF es un impuesto progresivo</strong>: cuanto más cobras, mayor es el porcentaje que tributa cada euro adicional. Los tramos que se muestran son los estatales; a ellos se suma el tramo autonómico de cada comunidad.
              </p>

              <div className="overflow-x-auto rounded-xl mb-4" style={{ border: "1px solid rgba(99,102,241,0.18)" }}>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <SeoTh>Base liquidable</SeoTh>
                      <SeoTh>Tipo estatal</SeoTh>
                      <SeoTh>Progresión</SeoTh>
                    </tr>
                  </thead>
                  <tbody>
                    {IRPF_TRAMOS.map((row, i) => (
                      <tr key={i}>
                        <SeoTd>{row.rango}</SeoTd>
                        <td className="px-4 py-3 text-sm font-bold tabnum" style={{ color: row.color, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          {row.tipo}
                        </td>
                        <td className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", minWidth: 100 }}>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, background: "rgba(255,255,255,0.06)" }}>
                              <div style={{ width: `${row.bar}%`, height: "100%", background: row.color, borderRadius: 9999, opacity: 0.75 }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Nota destacada */}
              <div
                className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}
              >
                <span style={{ color: "#f87171", flexShrink: 0, fontSize: "1rem" }}>ℹ</span>
                <p className="text-sm leading-relaxed" style={{ color: "#b08080" }}>
                  <strong style={{ color: "#f0c0c0" }}>El tipo efectivo real es siempre menor que el marginal.</strong>{" "}
                  Para un salario de 30.000€ el tipo marginal es el 15%, pero el tipo efectivo total ronda el 17–18% combinando tramos estatales y autonómicos, tras aplicar los mínimos personales.
                </p>
              </div>
            </div>
          </section>

          <SeoSectionDivider />

          {/* ── Sección 4: Tabla de salarios ── */}
          <section className="px-4 py-14 md:py-16" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="max-w-4xl mx-auto">
              <SeoH2 icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="8" stroke="#818cf8" strokeWidth="1.5" opacity="0.6"/>
                  <path d="M10 6V10L13 12" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              }>
                ¿Cuánto cobras neto según tu salario bruto?
              </SeoH2>

              <p className="text-base leading-relaxed mb-6" style={{ color: "#c0c0d8" }}>
                Referencia rápida para los salarios más consultados en España. Datos para Madrid, soltero/a sin hijos, contrato indefinido y 12 pagas en 2026.
              </p>

              <div className="overflow-x-auto rounded-xl mb-4" style={{ border: "1px solid rgba(99,102,241,0.18)" }}>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <SeoTh>Salario bruto anual</SeoTh>
                      <SeoTh>Neto mensual (Madrid)</SeoTh>
                      <SeoTh>Desglose</SeoTh>
                    </tr>
                  </thead>
                  <tbody>
                    {SEO_SALARY_TABLE.map((row) => (
                      <tr key={row.slug} className="seo-salary-row">
                        <SeoTd highlight>{row.bruto}</SeoTd>
                        <td className="px-4 py-3 text-sm font-bold tabnum" style={{ color: row.color, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          {row.neto}
                        </td>
                        <td className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <Link
                            href={`/cuanto-es-${row.slug}-euros-brutos-neto`}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 seo-table-link"
                            style={{ border: `1px solid ${row.color}40`, background: `${row.color}12`, color: row.color }}
                          >
                            Ver desglose →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <SeoSectionDivider />

          {/* ── Sección 5: CCAA ── */}
          <section className="px-4 py-14 md:py-16">
            <div className="max-w-4xl mx-auto">
              <SeoH2 icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 2C7.2 2 5 4.2 5 7C5 11 10 18 10 18C10 18 15 11 15 7C15 4.2 12.8 2 10 2Z" fill="#818cf8" opacity="0.7"/>
                  <circle cx="10" cy="7" r="2" fill="white" opacity="0.9"/>
                </svg>
              }>
                ¿Por qué varía el neto según la comunidad autónoma?
              </SeoH2>

              {/* Mini-cards CCAA */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {CCAA_MINI_CARDS.map((c) => (
                  <div
                    key={c.label}
                    className="rounded-xl p-4 flex flex-col gap-2"
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{c.emoji}</span>
                      <span className="text-sm font-semibold" style={{ color: "#d0d0f0" }}>{c.label}</span>
                    </div>
                    <div className="font-syne font-extrabold text-xl" style={{ color: c.color }}>{c.neto}</div>
                    <div className="text-xs" style={{ color: "#6060a0" }}>{c.delta}</div>
                  </div>
                ))}
              </div>

              {/* Tabla CCAA para 30.000€ */}
              <div className="overflow-x-auto rounded-xl mb-6" style={{ border: "1px solid rgba(99,102,241,0.18)" }}>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <SeoTh>Comunidad autónoma</SeoTh>
                      <SeoTh>Neto mensual (30.000 €)</SeoTh>
                      <SeoTh>IRPF ef.</SeoTh>
                    </tr>
                  </thead>
                  <tbody>
                    {d30.ccaaTable.map((row, i) => {
                      const highlight = i === 0;
                      const label = highlight ? `${row.ccaa} ★` : row.ccaa;
                      return (
                        <tr key={row.ccaa} style={{ background: highlight ? "rgba(99,102,241,0.05)" : "transparent" }}>
                          <SeoTd highlight={highlight}>{label}</SeoTd>
                          <td className="px-4 py-3 text-sm font-semibold" style={{ color: highlight ? "#34d399" : "#a0c0a0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{fmt(row.neto)} €</td>
                          <SeoTd>{row.irpf}</SeoTd>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mb-6 flex items-center gap-1.5" style={{ color: "#6060a0" }}>
                <span style={{ color: "#818cf8" }}>→</span>
                Selecciona tu comunidad en la calculadora para ver tu resultado exacto
              </p>

              <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#c0c0d8" }}>
                <p>
                  El IRPF en España se divide en dos mitades: una parte estatal, igual para todos los contribuyentes, y una parte autonómica, que cada comunidad fija de forma independiente. Esto significa que dos personas con exactamente el mismo salario bruto y la misma situación familiar pueden recibir netos distintos dependiendo de dónde vivan.
                </p>
                <p>
                  <strong style={{ color: "#e0e0ff" }}>Madrid tiene los tipos autonómicos más bajos del régimen común</strong>, con bonificaciones que reducen significativamente la presión fiscal. En el extremo opuesto, <strong style={{ color: "#e0e0ff" }}>Cataluña aplica los tipos más altos</strong>, especialmente a partir de 33.007€. Valencia se sitúa en una posición intermedia pero con tramos relevantes desde los 27.000€.
                </p>
                <p>
                  Con <strong style={{ color: "#e0e0ff" }}>30.000€ brutos anuales</strong>, la diferencia entre vivir en Madrid o Cataluña es de <strong style={{ color: "#34d399" }}>{fmt((d30Mad.neto - d30Cat.neto) * 12)}€ al año</strong> — simplemente por la comunidad de residencia.
                </p>

                {/* CTA box */}
                <div
                  className="rounded-xl px-5 py-4 flex gap-3 items-start mt-2"
                  style={{
                    background: "rgba(99,102,241,0.08)",
                    borderLeft: "3px solid rgba(99,102,241,0.6)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderLeftWidth: "3px",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="9" cy="9" r="7" stroke="#818cf8" strokeWidth="1.5" opacity="0.8"/>
                    <path d="M9 8V13M9 6h.01" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="text-sm leading-relaxed" style={{ color: "#b0b0d8" }}>
                    <strong style={{ color: "#a5b4fc" }}>Selecciona tu comunidad autónoma en la calculadora</strong>{" "}
                    para ver tu resultado exacto con los tramos autonómicos del IRPF 2026 aplicados.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <SeoSectionDivider />

          {/* ── Sección 6: FAQ ── */}
          <section className="px-4 py-14 md:py-16" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="max-w-4xl mx-auto">
              <SeoH2 icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="8" stroke="#818cf8" strokeWidth="1.5" opacity="0.6"/>
                  <path d="M8 8C8 6.9 8.9 6 10 6C11.1 6 12 6.9 12 8C12 9 11 9.5 10 10.5V11.5" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="10" cy="14" r="0.75" fill="#818cf8"/>
                </svg>
              }>
                Preguntas frecuentes sobre el cálculo de nóminas
              </SeoH2>

              <SeoFaqAccordion />
            </div>
          </section>

        </div>
        {/* ══════════════════════════════════════════════════════════════════ */}

        <SiteFooter year={currentYear} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Calculadora de Nómina 2026",
            "url": "https://calculadoranomina.org",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "description": "Calculadora de salario bruto a neto con IRPF y Seguridad Social 2026. Calcula tu nómina exacta por comunidad autónoma y situación familiar.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "inLanguage": "es-ES",
            "author": {
              "@type": "Person",
              "name": "Alex Cebolla Pardo"
            }
          })
        }}
      />
    </main>
  );
}
