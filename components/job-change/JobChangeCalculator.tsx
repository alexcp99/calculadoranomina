"use client";

import { useState, useRef } from "react";
import {
  computeCalc,
  COMUNIDADES_LABEL,
  type ComunidadAutonoma,
  type ContractType,
  type FamilySituation,
  type Disability,
  type NumPayments,
} from "@/lib/calculator";

// ─── Types ─────────────────────────────────────────────────────────────────────

type TeletrabajoLevel = "none" | "partial" | "full";

const TELETRABAJO_SCORE: Record<TeletrabajoLevel, number> = { none: 0, partial: 1, full: 2 };
const TELETRABAJO_LABEL: Record<TeletrabajoLevel, string> = {
  none: "Sin teletrabajo",
  partial: "Parcial",
  full: "Completo",
};

type JobState = {
  bruto: string;
  ccaa: ComunidadAutonoma;
  pagas: "12" | "14";
  bonus: string;
  vacaciones: string;
  teletrabajo: TeletrabajoLevel;
  antiguedad: string;
};

const INIT_ACTUAL: JobState = {
  bruto: "", ccaa: "madrid", pagas: "12", bonus: "", vacaciones: "22", teletrabajo: "none", antiguedad: "0",
};
const INIT_OFERTA: JobState = {
  bruto: "", ccaa: "madrid", pagas: "12", bonus: "", vacaciones: "22", teletrabajo: "none", antiguedad: "0",
};

const CCAA_OPTIONS = (Object.entries(COMUNIDADES_LABEL) as [ComunidadAutonoma, string][]).sort(
  (a, b) => a[1].localeCompare(b[1], "es"),
);

// ─── Helpers ───────────────────────────────────────────────────────────────────

function fmtN(n: number): string {
  return Math.abs(n).toLocaleString("es-ES", { maximumFractionDigits: 0 });
}
function fmtSigned(n: number): string {
  return (n >= 0 ? "+" : "−") + fmtN(n) + " €";
}
function fi(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

// ─── Small UI primitives ────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-medium block mb-1.5" style={{ color: "#9090b8" }}>
      {children}
    </span>
  );
}

const INPUT_STYLE = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#e0e0ff",
  caretColor: "#6366f1",
} as const;

function NumInput({
  label,
  value,
  onChange,
  placeholder = "0",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col">
      <FieldLabel>
        {label}
        {required && <span style={{ color: "#f87171" }}> *</span>}
      </FieldLabel>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none transition-all"
        style={INPUT_STYLE}
        onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(99,102,241,0.6)"; }}
        onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
      />
    </label>
  );
}

function SelectInput<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="flex flex-col">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none transition-all"
        style={{ ...INPUT_STYLE, appearance: "none" } as React.CSSProperties}
        onFocus={(e) => { (e.currentTarget as HTMLSelectElement).style.borderColor = "rgba(99,102,241,0.6)"; }}
        onBlur={(e) => { (e.currentTarget as HTMLSelectElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#0d0d1a", color: "#e0e0ff" }}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// ─── Job column ────────────────────────────────────────────────────────────────

function JobColumn({
  title,
  accent,
  showAntiguedad,
  state,
  onChange,
}: {
  title: string;
  accent: string;
  showAntiguedad?: boolean;
  state: JobState;
  onChange: (next: JobState) => void;
}) {
  const set = (key: keyof JobState) => (val: string) => onChange({ ...state, [key]: val });

  return (
    <div
      className="flex-1 rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: "rgba(13,13,26,0.85)", border: `1px solid ${accent}35` }}
    >
      <div className="flex items-center gap-2 mb-0.5">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: accent, boxShadow: `0 0 7px ${accent}` }}
        />
        <span className="text-sm font-semibold" style={{ color: accent }}>
          {title}
        </span>
      </div>

      <NumInput
        label="Salario bruto anual"
        value={state.bruto}
        onChange={set("bruto")}
        placeholder="Ej: 35.000"
        required
      />

      <SelectInput<ComunidadAutonoma>
        label="Comunidad autónoma"
        value={state.ccaa}
        onChange={(v) => onChange({ ...state, ccaa: v })}
        options={CCAA_OPTIONS.map(([v, l]) => ({ value: v, label: l }))}
      />

      <SelectInput<"12" | "14">
        label="Pagas"
        value={state.pagas}
        onChange={(v) => onChange({ ...state, pagas: v })}
        options={[
          { value: "12", label: "12 pagas" },
          { value: "14", label: "14 pagas (con extras)" },
        ]}
      />

      <NumInput label="Bonus anual (€)" value={state.bonus} onChange={set("bonus")} placeholder="0" />

      <NumInput label="Días de vacaciones" value={state.vacaciones} onChange={set("vacaciones")} placeholder="22" />

      <SelectInput<TeletrabajoLevel>
        label="Teletrabajo"
        value={state.teletrabajo}
        onChange={(v) => onChange({ ...state, teletrabajo: v })}
        options={[
          { value: "none", label: "Sin teletrabajo" },
          { value: "partial", label: "Parcial (algunos días)" },
          { value: "full", label: "Completo (100%)" },
        ]}
      />

      {showAntiguedad && (
        <NumInput
          label="Antigüedad en empresa (años)"
          value={state.antiguedad}
          onChange={set("antiguedad")}
          placeholder="0"
        />
      )}
    </div>
  );
}

// ─── Qualitative factor row ────────────────────────────────────────────────────

function QualRow({
  icon,
  label,
  value,
  sentiment,
}: {
  icon: string;
  label: string;
  value: string;
  sentiment: "positive" | "negative" | "neutral";
}) {
  const colors = {
    positive: { text: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
    negative: { text: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
    neutral:  { text: "#9090b8", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)" },
  };
  const c = colors[sentiment];
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-base leading-none">{icon}</span>
        <span className="text-sm" style={{ color: "#b0b0c8" }}>{label}</span>
      </div>
      <span className="text-sm font-semibold tabnum" style={{ color: c.text }}>{value}</span>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function JobChangeCalculator() {
  const [actual, setActual] = useState<JobState>(INIT_ACTUAL);
  const [oferta, setOferta] = useState<JobState>(INIT_OFERTA);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Personal profile (advanced)
  const [familySituation, setFamilySituation] = useState<FamilySituation>("soltero");
  const [numChildren, setNumChildren] = useState("0");
  const [age, setAge] = useState("35");
  const [contractType, setContractType] = useState<ContractType>("indefinido");
  const [disability, setDisability] = useState<Disability>("none");
  const [spouseWithoutIncome, setSpouseWithoutIncome] = useState(false);

  const [hasCalculated, setHasCalculated] = useState(false);
  const [validationError, setValidationError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  // ── Validation & calculation trigger ──────────────────────────────────────────

  function handleCompare() {
    const aB = parseFloat(actual.bruto);
    const oB = parseFloat(oferta.bruto);
    if (!aB || aB <= 0) { setValidationError("Introduce el salario bruto de tu trabajo actual."); return; }
    if (!oB || oB <= 0) { setValidationError("Introduce el salario bruto de la nueva oferta."); return; }
    setValidationError("");
    setHasCalculated(true);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  // ── Derived values (only when both brutos are valid) ────────────────────────

  const aB = parseFloat(actual.bruto) || 0;
  const oB = parseFloat(oferta.bruto) || 0;
  const ready = aB > 0 && oB > 0;

  const profile = {
    contractType,
    familySituation,
    numChildren: parseInt(numChildren) || 0,
    childrenUnder3: 0 as const,
    spouseWithoutIncome,
    age: parseInt(age) || 35,
    disability,
    geographicMobility: false as const,
  };

  const aR = ready
    ? computeCalc({ annualGross: aB, comunidad: actual.ccaa, numPayments: parseInt(actual.pagas) as NumPayments, ...profile })
    : null;
  const oR = ready
    ? computeCalc({ annualGross: oB, comunidad: oferta.ccaa, numPayments: parseInt(oferta.pagas) as NumPayments, ...profile })
    : null;

  const aBonus     = parseFloat(actual.bonus) || 0;
  const oBonus     = parseFloat(oferta.bonus) || 0;
  const aVac       = parseInt(actual.vacaciones) || 22;
  const oVac       = parseInt(oferta.vacaciones) || 22;
  const antiguedad = parseInt(actual.antiguedad) || 0;

  const difMensual = aR && oR ? oR.monthlyNet - aR.monthlyNet : 0;
  const difAnual   = aR && oR ? oR.annualNet   - aR.annualNet  : 0;
  const difBonus   = oBonus - aBonus;
  const difTotal   = difAnual + difBonus;

  const difVac      = oVac - aVac;
  const difTeletrab = TELETRABAJO_SCORE[oferta.teletrabajo] - TELETRABAJO_SCORE[actual.teletrabajo];

  // Qualitative score (for verdict)
  let qualScore = 0;
  if (difVac >= 5)   qualScore += 1;
  if (difVac <= -5)  qualScore -= 1;
  if (difTeletrab > 0) qualScore += 1;
  if (difTeletrab < 0) qualScore -= 1;
  if (antiguedad > 3)  qualScore -= 1; // losing seniority is a negative factor

  // Verdict
  const verdict: "green" | "yellow" | "red" =
    difTotal >= 3000 || (difTotal >= 1500 && qualScore >= 2)
      ? "green"
      : difTotal < -1000 || (difTotal < 500 && qualScore <= -2)
      ? "red"
      : "yellow";

  // ── Insights ──────────────────────────────────────────────────────────────────

  const insights: string[] = [];
  if (ready && aR && oR) {
    // CCAA change
    if (actual.ccaa !== oferta.ccaa) {
      const aLabel = COMUNIDADES_LABEL[actual.ccaa];
      const oLabel = COMUNIDADES_LABEL[oferta.ccaa];
      if (oB > aB && difMensual < (oB - aB) / 12 * 0.5) {
        insights.push(
          `Aunque el bruto sube, el neto mejora menos de lo esperado por el cambio de comunidad autónoma (${aLabel} → ${oLabel}). Las diferencias en el tramo autonómico del IRPF reducen la ganancia real.`,
        );
      } else {
        insights.push(
          `Al cambiar de comunidad (${aLabel} → ${oLabel}), el tramo autonómico del IRPF cambia. Asegúrate de comparar el neto neto, no solo el bruto.`,
        );
      }
    }

    // Pagas change
    if (actual.pagas !== oferta.pagas) {
      insights.push(
        `Con ${oferta.pagas} pagas no cobras más al año: el neto anual total es prácticamente el mismo. Lo que cambia es cómo se distribuye ese dinero a lo largo del año.`,
      );
    }

    // Bruto sube pero neto no tanto
    const brutoDelta = oB - aB;
    if (brutoDelta > 5000 && difAnual < brutoDelta * 0.55) {
      insights.push(
        `La subida de bruto (${fmtN(brutoDelta)} €/año) se traduce en solo ${fmtN(difAnual)} € netos extra al año. La progresividad del IRPF absorbe entre el ${fi(((brutoDelta - difAnual) / brutoDelta) * 100)} % de la mejora.`,
      );
    }

    // Bonus es la clave
    if (difBonus > 0 && difBonus > difAnual) {
      insights.push(
        `La mejora principal no viene del salario fijo, sino del bonus (${fmtN(difBonus)} €/año más). Los bonus son variables y no siempre están garantizados. Pregunta si está garantizado contractualmente o depende de objetivos.`,
      );
    }

    // Antigüedad warning
    if (antiguedad >= 3) {
      insights.push(
        `Al cambiar de empresa pierdes ${antiguedad} año${antiguedad !== 1 ? "s" : ""} de antigüedad. Revisa si tu convenio actual incluye pluses por permanencia, mejoras de condiciones por tramos de antigüedad o indemnizaciones especiales.`,
      );
    }
    if (antiguedad >= 6) {
      insights.push(
        `Con ${antiguedad} años en la empresa actual, tu indemnización legal ante un despido improcedente sería de ${fmtN(antiguedad * 33)} días de salario aproximadamente. En la nueva empresa empezarías desde cero.`,
      );
    }

    // Vacation negative
    if (difVac <= -5) {
      insights.push(
        `Perderías ${Math.abs(difVac)} días de vacaciones. A €/día equivale a renunciar a aproximadamente ${fmtN(Math.round((oR.annualGross / 220) * Math.abs(difVac)))} € brutos en tiempo libre al año.`,
      );
    }
  }

  // ── Verdict config ────────────────────────────────────────────────────────────

  const verdictConfig = {
    green: {
      icon: "✅",
      title: "En principio, te conviene",
      sub: "La mejora económica y los factores cualitativos apuntan a que el cambio es favorable.",
      color: "#34d399",
      bg: "rgba(52,211,153,0.06)",
      border: "rgba(52,211,153,0.22)",
    },
    yellow: {
      icon: "⚠️",
      title: "Valóralo bien antes de decidir",
      sub: "La diferencia económica es moderada. Los factores no salariales pueden ser determinantes.",
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.06)",
      border: "rgba(251,191,36,0.22)",
    },
    red: {
      icon: "❌",
      title: "Con estos números, no parece rentable",
      sub: "La compensación total empeora o la mejora es insuficiente dado lo que perderías.",
      color: "#f87171",
      bg: "rgba(248,113,113,0.06)",
      border: "rgba(248,113,113,0.22)",
    },
  };

  const vc = verdictConfig[verdict];

  // ── Diff color ────────────────────────────────────────────────────────────────

  const diffColor = difTotal > 500 ? "#34d399" : difTotal < -200 ? "#f87171" : "#fbbf24";

  // ─── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-8">
      {/* ── Advanced profile toggle ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(13,13,26,0.6)" }}
      >
        <button
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium transition-colors"
          style={{ color: showAdvanced ? "#a5b4fc" : "#7c7ca0" }}
          onClick={() => setShowAdvanced((v) => !v)}
        >
          <span className="flex items-center gap-2.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="7" cy="4.5" r="2" /><path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" />
            </svg>
            Perfil personal
          </span>
          <span className="flex items-center gap-2 text-xs" style={{ color: "#5a5a80" }}>
            {showAdvanced ? "Ocultar" : "Personalizar situación familiar, edad y contrato"}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transition-transform duration-200" style={{ transform: showAdvanced ? "rotate(180deg)" : "none" }}>
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: showAdvanced ? "400px" : "0px" }}
        >
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-5 pb-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="pt-4">
              <SelectInput<FamilySituation>
                label="Situación familiar"
                value={familySituation}
                onChange={setFamilySituation}
                options={[
                  { value: "soltero", label: "Soltero/a" },
                  { value: "casado", label: "Casado/a" },
                  { value: "monoparental", label: "Monoparental" },
                ]}
              />
            </div>
            <div className="pt-4">
              <NumInput label="Hijos a cargo" value={numChildren} onChange={setNumChildren} placeholder="0" />
            </div>
            <div className="pt-4">
              <NumInput label="Edad" value={age} onChange={setAge} placeholder="35" />
            </div>
            <div>
              <SelectInput<ContractType>
                label="Tipo de contrato"
                value={contractType}
                onChange={setContractType}
                options={[
                  { value: "indefinido", label: "Indefinido" },
                  { value: "temporal", label: "Temporal" },
                ]}
              />
            </div>
            <div>
              <SelectInput<Disability>
                label="Discapacidad"
                value={disability}
                onChange={setDisability}
                options={[
                  { value: "none", label: "Sin discapacidad" },
                  { value: "33-65", label: "33%–65%" },
                  { value: "65plus", label: "> 65%" },
                  { value: "65plus-mobility", label: "> 65% + movilidad" },
                ]}
              />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <button
                type="button"
                onClick={() => setSpouseWithoutIncome((v) => !v)}
                className="relative w-10 h-5 rounded-full shrink-0 transition-colors duration-200"
                style={{ background: spouseWithoutIncome ? "#6366f1" : "rgba(255,255,255,0.12)" }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-200"
                  style={{
                    background: "#fff",
                    transform: spouseWithoutIncome ? "translateX(22px)" : "translateX(2px)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                />
              </button>
              <span className="text-xs" style={{ color: "#9090b8" }}>
                Cónyuge sin ingresos
              </span>
            </div>
          </div>
          <p className="px-5 pb-4 text-xs" style={{ color: "#4a4a6a" }}>
            Por defecto: soltero/a · sin hijos · 35 años · indefinido. Estas opciones se aplican a ambos escenarios para que la comparativa sea justa.
          </p>
        </div>
      </div>

      {/* ── Job columns ── */}
      <div className="flex flex-col md:flex-row gap-4">
        <JobColumn
          title="Trabajo actual"
          accent="#818cf8"
          showAntiguedad
          state={actual}
          onChange={setActual}
        />
        <div
          className="hidden md:flex items-center justify-center shrink-0"
          style={{ width: 32 }}
        >
          <span className="text-xl font-bold" style={{ color: "#3d3d60" }}>vs</span>
        </div>
        <JobColumn
          title="Nueva oferta"
          accent="#34d399"
          state={oferta}
          onChange={setOferta}
        />
      </div>

      {/* ── Validation error ── */}
      {validationError && (
        <p
          className="text-sm px-4 py-3 rounded-xl"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
        >
          {validationError}
        </p>
      )}

      {/* ── CTA ── */}
      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(99,102,241,0.55)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(99,102,241,0.4)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 8h4M10 8h4M8 2v4M8 10v4" />
            <circle cx="8" cy="8" r="2.5" />
          </svg>
          Comparar ofertas
        </button>
      </div>

      {/* ══ RESULTS ══ */}
      {hasCalculated && ready && aR && oR && (
        <div ref={resultRef} className="flex flex-col gap-5 animate-scaleIn">

          {/* ── Bloque 1: Summary cards ── */}
          <div className="flex flex-col md:flex-row gap-4">
            {[
              {
                label: "Trabajo actual",
                r: aR,
                bonus: aBonus,
                vac: aVac,
                tele: actual.teletrabajo,
                ccaa: COMUNIDADES_LABEL[actual.ccaa],
                pagas: actual.pagas,
                accent: "#818cf8",
              },
              {
                label: "Nueva oferta",
                r: oR,
                bonus: oBonus,
                vac: oVac,
                tele: oferta.teletrabajo,
                ccaa: COMUNIDADES_LABEL[oferta.ccaa],
                pagas: oferta.pagas,
                accent: "#34d399",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="flex-1 rounded-2xl p-5"
                style={{ background: "rgba(13,13,26,0.85)", border: `1px solid ${card.accent}30` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: card.accent }} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: card.accent }}>
                    {card.label}
                  </span>
                </div>

                <div className="mb-4">
                  <div
                    className="font-syne font-extrabold leading-none tabnum"
                    style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "#f0f0ff" }}
                  >
                    {fmtN(Math.round(card.r.monthlyNet))} €
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#5a5a80" }}>
                    neto mensual
                  </div>
                </div>

                <div className="flex flex-col gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                  {[
                    { label: "Neto anual",    val: `${fmtN(Math.round(card.r.annualNet))} €` },
                    { label: "IRPF efectivo", val: `${fi(card.r.irpfEfectivo)} %`           },
                    { label: "Bonus anual",   val: card.bonus > 0 ? `${fmtN(card.bonus)} €` : "—" },
                    { label: "Pagas",         val: card.pagas },
                    { label: "CCAA",          val: card.ccaa },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#5a5a80" }}>{label}</span>
                      <span className="text-xs font-medium tabnum" style={{ color: "#a0a0c0" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Bloque 2: Diferencia real (protagonist) ── */}
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: `${diffColor}08`,
              border: `1px solid ${diffColor}30`,
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#5a5a80" }}>
              Diferencia real
            </p>
            <div
              className="font-syne font-extrabold tabnum leading-none mb-1"
              style={{ fontSize: "clamp(2rem, 6vw, 3rem)", color: diffColor }}
            >
              {fmtSigned(Math.round(difMensual))}
            </div>
            <div className="text-sm mb-4" style={{ color: "#7c7ca0" }}>al mes</div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="text-center">
                <div className="font-syne font-bold text-lg tabnum" style={{ color: difAnual >= 0 ? "#34d399" : "#f87171" }}>
                  {fmtSigned(Math.round(difAnual))}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#5a5a80" }}>neto/año</div>
              </div>
              {difBonus !== 0 && (
                <>
                  <span style={{ color: "#3d3d60" }}>+</span>
                  <div className="text-center">
                    <div className="font-syne font-bold text-lg tabnum" style={{ color: difBonus >= 0 ? "#34d399" : "#f87171" }}>
                      {fmtSigned(difBonus)}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#5a5a80" }}>bonus</div>
                  </div>
                  <span style={{ color: "#3d3d60" }}>=</span>
                  <div className="text-center">
                    <div
                      className="font-syne font-bold text-lg tabnum"
                      style={{ color: difTotal >= 0 ? "#34d399" : "#f87171" }}
                    >
                      {fmtSigned(Math.round(difTotal))}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#5a5a80" }}>compensación total/año</div>
                  </div>
                </>
              )}
            </div>

            {/* Dynamic copy */}
            <p className="text-sm mt-5 leading-relaxed" style={{ color: "#9090b8" }}>
              {difMensual >= 200
                ? `Cobrarías ${fmtN(Math.round(difMensual))} € más al mes netos.${difTotal > difAnual ? ` Contando el bonus, la mejora total anual sería de ${fmtN(Math.round(difTotal))} €.` : ""}`
                : difMensual <= -100
                ? `Cobrarías ${fmtN(Math.round(Math.abs(difMensual)))} € menos al mes netos.${difTotal > difAnual ? ` El bonus compensa parcialmente: la pérdida total anual sería de ${fmtN(Math.round(Math.abs(difTotal)))} €.` : ""}`
                : `La diferencia mensual en neto es pequeña (${fmtN(Math.round(Math.abs(difMensual)))} €). El peso de la decisión recae más en los factores no económicos.`}
            </p>
          </div>

          {/* ── Bloque 3: Factores adicionales ── */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#5a5a80" }}
            >
              Factores adicionales
            </p>
            <div className="flex flex-col gap-2">
              {/* Bonus */}
              <QualRow
                icon="🎯"
                label="Bonus anual"
                value={
                  difBonus === 0
                    ? "Sin cambio"
                    : difBonus > 0
                    ? `+${fmtN(difBonus)} €/año con la nueva oferta`
                    : `−${fmtN(Math.abs(difBonus))} €/año con la nueva oferta`
                }
                sentiment={difBonus > 0 ? "positive" : difBonus < 0 ? "negative" : "neutral"}
              />

              {/* Vacaciones */}
              <QualRow
                icon="🏖️"
                label="Vacaciones"
                value={
                  difVac === 0
                    ? `${oVac} días (sin cambio)`
                    : difVac > 0
                    ? `+${difVac} días más (${oVac} vs ${aVac})`
                    : `${Math.abs(difVac)} días menos (${oVac} vs ${aVac})`
                }
                sentiment={difVac > 0 ? "positive" : difVac < 0 ? "negative" : "neutral"}
              />

              {/* Teletrabajo */}
              <QualRow
                icon="🏠"
                label="Teletrabajo"
                value={
                  difTeletrab === 0
                    ? TELETRABAJO_LABEL[oferta.teletrabajo]
                    : difTeletrab > 0
                    ? `Mejora: ${TELETRABAJO_LABEL[actual.teletrabajo]} → ${TELETRABAJO_LABEL[oferta.teletrabajo]}`
                    : `Empeora: ${TELETRABAJO_LABEL[actual.teletrabajo]} → ${TELETRABAJO_LABEL[oferta.teletrabajo]}`
                }
                sentiment={difTeletrab > 0 ? "positive" : difTeletrab < 0 ? "negative" : "neutral"}
              />

              {/* Antigüedad */}
              {antiguedad > 0 && (
                <QualRow
                  icon="📅"
                  label="Antigüedad"
                  value={
                    antiguedad === 1
                      ? "Pierdes 1 año en la empresa actual"
                      : `Pierdes ${antiguedad} años de antigüedad en la empresa actual`
                  }
                  sentiment={antiguedad >= 3 ? "negative" : "neutral"}
                />
              )}

              {/* Pagas */}
              {actual.pagas !== oferta.pagas && (
                <QualRow
                  icon="📋"
                  label="Distribución de pagas"
                  value={`Cambias de ${actual.pagas} a ${oferta.pagas} pagas (el total anual no cambia)`}
                  sentiment="neutral"
                />
              )}

              {/* CCAA */}
              {actual.ccaa !== oferta.ccaa && (
                <QualRow
                  icon="🗺️"
                  label="Comunidad autónoma"
                  value={`${COMUNIDADES_LABEL[actual.ccaa]} → ${COMUNIDADES_LABEL[oferta.ccaa]}`}
                  sentiment={difMensual >= 0 ? "neutral" : "negative"}
                />
              )}
            </div>
          </div>

          {/* ── Bloque 4: Veredicto ── */}
          <div
            className="rounded-2xl p-5 md:p-6"
            style={{ background: vc.bg, border: `1px solid ${vc.border}` }}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl leading-none shrink-0">{vc.icon}</span>
              <div>
                <p className="font-syne font-bold text-base" style={{ color: vc.color }}>
                  {vc.title}
                </p>
                <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "#9090b8" }}>
                  {vc.sub}
                </p>
                <p className="text-xs mt-3 leading-relaxed" style={{ color: "#6060a0" }}>
                  Este análisis es orientativo. La decisión de cambiar de trabajo depende también de factores que no se pueden medir: cultura de empresa, proyección profesional, estabilidad del sector, relación con el equipo, y tus prioridades vitales.
                </p>
              </div>
            </div>
          </div>

          {/* ── Bloque 5: Insights ── */}
          {insights.length > 0 && (
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "#5a5a80" }}
              >
                Análisis detallado
              </p>
              <div className="flex flex-col gap-2.5">
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-xl px-4 py-3.5"
                    style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.14)" }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 mt-0.5"
                    >
                      <circle cx="8" cy="8" r="6.5" />
                      <path d="M8 7v4M8 5v.5" />
                    </svg>
                    <p className="text-sm leading-relaxed" style={{ color: "#9090b8" }}>
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CTA to main calculator ── */}
          <div
            className="rounded-xl px-5 py-4 flex items-center justify-between gap-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-sm" style={{ color: "#7c7ca0" }}>
              ¿Quieres ver el desglose completo de cotizaciones, IRPF y neto mensual de cualquiera de los dos empleos?
            </p>
            <a
              href="/"
              className="shrink-0 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
              style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.25)" }}
            >
              Calculadora completa →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
