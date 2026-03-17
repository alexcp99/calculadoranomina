"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  computeCalc,
  computeNetToGrossCalc,
  COMUNIDADES_LABEL,
} from "@/lib/calculator";
import type {
  CalcResult,
  CalcInput,
  ContractType,
  FamilySituation,
  Disability,
  NumPayments,
  ComunidadAutonoma,
} from "@/lib/calculator";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode   = "bruto-neto" | "neto-bruto";
type Period = "anual" | "mensual";

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

// ─── Compute result ───────────────────────────────────────────────────────────

function computeResult(
  rawInput: string,
  period: Period,
  mode: Mode,
  opts: Omit<CalcInput, "annualGross">
): CalcResult | null {
  const clean  = rawInput.replace(/\./g, "").replace(",", ".");
  const parsed = parseFloat(clean);
  if (!isFinite(parsed) || parsed <= 0) return null;

  const annual = period === "mensual" ? parsed * 12 : parsed;

  return mode === "bruto-neto"
    ? computeCalc({ annualGross: annual, ...opts })
    : computeNetToGrossCalc(annual, opts);
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
    <p
      className="text-xs font-semibold uppercase tracking-wider mb-2"
      style={{ color: "#b8b8d8" }}
    >
      {children}
    </p>
  );
}

// ─── Collapsible section header ───────────────────────────────────────────────

function SectionHeader({
  title,
  open,
  onToggle,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3"
      style={{ color: "var(--text-secondary)" }}
    >
      <span
        className="text-sm font-semibold uppercase tracking-wider pl-3"
        style={{
          color: "#e0e0ff",
          borderLeft: "3px solid rgba(99,102,241,0.7)",
        }}
      >
        {title}
      </span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transform: open ? "rotate(180deg)" : "rotate(0)",
          transition: "transform 0.2s",
          flexShrink: 0,
        }}
      >
        <path d="M2 4l5 5 5-5" />
      </svg>
    </button>
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
            <path
              d="M1 3.5l3 3L10 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {label}
        </p>
        {hint && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Rate chip ────────────────────────────────────────────────────────────────

function StatChip({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="rounded-xl px-2.5 py-2.5 flex flex-col gap-0.5"
      style={{ background: bg, border: `1px solid ${color}25` }}
    >
      <p
        className="text-xs font-medium leading-none truncate"
        style={{ color: `${color}80` }}
      >
        {label}
      </p>
      <p
        className="font-syne font-bold tabnum text-sm leading-tight"
        style={{ color }}
      >
        {value}
      </p>
    </div>
  );
}

// ─── Breakdown row ────────────────────────────────────────────────────────────

function BreakdownRow({
  label,
  amount,
  color,
  bold,
  topBorder,
  indent,
}: {
  label: string;
  amount: number;
  color: string;
  bold?: boolean;
  topBorder?: boolean;
  indent?: boolean;
}) {
  return (
    <div
      className="flex justify-between items-baseline py-1"
      style={
        topBorder
          ? { borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 4, paddingTop: 10 }
          : {}
      }
    >
      <span
        className={`text-sm ${bold ? "font-semibold" : ""} ${indent ? "pl-4" : ""}`}
        style={{ color: bold ? "var(--text-primary)" : "var(--text-secondary)" }}
      >
        {label}
      </span>
      <span
        className={`tabnum ml-4 ${bold ? "font-bold text-base" : "text-sm font-medium"}`}
        style={{ color }}
      >
        {amount < 0 ? "−" : ""}
        {fmtEur(Math.abs(amount))} €
      </span>
    </div>
  );
}

// ─── Desglose (collapsible, full) ─────────────────────────────────────────────

function Desglose({ r }: { r: CalcResult }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ color: "var(--text-secondary)" }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          Desglose anual
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        >
          <path d="M2 4l5 5 5-5" />
        </svg>
      </button>

      {/* Always-visible summary */}
      <div className="px-4 pb-4 space-y-0.5">
        <BreakdownRow
          label="Salario bruto"
          amount={r.annualGross}
          color="var(--text-primary)"
          bold
        />
        <BreakdownRow
          label={`Seg. Social (${fmtPct(r.ssRate)})`}
          amount={-r.annualSS}
          color="#818cf8"
        />
        <BreakdownRow
          label={`IRPF ef. ${fmtPct(r.irpfEfectivo)} / marg. ${fmtPct(r.irpfMarginal)}`}
          amount={-r.annualIRPF}
          color="#fbbf24"
        />
        <BreakdownRow
          label="Neto anual"
          amount={r.annualNet}
          color="#34d399"
          bold
          topBorder
        />
      </div>

      {/* Expandable detail */}
      {open && (
        <div
          className="px-4 pb-4 pt-1 space-y-0.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* SS breakdown */}
          <p
            className="text-xs font-semibold uppercase tracking-widest py-2"
            style={{ color: "var(--text-muted)" }}
          >
            Seguridad Social empleado
          </p>
          <BreakdownRow
            label="Base de cotización"
            amount={r.cotizacionBase}
            color="var(--text-secondary)"
            indent
          />
          <BreakdownRow
            label={`Contingencias (4,70%)`}
            amount={-r.ssContingencias}
            color="#818cf8"
            indent
          />
          <BreakdownRow
            label={`Desempleo`}
            amount={-r.ssDesempleo}
            color="#818cf8"
            indent
          />
          <BreakdownRow
            label={`Formación Profesional (0,10%)`}
            amount={-r.ssFP}
            color="#818cf8"
            indent
          />
          <BreakdownRow
            label={`MEI (0,15%)`}
            amount={-r.ssMEI}
            color="#818cf8"
            indent
          />

          {/* IRPF paso a paso */}
          <p
            className="text-xs font-semibold uppercase tracking-widest py-2 pt-4"
            style={{ color: "var(--text-muted)" }}
          >
            Cálculo IRPF paso a paso
          </p>
          <BreakdownRow
            label="Gastos deducibles (Art. 19)"
            amount={-r.gastosDeducibles}
            color="var(--text-secondary)"
            indent
          />
          <BreakdownRow
            label="Rdto. neto trabajo"
            amount={r.rendimientoNeto}
            color="var(--text-secondary)"
            indent
          />
          <BreakdownRow
            label="Reducción Art. 20"
            amount={-r.reduccionArt20}
            color="var(--text-secondary)"
            indent
          />
          <BreakdownRow
            label="Rdto. neto reducido"
            amount={r.rendimientoNetoReducido}
            color="var(--text-secondary)"
            indent
          />
          <BreakdownRow
            label={`Mínimo personal (edad)`}
            amount={-r.minimoPersonal}
            color="var(--text-secondary)"
            indent
          />
          <BreakdownRow
            label="Mínimo familiar"
            amount={-r.minimoFamiliar}
            color="var(--text-secondary)"
            indent
          />
          <BreakdownRow
            label="Base de retención IRPF"
            amount={r.baseRetencion}
            color="var(--text-primary)"
            bold
            topBorder
          />

          {/* Empresa */}
          <p
            className="text-xs font-semibold uppercase tracking-widest py-2 pt-4"
            style={{ color: "var(--text-muted)" }}
          >
            Coste empresa
          </p>
          <BreakdownRow
            label="SS empresa"
            amount={r.employerSS}
            color="var(--text-secondary)"
            indent
          />
          <BreakdownRow
            label="Coste total empresa"
            amount={r.totalEmployerCost}
            color="#a5b4fc"
            bold
            topBorder
          />
        </div>
      )}
    </div>
  );
}

// ─── Compact result (mobile) ──────────────────────────────────────────────────

function CompactResult({ r, mode }: { r: CalcResult; mode: Mode }) {
  const isNB    = mode === "neto-bruto";
  const monthly = isNB ? r.monthlyGross : r.netPerPayment;
  const annual  = isNB ? r.annualGross  : r.annualNet;
  const color       = isNB ? "#a5b4fc" : "#34d399";
  const accentBg    = isNB ? "rgba(99,102,241,0.08)"  : "rgba(52,211,153,0.07)";
  const accentBorder = isNB ? "rgba(99,102,241,0.22)" : "rgba(52,211,153,0.2)";
  const label       = isNB ? "Bruto necesario" : "Salario neto";

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
    >
      {/* Label */}
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>

      {/* Número mensual */}
      <div className="flex items-baseline gap-1.5 mb-0.5">
        <span
          className="font-syne font-extrabold tabnum leading-none"
          style={{ fontSize: "2.4rem", color }}
        >
          {fmtEur(monthly)}
        </span>
        <span className="text-xl font-bold" style={{ color: `${color}70` }}>
          €
        </span>
        <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>
          /mes
        </span>
      </div>

      {/* Anual */}
      <p className="tabnum text-sm mb-4" style={{ color: `${color}80` }}>
        {fmtEur(annual)} € al año
      </p>

      {/* 3 chips */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <StatChip
          label="IRPF ef."
          value={fmtPct(r.irpfEfectivo)}
          color="#fbbf24"
          bg="rgba(251,191,36,0.1)"
        />
        <StatChip
          label="Seg. Social"
          value={fmtPct(r.ssRate)}
          color="#818cf8"
          bg="rgba(99,102,241,0.1)"
        />
        <StatChip
          label="Neto"
          value={fmtPct(r.netPercent)}
          color="#34d399"
          bg="rgba(52,211,153,0.1)"
        />
      </div>

      {/* Bar */}
      <div className="h-2 rounded-full overflow-hidden flex mb-4">
        <div
          style={{
            width: `${r.netPercent}%`,
            background: "linear-gradient(90deg,#34d399,#059669)",
          }}
        />
        <div
          style={{
            width: `${r.irpfEfectivo}%`,
            background: "linear-gradient(90deg,#fbbf24,#d97706)",
          }}
        />
        <div
          style={{
            width: `${r.ssRate}%`,
            background: "linear-gradient(90deg,#818cf8,#6366f1)",
          }}
        />
      </div>

      {/* Mini table */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span style={{ color: "var(--text-secondary)" }}>SS anual</span>
          <span className="tabnum font-medium" style={{ color: "#818cf8" }}>
            −{fmtEur(r.annualSS)} €
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: "var(--text-secondary)" }}>IRPF anual</span>
          <span className="tabnum font-medium" style={{ color: "#fbbf24" }}>
            −{fmtEur(r.annualIRPF)} €
          </span>
        </div>
        <div className="flex justify-between text-xs font-semibold" style={{ paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ color: "var(--text-primary)" }}>Neto anual</span>
          <span className="tabnum" style={{ color: "#34d399" }}>
            {fmtEur(r.annualNet)} €
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Coste empresa</span>
          <span className="tabnum font-medium" style={{ color: "#a5b4fc" }}>
            {fmtEur(r.totalEmployerCost)} €
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Full results (desktop) ───────────────────────────────────────────────────

function FullResults({ r, mode }: { r: CalcResult; mode: Mode }) {
  const isNB    = mode === "neto-bruto";
  const monthly = isNB ? r.monthlyGross : r.netPerPayment;
  const annual  = isNB ? r.annualGross  : r.annualNet;
  const color   = isNB ? "#a5b4fc" : "#34d399";
  const label   = isNB ? "Bruto necesario / mes" : "Salario neto mensual";

  return (
    <div className="flex flex-col space-y-6 h-full">
      {/* Big number */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </p>
        <div className="flex items-end gap-2 flex-wrap">
          <span
            className="font-syne font-extrabold tabnum leading-none"
            style={{
              fontSize: "clamp(2rem,4.5vw,3rem)",
              color,
              textShadow: `0 0 40px ${color}40`,
            }}
          >
            {fmtEur(monthly)}
          </span>
          <span className="text-xl font-semibold mb-1" style={{ color: `${color}60` }}>
            €
          </span>
        </div>
        <p className="text-sm mt-1.5 tabnum" style={{ color: "var(--text-secondary)" }}>
          {fmtEur(annual)} € al año
        </p>
      </div>

      {/* 3 chips */}
      <div className="grid grid-cols-3 gap-2">
        <StatChip
          label="IRPF efectivo"
          value={fmtPct(r.irpfEfectivo)}
          color="#fbbf24"
          bg="rgba(251,191,36,0.08)"
        />
        <StatChip
          label="Seg. Social"
          value={fmtPct(r.ssRate)}
          color="#818cf8"
          bg="rgba(99,102,241,0.08)"
        />
        <StatChip
          label="Neto"
          value={fmtPct(r.netPercent)}
          color="#34d399"
          bg="rgba(52,211,153,0.08)"
        />
      </div>

      {/* Bar */}
      <div>
        <div className="h-2.5 rounded-full overflow-hidden flex">
          <div
            className="transition-all duration-500"
            style={{
              width: `${r.netPercent}%`,
              background: "linear-gradient(90deg,#34d399,#059669)",
            }}
          />
          <div
            className="transition-all duration-500"
            style={{
              width: `${r.irpfEfectivo}%`,
              background: "linear-gradient(90deg,#fbbf24,#d97706)",
            }}
          />
          <div
            className="transition-all duration-500"
            style={{
              width: `${r.ssRate}%`,
              background: "linear-gradient(90deg,#818cf8,#6366f1)",
            }}
          />
        </div>
        <div className="flex gap-4 mt-2 flex-wrap" style={{ fontSize: 11 }}>
          <span style={{ color: "#34d399" }}>● Neto {fmtPct(r.netPercent)}</span>
          <span style={{ color: "#fbbf24" }}>● IRPF ef. {fmtPct(r.irpfEfectivo)}</span>
          <span style={{ color: "#818cf8" }}>● SS {fmtPct(r.ssRate)}</span>
        </div>
      </div>

      {/* Desglose */}
      <Desglose r={r} />

      {/* Marginal rate info */}
      <div
        className="rounded-xl px-4 py-3 flex justify-between items-center"
        style={{
          background: "rgba(251,191,36,0.05)",
          border: "1px solid rgba(251,191,36,0.12)",
        }}
      >
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Tipo marginal IRPF
        </span>
        <span className="tabnum font-bold text-sm" style={{ color: "#fbbf24" }}>
          {fmtPct(r.irpfMarginal)}
        </span>
      </div>

      {/* Employer cost */}
      <div
        className="rounded-xl px-4 py-3 flex justify-between items-center"
        style={{
          background: "rgba(99,102,241,0.05)",
          border: "1px solid rgba(99,102,241,0.12)",
        }}
      >
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Coste total empresa
        </span>
        <span className="tabnum font-bold text-sm" style={{ color: "#a5b4fc" }}>
          {fmtEur(r.totalEmployerCost)} €
        </span>
      </div>

      {/* Disclaimer */}
      <p
        className="text-xs leading-relaxed mt-auto pt-4"
        style={{
          color: "var(--text-muted)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        Cálculo orientativo basado en la escala general estatal y autonómica 2026. El tipo
        real puede variar según deducciones personales y situaciones específicas. Fuente:{" "}
        <strong style={{ color: "#4a4a6a" }}>AEAT 2026</strong>. Consulta con un asesor fiscal.
      </p>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ mode }: { mode: Mode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 h-full">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: "rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.18)",
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6366f1"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M14.5 9c-.8-1.3-2.2-2-3.5-2a4 4 0 000 8c1.3 0 2.7-.7 3.5-2" />
          <line x1="6" y1="11" x2="13" y2="11" />
          <line x1="6" y1="13" x2="13" y2="13" />
        </svg>
      </div>
      <p className="font-syne font-semibold text-base mb-1.5" style={{ color: "var(--text-primary)" }}>
        Introduce un salario
      </p>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        {mode === "bruto-neto"
          ? "Escribe tu bruto anual o mensual"
          : "Escribe el neto deseado"}
      </p>
    </div>
  );
}

// ─── Main Calculator ──────────────────────────────────────────────────────────

export default function Calculator() {
  // ── State ────────────────────────────────────────────────────────────────
  const [mode,          setMode]          = useState<Mode>("bruto-neto");
  const [rawInput,      setRawInput]      = useState("30000");
  const [period,        setPeriod]        = useState<Period>("anual");
  const [numPayments,   setNumPayments]   = useState<NumPayments>(12);
  const [comunidad,     setComunidad]     = useState<ComunidadAutonoma>("madrid");
  const [contract,      setContract]      = useState<ContractType>("indefinido");
  const [situation,     setSituation]     = useState<FamilySituation>("soltero");
  const [numChildren,   setNumChildren]   = useState(0);
  const [childrenUnder3, setChildrenUnder3] = useState(0);
  const [spouseNoIncome, setSpouseNoIncome] = useState(false);
  const [age,           setAge]           = useState(30);
  const [ageRaw,        setAgeRaw]        = useState("30");
  const [disability,    setDisability]    = useState<Disability>("none");
  const [mobility,      setMobility]      = useState(false);
  const [openFamiliar,  setOpenFamiliar]  = useState(true);
  const [openOtros,     setOpenOtros]     = useState(false);
  const [showAdvanced,  setShowAdvanced]  = useState(false);

  // ── Derived ──────────────────────────────────────────────────────────────
  const opts: Omit<CalcInput, "annualGross"> = {
    contractType:       contract,
    familySituation:    situation,
    numChildren,
    childrenUnder3:     Math.min(childrenUnder3, numChildren),
    spouseWithoutIncome: spouseNoIncome,
    age,
    comunidad,
    numPayments,
    disability,
    geographicMobility: mobility,
  };

  const result = computeResult(rawInput, period, mode, opts);

  const inputLabel = mode === "bruto-neto" ? "Salario bruto" : "Neto deseado";

  // ── Summary line ────────────────────────────────────────────────────────────
  const communityName = COMUNIDADES_LABEL[comunidad] ?? "Madrid";
  const situacionName = situation === "soltero" ? "Soltero/a" : situation === "casado" ? "Casado/a" : "Monoparental";
  const hijosName = numChildren === 0 ? "Sin hijos" : `${numChildren} hijo${numChildren > 1 ? "s" : ""}`;
  const summaryLine = `${communityName} · ${numPayments} pagas · ${situacionName} · ${hijosName}`;

  // ── Related salary pages ────────────────────────────────────────────────────
  const SALARY_SLUGS = [20000, 25000, 30000, 40000, 50000];
  const relatedSalaries = useMemo(() => {
    const inputNum = parseFloat(rawInput.replace(/\./g, "").replace(",", "."));
    if (!isFinite(inputNum) || inputNum <= 0) return [20000, 30000, 50000];
    const annualBruto = period === "mensual" ? inputNum * 12 : inputNum;
    return [...SALARY_SLUGS]
      .sort((a, b) => Math.abs(a - annualBruto) - Math.abs(b - annualBruto))
      .slice(0, 3)
      .sort((a, b) => a - b);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawInput, period]);
  const placeholder = period === "anual" ? "30000" : "2500";

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="w-full grid lg:grid-cols-2">

          {/* ══════════ LEFT / TOP: Inputs ══════════ */}
          <div className="w-full min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col gap-5 lg:gap-6">

            {/* ── Mode toggle — order-1 ── */}
            <div
              className="order-1 w-full grid grid-cols-2 gap-1 rounded-2xl p-1 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              {(
                [
                  { v: "bruto-neto" as Mode, l: "Bruto → Neto" },
                  { v: "neto-bruto" as Mode, l: "Neto → Bruto" },
                ] as const
              ).map(({ v, l }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setMode(v)}
                  className="w-full min-w-0 rounded-xl font-semibold transition-all duration-200 text-center"
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: 1.25,
                    padding: "10px 4px",
                    minHeight: 48,
                    WebkitTextSizeAdjust: "100%",
                    wordBreak: "break-word",
                    background:
                      mode === v
                        ? "linear-gradient(135deg,#6366f1,#818cf8)"
                        : "transparent",
                    color: mode === v ? "#fff" : "var(--text-secondary)",
                    boxShadow:
                      mode === v
                        ? "0 2px 14px rgba(99,102,241,0.4)"
                        : "none",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* ── Input + period — order-2 ── */}
            <div className="order-2 flex flex-col gap-2">
              <Label>{inputLabel}</Label>

              {/* € + number input */}
              <div
                className="flex items-center gap-3 rounded-2xl px-4 w-full overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.11)",
                  height: 64,
                }}
              >
                <span
                  className="font-syne font-bold text-2xl shrink-0 select-none"
                  style={{ color: "rgba(255,255,255,0.22)" }}
                >
                  €
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={placeholder}
                  value={rawInput}
                  onChange={(e) =>
                    setRawInput(e.target.value.replace(/[^\d.,]/g, ""))
                  }
                  className="flex-1 bg-transparent outline-none font-syne font-bold tabnum min-w-0"
                  style={{
                    fontSize: "clamp(1.4rem, 6vw, 1.75rem)",
                    color: "var(--text-primary)",
                    caretColor: "#818cf8",
                  }}
                  aria-label="Importe del salario"
                />
              </div>

              {/* Period toggle */}
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
                      background:
                        period === p
                          ? "rgba(99,102,241,0.2)"
                          : "rgba(255,255,255,0.04)",
                      border: `1px solid ${
                        period === p
                          ? "rgba(99,102,241,0.45)"
                          : "rgba(255,255,255,0.08)"
                      }`,
                      color: period === p ? "#a5b4fc" : "var(--text-secondary)",
                    }}
                  >
                    {p === "anual" ? "Anual" : "Mensual"}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Resultado móvil — order-3 ── */}
            <div className="order-3 lg:hidden">
              {result ? (
                <CompactResult r={result} mode={mode} />
              ) : (
                <div
                  className="rounded-2xl px-4 py-5 flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    minHeight: 72,
                  }}
                >
                  <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
                    {rawInput.length > 0
                      ? "Introduce un importe válido (ej. 30000)"
                      : "Introduce tu salario para ver el resultado"}
                  </p>
                </div>
              )}
            </div>

            {/* ── Summary + personalizar — order-4 ── */}
            <div className="order-4 flex flex-col gap-2">
              <p className="text-xs" style={{ color: "#4a4a6a" }}>
                Calculando para:{" "}
                <span style={{ color: "#7c7ca0" }}>{summaryLine}</span>
              </p>
              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex items-center gap-2 self-start text-xs font-medium rounded-lg px-3 py-2 transition-all duration-200"
                style={{
                  background: showAdvanced ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${showAdvanced ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.09)"}`,
                  color: showAdvanced ? "#a5b4fc" : "#7c7ca0",
                }}
              >
                {showAdvanced ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 2l8 8M10 2l-8 8" /></svg>
                    Ocultar opciones avanzadas
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="2.5"/><path d="M6 1v1.5M6 9.5V11M1 6h1.5M9.5 6H11M2.6 2.6l1.1 1.1M8.3 8.3l1.1 1.1M9.4 2.6L8.3 3.7M3.7 8.3L2.6 9.4" /></svg>
                    Personalizar cálculo
                  </>
                )}
              </button>
            </div>

            {/* ══════════ Advanced fields wrapper — order-5 ══════════ */}
            <div
              className="order-5 overflow-hidden transition-all duration-300"
              style={{ maxHeight: showAdvanced ? "2000px" : "0px", opacity: showAdvanced ? 1 : 0 }}
            >
            <div className="flex flex-col gap-5 lg:gap-6">

            {/* ══════════ Sección: Datos básicos ══════════ */}
            <div className="flex flex-col gap-4">
              <p
                className="text-sm font-semibold uppercase tracking-wider pl-3"
                style={{
                  color: "#e0e0ff",
                  borderLeft: "3px solid rgba(99,102,241,0.7)",
                }}
              >
                Datos básicos
              </p>

              {/* Número de pagas */}
              <div>
                <Label>Número de pagas</Label>
                <div className="grid grid-cols-2 gap-2">
                  {([12, 14] as NumPayments[]).map((n) => (
                    <Pill
                      key={n}
                      active={numPayments === n}
                      onClick={() => setNumPayments(n)}
                    >
                      {n} pagas
                    </Pill>
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
                    style={{
                      height: 48,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.11)",
                      color: "var(--text-primary)",
                      outline: "none",
                    }}
                  >
                    {(Object.entries(COMUNIDADES_LABEL) as [ComunidadAutonoma, string][])
                      .sort((a, b) => a[1].localeCompare(b[1], "es"))
                      .map(([value, label]) => (
                        <option
                          key={value}
                          value={value}
                          style={{ background: "#0c0c1e", color: "#f0f0ff" }}
                        >
                          {label}
                        </option>
                      ))}
                  </select>
                  {/* Custom chevron */}
                  <div
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M2 4l5 5 5-5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════ Sección: Situación familiar ══════════ */}
            <div className="flex flex-col">
              <div
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <SectionHeader
                  title="Situación familiar"
                  open={openFamiliar}
                  onToggle={() => setOpenFamiliar((v) => !v)}
                />
              </div>

              {openFamiliar && (
                <div className="flex flex-col gap-4 pb-2">
                  {/* Estado civil */}
                  <div>
                    <Label>Estado civil</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { v: "soltero"      as FamilySituation, l: "Soltero/a"  },
                          { v: "casado"       as FamilySituation, l: "Casado/a"   },
                          { v: "monoparental" as FamilySituation, l: "Monop."     },
                        ] as const
                      ).map(({ v, l }) => (
                        <Pill
                          key={v}
                          small
                          active={situation === v}
                          onClick={() => {
                            setSituation(v);
                            if (v !== "casado") setSpouseNoIncome(false);
                            if (v === "monoparental" && numChildren === 0)
                              setNumChildren(1);
                          }}
                        >
                          {l}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  {/* Cónyuge sin ingresos */}
                  {situation === "casado" && (
                    <CheckboxRow
                      checked={spouseNoIncome}
                      onToggle={() => setSpouseNoIncome((v) => !v)}
                      label="Cónyuge sin ingresos propios"
                      hint="Añade 3.400 € al mínimo personal"
                    />
                  )}

                  {/* Total hijos */}
                  <div>
                    <Label>Hijos menores de 25 años</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { v: 0, l: "Sin hijos" },
                        { v: 1, l: "1 hijo"    },
                        { v: 2, l: "2 hijos"   },
                        { v: 3, l: "3 o más"   },
                      ].map(({ v, l }) => (
                        <Pill
                          key={v}
                          small
                          active={numChildren === v}
                          onClick={() => {
                            setNumChildren(v);
                            if (childrenUnder3 > v) setChildrenUnder3(v);
                          }}
                        >
                          {l}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  {/* Hijos < 3 años */}
                  {numChildren > 0 && (
                    <div>
                      <Label>Hijos menores de 3 años</Label>
                      <div className="flex gap-2 flex-wrap">
                        {[0, 1, 2, 3].filter((v) => v <= numChildren).map((v) => (
                          <Pill
                            key={v}
                            active={childrenUnder3 === v}
                            onClick={() => setChildrenUnder3(v)}
                          >
                            {v === 0 ? "Ninguno" : `${v}`}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ══════════ Sección: Otros datos ══════════ */}
            <div className="flex flex-col">
              <div
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <SectionHeader
                  title="Otros datos"
                  open={openOtros}
                  onToggle={() => setOpenOtros((v) => !v)}
                />
              </div>

              {openOtros && (
                <div className="flex flex-col gap-4 pb-2">
                  {/* Edad */}
                  <div>
                    <Label>Edad</Label>
                    <div
                      className="flex items-center gap-3 rounded-xl px-4 overflow-hidden"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.11)",
                        height: 48,
                        maxWidth: 160,
                      }}
                    >
                      <input
                        type="number"
                        min={16}
                        max={99}
                        value={ageRaw}
                        onChange={(e) => setAgeRaw(e.target.value)}
                        onBlur={(e) => {
                          const v = parseInt(e.target.value, 10);
                          const clamped = isNaN(v) ? 30 : Math.min(99, Math.max(16, v));
                          setAge(clamped);
                          setAgeRaw(String(clamped));
                        }}
                        className="flex-1 bg-transparent outline-none font-syne font-bold tabnum min-w-0 text-center"
                        style={{
                          fontSize: "1.1rem",
                          color: "var(--text-primary)",
                          caretColor: "#818cf8",
                        }}
                        aria-label="Edad"
                      />
                      <span className="text-sm shrink-0" style={{ color: "var(--text-muted)" }}>
                        años
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {age < 65 ? "Mínimo personal: 5.550 €"
                        : age < 75 ? "Mínimo personal: 6.700 € (+1.150 por edad)"
                        : "Mínimo personal: 8.100 € (+2.550 por edad)"}
                    </p>
                  </div>

                  {/* Tipo de contrato */}
                  <div>
                    <Label>Tipo de contrato</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          { v: "indefinido" as ContractType, l: "Indefinido" },
                          { v: "temporal"   as ContractType, l: "Temporal"   },
                        ] as const
                      ).map(({ v, l }) => (
                        <Pill
                          key={v}
                          active={contract === v}
                          onClick={() => setContract(v)}
                        >
                          {l}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  {/* Discapacidad */}
                  <div>
                    <Label>Discapacidad reconocida</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {(
                        [
                          { v: "none"            as Disability, l: "Ninguna"  },
                          { v: "33-65"           as Disability, l: "33–65%"   },
                          { v: "65plus"          as Disability, l: "+65%"     },
                          { v: "65plus-mobility" as Disability, l: "+65% mov" },
                        ] as const
                      ).map(({ v, l }) => (
                        <Pill
                          key={v}
                          small
                          active={disability === v}
                          onClick={() => setDisability(v)}
                        >
                          {l}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  {/* Movilidad geográfica */}
                  <CheckboxRow
                    checked={mobility}
                    onToggle={() => setMobility((v) => !v)}
                    label="Movilidad geográfica"
                    hint="Gastos deducibles +2.000 € adicionales (Art. 19)"
                  />
                </div>
              )}
            </div>

            {/* ── Mobile desglose + disclaimer ── */}
            {result && (
              <div className="lg:hidden flex flex-col gap-4">
                <Desglose r={result} />
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  Cálculo orientativo. Escala estatal + autonómica 2026. El tipo real varía
                  según deducciones personales.{" "}
                  <strong style={{ color: "#4a4a6a" }}>AEAT 2026</strong>.
                  Consulta con un asesor fiscal.
                </p>
              </div>
            )}

            </div>{/* end flex flex-col gap advanced */}
            </div>{/* end advanced wrapper */}
          </div>

          {/* ══════════ RIGHT (desktop only): Results ══════════ */}
          <div
            className="hidden lg:flex flex-col p-8 min-w-0 results-panel"
            style={{ background: "rgba(99,102,241,0.025)" }}
          >
            {result ? (
              <FullResults r={result} mode={mode} />
            ) : (
              <EmptyState mode={mode} />
            )}
          </div>
        </div>

        {/* ══════════ También te puede interesar ══════════ */}
        {result && (
          <div
            className="px-4 sm:px-6 lg:px-8 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs font-medium mb-3" style={{ color: "#5a5a80" }}>
              También te puede interesar
            </p>
            <div className="flex flex-wrap gap-2">
              {relatedSalaries.map((sal) => (
                <Link
                  key={sal}
                  href={`/cuanto-es-${sal}-euros-brutos-neto`}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                  style={{
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.18)",
                    color: "#818cf8",
                  }}
                >
                  Ver desglose completo para {new Intl.NumberFormat("es-ES").format(sal)} € →
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
