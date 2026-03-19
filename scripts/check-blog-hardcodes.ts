/**
 * scripts/check-blog-hardcodes.ts
 * Detecta cifras salariales exactas en content/blog/*.mdx que no coinciden
 * con los valores canónicos de computeCalc().
 *
 * Ejecutar con: npx tsx scripts/check-blog-hardcodes.ts
 *
 * REGLA: Las únicas cifras de neto permitidas en el blog son las que produce
 * computeCalc() con los parámetros canónicos (Madrid · soltero · indefinido ·
 * 12 pagas · 35 años). Cualquier otra cifra exacta de neto mensual es sospechosa
 * y debe revisarse o sustituirse por una aproximación con "≈".
 */

import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { computeCalc, type CalcInput } from "../lib/calculator";

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

// ─── Valores canónicos conocidos (neto mensual Madrid) ───────────────────────

const SALARIES = [
  15000, 16000, 18000, 20000, 22000, 24000, 25000,
  28000, 30000, 32000, 35000, 36000, 40000, 45000,
  50000, 60000, 70000, 80000, 100000,
];

// Build set of valid monthly neto values (rounded)
const VALID_NETO_MENSUAL = new Set<number>(
  SALARIES.map((s) => Math.round(computeCalc({ annualGross: s, ...CANONICAL }).monthlyNet))
);

// Known wrong values that used to appear before the 2026 correction
// Note: 2274 is NOT here — it IS the correct canonical neto for 36.000€
const KNOWN_WRONG_VALUES = [2876, 3414, 1575, 1911, 2510];

// ─── Scan blog files ──────────────────────────────────────────────────────────

const BLOG_DIR = join(process.cwd(), "content/blog");
const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

console.log("\n══════════════════════════════════════════════════════════════");
console.log("  BLOG HARDCODE CHECKER — cifras salariales en content/blog/");
console.log("══════════════════════════════════════════════════════════════\n");

let warnings = 0;

for (const file of files) {
  const content = readFileSync(join(BLOG_DIR, file), "utf-8");
  const lines = content.split("\n");
  const fileWarnings: string[] = [];

  lines.forEach((line, i) => {
    // Skip code blocks and approximate values (≈)
    if (line.trim().startsWith("```") || line.includes("≈")) return;

    // Find patterns like 1.454, 2.274, 1.939, etc. (Spanish number format)
    const matches = line.matchAll(/\b(\d{1,2}\.\d{3})\s*€/g);
    for (const m of matches) {
      const raw = m[1].replace(".", "");
      const num = parseInt(raw, 10);

      // Only flag numbers in plausible neto mensual range (1000–6000)
      if (num < 1000 || num > 6000) continue;

      // Flag if it's a known wrong value
      if (KNOWN_WRONG_VALUES.includes(num)) {
        fileWarnings.push(`  ✗ Línea ${i + 1}: "${m[0]}" — valor incorrecto conocido (old hardcode)`);
        warnings++;
        continue;
      }

      // Warn if the value is NOT in the set of valid canonical values
      // (could be a non-canonical scenario — just a warning, not an error)
      if (!VALID_NETO_MENSUAL.has(num)) {
        fileWarnings.push(`  ⚠ Línea ${i + 1}: "${m[0]}" — cifra no canónica (verifica si es escenario no estándar)`);
        warnings++;
      }
    }
  });

  if (fileWarnings.length > 0) {
    console.log(`📄 ${file}`);
    fileWarnings.forEach((w) => console.log(w));
    console.log();
  }
}

if (warnings === 0) {
  console.log("✓ Sin alertas. Todas las cifras detectadas son canónicas o aproximadas.\n");
} else {
  console.log(`\n⚠ ${warnings} alerta(s) detectada(s). Revisar los valores marcados.\n`);
}

console.log("══════════════════════════════════════════════════════════════\n");
