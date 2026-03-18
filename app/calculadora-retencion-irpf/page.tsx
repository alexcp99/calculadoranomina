import type { Metadata } from "next";
import Link from "next/link";
import RetencionCalculator from "@/components/RetencionCalculator";
import SiteFooter from "@/components/SiteFooter";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Calculadora Retención IRPF 2026 | Calcula tu % en segundos — Gratis",
  description:
    "Calcula el porcentaje de retención IRPF que te aplican en la nómina en 2026. Datos oficiales AEAT, tramos actualizados, situación familiar y 19 CCAA. Gratis.",
  alternates: { canonical: "https://calculadoranomina.org/calculadora-retencion-irpf" },
  openGraph: {
    title: "Calculadora Retención IRPF 2026 | Calcula tu % en segundos — Gratis",
    description:
      "Calcula el porcentaje de retención IRPF que te aplican en la nómina en 2026. Datos oficiales AEAT, tramos actualizados, situación familiar y 19 CCAA. Gratis.",
    url: "https://calculadoranomina.org/calculadora-retencion-irpf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora Retención IRPF 2026 | Calcula tu % en segundos",
    description:
      "Calcula el porcentaje de retención IRPF que te aplican en la nómina en 2026. Datos oficiales AEAT, 19 CCAA.",
  },
};

// ─── JSON-LD schemas ───────────────────────────────────────────────────────────

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio",       item: "https://calculadoranomina.org" },
    { "@type": "ListItem", position: 2, name: "Calculadoras", item: "https://calculadoranomina.org" },
    { "@type": "ListItem", position: 3, name: "Retención IRPF", item: "https://calculadoranomina.org/calculadora-retencion-irpf" },
  ],
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es la retención IRPF en la nómina?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La retención del IRPF es el porcentaje que tu empresa descuenta de tu nómina cada mes como anticipo del impuesto sobre la renta. Al hacer la declaración anual, Hacienda regulariza la diferencia: si retuvieron de más, te devuelven; si retuvieron de menos, debes pagar la diferencia.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo se calcula el porcentaje de retención IRPF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El porcentaje de retención se calcula restando al salario bruto las cotizaciones a la Seguridad Social, los gastos deducibles del Art. 19 LIRPF (2.000 €) y los mínimos personales y familiares. El resultado es la base de retención. Se aplica la escala progresiva estatal y autonómica y el resultado se divide entre el salario bruto. Sigue el algoritmo oficial de la AEAT (Arts. 82-87 RIRPF).",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo pedir a mi empresa que cambie mi retención IRPF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Puedes entregar a tu empresa el Modelo 145 actualizado cuando cambie tu situación personal o familiar: matrimonio, nacimiento de un hijo, divorcio, reconocimiento de discapacidad o pareja sin ingresos. Cada cambio puede suponer entre 30 y 100 € más de neto mensual.",
      },
    },
    {
      "@type": "Question",
      name: "¿La retención IRPF tiene un mínimo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. El tipo mínimo de retención es del 2% para contratos de duración determinada (temporales) y del 15% para algunas actividades económicas. Para contratos indefinidos, si el resultado del cálculo es negativo o inferior al mínimo, se aplica el 2% como suelo mínimo de retención.",
      },
    },
    {
      "@type": "Question",
      name: "¿La retención IRPF es igual en todas las comunidades autónomas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. El IRPF tiene una parte estatal (igual en toda España) y una parte autonómica que cada comunidad fija libremente. Madrid y el País Vasco suelen tener los tipos autonómicos más bajos, mientras que Cataluña y Valencia aplican tipos más altos, especialmente a partir de 30.000 € anuales.",
      },
    },
  ],
};

// ─── Static data (defined before return to avoid build issues) ─────────────────

const QUICK_REF = [
  { salary: "20.000 €", pct: "9,8%",  color: "#34d399", bg: "rgba(52,211,153,0.08)"  },
  { salary: "30.000 €", pct: "17,7%", color: "#818cf8", bg: "rgba(99,102,241,0.10)"  },
  { salary: "40.000 €", pct: "22,1%", color: "#a78bfa", bg: "rgba(167,139,250,0.10)" },
  { salary: "50.000 €", pct: "25,1%", color: "#f87171", bg: "rgba(248,113,113,0.08)" },
];

const FEATURE_CHIPS = [
  { icon: "🗺️", text: "19 Comunidades Autónomas" },
  { icon: "👨‍👩‍👦", text: "Situación familiar"       },
  { icon: "♿",  text: "Discapacidad y edad"       },
  { icon: "📋", text: "Datos AEAT 2026"            },
];

const IRPF_TRAMOS = [
  { tramo: "1º", desde: "0 €",        hasta: "12.450 €",   tipo: "19%", bar: 40,  color: "#34d399" },
  { tramo: "2º", desde: "12.450 €",   hasta: "20.200 €",   tipo: "24%", bar: 51,  color: "#6ee7b7" },
  { tramo: "3º", desde: "20.200 €",   hasta: "35.200 €",   tipo: "30%", bar: 64,  color: "#818cf8" },
  { tramo: "4º", desde: "35.200 €",   hasta: "60.000 €",   tipo: "37%", bar: 79,  color: "#a78bfa" },
  { tramo: "5º", desde: "60.000 €",   hasta: "300.000 €",  tipo: "45%", bar: 96,  color: "#f87171" },
  { tramo: "6º", desde: "+300.000 €", hasta: "Sin límite",  tipo: "47%", bar: 100, color: "#ef4444" },
];

const SALARY_TABLE = [
  { bruto: "15.000 €", retencion: "40 €/mes",    tipo: "3,2%"  },
  { bruto: "20.000 €", retencion: "163 €/mes",   tipo: "9,8%"  },
  { bruto: "25.000 €", retencion: "262 €/mes",   tipo: "12,6%" },
  { bruto: "30.000 €", retencion: "443 €/mes",   tipo: "17,7%" },
  { bruto: "40.000 €", retencion: "737 €/mes",   tipo: "22,1%" },
  { bruto: "50.000 €", retencion: "1.046 €/mes", tipo: "25,1%" },
];

const CALC_STEPS = [
  {
    n: 1,
    text: "Bruto − Cotizaciones SS (6,50% contingencias + 1,55% desempleo + 0,10% FP + 0,15% MEI)",
    result: "= Rendimiento íntegro del trabajo",
  },
  {
    n: 2,
    text: "− Gastos deducibles Art. 19 LIRPF (2.000 € fijos, hasta 5.565 € con movilidad geográfica)",
    result: "= Rendimiento neto del trabajo",
  },
  {
    n: 3,
    text: "− Reducción Art. 20 (hasta 7.302 € para rentas ≤ 19.747,50 €, proporcional hasta 32.247,50 €)",
    result: "= Rendimiento neto reducido",
  },
  {
    n: 4,
    text: "− Mínimo personal (5.550 €, +1.150 € si ≥ 65 años) y mínimo familiar (2.400 € primer hijo…)",
    result: "= Base de retención IRPF",
  },
  {
    n: 5,
    text: "Escala progresiva estatal + autonómica de tu CCAA aplicada sobre la base de retención",
    result: "= Cuota íntegra anual",
  },
  {
    n: 6,
    text: "Cuota íntegra anual ÷ Salario bruto anual × 100",
    result: "= Tipo de retención aplicable (%)",
  },
];

const DOS_PAGADORES_ITEMS = [
  {
    label: "Pagador A",
    detail: "18.000 € · retención 12%",
    value: "2.160 €/año retenidos",
    color: "#818cf8",
  },
  {
    label: "Pagador B",
    detail: "10.000 € · retención 10%",
    value: "1.000 €/año retenidos",
    color: "#a78bfa",
  },
  {
    label: "Resultado en renta",
    detail: "Total 28.000 € · IRPF real ≈ 4.500 €",
    value: "A pagar: ~1.340 €",
    color: "#f87171",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalculadoraRetencionPage() {
  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.12) 0%, transparent 65%)" }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Header ── */}
        <header className="px-4 pt-8 pb-6 md:pt-12 md:pb-8">
          <div className="max-w-4xl mx-auto">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#4a4a6a" }} aria-label="Breadcrumb">
              <Link href="/" className="hover:underline" style={{ color: "#818cf8" }}>Inicio</Link>
              <span>/</span>
              <Link href="/" className="hover:underline" style={{ color: "#818cf8" }}>Calculadoras</Link>
              <span>/</span>
              <span style={{ color: "#7c7ca0" }}>Retención IRPF</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.22)", color: "#818cf8" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }} />
              Datos AEAT 2026 · 19 comunidades autónomas
            </div>

            <h1
              className="font-syne font-extrabold tracking-tight leading-snug mb-3"
              style={{ fontSize: "clamp(1.5rem, 5vw, 2.6rem)", color: "#f0f0ff" }}
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
                Retención IRPF 2026
              </span>
            </h1>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: "#7c7ca0" }}>
              Descubre qué porcentaje te retiene Hacienda según tu salario, situación familiar y comunidad autónoma. Datos oficiales AEAT 2026.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2 mt-5">
              {FEATURE_CHIPS.map(({ icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#9090b8" }}
                >
                  <span>{icon}</span>
                  {text}
                </span>
              ))}
            </div>

            {/* Quick reference examples */}
            <div className="mt-5">
              <p className="text-xs font-medium mb-2" style={{ color: "#4a4a6a" }}>
                Ejemplos orientativos · Madrid · soltero/a · indefinido
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_REF.map(({ salary, pct, color, bg }) => (
                  <div
                    key={salary}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                    style={{ background: bg, border: `1px solid ${color}30` }}
                  >
                    <span className="text-sm font-medium" style={{ color: "#b0b0c8" }}>{salary}</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <path d="M2 5h6M6 3l2 2-2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-syne font-bold tabnum text-base leading-none" style={{ color }}>{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ── Calculator ── */}
        <section className="px-4 pb-14">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg,#4f52d4,#6366f1)", boxShadow: "0 0 0 1px rgba(99,102,241,0.3)" }}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="8" cy="8" r="6.5" />
                  <path d="M5.5 10.5l5-5M6 6h.01M10 10h.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#e0e0ff" }}>Calculadora interactiva</p>
                <p className="text-xs" style={{ color: "#5a5a80" }}>Introduce tu salario y personaliza según tu situación</p>
              </div>
            </div>
            <RetencionCalculator />
          </div>
        </section>

        {/* ── C: Tabla tramos IRPF 2026 ── */}
        <section className="px-4 pb-12 md:pb-14" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-3xl mx-auto pt-10 md:pt-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md text-xs font-bold" style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>%</span>
              <h2 className="font-syne font-bold" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                Tramos del IRPF 2026
              </h2>
            </div>
            <p className="text-sm mb-6" style={{ color: "#7c7ca0" }}>
              Escala general estatal + autonómica (tipo consolidado orientativo)
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
              <div
                className="grid grid-cols-4 px-4 py-2.5"
                style={{ background: "rgba(99,102,241,0.18)", borderBottom: "1px solid rgba(99,102,241,0.2)" }}
              >
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9090c8" }}>Tramo</span>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9090c8" }}>Desde</span>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9090c8" }}>Hasta</span>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9090c8" }}>Tipo</span>
              </div>
              {IRPF_TRAMOS.map((t, i) => (
                <div
                  key={t.tramo}
                  className="grid grid-cols-4 px-4 py-3 items-center"
                  style={{
                    borderBottom: i < IRPF_TRAMOS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    background: "rgba(13,13,26,0.6)",
                  }}
                >
                  <span className="text-sm font-semibold" style={{ color: "#a0a0c0" }}>{t.tramo}</span>
                  <span className="text-sm tabnum" style={{ color: "#7c7ca0" }}>{t.desde}</span>
                  <span className="text-sm tabnum" style={{ color: "#7c7ca0" }}>{t.hasta}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tabnum" style={{ color: t.color }}>{t.tipo}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden hidden sm:block" style={{ background: "rgba(255,255,255,0.06)", maxWidth: 60 }}>
                      <div style={{ width: `${t.bar}%`, height: "100%", background: t.color, borderRadius: 9999 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: "#4a4a6a" }}>
              Escala estatal (50%) + media autonómica orientativa. El tipo final depende de tu CCAA — usa la calculadora para el dato exacto.
            </p>
          </div>
        </section>

        {/* ── D: Dos pagadores ── */}
        <section className="px-4 pb-12 md:pb-14" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-3xl mx-auto pt-10 md:pt-12">
            <div
              className="rounded-2xl p-5 md:p-6"
              style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.22)" }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.25)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#f87171" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2L14 13H2L8 2z" />
                    <path d="M8 6v3.5M8 11.5v.5" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-syne font-bold text-base leading-snug" style={{ color: "#f0f0ff" }}>
                    ¿Tienes dos empleos o pagadores? Cuidado con la renta
                  </h2>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: "#8080a8" }}>
                    Cuando trabajas para dos empresas en el mismo año, cada una calcula tu retención por separado, sin saber lo que la otra retiene. Resultado: el tipo aplicado sobre cada salario es más bajo del que correspondería por el total combinado, y la declaración de la renta suele salir <strong style={{ color: "#f0f0ff" }}>a pagar</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {DOS_PAGADORES_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl p-3.5"
                    style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${item.color}30` }}
                  >
                    <p className="text-xs font-semibold mb-1" style={{ color: item.color }}>{item.label}</p>
                    <p className="text-xs mb-1.5 leading-relaxed" style={{ color: "#6060a0" }}>{item.detail}</p>
                    <p className="text-sm font-bold tabnum" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs leading-relaxed" style={{ color: "#6060a0" }}>
                En este ejemplo, cada empresa retiene correctamente según su parte, pero el IRPF real sobre 28.000 € es mayor que la suma de retenciones individuales. La diferencia sale a pagar en la declaración de la renta.
              </p>
              <p className="text-xs mt-3 font-medium" style={{ color: "#818cf8" }}>
                → Revisa tu retención con la calculadora de arriba para evitar sorpresas en la declaración.
              </p>
            </div>
          </div>
        </section>

        {/* ── E: Cómo calculamos (compact) ── */}
        <section className="px-4 pb-12 md:pb-14" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-3xl mx-auto pt-10 md:pt-12">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md text-xs font-bold" style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>∑</span>
              <h2 className="font-syne font-bold" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                Cómo calculamos la retención
              </h2>
            </div>
            <p className="text-sm mb-6" style={{ color: "#7c7ca0" }}>
              Procedimiento oficial AEAT (Arts. 82–87 RIRPF):
            </p>
            <ol className="flex flex-col gap-3">
              {CALC_STEPS.map(({ n, text, result }) => (
                <li key={n} className="flex gap-3.5 items-start">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.35)", color: "#a5b4fc" }}
                  >
                    {n}
                  </div>
                  <div>
                    <p className="text-sm leading-snug" style={{ color: "#b0b0c8" }}>{text}</p>
                    <p className="text-xs mt-0.5 font-semibold" style={{ color: "#6366f1" }}>{result}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div
              className="mt-6 rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#818cf8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="8" cy="8" r="6.5" /><path d="M8 7v4M8 5.5v.5" />
              </svg>
              <p className="text-xs leading-relaxed" style={{ color: "#7070a8" }}>
                Fuente:{" "}
                <a href="https://www.agenciatributaria.es" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#818cf8" }}>
                  AEAT — Agencia Estatal de Administración Tributaria
                </a>
                {" "}· Reglamento IRPF Arts. 82–87 · Datos 2026.
              </p>
            </div>
          </div>
        </section>

        {/* ══ SEO Content ══ */}
        <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>

          {/* Sección 1 — ¿Qué es la retención IRPF? */}
          <section className="px-4 py-14 md:py-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-syne font-bold mb-5" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                ¿Qué es la retención del IRPF?
              </h2>
              <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: "#c0c0d8" }}>
                <p>
                  La <strong style={{ color: "#e0e0ff" }}>retención del IRPF</strong> es el porcentaje que tu empresa descuenta de tu nómina cada mes y lo ingresa directamente a Hacienda en tu nombre. No es un pago adicional — es un anticipo del impuesto sobre la renta que pagarás al final del año. En la declaración de la renta se regulariza: si retuvieron más de lo que corresponde, Hacienda te devuelve la diferencia; si retuvieron menos, deberás pagar el resto.
                </p>
                <p>
                  El porcentaje no es fijo ni igual para todos. Se calcula aplicando la escala progresiva del IRPF sobre tu <strong style={{ color: "#e0e0ff" }}>base de retención</strong>, que se obtiene restando al salario bruto las cotizaciones a la Seguridad Social, los gastos deducibles del Art. 19 LIRPF (2.000 € fijos) y los mínimos personales y familiares que te corresponden.
                </p>
                <p>
                  El resultado varía significativamente según la <strong style={{ color: "#e0e0ff" }}>comunidad autónoma</strong>: el IRPF tiene una parte estatal (igual en toda España) y una parte autonómica que cada región fija libremente. Madrid aplica los tipos autonómicos más bajos; Cataluña y Valencia, los más altos. Para un salario de 30.000€, la diferencia entre Madrid y Cataluña puede ser de más de <strong style={{ color: "#e0e0ff" }}>55 € al mes</strong> en retención.
                </p>
                <p>
                  Tu <strong style={{ color: "#e0e0ff" }}>situación familiar</strong> también reduce la retención: tener hijos menores de 25 años, una pareja sin ingresos o una discapacidad reconocida amplía los mínimos que se restan de la base imponible, lo que reduce el tipo aplicable.
                </p>
              </div>
            </div>
          </section>

          <div className="seo-divider" />

          {/* Sección 2 — Tabla retenciones por salario */}
          <section className="px-4 py-14 md:py-16" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-syne font-bold mb-2" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                Tabla de retenciones IRPF por salario 2026
              </h2>
              <p className="text-sm mb-6" style={{ color: "#7c7ca0" }}>
                Madrid · Soltero/a sin hijos · Contrato indefinido · 12 pagas
              </p>
              <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(99,102,241,0.18)" }}>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ background: "rgba(99,102,241,0.15)", color: "#9090c8", borderBottom: "1px solid rgba(99,102,241,0.2)" }}>Salario bruto anual</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ background: "rgba(99,102,241,0.15)", color: "#9090c8", borderBottom: "1px solid rgba(99,102,241,0.2)" }}>Retención IRPF</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ background: "rgba(99,102,241,0.15)", color: "#9090c8", borderBottom: "1px solid rgba(99,102,241,0.2)" }}>Tipo efectivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SALARY_TABLE.map((row) => (
                      <tr key={row.bruto} className="seo-salary-row">
                        <td className="px-4 py-3 font-semibold" style={{ color: "#e0e0ff",  borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{row.bruto}</td>
                        <td className="px-4 py-3 font-bold"    style={{ color: "#f87171",  borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{row.retencion}</td>
                        <td className="px-4 py-3 font-semibold" style={{ color: "#818cf8",  borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{row.tipo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: "#4a4a6a" }}>
                Usa la calculadora de arriba para obtener el dato exacto con tu comunidad autónoma y situación familiar.
              </p>
            </div>
          </section>

          <div className="seo-divider" />

          {/* Sección 3 — Modelo 145 */}
          <section className="px-4 py-14 md:py-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-syne font-bold mb-5" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                ¿Cómo cambiar tu retención? El Modelo 145
              </h2>
              <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: "#c0c0d8" }}>
                <p>
                  El <strong style={{ color: "#e0e0ff" }}>Modelo 145</strong> (Comunicación de datos al pagador) es el formulario oficial que entregas a tu empresa para que conozca tu situación personal y familiar y ajuste la retención mensual. Sin él, la empresa calcula la retención asumiendo que eres soltero/a sin hijos — el supuesto más conservador y generalmente el que genera mayor retención.
                </p>
                <p>
                  Debes actualizar el Modelo 145 cuando cambie tu situación: si tienes un hijo, si te casas, si te divorcias, si tu cónyuge pasa de tener ingresos a no tenerlos, o si se reconoce una discapacidad. Cada cambio puede traducirse en <strong style={{ color: "#e0e0ff" }}>30–100 € más al mes en neto</strong> si reduces la retención.
                </p>
                <p>
                  También puedes hacer lo contrario: pedir voluntariamente una <strong style={{ color: "#e0e0ff" }}>retención mayor</strong> a la que calcularía tu empresa. Esto es especialmente útil si tienes dos pagadores (cambio de trabajo durante el año), ingresos de alquiler u otras fuentes, o si quieres asegurarte de que la declaración de la renta no te salga a pagar.
                </p>
                <div
                  className="rounded-xl px-5 py-4"
                  style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
                >
                  <p className="text-sm font-semibold mb-1" style={{ color: "#a5b4fc" }}>¿Tienes dos pagadores?</p>
                  <p className="text-sm" style={{ color: "#8080a8" }}>
                    Si has cambiado de trabajo en el año, el límite para declarar baja a 15.876 € y es muy probable que la renta te salga a pagar. Comunica a tu nueva empresa los ingresos del empleador anterior mediante el Modelo 145 para que ajuste la retención.{" "}
                    <Link href="/blog/irpf-dos-pagadores-2026" className="underline" style={{ color: "#818cf8" }}>
                      Más sobre dos pagadores →
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="seo-divider" />

          {/* FAQ */}
          <section className="px-4 py-14 md:py-16" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-syne font-bold mb-6" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                Preguntas frecuentes sobre la retención IRPF
              </h2>
              <div className="flex flex-col gap-4">
                {FAQ_JSON_LD.mainEntity.map((item, i) => (
                  <div key={i} className="rounded-xl p-4 md:p-5" style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)" }}>
                    <p className="font-semibold text-sm mb-2" style={{ color: "#c0c0e0" }}>{item.name}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "#8080a8" }}>{item.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="px-4 py-10">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm mb-4" style={{ color: "#7c7ca0" }}>
                ¿Quieres ver el desglose completo de tu nómina — IRPF, Seguridad Social y neto mensual?
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "#fff", boxShadow: "0 2px 14px rgba(99,102,241,0.35)" }}
              >
                Ir a la calculadora de nómina completa →
              </Link>
            </div>
          </section>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
