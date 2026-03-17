import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Cómo calculamos — Metodología AEAT 2026",
  description:
    "Explicación detallada de cómo calcula la calculadora de nómina: cotizaciones SS, tramos IRPF 2026 por comunidad autónoma, mínimos personales y familiares. Fuentes AEAT y BOE.",
  alternates: { canonical: "https://calculadoranomina.org/metodologia" },
  openGraph: {
    title: "Cómo calculamos — Metodología AEAT 2026",
    description: "Explicación completa del algoritmo de cálculo: SS, IRPF, tramos autonómicos y fuentes oficiales.",
    url: "https://calculadoranomina.org/metodologia",
    type: "website",
  },
};

// ─── Data tables ─────────────────────────────────────────────────────────────

const ESTATAL = [
  { desde: "0 €", hasta: "12.450 €", tipo: "9,50 %" },
  { desde: "12.450 €", hasta: "20.200 €", tipo: "12,00 %" },
  { desde: "20.200 €", hasta: "35.200 €", tipo: "15,00 %" },
  { desde: "35.200 €", hasta: "60.000 €", tipo: "18,50 %" },
  { desde: "60.000 €", hasta: "300.000 €", tipo: "22,50 %" },
  { desde: "300.000 €", hasta: "∞", tipo: "24,50 %" },
];

const AUTONOMICA: {
  ccaa: string;
  tramos: string;
  nota?: string;
}[] = [
  { ccaa: "Andalucía", tramos: "9,50 % · 12,00 % · 15,00 % · 18,50 % · 22,50 % · 24,50 %" },
  { ccaa: "Aragón", tramos: "10,00 % · 12,50 % · 14,00 % · 18,50 % · 22,50 % · 24,50 %" },
  { ccaa: "Asturias", tramos: "10,00 % · 12,00 % · 14,00 % · 18,50 % · 21,50 % · 22,50 % · 25,00 % · 25,50 %" },
  { ccaa: "Islas Baleares", tramos: "9,50 % · 12,50 % · 15,50 % · 20,00 % · 22,50 % · 24,00 % · 25,00 %" },
  { ccaa: "Canarias", tramos: "9,00 % · 11,50 % · 14,00 % · 18,50 % · 22,50 % · 24,50 %" },
  { ccaa: "Cantabria", tramos: "10,00 % · 12,50 % · 15,00 % · 19,00 % · 22,50 % · 24,00 % · 25,00 %" },
  { ccaa: "Castilla-La Mancha", tramos: "9,50 % · 12,00 % · 15,00 % · 18,50 % · 22,50 % · 24,50 %" },
  { ccaa: "Castilla y León", tramos: "9,50 % · 12,00 % · 15,00 % · 18,50 % · 22,50 % · 24,50 %" },
  { ccaa: "Cataluña", tramos: "10,50 % · 12,00 % · 14,00 % · 15,00 % · 18,80 % · 21,50 % · 23,50 % · 24,50 % · 25,50 %" },
  { ccaa: "Extremadura", tramos: "10,00 % · 12,00 % · 15,50 % · 20,00 % · 22,50 % · 25,00 % · 24,50 %" },
  { ccaa: "Galicia", tramos: "9,50 % · 11,50 % · 14,50 % · 18,50 % · 22,50 % · 24,50 %" },
  { ccaa: "La Rioja", tramos: "9,50 % · 12,00 % · 15,00 % · 18,50 % · 22,50 % · 24,50 %" },
  { ccaa: "Comunidad de Madrid", tramos: "9,00 % · 11,20 % · 13,30 % · 17,90 % · 21,00 % · 22,50 % · 22,50 % · 24,00 %", nota: "Tipos más bajos del régimen común" },
  { ccaa: "Región de Murcia", tramos: "9,50 % · 12,00 % · 15,00 % · 19,00 % · 22,50 % · 24,50 %" },
  { ccaa: "Comunitat Valenciana", tramos: "10,00 % · 12,00 % · 14,00 % · 17,50 % · 19,00 % · 21,00 % · 22,00 % · 24,00 % · 25,00 %" },
  { ccaa: "Navarra (Foral)", tramos: "13,00 % · 19,00 % · 24,00 % · 30,00 % · 36,00 % · 40,00 % · 45,00 %", nota: "Tipo combinado — régimen foral propio" },
  { ccaa: "País Vasco (Foral)", tramos: "23,00 % · 28,00 % · 35,00 % · 40,00 % · 45,00 % · 49,00 %", nota: "Tipo combinado — régimen foral propio" },
  { ccaa: "Ceuta", tramos: "7,50 % · 9,00 % · 11,50 % · 14,50 % · 17,50 % · 19,50 %", nota: "Con bonificación del 50 % aplicada" },
  { ccaa: "Melilla", tramos: "7,50 % · 9,00 % · 11,50 % · 14,50 % · 17,50 % · 19,50 %", nota: "Con bonificación del 50 % aplicada" },
];

// ─── Components ──────────────────────────────────────────────────────────────

function Section({ id, icon, title, children }: {
  id: string;
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <span
          className="flex items-center justify-center w-9 h-9 rounded-xl text-lg shrink-0"
          style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}
        >
          {icon}
        </span>
        <h2 className="font-syne font-bold" style={{ fontSize: "1.2rem", color: "#e0e0ff" }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl px-4 py-4 mb-5 text-sm leading-relaxed"
      style={{
        background: "rgba(99,102,241,0.06)",
        border: "1px solid rgba(99,102,241,0.18)",
        color: "#8888b0",
      }}
    >
      {children}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mb-5">
      <div
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
        style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}
      >
        {n}
      </div>
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#c0c0e0" }}>{title}</p>
        <p className="text-sm leading-relaxed" style={{ color: "#8888b0" }}>{children}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MetodologiaPage() {
  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.13) 0%, transparent 65%)" }}
        aria-hidden
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 px-4 pt-10 pb-16 md:pt-16">
          <div className="max-w-2xl mx-auto">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs mb-8" style={{ color: "#4a4a6a" }}>
              <Link href="/" style={{ color: "#818CF8" }} className="hover:underline">Inicio</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#7c7ca0" }}>Cómo calculamos</span>
            </nav>

            {/* Header */}
            <div className="mb-10">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.22)", color: "#818CF8" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }} />
                Metodología · AEAT 2026
              </div>
              <h1 className="font-syne font-extrabold tracking-tight mb-3" style={{ fontSize: "clamp(1.6rem, 5vw, 2.5rem)", color: "#f0f0ff" }}>
                Cómo calculamos tu nómina
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: "#8888b0" }}>
                Nuestra calculadora aplica el algoritmo oficial de la AEAT para el cálculo de retenciones
                del IRPF y las cotizaciones a la Seguridad Social conforme a la normativa vigente en 2026.
                En esta página explicamos exactamente qué hacemos, paso a paso, con total transparencia.
              </p>
            </div>

            {/* ── Índice ── */}
            <nav
              className="rounded-2xl p-5 mb-10 text-sm"
              style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#4a4a6a" }}>Contenido</p>
              <ol className="flex flex-col gap-1.5" style={{ color: "#7c7ca0" }}>
                {[
                  ["#ss", "1. Seguridad Social (SS)"],
                  ["#irpf-proceso", "2. Proceso de cálculo del IRPF"],
                  ["#tramos-estatales", "3. Tramos IRPF estatales 2026"],
                  ["#tramos-autonomicos", "4. Tramos IRPF autonómicos por CCAA"],
                  ["#minimos", "5. Mínimo personal y familiar"],
                  ["#limitaciones", "6. Limitaciones del cálculo"],
                  ["#fuentes", "7. Fuentes oficiales"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a href={href} className="hover:underline" style={{ color: "#818cf8" }}>{label}</a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* ── 1. Seguridad Social ── */}
            <Section id="ss" icon="🔒" title="Seguridad Social (SS)">
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#8888b0" }}>
                Las cotizaciones a la Seguridad Social son el primer descuento que se aplica sobre el
                salario bruto. Son obligatorias para todos los trabajadores por cuenta ajena y se calculan
                aplicando tipos porcentuales fijos sobre la base de cotización.
              </p>
              <InfoBox>
                <strong style={{ color: "#c0c0e0" }}>Base de cotización:</strong> equivale al salario bruto mensual
                incluyendo la parte proporcional de las pagas extraordinarias. Está limitada a una
                <strong style={{ color: "#c0c0e0" }}> base máxima de 5.101,20 €/mes</strong> (61.214,40 €/año) en 2026.
              </InfoBox>
              <div
                className="rounded-xl overflow-hidden mb-5"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ background: "rgba(99,102,241,0.08)" }}>
                      <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", color: "#c0c0e0", fontWeight: 600, borderBottom: "1px solid rgba(99,102,241,0.2)" }}>Concepto</th>
                      <th style={{ padding: "0.6rem 0.75rem", textAlign: "right", color: "#c0c0e0", fontWeight: 600, borderBottom: "1px solid rgba(99,102,241,0.2)" }}>Trabajador</th>
                      <th style={{ padding: "0.6rem 0.75rem", textAlign: "right", color: "#c0c0e0", fontWeight: 600, borderBottom: "1px solid rgba(99,102,241,0.2)" }}>Empresa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Contingencias comunes", "4,70 %", "23,60 %"],
                      ["Desempleo (indefinido)", "1,55 %", "5,50 %"],
                      ["Desempleo (temporal)", "1,60 %", "6,70 %"],
                      ["Formación Profesional", "0,10 %", "0,60 %"],
                      ["MEI", "0,15 %", "0,58 %"],
                      ["FOGASA", "—", "0,20 %"],
                    ].map(([c, t, e], i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "0.55rem 0.75rem", color: "#8888b0" }}>{c}</td>
                        <td style={{ padding: "0.55rem 0.75rem", textAlign: "right", color: "#a5b4fc", fontVariantNumeric: "tabular-nums" }}>{t}</td>
                        <td style={{ padding: "0.55rem 0.75rem", textAlign: "right", color: "#8888b0", fontVariantNumeric: "tabular-nums" }}>{e}</td>
                      </tr>
                    ))}
                    <tr style={{ background: "rgba(99,102,241,0.06)" }}>
                      <td style={{ padding: "0.6rem 0.75rem", color: "#c0c0e0", fontWeight: 600 }}>Total (indefinido)</td>
                      <td style={{ padding: "0.6rem 0.75rem", textAlign: "right", color: "#818cf8", fontWeight: 700 }}>6,50 %</td>
                      <td style={{ padding: "0.6rem 0.75rem", textAlign: "right", color: "#8888b0", fontWeight: 600 }}>≈ 30,48 %</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs" style={{ color: "#4a4a6a" }}>
                Fuente: Real Decreto-ley de Presupuestos Generales del Estado 2026 · TGSS
              </p>
            </Section>

            {/* ── 2. Proceso IRPF ── */}
            <Section id="irpf-proceso" icon="📊" title="Proceso de cálculo del IRPF">
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#8888b0" }}>
                El IRPF se calcula sobre una base imponible que resulta de aplicar, en orden, las
                siguientes deducciones y reducciones al salario bruto:
              </p>
              <Step n={1} title="Descuento de cotizaciones a la Seguridad Social">
                Las cotizaciones SS del trabajador (6,50 % para indefinido) se restan del bruto antes
                de calcular el IRPF. Esto reduce la base imponible y, por tanto, el impuesto a pagar.
              </Step>
              <Step n={2} title="Gastos deducibles — Art. 19 LIRPF">
                Se aplican los gastos deducibles por obtención de rendimientos del trabajo:
                las propias cotizaciones SS (ya restadas) más 2.000 € adicionales en concepto de
                otros gastos. Con movilidad geográfica, este importe asciende a 4.000 €.
              </Step>
              <Step n={3} title="Reducción por rendimientos del trabajo — Art. 20 LIRPF">
                Para rentas bajas, se aplica una reducción adicional:
                {" "}<strong style={{ color: "#c0c0e0" }}>6.498 €</strong> si el rendimiento neto es ≤ 14.852 €;
                reducción decreciente entre 14.852 € y 19.747,50 €;
                sin reducción por encima de 19.747,50 €.
              </Step>
              <Step n={4} title="Mínimo personal y familiar">
                Se resta el mínimo personal (desde 5.550 € hasta 8.100 € según edad) y el mínimo
                familiar por hijos, cónyuge sin ingresos y discapacidad. Esta cantidad tributa a
                tipo cero — es la "zona libre de impuestos".
              </Step>
              <Step n={5} title="Aplicación de tramos progresivos">
                Sobre la base de retención resultante se aplican los tramos del IRPF en dos mitades:
                el <strong style={{ color: "#c0c0e0" }}>gravamen estatal</strong> (igual en toda España) y
                el <strong style={{ color: "#c0c0e0" }}>gravamen autonómico</strong> (varía por CCAA).
                Para regímenes forales (País Vasco, Navarra) y ciudades autónomas (Ceuta, Melilla), se
                aplica un tipo combinado único.
              </Step>
              <InfoBox>
                <strong style={{ color: "#c0c0e0" }}>Nota sobre la inversión Neto → Bruto:</strong>{" "}
                Para el cálculo inverso (dado el neto, calcular el bruto necesario), aplicamos búsqueda
                binaria convergente con 60 iteraciones, lo que garantiza una precisión inferior a 1 céntimo.
              </InfoBox>
            </Section>

            {/* ── 3. Tramos estatales ── */}
            <Section id="tramos-estatales" icon="🏛️" title="Tramos IRPF estatales 2026">
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#8888b0" }}>
                Los siguientes tramos son comunes para todos los contribuyentes residentes en España,
                independientemente de su comunidad autónoma. Representan el 50 % del gravamen total del IRPF.
              </p>
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ background: "rgba(99,102,241,0.08)" }}>
                      <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", color: "#c0c0e0", fontWeight: 600, borderBottom: "1px solid rgba(99,102,241,0.2)" }}>Desde</th>
                      <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", color: "#c0c0e0", fontWeight: 600, borderBottom: "1px solid rgba(99,102,241,0.2)" }}>Hasta</th>
                      <th style={{ padding: "0.6rem 0.75rem", textAlign: "right", color: "#c0c0e0", fontWeight: 600, borderBottom: "1px solid rgba(99,102,241,0.2)" }}>Tipo estatal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ESTATAL.map((r, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "0.55rem 0.75rem", color: "#8888b0", fontVariantNumeric: "tabular-nums" }}>{r.desde}</td>
                        <td style={{ padding: "0.55rem 0.75rem", color: "#8888b0", fontVariantNumeric: "tabular-nums" }}>{r.hasta}</td>
                        <td style={{ padding: "0.55rem 0.75rem", textAlign: "right", color: "#a5b4fc", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{r.tipo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* ── 4. Tramos autonómicos ── */}
            <Section id="tramos-autonomicos" icon="🗺️" title="Tramos IRPF autonómicos por CCAA">
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#8888b0" }}>
                El otro 50 % del IRPF lo gestiona cada comunidad autónoma con sus propios tramos. La tabla
                muestra los tipos marginales de menor a mayor para cada CCAA. En regímenes forales y ciudades
                autónomas se indica el tipo combinado total.
              </p>
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                  <thead>
                    <tr style={{ background: "rgba(99,102,241,0.08)" }}>
                      <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", color: "#c0c0e0", fontWeight: 600, borderBottom: "1px solid rgba(99,102,241,0.2)", whiteSpace: "nowrap" }}>CCAA</th>
                      <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", color: "#c0c0e0", fontWeight: 600, borderBottom: "1px solid rgba(99,102,241,0.2)" }}>Tipos marginales (de menor a mayor)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AUTONOMICA.map((r, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "0.55rem 0.75rem", color: "#c0c0e0", fontWeight: 500, whiteSpace: "nowrap", verticalAlign: "top" }}>
                          {r.ccaa}
                        </td>
                        <td style={{ padding: "0.55rem 0.75rem", verticalAlign: "top" }}>
                          <span style={{ color: "#8888b0", fontVariantNumeric: "tabular-nums" }}>{r.tramos}</span>
                          {r.nota && (
                            <span
                              className="block text-xs mt-1"
                              style={{ color: "#4a4a6a" }}
                            >
                              {r.nota}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-3" style={{ color: "#4a4a6a" }}>
                Los tramos se suman a los estatales, salvo en regímenes forales y ciudades autónomas donde el tipo es combinado.
              </p>
            </Section>

            {/* ── 5. Mínimos ── */}
            <Section id="minimos" icon="👤" title="Mínimo personal y familiar">
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#8888b0" }}>
                El mínimo personal y familiar es la parte de la renta que no tributa, al considerarse
                necesaria para las necesidades vitales básicas:
              </p>
              <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ background: "rgba(99,102,241,0.08)" }}>
                      <th style={{ padding: "0.6rem 0.75rem", textAlign: "left", color: "#c0c0e0", fontWeight: 600, borderBottom: "1px solid rgba(99,102,241,0.2)" }}>Concepto</th>
                      <th style={{ padding: "0.6rem 0.75rem", textAlign: "right", color: "#c0c0e0", fontWeight: 600, borderBottom: "1px solid rgba(99,102,241,0.2)" }}>Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Mínimo personal (< 65 años)", "5.550 €"],
                      ["Mínimo personal (65–75 años)", "6.700 €"],
                      ["Mínimo personal (> 75 años)", "8.100 €"],
                      ["Cónyuge sin ingresos (> 1.500 €/año)", "+ 3.400 €"],
                      ["1er hijo (< 25 años, < 8.000 € renta)", "+ 2.400 €"],
                      ["2º hijo", "+ 2.700 €"],
                      ["3er hijo", "+ 4.000 €"],
                      ["4º hijo y siguientes", "+ 4.500 €"],
                      ["Hijo menor de 3 años (adicional)", "+ 2.800 €"],
                      ["Discapacidad 33–65 %", "+ 3.000 €"],
                      ["Discapacidad ≥ 65 %", "+ 9.000 €"],
                      ["Discapacidad ≥ 65 % + movilidad reducida", "+ 12.000 €"],
                    ].map(([c, v], i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "0.55rem 0.75rem", color: "#8888b0" }}>{c}</td>
                        <td style={{ padding: "0.55rem 0.75rem", textAlign: "right", color: "#a5b4fc", fontVariantNumeric: "tabular-nums" }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* ── 6. Limitaciones ── */}
            <Section id="limitaciones" icon="⚠️" title="Limitaciones del cálculo">
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#8888b0" }}>
                La calculadora aplica la normativa general del IRPF para rendimientos del trabajo. Los
                siguientes casos <strong style={{ color: "#c0c0e0" }}>no están incluidos</strong> en
                el cálculo:
              </p>
              <div className="flex flex-col gap-3">
                {[
                  ["Rentas del capital", "Dividendos, intereses, ganancias patrimoniales o rendimientos de actividades económicas."],
                  ["Deducciones autonómicas específicas", "Cada CCAA tiene deducciones propias por natalidad, alquiler, rehabilitación u otras. No se aplican automáticamente."],
                  ["Deducción por vivienda habitual", "Solo para contratos de arrendamiento firmados antes del 01/01/2015."],
                  ["Aportaciones a planes de pensiones", "Reducen la base imponible hasta 1.500 €/año o el 30 % de rendimientos netos."],
                  ["Situaciones especiales", "Trabajadores desplazados al extranjero, expatriados, impatriados (régimen Beckham) o trabajadores con pluralidad de empleadores."],
                  ["Deducciones por maternidad", "La deducción de 1.200 €/año por hijo menor de 3 años en cuota no está incluida en el cálculo de retención."],
                  ["Regímenes forales con particularidades adicionales", "Los cálculos para País Vasco y Navarra son aproximaciones basadas en los tramos publicados; pueden diferir del cálculo oficial foral en casos concretos."],
                ].map(([title, desc], i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-xl p-4"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span className="text-sm shrink-0 mt-0.5" style={{ color: "#f87171" }}>✕</span>
                    <div>
                      <p className="text-sm font-medium mb-0.5" style={{ color: "#c0c0e0" }}>{title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "#5a5a80" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── 7. Fuentes ── */}
            <Section id="fuentes" icon="📚" title="Fuentes oficiales">
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#8888b0" }}>
                Los datos utilizados en la calculadora provienen exclusivamente de fuentes oficiales:
              </p>
              <div className="flex flex-col gap-3">
                {[
                  {
                    org: "AEAT — Agencia Estatal de Administración Tributaria",
                    desc: "Tablas de retenciones, tramos IRPF, mínimos personales y familiares, reducciones Art. 19 y Art. 20.",
                    url: "https://www.agenciatributaria.es",
                  },
                  {
                    org: "BOE — Boletín Oficial del Estado",
                    desc: "Ley 35/2006 del IRPF y sus sucesivas modificaciones. Real Decreto-ley de Presupuestos Generales.",
                    url: "https://www.boe.es",
                  },
                  {
                    org: "TGSS — Tesorería General de la Seguridad Social",
                    desc: "Tipos de cotización, bases máximas y mínimas para 2026.",
                    url: "https://www.seg-social.es",
                  },
                ].map((s) => (
                  <a
                    key={s.org}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 rounded-xl p-4 transition-colors"
                    style={{ background: "#0c0c1e", border: "1px solid rgba(255,255,255,0.07)", textDecoration: "none" }}
                  >
                    <span className="text-lg shrink-0">🔗</span>
                    <div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: "#818cf8" }}>{s.org}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "#5a5a80" }}>{s.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </Section>

            {/* CTA */}
            <div
              className="rounded-2xl p-6 md:p-8 text-center mt-4"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.22)" }}
            >
              <p className="font-syne font-bold text-lg mb-2" style={{ color: "#e0e0ff" }}>
                Aplica esta metodología en segundos
              </p>
              <p className="text-sm mb-5" style={{ color: "#7c7ca0" }}>
                Introduce tu salario bruto, selecciona tu comunidad y situación personal — el resultado es inmediato.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-150"
                style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "#fff", boxShadow: "0 2px 18px rgba(99,102,241,0.4)" }}
              >
                Ir a la calculadora →
              </Link>
            </div>

          </div>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
