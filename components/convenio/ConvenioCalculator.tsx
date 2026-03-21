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
  contractType:        "indefinido" as const,
  familySituation:     "soltero"    as const,
  numChildren:         0,
  childrenUnder3:      0            as const,
  spouseWithoutIncome: false,
  age:                 35,
  disability:          "none"       as const,
  geographicMobility:  false        as const,
};

// ─── Design tokens — exactamente iguales a JobChangeCalculator ────────────────

const LABEL_STYLE: React.CSSProperties = {
  color:         "#b8b8d8",
  fontSize:      "0.72rem",
  fontWeight:    600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  display:       "block",
  marginBottom:  7,
};

const INPUT_BASE: React.CSSProperties = {
  background:   "rgba(255,255,255,0.04)",
  border:       "1px solid rgba(255,255,255,0.1)",
  color:        "#e0e0ff",
  caretColor:   "#6366f1",
  width:        "100%",
  borderRadius: 12,
  padding:      "11px 14px",
  fontSize:     "0.9rem",
  fontWeight:   500,
  outline:      "none",
  transition:   "border-color 0.15s",
};

// ─── Field wrappers ───────────────────────────────────────────────────────────

function FieldSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col">
      <span style={LABEL_STYLE}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...INPUT_BASE, appearance: "none" } as React.CSSProperties}
        onFocus={(e) => { (e.currentTarget as HTMLSelectElement).style.borderColor = "rgba(99,102,241,0.6)"; }}
        onBlur={(e)  => { (e.currentTarget as HTMLSelectElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
      >
        {children}
      </select>
    </label>
  );
}

function FieldNum({
  label,
  value,
  onChange,
  placeholder,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suffix?: string;
}) {
  return (
    <label className="flex flex-col">
      <span style={LABEL_STYLE}>{label}</span>
      <div className="relative">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...INPUT_BASE, paddingRight: suffix ? "2.6rem" : INPUT_BASE.padding }}
          onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(99,102,241,0.6)"; }}
          onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none" style={{ color: "#6060a0" }}>
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

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

  const salarioActualNum = parseFloat(salarioActual.replace(",", ".")) || 0;
  const hasActualSalario = salarioActual.trim() !== "" && salarioActualNum > 0;
  const diferencia       = hasActualSalario && categoria ? salarioActualNum - categoria.salarioBase : 0;
  const porDebajo        = hasActualSalario && !!categoria && diferencia < 0;
  const cumple           = hasActualSalario && !!categoria && diferencia >= 0;
  const prorrataMensual  = categoria ? Math.round((categoria.salarioBase * 2) / 12) : 0;

  const verdictColor  = porDebajo ? "#f87171" : cumple ? "#34d399" : "#a5b4fc";
  const verdictBg     = porDebajo ? "rgba(248,113,113,0.06)" : cumple ? "rgba(52,211,153,0.06)" : "rgba(99,102,241,0.06)";
  const verdictBorder = porDebajo ? "rgba(248,113,113,0.25)" : cumple ? "rgba(52,211,153,0.25)" : "rgba(99,102,241,0.25)";

  // ─── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">

      {/* ══ Step 1: Sector grid ══ */}
      <div>
        <p className="font-syne font-bold text-xs tracking-widest uppercase mb-4" style={{ color: "#9090b8" }}>
          1 · Selecciona tu sector
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {CONVENIOS.map((conv) => {
            const isSel      = selectedConvenioId === conv.id;
            const minSal     = Math.min(...conv.categorias.map((c) => c.salarioBase));
            const maxSal     = Math.max(...conv.categorias.map((c) => c.salarioBase));
            const numCats    = conv.categorias.length;

            return (
              <button
                key={conv.id}
                onClick={() => selectConvenio(conv.id)}
                className="relative flex flex-col rounded-2xl overflow-hidden text-left transition-all min-w-0"
                style={{
                  background:  isSel ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)",
                  border:      `1.5px solid ${isSel ? "rgba(99,102,241,0.65)" : "rgba(255,255,255,0.08)"}`,
                  boxShadow:   isSel ? "0 0 0 1px rgba(99,102,241,0.2), 0 6px 28px rgba(99,102,241,0.18)" : "none",
                  cursor:      "pointer",
                  transform:   isSel ? "translateY(-2px)" : "none",
                }}
              >
                {/* Top accent bar */}
                <div
                  style={{
                    height:     3,
                    background: isSel
                      ? "linear-gradient(90deg, #6366f1, #818cf8)"
                      : "rgba(255,255,255,0.04)",
                    transition: "background 0.2s",
                  }}
                />

                <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
                  {/* Emoji + Sector name */}
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "1.4rem", lineHeight: 1, flexShrink: 0 }}>{conv.icono}</span>
                    <span
                      className="font-syne font-bold leading-snug min-w-0"
                      style={{ fontSize: "0.82rem", color: isSel ? "#c4c4ff" : "#d0d0f0", lineHeight: 1.3, wordBreak: "break-word" }}
                    >
                      {conv.nombre}
                    </span>
                  </div>

                  {/* Salary range — the key info */}
                  <div className="min-w-0">
                    <span
                      className="font-syne font-bold tabnum"
                      style={{ fontSize: "0.82rem", color: isSel ? "#6ee7b7" : "#34d399" }}
                    >
                      {fmtN(minSal)}–{fmtN(maxSal)} €
                    </span>
                    <span style={{ fontSize: "0.68rem", color: isSel ? "#9090b8" : "#6868a0", marginLeft: 2 }}>/mes</span>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-1">
                    <span
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full"
                      style={{
                        background: isSel ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                        fontSize:   "0.65rem",
                        color:      isSel ? "#a5b4fc" : "#8888b0",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {numCats} cat.
                    </span>
                    <span style={{ fontSize: "0.65rem", color: isSel ? "#8888b0" : "#7070a0", fontWeight: 500, whiteSpace: "nowrap" }}>
                      {conv.trabajadores}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ Step 2: Form — mismo estilo que JobChangeCalculator ══ */}
      {selectedConvenioId && convenio && (
        <div
          className="rounded-2xl overflow-hidden animate-scaleIn"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Accent top bar */}
          <div style={{ height: 3, background: "linear-gradient(90deg, #6366f1, #818cf840)" }} />

          <div className="p-5 flex flex-col gap-4">
            {/* Section header — identical to JobColumn */}
            <div
              className="flex items-center gap-3 pb-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-1 h-6 rounded-full shrink-0"
                style={{ background: "#6366f1", boxShadow: "0 0 8px rgba(99,102,241,0.5)" }}
              />
              <span className="font-syne font-bold text-sm tracking-widest uppercase" style={{ color: "#818cf8" }}>
                2 · Tu perfil profesional
              </span>
            </div>

            {/* Categoría — full width */}
            <FieldSelect
              label="Categoría profesional"
              value={selectedCategoriaId ?? ""}
              onChange={(v) => { setSelectedCategoriaId(v || null); setHasChecked(false); }}
            >
              <option value="" style={{ background: "#0d0d1a", color: "#e0e0ff" }}>— Selecciona tu categoría —</option>
              {convenio.categorias.map((cat) => (
                <option key={cat.id} value={cat.id} style={{ background: "#0d0d1a", color: "#e0e0ff" }}>
                  {cat.nombre} · mín. {fmtN(cat.salarioBase)} €/mes
                </option>
              ))}
            </FieldSelect>

            {/* 3-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FieldNum
                label="Tu salario mensual bruto (opcional)"
                value={salarioActual}
                onChange={(v) => { setSalarioActual(v); setHasChecked(false); }}
                placeholder="Ej: 1.300"
                suffix="€"
              />
              <FieldSelect
                label="Comunidad autónoma"
                value={ccaa}
                onChange={(v) => { setCcaa(v as ComunidadAutonoma); setHasChecked(false); }}
              >
                {CCAA_OPTIONS.map(([v, l]) => (
                  <option key={v} value={v} style={{ background: "#0d0d1a", color: "#e0e0ff" }}>{l}</option>
                ))}
              </FieldSelect>
              <FieldSelect
                label="Número de pagas"
                value={pagas}
                onChange={(v) => { setPagas(v as "12" | "14"); setHasChecked(false); }}
              >
                <option value="12" style={{ background: "#0d0d1a", color: "#e0e0ff" }}>12 pagas</option>
                <option value="14" style={{ background: "#0d0d1a", color: "#e0e0ff" }}>14 pagas (con extras)</option>
              </FieldSelect>
            </div>

            {validationError && (
              <p
                className="text-sm px-4 py-3 rounded-xl"
                style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
              >
                {validationError}
              </p>
            )}

            {/* CTA button */}
            <div className="flex justify-center pt-1">
              <button
                onClick={handleCheck}
                className="font-syne font-black tracking-widest uppercase flex items-center gap-2.5"
                style={{
                  background:    "linear-gradient(135deg, #4f52d4 0%, #6366f1 50%, #818cf8 100%)",
                  color:         "#fff",
                  borderRadius:  16,
                  padding:       "16px 40px",
                  fontSize:      "0.9rem",
                  letterSpacing: "0.12em",
                  boxShadow:     "0 6px 30px rgba(99,102,241,0.5), 0 0 0 1px rgba(99,102,241,0.3)",
                  cursor:        "pointer",
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
        </div>
      )}

      {/* ══ Results ══ */}
      {hasChecked && categoria && result && (
        <div ref={resultRef} className="flex flex-col gap-4 animate-scaleIn w-full min-w-0" style={{ padding: 4 }}>

          {/* Separator */}
          <div className="flex items-center gap-4 py-1">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3))" }} />
            <span className="font-syne font-bold text-xs tracking-widest uppercase shrink-0" style={{ color: "#6366f1" }}>Resultado</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.3), transparent)" }} />
          </div>

          {/* Verdict main card */}
          <div className="rounded-2xl p-6 md:p-7" style={{ background: verdictBg, border: `1.5px solid ${verdictBorder}` }}>
            <p className="font-syne font-bold text-xs tracking-widest uppercase mb-4" style={{ color: "#a0a0c8" }}>
              {convenio!.nombre} · {categoria.nombre}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-10 mb-5">
              <div>
                <p style={{ color: "#b0b0d0", fontSize: "0.85rem", marginBottom: 4 }}>Salario mínimo del convenio</p>
                <p className="font-syne font-extrabold tabnum leading-none" style={{ fontSize: "clamp(2rem, 5vw, 2.6rem)", color: "#f0f0ff" }}>
                  {fmtN(categoria.salarioBase)} €
                </p>
                <p style={{ color: "#9090b8", fontSize: "0.8rem", marginTop: 5 }}>mensual bruto · 14 pagas</p>
              </div>
              <div>
                <p style={{ color: "#b0b0d0", fontSize: "0.85rem", marginBottom: 4 }}>Neto mensual estimado</p>
                <p className="font-syne font-extrabold tabnum leading-none" style={{ fontSize: "clamp(2rem, 5vw, 2.6rem)", color: "#818cf8" }}>
                  {fmtN(Math.round(result.monthlyNet))} €
                </p>
                <p style={{ color: "#9090b8", fontSize: "0.8rem", marginTop: 5 }}>{COMUNIDADES_LABEL[ccaa]} · {pagas} pagas</p>
              </div>
            </div>

            {/* Comparison if user entered salary */}
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

          {/* Breakdown */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="font-syne font-bold text-xs tracking-widest uppercase mb-4" style={{ color: "#a0a0c8" }}>
              Desglose del salario mínimo del convenio
            </p>
            <div className="flex flex-col">
              {[
                { lbl: "Salario base mensual (× 14 pagas)",  val: `${fmtN(categoria.salarioBase)} €`,           clr: "#e0e0ff"  },
                { lbl: "Prorrata pagas extra / mes",          val: `+${fmtN(prorrataMensual)} €`,                clr: "#c0c0e0"  },
                { lbl: "Bruto anual total",                   val: `${fmtN(categoria.salarioBase * 14)} €`,      clr: "#c0c0e0"  },
                { lbl: "SS trabajador / año",                 val: `−${fmtN(Math.round(result.annualSS))} €`,    clr: "#f87171"  },
                { lbl: "IRPF retenido / año",                 val: `−${fmtN(Math.round(result.annualIRPF))} €`,  clr: "#f87171"  },
                { lbl: `Neto mensual (${pagas} pagas)`,       val: `${fmtN(Math.round(result.monthlyNet))} €`,   clr: "#34d399", bold: true },
                { lbl: "Neto anual",                          val: `${fmtN(Math.round(result.annualNet))} €`,    clr: "#34d399", bold: true },
                { lbl: "IRPF efectivo",                       val: `${fmtDec(result.irpfEfectivo)} %`,           clr: "#fbbf24"  },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 py-2.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span style={{ fontSize: "0.83rem", color: "#b0b0cc", minWidth: 0, flexShrink: 1 }}>{row.lbl}</span>
                  <span
                    className={row.bold ? "font-syne font-bold tabnum" : "tabnum"}
                    style={{ fontSize: row.bold ? "1rem" : "0.92rem", color: row.clr, flexShrink: 0, whiteSpace: "nowrap" }}
                  >
                    {row.val}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3 leading-relaxed" style={{ color: "#8080a8" }}>
              Cálculo orientativo para persona soltera, 35 años, contrato indefinido en {COMUNIDADES_LABEL[ccaa]}. Datos AEAT 2026.
            </p>
          </div>

          {/* CTA if below convenio */}
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
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "#d0d0e8" }}>
                    Si tu empresa te paga por debajo del salario mínimo del convenio colectivo, está incumpliendo la ley laboral. Tienes varias vías para reclamarlo:
                  </p>
                  <ul className="flex flex-col gap-2">
                    {[
                      "Tu sindicato (CCOO, UGT u otros representativos de tu sector)",
                      "La Inspección de Trabajo — denuncia gratuita y confidencial",
                      "El Servicio de Mediación, Arbitraje y Conciliación (SMAC) — paso previo a la demanda",
                      "Un abogado laboralista para reclamar diferencias salariales de los últimos 4 años",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#d0d0e8" }}>
                        <span className="shrink-0 font-bold mt-0.5" style={{ color: "#f87171" }}>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* CTA main calculator */}
          <div
            className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.18)" }}
          >
            <div>
              <p className="font-syne font-bold" style={{ color: "#a5b4fc", fontSize: "0.95rem" }}>
                ¿Quieres calcular tu neto exacto con tu situación personal?
              </p>
              <p className="text-sm mt-1" style={{ color: "#9090b8" }}>
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
