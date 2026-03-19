"use client";

import { useState } from "react";
import { SALARIO_DATA, fmt } from "@/lib/salario-data";

const d30 = SALARIO_DATA["30000"];
const d30cat = d30.ccaaTable.find((r) => r.ccaa === "Cataluña")!;
const difMadCat = d30.netoMensual - d30cat.neto;

const FAQ_ITEMS = [
  {
    q: "¿Cuánto me queda neto de 30.000€ brutos?",
    a: `Con 30.000€ brutos anuales en Madrid, soltero/a y sin hijos, cobras aproximadamente ${fmt(d30.netoMensual)}€ netos al mes (${fmt(d30.netoAnual)}€ netos al año). De tu salario bruto se descuentan ${fmt(d30.ssEuros)}€ de cotización a la Seguridad Social (6,50%) y ${fmt(d30.irpfEuros)}€ de retención IRPF (tipo efectivo ${d30.irpfEf}%). El resultado varía según tu comunidad autónoma y situación familiar.`,
  },
  {
    q: "¿Cómo afecta tener hijos al IRPF?",
    a: "Tener hijos reduce la base imponible del IRPF gracias a los mínimos familiares. Con un hijo menor de 25 años, el mínimo por descendiente es de 2.400€; con dos hijos, 2.700€ por el segundo. En la práctica, esto supone entre 20€ y 70€ más al mes en el salario neto dependiendo del nivel salarial. Puedes calcularlo exactamente seleccionando tu número de hijos en la calculadora de arriba.",
  },
  {
    q: "¿El cálculo de nómina es el mismo en toda España?",
    a: `No. La cotización a la Seguridad Social (6,50%) sí es igual en todo el territorio. Sin embargo, el IRPF tiene una parte estatal y una parte autonómica, y cada comunidad fija sus propios tramos. Madrid tiene los tipos autonómicos más bajos del régimen común, mientras que Cataluña o Valencia aplican tipos más altos. La diferencia es de ${fmt(difMadCat)}€ al mes para un salario de 30.000€.`,
  },
  {
    q: "¿Qué diferencia hay entre cobrar en 12 o 14 pagas?",
    a: "La paga bruta anual es la misma, pero el IRPF retenido cambia. Con 14 pagas, dos mensualidades adicionales (habitualmente en julio y diciembre) se cobran en meses concretos, lo que puede alterar el tipo de retención que aplica la empresa. El neto anual total es prácticamente idéntico; la diferencia está en cómo se distribuye a lo largo del año. Puedes comparar ambas opciones directamente en la calculadora.",
  },
  {
    q: "¿Cuánto le cuesta un empleado a la empresa?",
    a: `Además del salario bruto, la empresa paga sus propias cotizaciones a la Seguridad Social: contingencias comunes (23,60%), desempleo (5,50%), FOGASA (0,20%) y Formación Profesional (0,60%), lo que supone alrededor de un 30,48% adicional sobre el bruto. Para un empleado con 30.000€ brutos, el coste total para la empresa es de aproximadamente ${fmt(d30.costeEmpresa)}€ al año.`,
  },
];

export default function SeoFaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="rounded-xl overflow-hidden transition-colors duration-200"
            style={{
              background: isOpen ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${isOpen ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`seo-faq-${i}`}
              className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
              style={{ minHeight: 52 }}
            >
              <span
                className="text-sm font-medium leading-snug"
                style={{ color: isOpen ? "#d0d0f0" : "#b0b0d0" }}
              >
                {item.q}
              </span>
              <span
                className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all duration-200"
                aria-hidden="true"
                style={{
                  background: isOpen ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)",
                  color: isOpen ? "#a5b4fc" : "#5a5a80",
                  border: `1px solid ${isOpen ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>

            <div
              id={`seo-faq-${i}`}
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
            >
              <div className="px-5 pb-5">
                <div className="h-px mb-4" style={{ background: "rgba(99,102,241,0.15)" }} />
                <p className="text-sm leading-relaxed" style={{ color: "#9090b8" }}>
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
