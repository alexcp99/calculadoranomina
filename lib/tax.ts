// ─── Types ────────────────────────────────────────────────────────────────────

export type ContractType = "indefinido" | "temporal";
export type FamilySituation = "soltero" | "casado" | "monoparental";

export interface TaxInput {
  annualGross: number;
  contractType: ContractType;
  familySituation: FamilySituation;
  numChildren: 0 | 1 | 2;
  spouseWithoutIncome: boolean;
}

export interface TaxResult {
  // Gross
  annualGross: number;
  monthlyGross: number;
  // Seguridad Social
  annualSS: number;
  monthlySS: number;
  ssRate: number; // percentage, e.g. 6.5
  // IRPF
  annualIRPF: number;
  monthlyIRPF: number;
  irpfRate: number; // percentage, e.g. 14.2
  // Net
  annualNet: number;
  monthlyNet: number;
  netPercent: number; // percentage of gross, e.g. 79.3
  // Intermediate steps (for desglose)
  rendimientoNeto: number;
  reduccion: number;
  rendimientoNetoReducido: number;
  minimoPersonal: number;
  baseRetencion: number;
}

// ─── Constants (AEAT 2026) ────────────────────────────────────────────────────

// Seguridad Social — parte trabajador
const SS = {
  contingencias: 0.047,
  desempleoIndefinido: 0.0155,
  desempleoTemporal: 0.016,
  fp: 0.001,
  mei: 0.0015,
};

const MAX_SS_BASE = 5101.2 * 12; // 60,614.40 €/año

// IRPF — escala general (estatal + autonómica genérica)
const BRACKETS = [
  { from: 0, to: 12450, rate: 0.19 },
  { from: 12450, to: 20200, rate: 0.24 },
  { from: 20200, to: 35200, rate: 0.3 },
  { from: 35200, to: 60000, rate: 0.37 },
  { from: 60000, to: 300000, rate: 0.45 },
  { from: 300000, to: Infinity, rate: 0.47 },
] as const;

const GASTOS_DEDUCIBLES = 2000; // €/año
const UMBRAL_EXENTO = 15876; // €/año — por debajo: retención = 0
const MIN_IRPF = 0.02;
const MAX_IRPF = 0.47;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSsRate(contractType: ContractType): number {
  const desempleo =
    contractType === "indefinido" ? SS.desempleoIndefinido : SS.desempleoTemporal;
  return SS.contingencias + desempleo + SS.fp + SS.mei;
}

function applyBrackets(base: number): number {
  if (base <= 0) return 0;
  let tax = 0;
  for (const { from, to, rate } of BRACKETS) {
    if (base <= from) break;
    tax += (Math.min(base, to) - from) * rate;
  }
  return tax;
}

// Reducción por obtención de rendimientos del trabajo (art. 20 LIRPF).
// IMPORTANTE: para rentas > 19.747,50 la reducción es 0, no 2.015,25.
// La cifra 2.015,25 aplica a la declaración anual, no a la retención mensual.
// Verificado contra calculadora AEAT 2026 (resultado 20,30% para 36.000 €).
function calcReduccion(rn: number): number {
  if (rn <= 14047.5) return 6498;
  if (rn <= 19747.5) return 6498 - 1.14 * (rn - 14047.5);
  return 0;
}

function calcMinimoPersonal(
  situation: FamilySituation,
  children: 0 | 1 | 2,
  spouseWithoutIncome: boolean
): number {
  let base = 5550;
  if (children >= 1) base += 2400;
  if (children >= 2) base += 2700;
  if (situation === "casado" && spouseWithoutIncome) base += 3400;
  return base;
}

// ─── Core computation ─────────────────────────────────────────────────────────

export function computeTax(input: TaxInput): TaxResult {
  const { annualGross, contractType, familySituation, numChildren, spouseWithoutIncome } =
    input;

  // ── Seguridad Social ──
  const ssRate = getSsRate(contractType);
  const ssBase = Math.min(annualGross, MAX_SS_BASE);
  const annualSS = ssBase * ssRate;

  // ── Cálculo IRPF (algoritmo retención AEAT 2026) ──
  //
  // La SS NO entra en la base del IRPF para retenciones.
  // La SS es una retención salarial separada, no un gasto deducible
  // en el cálculo del tipo de retención del pagador.
  // El mínimo personal reduce la CUOTA (no la base).
  // El tipo se trunca (floor) a 2 decimales antes de aplicar.
  //
  // Verificado: 36.000 € bruto, soltero, indefinido → 20,30% (AEAT 2026).
  const rendimientoNeto = annualGross - GASTOS_DEDUCIBLES; // sin SS
  const reduccion = calcReduccion(rendimientoNeto);
  const rendimientoNetoReducido = Math.max(0, rendimientoNeto - reduccion);
  const minimoPersonal = calcMinimoPersonal(
    familySituation,
    numChildren,
    spouseWithoutIncome
  );
  // El mínimo NO se resta de la base; se aplica como cuota2 = scale(mínimo)
  const baseRetencion = rendimientoNetoReducido;

  // ── IRPF ──
  let irpfRate = 0;
  let annualIRPF = 0;

  if (annualGross >= UMBRAL_EXENTO) {
    const cuotaRetencion = applyBrackets(baseRetencion);
    const cuotaMinimo = applyBrackets(minimoPersonal);
    const cuotaNeta = Math.max(0, cuotaRetencion - cuotaMinimo);
    // Truncar a 2 decimales (floor), luego aplicar límites
    const rawRate = cuotaNeta / annualGross;
    const truncated = Math.floor(rawRate * 10000) / 10000;
    irpfRate = Math.min(MAX_IRPF, Math.max(MIN_IRPF, truncated));
    annualIRPF = annualGross * irpfRate;
  }

  const annualNet = annualGross - annualSS - annualIRPF;

  return {
    annualGross,
    monthlyGross: annualGross / 12,
    annualSS,
    monthlySS: annualSS / 12,
    ssRate: ssRate * 100,
    annualIRPF,
    monthlyIRPF: annualIRPF / 12,
    irpfRate: irpfRate * 100,
    annualNet,
    monthlyNet: annualNet / 12,
    netPercent: annualGross > 0 ? (annualNet / annualGross) * 100 : 0,
    rendimientoNeto,
    reduccion,
    rendimientoNetoReducido,
    minimoPersonal,
    baseRetencion,
  };
}

// ─── Neto → Bruto (binary search) ────────────────────────────────────────────

export function computeNetToGross(
  targetAnnualNet: number,
  options: Omit<TaxInput, "annualGross">
): TaxResult {
  if (targetAnnualNet <= 0) {
    return computeTax({ annualGross: 0, ...options });
  }

  let lo = targetAnnualNet * 0.9;
  let hi = targetAnnualNet * 2.5;

  // Expand upper bound until it's high enough
  for (let i = 0; i < 25; i++) {
    if (computeTax({ annualGross: hi, ...options }).annualNet >= targetAnnualNet) break;
    hi *= 2;
  }

  // Binary search — 60 iterations → precision < 0.01 €
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const result = computeTax({ annualGross: mid, ...options });
    if (Math.abs(result.annualNet - targetAnnualNet) < 0.01) return result;
    if (result.annualNet < targetAnnualNet) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return computeTax({ annualGross: (lo + hi) / 2, ...options });
}
