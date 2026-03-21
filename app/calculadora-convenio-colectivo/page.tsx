import type { Metadata } from "next";
import Link from "next/link";
import ConvenioCalculator from "@/components/convenio/ConvenioCalculator";
import SiteFooter from "@/components/SiteFooter";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Calculadora Salario por Convenio Colectivo 2026 | ¿Cobras lo que te corresponde?",
  description:
    "Comprueba si tu salario cumple con el convenio colectivo de tu sector. Hostelería, comercio, construcción, metal y más. Calcula tu neto real 2026.",
  alternates: { canonical: "https://calculadoranomina.org/calculadora-convenio-colectivo" },
  openGraph: {
    title: "Calculadora Convenio Colectivo 2026 — ¿Cobras lo que te corresponde?",
    description:
      "Comprueba si tu empresa cumple con el convenio colectivo de tu sector. 8 sectores, categorías reales y cálculo de neto con IRPF 2026.",
    url: "https://calculadoranomina.org/calculadora-convenio-colectivo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "¿Cobras lo que marca el convenio? Compruébalo ahora",
    description:
      "Hostelería, comercio, construcción, metal y más. Calcula el salario mínimo de tu convenio y tu neto real 2026.",
  },
};

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio",       item: "https://calculadoranomina.org" },
    { "@type": "ListItem", position: 2, name: "Calculadoras", item: "https://calculadoranomina.org" },
    { "@type": "ListItem", position: 3, name: "Convenio colectivo", item: "https://calculadoranomina.org/calculadora-convenio-colectivo" },
  ],
};

const WEBAPP_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora Salario por Convenio Colectivo 2026",
  url: "https://calculadoranomina.org/calculadora-convenio-colectivo",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  inLanguage: "es-ES",
  description:
    "Comprueba si tu salario cumple con el convenio colectivo de tu sector en España. Hostelería, comercio, construcción, metal, limpieza, transporte, sanidad privada y oficinas.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es un convenio colectivo y cómo afecta a mi salario?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un convenio colectivo es un acuerdo negociado entre sindicatos y empresarios que establece las condiciones mínimas de trabajo en un sector o empresa: salario mínimo por categoría, jornada, vacaciones y otros derechos. Tu empresa está obligada por ley a pagarte al menos lo que marca el convenio aplicable. Si tu salario es inferior, puede reclamar la diferencia con efectos retroactivos de hasta 4 años.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puede mi empresa pagarme menos que el convenio colectivo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. El convenio colectivo establece el suelo salarial mínimo que la empresa está obligada a respetar. Ningún contrato individual puede acordar condiciones inferiores a las del convenio aplicable. Si lo hace, esas cláusulas son nulas de pleno derecho y el trabajador tiene derecho a cobrar la diferencia, aunque haya firmado el contrato voluntariamente.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo sé qué convenio colectivo me aplica?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El convenio aplicable depende principalmente de la actividad de tu empresa (código CNAE) y, en algunos casos, del ámbito geográfico. Tu contrato de trabajo debe indicar el convenio colectivo de referencia. También puedes consultarlo en la nómina (suele aparecer en el encabezado) o preguntar directamente al departamento de recursos humanos. Si hay dudas, el Ministerio de Trabajo publica todos los convenios registrados en el Registro de Convenios Colectivos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto es el salario mínimo en hostelería en 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Según el Convenio Colectivo Estatal de Hostelería 2026, el salario mínimo varía por categoría: Camarero/a, 1.298 €/mes; Cocinero/a, 1.387 €/mes; Jefe/a de Cocina, 1.487 €/mes; Recepcionista de hotel, 1.380 €/mes; Gobernanta, 1.420 €/mes; y Limpieza/Habitaciones, 1.240 €/mes. Todos los importes son en 14 pagas (12 mensualidades + 2 pagas extras). El neto mensual depende de la comunidad autónoma y la situación personal del trabajador.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué puedo hacer si mi empresa me paga por debajo del convenio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si tu empresa te paga menos de lo que establece el convenio colectivo tienes varias opciones: 1) Reclamarlo internamente por escrito (queda constancia). 2) Acudir a tu sindicato (CCOO, UGT u otro de tu sector) para asesoramiento gratuito. 3) Presentar denuncia ante la Inspección de Trabajo, que es gratuita y confidencial. 4) Solicitar papeleta de conciliación en el SMAC como paso previo a la demanda judicial. 5) Contratar un abogado laboralista para reclamar las diferencias salariales de los últimos 4 años.",
      },
    },
  ],
};

// ─── Static content ────────────────────────────────────────────────────────────

const CHIPS = [
  { icon: "📋", text: "8 sectores principales" },
  { icon: "👷", text: "+5 millones de trabajadores" },
  { icon: "🧾", text: "Neto real con IRPF 2026" },
  { icon: "⚖️", text: "Detección de incumplimiento" },
];

const SECTOR_TABLE = [
  { sector: "Hostelería",             trab: "1.500.000", base: "1.240 – 1.487 €" },
  { sector: "Comercio",               trab: "1.200.000", base: "1.260 – 1.650 €" },
  { sector: "Construcción",           trab: "1.000.000", base: "1.320 – 2.100 €" },
  { sector: "Metal e Industria",      trab: "900.000",   base: "1.380 – 2.400 €" },
  { sector: "Limpieza de Edificios",  trab: "400.000",   base: "1.240 – 1.420 €" },
  { sector: "Transporte y Logística", trab: "350.000",   base: "1.298 – 1.980 €" },
  { sector: "Sanidad Privada",        trab: "300.000",   base: "1.350 – 3.200 €" },
  { sector: "Oficinas y Despachos",   trab: "280.000",   base: "1.298 – 2.800 €" },
];

const ACTIONS = [
  {
    icon: "👥",
    title: "Contacta con tu sindicato",
    body: "CCOO, UGT y los sindicatos sectoriales ofrecen asesoramiento gratuito a trabajadores. Puedes presentar una queja y ellos te orientarán sobre el proceso. Si hay delegado sindical en tu empresa, es el primer punto de contacto.",
  },
  {
    icon: "🏛️",
    title: "Denuncia ante la Inspección de Trabajo",
    body: "La Inspección de Trabajo puede investigar a tu empresa y obligarla a regularizar la situación. La denuncia es gratuita, puede ser anónima y no requiere abogado. El procedimiento es ágil y efectivo para incumplimientos evidentes.",
  },
  {
    icon: "🤝",
    title: "Conciliación en el SMAC",
    body: "El Servicio de Mediación, Arbitraje y Conciliación (SMAC) es el paso obligatorio previo a la demanda judicial. Muchos casos se resuelven aquí sin llegar a juicio, con acuerdo entre las partes en plazos cortos.",
  },
  {
    icon: "⚖️",
    title: "Demanda judicial laboral",
    body: "Si las vías anteriores fallan, puedes presentar una demanda ante el Juzgado de lo Social. Puedes reclamar las diferencias salariales de los últimos 4 años (prescripción). Con un abogado laboralista y las diferencias documentadas, las posibilidades de éxito son altas.",
  },
];

// ─── FAQ display ──────────────────────────────────────────────────────────────

const FAQ_ITEMS = FAQ_JSON_LD.mainEntity.map((q) => ({
  question: q.name,
  answer:   q.acceptedAnswer.text,
}));

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalculadoraConvenioPage() {
  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBAPP_JSON_LD) }} />

      {/* Gradient spotlight */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.12) 0%, transparent 65%)" }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col min-h-screen w-full">

        {/* ── Header ── */}
        <header className="px-4 pt-8 pb-6 md:pt-12 md:pb-8">
          <div className="max-w-4xl mx-auto">

            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs mb-6" style={{ color: "#4a4a6a" }} aria-label="Breadcrumb">
              <Link href="/" className="hover:underline" style={{ color: "#818cf8" }}>Inicio</Link>
              <span>/</span>
              <Link href="/" className="hover:underline" style={{ color: "#818cf8" }}>Calculadoras</Link>
              <span>/</span>
              <span style={{ color: "#7c7ca0" }}>Convenio colectivo</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.22)", color: "#818cf8", maxWidth: "100%" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }} />
              <span className="hidden sm:inline">Datos oficiales 2026 · 8 convenios sectoriales</span>
              <span className="sm:hidden">Datos AEAT 2026 · 8 convenios</span>
            </div>

            <h1
              className="font-syne font-extrabold tracking-tight leading-snug mb-3"
              style={{ fontSize: "clamp(1.5rem, 5vw, 2.6rem)", color: "#f0f0ff" }}
            >
              ¿Cobras lo que marca{" "}
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
                tu convenio?
              </span>
            </h1>

            <p className="text-sm md:text-base leading-relaxed" style={{ color: "#7c7ca0" }}>
              Selecciona tu sector y categoría profesional, introduce tu salario actual y comprueba si tu empresa cumple con el convenio colectivo aplicable. Si cobras menos de lo que te corresponde, te explicamos cómo reclamarlo.
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              {CHIPS.map(({ icon, text }) => (
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
          </div>
        </header>

        {/* ── Calculator ── */}
        <section className="px-4 pb-14">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #4f52d4, #6366f1)", boxShadow: "0 0 0 1px rgba(99,102,241,0.3)" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="2" y="2" width="12" height="12" rx="2" />
                  <path d="M5 8h6M8 5v6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#e0e0ff" }}>Comprobador de convenio colectivo</p>
                <p className="text-xs" style={{ color: "#5a5a80" }}>Selecciona sector, categoría e introduce tu salario para comprobar si cobras lo que te corresponde</p>
              </div>
            </div>
            <ConvenioCalculator />
          </div>
        </section>

        {/* ══ SEO CONTENT ══ */}
        <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>

          {/* S1 — Qué es el convenio colectivo */}
          <section className="px-4 py-14 md:py-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-syne font-bold mb-5" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                ¿Qué es el convenio colectivo y por qué importa?
              </h2>
              <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: "#c0c0d8" }}>
                <p>
                  Un <strong style={{ color: "#e0e0ff" }}>convenio colectivo</strong> es un contrato de derecho laboral negociado entre los representantes de los trabajadores (sindicatos) y los empresarios de un sector o empresa. Establece las condiciones mínimas de trabajo que deben respetarse en todos los contratos individuales del ámbito al que se aplica: salario mínimo por categoría, jornada laboral, vacaciones, permisos y otros derechos.
                </p>
                <p>
                  El convenio actúa como un <strong style={{ color: "#e0e0ff" }}>suelo legal</strong>: ninguna empresa puede pagar menos de lo que establece el convenio aplicable, aunque el trabajador lo acepte voluntariamente en el contrato. Si un contrato individual acuerda condiciones inferiores, esa cláusula es nula de pleno derecho y se sustituye automáticamente por lo que indica el convenio.
                </p>
                <p>
                  En España hay más de <strong style={{ color: "#e0e0ff" }}>5.000 convenios colectivos vigentes</strong>, desde convenios estatales que cubren sectores enteros (hostelería, construcción, metal) hasta convenios de empresa que solo aplican a los empleados de una firma concreta. Cuando coexisten un convenio estatal y uno de empresa, se aplica el más favorable para el trabajador en cada materia concreta.
                </p>
                <p>
                  Conocer tu convenio es un derecho y una responsabilidad. Muchos trabajadores desconocen qué convenio les aplica o cuál es el salario mínimo que les corresponde, lo que facilita que situaciones de incumplimiento pasen desapercibidas durante años. Esta calculadora te ayuda a comprobarlo en segundos.
                </p>
              </div>
            </div>
          </section>

          <div className="seo-divider" />

          {/* S2 — Los convenios más importantes */}
          <section className="px-4 py-14 md:py-16" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-syne font-bold mb-2" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                Los convenios más importantes de España 2026
              </h2>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "#9090b8" }}>
                Salario mínimo mensual bruto (en 14 pagas) según el rango de categorías de cada convenio. El neto real depende de la comunidad autónoma y la situación personal — usa la calculadora de arriba para calcularlo exacto.
              </p>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ borderCollapse: "collapse", minWidth: 320 }}>
                  <thead>
                    <tr style={{ background: "rgba(99,102,241,0.15)" }}>
                      <th className="text-left px-4 py-3 font-syne font-bold text-xs tracking-wider uppercase" style={{ color: "#a5b4fc" }}>Sector</th>
                      <th className="text-right px-4 py-3 font-syne font-bold text-xs tracking-wider uppercase" style={{ color: "#a5b4fc" }}>Trabajadores</th>
                      <th className="text-right px-4 py-3 font-syne font-bold text-xs tracking-wider uppercase" style={{ color: "#a5b4fc" }}>Salario base</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SECTOR_TABLE.map(({ sector, trab, base }, i) => (
                      <tr key={sector} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td className="px-4 py-3 font-medium" style={{ color: "#e0e0ff" }}>{sector}</td>
                        <td className="px-4 py-3 text-right tabnum" style={{ color: "#9090b8" }}>{trab}</td>
                        <td className="px-4 py-3 text-right tabnum font-semibold" style={{ color: "#34d399" }}>{base}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
              <p className="text-xs mt-3 leading-relaxed" style={{ color: "#5a5a80" }}>
                Fuente: convenios colectivos estatales publicados en el BOE 2025-2026. Los salarios son orientativos y pueden variar por comunidad autónoma o convenio provincial específico.
              </p>
            </div>
          </section>

          <div className="seo-divider" />

          {/* S3 — Qué puedo hacer si cobro menos */}
          <section className="px-4 py-14 md:py-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-syne font-bold mb-5" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                ¿Qué puedo hacer si cobro menos que el convenio?
              </h2>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "#c0c0d8" }}>
                Si has comprobado que tu salario está por debajo del mínimo del convenio, tienes derechos y vías de reclamación concretas. El incumplimiento del convenio colectivo es una infracción laboral grave. Puedes reclamar las diferencias salariales de los últimos <strong style={{ color: "#e0e0ff" }}>4 años</strong> (plazo de prescripción).
              </p>
              <div className="flex flex-col gap-4">
                {ACTIONS.map(({ icon, title, body }) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-2xl px-5 py-4"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <span style={{ fontSize: "1.4rem", lineHeight: 1, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p className="font-syne font-bold mb-1.5" style={{ color: "#e0e0ff", fontSize: "0.95rem" }}>{title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: "#9090b8" }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="mt-6 rounded-xl px-5 py-4"
                style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.18)" }}
              >
                <p className="text-sm leading-relaxed" style={{ color: "#fde68a" }}>
                  <strong>Importante:</strong> antes de reclamar, guarda toda la documentación posible — nóminas, contratos, correos electrónicos. La carga de la prueba en muchos casos corresponde al trabajador. Un registro detallado de lo cobrado frente a lo que marca el convenio es la base de cualquier reclamación exitosa.
                </p>
              </div>
            </div>
          </section>

          <div className="seo-divider" />

          {/* FAQ */}
          <section className="px-4 py-14 md:py-16" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-syne font-bold mb-6" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                Preguntas frecuentes sobre convenios colectivos
              </h2>
              <div className="flex flex-col gap-4">
                {FAQ_ITEMS.map(({ question, answer }) => (
                  <details
                    key={question}
                    className="rounded-2xl overflow-hidden group"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <summary
                      className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-syne font-bold"
                      style={{ color: "#e0e0ff", fontSize: "0.95rem" }}
                    >
                      {question}
                      <svg
                        width="12" height="12" viewBox="0 0 12 12" fill="none"
                        className="shrink-0 ml-3 transition-transform group-open:rotate-180"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                        style={{ color: "#6366f1" }}
                      >
                        <path d="M2 4.5L6 8L10 4.5" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-4">
                      <p className="text-sm leading-relaxed" style={{ color: "#9090b8" }}>{answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
