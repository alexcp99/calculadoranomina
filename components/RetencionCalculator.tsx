"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  computeCalc,
  COMUNIDADES_LABEL,
} from "@/lib/calculator";
import type {
  ComunidadAutonoma,
  FamilySituation,
  ContractType,
  NumPayments,
} from "@/lib/calculator";

// ─── Estatal brackets (display only — not used in calc) ────────────────────
const ESTATAL_DISPLAY = [
  { label: "Hasta 12.450 €",        from: 0,      to: 12450,    rate: 9.5,  color: "#34d399" },
  { label: "12.450 € – 20.200 €",   from: 12450,  to: 20200,    rate: 12.0, color: "#6ee7b7" },
  { label: "20.200 € – 35.200 €",   from: 20200,  to: 35200,    rate: 15.0, color: "#818cf8" },
  { label: "35.200 € – 60.000 €",   from: 35200,  to: 60000,    rate: 18.5, color: "#a78bfa" },
  { label: "60.000 € – 300.000 €",  from: 60000,  to: 300000,   rate: 22.5, color: "#f87171" },
  { label: "Más de 300.000 €",       from: 300000, to: Infinity, rate: 24.5, color: "#ef4444" },
];

function fmt(n: number): string {
  return new Intl.NumberFormat("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(n));
}

function fmtDec(n: number, d = 2): string {
  return new Intl.NumberFormat("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
}

const COMUNIDADES = Object.entries(COMUNIDADES_LABEL) as [ComunidadAutonoma, string][];

const SITUACIONES: { value: FamilySituation; label: string }[] = [
  { value: "soltero",     label: "Soltero/a sin pareja" },
  { value: "casado",      label: "Casado/a (cónyuge con ingresos)" },
  { value: "monoparental", label: "Monoparental" },
];

// ─── Shared input/select styles ────────────────────────────────────────────
const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  color: "#f0f0ff",
  padding: "10px 14px",
  fontSize: "0.9rem",
  width: "100%",
  outline: "none",
};

export default function RetencionCalculator() {
  const [bruto, setBruto] = useState(30000);
  const [brutoRaw, setBrutoRaw] = useState("30000");
  const [comunidad, setComunidad] = useState<ComunidadAutonoma>("madrid");
  const [situacion, setSituacion] = useState<FamilySituation>("soltero");
  const [hijos, setHijos] = useState(0);
  const [contrato, setContrato] = useState<ContractType>("indefinido");
  const [pagas, setPagas] = useState<NumPayments>(12);
  const [conyugeSinIngresos, setConyugeSinIngresos] = useState(false);

  const result = useMemo(() => computeCalc({
    annualGross: bruto,
    contractType: contrato,
    familySituation: situacion,
    numChildren: hijos,
    childrenUnder3: 0,
    spouseWithoutIncome: situacion === "casado" && conyugeSinIngresos,
    age: 35,
    comunidad,
    numPayments: pagas,
    disability: "none",
    geographicMobility: false,
  }), [bruto, contrato, situacion, hijos, conyugeSinIngresos, comunidad, pagas]);

  // Bracket breakdown using estatal scale on base de retención (display only)
  const bracketRows = useMemo(() => {
    const base = result.baseRetencion;
    return ESTATAL_DISPLAY.map((b) => {
      if (base <= b.from) return { ...b, amount: 0, active: false };
      const portion = Math.min(base, b.to === Infinity ? base : b.to) - b.from;
      const amount = portion * (b.rate / 100);
      return { ...b, amount, active: true };
    }).filter((b) => b.active);
  }, [result.baseRetencion]);

  const pct = Math.round(result.irpfEfectivo * 10) / 10;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(99,102,241,0.2)", background: "rgba(10,10,24,0.7)" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* ── Inputs ── */}
        <div className="p-6 md:p-8 flex flex-col gap-5" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6060a0" }}>Tus datos</p>

          {/* Salario bruto */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#c0c0e0" }}>
              Salario bruto anual
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={brutoRaw}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setBrutoRaw(raw);
                  const n = parseInt(raw, 10);
                  if (!isNaN(n) && n >= 0) setBruto(n);
                }}
                style={{ ...inputStyle, paddingRight: 40 }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "#6060a0" }}>€</span>
            </div>
          </div>

          {/* Comunidad */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#c0c0e0" }}>Comunidad autónoma</label>
            <select
              value={comunidad}
              onChange={(e) => setComunidad(e.target.value as ComunidadAutonoma)}
              style={inputStyle}
            >
              {COMUNIDADES.map(([val, lbl]) => (
                <option key={val} value={val} style={{ background: "#0d0d1a" }}>{lbl}</option>
              ))}
            </select>
          </div>

          {/* Situación familiar */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#c0c0e0" }}>Situación familiar</label>
            <select
              value={situacion}
              onChange={(e) => setSituacion(e.target.value as FamilySituation)}
              style={inputStyle}
            >
              {SITUACIONES.map((s) => (
                <option key={s.value} value={s.value} style={{ background: "#0d0d1a" }}>{s.label}</option>
              ))}
            </select>
          </div>

          {situacion === "casado" && (
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={conyugeSinIngresos}
                onChange={(e) => setConyugeSinIngresos(e.target.checked)}
                className="w-4 h-4 accent-indigo-500"
              />
              <span className="text-sm" style={{ color: "#a0a0c0" }}>Cónyuge sin ingresos</span>
            </label>
          )}

          {/* Hijos */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#c0c0e0" }}>Número de hijos</label>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setHijos(n)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                  style={hijos === n
                    ? { background: "rgba(99,102,241,0.25)", border: "1px solid rgba(99,102,241,0.5)", color: "#a5b4fc" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6060a0" }}
                >
                  {n === 3 ? "3+" : n}
                </button>
              ))}
            </div>
          </div>

          {/* Contrato + pagas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#c0c0e0" }}>Contrato</label>
              <select value={contrato} onChange={(e) => setContrato(e.target.value as ContractType)} style={inputStyle}>
                <option value="indefinido" style={{ background: "#0d0d1a" }}>Indefinido</option>
                <option value="temporal"   style={{ background: "#0d0d1a" }}>Temporal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#c0c0e0" }}>Pagas</label>
              <select value={pagas} onChange={(e) => setPagas(Number(e.target.value) as NumPayments)} style={inputStyle}>
                <option value={12} style={{ background: "#0d0d1a" }}>12 pagas</option>
                <option value={14} style={{ background: "#0d0d1a" }}>14 pagas</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6060a0" }}>Resultado</p>

          {/* Big retention rate */}
          <div className="text-center py-4">
            <div
              className="font-syne font-extrabold leading-none mb-1"
              style={{ fontSize: "clamp(3rem, 12vw, 5rem)", color: "#6366f1" }}
            >
              {fmtDec(pct, 1)}%
            </div>
            <p className="text-xs leading-relaxed max-w-xs mx-auto" style={{ color: "#6060a0" }}>
              Tipo de retención aplicable · Tu empresa retiene este porcentaje cada mes y lo ingresa a Hacienda
            </p>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Retención mensual", value: `${fmt(result.monthlyIRPF)} €`, color: "#f87171" },
              { label: "Retención anual",   value: `${fmt(result.annualIRPF)} €`,  color: "#f87171" },
              { label: "Tipo marginal",     value: `${fmtDec(result.irpfMarginal, 1)} %`, color: "#fbbf24" },
              { label: "Base retención",    value: `${fmt(result.baseRetencion)} €`, color: "#818cf8" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl p-3.5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p className="text-xs mb-1" style={{ color: "#5a5a80" }}>{m.label}</p>
                <p className="font-syne font-bold text-base" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Bracket breakdown */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#4a4a6a" }}>
              Tramos estatales aplicados (base {fmt(result.baseRetencion)} €)
            </p>
            <div className="flex flex-col gap-2">
              {bracketRows.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: b.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs truncate" style={{ color: "#8080a0" }}>{b.label}</span>
                      <span className="text-xs font-semibold shrink-0 ml-2" style={{ color: b.color }}>
                        {fmt(b.amount)} €
                      </span>
                    </div>
                    <div className="mt-1 rounded-full overflow-hidden" style={{ height: 3, background: "rgba(255,255,255,0.05)" }}>
                      <div
                        style={{
                          width: `${Math.min(100, (b.amount / Math.max(result.annualIRPF, 1)) * 100)}%`,
                          height: "100%",
                          background: b.color,
                          borderRadius: 9999,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: "#4a4a6a" }}>{b.rate}%</span>
                </div>
              ))}
              {bracketRows.length === 0 && (
                <p className="text-xs" style={{ color: "#4a4a6a" }}>Sin retención (base imponible ≤ mínimos)</p>
              )}
            </div>
          </div>

          {/* SS note */}
          <div className="rounded-xl px-4 py-3" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "#7c7ca0" }}>
              <span style={{ color: "#818cf8" }}>+</span>{" "}
              Cotización SS: <strong style={{ color: "#a0a0c0" }}>{fmt(result.monthlySS)} €/mes</strong> ({fmtDec(result.ssRate, 2)}% bruto).
              Neto mensual: <strong style={{ color: "#34d399" }}>{fmt(result.monthlyNet)} €</strong>.{" "}
              <Link href={`/cuanto-es-${Math.round(bruto / 1000) * 1000}-euros-brutos-neto`} className="underline" style={{ color: "#818cf8" }}>
                Ver desglose completo →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
