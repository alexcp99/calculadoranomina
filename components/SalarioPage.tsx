import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { type SalarioData, ALL_SALARIOS, fmt } from "@/lib/salario-data";

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1"
      style={{
        background: "rgba(99,102,241,0.07)",
        border: `1px solid ${accent ? "rgba(52,211,153,0.25)" : "rgba(99,102,241,0.18)"}`,
      }}
    >
      <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "#6060a0" }}>
        {label}
      </span>
      <span
        className="font-syne font-extrabold leading-none"
        style={{
          fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
          color: accent ? "#34d399" : "#e0e0ff",
        }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-xs" style={{ color: "#6060a0" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
      style={{ background: "rgba(99,102,241,0.1)", color: "#6060a0", borderBottom: "1px solid rgba(99,102,241,0.15)" }}
    >
      {children}
    </th>
  );
}

function Td({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <td
      className="px-4 py-3"
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

// ─── Main component ────────────────────────────────────────────────────────────

export default function SalarioPage({ data }: { data: SalarioData }) {
  const otherSalarios = ALL_SALARIOS.filter((s) => s.slug !== data.slug);

  return (
    <main className="min-h-screen" style={{ background: "#080810" }}>
      {/* Gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.1) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 px-4 pt-10 pb-16 md:pt-14">
          <div className="max-w-3xl mx-auto">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap" style={{ color: "#4a4a6a" }}>
              <Link href="/" className="hover:underline" style={{ color: "#818CF8" }}>Inicio</Link>
              <span>/</span>
              <Link href="/" className="hover:underline" style={{ color: "#818CF8" }}>Calculadora</Link>
              <span>/</span>
              <span style={{ color: "#7c7ca0" }}>{data.brutoLabel}€ brutos en neto</span>
            </nav>

            {/* Hero */}
            <div className="mb-10">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.22)",
                  color: "#818CF8",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }}
                />
                Datos AEAT 2026 · Madrid · Soltero/a sin hijos
              </div>

              <h1
                className="font-syne font-extrabold tracking-tight leading-tight mb-4"
                style={{ fontSize: "clamp(1.6rem, 6vw, 2.8rem)", color: "#f0f0ff" }}
              >
                Con {data.brutoLabel}€ brutos cobras{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #34d399 0%, #6ee7b7 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {fmt(data.netoMensual)}€ netos al mes
                </span>
              </h1>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "#7c7ca0" }}>
                Resultado para Madrid en 2026: soltero/a, sin hijos, contrato indefinido, 12 pagas.
                El neto varía según tu comunidad autónoma y situación familiar — consulta las tablas más abajo.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
              <StatCard
                label="Neto mensual"
                value={`${fmt(data.netoMensual)} €`}
                sub="en Madrid"
                accent
              />
              <StatCard
                label="Neto anual"
                value={`${fmt(data.netoAnual)} €`}
                sub="12 mensualidades"
              />
              <StatCard
                label="IRPF efectivo"
                value={`${data.irpfEf} %`}
                sub="sobre base imponible"
              />
              <StatCard
                label="Coste empresa"
                value={`${fmt(data.costeEmpresa)} €`}
                sub="bruto + SS patronal"
              />
            </div>

            {/* Desglose */}
            <section className="mb-12">
              <h2 className="font-syne font-bold mb-5" style={{ fontSize: "1.2rem", color: "#e0e0ff" }}>
                ¿Cuánto te queda realmente?
              </h2>
              <div
                className="rounded-2xl p-5 md:p-6 font-mono text-sm"
                style={{
                  background: "rgba(13,13,26,0.8)",
                  border: "1px solid rgba(99,102,241,0.18)",
                }}
              >
                {[
                  { label: "Salario bruto anual", value: `${fmt(data.bruto)} €`, color: "#e0e0ff", indent: false },
                  { label: `− Cotización SS (6,5%)`, value: `−${fmt(data.ssEuros)} €`, color: "#f87171", indent: true },
                  {
                    label: `− Retención IRPF (tipo ef. ${data.irpfEf}%)`,
                    value: data.irpfEuros > 0 ? `−${fmt(data.irpfEuros)} €` : "mínima*",
                    color: "#f87171",
                    indent: true,
                  },
                  { label: "= Salario neto anual", value: `${fmt(data.netoAnual)} €`, color: "#34d399", indent: false },
                  { label: "÷ 12 = Neto mensual", value: `${fmt(data.netoMensual)} €/mes`, color: "#34d399", indent: true },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-baseline py-2.5 ${!row.indent ? "font-bold" : ""}`}
                    style={{
                      borderTop: i === 3 ? "1px solid rgba(99,102,241,0.25)" : i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      color: row.color,
                    }}
                  >
                    <span className={row.indent ? "pl-4 text-xs md:text-sm" : "text-sm md:text-base"} style={{ color: i === 3 || i === 4 ? row.color : "#a0a0c0" }}>
                      {row.label}
                    </span>
                    <span>{row.value}</span>
                  </div>
                ))}
                {data.irpfEuros === 0 && (
                  <p className="text-xs mt-3" style={{ color: "#5050a0" }}>
                    * Para este nivel salarial, las reducciones por rendimientos del trabajo y el mínimo personal
                    resultan en una retención IRPF prácticamente nula.
                  </p>
                )}
              </div>
            </section>

            {/* CCAA table */}
            <section className="mb-12">
              <h2 className="font-syne font-bold mb-2" style={{ fontSize: "1.2rem", color: "#e0e0ff" }}>
                Neto mensual por comunidad autónoma
              </h2>
              <p className="text-sm mb-5" style={{ color: "#7c7ca0" }}>
                Mismo perfil (soltero/a, sin hijos, indefinido), solo cambia el tramo autonómico del IRPF.
              </p>
              <TableWrapper>
                <thead>
                  <tr>
                    <Th>Comunidad autónoma</Th>
                    <Th>Neto mensual</Th>
                    <Th>IRPF ef.</Th>
                    <Th>Diferencia vs Madrid</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.ccaaTable.map((row, i) => {
                    const diff = row.neto - data.ccaaTable[0].neto;
                    const isMadrid = i === 0;
                    return (
                      <tr key={row.ccaa} style={{ background: isMadrid ? "rgba(99,102,241,0.05)" : "transparent" }}>
                        <Td highlight={isMadrid}>{row.ccaa}{isMadrid ? " ★" : ""}</Td>
                        <Td highlight={isMadrid}>{fmt(row.neto)} €</Td>
                        <Td>{row.irpf}</Td>
                        <Td>
                          {diff === 0 ? (
                            <span style={{ color: "#6060a0" }}>—</span>
                          ) : (
                            <span style={{ color: "#f87171" }}>{diff} €/mes</span>
                          )}
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </TableWrapper>
            </section>

            {/* Family table */}
            <section className="mb-12">
              <h2 className="font-syne font-bold mb-2" style={{ fontSize: "1.2rem", color: "#e0e0ff" }}>
                Cómo cambia el neto según situación familiar
              </h2>
              <p className="text-sm mb-5" style={{ color: "#7c7ca0" }}>
                Los mínimos personales y familiares reducen la base imponible del IRPF en Madrid.
              </p>
              <TableWrapper>
                <thead>
                  <tr>
                    <Th>Situación familiar</Th>
                    <Th>Neto mensual aprox.</Th>
                    <Th>Diferencia</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.familyTable.map((row, i) => {
                    const neto = data.netoMensual + row.extra;
                    return (
                      <tr key={i} style={{ background: i === 0 ? "rgba(99,102,241,0.05)" : "transparent" }}>
                        <Td highlight={i === 0}>{row.label}</Td>
                        <Td highlight={i === 0}>{fmt(neto)} €</Td>
                        <Td>
                          {row.extra === 0 ? (
                            <span style={{ color: "#6060a0" }}>base</span>
                          ) : (
                            <span style={{ color: "#34d399" }}>+{row.extra} €/mes</span>
                          )}
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </TableWrapper>
            </section>

            {/* CTA */}
            <div
              className="rounded-2xl p-6 md:p-8 mb-12 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(129,140,248,0.08) 100%)",
                border: "1px solid rgba(99,102,241,0.25)",
              }}
            >
              <p className="font-syne font-bold mb-2" style={{ fontSize: "1.1rem", color: "#e0e0ff" }}>
                ¿Tu situación es diferente?
              </p>
              <p className="text-sm mb-5" style={{ color: "#7c7ca0" }}>
                Introduce tu comunidad autónoma, estado civil, hijos y tipo de contrato para obtener tu resultado exacto.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  color: "#fff",
                  boxShadow: "0 2px 14px rgba(99,102,241,0.35)",
                }}
              >
                Calcula tu neto exacto con tu situación real →
              </Link>
            </div>

            {/* FAQ */}
            <section className="mb-12">
              <h2 className="font-syne font-bold mb-6" style={{ fontSize: "1.2rem", color: "#e0e0ff" }}>
                Preguntas frecuentes sobre {data.brutoLabel}€ brutos
              </h2>
              <div className="flex flex-col gap-4">
                {data.faq.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 md:p-5"
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
            </section>

            {/* Internal links */}
            <section className="mb-4">
              <h2 className="font-syne font-bold mb-4" style={{ fontSize: "1rem", color: "#6060a0" }}>
                También te puede interesar
              </h2>
              <div className="flex flex-wrap gap-2">
                {otherSalarios.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/cuanto-es-${s.slug}-euros-brutos-neto`}
                    className="text-sm px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      background: "rgba(99,102,241,0.07)",
                      border: "1px solid rgba(99,102,241,0.15)",
                      color: "#818cf8",
                    }}
                  >
                    {s.brutoLabel}€ brutos → {fmt(s.netoMensual)}€/mes
                  </Link>
                ))}
              </div>
            </section>

          </div>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
