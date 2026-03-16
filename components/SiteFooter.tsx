import Link from "next/link";

export default function SiteFooter({ year }: { year?: number }) {
  const currentYear = year ?? new Date().getFullYear();
  return (
    <footer
      className="w-full px-4 pt-10 pb-8"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-syne font-bold text-sm"
              style={{ color: "#e0e0ff" }}
            >
              Calculadora<span style={{ color: "#818cf8" }}>Nomina</span>
              <span style={{ color: "#4a4a6a" }}>.org</span>
            </Link>
            <p className="text-xs mt-2 max-w-xs leading-relaxed" style={{ color: "#3e3e60" }}>
              Cálculos orientativos basados en la normativa AEAT 2026. No sustituye asesoría fiscal profesional.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#4a4a6a" }}>
                Herramienta
              </p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/" className="text-xs hover:underline" style={{ color: "#7c7ca0" }}>
                    Calculadora de nómina
                  </Link>
                </li>
                <li>
                  <Link href="/metodologia" className="text-xs hover:underline" style={{ color: "#7c7ca0" }}>
                    Cómo calculamos
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-xs hover:underline" style={{ color: "#7c7ca0" }}>
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#4a4a6a" }}>
                Legal
              </p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/aviso-legal" className="text-xs hover:underline" style={{ color: "#7c7ca0" }}>
                    Aviso legal
                  </Link>
                </li>
                <li>
                  <Link href="/politica-privacidad" className="text-xs hover:underline" style={{ color: "#7c7ca0" }}>
                    Política de privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/politica-cookies" className="text-xs hover:underline" style={{ color: "#7c7ca0" }}>
                    Política de cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs" style={{ color: "#3e3e60" }}>
            Datos oficiales AEAT · España · {currentYear}
          </p>
          <p className="text-xs" style={{ color: "#2a2a40" }}>
            Cálculos con fines orientativos. Consulta con un asesor fiscal.
          </p>
        </div>
      </div>
    </footer>
  );
}
