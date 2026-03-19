import type { Metadata } from "next";
import Link from "next/link";
import JobChangeCalculator from "@/components/job-change/JobChangeCalculator";
import SiteFooter from "@/components/SiteFooter";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Calculadora Cambio de Trabajo 2026: ¿Te Compensa Cambiar de Empresa?",
  description:
    "Compara tu empleo actual con una nueva oferta y calcula cuánto ganarías neto al mes y al año. Evalúa salario, bonus, pagas, vacaciones, teletrabajo y antigüedad. Datos AEAT 2026.",
  alternates: { canonical: "https://calculadoranomina.org/calculadora-cambio-trabajo" },
  openGraph: {
    title: "Calculadora Cambio de Trabajo 2026: ¿Te Compensa Cambiar de Empresa?",
    description:
      "Compara tu empleo actual con una nueva oferta. Neto real, IRPF, bonus y factores no salariales. Datos AEAT 2026.",
    url: "https://calculadoranomina.org/calculadora-cambio-trabajo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "¿Te compensa cambiar de trabajo? Calcula la diferencia real",
    description:
      "Compara dos empleos: neto mensual, IRPF, bonus, vacaciones y teletrabajo. Datos AEAT 2026.",
  },
};

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio",       item: "https://calculadoranomina.org" },
    { "@type": "ListItem", position: 2, name: "Calculadoras", item: "https://calculadoranomina.org" },
    { "@type": "ListItem", position: 3, name: "Cambio de trabajo", item: "https://calculadoranomina.org/calculadora-cambio-trabajo" },
  ],
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo saber si me compensa cambiar de trabajo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para saber si te compensa cambiar de trabajo hay que comparar el neto mensual real (no el bruto), el bonus anual, las vacaciones, el teletrabajo y la antigüedad que perderías. Una subida de bruto puede traducirse en una mejora neta mucho menor de lo esperado por la progresividad del IRPF. Esta calculadora hace todos esos cálculos automáticamente con los datos oficiales de la AEAT 2026.",
      },
    },
    {
      "@type": "Question",
      name: "¿Por qué ganar más bruto no siempre significa ganar mucho más neto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El IRPF es progresivo: a mayor salario, el porcentaje de impuesto sobre los euros adicionales es mayor. Si pasas de 30.000 € a 40.000 € brutos en Madrid, el neto mejora unos 562 € al mes, no los 833 € que correspondería si el tipo fuera fijo. Además, si cambias de comunidad autónoma, el tramo autonómico del IRPF puede reducir parte de esa ganancia.",
      },
    },
    {
      "@type": "Question",
      name: "¿Afecta la comunidad autónoma al salario neto al cambiar de trabajo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, significativamente. El IRPF tiene una parte estatal (igual para todos) y una parte autonómica que varía. Madrid aplica los tipos autonómicos más bajos de España; Cataluña, los más altos para rentas medias. Para el mismo salario de 30.000 €, la diferencia entre Madrid y Cataluña es de unos 34 € netos al mes (408 €/año). Si la oferta implica un cambio de comunidad, la calculadora lo tiene en cuenta.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué pierdo al cambiar de empresa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Al cambiar de empresa puedes perder: antigüedad (relevante para indemnizaciones, complementos salariales por tramos y pluses de convenio), días de vacaciones si el nuevo convenio es menos generoso, flexibilidad horaria o teletrabajo, bonus garantizados o variables, y la estabilidad que da el tiempo en una empresa. La calculadora refleja los factores objetivos; el resto depende de tu valoración personal.",
      },
    },
    {
      "@type": "Question",
      name: "¿Importa cobrar en 12 o 14 pagas al comparar dos ofertas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No en términos de dinero total. Con 12 pagas prorrateadas o con 14 pagas (12 normales + 2 extras), el neto anual total es prácticamente el mismo. Lo que cambia es la distribución: con 14 pagas recibes más dinero en julio y diciembre, pero menos cada mes. La calculadora muestra el neto mensual y el neto anual para que puedas comparar ambas formas correctamente.",
      },
    },
  ],
};

// ─── Static content ────────────────────────────────────────────────────────────

const CHIPS = [
  { icon: "⚖️", text: "Comparativa dual" },
  { icon: "🧾", text: "IRPF real AEAT 2026" },
  { icon: "🗺️", text: "19 comunidades autónomas" },
  { icon: "🎯", text: "Bonus, vacaciones y teletrabajo" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalculadoraCambioTrabajoPage() {
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

      {/* Gradient spotlight */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.12) 0%, transparent 65%)",
        }}
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
              <span style={{ color: "#7c7ca0" }}>Cambio de trabajo</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.22)",
                color: "#818cf8",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }}
              />
              Datos AEAT 2026 · 19 comunidades autónomas
            </div>

            <h1
              className="font-syne font-extrabold tracking-tight leading-snug mb-3"
              style={{ fontSize: "clamp(1.5rem, 5vw, 2.6rem)", color: "#f0f0ff" }}
            >
              ¿Me compensa{" "}
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
                cambiar de trabajo?
              </span>
            </h1>

            <p className="text-sm md:text-base leading-relaxed" style={{ color: "#7c7ca0" }}>
              Compara tu empleo actual con una nueva oferta. Calcula la diferencia real en neto mensual, neto anual y compensación total contando bonus, vacaciones y teletrabajo. Cálculo con IRPF 2026 y las tablas oficiales de la AEAT.
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              {CHIPS.map(({ icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "#9090b8",
                  }}
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
                style={{
                  background: "linear-gradient(135deg, #4f52d4, #6366f1)",
                  boxShadow: "0 0 0 1px rgba(99,102,241,0.3)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M2 8h4M10 8h4M8 2v4M8 10v4" />
                  <circle cx="8" cy="8" r="2.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#e0e0ff" }}>Comparador interactivo</p>
                <p className="text-xs" style={{ color: "#5a5a80" }}>Introduce los datos de ambos empleos y pulsa «Comparar ofertas»</p>
              </div>
            </div>
            <JobChangeCalculator />
          </div>
        </section>

        {/* ══ SEO CONTENT ══ */}
        <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>

          {/* S1 — Cuándo compensa */}
          <section className="px-4 py-14 md:py-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-syne font-bold mb-5" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                ¿Cuándo compensa realmente cambiar de trabajo?
              </h2>
              <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: "#c0c0d8" }}>
                <p>
                  Comparar solo el <strong style={{ color: "#e0e0ff" }}>salario bruto</strong> es el error más habitual al evaluar una oferta. Si pasas de 30.000 € a 36.000 € brutos en la misma comunidad autónoma, la mejora no es de 500 € al mes — es de unos 337 € netos. El IRPF progresivo absorbe una parte significativa de cualquier subida salarial. Cuanto mayor sea el salario de partida, mayor es el porcentaje que se lleva Hacienda sobre los euros adicionales.
                </p>
                <p>
                  El <strong style={{ color: "#e0e0ff" }}>bonus</strong> también importa y a veces define la decisión. Un salario fijo similar con un bonus anual de 5.000 € puede valer más a final de año que una subida de 4.000 € en el salario base. Pero hay que tenerlo en cuenta como lo que es: variable. Un bonus por objetivos no está garantizado.
                </p>
                <p>
                  La <strong style={{ color: "#e0e0ff" }}>comunidad autónoma</strong> es un factor fiscal real. Con el mismo contrato de 30.000 € brutos, vivir en Madrid supone cobrar unos 408 € más al año netos que en Cataluña, solo por la diferencia en el tramo autonómico del IRPF. Si una oferta implica mudarse, hay que incluir ese impacto en el cálculo.
                </p>
                <p>
                  El cambio puede no compensar incluso si el salario sube porque perdes <strong style={{ color: "#e0e0ff" }}>antigüedad</strong> (con todo lo que conlleva: complementos salariales, indemnizaciones, derechos adquiridos), <strong style={{ color: "#e0e0ff" }}>flexibilidad</strong>, <strong style={{ color: "#e0e0ff" }}>teletrabajo</strong> o <strong style={{ color: "#e0e0ff" }}>días de vacaciones</strong>. Todos estos factores tienen un valor económico real aunque no aparezcan en la nómina.
                </p>
              </div>
            </div>
          </section>

          <div className="seo-divider" />

          {/* S2 — Qué pierdes */}
          <section className="px-4 py-14 md:py-16" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-syne font-bold mb-5" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                Qué puedes perder al cambiar de empresa
              </h2>
              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: "📅",
                    title: "Antigüedad",
                    body: "Al empezar en una empresa nueva, el contador se reinicia. Perdes los pluses de antigüedad del convenio, los derechos adquiridos por tramos de tiempo y, sobre todo, la base de cotización acumulada para calcular indemnizaciones. Con 5 años en una empresa, una rescisión improcedente supone unos 165 días de salario. En la nueva empresa eso tarda años en reconstruirse.",
                  },
                  {
                    icon: "🏖️",
                    title: "Vacaciones",
                    body: "El convenio colectivo y los acuerdos individuales determinan los días de vacaciones reales. Muchas empresas con antigüedad ofrecen días adicionales a partir de ciertos años de permanencia. Si el convenio de la nueva empresa es menos generoso, es un coste real en tiempo libre que hay que valorar.",
                  },
                  {
                    icon: "🏠",
                    title: "Flexibilidad y teletrabajo",
                    body: "El teletrabajo o las horas de flexibilidad horaria tienen un valor económico concreto: menos gastos de transporte, tiempo, desgaste. Renunciar a dos días de teletrabajo a la semana puede equivaler a varios cientos de euros al año en costes de desplazamiento, y decenas de horas de tiempo personal al mes.",
                  },
                  {
                    icon: "🎯",
                    title: "Bonus y variables",
                    body: "Un bonus garantizado en el contrato es completamente distinto a un bonus por objetivos que puede no llegar nunca. Antes de aceptar una oferta con un componente variable importante, conviene preguntar cuál ha sido el pago medio real de ese bonus en los últimos tres años. La respuesta dice mucho.",
                  },
                  {
                    icon: "🏢",
                    title: "Estabilidad y contexto",
                    body: "La empresa actual es conocida: conoces la cultura, los riesgos y las perspectivas. La nueva empresa es una incógnita. En un período de prueba, si las cosas no van bien, el trabajador tiene pocas protecciones legales. Eso es un riesgo que tiene valor aunque no sea cuantificable en una calculadora.",
                  },
                ].map(({ icon, title, body }) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-xl p-4"
                    style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)" }}
                  >
                    <span className="text-xl leading-none shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className="font-semibold text-sm mb-1" style={{ color: "#c0c0e0" }}>{title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: "#8080a8" }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="seo-divider" />

          {/* S3 — Cómo negociar */}
          <section className="px-4 py-14 md:py-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-syne font-bold mb-5" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                Cómo negociar una oferta si no te compensa tal como está
              </h2>
              <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: "#c0c0d8" }}>
                <p>
                  Si la oferta no llega al nivel que necesitas, no es obligatorio decir que no de inmediato. La negociación salarial es un proceso habitual y esperado. Estas son las palancas más efectivas:
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      title: "Pedir más bruto",
                      body: "Es la opción más directa. Lleva a la reunión el cálculo del neto que necesitas y el bruto equivalente para alcanzarlo. Hablar siempre en brutos anuales es el estándar en España y da más claridad a la empresa sobre lo que estás pidiendo.",
                    },
                    {
                      title: "Negociar un bonus de incorporación",
                      body: 'Un "sign-on bonus" compensa en parte la pérdida de antigüedad o derechos adquiridos. Pedir un bono de entrada de 3.000–6.000 € es razonable si el cambio implica renunciar a incentivos acumulados en la empresa actual.',
                    },
                    {
                      title: "Pedir más teletrabajo",
                      body: "Si la empresa no puede subir el salario, un día adicional de teletrabajo a la semana puede valer 100–200 € mensuales en ahorro de transporte y tiempo. Es una concesión de bajo coste para la empresa y alto valor para el trabajador.",
                    },
                    {
                      title: "Pedir más vacaciones",
                      body: "En España el mínimo legal son 22 días laborables. Muchos convenios y empresas ofrecen más. Negociar 2–3 días adicionales desde el inicio es una petición razonable, especialmente si vienes de una empresa con días extra por antigüedad.",
                    },
                    {
                      title: "Negociar la fecha de incorporación",
                      body: "Si aún no has cobrado un bonus o una parte proporcional de tu antigüedad en la empresa actual, puede ser mejor esperar a que ese pago se materialice antes de firmar el nuevo contrato.",
                    },
                  ].map(({ title, body }, i) => (
                    <div key={i} className="flex gap-3.5">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                        style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.35)", color: "#a5b4fc" }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#c0c0e0" }}>{title}</p>
                        <p className="text-sm mt-0.5 leading-relaxed" style={{ color: "#8080a8" }}>{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="seo-divider" />

          {/* FAQ */}
          <section className="px-4 py-14 md:py-16" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-syne font-bold mb-6" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
                Preguntas frecuentes
              </h2>
              <div className="flex flex-col gap-4">
                {FAQ_JSON_LD.mainEntity.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 md:p-5"
                    style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)" }}
                  >
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
                ¿Quieres ver el desglose completo de IRPF, Seguridad Social y neto mensual de tu salario actual?
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  color: "#fff",
                  boxShadow: "0 2px 14px rgba(99,102,241,0.35)",
                }}
              >
                Calculadora de nómina completa →
              </Link>
            </div>
          </section>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
