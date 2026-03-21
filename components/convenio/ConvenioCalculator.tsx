"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  computeCalc,
  COMUNIDADES_LABEL,
  type ComunidadAutonoma,
  type NumPayments,
} from "@/lib/calculator";
import { CONVENIOS } from "@/lib/convenios-data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtN(n: number): string {
  return Math.abs(n).toLocaleString("es-ES", { maximumFractionDigits: 0 });
}
function fmtDec(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

const CCAA_OPTIONS = (
  Object.entries(COMUNIDADES_LABEL) as [ComunidadAutonoma, string][]
).sort((a, b) => a[1].localeCompare(b[1], "es"));

const CANONICAL_CASE = {
  contractType:       "indefinido" as const,
  familySituation:    "soltero"    as const,
  numChildren:        0,
  childrenUnder3:     0            as const,
  spouseWithoutIncome: false,
  age:                35,
  disability:         "none"       as const,
  geographicMobility: false        as const,
};

const LABEL_ST: React.CSSProperties = {
  color:         "#7070a0",
  fontSize:      "0.72rem",
  fontWeight:    600,
  textTransform: "uppercase",
  letterSpacing: "0.09em",
};

const INPUT_ST: React.CSSProperties = {
  background:   "rgba(255,255,255,0.04)",
  border:       "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  color:        "#e0e0ff",
  fontSize:     "0.95rem",
  padding:      "10px 14px",
  width:        "100%",
  outline:      "none",
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function ConvenioCalculator() {
  const [selectedConvenioId,  setSelectedConvenioId]  = useState<string | null>(null);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | null>(null);
  const [salarioActual,       setSalarioActual]        = useState("");
  const [ccaa,                setCcaa]                 = useState<ComunidadAutonoma>("madrid");
  const [pagas,               setPagas]                = useState<"12" | "14">("14");
  const [hasChecked,          setHasChecked]           = useState(false);
  const [validationError,     setValidationError]      = useState("");

  const resultRef = useRef<HTMLDivElement>(null);

  const convenio  = CONVENIOS.find((c) => c.id === selectedConvenioId) ?? null;
  const categoria = convenio?.categorias.find((c) => c.id === selectedCategoriaId) ?? null;

  function selectConvenio(id: string) {
    if (selectedConvenioId === id) return;
    setSelectedConvenioId(id);
    setSelectedCategoriaId(null);
    setHasChecked(false);
    setValidationError("");
  }

  function handleCheck() {
    if (!selectedConvenioId)  { setValidationError("Selecciona un sector."); return; }
    if (!selectedCategoriaId) { setValidationError("Selecciona tu categoría profesional."); return; }
    setValidationError("");
    setHasChecked(true);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  // ── Derived ──
  const result = hasChecked && categoria
    ? computeCalc({
        annualGross: categoria.salarioBase * 14,
        comunidad:   ccaa,
        numPayments: parseInt(pagas) as NumPayments,
        ...CANONICAL_CASE,
      })
    : null;

  const salarioActualNum  = parseFloat(salarioActual.replace(",", ".")) || 0;
  const hasActualSalario  = salarioActual.trim() !== "" && salarioActualNum > 0;
  const diferencia        = hasActualSalario && categoria ? salarioActualNum - categoria.salarioBase : 0;
  const porDebajo         = hasActualSalario && !!categoria && diferencia < 0;
  const cumple            = hasActualSalario && !!categoria && diferencia >= 0;
  const prorrataMensual   = categoria ? Math.round((categoria.salarioBase * 2) / 12) : 0;

  const verdictColor  = porDebajo ? "#f87171" : cumple ? "#34d399" : "#a5b4fc";
  const verdictBg     = porDebajo ? "rgba(248,113,113,0.06)" : cumple ? "rgba(52,211,153,0.06)" : "rgba(99,102,241,0.06)";
  const verdictBorder = porDebajo ? "rgba(248,113,113,0.25)" : cumple ? "rgba(52,211,153,0.25)" : "rgba(99,102,241,0.25)";

  // ─── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* ── Step 1: Sector grid ── */}
      <div>
        <p className="font-syne font-bold text-xs tracking-widest uppercase mb-4" style={{ color: "#9090b8" }}>
          1 · Selecciona tu sector
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CONVENIOS.map((conv) => {
            const isSel = selectedConvenioId === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => selectConvenio(conv.id)}
                className="flex flex-col items-center text-center gap-2.5 p-4 rounded-2xl transition-all"
                style={{
                  background:  isSel ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)",
                  border:      `1.5px solid ${isSel ? "#6366f1" : "rgba(255,255,255,0.07)"}`,
                  boxShadow:   isSel ? "0 0 0 1px rgba(99,102,241,0.2), 0 4px 20px rgba(99,102,241,0.15)" : "none",
                  cursor:      "pointer",
                  transform:   isSel ? "translateY(-1px)" : "none",
                }}
              >
                <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>{conv.icono}</span>
                <span
                  className="font-syne font-bold leading-tight"
                  style={{ fontSize: "0.82rem", color: isSel ? "#a5b4fc" : "#c0c0d8", lineHeight: 1.3 }}
                >
                  {conv.nombre}
                </span>
                <span style={{ fontSize: "0.67rem", color: isSel ? "#818cf8" : "#5a5a80" }}>
                  {conv.trabajadores} trab.
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Step 2: Form ── */}
      {selectedConvenioId && convenio && (
        <div
          className="rounded-2xl p-5 flex flex-col gap-4 animate-scaleIn"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="font-syne font-bold text-xs tracking-widest uppercase" style={{ color: "#9090b8" }}>
            2 · Tu perfil profesional
          </p>

          {/* Categoría */}
          <div className="flex flex-col gap-1.5">
            <label style={LABEL_ST}>Categoría profesional</label>
            <select
              value={selectedCategoriaId ?? ""}
              onChange={(e) => { setSelectedCategoriaId(e.target.value || null); setHasChecked(false); }}
              style={INPUT_ST}
            >
              <option value="">— Selecciona tu categoría —</option>
              {convenio.categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre} · mín. {fmtN(cat.salarioBase)} €/mes
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Salario actual */}
            <div className="flex flex-col gap-1.5">
              <label style={LABEL_ST}>
                Tu salario mensual bruto
                <span style={{ color: "#4a4a6a", marginLeft: 5 }}>(opcional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={salarioActual}
                  onChange={(e) => { setSalarioActual(e.target.value); setHasChecked(false); }}
                  placeholder="Ej: 1.300"
                  style={{ ...INPUT_ST, paddingRight: "2.6rem" }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "#5a5a80" }}>€</span>
              </div>
            </div>

            {/* CCAA */}
            <div className="flex flex-col gap-1.5">
              <label style={LABEL_ST}>Comunidad autónoma</label>
              <select
                value={ccaa}
                onChange={(e) => { setCcaa(e.target.value as ComunidadAutonoma); setHasChecked(false); }}
                style={INPUT_ST}
              >
                {CCAA_OPTIONS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>

            {/* Pagas */}
            <div className="flex flex-col gap-1.5">
              <label style={LABEL_ST}>Número de pagas</label>
              <select
                value={pagas}
                onChange={(e) => { setPagas(e.target.value as "12" | "14"); setHasChecked(false); }}
                style={INPUT_ST}
              >
                <option value="12">12 pagas</option>
                <option value="14">14 pagas (con extras)</option>
              </select>
            </div>
          </div>

          {validationError && (
            <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
              {validationError}
            </p>
          )}

          <div className="flex justify-center pt-1">
            <button
              onClick={handleCheck}
              className="font-syne font-black tracking-widest uppercase flex items-center gap-2.5"
              style={{
                background:  "linear-gradient(135deg, #4f52d4 0%, #6366f1 50%, #818cf8 100%)",
                color:       "#fff",
                borderRadius: 14,
                padding:     "14px 36px",
                fontSize:    "0.88rem",
                letterSpacing: "0.12em",
                boxShadow:   "0 6px 24px rgba(99,102,241,0.4)",
                cursor:      "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="8" cy="8" r="6.5" />
                <path d="M5.5 8l2 2 3-3.5" />
              </svg>
              Comprobar mi salario
            </button>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {hasChecked && categoria && result && (
        <div ref={resultRef} className="flex flex-col gap-4 animate-scaleIn" style={{ padding: 4 }}>

          {/* Separador */}
          <div className="flex items-center gap-4 py-1">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3))" }} />
            <span className="font-syne font-bold text-xs tracking-widest uppercase shrink-0" style={{ color: "#6366f1" }}>Resultado</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.3), transparent)" }} />
          </div>

          {/* Veredicto principal */}
          <div className="rounded-2xl p-6 md:p-7" style={{ background: verdictBg, border: `1.5px solid ${verdictBorder}` }}>
            <p className="font-syne font-bold text-xs tracking-widest uppercase mb-4" style={{ color: "#9090b8" }}>
              {convenio!.nombre} · {categoria.nombre}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-10 mb-5">
              <div>
                <p style={{ color: "#9090b8", fontSize: "0.82rem", marginBottom: 3 }}>Salario mínimo del convenio</p>
                <p className="font-syne font-extrabold tabnum leading-none" style={{ fontSize: "clamp(2rem, 5vw, 2.6rem)", color: "#f0f0ff" }}>
                  {fmtN(categoria.salarioBase)} €
                </p>
                <p style={{ color: "#7878a8", fontSize: "0.78rem", marginTop: 4 }}>mensual bruto · 14 pagas</p>
              </div>
              <div>
                <p style={{ color: "#9090b8", fontSize: "0.82rem", marginBottom: 3 }}>Neto mensual estimado</p>
                <p className="font-syne font-extrabold tabnum leading-none" style={{ fontSize: "clamp(2rem, 5vw, 2.6rem)", color: "#6366f1" }}>
                  {fmtN(Math.round(result.monthlyNet))} €
                </p>
                <p style={{ color: "#7878a8", fontSize: "0.78rem", marginTop: 4 }}>{COMUNIDADES_LABEL[ccaa]} · {pagas} pagas</p>
              </div>
            </div>

            {/* Comparación salario actual */}
            {hasActualSalario && (
              <div
                className="rounded-xl p-4"
                style={{
                  background: porDebajo ? "rgba(248,113,113,0.09)" : "rgba(52,211,153,0.08)",
                  border:     `1px solid ${porDebajo ? "rgba(248,113,113,0.22)" : "rgba(52,211,153,0.2)"}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span style={{ fontSize: "1.3rem", lineHeight: 1, flexShrink: 0, marginTop: 2 }}>
                    {porDebajo ? "⚠️" : "✅"}
                  </span>
                  <div>
                    <p className="font-syne font-extrabold" style={{ fontSize: "1.05rem", color: verdictColor, lineHeight: 1.25 }}>
                      {porDebajo
                        ? `Estás cobrando ${fmtN(Math.abs(diferencia))} €/mes POR DEBAJO del convenio`
                        : "Tu salario cumple con el convenio"}
                    </p>
                    <p className="text-sm mt-1.5 leading-relaxed" style={{ color: porDebajo ? "#fca5a5" : "#86efac" }}>
                      {porDebajo
                        ? "Tu empresa podría estar incumpliendo la ley. Consulta más abajo qué puedes hacer."
                        : `Cobras ${fmtN(diferencia)} €/mes por encima del mínimo establecido por el convenio.`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desglose */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="font-syne font-bold text-xs tracking-widest uppercase mb-4" style={{ color: "#9090b8" }}>
              Desglose del salario mínimo del convenio
            </p>
            <div className="flex flex-col">
              {[
                { lbl: "Salario base mensual (× 14 pagas)",  val: `${fmtN(categoria.salarioBase)} €`,              clr: "#e0e0ff"  },
                { lbl: "Prorrata pagas extra / mes",          val: `+${fmtN(prorrataMensual)} €`,                  clr: "#a0a0c8"  },
                { lbl: "Bruto anual total",                   val: `${fmtN(categoria.salarioBase * 14)} €`,        clr: "#a0a0c8"  },
                { lbl: "SS trabajador / año",                 val: `−${fmtN(Math.round(result.annualSS))} €`,      clr: "#f87171"  },
                { lbl: "IRPF retenido / año",                 val: `−${fmtN(Math.round(result.annualIRPF))} €`,    clr: "#f87171"  },
                { lbl: `Neto mensual (${pagas} pagas)`,       val: `${fmtN(Math.round(result.monthlyNet))} €`,     clr: "#34d399", bold: true },
                { lbl: "Neto anual",                          val: `${fmtN(Math.round(result.annualNet))} €`,      clr: "#34d399", bold: true },
                { lbl: "IRPF efectivo",                       val: `${fmtDec(result.irpfEfectivo)} %`,             clr: "#fbbf24"  },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#9090b8" }}>{row.lbl}</span>
                  <span
                    className={row.bold ? "font-syne font-bold tabnum" : "tabnum"}
                    style={{ fontSize: row.bold ? "1rem" : "0.9rem", color: row.clr }}
                  >
                    {row.val}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3 leading-relaxed" style={{ color: "#6060a0" }}>
              Cálculo orientativo para persona soltera, 35 años, contrato indefinido en {COMUNIDADES_LABEL[ccaa]}. Datos AEAT 2026.
            </p>
          </div>

          {/* CTA si está por debajo del convenio */}
          {porDebajo && (
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(248,113,113,0.05)", border: "1.5px solid rgba(248,113,113,0.22)" }}
            >
              <div className="flex items-start gap-3">
                <span style={{ fontSize: "1.5rem", lineHeight: 1, flexShrink: 0 }}>⚖️</span>
                <div>
                  <p className="font-syne font-bold" style={{ color: "#f87171", fontSize: "1rem", marginBottom: 8 }}>
                    ¿Qué puedo hacer si cobro por debajo del convenio?
                  </p>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "#c0c0d8" }}>
                    Si tu empresa te paga por debajo del salario mínimo del convenio colectivo, está incumpliendo la ley laboral. Tienes varias vías para reclamarlo:
                  </p>
                  <ul className="flex flex-col gap-2">
                    {[
                      "Tu sindicato (CCOO, UGT u otros representativos de tu sector)",
                      "La Inspección de Trabajo — denuncia gratuita y confidencial",
                      "El Servicio de Mediación, Arbitraje y Conciliación (SMAC) — paso previo a la demanda",
                      "Un abogado laboralista para reclamar las diferencias salariales de los últimos 4 años",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#c0c0d8" }}>
                        <span className="shrink-0 font-bold" style={{ color: "#f87171" }}>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* CTA calculadora completa */}
          <div
            className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.18)" }}
          >
            <div>
              <p className="font-syne font-bold" style={{ color: "#a5b4fc", fontSize: "0.95rem" }}>
                ¿Quieres calcular tu neto exacto con tu situación personal?
              </p>
              <p className="text-sm mt-1" style={{ color: "#7878a8" }}>
                Personaliza por hijos, estado civil, discapacidad, edad y más.
              </p>
            </div>
            <Link
              href="/"
              className="font-syne font-bold text-sm tracking-wide shrink-0 flex items-center gap-2 rounded-xl px-5 py-3 transition-all"
              style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.35)", color: "#a5b4fc" }}
            >
              Ir a la calculadora completa
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2.5 7h9M8 3l4 4-4 4" />
              </svg>
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
