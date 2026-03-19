/**
 * scripts/validate-consistency.ts
 * Validación exhaustiva: computeCalc() === SALARIO_DATA === landing metadata
 * Ejecutar con: npx tsx scripts/validate-consistency.ts
 */

import { computeCalc, type CalcInput } from "../lib/calculator";
import { SALARIO_DATA } from "../lib/salario-data";

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

function fi(n: number): string {
  return n.toFixed(1).replace(".", ",");
}
function fmt(n: number): string {
  return n.toLocaleString("es-ES");
}

// ─── Test salaries ────────────────────────────────────────────────────────────

const TEST_SALARIES = [15000, 20000, 30000, 36000, 40000, 50000, 100000];

let allPassed = true;
const results: string[] = [];

console.log("\n══════════════════════════════════════════════════════════════");
console.log("  FASE 1 — PRUEBA DE RESULTADOS REALES");
console.log("══════════════════════════════════════════════════════════════\n");

console.log("Bruto    │ Campo       │ computeCalc() │ SALARIO_DATA  │ Match");
console.log("─────────┼─────────────┼───────────────┼───────────────┼──────");

for (const bruto of TEST_SALARIES) {
  const r = computeCalc({ annualGross: bruto, ...CANONICAL });
  const d = SALARIO_DATA[String(bruto)];

  const computed = {
    netoMensual: Math.round(r.monthlyNet),
    netoAnual:   Math.round(r.annualNet),
    irpfEuros:   Math.round(r.annualIRPF),
    ssEuros:     Math.round(r.annualSS),
    irpfEf:      fi(r.irpfEfectivo),
  };

  if (!d) {
    // 36000 no existe en SALARIO_DATA — solo para referencia interna del calculator
    console.log(`${String(bruto).padEnd(8)} │ (no en DATA) │ netoMensual=${computed.netoMensual} irpf%=${computed.irpfEf}`);
    continue;
  }

  const checks: Array<{ campo: string; calc: string | number; data: string | number; ok: boolean }> = [
    { campo: "netoMensual", calc: computed.netoMensual, data: d.netoMensual, ok: computed.netoMensual === d.netoMensual },
    { campo: "netoAnual",   calc: computed.netoAnual,   data: d.netoAnual,   ok: computed.netoAnual   === d.netoAnual   },
    { campo: "irpfEuros",   calc: computed.irpfEuros,   data: d.irpfEuros,   ok: computed.irpfEuros   === d.irpfEuros   },
    { campo: "ssEuros",     calc: computed.ssEuros,     data: d.ssEuros,     ok: computed.ssEuros     === d.ssEuros     },
    { campo: "irpfEf",      calc: computed.irpfEf,      data: d.irpfEf,      ok: computed.irpfEf      === d.irpfEf      },
  ];

  let first = true;
  for (const c of checks) {
    if (!c.ok) allPassed = false;
    const match = c.ok ? "✓ OK" : "✗ FAIL";
    const prefix = first ? String(bruto).padEnd(8) : "        ";
    console.log(`${prefix} │ ${c.campo.padEnd(11)} │ ${String(c.calc).padEnd(13)} │ ${String(c.data).padEnd(13)} │ ${match}`);
    first = false;
  }
  console.log("─────────┼─────────────┼───────────────┼───────────────┼──────");

  results.push(
    `${bruto}: neto=${computed.netoMensual}€/mes irpf%=${computed.irpfEf} irpf€=${computed.irpfEuros} ss€=${computed.ssEuros} neto/año=${computed.netoAnual}`
  );
}

// ─── FASE 1 extra: 36000 (comentario en calculator.ts verifica ~2289€) ────────

console.log("\n── Referencia 36.000€ (verificación interna calculator.ts) ──");
const r36 = computeCalc({ annualGross: 36000, ...CANONICAL });
console.log(`  36.000€ → netoMensual=${Math.round(r36.monthlyNet)} (esperado ≈ 2289) ${Math.round(r36.monthlyNet) === 2289 ? "✓" : "✗ FALLA"}`);
console.log(`           irpfEf=${fi(r36.irpfEfectivo)}% anuIRPF=${Math.round(r36.annualIRPF)}€`);

// ─── FASE 2 — METADATA SIMULADA ───────────────────────────────────────────────

console.log("\n══════════════════════════════════════════════════════════════");
console.log("  FASE 2 — METADATA DE LANDING PAGES");
console.log("══════════════════════════════════════════════════════════════\n");

const metaSlugsList = ["30000", "15000", "100000"];
for (const slug of metaSlugsList) {
  const d = SALARIO_DATA[slug];
  const neto = d.netoMensual.toLocaleString("es-ES");
  const title = `¿Cuánto es ${d.brutoLabel}€ Brutos en Neto? → ${neto}€/mes en 2026`;
  const desc  = `Con ${d.brutoLabel}€ brutos anuales cobras ${neto}€ netos al mes en Madrid (2026). Calcula tu neto exacto por comunidad autónoma y situación familiar. IRPF ${d.irpfEf}% · SS 6,5%.`;
  const ogTitle = title;
  const ogDesc  = `Con ${d.brutoLabel}€ brutos cobras ${neto}€ netos/mes en Madrid. Compara por CCAA y situación familiar.`;

  console.log(`  Página: /cuanto-es-${slug}-euros-brutos-neto`);
  console.log(`  title:       ${title}`);
  console.log(`  description: ${desc}`);
  console.log(`  og:title:    ${ogTitle}`);
  console.log(`  og:desc:     ${ogDesc}`);
  console.log(`  Fuente:      SALARIO_DATA["${slug}"].netoMensual=${d.netoMensual} (computeCalc=${Math.round(computeCalc({annualGross:Number(slug),...CANONICAL}).monthlyNet)})`);
  const metaOk = d.netoMensual === Math.round(computeCalc({ annualGross: Number(slug), ...CANONICAL }).monthlyNet);
  console.log(`  Match:       ${metaOk ? "✓ COHERENTE" : "✗ FALLA"}\n`);
  if (!metaOk) allPassed = false;
}

// ─── FASE 4 — tax.ts isolation ────────────────────────────────────────────────

console.log("══════════════════════════════════════════════════════════════");
console.log("  FASE 4 — AISLAMIENTO DE tax.ts");
console.log("══════════════════════════════════════════════════════════════\n");

// Attempt to import computeTax from calculator (should no longer be exported)
// We do this by checking the calculator module's exports
import * as calcModule from "../lib/calculator";
const calcExports = Object.keys(calcModule);
const hasComputeTax = calcExports.includes("computeTax");
const hasComputeNetToGross = calcExports.includes("computeNetToGross");
const hasTaxInput = calcExports.includes("TaxInput"); // type — won't appear at runtime

console.log(`  calculator.ts exports: ${calcExports.join(", ")}`);
console.log(`  computeTax re-exported:       ${hasComputeTax ? "✗ SÍ (peligro)" : "✓ NO (correcto)"}`);
console.log(`  computeNetToGross re-exported:${hasComputeNetToGross ? "✗ SÍ (peligro)" : "✓ NO (correcto)"}`);
if (hasComputeTax || hasComputeNetToGross) allPassed = false;

// ─── FASE 5 — TESTS CONCRETOS ─────────────────────────────────────────────────

console.log("\n══════════════════════════════════════════════════════════════");
console.log("  FASE 5 — SUITE DE TESTS DE CONSISTENCIA");
console.log("══════════════════════════════════════════════════════════════\n");

let passed = 0;
let failed = 0;

function test(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (ok) passed++;
  else { failed++; allPassed = false; }
  const status = ok ? "✓ PASS" : "✗ FAIL";
  console.log(`  ${status} │ ${name}`);
  if (!ok) console.log(`          expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(actual)}`);
}

// Test 1: 36.000€ verifica el comentario del archivo
const r36t = computeCalc({ annualGross: 36000, ...CANONICAL });
test("36.000€ → netoMensual ≈ 2289", Math.round(r36t.monthlyNet), 2289);

// Test 2-6: SALARIO_DATA coincide con computeCalc para todos los salarios
for (const slug of Object.keys(SALARIO_DATA)) {
  const d = SALARIO_DATA[slug];
  const r = computeCalc({ annualGross: d.bruto, ...CANONICAL });
  test(`SALARIO_DATA["${slug}"].netoMensual === computeCalc`, d.netoMensual, Math.round(r.monthlyNet));
  test(`SALARIO_DATA["${slug}"].irpfEf === computeCalc`, d.irpfEf, fi(r.irpfEfectivo));
  test(`SALARIO_DATA["${slug}"].ssEuros === computeCalc`, d.ssEuros, Math.round(r.annualSS));
  test(`SALARIO_DATA["${slug}"].irpfEuros === computeCalc`, d.irpfEuros, Math.round(r.annualIRPF));
  test(`SALARIO_DATA["${slug}"].netoAnual === computeCalc`, d.netoAnual, Math.round(r.annualNet));
  test(`SALARIO_DATA["${slug}"].costeEmpresa === computeCalc`, d.costeEmpresa, Math.round(r.totalEmployerCost));
}

// Test: ccaaTable Madrid para 30k === computeCalc(30k, madrid)
const d30 = SALARIO_DATA["30000"];
const r30mad = computeCalc({ annualGross: 30000, ...CANONICAL, comunidad: "madrid" });
const d30madrid = d30.ccaaTable.find(r => r.ccaa === "Comunidad de Madrid")!;
test("SALARIO_DATA[30000].ccaaTable[Madrid].neto === computeCalc(30k,madrid)", d30madrid?.neto, Math.round(r30mad.monthlyNet));

// Test: ccaaTable Cataluña para 30k
const r30cat = computeCalc({ annualGross: 30000, ...CANONICAL, comunidad: "cataluna" });
const d30cat = d30.ccaaTable.find(r => r.ccaa === "Cataluña")!;
test("SALARIO_DATA[30000].ccaaTable[Cataluña].neto === computeCalc(30k,cataluna)", d30cat?.neto, Math.round(r30cat.monthlyNet));

// Test: familyTable con 1 hijo para 30k
const r30h1 = computeCalc({ annualGross: 30000, ...CANONICAL, numChildren: 1 });
const extra1 = Math.round(r30h1.monthlyNet) - Math.round(r30mad.monthlyNet);
const d30ft1 = d30.familyTable.find(r => r.label === "Con 1 hijo")!;
test("SALARIO_DATA[30000].familyTable['1 hijo'].extra === computeCalc diff", d30ft1?.extra, extra1);

// Test: computeTax NO existe en calculator exports (aislamiento tax.ts)
test("calculator.ts NO re-exporta computeTax", (calcModule as Record<string, unknown>)["computeTax"], undefined);
test("calculator.ts NO re-exporta computeNetToGross", (calcModule as Record<string, unknown>)["computeNetToGross"], undefined);

console.log(`\n  ────────────────────────────────────────`);
console.log(`  RESULTADO: ${passed} passed · ${failed} failed`);

// ─── VEREDICTO FINAL ──────────────────────────────────────────────────────────

console.log("\n══════════════════════════════════════════════════════════════");
console.log(`  VEREDICTO: ${allPassed ? "✓ CERRADO — todas las fases pasan" : "✗ NO CERRADO — ver fallos arriba"}`);
console.log("══════════════════════════════════════════════════════════════\n");

process.exit(allPassed ? 0 : 1);
