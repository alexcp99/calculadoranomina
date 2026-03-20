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

// ─── Design tokens (matching Calculator.tsx) ────────────────────────────────────

const LABEL_STYLE: React.CSSProperties = {
  color: "#b8b8d8",
  fontSize: "0.72rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  display: "block",
  marginBottom: 7,
};

const INPUT_BASE: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#e0e0ff",
  caretColor: "#6366f1",
  width: "100%",
  borderRadius: 12,
  padding: "11px 14px",
  fontSize: "0.9rem",
  fontWeight: 500,
  outline: "none",
  transition: "border-color 0.15s",
};

// ─── Field components ────────────────────────────────────────────────────────────

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
      <span style={LABEL_STYLE}>
        {label}
        {required && <span style={{ color: "#f87171" }}> *</span>}
      </span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={INPUT_BASE}
        onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(99,102,241,0.6)"; }}
        onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
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
      <span style={LABEL_STYLE}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        style={{ ...INPUT_BASE, appearance: "none" } as React.CSSProperties}
        onFocus={(e) => { (e.currentTarget as HTMLSelectElement).style.borderColor = "rgba(99,102,241,0.6)"; }}
        onBlur={(e)  => { (e.currentTarget as HTMLSelectElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
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
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Column header — mismo patrón que SectionHeader en Calculator.tsx */}
      <div className="flex items-center gap-3 pb-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          className="w-1 h-6 rounded-full shrink-0"
          style={{ background: accent, boxShadow: `0 0 8px ${accent}80` }}
        />
        <span
          className="font-syne font-bold text-sm tracking-widest uppercase"
          style={{ color: accent }}
        >
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
        label="Número de pagas"
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
          { value: "none",    label: "Sin teletrabajo" },
          { value: "partial", label: "Parcial (algunos días)" },
          { value: "full",    label: "Completo (100%)" },
        ]}
      />

      {showAntiguedad && (
        <NumInput
          label="Antigüedad (años)"
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
    positive: { text: "#34d399", bg: "rgba(52,211,153,0.07)",  border: "rgba(52,211,153,0.18)" },
    negative: { text: "#f87171", bg: "rgba(248,113,113,0.07)", border: "rgba(248,113,113,0.18)" },
    neutral:  { text: "#9090b8", bg: "rgba(255,255,255,0.02)", border: "rgba(255,255,255,0.07)" },
  };
  const c = colors[sentiment];
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <div className="flex items-center gap-3">
        <span className="text-base leading-none">{icon}</span>
        <span className="text-sm font-medium" style={{ color: "#c0c0d8" }}>{label}</span>
      </div>
      <span className="text-sm font-semibold tabnum" style={{ color: c.text }}>{value}</span>
    </div>
  );
}

// ─── Metric card (resultado) ───────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  color,
  large,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  large?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-1"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "14px 18px",
      }}
    >
      <span
        style={{
          color: "#7070a0",
          fontSize: "0.68rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.09em",
        }}
      >
        {label}
      </span>
      <span
        className="font-syne font-bold tabnum leading-none"
        style={{ color, fontSize: large ? "1.5rem" : "1.15rem", marginTop: 2 }}
      >
        {value}
      </span>
      {sub && (
        <span style={{ color: "#5a5a80", fontSize: "0.72rem", marginTop: 2 }}>{sub}</span>
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function JobChangeCalculator() {
  const [actual, setActual] = useState<JobState>(INIT_ACTUAL);
  const [oferta, setOferta] = useState<JobState>(INIT_OFERTA);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [familySituation,    setFamilySituation]    = useState<FamilySituation>("soltero");
  const [numChildren,        setNumChildren]        = useState("0");
  const [age,                setAge]                = useState("35");
  const [contractType,       setContractType]       = useState<ContractType>("indefinido");
  const [disability,         setDisability]         = useState<Disability>("none");
  const [spouseWithoutIncome,setSpouseWithoutIncome]= useState(false);

  const [hasCalculated,   setHasCalculated]   = useState(false);
  const [validationError, setValidationError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!hasCalculated || !aR || !oR) return;
    const ar = aR;
    const or = oR;

    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    const dateStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    const bonusDiff = oBonus - aBonus;

    // ── Colors ──
    const vColor  = verdict === 'green' ? '#16a34a' : verdict === 'red' ? '#dc2626' : '#d97706';
    const vText   = verdict === 'green' ? 'SÍ TE COMPENSA' : verdict === 'red' ? 'NO TE COMPENSA' : 'VALÓRALO BIEN';
    const vBg     = verdict === 'green' ? '#f0fdf4' : verdict === 'red' ? '#fef2f2' : '#fffbeb';
    const vBorder = verdict === 'green' ? '#86efac' : verdict === 'red' ? '#fca5a5' : '#fcd34d';

    const mAbs = fmtN(Math.round(Math.abs(difMensual)));
    const aAbs = fmtN(Math.round(Math.abs(difAnual)));
    const tAbs = fmtN(Math.round(Math.abs(difTotal)));
    const mSign = difMensual >= 0 ? '+' : '−';
    const aSign = difAnual >= 0 ? '+' : '−';

    let verdictBody: string;
    if (verdict === 'green') {
      verdictBody = difBonus > 0
        ? `Cobrarías ${mAbs} € más al mes netos, ${aAbs} € al año. Con el bonus, la mejora total sube a ${tAbs} € al año.`
        : `Cobrarías ${mAbs} € más al mes netos (${aAbs} € al año). Los números apuntan claramente al cambio.`;
    } else if (verdict === 'yellow') {
      verdictBody = Math.round(difMensual) >= 0
        ? `La diferencia es solo +${mAbs} €/mes. En este rango, los factores no salariales —proyección, cultura, flexibilidad— suelen pesar más que el dinero.`
        : `La diferencia es de −${mAbs} €/mes netos. Podría compensarse con condiciones no salariales significativamente mejores.`;
    } else {
      verdictBody = difBonus > 0
        ? `Perderías ${mAbs} €/mes netos. Aunque el bonus es mayor, la compensación total sigue siendo inferior (${tAbs} € menos/año).`
        : `Perderías ${mAbs} €/mes netos (${aAbs} €/año). Para que el cambio tenga sentido, el argumento no puede ser económico.`;
    }

    // ── HTML row helpers ──
    const dataRow = (label: string, val: string, diff?: string, pos?: boolean): string => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:11px;color:#6b7280;">${label}</span>
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="font-size:11px;font-weight:600;color:#111827;">${val}</span>
          ${diff !== undefined ? `<span style="font-size:10px;font-weight:700;color:${pos ? '#16a34a' : '#dc2626'};">${diff}</span>` : ''}
        </div>
      </div>`;

    const tRow = (lbl: string, av: string, ov: string, diff: string, pos: boolean | null, alt: boolean, bold: boolean): string => `
      <tr style="background:${alt ? '#f9fafb' : '#ffffff'};">
        <td style="padding:8px 12px;font-size:11px;${bold ? 'font-weight:700;color:#111827;' : 'color:#374151;'}">${lbl}</td>
        <td style="padding:8px 12px;font-size:11px;text-align:right;${bold ? 'font-weight:700;color:#111827;' : 'color:#374151;'}">${av}</td>
        <td style="padding:8px 12px;font-size:11px;text-align:right;${bold ? 'font-weight:700;color:#111827;' : 'color:#374151;'}">${ov}</td>
        <td style="padding:8px 12px;font-size:11px;text-align:right;font-weight:700;color:${pos === null ? '#6b7280' : pos ? '#16a34a' : '#dc2626'};">${diff}</td>
      </tr>`;

    const pill = (label: string, val: string, state: 'positive' | 'negative' | 'neutral'): string => {
      const pc = { positive: { bg: '#dcfce7', border: '#86efac', text: '#15803d' }, negative: { bg: '#fee2e2', border: '#fca5a5', text: '#dc2626' }, neutral: { bg: '#f3f4f6', border: '#d1d5db', text: '#6b7280' } }[state];
      return `<div style="display:inline-flex;align-items:center;gap:5px;padding:5px 10px;background:${pc.bg};border:1px solid ${pc.border};border-radius:6px;margin:0 4px 4px 0;">
        <span style="font-size:10px;font-weight:700;color:${pc.text};text-transform:uppercase;letter-spacing:0.04em;">${label}</span>
        <span style="font-size:11px;color:${pc.text};">${val}</span>
      </div>`;
    };

    // ── Build HTML ──
    const html = `
<div style="width:794px;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

  <!-- HEADER -->
  <div style="background:#6366f1;padding:20px 28px;display:flex;justify-content:space-between;align-items:center;">
    <div>
      <div style="font-size:21px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">CalculadoraNomina.org</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.75);margin-top:3px;">Comparativa de Cambio de Trabajo · 2026</div>
    </div>
    <div style="text-align:right;font-size:11px;color:rgba(255,255,255,0.65);">${dateStr}</div>
  </div>

  <!-- CONTENT -->
  <div style="padding:16px 24px 0;">

    <!-- HERO -->
    <div style="background:${vBg};border:2px solid ${vBorder};border-radius:10px;padding:16px 20px;text-align:center;margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;">¿Te compensa cambiar de trabajo?</div>
      <div style="font-size:42px;font-weight:900;color:${vColor};line-height:1;letter-spacing:-0.5px;">${vText}</div>
      <div style="font-size:17px;font-weight:700;color:#1f2937;margin-top:8px;">${mSign}${mAbs} €/mes &nbsp;·&nbsp; ${aSign}${aAbs} €/año netos${difBonus !== 0 ? ` <span style="font-size:13px;font-weight:500;color:#6b7280;">(con bonus: ${difTotal >= 0 ? '+' : '−'}${tAbs} €/año)</span>` : ''}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:5px;">${verdictBody}</div>
    </div>

    <!-- TWO CARDS -->
    <div style="display:flex;gap:12px;margin-bottom:14px;">

      <!-- ACTUAL -->
      <div style="flex:1;border:1.5px solid #d1d5db;border-radius:10px;overflow:hidden;">
        <div style="background:#f9fafb;padding:8px 14px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;gap:8px;">
          <span style="background:#6b7280;color:#fff;font-size:9px;font-weight:800;padding:2px 7px;border-radius:3px;text-transform:uppercase;letter-spacing:0.06em;">ACTUAL</span>
          <span style="font-size:11px;color:#9ca3af;">${COMUNIDADES_LABEL[actual.ccaa]} · ${actual.pagas} pagas</span>
        </div>
        <div style="padding:12px 14px;">
          <div style="font-size:34px;font-weight:800;color:#111827;letter-spacing:-0.5px;line-height:1;">${fmtN(Math.round(ar.monthlyNet))} €</div>
          <div style="font-size:11px;color:#9ca3af;margin-bottom:10px;">neto mensual</div>
          ${dataRow('Bruto anual', `${fmtN(aB)} €`)}
          ${dataRow('Neto anual', `${fmtN(Math.round(ar.annualNet))} €`)}
          ${dataRow('SS pagado / año', `${fmtN(Math.round(ar.annualSS))} €`)}
          ${dataRow('IRPF efectivo', `${fi(ar.irpfEfectivo)} %`)}
          ${dataRow('Bonus anual', aBonus > 0 ? `${fmtN(aBonus)} €` : '—')}
          ${dataRow('Vacaciones', `${aVac} días`)}
          ${dataRow('Teletrabajo', TELETRABAJO_LABEL[actual.teletrabajo])}
        </div>
      </div>

      <!-- OFERTA -->
      <div style="flex:1;border:2px solid #6366f1;border-radius:10px;overflow:hidden;">
        <div style="background:#eef2ff;padding:8px 14px;border-bottom:1px solid #c7d2fe;display:flex;align-items:center;gap:8px;">
          <span style="background:#6366f1;color:#fff;font-size:9px;font-weight:800;padding:2px 7px;border-radius:3px;text-transform:uppercase;letter-spacing:0.06em;">OFERTA</span>
          <span style="font-size:11px;color:#818cf8;">${COMUNIDADES_LABEL[oferta.ccaa]} · ${oferta.pagas} pagas</span>
        </div>
        <div style="padding:12px 14px;">
          <div style="font-size:34px;font-weight:800;color:#6366f1;letter-spacing:-0.5px;line-height:1;">${fmtN(Math.round(or.monthlyNet))} €</div>
          <div style="font-size:11px;color:#818cf8;margin-bottom:10px;">neto mensual</div>
          ${dataRow('Bruto anual', `${fmtN(oB)} €`, `${oB - aB >= 0 ? '+' : '−'}${fmtN(Math.round(Math.abs(oB - aB)))} €`, oB >= aB)}
          ${dataRow('Neto anual', `${fmtN(Math.round(or.annualNet))} €`, `${difAnual >= 0 ? '+' : '−'}${fmtN(Math.round(Math.abs(difAnual)))} €`, difAnual >= 0)}
          ${dataRow('SS pagado / año', `${fmtN(Math.round(or.annualSS))} €`, `${or.annualSS - ar.annualSS >= 0 ? '+' : '−'}${fmtN(Math.round(Math.abs(or.annualSS - ar.annualSS)))} €`, or.annualSS <= ar.annualSS)}
          ${dataRow('IRPF efectivo', `${fi(or.irpfEfectivo)} %`, `${or.irpfEfectivo - ar.irpfEfectivo >= 0 ? '+' : '−'}${fi(Math.abs(or.irpfEfectivo - ar.irpfEfectivo))} %`, or.irpfEfectivo <= ar.irpfEfectivo)}
          ${dataRow('Bonus anual', oBonus > 0 ? `${fmtN(oBonus)} €` : '—', bonusDiff !== 0 ? `${bonusDiff >= 0 ? '+' : '−'}${fmtN(Math.abs(bonusDiff))} €` : undefined, bonusDiff >= 0)}
          ${dataRow('Vacaciones', `${oVac} días`, difVac !== 0 ? `${difVac >= 0 ? '+' : ''}${difVac} días` : undefined, difVac >= 0)}
          ${dataRow('Teletrabajo', TELETRABAJO_LABEL[oferta.teletrabajo])}
        </div>
      </div>
    </div>

    <!-- FINANCIAL TABLE -->
    <div style="margin-bottom:12px;">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#9ca3af;letter-spacing:0.06em;margin-bottom:6px;">Desglose financiero</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#6366f1;">
            <th style="text-align:left;padding:9px 12px;color:#fff;font-weight:700;font-size:11px;">Concepto</th>
            <th style="text-align:right;padding:9px 12px;color:#fff;font-weight:700;font-size:11px;">Trabajo actual</th>
            <th style="text-align:right;padding:9px 12px;color:#fff;font-weight:700;font-size:11px;">Nueva oferta</th>
            <th style="text-align:right;padding:9px 12px;color:#fff;font-weight:700;font-size:11px;">Diferencia</th>
          </tr>
        </thead>
        <tbody>
          ${tRow('Salario bruto anual',     `${fmtN(aB)} €`,                              `${fmtN(oB)} €`,                              `${oB-aB>=0?'+':'−'}${fmtN(Math.round(Math.abs(oB-aB)))} €`,                                                    oB>=aB,                               false, false)}
          ${tRow('SS trabajador / año',     `${fmtN(Math.round(ar.annualSS))} €`,         `${fmtN(Math.round(or.annualSS))} €`,         `${or.annualSS-ar.annualSS>=0?'+':'−'}${fmtN(Math.round(Math.abs(or.annualSS-ar.annualSS)))} €`,               or.annualSS<=ar.annualSS,             true,  false)}
          ${tRow('IRPF retenido / año',     `${fmtN(Math.round(ar.annualIRPF))} €`,       `${fmtN(Math.round(or.annualIRPF))} €`,       `${or.annualIRPF-ar.annualIRPF>=0?'+':'−'}${fmtN(Math.round(Math.abs(or.annualIRPF-ar.annualIRPF)))} €`,         or.annualIRPF<=ar.annualIRPF,         false, false)}
          ${tRow('Neto mensual',            `${fmtN(Math.round(ar.monthlyNet))} €`,       `${fmtN(Math.round(or.monthlyNet))} €`,       `${difMensual>=0?'+':'−'}${fmtN(Math.round(Math.abs(difMensual)))} €`,                                          difMensual>=0,                        true,  false)}
          ${tRow('Neto anual',              `${fmtN(Math.round(ar.annualNet))} €`,        `${fmtN(Math.round(or.annualNet))} €`,        `${difAnual>=0?'+':'−'}${fmtN(Math.round(Math.abs(difAnual)))} €`,                                              difAnual>=0,                          false, false)}
          ${tRow('Compensación total / año',`${fmtN(Math.round(ar.annualNet+aBonus))} €`, `${fmtN(Math.round(or.annualNet+oBonus))} €`, `${difTotal>=0?'+':'−'}${fmtN(Math.round(Math.abs(difTotal)))} €`,                                              difTotal>=0,                          true,  true)}
        </tbody>
      </table>
    </div>

    <!-- QUALITATIVE PILLS -->
    <div style="display:flex;flex-wrap:wrap;margin-bottom:14px;">
      ${pill('Vacaciones',    difVac===0?`${aVac} días (sin cambio)`:difVac>0?`+${difVac} días (${oVac} vs ${aVac})`:` ${difVac} días (${oVac} vs ${aVac})`, difVac>0?'positive':difVac<0?'negative':'neutral')}
      ${pill('Teletrabajo',   difTeletrab===0?TELETRABAJO_LABEL[oferta.teletrabajo]:difTeletrab>0?`Mejora → ${TELETRABAJO_LABEL[oferta.teletrabajo]}`:`Empeora → ${TELETRABAJO_LABEL[oferta.teletrabajo]}`, difTeletrab>0?'positive':difTeletrab<0?'negative':'neutral')}
      ${pill('Antigüedad',    antiguedad>0?`Pierdes ${antiguedad} año${antiguedad!==1?'s':''}`:'-', antiguedad>0?'negative':'neutral')}
      ${pill('Comunidad',     actual.ccaa===oferta.ccaa?COMUNIDADES_LABEL[actual.ccaa]:`${COMUNIDADES_LABEL[actual.ccaa]} → ${COMUNIDADES_LABEL[oferta.ccaa]}`, 'neutral')}
    </div>

  </div>

  <!-- FOOTER -->
  <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:10px 24px;">
    <div style="font-size:10px;color:#9ca3af;">Cálculo orientativo basado en datos oficiales AEAT 2026 · calculadoranomina.org · Los resultados son estimaciones y no constituyen asesoramiento fiscal ni laboral</div>
  </div>

</div>`;

    // ── Render and capture ──
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;';
    wrap.innerHTML = html;
    document.body.appendChild(wrap);

    const target = wrap.firstElementChild as HTMLElement;
    const canvas = await html2canvas(target, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    document.body.removeChild(wrap);

    // ── Fit to one page ──
    const imgData  = canvas.toDataURL('image/png');
    const imgWmm   = 210;
    const imgHmm   = (canvas.height * imgWmm) / canvas.width;

    if (imgHmm <= 297) {
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWmm, imgHmm);
      pdf.save('comparativa-cambio-trabajo-2026.pdf');
    } else {
      // Try landscape
      const lW = 297, lH = (canvas.height * lW) / canvas.width;
      const pdf = new jsPDF(lH <= 210 ? 'l' : 'p', 'mm', 'a4');
      if (lH <= 210) {
        pdf.addImage(imgData, 'PNG', 0, 0, lW, lH);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // force fit
      }
      pdf.save('comparativa-cambio-trabajo-2026.pdf');
    }
  };

  function handleCompare() {
    const aB = parseFloat(actual.bruto);
    const oB = parseFloat(oferta.bruto);
    if (!aB || aB <= 0) { setValidationError("Introduce el salario bruto de tu trabajo actual."); return; }
    if (!oB || oB <= 0) { setValidationError("Introduce el salario bruto de la nueva oferta."); return; }
    setValidationError("");
    setHasCalculated(true);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  // ── Derived values ────────────────────────────────────────────────────────────

  const aB = parseFloat(actual.bruto) || 0;
  const oB = parseFloat(oferta.bruto) || 0;
  const ready = aB > 0 && oB > 0;

  const profile = {
    contractType,
    familySituation,
    numChildren:        parseInt(numChildren) || 0,
    childrenUnder3:     0 as const,
    spouseWithoutIncome,
    age:                parseInt(age) || 35,
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

  let qualScore = 0;
  if (difVac >= 5)      qualScore += 1;
  if (difVac <= -5)     qualScore -= 1;
  if (difTeletrab > 0)  qualScore += 1;
  if (difTeletrab < 0)  qualScore -= 1;
  if (antiguedad > 3)   qualScore -= 1;

  const verdict: "green" | "yellow" | "red" =
    difTotal >= 3000 || (difTotal >= 1500 && qualScore >= 2)
      ? "green"
      : difTotal < -1000 || (difTotal < 500 && qualScore <= -2)
      ? "red"
      : "yellow";

  // ── Insights ──────────────────────────────────────────────────────────────────

  const insights: string[] = [];
  if (ready && aR && oR) {
    if (actual.ccaa !== oferta.ccaa) {
      const aLabel = COMUNIDADES_LABEL[actual.ccaa];
      const oLabel = COMUNIDADES_LABEL[oferta.ccaa];
      if (oB > aB && difMensual < (oB - aB) / 12 * 0.5) {
        insights.push(`Aunque el bruto sube, el neto mejora menos de lo esperado por el cambio de comunidad (${aLabel} → ${oLabel}). Las diferencias en el tramo autonómico del IRPF reducen la ganancia real.`);
      } else {
        insights.push(`Al cambiar de comunidad (${aLabel} → ${oLabel}) cambia el tramo autonómico del IRPF. Compara siempre el neto real, no solo el bruto.`);
      }
    }
    if (actual.pagas !== oferta.pagas) {
      insights.push(`Con ${oferta.pagas} pagas no cobras más al año: el neto anual total es el mismo. Solo cambia cómo se distribuye ese dinero a lo largo del año.`);
    }
    const brutoDelta = oB - aB;
    if (brutoDelta > 5000 && difAnual < brutoDelta * 0.55) {
      insights.push(`La subida de bruto (${fmtN(brutoDelta)} €/año) se traduce en solo ${fmtN(difAnual)} € netos extra. La progresividad del IRPF absorbe el ${fi(((brutoDelta - difAnual) / brutoDelta) * 100)} % de la mejora.`);
    }
    if (difBonus > 0 && difBonus > difAnual) {
      insights.push(`La mejora principal no viene del fijo sino del bonus (${fmtN(difBonus)} €/año más). Los bonus son variables. Pregunta si está garantizado contractualmente o depende de objetivos.`);
    }
    if (antiguedad >= 3) {
      insights.push(`Al cambiar pierdes ${antiguedad} año${antiguedad !== 1 ? "s" : ""} de antigüedad. Revisa si tu convenio actual incluye pluses por permanencia o mejoras por tramos.`);
    }
    if (antiguedad >= 6) {
      insights.push(`Con ${antiguedad} años en la empresa actual, tu indemnización ante despido improcedente sería de ≈${fmtN(antiguedad * 33)} días de salario. En la nueva empresa empezarías desde cero.`);
    }
    if (difVac <= -5) {
      insights.push(`Perderías ${Math.abs(difVac)} días de vacaciones, equivalente a renunciar a ≈${fmtN(Math.round((oR.annualGross / 220) * Math.abs(difVac)))} € brutos en tiempo libre al año.`);
    }
  }

  // ── Verdict config ────────────────────────────────────────────────────────────

  const verdictConfig = {
    green: {
      icon: "✅",
      title: "En principio, te compensa",
      sub: "La mejora económica y los factores cualitativos apuntan a que el cambio es favorable.",
      color: "#34d399",
      bg: "rgba(52,211,153,0.06)",
      border: "rgba(52,211,153,0.25)",
      glow: "rgba(52,211,153,0.12)",
    },
    yellow: {
      icon: "⚠️",
      title: "Valóralo bien antes de decidir",
      sub: "La diferencia económica es moderada. Los factores no salariales pueden ser determinantes.",
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.06)",
      border: "rgba(251,191,36,0.25)",
      glow: "rgba(251,191,36,0.1)",
    },
    red: {
      icon: "❌",
      title: "Con estos números, no parece rentable",
      sub: "La compensación total empeora o la mejora es insuficiente dado lo que perderías.",
      color: "#f87171",
      bg: "rgba(248,113,113,0.06)",
      border: "rgba(248,113,113,0.25)",
      glow: "rgba(248,113,113,0.1)",
    },
  };

  const vc = verdictConfig[verdict];
  const diffColor = difTotal > 500 ? "#34d399" : difTotal < -200 ? "#f87171" : "#fbbf24";

  // ─── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* ── Advanced profile toggle ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
      >
        <button
          className="w-full flex items-center justify-between px-5 py-4 transition-colors"
          style={{ color: showAdvanced ? "#a5b4fc" : "#7c7ca0" }}
          onClick={() => setShowAdvanced((v) => !v)}
        >
          <span className="flex items-center gap-2.5 text-sm font-semibold">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="7" cy="4.5" r="2" /><path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" />
            </svg>
            Perfil personal
          </span>
          <span className="flex items-center gap-2" style={{ color: "#5a5a80", fontSize: "0.75rem" }}>
            {showAdvanced ? "Ocultar" : "Personalizar situación familiar, edad y contrato"}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transition-transform duration-200" style={{ transform: showAdvanced ? "rotate(180deg)" : "none" }}>
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: showAdvanced ? "420px" : "0px" }}>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-5 pb-5 pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <SelectInput<FamilySituation>
              label="Situación familiar"
              value={familySituation}
              onChange={setFamilySituation}
              options={[
                { value: "soltero",      label: "Soltero/a" },
                { value: "casado",       label: "Casado/a" },
                { value: "monoparental", label: "Monoparental" },
              ]}
            />
            <NumInput label="Hijos a cargo" value={numChildren} onChange={setNumChildren} placeholder="0" />
            <NumInput label="Edad" value={age} onChange={setAge} placeholder="35" />
            <SelectInput<ContractType>
              label="Tipo de contrato"
              value={contractType}
              onChange={setContractType}
              options={[
                { value: "indefinido", label: "Indefinido" },
                { value: "temporal",   label: "Temporal" },
              ]}
            />
            <SelectInput<Disability>
              label="Discapacidad"
              value={disability}
              onChange={setDisability}
              options={[
                { value: "none",           label: "Sin discapacidad" },
                { value: "33-65",          label: "33 %–65 %" },
                { value: "65plus",         label: "> 65 %" },
                { value: "65plus-mobility",label: "> 65 % + movilidad" },
              ]}
            />
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
              <span style={{ color: "#9090b8", fontSize: "0.8rem" }}>Cónyuge sin ingresos</span>
            </div>
          </div>
          <p className="px-5 pb-4" style={{ color: "#4a4a6a", fontSize: "0.72rem" }}>
            Por defecto: soltero/a · sin hijos · 35 años · indefinido. Se aplica a ambos escenarios para que la comparativa sea justa.
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

        {/* VS divider — desktop only */}
        <div className="hidden md:flex flex-col items-center justify-center shrink-0 gap-2" style={{ width: 40 }}>
          <div className="flex-1 w-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-syne font-black text-xs shrink-0"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "#5a5a80" }}
          >
            VS
          </div>
          <div className="flex-1 w-px" style={{ background: "rgba(255,255,255,0.05)" }} />
        </div>

        {/* VS divider — mobile only */}
        <div className="md:hidden flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          <span className="font-syne font-black text-xs" style={{ color: "#4a4a6a" }}>VS</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
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

      {/* ── CTA button ── */}
      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          className="relative overflow-hidden flex items-center gap-3 font-syne font-black tracking-widest uppercase"
          style={{
            background: "linear-gradient(135deg, #4f52d4 0%, #6366f1 50%, #818cf8 100%)",
            color: "#fff",
            borderRadius: 16,
            padding: "16px 40px",
            fontSize: "0.9rem",
            letterSpacing: "0.12em",
            boxShadow: "0 6px 30px rgba(99,102,241,0.5), 0 0 0 1px rgba(99,102,241,0.3)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 40px rgba(99,102,241,0.65), 0 0 0 1px rgba(99,102,241,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 30px rgba(99,102,241,0.5), 0 0 0 1px rgba(99,102,241,0.3)";
          }}
        >
          {/* Shine sweep */}
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
            }}
          />
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 8h4M10 8h4M8 2v4M8 10v4" />
            <circle cx="8" cy="8" r="2.5" />
          </svg>
          Comparar ofertas
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2.5 7h9M8 3l4 4-4 4" />
          </svg>
        </button>
      </div>

      {/* ══════════════════════ RESULTS ══════════════════════ */}
      {hasCalculated && ready && aR && oR && (
        <div id="resultado-comparativa" ref={resultRef} className="flex flex-col gap-5 animate-scaleIn" style={{ padding: 4 }}>

          {/* ── PDF header (logo + fecha) ── */}
          <div
            className="flex items-center justify-between px-5 py-4 rounded-2xl"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #4f52d4, #6366f1)", boxShadow: "0 0 0 1px rgba(99,102,241,0.3)" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M2 8h4M10 8h4M8 2v4M8 10v4" /><circle cx="8" cy="8" r="2.5" />
                </svg>
              </div>
              <span className="font-syne font-bold" style={{ fontSize: "0.9rem", color: "#e0e0ff" }}>CalculadoraNomina.org</span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#5a5a80" }}>
              Comparativa generada el {new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          {/* ── Separador visual ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3))" }} />
            <span
              className="font-syne font-bold text-xs tracking-widest uppercase shrink-0"
              style={{ color: "#6366f1" }}
            >
              Resultado
            </span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.3), transparent)" }} />
          </div>

          {/* ── Bloque 1: Summary cards ── */}
          <div className="flex flex-col md:flex-row gap-4">
            {[
              { label: "Trabajo actual", r: aR, bonus: aBonus, vac: aVac, tele: actual.teletrabajo, ccaa: COMUNIDADES_LABEL[actual.ccaa], pagas: actual.pagas, bruto: aB, accent: "#818cf8" },
              { label: "Nueva oferta",   r: oR, bonus: oBonus, vac: oVac, tele: oferta.teletrabajo, ccaa: COMUNIDADES_LABEL[oferta.ccaa], pagas: oferta.pagas, bruto: oB, accent: "#34d399" },
            ].map((card) => (
              <div
                key={card.label}
                className="flex-1 rounded-2xl overflow-hidden"
                style={{ background: "rgba(13,13,26,0.9)", border: `1px solid ${card.accent}28` }}
              >
                <div style={{ height: 3, background: `linear-gradient(90deg, ${card.accent}, ${card.accent}20)` }} />
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: card.accent, boxShadow: `0 0 6px ${card.accent}` }} />
                    <span className="font-syne font-bold tracking-widest uppercase" style={{ fontSize: "0.72rem", color: card.accent }}>
                      {card.label}
                    </span>
                  </div>

                  {/* Neto mensual protagonista */}
                  <div className="mb-5">
                    <div className="font-syne font-extrabold tabnum leading-none" style={{ fontSize: "clamp(2.2rem, 5vw, 2.8rem)", color: "#f0f0ff" }}>
                      {fmtN(Math.round(card.r.monthlyNet))} €
                    </div>
                    <div style={{ color: "#5a5a80", fontSize: "0.75rem", marginTop: 4 }}>neto mensual</div>
                  </div>

                  {/* Desglose completo */}
                  <div className="flex flex-col" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                    {([
                      { lbl: "Bruto anual",       val: `${fmtN(card.bruto)} €`,                              clr: "#7070a0" },
                      { lbl: "Neto anual",        val: `${fmtN(Math.round(card.r.annualNet))} €`,             clr: "#e0e0ff", bold: true },
                      { lbl: "SS trabajador/año", val: `${fmtN(Math.round(card.r.annualSS))} €`,              clr: "#7070a0" },
                      { lbl: "IRPF pagado/año",   val: `${fmtN(Math.round(card.r.annualIRPF))} €`,            clr: "#7070a0" },
                      { lbl: "IRPF efectivo",     val: `${fi(card.r.irpfEfectivo)} %`,                        clr: "#fbbf24" },
                      ...(card.bonus > 0 ? [{ lbl: "Bonus anual", val: `${fmtN(card.bonus)} €`, clr: card.accent, bold: false }] : []),
                      { lbl: "Vacaciones",        val: `${card.vac} días`,                                    clr: "#9090b8" },
                      { lbl: "Teletrabajo",       val: TELETRABAJO_LABEL[card.tele],                          clr: "#9090b8" },
                    ] as { lbl: string; val: string; clr: string; bold?: boolean }[]).map((row, ri) => (
                      <div
                        key={ri}
                        className="flex items-center justify-between py-2"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      >
                        <span style={{ fontSize: "0.75rem", color: "#5a5a80" }}>{row.lbl}</span>
                        <span className={row.bold ? "font-semibold" : ""} style={{ fontSize: "0.82rem", color: row.clr, tabularNums: true } as React.CSSProperties}>{row.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer CCAA */}
                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ color: "#4a4a6a", fontSize: "0.72rem" }}>{card.ccaa}</span>
                    <span style={{ color: "#4a4a6a", fontSize: "0.72rem" }}>{card.pagas} pagas</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Bloque 2: Diferencia real — protagonista ── */}
          <div
            className="rounded-2xl p-6 md:p-8 text-center relative overflow-hidden"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${diffColor}10 0%, rgba(8,8,16,0.95) 70%)`,
              border: `1px solid ${diffColor}30`,
            }}
          >
            {/* Glow absoluto detrás del número */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle 120px at 50% 60%, ${diffColor}15 0%, transparent 70%)`,
              }}
            />

            <p className="font-syne font-bold text-xs tracking-widest uppercase mb-4" style={{ color: "#5a5a80" }}>
              Diferencia real
            </p>

            {/* Número central */}
            <div
              className="font-syne font-extrabold tabnum leading-none mb-1"
              style={{ fontSize: "clamp(2.8rem, 9vw, 4rem)", color: diffColor }}
            >
              {fmtSigned(Math.round(difMensual))}
            </div>
            <div className="text-sm mb-6" style={{ color: "#6060a0" }}>al mes en neto</div>

            {/* Desglose anual */}
            <div
              className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-6 py-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-center">
                <div className="font-syne font-bold tabnum" style={{ fontSize: "1.4rem", color: difAnual >= 0 ? "#34d399" : "#f87171" }}>
                  {fmtSigned(Math.round(difAnual))}
                </div>
                <div style={{ color: "#5a5a80", fontSize: "0.72rem", marginTop: 3 }}>neto/año</div>
              </div>
              {difBonus !== 0 && (
                <>
                  <span style={{ color: "#3a3a60", fontSize: "1.2rem", fontWeight: 700 }}>+</span>
                  <div className="text-center">
                    <div className="font-syne font-bold tabnum" style={{ fontSize: "1.4rem", color: difBonus >= 0 ? "#34d399" : "#f87171" }}>
                      {fmtSigned(difBonus)}
                    </div>
                    <div style={{ color: "#5a5a80", fontSize: "0.72rem", marginTop: 3 }}>bonus/año</div>
                  </div>
                  <span style={{ color: "#3a3a60", fontSize: "1.2rem", fontWeight: 700 }}>=</span>
                  <div className="text-center">
                    <div className="font-syne font-bold tabnum" style={{ fontSize: "1.4rem", color: difTotal >= 0 ? "#34d399" : "#f87171" }}>
                      {fmtSigned(Math.round(difTotal))}
                    </div>
                    <div style={{ color: "#5a5a80", fontSize: "0.72rem", marginTop: 3 }}>compensación total/año</div>
                  </div>
                </>
              )}
            </div>

            {/* Texto dinámico */}
            <p className="text-sm leading-relaxed mt-5 max-w-lg mx-auto" style={{ color: "#8080a8" }}>
              {difMensual >= 200
                ? `Cobrarías ${fmtN(Math.round(difMensual))} € más al mes netos.${difTotal > difAnual ? ` Contando el bonus, la mejora total anual sería de ${fmtN(Math.round(difTotal))} €.` : ""}`
                : difMensual <= -100
                ? `Cobrarías ${fmtN(Math.round(Math.abs(difMensual)))} € menos al mes netos.${difTotal > difAnual ? ` El bonus compensa parcialmente: la pérdida total anual sería de ${fmtN(Math.round(Math.abs(difTotal)))} €.` : ""}`
                : `La diferencia mensual en neto es pequeña (${fmtN(Math.round(Math.abs(difMensual)))} €). El peso de la decisión recae en los factores no económicos.`}
            </p>
          </div>

          {/* ── Bloque 3: Factores adicionales ── */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p
              className="font-syne font-bold tracking-widest uppercase mb-4"
              style={{ fontSize: "0.72rem", color: "#5a5a80" }}
            >
              Factores adicionales
            </p>
            <div className="flex flex-col gap-2">
              <QualRow
                icon="🎯"
                label="Bonus anual"
                value={difBonus === 0 ? "Sin cambio" : difBonus > 0 ? `+${fmtN(difBonus)} €/año en la nueva oferta` : `−${fmtN(Math.abs(difBonus))} €/año en la nueva oferta`}
                sentiment={difBonus > 0 ? "positive" : difBonus < 0 ? "negative" : "neutral"}
              />
              <QualRow
                icon="🏖️"
                label="Vacaciones"
                value={difVac === 0 ? `${oVac} días (sin cambio)` : difVac > 0 ? `+${difVac} días más (${oVac} vs ${aVac})` : `${Math.abs(difVac)} días menos (${oVac} vs ${aVac})`}
                sentiment={difVac > 0 ? "positive" : difVac < 0 ? "negative" : "neutral"}
              />
              <QualRow
                icon="🏠"
                label="Teletrabajo"
                value={difTeletrab === 0 ? TELETRABAJO_LABEL[oferta.teletrabajo] : difTeletrab > 0 ? `Mejora: ${TELETRABAJO_LABEL[actual.teletrabajo]} → ${TELETRABAJO_LABEL[oferta.teletrabajo]}` : `Empeora: ${TELETRABAJO_LABEL[actual.teletrabajo]} → ${TELETRABAJO_LABEL[oferta.teletrabajo]}`}
                sentiment={difTeletrab > 0 ? "positive" : difTeletrab < 0 ? "negative" : "neutral"}
              />
              {antiguedad > 0 && (
                <QualRow
                  icon="📅"
                  label="Antigüedad"
                  value={`Pierdes ${antiguedad} año${antiguedad !== 1 ? "s" : ""} de antigüedad en la empresa actual`}
                  sentiment={antiguedad >= 3 ? "negative" : "neutral"}
                />
              )}
              {actual.pagas !== oferta.pagas && (
                <QualRow
                  icon="📋"
                  label="Distribución de pagas"
                  value={`Cambias de ${actual.pagas} a ${oferta.pagas} pagas (el total anual no cambia)`}
                  sentiment="neutral"
                />
              )}
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
          {(() => {
            const m = Math.round(difMensual);
            const t = Math.round(difTotal);
            const mAbs = fmtN(Math.abs(m));
            const aAbs = fmtN(Math.round(Math.abs(difAnual)));
            const tAbs = fmtN(Math.abs(t));
            let body: string;
            if (verdict === "green") {
              body = difBonus > 0
                ? `Cobrarías ${mAbs} € más cada mes netos. Con el bonus, la mejora total sube a ${tAbs} € al año. La parte económica apunta claramente al cambio.`
                : `Cobrarías ${mAbs} € más al mes netos, ${aAbs} € al año. Los números dicen que sí. La última palabra es tuya.`;
            } else if (verdict === "yellow") {
              body = m >= 0
                ? `La diferencia es solo +${mAbs} €/mes netos. En este rango, lo que no aparece en la nómina —flexibilidad, proyección, cultura de empresa— suele pesar más que el dinero. Analiza bien antes de decidir.`
                : `La diferencia es de −${mAbs} €/mes netos. Esa pérdida podría compensarse si las condiciones no salariales de la nueva oferta son significativamente mejores. Tú decides.`;
            } else {
              body = difBonus > 0
                ? `Perderías ${mAbs} €/mes netos. Aunque el bonus de la nueva oferta es mayor, la compensación total sigue siendo inferior (${tAbs} € menos al año). Para que el cambio tenga sentido, el argumento no puede ser económico.`
                : `Perderías ${mAbs} €/mes netos (${aAbs} €/año). Para que compense, tiene que haber razones estratégicas de peso más allá del salario: mejor puesto, mayor proyección o mejores condiciones de trabajo.`;
            }
            return (
              <div className="rounded-2xl p-6 md:p-7 relative overflow-hidden" style={{ background: vc.bg, border: `1px solid ${vc.border}` }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 20% 50%, ${vc.glow} 0%, transparent 70%)` }} />
                <div className="relative flex items-start gap-5">
                  <span style={{ fontSize: "2rem", lineHeight: 1, flexShrink: 0 }}>{vc.icon}</span>
                  <div>
                    <p className="font-syne font-extrabold" style={{ fontSize: "1.15rem", color: vc.color, lineHeight: 1.2 }}>{vc.title}</p>
                    <p className="text-sm mt-2 leading-relaxed font-medium" style={{ color: "#c0c0d8" }}>{body}</p>
                    <p className="text-xs mt-3 leading-relaxed" style={{ color: "#5a5a80" }}>
                      Este análisis es orientativo. La decisión depende también de factores que no se pueden medir: cultura de empresa, proyección profesional, estabilidad del sector y tus prioridades vitales.
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── Botón descarga PDF ── */}
          <div className="flex justify-center">
            <button
              onClick={handleDownloadPDF}
              disabled={!hasCalculated}
              className="group flex items-center gap-3 rounded-xl font-semibold transition-all"
              style={{
                background: hasCalculated
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(129,140,248,0.12) 100%)'
                  : 'rgba(99,102,241,0.04)',
                border: `1px solid ${hasCalculated ? 'rgba(129,140,248,0.4)' : 'rgba(99,102,241,0.1)'}`,
                color: hasCalculated ? '#a5b4fc' : '#3a3a70',
                cursor: hasCalculated ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem',
                padding: '12px 22px',
                boxShadow: hasCalculated ? '0 2px 18px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.06)' : 'none',
                letterSpacing: '0.02em',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                if (hasCalculated) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (hasCalculated) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 18px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.06)';
                }
              }}
            >
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{
                  width: 28, height: 28,
                  background: hasCalculated ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.08)',
                  border: `1px solid ${hasCalculated ? 'rgba(129,140,248,0.4)' : 'rgba(99,102,241,0.15)'}`,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6.5 1.5v7M4 6l2.5 2.5L9 6M1.5 10.5h10" />
                </svg>
              </div>
              Descargar comparativa en PDF
              <span
                style={{
                  fontSize: '0.68rem', fontWeight: 700,
                  padding: '2px 7px', borderRadius: 5,
                  background: hasCalculated ? 'rgba(165,180,252,0.15)' : 'rgba(99,102,241,0.06)',
                  color: hasCalculated ? '#818cf8' : '#3a3a70',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}
              >PDF</span>
            </button>
          </div>

          {/* ── Bloque 5: Insights ── */}
          {insights.length > 0 && (
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(99,102,241,0.03)", border: "1px solid rgba(99,102,241,0.12)" }}
            >
              <p
                className="font-syne font-bold tracking-widest uppercase mb-4"
                style={{ fontSize: "0.72rem", color: "#5a5a80" }}
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
                      width="15" height="15" viewBox="0 0 16 16" fill="none"
                      stroke="#818cf8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                      className="shrink-0 mt-0.5"
                    >
                      <circle cx="8" cy="8" r="6.5" /><path d="M8 7v4M8 5v.5" />
                    </svg>
                    <p className="text-sm leading-relaxed" style={{ color: "#9090b8" }}>{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PDF footer ── */}
          <div
            className="text-center py-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p style={{ fontSize: "0.7rem", color: "#3a3a60" }}>
              Calculado en calculadoranomina.org · Datos AEAT 2026 · Cálculo orientativo
            </p>
          </div>

          {/* ── CTA calculadora completa ── */}
          <div
            className="rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-sm" style={{ color: "#7c7ca0" }}>
              ¿Quieres el desglose completo de cotizaciones, IRPF y neto mensual de cualquiera de los dos empleos?
            </p>
            <a
              href="/"
              className="shrink-0 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
              style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.25)", whiteSpace: "nowrap" }}
            >
              Calculadora completa →
            </a>
          </div>

        </div>
      )}
    </div>
  );
}
