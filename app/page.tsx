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

const FAQ_ITEMS = [
  {
    q: "¿Cuánto me queda neto de 30.000€ brutos?",
    a: "Con 30.000€ brutos anuales en Madrid, soltero/a y sin hijos, cobras aproximadamente 2.274€ netos al mes (27.292€ netos al año). De tu salario bruto se descuentan 1.950€ de cotización a la Seguridad Social (6,50%) y 4.967€ de retención IRPF (tipo efectivo 17,7%). El resultado varía según tu comunidad autónoma y situación familiar.",
  },
  {
    q: "¿Cómo afecta tener hijos al IRPF?",
    a: "Tener hijos reduce la base imponible del IRPF gracias a los mínimos familiares. Con un hijo menor de 25 años, el mínimo por descendiente es de 2.400€; con dos hijos, 2.700€ por el segundo. En la práctica, esto supone entre 30€ y 80€ más al mes en el salario neto dependiendo del nivel salarial. Puedes calcularlo exactamente seleccionando tu número de hijos en la calculadora de arriba.",
  },
  {
    q: "¿El cálculo de nómina es el mismo en toda España?",
    a: "No. La cotización a la Seguridad Social (6,50%) sí es igual en todo el territorio. Sin embargo, el IRPF tiene una parte estatal y una parte autonómica, y cada comunidad fija sus propios tramos. Madrid tiene los tipos autonómicos más bajos del régimen común, mientras que Cataluña o Valencia aplican tipos más altos. La diferencia puede superar los 50€ al mes para un salario de 30.000€.",
  },
  {
    q: "¿Qué diferencia hay entre cobrar en 12 o 14 pagas?",
    a: "La paga bruta anual es la misma, pero el IRPF retenido cambia. Con 14 pagas, dos mensualidades adicionales (habitualmente en julio y diciembre) se cobran en meses concretos, lo que puede alterar el tipo de retención que aplica la empresa. El neto anual total es prácticamente idéntico; la diferencia está en cómo se distribuye a lo largo del año. Puedes comparar ambas opciones directamente en la calculadora.",
  },
  {
    q: "¿Cuánto le cuesta un empleado a la empresa?",
    a: "Además del salario bruto, la empresa paga sus propias cotizaciones a la Seguridad Social: contingencias comunes (23,60%), desempleo (5,50%), FOGASA (0,20%) y Formación Profesional (0,60%), lo que supone alrededor de un 29,90% adicional sobre el bruto. Para un empleado con 30.000€ brutos, el coste total para la empresa es de aproximadamente 39.144€ al año.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

// ─── Reusable table components ────────────────────────────────────────────────

function SeoTh({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
      style={{
        background: "rgba(99,102,241,0.1)",
        color: "#6060a0",
        borderBottom: "1px solid rgba(99,102,241,0.15)",
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

export default function HomePage() {
  const currentYear = new Date().getFullYear();

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

        {/* ══════════════════════════════════════════════════════════════════
            SEO CONTENT BLOCK
        ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>

          {/* ── Sección 1: Cómo calcular ── */}
          <section className="px-4 py-14 md:py-16">
            <div className="max-w-4xl mx-auto">
              <h2
                className="font-syne font-bold text-2xl mb-5"
                style={{ color: "#f0f0ff" }}
              >
                ¿Cómo calcular tu salario neto en España en 2026?
              </h2>
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
                <p>
                  El proceso manual implica calcular la base de cotización, aplicar cada tramo de la escala estatal y autonómica, restar los mínimos personales y familiares, y dividir entre 12 o 14 pagas. Es tedioso y fácil de errar.{" "}
                  <strong style={{ color: "#818cf8" }}>
                    Usa la calculadora de nómina de arriba para obtener tu resultado exacto en segundos, con los datos oficiales de la AEAT 2026.
                  </strong>
                </p>
              </div>
            </div>
          </section>

          {/* ── Sección 2: Seguridad Social ── */}
          <section
            className="px-4 py-14 md:py-16"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(99,102,241,0.03)" }}
          >
            <div className="max-w-4xl mx-auto">
              <h2
                className="font-syne font-bold text-2xl mb-5"
                style={{ color: "#f0f0ff" }}
              >
                Cotizaciones a la Seguridad Social 2026
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#c0c0d8" }}>
                La cotización del trabajador a la Seguridad Social se divide en cuatro conceptos. El tipo total es del <strong style={{ color: "#e0e0ff" }}>6,50%</strong> sobre el salario bruto y es uniforme en todo el territorio español, sin diferencias por comunidad autónoma ni situación personal.
              </p>
              <div className="overflow-x-auto rounded-xl mb-6" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <SeoTh>Concepto</SeoTh>
                      <SeoTh>Tipo</SeoTh>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><SeoTd>Contingencias comunes</SeoTd><SeoTd>4,70%</SeoTd></tr>
                    <tr><SeoTd>Desempleo (contrato indefinido)</SeoTd><SeoTd>1,55%</SeoTd></tr>
                    <tr><SeoTd>Formación Profesional</SeoTd><SeoTd>0,10%</SeoTd></tr>
                    <tr><SeoTd>Mecanismo de Equidad Intergeneracional (MEI)</SeoTd><SeoTd>0,15%</SeoTd></tr>
                    <tr style={{ background: "rgba(99,102,241,0.08)" }}>
                      <SeoTd highlight>Total trabajador</SeoTd>
                      <SeoTd highlight>6,50%</SeoTd>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#8080a8" }}>
                Además, la empresa cotiza por separado: contingencias comunes (23,60%), desempleo (5,50%), FOGASA (0,20%) y FP (0,60%). Esto eleva el coste real del empleado en aproximadamente un 29,90% adicional sobre el bruto.
              </p>
            </div>
          </section>

          {/* ── Sección 3: Tramos IRPF ── */}
          <section
            className="px-4 py-14 md:py-16"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="max-w-4xl mx-auto">
              <h2
                className="font-syne font-bold text-2xl mb-5"
                style={{ color: "#f0f0ff" }}
              >
                Tramos del IRPF 2026 en España
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#c0c0d8" }}>
                El <strong style={{ color: "#e0e0ff" }}>IRPF es un impuesto progresivo</strong>: cuanto más cobras, mayor es el porcentaje que tributa cada euro adicional. Los tramos que se muestran son los estatales; a ellos se suma el tramo autonómico, que varía según la comunidad. La retención que aplica tu empresa es el resultado de combinar ambas escalas sobre tu base liquidable.
              </p>
              <div className="overflow-x-auto rounded-xl mb-6" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <SeoTh>Base liquidable</SeoTh>
                      <SeoTh>Tipo estatal</SeoTh>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><SeoTd>Hasta 12.450 €</SeoTd><SeoTd>9,50%</SeoTd></tr>
                    <tr><SeoTd>12.450 € – 20.200 €</SeoTd><SeoTd>12,00%</SeoTd></tr>
                    <tr><SeoTd>20.200 € – 35.200 €</SeoTd><SeoTd>15,00%</SeoTd></tr>
                    <tr><SeoTd>35.200 € – 60.000 €</SeoTd><SeoTd>18,50%</SeoTd></tr>
                    <tr><SeoTd>60.000 € – 300.000 €</SeoTd><SeoTd>22,50%</SeoTd></tr>
                    <tr><SeoTd>Más de 300.000 €</SeoTd><SeoTd>24,50%</SeoTd></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#8080a8" }}>
                El tipo efectivo que aparece en tu nómina no es ninguno de estos tramos aisladamente, sino el resultado ponderado de aplicar cada tramo a la porción de renta que le corresponde. Por eso, para un salario de 30.000€ el tipo efectivo total ronda el 17–18%, aunque el tramo marginal sea el 15%.
              </p>
            </div>
          </section>

          {/* ── Sección 4: Tabla de salarios ── */}
          <section
            className="px-4 py-14 md:py-16"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(99,102,241,0.03)" }}
          >
            <div className="max-w-4xl mx-auto">
              <h2
                className="font-syne font-bold text-2xl mb-3"
                style={{ color: "#f0f0ff" }}
              >
                ¿Cuánto cobras neto según tu salario bruto?
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#c0c0d8" }}>
                Referencia rápida para los salarios más consultados en España. Datos para Madrid, soltero/a sin hijos, contrato indefinido y 12 pagas en 2026.
              </p>
              <div className="overflow-x-auto rounded-xl mb-6" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <SeoTh>Salario bruto anual</SeoTh>
                      <SeoTh>Neto mensual (Madrid)</SeoTh>
                      <SeoTh>Página detallada</SeoTh>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { bruto: "20.000 €", neto: "1.575 €/mes", slug: "20000" },
                      { bruto: "25.000 €", neto: "1.911 €/mes", slug: "25000" },
                      { bruto: "30.000 €", neto: "2.274 €/mes", slug: "30000" },
                      { bruto: "40.000 €", neto: "2.876 €/mes", slug: "40000" },
                      { bruto: "50.000 €", neto: "3.414 €/mes", slug: "50000" },
                    ].map((row) => (
                      <tr key={row.slug}>
                        <SeoTd highlight>{row.bruto}</SeoTd>
                        <SeoTd>{row.neto}</SeoTd>
                        <SeoTd>
                          <Link
                            href={`/cuanto-es-${row.slug}-euros-brutos-neto`}
                            className="seo-table-link"
                          >
                            Ver desglose →
                          </Link>
                        </SeoTd>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── Sección 5: CCAA ── */}
          <section
            className="px-4 py-14 md:py-16"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="max-w-4xl mx-auto">
              <h2
                className="font-syne font-bold text-2xl mb-5"
                style={{ color: "#f0f0ff" }}
              >
                ¿Por qué varía el neto según la comunidad autónoma?
              </h2>
              <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#c0c0d8" }}>
                <p>
                  El IRPF en España se divide en dos mitades: una parte estatal, igual para todos los contribuyentes, y una parte autonómica, que cada comunidad fija de forma independiente. Esto significa que dos personas con exactamente el mismo salario bruto y la misma situación familiar pueden recibir netos distintos dependiendo de dónde vivan.
                </p>
                <p>
                  <strong style={{ color: "#e0e0ff" }}>Madrid tiene los tipos autonómicos más bajos del régimen común</strong>, con una bonificación del 100% en el tramo autonómico para rentas medias-bajas. En el extremo opuesto, <strong style={{ color: "#e0e0ff" }}>Cataluña aplica los tipos más altos</strong>, especialmente a partir de 33.007€. Valencia se sitúa en una posición intermedia pero con tramos relevantes desde los 27.000€.
                </p>
                <p>
                  La diferencia puede ser considerable: con <strong style={{ color: "#e0e0ff" }}>30.000€ brutos anuales</strong>, un trabajador en Madrid recibe aproximadamente <strong style={{ color: "#e0e0ff" }}>2.274€/mes netos</strong>, mientras que uno en Cataluña percibe alrededor de <strong style={{ color: "#e0e0ff" }}>2.218€/mes</strong>. Eso supone una diferencia de <strong style={{ color: "#34d399" }}>676€ al año</strong> simplemente por residir en una comunidad u otra.
                </p>
                <p>
                  Otras comunidades como Galicia, Asturias o Extremadura también aplican tipos autonómicos superiores a los de Madrid, aunque por debajo de Cataluña.{" "}
                  <strong style={{ color: "#818cf8" }}>
                    Selecciona tu comunidad autónoma en la calculadora para ver tu resultado exacto con los tramos autonómicos de 2026.
                  </strong>
                </p>
              </div>
            </div>
          </section>

          {/* ── Sección 6: FAQ ── */}
          <section
            className="px-4 py-14 md:py-16"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(99,102,241,0.03)" }}
          >
            <div className="max-w-4xl mx-auto">
              <h2
                className="font-syne font-bold text-2xl mb-8"
                style={{ color: "#f0f0ff" }}
              >
                Preguntas frecuentes sobre el cálculo de nóminas
              </h2>
              <div className="flex flex-col gap-4">
                {FAQ_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-5"
                    style={{
                      background: "rgba(99,102,241,0.05)",
                      border: "1px solid rgba(99,102,241,0.12)",
                    }}
                  >
                    <p className="font-semibold text-sm mb-2" style={{ color: "#c0c0e0" }}>
                      {item.q}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "#8080a8" }}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
        {/* ══════════════════════════════════════════════════════════════════ */}

        <SiteFooter year={currentYear} />
      </div>
    </main>
  );
}
