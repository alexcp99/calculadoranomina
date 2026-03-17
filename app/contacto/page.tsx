import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta con el equipo de Calculadora de Nómina para reportar errores, sugerencias o consultas sobre metodología. Respondemos en 48–72 horas.",
  alternates: { canonical: "https://calculadoranomina.org/contacto" },
  openGraph: {
    title: "Contacto — Calculadora de Nómina",
    description: "Reporta errores, envía sugerencias o consulta sobre la metodología de cálculo. Respondemos en 48–72 horas.",
    url: "https://calculadoranomina.org/contacto",
    type: "website",
  },
};

export default function ContactoPage() {
  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
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
          <div className="max-w-xl mx-auto">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs mb-8" style={{ color: "#4a4a6a" }}>
              <Link href="/" className="hover:underline" style={{ color: "#818CF8" }}>
                Inicio
              </Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#7c7ca0" }}>Contacto</span>
            </nav>

            {/* Header */}
            <h1
              className="font-syne font-extrabold tracking-tight mb-3"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.2rem)", color: "#f0f0ff" }}
            >
              Contacto
            </h1>
            <p className="text-sm leading-relaxed mb-10" style={{ color: "#a0a0c0" }}>
              ¿Has encontrado un error en los cálculos, tienes una sugerencia de mejora o quieres
              consultarnos algo sobre la metodología que usamos? Escríbenos.
            </p>

            {/* Contact card */}
            <div
              className="rounded-2xl p-6 md:p-8 mb-6"
              style={{ background: "#0c0c1e", border: "1px solid rgba(99,102,241,0.22)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#6060a0" }}>
                Correo electrónico
              </p>
              <a
                href="mailto:contact.acebolla@gmail.com"
                className="font-syne font-bold text-lg hover:underline"
                style={{ color: "#818cf8" }}
              >
                contact.acebolla@gmail.com
              </a>
              <p className="text-xs mt-3" style={{ color: "#6060a0" }}>
                Tiempo de respuesta estimado: <span style={{ color: "#a0a0c0" }}>48–72 horas</span>
              </p>
            </div>

            {/* What to write about */}
            <div
              className="rounded-2xl p-6 mb-6"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#6060a0" }}>
                Puedes escribirnos sobre
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  ["🐛", "Errores en los cálculos", "Si el resultado no coincide con tu nómina real o con el de la AEAT."],
                  ["💡", "Sugerencias de mejora", "Nuevas funcionalidades, casos no contemplados o mejoras de usabilidad."],
                  ["📊", "Consultas sobre metodología", "Dudas sobre cómo aplicamos los tramos del IRPF, SS u otros conceptos."],
                  ["✍️", "Colaboraciones y contenido", "Si quieres colaborar en artículos del blog o proponer temas."],
                ].map(([icon, title, desc]) => (
                  <li key={title} className="flex gap-3">
                    <span className="text-base shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#c0c0e0" }}>{title}</p>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: "#6060a0" }}>{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div
              className="rounded-xl px-4 py-4 flex gap-3"
              style={{
                background: "rgba(248,113,113,0.06)",
                border: "1px solid rgba(248,113,113,0.18)",
              }}
            >
              <span className="text-sm shrink-0 mt-0.5">⚠️</span>
              <p className="text-xs leading-relaxed" style={{ color: "#a08080" }}>
                <strong style={{ color: "#f0b0b0" }}>No ofrecemos asesoría fiscal personalizada.</strong>{" "}
                Esta herramienta proporciona cálculos orientativos basados en la normativa general. Para
                situaciones específicas, consulta con un asesor fiscal o gestor habilitado.
              </p>
            </div>

            {/* Back links */}
            <div className="flex gap-4 mt-10">
              <Link href="/" className="text-sm hover:underline" style={{ color: "#818CF8" }}>
                ← Ir a la calculadora
              </Link>
              <Link href="/preguntas-frecuentes" className="text-sm hover:underline" style={{ color: "#818CF8" }}>
                Ver preguntas frecuentes →
              </Link>
            </div>

          </div>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
