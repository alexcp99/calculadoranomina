"use client";

import { useState, useMemo } from "react";
import {
  computeCalc,
  COMUNIDADES_LABEL,
} from "@/lib/calculator";
import type {
  CalcResult,
  ContractType,
  FamilySituation,
  NumPayments,
  ComunidadAutonoma,
  Disability,
} from "@/lib/calculator";

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtEur(n: number, dec = 0): string {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(n);
}

function fmtPct(n: number): string {
  return n.toFixed(1).replace(".", ",") + " %";
}

// ─── Pill button ──────────────────────────────────────────────────────────────

function Pill({
  active,
  onClick,
  children,
  small,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2.5 rounded-xl font-medium transition-all duration-150 text-center w-full whitespace-nowrap overflow-hidden ${small ? "px-1 text-xs" : "px-2 text-sm"}`}
      style={{
        minHeight: 44,
        background: active ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${active ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)"}`,
        color: active ? "#a5b4fc" : "var(--text-secondary)",
      }}
    >
      {children}
    </button>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#b8b8d8" }}>
      {children}
    </p>
  );
}

// ─── Checkbox row ─────────────────────────────────────────────────────────────

function CheckboxRow({
  checked,
  onToggle,
  label,
  hint,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer select-none"
      style={{
        background: checked ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${checked ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.08)"}`,
        minHeight: 56,
      }}
      onClick={onToggle}
      role="checkbox"
      aria-checked={checked}
    >
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-150"
        style={{
          background: checked ? "#6366f1" : "rgba(255,255,255,0.08)",
          border: `1px solid ${checked ? "#6366f1" : "rgba(255,255,255,0.15)"}`,
        }}
      >
        {checked && (
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
            <path d="M1 3.5l3 3L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
        {hint && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{hint}</p>}
      </div>
    </div>
  );
}

// ─── StatChip ─────────────────────────────────────────────────────────────────

function StatChip({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <div className="rounded-xl px-2.5 py-2.5 flex flex-col gap-0.5" style={{ background: bg, border: `1px solid ${color}25` }}>
      <p className="text-xs font-medium leading-none truncate" style={{ color: `${color}80` }}>{label}</p>
      <p className="font-syne font-bold tabnum text-sm leading-tight" style={{ color }}>{value}</p>
    </div>
  );
}

// ─── Bracket desglose ─────────────────────────────────────────────────────────

const ESTATAL_BRACKETS = [
  { label: "Hasta 12.450 €",       from: 0,      to: 12450,    rate: 9.5,  color: "#34d399" },
  { label: "12.450 € – 20.200 €",  from: 12450,  to: 20200,    rate: 12.0, color: "#6ee7b7" },
  { label: "20.200 € – 35.200 €",  from: 20200,  to: 35200,    rate: 15.0, color: "#818cf8" },
  { label: "35.200 € – 60.000 €",  from: 35200,  to: 60000,    rate: 18.5, color: "#a78bfa" },
  { label: "60.000 € – 300.000 €", from: 60000,  to: 300000,   rate: 22.5, color: "#f87171" },
  { label: "Más de 300.000 €",     from: 300000, to: Infinity, rate: 24.5, color: "#ef4444" },
];

function BracketDesglose({ r }: { r: CalcResult }) {
  const [open, setOpen] = useState(false);
  const bracketRows = ESTATAL_BRACKETS.map((b) => {
    const base = r.baseRetencion;
    if (base <= b.from) return null;
    const portion = Math.min(base, b.to === Infinity ? base : b.to) - b.from;
    const amount = portion * (b.rate / 100);
    return { ...b, amount };
  }).filter(Boolean) as (typeof ESTATAL_BRACKETS[0] & { amount: number })[];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ color: "var(--text-secondary)" }}
      >
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>Desglose retención</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
          <path d="M2 4l5 5 5-5" />
        </svg>
      </button>

      {/* Summary rows */}
      <div className="px-4 pb-4 space-y-0.5">
        <div className="flex justify-between items-baseline py-1">
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Salario bruto</span>
          <span className="tabnum text-sm font-medium" style={{ color: "var(--text-primary)" }}>{fmtEur(r.annualGross)} €</span>
        </div>
        <div className="flex justify-between items-baseline py-1">
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Base de retención</span>
          <span className="tabnum text-sm font-medium" style={{ color: "#a5b4fc" }}>{fmtEur(r.baseRetencion)} €</span>
        </div>
        <div className="flex justify-between items-baseline py-1">
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Retención IRPF anual</span>
          <span className="tabnum text-sm font-medium" style={{ color: "#6366f1" }}>−{fmtEur(r.annualIRPF)} €</span>
        </div>
        <div className="flex justify-between items-baseline py-1" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 8, marginTop: 4 }}>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Neto anual</span>
          <span className="tabnum font-bold text-base" style={{ color: "#34d399" }}>{fmtEur(r.annualNet)} €</span>
        </div>
      </div>

      {/* Expandable bracket detail */}
      {open && (
        <div className="px-4 pb-4 pt-1 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest py-2" style={{ color: "#6868a0" }}>
            Tramos IRPF estatal bruto (base {fmtEur(r.baseRetencion)} €)
          </p>
          <p className="text-xs pb-2" style={{ color: "#4a4a6a" }}>
            Solo parte estatal antes del mínimo personal. La retención total ({fmtEur(r.annualIRPF)} €) incluye también el tramo autonómico, neto de mínimos.
          </p>
          {bracketRows.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: b.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs truncate" style={{ color: "#8080a0" }}>{b.label} ({b.rate}%)</span>
                  <span className="text-xs font-semibold shrink-0 ml-2" style={{ color: b.color }}>{fmtEur(b.amount)} €</span>
                </div>
                <div className="mt-1 rounded-full overflow-hidden" style={{ height: 3, background: "rgba(255,255,255,0.05)" }}>
                  <div style={{
                    width: `${Math.min(100, (b.amount / Math.max(r.annualIRPF, 1)) * 100)}%`,
                    height: "100%",
                    background: b.color,
                    borderRadius: 9999,
                  }} />
                </div>
              </div>
            </div>
          ))}
          {bracketRows.length === 0 && (
            <p className="text-xs" style={{ color: "#4a4a6a" }}>Sin retención (base imponible ≤ mínimos)</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Compact result (mobile) ──────────────────────────────────────────────────

function CompactResult({ r }: { r: CalcResult }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.22)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#8080a8" }}>
        Tipo de retención IRPF
      </p>
      <div className="flex items-baseline gap-1.5 mb-0.5">
        <span className="font-syne font-extrabold tabnum leading-none" style={{ fontSize: "2.4rem", color: "#6366f1" }}>
          {fmtPct(r.irpfEfectivo).replace(" %", "")}
        </span>
        <span className="text-xl font-bold" style={{ color: "rgba(99,102,241,0.6)" }}>%</span>
      </div>
      <p className="tabnum text-sm font-medium mb-4" style={{ color: "#9090b8" }}>
        {fmtEur(r.annualIRPF)} <span style={{ color: "#6a6a8a" }}>€ retenidos/año</span>
      </p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <StatChip label="IRPF ef." value={fmtPct(r.irpfEfectivo)} color="#6366f1" bg="rgba(99,102,241,0.1)" />
        <StatChip label="Seg. Social" value={fmtPct(r.ssRate)} color="#818cf8" bg="rgba(99,102,241,0.1)" />
        <StatChip label="Neto" value={fmtPct(r.netPercent)} color="#34d399" bg="rgba(52,211,153,0.1)" />
      </div>
      <div className="h-2 rounded-full overflow-hidden flex mb-4">
        <div className="transition-all duration-500" style={{ width: `${r.netPercent}%`, background: "linear-gradient(90deg,#34d399,#059669)" }} />
        <div className="transition-all duration-500" style={{ width: `${r.irpfEfectivo}%`, background: "linear-gradient(90deg,#6366f1,#818cf8)" }} />
        <div className="transition-all duration-500" style={{ width: `${r.ssRate}%`, background: "linear-gradient(90deg,#818cf8,#6366f1)" }} />
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Retención mensual</span>
          <span className="tabnum font-medium" style={{ color: "#6366f1" }}>−{fmtEur(r.monthlyIRPF)} €</span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: "var(--text-secondary)" }}>SS mensual</span>
          <span className="tabnum font-medium" style={{ color: "#818cf8" }}>−{fmtEur(r.monthlySS)} €</span>
        </div>
        <div className="flex justify-between text-xs font-semibold" style={{ paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ color: "var(--text-primary)" }}>Neto mensual</span>
          <span className="tabnum" style={{ color: "#34d399" }}>{fmtEur(r.monthlyNet)} €</span>
        </div>
      </div>
    </div>
  );
}

// ─── Full results (desktop) ───────────────────────────────────────────────────

function FullResults({ r }: { r: CalcResult }) {
  return (
    <div className="flex flex-col space-y-6 h-full">
      {/* Big number */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#8080a8" }}>
          Tipo de retención IRPF
        </p>
        <div className="flex items-end gap-2 flex-wrap">
          <span
            className="font-syne font-extrabold tabnum leading-none"
            style={{
              fontSize: "clamp(2rem,4.5vw,3rem)",
              color: "#6366f1",
              textShadow: "0 0 40px rgba(99,102,241,0.4)",
            }}
          >
            {fmtPct(r.irpfEfectivo).replace(" %", "")}
          </span>
          <span className="text-xl font-semibold mb-1" style={{ color: "rgba(99,102,241,0.6)" }}>%</span>
        </div>
        <p className="text-sm mt-1.5 tabnum font-medium" style={{ color: "#9090b8" }}>
          {fmtEur(r.annualIRPF)} <span style={{ color: "#6a6a8a" }}>€ retenidos al año</span>
        </p>
      </div>

      {/* 3 chips */}
      <div className="grid grid-cols-3 gap-2">
        <StatChip label="IRPF efectivo" value={fmtPct(r.irpfEfectivo)} color="#6366f1" bg="rgba(99,102,241,0.08)" />
        <StatChip label="Seg. Social" value={fmtPct(r.ssRate)} color="#818cf8" bg="rgba(99,102,241,0.08)" />
        <StatChip label="Neto" value={fmtPct(r.netPercent)} color="#34d399" bg="rgba(52,211,153,0.08)" />
      </div>

      {/* Bar */}
      <div>
        <div className="h-2.5 rounded-full overflow-hidden flex">
          <div className="transition-all duration-500" style={{ width: `${r.netPercent}%`, background: "linear-gradient(90deg,#34d399,#059669)" }} />
          <div className="transition-all duration-500" style={{ width: `${r.irpfEfectivo}%`, background: "linear-gradient(90deg,#6366f1,#818cf8)" }} />
          <div className="transition-all duration-500" style={{ width: `${r.ssRate}%`, background: "linear-gradient(90deg,#818cf8,#6366f1)" }} />
        </div>
        <div className="flex gap-4 mt-2 flex-wrap" style={{ fontSize: 11 }}>
          <span style={{ color: "#34d399" }}>● Neto {fmtPct(r.netPercent)}</span>
          <span style={{ color: "#6366f1" }}>● IRPF ef. {fmtPct(r.irpfEfectivo)}</span>
          <span style={{ color: "#818cf8" }}>● SS {fmtPct(r.ssRate)}</span>
        </div>
      </div>

      {/* Bracket desglose */}
      <BracketDesglose r={r} />

      {/* Marginal rate */}
      <div
        className="rounded-xl px-4 py-3 flex justify-between items-center"
        style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)" }}
      >
        <span className="text-xs font-medium" style={{ color: "#8080b8" }}>Tipo marginal IRPF</span>
        <span className="tabnum font-bold text-sm" style={{ color: "#a5b4fc" }}>{fmtPct(r.irpfMarginal)}</span>
      </div>

      {/* Neto mensual */}
      <div
        className="rounded-xl px-4 py-3 flex justify-between items-center"
        style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.12)" }}
      >
        <span className="text-xs font-medium" style={{ color: "#406040" }}>Neto mensual</span>
        <span className="tabnum font-bold text-sm" style={{ color: "#34d399" }}>{fmtEur(r.monthlyNet)} €</span>
      </div>

      {/* Disclaimer */}
      <p
        className="text-xs leading-relaxed mt-auto pt-4"
        style={{ color: "#585880", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span style={{ color: "#6868a0" }}>Cálculo orientativo basado en la escala general estatal y autonómica 2026. El tipo
        real puede variar según deducciones personales y situaciones específicas.</span>{" "}
        Fuente: <strong style={{ color: "#8080b0" }}>AEAT 2026</strong>.{" "}
        <span style={{ color: "#6868a0" }}>Consulta con un asesor fiscal.</span>
      </p>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 h-full">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M7 8h4M7 12h8M7 16h5" />
        </svg>
      </div>
      <p className="font-syne font-semibold text-base mb-1.5" style={{ color: "var(--text-primary)" }}>
        Introduce un salario
      </p>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Escribe tu bruto anual o mensual
      </p>
    </div>
  );
}

// ─── Main RetencionCalculator ─────────────────────────────────────────────────

export default function RetencionCalculator() {
  const [rawInput, setRawInput] = useState("30000");
  const [period, setPeriod] = useState<"anual" | "mensual">("anual");
  const [numPayments, setNumPayments] = useState<NumPayments>(12);
  const [comunidad, setComunidad] = useState<ComunidadAutonoma>("madrid");
  const [contract, setContract] = useState<ContractType>("indefinido");
  const [situation, setSituation] = useState<FamilySituation>("soltero");
  const [numChildren, setNumChildren] = useState(0);
  const [spouseNoIncome, setSpouseNoIncome] = useState(false);
  const [ageGroup, setAgeGroup] = useState<35 | 65 | 75>(35);
  const [disability, setDisability] = useState<Disability>("none");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const result = useMemo(() => {
    const clean = rawInput.replace(/\./g, "").replace(",", ".");
    const parsed = parseFloat(clean);
    if (!isFinite(parsed) || parsed <= 0) return null;
    const annual = period === "mensual" ? parsed * 12 : parsed;
    return computeCalc({
      annualGross: annual,
      contractType: contract,
      familySituation: situation,
      numChildren,
      childrenUnder3: 0,
      spouseWithoutIncome: situation === "casado" && spouseNoIncome,
      age: ageGroup,
      comunidad,
      numPayments,
      disability,
      geographicMobility: false,
    });
  }, [rawInput, period, contract, situation, numChildren, spouseNoIncome, ageGroup, disability, comunidad, numPayments]);

  const placeholder = period === "anual" ? "30000" : "2500";
  const communityName = COMUNIDADES_LABEL[comunidad] ?? "Madrid";
  const situacionName = situation === "soltero" ? "Soltero/a" : situation === "casado" ? "Casado/a" : "Monoparental";
  const hijosName = numChildren === 0 ? "Sin hijos" : `${numChildren} hijo${numChildren > 1 ? "s" : ""}`;
  const summaryLine = `${communityName} · ${numPayments} pagas · ${situacionName} · ${hijosName}`;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="w-full grid lg:grid-cols-2">

          {/* ══════════ LEFT / TOP: Inputs ══════════ */}
          <div className="w-full min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col gap-5 lg:gap-6">

            {/* ── Input + period ── */}
            <div className="flex flex-col gap-2">
              <Label>Salario bruto</Label>
              <div
                className="flex items-center gap-3 rounded-2xl px-4 w-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.11)", height: 64 }}
              >
                <span className="font-syne font-bold text-2xl shrink-0 select-none" style={{ color: "rgba(255,255,255,0.22)" }}>€</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={placeholder}
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value.replace(/[^\d.,]/g, ""))}
                  className="flex-1 bg-transparent outline-none font-syne font-bold tabnum min-w-0"
                  style={{ fontSize: "clamp(1.4rem, 6vw, 1.75rem)", color: "var(--text-primary)", caretColor: "#818cf8" }}
                  aria-label="Importe del salario"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(["anual", "mensual"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className="w-full min-w-0 rounded-xl text-sm font-semibold transition-all duration-150 text-center"
                    style={{
                      minHeight: 44,
                      padding: "10px 8px",
                      background: period === p ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${period === p ? "rgba(99,102,241,0.45)" : "rgba(255,255,255,0.08)"}`,
                      color: period === p ? "#a5b4fc" : "var(--text-secondary)",
                    }}
                  >
                    {p === "anual" ? "Anual" : "Mensual"}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Resultado móvil ── */}
            <div className="lg:hidden">
              {result ? (
                <CompactResult r={result} />
              ) : (
                <div
                  className="rounded-2xl px-4 py-5 flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", minHeight: 72 }}
                >
                  <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
                    {rawInput.length > 0 ? "Introduce un importe válido (ej. 30000)" : "Introduce tu salario para ver la retención"}
                  </p>
                </div>
              )}
            </div>

            {/* ── Summary + personalizar ── */}
            <div className="flex flex-col gap-3">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)", color: "#7c7ca0" }}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="6" cy="4.5" r="2" /><path d="M1.5 10.5c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4" />
                </svg>
                <span>Calculando para: <span style={{ color: "#a0a0c0" }}>{summaryLine}</span></span>
              </div>

              {!showAdvanced ? (
                <button
                  type="button"
                  onClick={() => setShowAdvanced(true)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{
                    padding: "10px 16px",
                    background: "linear-gradient(135deg, rgba(99,102,241,0.22) 0%, rgba(129,140,248,0.15) 100%)",
                    border: "1px solid rgba(99,102,241,0.45)",
                    color: "#a5b4fc",
                    boxShadow: "0 2px 12px rgba(99,102,241,0.15)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="7" cy="7" r="2.8" /><path d="M7 1v1.8M7 11.2V13M1 7h1.8M11.2 7H13M2.9 2.9l1.3 1.3M9.8 9.8l1.3 1.3M11.1 2.9L9.8 4.2M4.2 9.8L2.9 11.1" />
                  </svg>
                  Personalizar cálculo
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M3 6h6M7 4l2 2-2 2" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAdvanced(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl text-xs font-medium transition-all duration-200 hover:opacity-80"
                  style={{ padding: "8px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#5a5a80" }}
                >
                  Ocultar opciones avanzadas
                </button>
              )}
            </div>

            {/* ══════════ Advanced fields ══════════ */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: showAdvanced ? "2000px" : "0px", opacity: showAdvanced ? 1 : 0 }}
            >
              <div className="flex flex-col gap-5 lg:gap-6">

                {/* Datos básicos */}
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-semibold uppercase tracking-wider pl-3" style={{ color: "#e0e0ff", borderLeft: "3px solid rgba(99,102,241,0.7)" }}>
                    Datos básicos
                  </p>

                  {/* Número de pagas */}
                  <div>
                    <Label>Número de pagas</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {([12, 14] as NumPayments[]).map((n) => (
                        <Pill key={n} active={numPayments === n} onClick={() => setNumPayments(n)}>{n} pagas</Pill>
                      ))}
                    </div>
                  </div>

                  {/* Comunidad Autónoma */}
                  <div>
                    <Label>Comunidad Autónoma</Label>
                    <div className="relative">
                      <select
                        value={comunidad}
                        onChange={(e) => setComunidad(e.target.value as ComunidadAutonoma)}
                        className="w-full rounded-xl px-4 text-sm font-medium appearance-none"
                        style={{ height: 48, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.11)", color: "var(--text-primary)", outline: "none" }}
                      >
                        {(Object.entries(COMUNIDADES_LABEL) as [ComunidadAutonoma, string][])
                          .sort((a, b) => a[1].localeCompare(b[1], "es"))
                          .map(([value, label]) => (
                            <option key={value} value={value} style={{ background: "#0c0c1e", color: "#f0f0ff" }}>{label}</option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 4l5 5 5-5" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Situación familiar */}
                <div className="flex flex-col gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.25rem" }}>
                  <p className="text-sm font-semibold uppercase tracking-wider pl-3" style={{ color: "#e0e0ff", borderLeft: "3px solid rgba(99,102,241,0.7)" }}>
                    Situación familiar
                  </p>

                  <div>
                    <Label>Estado civil</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { v: "soltero" as FamilySituation, l: "Soltero/a" },
                        { v: "casado" as FamilySituation, l: "Casado/a" },
                        { v: "monoparental" as FamilySituation, l: "Monop." },
                      ]).map(({ v, l }) => (
                        <Pill key={v} small active={situation === v} onClick={() => {
                          setSituation(v);
                          if (v !== "casado") setSpouseNoIncome(false);
                        }}>
                          {l}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  {situation === "casado" && (
                    <CheckboxRow
                      checked={spouseNoIncome}
                      onToggle={() => setSpouseNoIncome((v) => !v)}
                      label="Cónyuge sin ingresos propios"
                      hint="Añade 3.400 € al mínimo personal"
                    />
                  )}

                  <div>
                    <Label>Hijos menores de 25 años</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { v: 0, l: "Sin hijos" },
                        { v: 1, l: "1 hijo" },
                        { v: 2, l: "2 hijos" },
                        { v: 3, l: "3 o más" },
                      ].map(({ v, l }) => (
                        <Pill key={v} small active={numChildren === v} onClick={() => setNumChildren(v)}>{l}</Pill>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Tipo de contrato</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { v: "indefinido" as ContractType, l: "Indefinido" },
                        { v: "temporal" as ContractType, l: "Temporal" },
                      ]).map(({ v, l }) => (
                        <Pill key={v} active={contract === v} onClick={() => setContract(v)}>{l}</Pill>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Otros factores */}
                <div className="flex flex-col gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.25rem" }}>
                  <p className="text-sm font-semibold uppercase tracking-wider pl-3" style={{ color: "#e0e0ff", borderLeft: "3px solid rgba(99,102,241,0.7)" }}>
                    Otros factores
                  </p>

                  <div>
                    <Label>Edad</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { v: 35 as const, l: "< 65 años",  hint: "Mínimo 5.550 €"  },
                        { v: 65 as const, l: "65–74 años", hint: "+1.150 €"         },
                        { v: 75 as const, l: "75+ años",   hint: "+1.400 € más"    },
                      ]).map(({ v, l }) => (
                        <Pill key={v} small active={ageGroup === v} onClick={() => setAgeGroup(v)}>{l}</Pill>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Discapacidad reconocida</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { v: "none"            as Disability, l: "Ninguna"       },
                        { v: "33-65"           as Disability, l: "33–65%"        },
                        { v: "65plus"          as Disability, l: "+65%"          },
                        { v: "65plus-mobility" as Disability, l: "+65% movilidad"},
                      ]).map(({ v, l }) => (
                        <Pill key={v} small active={disability === v} onClick={() => setDisability(v)}>{l}</Pill>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile desglose */}
                {result && (
                  <div className="lg:hidden flex flex-col gap-4">
                    <BracketDesglose r={result} />
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      <span style={{ color: "#6868a0" }}>Cálculo orientativo. Escala estatal + autonómica 2026.</span>{" "}
                      Fuente: <strong style={{ color: "#8080b0" }}>AEAT 2026</strong>.{" "}
                      <span style={{ color: "#6868a0" }}>Consulta con un asesor fiscal.</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ══════════ RIGHT (desktop only): Results ══════════ */}
          <div
            className="hidden lg:flex flex-col p-8 min-w-0 results-panel"
            style={{ background: "rgba(99,102,241,0.025)" }}
          >
            {result ? <FullResults r={result} /> : <EmptyState />}
          </div>
        </div>
      </div>
    </div>
  );
}
