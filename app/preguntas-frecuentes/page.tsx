import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes — Calculadora de Nómina 2026",
  description:
    "Respuestas a las preguntas más habituales sobre la calculadora de nómina: exactitud de los cálculos, diferencia bruto-neto, IRPF, Seguridad Social, 14 pagas y más.",
  alternates: { canonical: "https://calculadoranomina.org/preguntas-frecuentes" },
  openGraph: {
    title: "Preguntas Frecuentes — Calculadora de Nómina 2026",
    description:
      "Respuestas sobre exactitud de cálculos, IRPF, Seguridad Social, 14 pagas y más.",
    url: "https://calculadoranomina.org/preguntas-frecuentes",
    type: "website",
  },
};

// ─── FAQ data duplicated for JSON-LD (must be in server component) ─────────

const FAQ_JSONLD = [
  {
    q: "¿Son exactos los cálculos de la calculadora?",
    a: "Los cálculos son muy precisos para la situación general: aplican los tramos del IRPF 2026 (estatales y autonómicos), las cotizaciones a la Seguridad Social y los mínimos personales y familiares según la normativa AEAT. Pueden diferir ligeramente de tu nómina real si tienes deducciones específicas, retribución en especie, rentas de otros tipos o situaciones especiales.",
  },
  {
    q: "¿Qué diferencia hay entre salario bruto y neto?",
    a: "El salario bruto es lo que figura en tu contrato antes de cualquier descuento. El salario neto es lo que recibes en cuenta después de retener las cotizaciones a la Seguridad Social (≈ 6,50 %) y la retención del IRPF.",
  },
  {
    q: "¿Por qué mi nómina real es diferente al resultado?",
    a: "Puede deberse a retribución en especie, complementos variables, deducciones autonómicas específicas, o que tu empresa calcula la retención de forma diferente basándose en el Modelo 145.",
  },
  {
    q: "¿Cómo afecta la comunidad autónoma al IRPF?",
    a: "El IRPF se divide en gravamen estatal (igual para todos) y autonómico (cada CCAA fija sus propios tramos). La diferencia puede suponer hasta 1.500–2.000 € anuales entre las comunidades con mayor y menor presión fiscal.",
  },
  {
    q: "¿Qué es el MEI (Mecanismo de Equidad Intergeneracional)?",
    a: "Cotización adicional introducida en 2023 para el fondo de reserva de pensiones. El trabajador aporta un 0,15 % y la empresa un 0,58 %. No genera derechos adicionales para el trabajador.",
  },
  {
    q: "¿Qué son las 14 pagas y cómo afectan al cálculo?",
    a: "Con 14 pagas el neto anual es el mismo que con 12, pero distribuido en 12 mensualidades más pequeñas y 2 pagas extra. La retención del IRPF se recalcula en ambos casos.",
  },
  {
    q: "¿Por qué varía el IRPF según mi situación familiar?",
    a: "El IRPF aplica mínimos personales y familiares que reducen la base imponible: 2.400 € por primer hijo, 2.700 € por el segundo, 2.800 € adicionales por hijo menor de 3 años, 3.400 € por cónyuge sin ingresos.",
  },
  {
    q: "¿Puedo calcular el bruto que necesito para un neto deseado?",
    a: "Sí. Cambia el modo a Neto → Bruto en el toggle superior, introduce el neto deseado y la calculadora te dirá exactamente el bruto necesario.",
  },
  {
    q: "¿Con qué frecuencia se actualizan los datos?",
    a: "Los datos se actualizan cuando la AEAT publica las nuevas tablas de retenciones, habitualmente una vez al año. La calculadora está actualizada con la normativa AEAT 2026.",
  },
  {
    q: "¿Qué es el coste empresa y para qué sirve?",
    a: "Es el coste total para el empleador: salario bruto más cotizaciones patronales (≈ 30,48 % adicional para indefinidos). Útil para negociar salario o calcular el coste de una contratación.",
  },
  {
    q: "¿La calculadora incluye deducciones autonómicas?",
    a: "No. Aplica los tramos autonómicos del IRPF pero no las deducciones específicas de cada CCAA ni la deducción por maternidad sobre cuota. Para estos casos, consulta con un asesor fiscal.",
  },
  {
    q: "¿Cómo puedo contactar si encuentro un error?",
    a: "Escríbenos a contact.acebolla@gmail.com indicando el salario, CCAA, situación familiar y el resultado obtenido frente al esperado. Respondemos en 48–72 horas.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_JSONLD.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function PreguntasFrecuentesPage() {
  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.1) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 px-4 pt-10 pb-16 md:pt-16">
          <div className="max-w-2xl mx-auto">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs mb-8" style={{ color: "#4a4a6a" }}>
              <Link href="/" className="hover:underline" style={{ color: "#818CF8" }}>
                Inicio
              </Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#7c7ca0" }}>Preguntas frecuentes</span>
            </nav>

            {/* Header */}
            <div className="mb-10">
              <h1
                className="font-syne font-extrabold tracking-tight mb-3"
                style={{ fontSize: "clamp(1.6rem, 5vw, 2.5rem)", color: "#f0f0ff" }}
              >
                Preguntas frecuentes
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: "#a0a0c0" }}>
                Respuestas a las dudas más habituales sobre la calculadora, los cálculos de IRPF,
                Seguridad Social y nóminas en España.
              </p>
            </div>

            {/* Accordion */}
            <FaqAccordion />

            {/* Bottom CTA */}
            <div className="mt-12 flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  color: "#fff",
                  boxShadow: "0 2px 14px rgba(99,102,241,0.35)",
                }}
              >
                Ir a la calculadora →
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#a0a0c0",
                }}
              >
                ¿No encuentras tu respuesta? Contáctanos
              </Link>
            </div>

          </div>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
