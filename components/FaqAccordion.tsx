"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "¿Son exactos los cálculos de la calculadora?",
    a: "Los cálculos son muy precisos para la situación general: aplican los tramos del IRPF 2026 (estatales y autonómicos), las cotizaciones a la Seguridad Social y los mínimos personales y familiares según la normativa AEAT. Pueden diferir ligeramente de tu nómina real si tienes deducciones específicas, retribución en especie, rentas de otros tipos o situaciones especiales no contempladas (expatriados, pluriempleo, etc.).",
  },
  {
    q: "¿Qué diferencia hay entre salario bruto y neto?",
    a: "El salario bruto es lo que figura en tu contrato antes de cualquier descuento. El salario neto es lo que recibes en cuenta después de que tu empresa haya retenido las cotizaciones a la Seguridad Social (≈ 6,50 % del bruto) y la retención del IRPF (variable según tu salario, CCAA y situación personal). La diferencia puede suponer entre el 15 % y el 35 % del bruto dependiendo de tu situación.",
  },
  {
    q: "¿Por qué mi nómina real es diferente al resultado?",
    a: "Hay varias razones habituales: (1) Retribución en especie no incluida (seguro médico, coche de empresa, tickets). (2) Complementos variables como horas extra, bonus o comisiones. (3) Deducciones autonómicas específicas que la calculadora no aplica automáticamente. (4) Tu empresa puede haber calculado la retención de forma diferente basándose en el Modelo 145 que entregaste. (5) Situaciones especiales como pluriempleo o rentas adicionales.",
  },
  {
    q: "¿Cómo afecta la comunidad autónoma al IRPF?",
    a: "El IRPF se divide en dos mitades: el gravamen estatal (igual para todos en España) y el gravamen autonómico (cada CCAA fija sus propios tramos y tipos). Madrid tiene tipos autonómicos de los más bajos (desde el 9 %), mientras que Cataluña o Asturias tienen tipos más elevados. La diferencia puede suponer hasta 1.500–2.000 € anuales para salarios medios-altos entre las comunidades con mayor y menor presión fiscal.",
  },
  {
    q: "¿Qué es el MEI (Mecanismo de Equidad Intergeneracional)?",
    a: "El MEI es una cotización adicional a la Seguridad Social introducida en 2023 para fortalecer el fondo de reserva de pensiones ante el envejecimiento de la población. En 2026, el trabajador aporta un 0,15 % de su base de cotización y la empresa un 0,58 %. No genera derechos adicionales para el trabajador — va íntegramente al fondo de reserva. Está previsto que el tipo vaya aumentando gradualmente hasta 2032.",
  },
  {
    q: "¿Qué son las 14 pagas y cómo afectan al cálculo?",
    a: "Muchos convenios colectivos establecen 14 pagas: 12 mensualidades más dos pagas extraordinarias (habitualmente en junio y diciembre). El neto anual total es exactamente el mismo que con 12 pagas, pero distribuido de forma diferente. Con 14 pagas, las mensualidades son menores porque las extras se pagan por separado. La retención del IRPF también se recalcula en ambos casos para que el impacto fiscal sea equivalente.",
  },
  {
    q: "¿Por qué varía el IRPF según mi situación familiar?",
    a: "El IRPF aplica mínimos personales y familiares: cantidades de renta que tributan a tipo cero porque se consideran necesarias para las necesidades vitales. Tener hijos añade un mínimo de 2.400 € por el primero, 2.700 € por el segundo, etc. Los hijos menores de 3 años suman 2.800 € más. Un cónyuge sin ingresos añade 3.400 €. Estos mínimos reducen la base imponible y, por tanto, el IRPF que pagas.",
  },
  {
    q: "¿Puedo calcular el bruto que necesito para un neto deseado?",
    a: 'Sí. En la calculadora, cambia el modo a "Neto → Bruto" usando el toggle en la parte superior. Introduce el neto mensual o anual que quieres cobrar y la calculadora te dirá exactamente cuánto bruto necesitas negociar con tu empresa. El cálculo inverso usa búsqueda binaria con 60 iteraciones para garantizar una precisión inferior a 1 céntimo.',
  },
  {
    q: "¿Con qué frecuencia se actualizan los datos?",
    a: "Los datos se actualizan cuando la AEAT publica las nuevas tablas de retenciones, habitualmente una vez al año con los Presupuestos Generales del Estado o mediante Real Decreto. La calculadora está actualizada con la normativa AEAT para el ejercicio 2026. Puedes consultar la metodología completa y las fuentes en la página «Cómo calculamos».",
  },
  {
    q: "¿Qué es el coste empresa y para qué sirve?",
    a: "El coste empresa es lo que le cuesta a tu empleador tenerte contratado. Incluye tu salario bruto más las cotizaciones patronales a la Seguridad Social (aproximadamente un 30,48 % adicional sobre el bruto para contratos indefinidos: contingencias comunes 23,60 %, desempleo 5,50 %, formación 0,60 %, FOGASA 0,20 %, MEI 0,58 %). Es útil para entender el coste real de una contratación o para negociar tu salario conociendo el margen de la empresa.",
  },
  {
    q: "¿La calculadora incluye deducciones autonómicas?",
    a: "No. La calculadora aplica los tramos autonómicos del IRPF de cada comunidad, pero no incluye las deducciones autonómicas específicas (por nacimiento, alquiler, rehabilitación de vivienda, etc.) porque varían mucho entre CCAA y dependen de circunstancias individuales. Tampoco incluye la deducción estatal por maternidad (1.200 €/año por hijo menor de 3 años aplicable directamente sobre la cuota). Para estos casos, consulta con un asesor fiscal.",
  },
  {
    q: "¿Cómo puedo contactar si encuentro un error?",
    a: "Escríbenos a contact.acebolla@gmail.com indicando el salario bruto, la CCAA, la situación familiar y el resultado que obtuviste frente al que esperabas. Intentamos responder en 48–72 horas. Si detectas una discrepancia con tu nómina real, adjunta también los datos de tu hoja de salario (puedes anonimizarla) para que podamos identificar la causa.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="rounded-xl overflow-hidden transition-colors"
            style={{
              background: isOpen ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${isOpen ? "rgba(99,102,241,0.28)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-start justify-between gap-4 text-left px-5 py-4"
            >
              <span
                className="text-sm font-medium leading-snug"
                style={{ color: isOpen ? "#d0d0f0" : "#c0c0d8" }}
              >
                {faq.q}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="shrink-0 mt-0.5"
                style={{
                  color: "#818cf8",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                <path d="M3 5l5 5 5-5" />
              </svg>
            </button>

            {isOpen && (
              <div className="px-5 pb-5">
                <div
                  className="h-px mb-4"
                  style={{ background: "rgba(99,102,241,0.15)" }}
                />
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#a0a0c0" }}
                >
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
