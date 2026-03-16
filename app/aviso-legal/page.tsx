import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: "Aviso legal de Calculadora de Nómina. Datos del titular, propiedad intelectual, limitación de responsabilidad y jurisdicción aplicable.",
  robots: { index: false, follow: false },
};

export default function AvisoLegalPage() {
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
              <span style={{ color: "#7c7ca0" }}>Aviso legal</span>
            </nav>

            <h1 className="font-syne font-bold mb-8" style={{ fontSize: "clamp(1.6rem, 5vw, 2.2rem)", color: "#f0f0ff" }}>
              Aviso Legal
            </h1>

            <div className="blog-prose">

              <h2>1. Datos del titular</h2>
              <p>
                En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
                Sociedad de la Información y de Comercio Electrónico (LSSICE), se facilitan los siguientes
                datos identificativos del titular del sitio web:
              </p>
              <ul>
                <li><strong>Titular:</strong> Alex Cebolla Pardo</li>
                <li><strong>NIF:</strong> 20860672V</li>
                <li><strong>Correo electrónico:</strong> contact.acebolla@gmail.com</li>
                <li><strong>Sitio web:</strong> calculadoranomina.org</li>
              </ul>

              <h2>2. Objeto y condiciones de uso</h2>
              <p>
                El presente sitio web tiene por objeto ofrecer una herramienta de cálculo orientativo del
                salario neto a partir del salario bruto, y viceversa, aplicando los parámetros fiscales y
                de cotización a la Seguridad Social vigentes en España según la normativa de la Agencia
                Estatal de Administración Tributaria (AEAT) para el ejercicio 2026.
              </p>
              <p>
                El acceso y uso del sitio web es libre y gratuito. El usuario se compromete a hacer un uso
                lícito del mismo, respetando la legalidad vigente y los derechos del titular y de terceros.
              </p>

              <h2>3. Carácter orientativo de los cálculos</h2>
              <p>
                Los resultados ofrecidos por la calculadora tienen <strong>carácter meramente orientativo</strong>.
                Los cálculos se basan en la normativa fiscal y de cotización vigente con carácter general,
                sin tener en cuenta particularidades individuales, deducciones específicas, situaciones
                especiales ni posibles cambios legislativos sobrevenidos.
              </p>
              <p>
                El titular no garantiza la exactitud, completitud o actualización de los resultados en
                ningún caso concreto. Para obtener información precisa sobre la situación fiscal y laboral
                del usuario, se recomienda consultar con un asesor fiscal o laboral debidamente habilitado.
              </p>

              <h2>4. Propiedad intelectual e industrial</h2>
              <p>
                Todos los contenidos del sitio web —incluyendo, sin carácter limitativo, textos, imágenes,
                diseño gráfico, código fuente, logotipos y marcas— son propiedad del titular o se reproducen
                con la debida autorización, y están protegidos por la legislación española e internacional
                sobre propiedad intelectual e industrial.
              </p>
              <p>
                Queda expresamente prohibida la reproducción, distribución, comunicación pública o
                transformación de los contenidos sin autorización expresa del titular, salvo que se trate
                de uso personal y no comercial, o que la normativa aplicable lo permita expresamente.
              </p>

              <h2>5. Limitación de responsabilidad</h2>
              <p>
                El titular no se hace responsable de los daños y perjuicios que pudieran derivarse de:
              </p>
              <ul>
                <li>El uso de los resultados de la calculadora como base para decisiones económicas, fiscales o laborales sin consulta profesional previa.</li>
                <li>Errores, omisiones o inexactitudes en los datos facilitados por el usuario.</li>
                <li>Cambios legislativos posteriores a la fecha de actualización de la herramienta.</li>
                <li>Interrupciones, fallos técnicos o indisponibilidad del servicio.</li>
                <li>Contenido de sitios web de terceros enlazados desde este sitio.</li>
              </ul>

              <h2>6. Política de privacidad y cookies</h2>
              <p>
                El tratamiento de los datos personales de los usuarios se rige por la{" "}
                <Link href="/politica-privacidad">Política de privacidad</Link> y la{" "}
                <Link href="/politica-cookies">Política de cookies</Link> del sitio web,
                accesibles desde el pie de página.
              </p>

              <h2>7. Ley aplicable y jurisdicción</h2>
              <p>
                El presente aviso legal se rige en su integridad por la legislación española. Para la
                resolución de cualquier controversia que pudiera surgir en relación con el acceso o uso
                del sitio web, las partes se someten, con renuncia expresa a cualquier otro fuero que
                pudiera corresponderles, a la jurisdicción de los <strong>Juzgados y Tribunales de Valencia</strong>.
              </p>

              <h2>8. Modificaciones</h2>
              <p>
                El titular se reserva el derecho a modificar, en cualquier momento y sin previo aviso,
                el contenido del presente aviso legal. Se recomienda revisar periódicamente este documento.
              </p>

              <p style={{ color: "#3e3e60", fontSize: "0.8rem", marginTop: "2rem" }}>
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
