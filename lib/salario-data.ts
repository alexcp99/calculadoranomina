/**
 * lib/salario-data.ts
 * Fuente única de verdad para los 18 salarios de referencia.
 * Todos los valores numéricos se derivan de computeCalc() con parámetros
 * canónicos (AEAT 2026): Madrid · soltero · indefinido · 12 pagas · 35 años.
 */

import { computeCalc, type CalcInput } from "./calculator";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CcaaRow = { ccaa: string; neto: number; irpf: string };
export type FamilyRow = { label: string; extra: number };

export interface SalarioData {
  bruto: number;
  brutoLabel: string;    // e.g. "30.000"
  slug: string;          // e.g. "30000"
  netoMensual: number;
  netoAnual: number;
  irpfEf: string;        // e.g. "15,9"
  costeEmpresa: number;
  ssEuros: number;
  irpfEuros: number;
  ccaaTable: CcaaRow[];  // 6 CCAA: Madrid, Andalucía, CyL, Valencia, Galicia, Cataluña
  familyTable: FamilyRow[];
  faq: { q: string; a: string }[];
}

// ─── Parámetros canónicos ─────────────────────────────────────────────────────

const CANONICAL: Omit<CalcInput, "annualGross"> = {
  contractType:        "indefinido",
  familySituation:     "soltero",
  numChildren:         0,
  childrenUnder3:      0,
  spouseWithoutIncome: false,
  age:                 35,
  comunidad:           "madrid",
  numPayments:         12,
  disability:          "none",
  geographicMobility:  false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Formatea número con separadores es-ES (e.g. 30000 → "30.000") */
export function fmt(n: number): string {
  return n.toLocaleString("es-ES");
}

/** Formatea tipo efectivo a 1 decimal con coma (e.g. 15.94 → "15,9") */
function fi(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

type ComunidadKey = CalcInput["comunidad"];

const CCAA_LIST: Array<{ ccaa: string; key: ComunidadKey }> = [
  { ccaa: "Comunidad de Madrid",  key: "madrid"        },
  { ccaa: "Andalucía",            key: "andalucia"     },
  { ccaa: "Castilla y León",      key: "castilla_leon" },
  { ccaa: "Comunitat Valenciana", key: "valencia"      },
  { ccaa: "Galicia",              key: "galicia"       },
  { ccaa: "Cataluña",             key: "cataluna"      },
];

// ─── buildEntry ───────────────────────────────────────────────────────────────

function buildEntry(bruto: number): SalarioData {
  const r = computeCalc({ annualGross: bruto, ...CANONICAL });

  const netoMensual  = Math.round(r.monthlyNet);
  const netoAnual    = Math.round(r.annualNet);
  const irpfEf       = fi(r.irpfEfectivo);
  const costeEmpresa = Math.round(r.totalEmployerCost);
  const ssEuros      = Math.round(r.annualSS);
  const irpfEuros    = Math.round(r.annualIRPF);
  const slug         = String(bruto);
  const brutoLabel   = fmt(bruto);

  // ── CCAA table ─────────────────────────────────────────────────────────────
  const ccaaTable: CcaaRow[] = CCAA_LIST.map(({ ccaa, key }) => {
    const rc = computeCalc({ annualGross: bruto, ...CANONICAL, comunidad: key });
    return { ccaa, neto: Math.round(rc.monthlyNet), irpf: `${fi(rc.irpfEfectivo)} %` };
  });

  // ── Familia ────────────────────────────────────────────────────────────────
  const child1Neto  = Math.round(computeCalc({ annualGross: bruto, ...CANONICAL, numChildren: 1 }).monthlyNet);
  const child2Neto  = Math.round(computeCalc({ annualGross: bruto, ...CANONICAL, numChildren: 2 }).monthlyNet);
  const marriedNeto = Math.round(computeCalc({ annualGross: bruto, ...CANONICAL, familySituation: "casado", spouseWithoutIncome: true }).monthlyNet);

  const familyTable: FamilyRow[] = [
    { label: "Soltero/a sin hijos",              extra: 0 },
    { label: "Con 1 hijo",                        extra: child1Neto  - netoMensual },
    { label: "Con 2 hijos",                        extra: child2Neto  - netoMensual },
    { label: "Casado/a, cónyuge sin ingresos",    extra: marriedNeto - netoMensual },
  ];

  // ── Valores auxiliares para FAQ ────────────────────────────────────────────
  const catRow    = ccaaTable.find((c) => c.ccaa === "Cataluña")!;
  const catNeto   = catRow.neto;
  const catIrpf   = catRow.irpf.replace(" %", "");
  const difMadCat = netoMensual - catNeto;
  const difAnual  = difMadCat * 12;

  // ── FAQ ────────────────────────────────────────────────────────────────────
  const faq: { q: string; a: string }[] = [];

  // Q1 — neto mensual
  if (bruto <= 20000) {
    faq.push({
      q: `¿Cuánto es ${brutoLabel}€ brutos en neto al mes?`,
      a: `Con ${brutoLabel}€ brutos anuales cobras aproximadamente ${fmt(netoMensual)}€ netos al mes en Madrid (2026). A este nivel salarial, la retención del IRPF es muy reducida (${irpfEf}%) gracias a las reducciones por rendimientos del trabajo y el mínimo personal.`,
    });
  } else {
    faq.push({
      q: `¿Cuánto es ${brutoLabel}€ brutos en neto al mes?`,
      a: `Con ${brutoLabel}€ brutos anuales cobras aproximadamente ${fmt(netoMensual)}€ netos al mes en Madrid (2026), después de descontar la Seguridad Social (6,5%) y la retención del IRPF (tipo efectivo ${irpfEf}%).`,
    });
  }

  // Q2 — IRPF
  if (bruto <= 20000) {
    faq.push({
      q: `¿Por qué con ${brutoLabel}€ brutos se paga tan poco IRPF?`,
      a: `La reducción por rendimientos del trabajo (Art. 20 LIRPF) y el mínimo personal (5.550€) reducen considerablemente la base imponible a este nivel salarial. Con ${brutoLabel}€ brutos en Madrid, la retención IRPF anual es de aproximadamente ${fmt(irpfEuros)}€ (tipo efectivo ${irpfEf}%).`,
    });
  } else {
    faq.push({
      q: `¿Cuánto IRPF se paga con ${brutoLabel}€ brutos?`,
      a: `Con ${brutoLabel}€ brutos, la retención IRPF anual en Madrid es de aproximadamente ${fmt(irpfEuros)}€ (tipo efectivo ${irpfEf}%). En Cataluña, con tipos autonómicos más altos, la retención sube al ${catIrpf}%, lo que supone unos ${fmt(difMadCat)}€/mes menos neto.`,
    });
  }

  // Q3 — coste empresa
  faq.push({
    q: `¿Cuánto cuesta a la empresa un empleado de ${brutoLabel}€?`,
    a: `El coste total para la empresa es de aproximadamente ${fmt(costeEmpresa)}€ anuales, incluyendo el salario bruto más las cotizaciones patronales a la Seguridad Social (contingencias comunes, desempleo, FOGASA y formación profesional).`,
  });

  // Q4 — diferencia Madrid vs Cataluña
  faq.push({
    q: `¿Cuánto varía el neto entre Madrid y Cataluña con ${brutoLabel}€?`,
    a: `La diferencia es de ${fmt(difMadCat)}€ al mes (${fmt(difAnual)}€ al año). En Madrid se cobran ${fmt(netoMensual)}€/mes y en Cataluña ${fmt(catNeto)}€/mes, debido a los tipos autonómicos del IRPF más elevados en Cataluña.`,
  });

  return {
    bruto,
    brutoLabel,
    slug,
    netoMensual,
    netoAnual,
    irpfEf,
    costeEmpresa,
    ssEuros,
    irpfEuros,
    ccaaTable,
    familyTable,
    faq,
  };
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ALL: SalarioData[] = [
  15000, 16000, 18000, 20000, 22000, 24000, 25000,
  28000, 30000, 32000, 35000, 40000, 45000, 50000,
  60000, 70000, 80000, 100000,
].map(buildEntry);

export const SALARIO_DATA: Record<string, SalarioData> = Object.fromEntries(
  ALL.map((d) => [d.slug, d])
);

export const ALL_SALARIOS = ALL;
