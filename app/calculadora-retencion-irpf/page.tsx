import type { Metadata } from "next";
import Link from "next/link";
import RetencionCalculator from "@/components/RetencionCalculator";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Calculadora Retención IRPF 2026 | Cuánto IRPF Me Retienen en Nómina",
  description:
    "Calcula exactamente cuánto IRPF te retienen en tu nómina en 2026. Tipo efectivo, tipo marginal y retención mensual según tu salario y situación personal.",
  alternates: { canonical: "https://calculadoranomina.org/calculadora-retencion-irpf" },
  openGraph: {
    title: "Calculadora Retención IRPF 2026",
    description: "Calcula cuánto IRPF te retienen en nómina: tipo efectivo, tipo marginal y retención mensual. Datos oficiales AEAT 2026.",
    url: "https://calculadoranomina.org/calculadora-retencion-irpf",
    type: "website",
  },
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuánto IRPF me tienen que retener?",
      acceptedAnswer: { "@type": "Answer", text: "El porcentaje de retención del IRPF depende de tu salario bruto anual, tu comunidad autónoma, tu situación familiar y el número de hijos. Para un salario de 30.000€ en Madrid, soltero sin hijos, la retención ronda el 17,7% (unos 443€/mes). Cuanto mayor es el salario, mayor es el tipo efectivo." }
    },
    {
      "@type": "Question",
      name: "¿Puedo pedir que me retengan más o menos IRPF?",
      acceptedAnswer: { "@type": "Answer", text: "Sí. Puedes comunicar a tu empresa tu situación personal mediante el Modelo 145 para que ajuste la retención a la baja si tienes hijos, pareja sin ingresos o discapacidad. También puedes solicitar voluntariamente una retención superior a la calculada, lo que puede ser conveniente si tienes varios pagadores o ingresos adicionales." }
    },
    {
      "@type": "Question",
      name: "¿Por qué mi retención varía cada mes?",
      acceptedAnswer: { "@type": "Answer", text: "La retención se recalcula cuando cambia tu situación personal (nacimiento de un hijo, matrimonio, separación), cuando recibes una subida de sueldo, cuando cobras ingresos extra (horas extraordinarias, bonus) o a inicio de año cuando la empresa revisa el cálculo anual. También puede variar si has cambiado de empresa en el año." }
    },
    {
      "@type": "Question",
      name: "¿Qué pasa si la empresa me retiene mal el IRPF?",
      acceptedAnswer: { "@type": "Answer", text: "Si la retención ha sido insuficiente (por error de la empresa o porque no comunicaste cambios en tu situación personal), la diferencia saldrá a pagar en la declaración de la renta. Si fue excesiva, saldrá a devolver. En cualquier caso, la obligación fiscal final se regulariza en la declaración anual. Si la empresa ha retenido de más por error, puedes reclamarle el exceso." }
    },
    {
      "@type": "Question",
      name: "¿La retención es la misma en toda España?",
      acceptedAnswer: { "@type": "Answer", text: "No. Aunque la escala estatal del IRPF es igual en todo el territorio, cada comunidad autónoma fija sus propios tramos autonómicos. Madrid tiene los tipos autonómicos más bajos del régimen común, lo que resulta en retenciones menores. Cataluña y Valencia aplican tipos más altos, especialmente a partir de 30.000€." }
    },
  ],
};

const SALARY_TABLE = [
  { bruto: "15.000 €", retencion: "40 €/mes",    tipo: "3,2%"  },
  { bruto: "20.000 €", retencion: "163 €/mes",   tipo: "9,8%"  },
  { bruto: "25.000 €", retencion: "262 €/mes",   tipo: "12,6%" },
  { bruto: "30.000 €", retencion: "443 €/mes",   tipo: "17,7%" },
  { bruto: "40.000 €", retencion: "737 €/mes",   tipo: "22,1%" },
  { bruto: "50.000 €", retencion: "1.046 €/mes", tipo: "25,1%" },
];

export default function CalculadoraRetencionPage() {
  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
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
            <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#4a4a6a" }}>
              <Link href="/" className="hover:underline" style={{ color: "#818CF8" }}>Inicio</Link>
              <span>/</span>
              <Link href="/" className="hover:underline" style={{ color: "#818CF8" }}>Calculadora</Link>
              <span>/</span>
              <span style={{ color: "#7c7ca0" }}>Retención IRPF</span>
            </nav>

            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.22)", color: "#818CF8" }}
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
              Calcula el porcentaje exacto que tu empresa retiene en tu nómina para el IRPF.
              Introduce tu salario, comunidad y situación familiar.
            </p>
          </div>
        </header>

        {/* ── Calculator ── */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <RetencionCalculator />
          </div>
        </section>

        {/* ══ Cómo lo calculamos ══ */}
        <section className="px-4 pb-14 md:pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-syne font-bold mb-2" style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: "#f0f0ff" }}>
              Cómo calculamos la retención
            </h2>
            <p className="text-sm mb-8" style={{ color: "#7c7ca0" }}>
              El tipo de retención se obtiene siguiendo el procedimiento oficial de la AEAT (Art. 82–87 RIRPF):
            </p>
            <ol className="flex flex-col gap-4">
              {[
                { n: 1, text: "Salario bruto anual − Cotizaciones SS del trabajador (6,50% contingencias + 1,55% desempleo + 0,10% FP + 0,15% MEI)", sub: "= Rendimiento íntegro del trabajo" },
                { n: 2, text: "− Gastos deducibles Art. 19 LIRPF (2.000 € fijos para asalariados, hasta 3.500–5.565 € con movilidad geográfica)", sub: "= Rendimiento neto del trabajo" },
                { n: 3, text: "− Reducción Art. 20 LIRPF para rendimientos bajos (hasta 7.302 € de reducción para rentas ≤ 19.747,50 €)", sub: "= Rendimiento neto reducido" },
                { n: 4, text: "− Mínimo personal (5.550 €, más por edad o discapacidad) y mínimo familiar (2.400 € primer hijo, etc.)", sub: "= Base de retención IRPF" },
                { n: 5, text: "Aplicar escala progresiva estatal + autonómica de tu CCAA sobre la base de retención", sub: "= Cuota íntegra anual" },
                { n: 6, text: "Cuota íntegra anual ÷ Salario bruto anual × 100", sub: "= Tipo de retención aplicable (%)" },
              ].map(({ n, text, sub }) => (
                <li key={n} className="flex gap-4">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.35)", color: "#a5b4fc" }}
                  >
                    {n}
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed" style={{ color: "#c0c0d8" }}>{text}</p>
                    <p className="text-xs mt-1 font-semibold" style={{ color: "#6366f1" }}>{sub}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div
              className="mt-8 rounded-xl px-5 py-4 flex items-start gap-3"
              style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#818cf8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="8" cy="8" r="6.5" /><path d="M8 7v4M8 5.5v.5" />
              </svg>
              <p className="text-sm leading-relaxed" style={{ color: "#8080a8" }}>
                Fuente oficial:{" "}
                <a
                  href="https://www.agenciatributaria.es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: "#818cf8" }}
                >
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

          {/* Sección 2 — Tabla retenciones */}
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
                        <td className="px-4 py-3 font-semibold" style={{ color: "#e0e0ff", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{row.bruto}</td>
                        <td className="px-4 py-3 font-bold" style={{ color: "#f87171", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{row.retencion}</td>
                        <td className="px-4 py-3 font-semibold" style={{ color: "#818cf8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{row.tipo}</td>
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
