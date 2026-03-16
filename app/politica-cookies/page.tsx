import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Política de cookies de Calculadora de Nómina. Qué cookies utilizamos, para qué y cómo desactivarlas.",
  robots: { index: false, follow: false },
};

export default function PoliticaCookiesPage() {
  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.08) 0%, transparent 65%)" }}
        aria-hidden
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 px-4 pt-10 pb-16 md:pt-16">
          <div className="max-w-2xl mx-auto">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: "#4a4a6a" }}>
              <Link href="/" style={{ color: "#818CF8" }} className="hover:underline">Inicio</Link>
              <span>/</span>
              <span style={{ color: "#7c7ca0" }}>Política de cookies</span>
            </nav>

            <h1 className="font-syne font-bold mb-8" style={{ fontSize: "clamp(1.6rem, 5vw, 2.2rem)", color: "#f0f0ff" }}>
              Política de Cookies
            </h1>

            <div className="blog-prose">

              <h2>1. ¿Qué son las cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que los sitios web depositan en el dispositivo
                del usuario al visitar una página. Se utilizan para recordar preferencias, analizar el
                comportamiento de navegación y mejorar la experiencia del usuario.
              </p>
              <p>
                En España, el uso de cookies no estrictamente necesarias está regulado por la Ley 34/2002
                de Servicios de la Sociedad de la Información (LSSICE) y el Reglamento General de
                Protección de Datos (RGPD), que exigen el consentimiento informado del usuario.
              </p>

              <h2>2. Cookies propias</h2>
              <p>
                Este sitio web <strong>no utiliza cookies propias</strong> de sesión ni persistentes
                para fines de personalización, preferencias o autenticación. La calculadora funciona
                íntegramente en el navegador sin necesidad de almacenar datos en el dispositivo del usuario.
              </p>

              <h2>3. Cookies de terceros</h2>
              <p>
                El sitio web utiliza el servicio <strong>Google Analytics 4 (GA4)</strong> de Google LLC
                para recopilar información estadística anónima sobre el uso del sitio. GA4 puede instalar
                las siguientes cookies:
              </p>

              <table>
                <thead>
                  <tr>
                    <th>Cookie</th>
                    <th>Proveedor</th>
                    <th>Finalidad</th>
                    <th>Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>_ga</code></td>
                    <td>Google Analytics</td>
                    <td>Distinguir usuarios únicos mediante un identificador anónimo</td>
                    <td>2 años</td>
                  </tr>
                  <tr>
                    <td><code>_ga_*</code></td>
                    <td>Google Analytics</td>
                    <td>Mantener el estado de la sesión de analítica</td>
                    <td>2 años</td>
                  </tr>
                </tbody>
              </table>

              <p>
                Estas cookies <strong>no recogen información personal identificable</strong>. Los datos
                obtenidos se utilizan exclusivamente para mejorar el servicio y comprender el
                comportamiento general de los usuarios.
              </p>

              <h2>4. Cómo gestionar o desactivar las cookies</h2>
              <p>
                El usuario puede gestionar, bloquear o eliminar las cookies desde la configuración de
                su navegador. A continuación se indican los enlaces de ayuda de los principales navegadores:
              </p>
              <ul>
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web" target="_blank" rel="noopener noreferrer">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                    Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
                    Microsoft Edge
                  </a>
                </li>
              </ul>
              <p>
                Ten en cuenta que deshabilitar las cookies de analítica no afecta al funcionamiento
                de la calculadora.
              </p>
              <p>
                También puedes optar por no ser rastreado por Google Analytics instalando el{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                  complemento de inhabilitación para navegadores de Google Analytics
                </a>.
              </p>

              <h2>5. Más información</h2>
              <p>
                Para más información sobre el tratamiento de datos personales, consulta nuestra{" "}
                <Link href="/politica-privacidad">Política de privacidad</Link>. Para cualquier consulta
                relacionada con el uso de cookies, puedes contactarnos en{" "}
                <strong>contact.acebolla@gmail.com</strong>.
              </p>

              <p style={{ color: "#8080a0", fontSize: "0.8rem", marginTop: "2rem" }}>
                Última actualización: marzo 2026
              </p>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
