import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Quiénes Somos | CalculadoraNomina.org — Metodología y Equipo",
  description:
    "Conoce quién hay detrás de CalculadoraNomina.org, cómo calculamos los datos, nuestras fuentes oficiales y con qué frecuencia actualizamos la herramienta.",
  alternates: { canonical: "https://calculadoranomina.org/sobre-nosotros" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Quiénes somos — CalculadoraNomina.org",
  description:
    "Transparencia total sobre la metodología, las fuentes y las personas detrás de CalculadoraNomina.org.",
  author: {
    "@type": "Person",
    name: "Alex Cebolla Pardo",
    email: "contact.acebolla@gmail.com",
  },
  publisher: {
    "@type": "Organization",
    name: "CalculadoraNomina.org",
    url: "https://calculadoranomina.org",
  },
};

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-syne font-bold mb-6"
      style={{ fontSize: "clamp(1.15rem, 3vw, 1.45rem)", color: "#f0f0ff" }}
    >
      {children}
    </h2>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{
        background: "rgba(99,102,241,0.05)",
        border: "1px solid rgba(99,102,241,0.14)",
      }}
    >
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SobreNosotros() {
  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.09) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 px-4 pt-10 pb-16 md:pt-14">
          <div className="max-w-3xl mx-auto">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs mb-8 flex-wrap" style={{ color: "#4a4a6a" }}>
              <Link href="/" className="hover:underline" style={{ color: "#818CF8" }}>Inicio</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#7c7ca0" }}>Sobre nosotros</span>
            </nav>

            {/* ── Hero ── */}
            <div className="mb-12">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
                style={{
                  background: "rgba(52,211,153,0.08)",
                  border: "1px solid rgba(52,211,153,0.18)",
                  color: "#6ee7b7",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }}
                />
                Actualizado marzo 2026
              </div>

              <h1
                className="font-syne font-extrabold tracking-tight leading-tight mb-4"
                style={{ fontSize: "clamp(1.8rem, 6vw, 2.8rem)", color: "#f0f0ff" }}
              >
                Quiénes somos y{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  cómo trabajamos
                </span>
              </h1>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "#7c7ca0" }}>
                Transparencia total sobre la metodología, las fuentes y las personas detrás de esta herramienta.
              </p>
            </div>

            {/* ── Sección 1: El proyecto ── */}
            <section className="mb-12">
              <SectionTitle>El proyecto</SectionTitle>
              <div
                className="rounded-2xl p-6 text-sm leading-relaxed space-y-4"
                style={{
                  background: "rgba(13,13,26,0.8)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  color: "#b0b0cc",
                }}
              >
                <p>
                  <strong style={{ color: "#e0e0ff" }}>CalculadoraNomina.org</strong> nació en 2026 con el objetivo
                  de ofrecer la calculadora de nóminas más precisa y transparente de España. Existe una brecha enorme
                  entre las herramientas disponibles y lo que los trabajadores realmente necesitan: saber exactamente
                  cuánto van a cobrar y por qué.
                </p>
                <p>
                  La herramienta usa el <strong style={{ color: "#e0e0ff" }}>algoritmo oficial de la AEAT</strong> para
                  el cálculo de retenciones del IRPF, aplicando los tramos estatales y autonómicos vigentes, las
                  reducciones por rendimientos del trabajo y los mínimos personales y familiares establecidos por ley.
                </p>
                <p>
                  Es una herramienta <strong style={{ color: "#e0e0ff" }}>completamente gratuita</strong>, sin
                  registro, sin publicidad intrusiva y sin venta de datos. Se actualiza cada año cuando la AEAT
                  publica los nuevos tramos y cotizaciones para el ejercicio fiscal vigente.
                </p>
              </div>
            </section>

            {/* ── Sección 2: Quién hay detrás ── */}
            <section className="mb-12">
              <SectionTitle>Quién hay detrás</SectionTitle>
              <div
                className="rounded-2xl p-6 flex flex-col sm:flex-row gap-5"
                style={{
                  background: "rgba(13,13,26,0.8)",
                  border: "1px solid rgba(99,102,241,0.22)",
                }}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-syne font-extrabold text-xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(129,140,248,0.15) 100%)",
                      border: "1px solid rgba(99,102,241,0.35)",
                      color: "#818cf8",
                    }}
                    aria-hidden="true"
                  >
                    AC
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-syne font-bold text-base mb-0.5" style={{ color: "#f0f0ff" }}>
                    Alex Cebolla Pardo
                  </p>
                  <p className="text-xs font-medium mb-3" style={{ color: "#6366f1" }}>
                    Desarrollador y responsable de contenidos
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#9090b8" }}>
                    Desarrollador especializado en automatización y herramientas web. Creé esta calculadora porque
                    necesitaba una herramienta precisa y transparente para calcular nóminas y no encontraba ninguna
                    que explicara claramente cómo hace los cálculos.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 text-xs" style={{ color: "#6060a0" }}>
                    <span>
                      ✉{" "}
                      <a
                        href="mailto:contact.acebolla@gmail.com"
                        className="hover:underline transition-colors"
                        style={{ color: "#818cf8" }}
                      >
                        contact.acebolla@gmail.com
                      </a>
                    </span>
                    <span style={{ color: "#3a3a5a" }} className="hidden sm:inline">·</span>
                    <span>NIF: 20860672V</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Sección 3: Cómo garantizamos la precisión ── */}
            <section className="mb-12">
              <SectionTitle>Cómo garantizamos la precisión</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    icon: "🔍",
                    title: "Fuentes oficiales únicamente",
                    text: "Todos los datos provienen de la AEAT, BOE y TGSS. No usamos estimaciones ni datos de terceros.",
                  },
                  {
                    icon: "🔄",
                    title: "Actualización anual",
                    text: "Cada enero revisamos y actualizamos los tramos IRPF, cotizaciones SS y mínimos personales con los datos oficiales del nuevo ejercicio.",
                  },
                  {
                    icon: "✅",
                    title: "Verificación cruzada",
                    text: "Cada actualización se contrasta con el simulador oficial de la AEAT y con nóminas reales para garantizar la precisión.",
                  },
                  {
                    icon: "📋",
                    title: "Transparencia total",
                    text: "Publicamos nuestra metodología completa para que cualquier persona pueda revisar cómo calculamos.",
                  },
                ].map((item) => (
                  <Card key={item.title}>
                    <div className="text-2xl mb-3" aria-hidden="true">{item.icon}</div>
                    <p className="font-semibold text-sm mb-2" style={{ color: "#d0d0f0" }}>
                      {item.title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
                      {item.text}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            {/* ── Sección 4: Fuentes oficiales ── */}
            <section className="mb-12">
              <SectionTitle>Nuestras fuentes oficiales</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    icon: "🏛️",
                    name: "AEAT",
                    full: "Agencia Estatal de Administración Tributaria",
                    desc: "Tablas de retenciones, tramos IRPF, mínimos personales y familiares.",
                    href: "https://www.agenciatributaria.gob.es",
                    label: "agenciatributaria.gob.es",
                  },
                  {
                    icon: "📜",
                    name: "BOE",
                    full: "Boletín Oficial del Estado",
                    desc: "Ley 35/2006 del IRPF y Real Decreto de Presupuestos Generales.",
                    href: "https://www.boe.es",
                    label: "boe.es",
                  },
                  {
                    icon: "🏢",
                    name: "TGSS",
                    full: "Tesorería General de la Seguridad Social",
                    desc: "Tipos de cotización y bases máximas y mínimas 2026.",
                    href: "https://www.seg-social.es",
                    label: "seg-social.es",
                  },
                ].map((src) => (
                  <div
                    key={src.name}
                    className="rounded-2xl p-5 flex flex-col gap-3"
                    style={{
                      background: "rgba(13,13,26,0.8)",
                      border: "1px solid rgba(99,102,241,0.14)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">{src.icon}</span>
                      <div>
                        <p className="font-syne font-bold text-sm" style={{ color: "#e0e0ff" }}>
                          {src.name}
                        </p>
                        <p className="text-xs" style={{ color: "#5a5a80" }}>{src.full}</p>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#8080a8" }}>{src.desc}</p>
                    <a
                      href={src.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium flex items-center gap-1 hover:underline transition-colors"
                      style={{ color: "#818cf8" }}
                    >
                      {src.label}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Sección 5: Limitaciones ── */}
            <section className="mb-12">
              <SectionTitle>Limitaciones y aviso legal</SectionTitle>
              <div
                className="rounded-2xl p-6 flex gap-4"
                style={{
                  background: "rgba(234,179,8,0.06)",
                  border: "1px solid rgba(234,179,8,0.18)",
                }}
              >
                <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">⚠️</span>
                <div>
                  <p className="font-semibold text-sm mb-2" style={{ color: "#fde68a" }}>
                    Cálculo orientativo
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#a09060" }}>
                    Los resultados de esta calculadora tienen carácter orientativo. El cálculo aplica la normativa
                    general sin considerar deducciones específicas, rentas del capital, situaciones especiales o
                    cambios legislativos sobrevenidos. Para decisiones fiscales concretas, consulta con un{" "}
                    <strong style={{ color: "#c0a070" }}>asesor fiscal o laboral colegiado</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* ── Sección 6: Timeline ── */}
            <section className="mb-12">
              <SectionTitle>Historial de actualizaciones</SectionTitle>
              <div className="flex flex-col gap-0">
                {[
                  {
                    date: "Marzo 2026",
                    text: "Implementada calculadora por comunidad autónoma con tramos autonómicos reales.",
                  },
                  {
                    date: "Marzo 2026",
                    text: "Añadidas páginas de salario específico para 12 niveles salariales (15k–70k).",
                  },
                  {
                    date: "Marzo 2026",
                    text: "Lanzamiento de CalculadoraNomina.org con tramos IRPF 2026 y cotizaciones SS actualizadas.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Line + dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-3 h-3 rounded-full shrink-0 mt-1"
                        style={{
                          background: "#6366f1",
                          boxShadow: "0 0 8px rgba(99,102,241,0.5)",
                        }}
                      />
                      {i < 2 && (
                        <div
                          className="w-px flex-1 mt-1"
                          style={{ background: "rgba(99,102,241,0.2)", minHeight: "28px" }}
                        />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-6">
                      <p className="text-xs font-semibold mb-1" style={{ color: "#6366f1" }}>
                        {item.date}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "#9090b8" }}>
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Sección 7: CTA ── */}
            <section>
              <div
                className="rounded-2xl p-6 md:p-8 text-center"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(129,140,248,0.08) 100%)",
                  border: "1px solid rgba(99,102,241,0.25)",
                }}
              >
                <p className="font-syne font-bold mb-2" style={{ fontSize: "1.1rem", color: "#e0e0ff" }}>
                  ¿Tienes alguna duda o encontraste un error?
                </p>
                <p className="text-sm mb-5" style={{ color: "#7c7ca0" }}>
                  Si detectas alguna imprecisión en los cálculos o tienes una sugerencia, escríbenos.
                  Revisamos todos los mensajes.
                </p>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #818cf8)",
                    color: "#fff",
                    boxShadow: "0 2px 14px rgba(99,102,241,0.35)",
                  }}
                >
                  Contactar →
                </Link>
              </div>
            </section>

          </div>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
