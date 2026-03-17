import Link from "next/link";

export default function SiteFooter({ year }: { year?: number }) {
  const currentYear = year ?? new Date().getFullYear();
  return (
    <footer
      className="w-full px-4 pt-5 pb-4"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-syne font-bold text-sm"
              style={{ color: "#e0e0ff" }}
            >
              Calculadora<span style={{ color: "#818cf8" }}>Nomina</span>
              <span style={{ color: "#6060a0" }}>.org</span>
            </Link>
            <p className="text-xs mt-2 max-w-xs leading-relaxed" style={{ color: "#a0a0c0" }}>
              Cálculos orientativos basados en la normativa AEAT 2026. No sustituye asesoría fiscal profesional.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#6060a0" }}>
                Calculadoras por salario
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {[
                  { slug: "15000", label: "15.000€ brutos" },
                  { slug: "16000", label: "16.000€ brutos" },
                  { slug: "18000", label: "18.000€ brutos" },
                  { slug: "20000", label: "20.000€ brutos" },
                  { slug: "22000", label: "22.000€ brutos" },
                  { slug: "24000", label: "24.000€ brutos" },
                  { slug: "25000", label: "25.000€ brutos" },
                  { slug: "28000", label: "28.000€ brutos" },
                  { slug: "30000", label: "30.000€ brutos" },
                  { slug: "32000", label: "32.000€ brutos" },
                  { slug: "35000", label: "35.000€ brutos" },
                  { slug: "40000", label: "40.000€ brutos" },
                  { slug: "45000", label: "45.000€ brutos" },
                  { slug: "50000", label: "50.000€ brutos" },
                  { slug: "60000", label: "60.000€ brutos" },
                  { slug: "70000", label: "70.000€ brutos" },
                  { slug: "80000", label: "80.000€ brutos" },
                  { slug: "100000", label: "100.000€ brutos" },
                ].map(({ slug, label }) => (
                  <Link
                    key={slug}
                    href={`/cuanto-es-${slug}-euros-brutos-neto`}
                    className="text-xs hover:underline"
                    style={{ color: "#a0a0c0" }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#6060a0" }}>
                Herramienta
              </p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/" className="text-xs hover:underline" style={{ color: "#a0a0c0" }}>
                    Calculadora de nómina
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-xs hover:underline" style={{ color: "#a0a0c0" }}>
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#6060a0" }}>
                Información
              </p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/sobre-nosotros" className="text-xs hover:underline" style={{ color: "#a0a0c0" }}>
                    Sobre nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/metodologia" className="text-xs hover:underline" style={{ color: "#a0a0c0" }}>
                    Metodología
                  </Link>
                </li>
                <li>
                  <Link href="/preguntas-frecuentes" className="text-xs hover:underline" style={{ color: "#a0a0c0" }}>
                    Preguntas frecuentes
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="text-xs hover:underline" style={{ color: "#a0a0c0" }}>
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#6060a0" }}>
                Legal
              </p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/aviso-legal" className="text-xs hover:underline" style={{ color: "#a0a0c0" }}>
                    Aviso legal y términos
                  </Link>
                </li>
                <li>
                  <Link href="/politica-privacidad" className="text-xs hover:underline" style={{ color: "#a0a0c0" }}>
                    Política de privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/politica-cookies" className="text-xs hover:underline" style={{ color: "#a0a0c0" }}>
                    Política de cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs" style={{ color: "#a0a0c0" }}>
            Datos oficiales AEAT · España · {currentYear}
          </p>
          <p className="text-xs" style={{ color: "#6060a0" }}>
            Cálculos con fines orientativos. Consulta con un asesor fiscal.
          </p>
        </div>
      </div>
    </footer>
  );
}
