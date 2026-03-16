import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de Calculadora de Nómina. Información sobre el tratamiento de datos personales conforme al RGPD.",
  robots: { index: false, follow: false },
};

export default function PoliticaPrivacidadPage() {
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
              <span style={{ color: "#7c7ca0" }}>Política de privacidad</span>
            </nav>

            <h1 className="font-syne font-bold mb-8" style={{ fontSize: "clamp(1.6rem, 5vw, 2.2rem)", color: "#f0f0ff" }}>
              Política de Privacidad
            </h1>

            <div className="blog-prose">

              <h2>1. Responsable del tratamiento</h2>
              <ul>
                <li><strong>Responsable:</strong> Alex Cebolla Pardo</li>
                <li><strong>NIF:</strong> 20860672V</li>
                <li><strong>Correo electrónico:</strong> contact.acebolla@gmail.com</li>
                <li><strong>Sitio web:</strong> calculadoranomina.org</li>
              </ul>

              <h2>2. Datos que recogemos</h2>
              <p>
                La calculadora de nómina funciona íntegramente en el navegador del usuario y
                <strong> no recopila, almacena ni transmite datos personales</strong> de carácter
                económico, fiscal o laboral introducidos en el formulario. Los cálculos se realizan
                localmente en el dispositivo del usuario.
              </p>
              <p>
                No obstante, el sitio web utiliza <strong>Google Analytics 4 (GA4)</strong>, un servicio
                de analítica web de Google LLC, que recoge de forma automática ciertos datos técnicos de
                navegación con el fin de entender cómo los usuarios interactúan con el sitio:
              </p>
              <ul>
                <li>Dirección IP anonimizada</li>
                <li>Tipo de dispositivo, sistema operativo y navegador</li>
                <li>País y ciudad de origen (no dirección exacta)</li>
                <li>Páginas visitadas y duración de la sesión</li>
                <li>Fuente de tráfico (búsqueda orgánica, referencia, directo)</li>
              </ul>
              <p>
                Estos datos <strong>no permiten identificar individualmente</strong> a ningún usuario y
                son tratados de forma agregada y estadística.
              </p>

              <h2>3. Base legal del tratamiento</h2>
              <p>
                El tratamiento de datos de analítica se basa en el <strong>interés legítimo</strong> del
                responsable (art. 6.1.f RGPD) para mejorar el servicio y comprender el comportamiento
                de uso, siempre que dicho interés no prevalezca sobre los derechos y libertades del
                interesado.
              </p>
              <p>
                Para el uso de cookies no esenciales (analítica), se requiere y obtiene el
                <strong> consentimiento previo</strong> del usuario conforme al art. 6.1.a RGPD y la
                normativa de cookies aplicable.
              </p>

              <h2>4. Destinatarios y transferencias internacionales</h2>
              <p>
                Los datos de analítica son procesados por <strong>Google LLC</strong>, con sede en
                Estados Unidos. Google actúa como encargado del tratamiento y ha suscrito las Cláusulas
                Contractuales Tipo aprobadas por la Comisión Europea, garantizando un nivel adecuado de
                protección para las transferencias internacionales de datos.
              </p>
              <p>
                Más información en la{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  política de privacidad de Google
                </a>.
              </p>

              <h2>5. Plazo de conservación</h2>
              <p>
                Los datos de analítica se conservan durante un máximo de <strong>14 meses</strong> en
                los servidores de Google Analytics, tras los cuales son eliminados automáticamente.
              </p>

              <h2>6. Derechos del usuario</h2>
              <p>
                Conforme al Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018
                (LOPDGDD), el usuario tiene derecho a:
              </p>
              <ul>
                <li><strong>Acceso:</strong> conocer qué datos personales se tratan.</li>
                <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos.</li>
                <li><strong>Supresión:</strong> solicitar la eliminación de sus datos ("derecho al olvido").</li>
                <li><strong>Limitación del tratamiento:</strong> solicitar que se restrinja el uso de sus datos en determinadas circunstancias.</li>
                <li><strong>Portabilidad:</strong> recibir sus datos en un formato estructurado y de uso común.</li>
                <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos basado en interés legítimo.</li>
                <li><strong>Retirada del consentimiento:</strong> cuando el tratamiento se base en el consentimiento, el usuario puede retirarlo en cualquier momento sin que ello afecte a la licitud del tratamiento anterior.</li>
              </ul>
              <p>
                Para ejercer cualquiera de estos derechos, el usuario puede dirigirse al responsable
                mediante correo electrónico a <strong>contact.acebolla@gmail.com</strong>, adjuntando
                copia de su documento de identidad.
              </p>
              <p>
                Asimismo, el usuario tiene derecho a presentar una reclamación ante la{" "}
                <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
                  Agencia Española de Protección de Datos (AEPD)
                </a>{" "}
                si considera que el tratamiento de sus datos no es conforme a la normativa.
              </p>

              <h2>7. Cookies</h2>
              <p>
                El sitio web utiliza cookies. Para información detallada sobre los tipos de cookies
                utilizadas y cómo gestionarlas, consulte la{" "}
                <Link href="/politica-cookies">Política de cookies</Link>.
              </p>

              <h2>8. Modificaciones</h2>
              <p>
                El responsable se reserva el derecho a modificar la presente política de privacidad
                para adaptarla a cambios legislativos o de los servicios prestados. Se informará al
                usuario de cambios sustanciales cuando sea posible.
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
