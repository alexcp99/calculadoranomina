"use client";

import { useState } from "react";
import { computeTax, computeNetToGross } from "@/lib/tax";
import type { ContractType, FamilySituation, TaxResult } from "@/lib/tax";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "bruto-neto" | "neto-bruto";
type Period = "anual" | "mensual";
type Children = 0 | 1 | 2;

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
  contract: ContractType,
  situation: FamilySituation,
  children: Children,
  spouseNoIncome: boolean
): TaxResult | null {
  const clean = rawInput.replace(/\./g, "").replace(",", ".");
  const parsed = parseFloat(clean);
  if (!isFinite(parsed) || parsed <= 0) return null;

  const annual = period === "mensual" ? parsed * 12 : parsed;
  const opts = {
    contractType: contract,
    familySituation: situation,
    numChildren: children,
    spouseWithoutIncome: spouseNoIncome,
  };

  return mode === "bruto-neto"
    ? computeTax({ annualGross: annual, ...opts })
    : computeNetToGross(annual, opts);
}

// ─── Pill button ──────────────────────────────────────────────────────────────

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
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
      className="text-xs font-semibold uppercase tracking-widest mb-2"
      style={{ color: "var(--text-muted)" }}
    >
      {children}
    </p>
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
}: {
  label: string;
  amount: number;
  color: string;
  bold?: boolean;
  topBorder?: boolean;
}) {
  return (
    <div
      className="flex justify-between items-baseline py-1"
      style={
        topBorder
          ? {
              borderTop: "1px solid rgba(255,255,255,0.07)",
              marginTop: 4,
              paddingTop: 10,
            }
          : {}
      }
    >
      <span
        className={`text-sm ${bold ? "font-semibold" : ""}`}
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

// ─── Desglose (collapsible) ───────────────────────────────────────────────────

function Desglose({ r }: { r: TaxResult }) {
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
          label={`IRPF (${fmtPct(r.irpfRate)})`}
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

      {open && (
        <div
          className="px-4 pb-4 pt-1 space-y-0.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest py-2"
            style={{ color: "var(--text-muted)" }}
          >
            Cálculo IRPF paso a paso
          </p>
          <BreakdownRow
            label="Rdto. neto trabajo"
            amount={r.rendimientoNeto}
            color="var(--text-secondary)"
          />
          <BreakdownRow
            label="Reducción rdtos. trabajo"
            amount={-r.reduccion}
            color="var(--text-secondary)"
          />
          <BreakdownRow
            label="Rdto. neto reducido"
            amount={r.rendimientoNetoReducido}
            color="var(--text-secondary)"
          />
          <BreakdownRow
            label="Mínimo personal y familiar"
            amount={-r.minimoPersonal}
            color="var(--text-secondary)"
          />
          <BreakdownRow
            label="Base de retención"
            amount={r.baseRetencion}
            color="var(--text-primary)"
            bold
            topBorder
          />
        </div>
      )}
    </div>
  );
}

// ─── Compact result (mobile) ──────────────────────────────────────────────────

function CompactResult({ r, mode }: { r: TaxResult; mode: Mode }) {
  const isNB = mode === "neto-bruto";
  const monthly = isNB ? r.monthlyGross : r.monthlyNet;
  const annual = isNB ? r.annualGross : r.annualNet;
  const color = isNB ? "#a5b4fc" : "#34d399";
  const accentBg = isNB ? "rgba(99,102,241,0.08)" : "rgba(52,211,153,0.07)";
  const accentBorder = isNB ? "rgba(99,102,241,0.22)" : "rgba(52,211,153,0.2)";
  const label = isNB ? "Bruto necesario" : "Salario neto";

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
    >
      {/* Main number */}
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-1"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>

      {/* Monthly + annual on same row */}
      <div className="flex items-end justify-between gap-2 mb-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-syne font-extrabold tabnum leading-none"
              style={{ fontSize: "clamp(2rem, 11vw, 2.8rem)", color }}
            >
              {fmtEur(monthly)}
            </span>
            <span
              className="font-bold"
              style={{ fontSize: "clamp(1.1rem, 5vw, 1.4rem)", color: `${color}70` }}
            >
              €
            </span>
          </div>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            al mes
          </p>
        </div>
        <div className="text-right shrink-0">
          <p
            className="font-syne font-bold tabnum text-lg leading-none"
            style={{ color: `${color}90` }}
          >
            {fmtEur(annual)} €
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            al año
          </p>
        </div>
      </div>

      {/* 3 chips */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <StatChip
          label="IRPF"
          value={fmtPct(r.irpfRate)}
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
      <div className="h-2 rounded-full overflow-hidden flex">
        <div
          style={{
            width: `${r.netPercent}%`,
            background: "linear-gradient(90deg,#34d399,#059669)",
          }}
        />
        <div
          style={{
            width: `${r.irpfRate}%`,
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
    </div>
  );
}

// ─── Full results (desktop) ───────────────────────────────────────────────────

function FullResults({ r, mode }: { r: TaxResult; mode: Mode }) {
  const isNB = mode === "neto-bruto";
  const monthly = isNB ? r.monthlyGross : r.monthlyNet;
  const annual = isNB ? r.annualGross : r.annualNet;
  const color = isNB ? "#a5b4fc" : "#34d399";
  const label = isNB ? "Bruto necesario / mes" : "Salario neto mensual";

  return (
    <div className="flex flex-col space-y-6 h-full">
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
          <span
            className="text-xl font-semibold mb-1"
            style={{ color: `${color}60` }}
          >
            €
          </span>
        </div>
        <p
          className="text-sm mt-1.5 tabnum"
          style={{ color: "var(--text-secondary)" }}
        >
          {fmtEur(annual)} € al año
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatChip
          label="IRPF"
          value={fmtPct(r.irpfRate)}
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
              width: `${r.irpfRate}%`,
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
        <div className="flex gap-4 mt-2" style={{ fontSize: 11 }}>
          <span style={{ color: "#34d399" }}>● Neto {fmtPct(r.netPercent)}</span>
          <span style={{ color: "#fbbf24" }}>● IRPF {fmtPct(r.irpfRate)}</span>
          <span style={{ color: "#818cf8" }}>● SS {fmtPct(r.ssRate)}</span>
        </div>
      </div>

      <Desglose r={r} />

      <p
        className="text-xs leading-relaxed mt-auto pt-4"
        style={{
          color: "var(--text-muted)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        Cálculo orientativo basado en la escala general estatal. El tipo real
        puede variar según comunidad autónoma y deducciones personales. Fuente:{" "}
        <strong style={{ color: "#4a4a6a" }}>AEAT 2026</strong>. Consulta con un
        asesor fiscal.
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
      <p
        className="font-syne font-semibold text-base mb-1.5"
        style={{ color: "var(--text-primary)" }}
      >
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
  const [mode, setMode] = useState<Mode>("bruto-neto");
  const [rawInput, setRawInput] = useState("");
  const [period, setPeriod] = useState<Period>("anual");
  const [contract, setContract] = useState<ContractType>("indefinido");
  const [situation, setSituation] = useState<FamilySituation>("soltero");
  const [children, setChildren] = useState<Children>(0);
  const [spouseNoIncome, setSpouseNoIncome] = useState(false);

  const result = computeResult(
    rawInput,
    period,
    mode,
    contract,
    situation,
    children,
    spouseNoIncome
  );

  const inputLabel =
    mode === "bruto-neto" ? "Salario bruto" : "Neto deseado";
  const placeholder = period === "anual" ? "30000" : "2500";

  return (
    <div className="max-w-5xl mx-auto">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="grid lg:grid-cols-2">

          {/* ══════════ LEFT / TOP: Inputs ══════════ */}
          {/* flex-col en móvil con order explícito para garantizar: toggle→input→resultado→opciones */}
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-5 lg:gap-6">

            {/* ── Mode toggle — order-1 ── */}
            {/* overflow-hidden + min-w-0 evitan cualquier desbordamiento en pantallas <360px */}
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
                    /* font-size fijo: desactiva el font boosting de Chrome Android */
                    fontSize: "0.85rem",
                    lineHeight: 1.25,
                    padding: "10px 4px",
                    minHeight: 48,
                    /* WebkitTextSizeAdjust impide que Chrome infle el texto */
                    WebkitTextSizeAdjust: "100%",
                    /* Sin whitespace-nowrap: el texto puede partir en 2 líneas si es necesario */
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

            {/* ── Input — order-2 ── */}
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

              {/* Period toggle — fila separada, full width */}
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
                      color:
                        period === p ? "#a5b4fc" : "var(--text-secondary)",
                    }}
                  >
                    {p === "anual" ? "Anual" : "Mensual"}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Resultado móvil — order-3 (siempre presente para anclar posición) ── */}
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

            {/* ── Contract type — order-4 ── */}
            <div className="order-4">
              <Label>Tipo de contrato</Label>
              <div className="flex gap-2 flex-wrap">
                {(
                  [
                    { v: "indefinido" as ContractType, l: "Indefinido" },
                    { v: "temporal" as ContractType, l: "Temporal" },
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

            {/* ── Family situation — order-5 ── */}
            <div className="order-5">
              <Label>Situación familiar</Label>
              <div className="flex gap-2 flex-wrap">
                {(
                  [
                    { v: "soltero" as FamilySituation, l: "Soltero/a" },
                    { v: "casado" as FamilySituation, l: "Casado/a" },
                    {
                      v: "monoparental" as FamilySituation,
                      l: "Monoparental",
                    },
                  ] as const
                ).map(({ v, l }) => (
                  <Pill
                    key={v}
                    active={situation === v}
                    onClick={() => {
                      setSituation(v);
                      if (v !== "casado") setSpouseNoIncome(false);
                      if (v === "monoparental" && children === 0)
                        setChildren(1);
                    }}
                  >
                    {l}
                  </Pill>
                ))}
              </div>
            </div>

            {/* ── Children — order-6 ── */}
            <div className="order-6">
              <Label>Hijos menores de 25 años</Label>
              <div className="flex gap-2 flex-wrap">
                {(
                  [
                    { v: 0 as Children, l: "Sin hijos" },
                    { v: 1 as Children, l: "1 hijo" },
                    { v: 2 as Children, l: "2 o más" },
                  ] as const
                ).map(({ v, l }) => (
                  <Pill
                    key={v}
                    active={children === v}
                    onClick={() => setChildren(v)}
                  >
                    {l}
                  </Pill>
                ))}
              </div>
            </div>

            {/* ── Spouse toggle — order-7 ── */}
            {situation === "casado" && (
              <div
                className="order-7 flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer select-none"
                style={{
                  background: spouseNoIncome
                    ? "rgba(99,102,241,0.1)"
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${
                    spouseNoIncome
                      ? "rgba(99,102,241,0.35)"
                      : "rgba(255,255,255,0.08)"
                  }`,
                  minHeight: 56,
                }}
                onClick={() => setSpouseNoIncome((v) => !v)}
                role="checkbox"
                aria-checked={spouseNoIncome}
              >
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-150"
                  style={{
                    background: spouseNoIncome
                      ? "#6366f1"
                      : "rgba(255,255,255,0.08)",
                    border: `1px solid ${
                      spouseNoIncome ? "#6366f1" : "rgba(255,255,255,0.15)"
                    }`,
                  }}
                >
                  {spouseNoIncome && (
                    <svg
                      width="11"
                      height="8"
                      viewBox="0 0 11 8"
                      fill="none"
                    >
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
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Cónyuge sin ingresos propios
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Añade 3.400 € al mínimo personal
                  </p>
                </div>
              </div>
            )}

            {/* ── Mobile desglose + disclaimer — order-8 ── */}
            {result && (
              <div className="order-8 lg:hidden flex flex-col gap-4">
                <Desglose r={result} />
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  Cálculo orientativo. Escala general estatal. El tipo real varía
                  según CCAA y deducciones personales.{" "}
                  <strong style={{ color: "#4a4a6a" }}>AEAT 2026</strong>.
                  Consulta con un asesor fiscal.
                </p>
              </div>
            )}
          </div>

          {/* ══════════ RIGHT (desktop only): Results ══════════ */}
          <div
            className="hidden lg:flex flex-col p-8 results-panel"
            style={{ background: "rgba(99,102,241,0.025)" }}
          >
            {result ? (
              <FullResults r={result} mode={mode} />
            ) : (
              <EmptyState mode={mode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
