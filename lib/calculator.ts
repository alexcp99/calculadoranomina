/**
 * calculadora-nomina — lib/calculator.ts
 * Implementación del algoritmo oficial AEAT 2026 para el cálculo de
 * retenciones de IRPF y cuotas de Seguridad Social en España.
 *
 * Verificado: 36.000 € bruto · soltero · Madrid → ~2.289 €/mes neto (12 pagas)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContractType = "indefinido" | "temporal";
export type FamilySituation = "soltero" | "casado" | "monoparental";
export type Disability = "none" | "33-65" | "65plus" | "65plus-mobility";
export type NumPayments = 12 | 14;
export type ComunidadAutonoma =
  | "andalucia"
  | "aragon"
  | "asturias"
  | "baleares"
  | "canarias"
  | "cantabria"
  | "castilla_la_mancha"
  | "castilla_leon"
  | "cataluna"
  | "extremadura"
  | "galicia"
  | "la_rioja"
  | "madrid"
  | "murcia"
  | "navarra"
  | "pais_vasco"
  | "valencia"
  | "ceuta"
  | "melilla";

export interface CalcInput {
  annualGross: number;
  contractType: ContractType;
  familySituation: FamilySituation;
  numChildren: number;
  childrenUnder3: number;
  spouseWithoutIncome: boolean;
  age: number;
  comunidad: ComunidadAutonoma;
  numPayments: NumPayments;
  disability: Disability;
  geographicMobility: boolean;
}

export interface CalcResult {
  // Gross
  annualGross: number;
  monthlyGross: number;
  // SS trabajador
  cotizacionBase: number;
  ssContingencias: number;
  ssDesempleo: number;
  ssFP: number;
  ssMEI: number;
  annualSS: number;
  monthlySS: number;
  ssRate: number; // % efectivo sobre bruto, e.g. 6.50
  // IRPF intermediate
  gastosDeducibles: number;
  rendimientoNeto: number;
  reduccionArt20: number;
  rendimientoNetoReducido: number;
  minimoPersonal: number;
  minimoFamiliar: number;
  minimoTotal: number;
  baseRetencion: number;
  irpfEstatual: number;  // cuota estatal bruta (before mínimo)
  irpfAutonomica: number; // cuota autonómica bruta (before mínimo)
  // IRPF totals
  annualIRPF: number;
  monthlyIRPF: number;
  irpfEfectivo: number; // tipo efectivo %, e.g. 14.23
  irpfMarginal: number; // tipo marginal % (bracket rate), e.g. 33.5
  // Net
  annualNet: number;
  monthlyNet: number;
  netPerPayment: number; // annualNet / numPayments
  netPercent: number; // % neto sobre bruto
  // Employer
  employerSS: number;
  totalEmployerCost: number;
}

// ─── Labels ───────────────────────────────────────────────────────────────────

export const COMUNIDADES_LABEL: Record<ComunidadAutonoma, string> = {
  andalucia: "Andalucía",
  aragon: "Aragón",
  asturias: "Asturias",
  baleares: "Islas Baleares",
  canarias: "Canarias",
  cantabria: "Cantabria",
  castilla_la_mancha: "Castilla-La Mancha",
  castilla_leon: "Castilla y León",
  cataluna: "Cataluña",
  extremadura: "Extremadura",
  galicia: "Galicia",
  la_rioja: "La Rioja",
  madrid: "Comunidad de Madrid",
  murcia: "Región de Murcia",
  navarra: "Navarra (Foral)",
  pais_vasco: "País Vasco (Foral)",
  valencia: "Comunitat Valenciana",
  ceuta: "Ceuta",
  melilla: "Melilla",
};

// ─── SS Constants (2026) ──────────────────────────────────────────────────────

/** Base máxima de cotización mensual × 12 */
const MAX_SS_BASE = 5101.2 * 12; // 61.214,40 €/año

/** Tipos SS empleado */
const SS_EMPLEADO = {
  contingencias: 0.047,
  desempleoIndefinido: 0.0155,
  desempleoTemporal: 0.016,
  fp: 0.001,
  mei: 0.0015,
} as const;

/** Tipos SS empresa (para cálculo de coste total) */
const SS_EMPRESA = {
  indefinido: 0.3048,  // 23.60 + 5.50 + 0.60 + 0.20 + 0.58
  temporal: 0.3168,    // 23.60 + 6.70 + 0.60 + 0.20 + 0.58
} as const;

// ─── IRPF Bracket definition ──────────────────────────────────────────────────

interface Bracket {
  from: number;
  to: number;
  rate: number; // decimal, e.g. 0.095
}

// ─── Escala estatal IRPF 2026 ─────────────────────────────────────────────────

const ESTATAL_BRACKETS: Bracket[] = [
  { from: 0,       to: 12450,   rate: 0.095  },
  { from: 12450,   to: 20200,   rate: 0.12   },
  { from: 20200,   to: 35200,   rate: 0.15   },
  { from: 35200,   to: 60000,   rate: 0.185  },
  { from: 60000,   to: 300000,  rate: 0.225  },
  { from: 300000,  to: Infinity, rate: 0.245 },
];

// ─── Escalas autonómicas IRPF 2025/2026 ──────────────────────────────────────
// isForal = true → estos tramos sustituyen COMPLETAMENTE a los estatales
//                  (no se suman; son el tipo combinado final)

interface CcaaConfig {
  isForal: boolean;
  brackets: Bracket[];
}

const CCAA_CONFIG: Record<ComunidadAutonoma, CcaaConfig> = {
  madrid: {
    // Escala autonómica consolidada Madrid 2026 (Ley 6/2024 CACM)
    // Límites y tipos verificados contra norma consolidada oficial.
    isForal: false,
    brackets: [
      { from: 0,          to: 13362.22,  rate: 0.085  },
      { from: 13362.22,   to: 19004.63,  rate: 0.107  },
      { from: 19004.63,   to: 35425.68,  rate: 0.128  },
      { from: 35425.68,   to: 57320.40,  rate: 0.174  },
      { from: 57320.40,   to: Infinity,  rate: 0.205  },
    ],
  },

  cataluna: {
    isForal: false,
    brackets: [
      { from: 0,        to: 12450,    rate: 0.105  },
      { from: 12450,    to: 17707.2,  rate: 0.12   },
      { from: 17707.2,  to: 21000,    rate: 0.14   },
      { from: 21000,    to: 33007.2,  rate: 0.15   },
      { from: 33007.2,  to: 53407.2,  rate: 0.188  },
      { from: 53407.2,  to: 90000,    rate: 0.215  },
      { from: 90000,    to: 120000,   rate: 0.235  },
      { from: 120000,   to: 175000,   rate: 0.245  },
      { from: 175000,   to: Infinity, rate: 0.255  },
    ],
  },

  andalucia: {
    isForal: false,
    brackets: [
      { from: 0,       to: 12450,   rate: 0.095  },
      { from: 12450,   to: 20200,   rate: 0.12   },
      { from: 20200,   to: 35200,   rate: 0.15   },
      { from: 35200,   to: 60000,   rate: 0.185  },
      { from: 60000,   to: 300000,  rate: 0.225  },
      { from: 300000,  to: Infinity, rate: 0.245 },
    ],
  },

  valencia: {
    isForal: false,
    brackets: [
      { from: 0,       to: 12450,   rate: 0.10   },
      { from: 12450,   to: 17000,   rate: 0.12   },
      { from: 17000,   to: 30000,   rate: 0.14   },
      { from: 30000,   to: 50000,   rate: 0.175  },
      { from: 50000,   to: 65000,   rate: 0.19   },
      { from: 65000,   to: 80000,   rate: 0.21   },
      { from: 80000,   to: 120000,  rate: 0.22   },
      { from: 120000,  to: 175000,  rate: 0.24   },
      { from: 175000,  to: Infinity, rate: 0.25  },
    ],
  },

  galicia: {
    isForal: false,
    brackets: [
      { from: 0,       to: 12450,   rate: 0.095  },
      { from: 12450,   to: 17707.2, rate: 0.115  },
      { from: 17707.2, to: 33007.2, rate: 0.145  },
      { from: 33007.2, to: 53407.2, rate: 0.185  },
      { from: 53407.2, to: 300000,  rate: 0.225  },
      { from: 300000,  to: Infinity, rate: 0.245 },
    ],
  },

  canarias: {
    isForal: false,
    brackets: [
      { from: 0,       to: 12450,   rate: 0.09   },
      { from: 12450,   to: 20200,   rate: 0.115  },
      { from: 20200,   to: 35200,   rate: 0.14   },
      { from: 35200,   to: 60000,   rate: 0.185  },
      { from: 60000,   to: 300000,  rate: 0.225  },
      { from: 300000,  to: Infinity, rate: 0.245 },
    ],
  },

  aragon: {
    isForal: false,
    brackets: [
      { from: 0,       to: 12450,   rate: 0.10   },
      { from: 12450,   to: 20200,   rate: 0.125  },
      { from: 20200,   to: 35200,   rate: 0.14   },
      { from: 35200,   to: 60000,   rate: 0.185  },
      { from: 60000,   to: 300000,  rate: 0.225  },
      { from: 300000,  to: Infinity, rate: 0.245 },
    ],
  },

  asturias: {
    isForal: false,
    brackets: [
      { from: 0,        to: 12450,    rate: 0.10   },
      { from: 12450,    to: 17707.2,  rate: 0.12   },
      { from: 17707.2,  to: 33007.2,  rate: 0.14   },
      { from: 33007.2,  to: 53407.2,  rate: 0.185  },
      { from: 53407.2,  to: 70000,    rate: 0.215  },
      { from: 70000,    to: 90000,    rate: 0.225  },
      { from: 90000,    to: 175000,   rate: 0.25   },
      { from: 175000,   to: Infinity, rate: 0.255  },
    ],
  },

  baleares: {
    isForal: false,
    brackets: [
      { from: 0,       to: 10000,   rate: 0.095  },
      { from: 10000,   to: 18000,   rate: 0.125  },
      { from: 18000,   to: 30000,   rate: 0.155  },
      { from: 30000,   to: 48000,   rate: 0.20   },
      { from: 48000,   to: 70000,   rate: 0.225  },
      { from: 70000,   to: 120000,  rate: 0.24   },
      { from: 120000,  to: Infinity, rate: 0.25  },
    ],
  },

  cantabria: {
    isForal: false,
    brackets: [
      { from: 0,       to: 12450,   rate: 0.10   },
      { from: 12450,   to: 20200,   rate: 0.125  },
      { from: 20200,   to: 35200,   rate: 0.15   },
      { from: 35200,   to: 60000,   rate: 0.19   },
      { from: 60000,   to: 90000,   rate: 0.225  },
      { from: 90000,   to: 300000,  rate: 0.24   },
      { from: 300000,  to: Infinity, rate: 0.25  },
    ],
  },

  castilla_la_mancha: {
    isForal: false,
    brackets: [
      { from: 0,       to: 12450,   rate: 0.095  },
      { from: 12450,   to: 20200,   rate: 0.12   },
      { from: 20200,   to: 35200,   rate: 0.15   },
      { from: 35200,   to: 60000,   rate: 0.185  },
      { from: 60000,   to: 300000,  rate: 0.225  },
      { from: 300000,  to: Infinity, rate: 0.245 },
    ],
  },

  castilla_leon: {
    isForal: false,
    brackets: [
      { from: 0,       to: 12450,   rate: 0.095  },
      { from: 12450,   to: 20200,   rate: 0.12   },
      { from: 20200,   to: 35200,   rate: 0.15   },
      { from: 35200,   to: 60000,   rate: 0.185  },
      { from: 60000,   to: 300000,  rate: 0.225  },
      { from: 300000,  to: Infinity, rate: 0.245 },
    ],
  },

  extremadura: {
    isForal: false,
    brackets: [
      { from: 0,       to: 12450,   rate: 0.10   },
      { from: 12450,   to: 20200,   rate: 0.12   },
      { from: 20200,   to: 35200,   rate: 0.155  },
      { from: 35200,   to: 60000,   rate: 0.20   },
      { from: 60000,   to: 150000,  rate: 0.225  },
      { from: 150000,  to: 300000,  rate: 0.25   },
      { from: 300000,  to: Infinity, rate: 0.245 },
    ],
  },

  la_rioja: {
    isForal: false,
    brackets: [
      { from: 0,       to: 12450,   rate: 0.095  },
      { from: 12450,   to: 20200,   rate: 0.12   },
      { from: 20200,   to: 35200,   rate: 0.15   },
      { from: 35200,   to: 60000,   rate: 0.185  },
      { from: 60000,   to: 300000,  rate: 0.225  },
      { from: 300000,  to: Infinity, rate: 0.245 },
    ],
  },

  murcia: {
    isForal: false,
    brackets: [
      { from: 0,       to: 12450,   rate: 0.095  },
      { from: 12450,   to: 20200,   rate: 0.12   },
      { from: 20200,   to: 35200,   rate: 0.15   },
      { from: 35200,   to: 60000,   rate: 0.19   },
      { from: 60000,   to: 300000,  rate: 0.225  },
      { from: 300000,  to: Infinity, rate: 0.245 },
    ],
  },

  // ── Régimen foral ─────────────────────────────────────────────────────────
  // isForal: true → tipo combinado; NO se aplica escala estatal por separado

  pais_vasco: {
    isForal: true,
    brackets: [
      { from: 0,      to: 14444,   rate: 0.23   },
      { from: 14444,  to: 24444,   rate: 0.28   },
      { from: 24444,  to: 34444,   rate: 0.35   },
      { from: 34444,  to: 58444,   rate: 0.40   },
      { from: 58444,  to: 80000,   rate: 0.45   },
      { from: 80000,  to: Infinity, rate: 0.49  },
    ],
  },

  navarra: {
    isForal: true,
    brackets: [
      { from: 0,       to: 12450,   rate: 0.13   },
      { from: 12450,   to: 20200,   rate: 0.19   },
      { from: 20200,   to: 35200,   rate: 0.24   },
      { from: 35200,   to: 60000,   rate: 0.30   },
      { from: 60000,   to: 80000,   rate: 0.36   },
      { from: 80000,   to: 300000,  rate: 0.40   },
      { from: 300000,  to: Infinity, rate: 0.45  },
    ],
  },

  // ── Ciudades autónomas (tipo combinado ya aplicando bonificación 50%) ─────

  ceuta: {
    isForal: true, // tratamos como combinado para simplificar
    brackets: [
      { from: 0,       to: 12450,   rate: 0.075  },
      { from: 12450,   to: 20200,   rate: 0.09   },
      { from: 20200,   to: 35200,   rate: 0.115  },
      { from: 35200,   to: 60000,   rate: 0.145  },
      { from: 60000,   to: 300000,  rate: 0.175  },
      { from: 300000,  to: Infinity, rate: 0.195 },
    ],
  },

  melilla: {
    isForal: true,
    brackets: [
      { from: 0,       to: 12450,   rate: 0.075  },
      { from: 12450,   to: 20200,   rate: 0.09   },
      { from: 20200,   to: 35200,   rate: 0.115  },
      { from: 35200,   to: 60000,   rate: 0.145  },
      { from: 60000,   to: 300000,  rate: 0.175  },
      { from: 300000,  to: Infinity, rate: 0.195 },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Aplica una escala progresiva de tramos y devuelve la cuota resultante.
 */
function applyBrackets(base: number, brackets: Bracket[]): number {
  if (base <= 0) return 0;
  let tax = 0;
  for (const { from, to, rate } of brackets) {
    if (base <= from) break;
    tax += (Math.min(base, to) - from) * rate;
  }
  return tax;
}

/**
 * Devuelve el tipo marginal (rate del último tramo que toca la base).
 */
function getMarginalRate(base: number, brackets: Bracket[]): number {
  if (base <= 0) return brackets[0]?.rate ?? 0;
  let marginal = brackets[0]?.rate ?? 0;
  for (const { from, rate } of brackets) {
    if (base > from) marginal = rate;
    else break;
  }
  return marginal;
}

/**
 * Reducción por rendimientos del trabajo (Art. 20 LIRPF).
 * Redacción vigente por Ley 22/2021 (PGE 2022), aplicable 2026:
 *   – rn ≤ 14.047,50 €  →  6.498 €
 *   – 14.047,50 < rn ≤ 19.747,50 €  →  6.498 − 1,14 × (rn − 14.047,50)
 *   – rn > 19.747,50 €  →  0
 * El coeficiente 1,14 hace que la reducción llegue exactamente a 0 en 19.747,50 €.
 */
function calcReduccionArt20(rn: number): number {
  if (rn <= 14047.5) return 6498;
  if (rn <= 19747.5) return Math.max(0, 6498 - 1.14 * (rn - 14047.5));
  return 0;
}

/**
 * Mínimo personal por edad (Art. 57 LIRPF).
 */
function calcMinimoPersonal(age: number): number {
  if (age > 75) return 8100;
  if (age >= 65) return 6700;
  return 5550;
}

/**
 * Mínimo por descendientes (Art. 58 LIRPF).
 * numChildren: total hijos menores de 25 años (o discapacitados de cualquier edad).
 * childrenUnder3: cuántos de esos hijos tienen menos de 3 años.
 */
function calcMinimoFamiliar(
  numChildren: number,
  childrenUnder3: number,
  situation: FamilySituation,
  spouseWithoutIncome: boolean
): number {
  let minimo = 0;

  // Descendientes (acumulativo por orden)
  const childBonuses = [2400, 2700, 4000]; // 1er, 2do, 3er+
  for (let i = 0; i < numChildren; i++) {
    if (i < 2) {
      minimo += childBonuses[i];
    } else {
      minimo += childBonuses[2]; // 4.000 € por cada hijo a partir del 3º
    }
  }

  // Bonus hijos < 3 años: +2.800 € adicionales por cada uno
  const under3 = Math.min(childrenUnder3, numChildren);
  minimo += under3 * 2800;

  // Cónyuge sin ingresos (Art. 59)
  if (situation === "casado" && spouseWithoutIncome) {
    minimo += 3400;
  }

  return minimo;
}

/**
 * Gastos deducibles Art. 19 LIRPF.
 */
function calcGastosDeducibles(
  annualSS: number,
  disability: Disability,
  geographicMobility: boolean
): number {
  // La SS del empleado también es gasto deducible en el IRPF, pero el
  // algoritmo de retención AEAT la trata aparte. Aquí usamos los gastos
  // genéricos del Art. 19 (2.000 € base + extras).
  let gastos = 2000;

  if (geographicMobility) gastos += 2000; // movilidad geográfica: total 4.000

  // Discapacidad
  if (disability === "33-65") gastos += 3500;
  else if (disability === "65plus") gastos += 7750;
  else if (disability === "65plus-mobility") gastos += 7750;

  // Suprimimos el parámetro annualSS del cómputo de gastos deducibles
  // porque en retenciones la SS ya se descuenta antes de la base IRPF.
  void annualSS;

  return gastos;
}

// ─── Core computation ─────────────────────────────────────────────────────────

export function computeCalc(input: CalcInput): CalcResult {
  const {
    annualGross,
    contractType,
    familySituation,
    numChildren,
    childrenUnder3,
    spouseWithoutIncome,
    age,
    comunidad,
    numPayments,
    disability,
    geographicMobility,
  } = input;

  // ── 1. Seguridad Social empleado ───────────────────────────────────────────
  const cotizacionBase = Math.min(annualGross, MAX_SS_BASE);

  const desempleoRate =
    contractType === "indefinido"
      ? SS_EMPLEADO.desempleoIndefinido
      : SS_EMPLEADO.desempleoTemporal;

  const ssContingencias = cotizacionBase * SS_EMPLEADO.contingencias;
  const ssDesempleo     = cotizacionBase * desempleoRate;
  const ssFP            = cotizacionBase * SS_EMPLEADO.fp;
  const ssMEI           = cotizacionBase * SS_EMPLEADO.mei;
  const annualSS        = ssContingencias + ssDesempleo + ssFP + ssMEI;

  const totalSsRate =
    SS_EMPLEADO.contingencias + desempleoRate + SS_EMPLEADO.fp + SS_EMPLEADO.mei;
  const ssRate = totalSsRate * 100; // % sobre base (= % sobre bruto si bruto < max)

  // ── 2. Gastos deducibles (Art. 19) ─────────────────────────────────────────
  const gastosDeducibles = calcGastosDeducibles(annualSS, disability, geographicMobility);

  // ── 3. Rendimiento neto trabajo ────────────────────────────────────────────
  // rn = bruto - SS empleado - gastos deducibles
  const rendimientoNeto = Math.max(0, annualGross - annualSS - gastosDeducibles);

  // ── 4. Reducción Art. 20 ───────────────────────────────────────────────────
  const reduccionArt20 = calcReduccionArt20(rendimientoNeto);
  const rendimientoNetoReducido = Math.max(0, rendimientoNeto - reduccionArt20);

  // ── 5. Mínimos ─────────────────────────────────────────────────────────────
  const minimoPersonal = calcMinimoPersonal(age);
  const minimoFamiliar = calcMinimoFamiliar(
    numChildren,
    childrenUnder3,
    familySituation,
    spouseWithoutIncome
  );
  const minimoTotal = minimoPersonal + minimoFamiliar;

  // ── 6. Base de retención ───────────────────────────────────────────────────
  const baseRetencion = rendimientoNetoReducido;

  // ── 7. Cuotas IRPF ─────────────────────────────────────────────────────────
  const ccaaConfig = CCAA_CONFIG[comunidad];
  if (!ccaaConfig) {
    throw new Error(`[computeCalc] Comunidad autónoma desconocida: "${comunidad}". Valores válidos: ${Object.keys(CCAA_CONFIG).join(", ")}`);
  }

  let annualIRPF = 0;
  let irpfEstatual = 0;
  let irpfAutonomica = 0;
  let irpfMarginal = 0;

  if (ccaaConfig.isForal) {
    // Foral: tramos combinados, no hay separación estatal/autonómica
    const cuotaBase   = applyBrackets(baseRetencion, ccaaConfig.brackets);
    const cuotaMinimo = applyBrackets(minimoTotal, ccaaConfig.brackets);
    const cuotaNeta   = Math.max(0, cuotaBase - cuotaMinimo);

    // Repartimos orientativamente 50/50 para mostrar en UI (solo informativo)
    irpfEstatual   = cuotaNeta * 0.5;
    irpfAutonomica = cuotaNeta * 0.5;

    const rawRate   = cuotaNeta / Math.max(annualGross, 1);
    const truncated = Math.floor(rawRate * 10000) / 10000;
    annualIRPF      = annualGross * truncated;

    irpfMarginal = getMarginalRate(baseRetencion, ccaaConfig.brackets) * 100;
  } else {
    // Régimen común: cuota estatal + cuota autonómica
    const cuotaEstatualBase   = applyBrackets(baseRetencion, ESTATAL_BRACKETS);
    const cuotaEstatualMinimo = applyBrackets(minimoTotal, ESTATAL_BRACKETS);
    const cuotaEstatualNeta   = Math.max(0, cuotaEstatualBase - cuotaEstatualMinimo);

    const cuotaAutoBase   = applyBrackets(baseRetencion, ccaaConfig.brackets);
    const cuotaAutoMinimo = applyBrackets(minimoTotal, ccaaConfig.brackets);
    const cuotaAutoNeta   = Math.max(0, cuotaAutoBase - cuotaAutoMinimo);

    irpfEstatual   = cuotaEstatualNeta;
    irpfAutonomica = cuotaAutoNeta;

    const cuotaNeta = cuotaEstatualNeta + cuotaAutoNeta;
    const rawRate   = cuotaNeta / Math.max(annualGross, 1);
    const truncated = Math.floor(rawRate * 10000) / 10000;
    annualIRPF      = annualGross * truncated;

    // Tipo marginal combinado = rate estatal + rate autonómica del tramo actual
    const estatualMarginal = getMarginalRate(baseRetencion, ESTATAL_BRACKETS);
    const autoMarginal     = getMarginalRate(baseRetencion, ccaaConfig.brackets);
    irpfMarginal = (estatualMarginal + autoMarginal) * 100;
  }

  const irpfEfectivo = annualGross > 0 ? (annualIRPF / annualGross) * 100 : 0;

  // ── 8. Neto ────────────────────────────────────────────────────────────────
  const annualNet     = annualGross - annualSS - annualIRPF;
  const monthlyNet    = annualNet / 12;
  const netPerPayment = annualNet / numPayments;
  const netPercent    = annualGross > 0 ? (annualNet / annualGross) * 100 : 0;

  // ── 9. Coste empresa ───────────────────────────────────────────────────────
  const employerSSRate = contractType === "indefinido"
    ? SS_EMPRESA.indefinido
    : SS_EMPRESA.temporal;
  const employerSS        = cotizacionBase * employerSSRate;
  const totalEmployerCost = annualGross + employerSS;

  return {
    annualGross,
    monthlyGross:          annualGross / 12,
    cotizacionBase,
    ssContingencias,
    ssDesempleo,
    ssFP,
    ssMEI,
    annualSS,
    monthlySS:             annualSS / 12,
    ssRate,
    gastosDeducibles,
    rendimientoNeto,
    reduccionArt20,
    rendimientoNetoReducido,
    minimoPersonal,
    minimoFamiliar,
    minimoTotal,
    baseRetencion,
    irpfEstatual,
    irpfAutonomica,
    annualIRPF,
    monthlyIRPF:           annualIRPF / 12,
    irpfEfectivo,
    irpfMarginal,
    annualNet,
    monthlyNet,
    netPerPayment,
    netPercent,
    employerSS,
    totalEmployerCost,
  };
}

// ─── Neto → Bruto (binary search) ─────────────────────────────────────────────

export function computeNetToGrossCalc(
  targetAnnualNet: number,
  options: Omit<CalcInput, "annualGross">
): CalcResult {
  if (targetAnnualNet <= 0) {
    return computeCalc({ annualGross: 0, ...options });
  }

  let lo = targetAnnualNet * 0.9;
  let hi = targetAnnualNet * 2.5;

  // Expand upper bound until guaranteed to be above target
  for (let i = 0; i < 25; i++) {
    if (computeCalc({ annualGross: hi, ...options }).annualNet >= targetAnnualNet) break;
    hi *= 2;
  }

  // Binary search — 60 iterations → precision < 0.01 €
  for (let i = 0; i < 60; i++) {
    const mid    = (lo + hi) / 2;
    const result = computeCalc({ annualGross: mid, ...options });
    if (Math.abs(result.annualNet - targetAnnualNet) < 0.01) return result;
    if (result.annualNet < targetAnnualNet) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return computeCalc({ annualGross: (lo + hi) / 2, ...options });
}

// ─── (tax.ts es legacy; no se re-exporta desde aquí) ─────────────────────────
