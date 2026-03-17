export type CcaaRow = { ccaa: string; neto: number; irpf: string };
export type FamilyRow = { label: string; extra: number };

export interface SalarioData {
  bruto: number;                // e.g. 30000
  brutoLabel: string;           // e.g. "30.000"
  slug: string;                 // e.g. "30000"
  netoMensual: number;          // e.g. 2274
  netoAnual: number;            // e.g. 27292
  irpfEf: string;               // e.g. "17,7"
  costeEmpresa: number;         // e.g. 39144
  ssEuros: number;              // e.g. 1950
  irpfEuros: number;            // derived: bruto - ss - netoAnual (0 if negative)
  ccaaTable: CcaaRow[];
  familyTable: FamilyRow[];     // extra neto mensual vs base (soltero sin hijos)
  faq: { q: string; a: string }[];
}

const ALL: SalarioData[] = [
  {
    bruto: 15000,
    brutoLabel: "15.000",
    slug: "15000",
    netoMensual: 1221,
    netoAnual: 14652,
    irpfEf: "3,2",
    costeEmpresa: 19585,
    ssEuros: 975,
    irpfEuros: 480,
    ccaaTable: [
      { ccaa: "Comunidad de Madrid",     neto: 1221, irpf: "3,2 %" },
      { ccaa: "Andalucía",               neto: 1217, irpf: "3,5 %" },
      { ccaa: "Castilla y León",         neto: 1218, irpf: "3,4 %" },
      { ccaa: "Comunitat Valenciana",    neto: 1216, irpf: "3,6 %" },
      { ccaa: "Cataluña",               neto: 1210, irpf: "4,1 %" },
    ],
    familyTable: [
      { label: "Soltero/a sin hijos",                extra: 0 },
      { label: "Con 1 hijo",                         extra: 15 },
      { label: "Con 2 hijos",                        extra: 30 },
      { label: "Casado/a, cónyuge sin ingresos",     extra: 20 },
    ],
    faq: [
      {
        q: "¿Cuánto es 15.000€ brutos en neto al mes?",
        a: "Con 15.000€ brutos anuales cobras aproximadamente 1.221€ netos al mes en Madrid (2026). A este nivel salarial, la retención del IRPF es prácticamente nula gracias a las reducciones por rendimientos del trabajo y el mínimo personal.",
      },
      {
        q: "¿Por qué con 15.000€ brutos casi no se paga IRPF?",
        a: "Para salarios bajos, la reducción por rendimientos del trabajo (hasta 5.565€) y el mínimo personal (5.550€) reducen la base imponible a un importe muy pequeño. Con 15.000€ brutos, la base imponible es mínima y el IRPF efectivo es de apenas el 3,2%.",
      },
      {
        q: "¿Cuánto paga la empresa por un trabajador de 15.000€?",
        a: "El coste total para la empresa es de aproximadamente 19.585€ anuales, que incluye el salario bruto más las cotizaciones patronales a la Seguridad Social (contingencias comunes, desempleo, FOGASA y formación profesional).",
      },
      {
        q: "¿Cuánto varía el neto según la comunidad autónoma con 15.000€?",
        a: "Con 15.000€ brutos, la diferencia entre Madrid (1.221€/mes) y Cataluña (1.210€/mes) es de 11€ al mes. A este nivel salarial, las diferencias autonómicas del IRPF son pequeñas por lo reducido de la base imponible.",
      },
    ],
  },
  {
    bruto: 20000,
    brutoLabel: "20.000",
    slug: "20000",
    netoMensual: 1575,
    netoAnual: 18904,
    irpfEf: "9,8",
    costeEmpresa: 26097,
    ssEuros: 1300,
    irpfEuros: 1096,
    ccaaTable: [
      { ccaa: "Comunidad de Madrid",     neto: 1575, irpf: "9,8 %" },
      { ccaa: "Andalucía",               neto: 1568, irpf: "10,2 %" },
      { ccaa: "Castilla y León",         neto: 1569, irpf: "10,1 %" },
      { ccaa: "Comunitat Valenciana",    neto: 1565, irpf: "10,3 %" },
      { ccaa: "Cataluña",               neto: 1547, irpf: "11,1 %" },
    ],
    familyTable: [
      { label: "Soltero/a sin hijos",                extra: 0 },
      { label: "Con 1 hijo",                         extra: 20 },
      { label: "Con 2 hijos",                        extra: 42 },
      { label: "Casado/a, cónyuge sin ingresos",     extra: 28 },
    ],
    faq: [
      {
        q: "¿Cuánto es 20.000€ brutos en neto al mes?",
        a: "Con 20.000€ brutos anuales cobras aproximadamente 1.575€ netos al mes en Madrid (2026), aplicando las cotizaciones a la Seguridad Social y el IRPF con las reducciones por rendimientos del trabajo.",
      },
      {
        q: "¿Por qué el IRPF es tan bajo con 20.000€?",
        a: "Para salarios bajos, la reducción por rendimientos del trabajo (hasta 5.565€) reduce significativamente la base imponible, resultando en una retención IRPF muy pequeña o prácticamente nula.",
      },
      {
        q: "¿Cuánto paga la empresa por un trabajador de 20.000€?",
        a: "El coste total para la empresa es de aproximadamente 26.097€ anuales, que incluye el salario bruto más las cotizaciones patronales a la Seguridad Social (contingencias comunes, desempleo, FOGASA y formación profesional).",
      },
      {
        q: "¿Cuánto varía el neto según la comunidad autónoma con 20.000€?",
        a: "Con 20.000€ brutos, la diferencia entre la comunidad más ventajosa (Madrid, 1.575€/mes) y la menos ventajosa de las principales (Cataluña, 1.547€/mes) es de unos 28€ al mes, es decir, 336€ al año.",
      },
    ],
  },
  {
    bruto: 22000,
    brutoLabel: "22.000",
    slug: "22000",
    netoMensual: 1693,
    netoAnual: 20316,
    irpfEf: "11,8",
    costeEmpresa: 28698,
    ssEuros: 1430,
    irpfEuros: 2596,
    ccaaTable: [
      { ccaa: "Comunidad de Madrid",     neto: 1693, irpf: "11,8 %" },
      { ccaa: "Andalucía",               neto: 1684, irpf: "12,3 %" },
      { ccaa: "Castilla y León",         neto: 1686, irpf: "12,2 %" },
      { ccaa: "Comunitat Valenciana",    neto: 1680, irpf: "12,5 %" },
      { ccaa: "Cataluña",               neto: 1662, irpf: "13,5 %" },
    ],
    familyTable: [
      { label: "Soltero/a sin hijos",                extra: 0 },
      { label: "Con 1 hijo",                         extra: 27 },
      { label: "Con 2 hijos",                        extra: 56 },
      { label: "Casado/a, cónyuge sin ingresos",     extra: 38 },
    ],
    faq: [
      {
        q: "¿Cuánto es 22.000€ brutos en neto al mes?",
        a: "Con 22.000€ brutos anuales cobras aproximadamente 1.693€ netos al mes en Madrid (2026), después de descontar la Seguridad Social (6,5%) y la retención del IRPF (tipo efectivo 11,8%).",
      },
      {
        q: "¿Cuánto IRPF se paga con 22.000€ brutos?",
        a: "Con 22.000€ brutos, la retención efectiva del IRPF es del 11,8% sobre la base imponible en Madrid. Las reducciones por rendimientos del trabajo siguen siendo aplicables parcialmente a este nivel salarial.",
      },
      {
        q: "¿Cuánto cuesta a la empresa un empleado de 22.000€?",
        a: "El coste empresa para un salario bruto de 22.000€ es de aproximadamente 28.698€ anuales, incluyendo las cotizaciones patronales a la Seguridad Social.",
      },
      {
        q: "¿Cómo afecta tener hijos al neto con 22.000€?",
        a: "Con 22.000€ brutos y 1 hijo menor, el neto mensual aumenta unos 27€. Con 2 hijos, el incremento es de aproximadamente 56€/mes. Esto se debe a la reducción en la base imponible del IRPF por el mínimo familiar.",
      },
    ],
  },
  {
    bruto: 24000,
    brutoLabel: "24.000",
    slug: "24000",
    netoMensual: 1820,
    netoAnual: 21840,
    irpfEf: "13,0",
    costeEmpresa: 31301,
    ssEuros: 1560,
    irpfEuros: 3120,
    ccaaTable: [
      { ccaa: "Comunidad de Madrid",     neto: 1820, irpf: "13,0 %" },
      { ccaa: "Andalucía",               neto: 1810, irpf: "13,5 %" },
      { ccaa: "Castilla y León",         neto: 1812, irpf: "13,4 %" },
      { ccaa: "Comunitat Valenciana",    neto: 1804, irpf: "13,8 %" },
      { ccaa: "Cataluña",               neto: 1782, irpf: "14,9 %" },
    ],
    familyTable: [
      { label: "Soltero/a sin hijos",                extra: 0 },
      { label: "Con 1 hijo",                         extra: 29 },
      { label: "Con 2 hijos",                        extra: 62 },
      { label: "Casado/a, cónyuge sin ingresos",     extra: 41 },
    ],
    faq: [
      {
        q: "¿Cuánto es 24.000€ brutos en neto al mes?",
        a: "Con 24.000€ brutos anuales cobras aproximadamente 1.820€ netos al mes en Madrid (2026), después de descontar la Seguridad Social (6,5%) y la retención del IRPF (tipo efectivo 13,0%).",
      },
      {
        q: "¿Cuánto IRPF se paga con 24.000€ brutos?",
        a: "Con 24.000€ brutos, la retención efectiva del IRPF es del 13,0% en Madrid. La retención IRPF anual es de aproximadamente 3.120€ para un trabajador soltero sin hijos.",
      },
      {
        q: "¿Cuánto cuesta a la empresa un empleado de 24.000€?",
        a: "El coste empresa para un salario bruto de 24.000€ es de aproximadamente 31.301€ anuales. Las cotizaciones patronales representan en torno al 30,5% adicional sobre el salario bruto.",
      },
      {
        q: "¿Cuánto varía el neto entre Madrid y Cataluña con 24.000€?",
        a: "La diferencia es de 38€ al mes (456€ al año). En Madrid se cobran 1.820€/mes y en Cataluña 1.782€/mes, debido a los tipos autonómicos del IRPF más elevados en Cataluña.",
      },
    ],
  },
  {
    bruto: 25000,
    brutoLabel: "25.000",
    slug: "25000",
    netoMensual: 1911,
    netoAnual: 22930,
    irpfEf: "13,7",
    costeEmpresa: 32621,
    ssEuros: 1625,
    irpfEuros: 3425,
    ccaaTable: [
      { ccaa: "Comunidad de Madrid",     neto: 1911, irpf: "13,7 %" },
      { ccaa: "Andalucía",               neto: 1900, irpf: "14,2 %" },
      { ccaa: "Castilla y León",         neto: 1902, irpf: "14,1 %" },
      { ccaa: "Comunitat Valenciana",    neto: 1895, irpf: "14,5 %" },
      { ccaa: "Cataluña",               neto: 1872, irpf: "15,6 %" },
    ],
    familyTable: [
      { label: "Soltero/a sin hijos",                extra: 0 },
      { label: "Con 1 hijo",                         extra: 25 },
      { label: "Con 2 hijos",                        extra: 52 },
      { label: "Casado/a, cónyuge sin ingresos",     extra: 35 },
    ],
    faq: [
      {
        q: "¿Cuánto es 25.000€ brutos en neto al mes?",
        a: "Con 25.000€ brutos anuales cobras aproximadamente 1.911€ netos al mes en Madrid (2026), después de descontar la Seguridad Social (6,5%) y la retención del IRPF.",
      },
      {
        q: "¿Cuánto IRPF se paga con 25.000€ brutos?",
        a: "Con 25.000€ brutos, la retención efectiva del IRPF es del 13,7% sobre la base imponible. Tras aplicar las reducciones por rendimientos del trabajo y el mínimo personal, el IRPF retenido es de aproximadamente 445€ anuales en Madrid.",
      },
      {
        q: "¿Cuánto cuesta a la empresa un empleado de 25.000€?",
        a: "El coste empresa para un salario bruto de 25.000€ es de aproximadamente 32.621€ anuales, incluyendo las cotizaciones patronales a la Seguridad Social.",
      },
      {
        q: "¿Cómo afecta tener hijos al neto con 25.000€?",
        a: "Con 25.000€ brutos y 1 hijo menor, el neto mensual aumenta unos 25€. Con 2 hijos, el incremento es de aproximadamente 52€/mes. Esto se debe a la reducción en la base imponible del IRPF por el mínimo familiar.",
      },
    ],
  },
  {
    bruto: 28000,
    brutoLabel: "28.000",
    slug: "28000",
    netoMensual: 2107,
    netoAnual: 25284,
    irpfEf: "16,1",
    costeEmpresa: 36528,
    ssEuros: 1820,
    irpfEuros: 4508,
    ccaaTable: [
      { ccaa: "Comunidad de Madrid",     neto: 2107, irpf: "16,1 %" },
      { ccaa: "Andalucía",               neto: 2095, irpf: "16,6 %" },
      { ccaa: "Castilla y León",         neto: 2098, irpf: "16,5 %" },
      { ccaa: "Comunitat Valenciana",    neto: 2086, irpf: "17,0 %" },
      { ccaa: "Cataluña",               neto: 2056, irpf: "18,3 %" },
    ],
    familyTable: [
      { label: "Soltero/a sin hijos",                extra: 0 },
      { label: "Con 1 hijo",                         extra: 35 },
      { label: "Con 2 hijos",                        extra: 73 },
      { label: "Casado/a, cónyuge sin ingresos",     extra: 49 },
    ],
    faq: [
      {
        q: "¿Cuánto es 28.000€ brutos en neto al mes?",
        a: "Con 28.000€ brutos anuales cobras aproximadamente 2.107€ netos al mes en Madrid (2026). La retención IRPF efectiva es del 16,1%, lo que sitúa este salario en un tramo medio del IRPF.",
      },
      {
        q: "¿Cuánto IRPF se paga con 28.000€ brutos?",
        a: "Con 28.000€ brutos, la retención IRPF anual en Madrid es de aproximadamente 4.508€ (tipo efectivo 16,1%). En Cataluña sube a un tipo efectivo del 18,3%, lo que supone unos 51€/mes menos.",
      },
      {
        q: "¿Cuánto cuesta a la empresa un empleado de 28.000€?",
        a: "El coste empresa para un salario bruto de 28.000€ es de aproximadamente 36.528€ anuales, incluyendo las cotizaciones patronales a la Seguridad Social.",
      },
      {
        q: "¿Merece la pena negociar de 25.000€ a 28.000€?",
        a: "Un aumento de 3.000€ brutos (de 25k a 28k) supone pasar de 1.911€ a 2.107€ netos mensuales, un incremento real de 196€/mes (2.352€/año). El incremento neto representa el 65% del bruto adicional.",
      },
    ],
  },
  {
    bruto: 30000,
    brutoLabel: "30.000",
    slug: "30000",
    netoMensual: 2274,
    netoAnual: 27292,
    irpfEf: "17,7",
    costeEmpresa: 39144,
    ssEuros: 1950,
    irpfEuros: 4967,
    ccaaTable: [
      { ccaa: "Comunidad de Madrid",     neto: 2274, irpf: "17,7 %" },
      { ccaa: "Andalucía",               neto: 2259, irpf: "18,2 %" },
      { ccaa: "Castilla y León",         neto: 2262, irpf: "18,1 %" },
      { ccaa: "Comunitat Valenciana",    neto: 2251, irpf: "18,5 %" },
      { ccaa: "Cataluña",               neto: 2218, irpf: "19,9 %" },
    ],
    familyTable: [
      { label: "Soltero/a sin hijos",                extra: 0 },
      { label: "Con 1 hijo",                         extra: 32 },
      { label: "Con 2 hijos",                        extra: 68 },
      { label: "Casado/a, cónyuge sin ingresos",     extra: 45 },
    ],
    faq: [
      {
        q: "¿Cuánto es 30.000€ brutos en neto al mes?",
        a: "Con 30.000€ brutos anuales cobras 2.274€ netos al mes en Madrid (2026). La Seguridad Social descuenta 1.950€ al año (6,5%) y la retención IRPF es de 758€ en Madrid para un trabajador soltero sin hijos.",
      },
      {
        q: "¿Cuánto IRPF se paga con 30.000€ brutos?",
        a: "Con 30.000€ brutos, el IRPF efectivo es del 17,7% sobre la base imponible. En Madrid la retención anual es de aproximadamente 758€. En Cataluña, con tipos autonómicos más altos, la retención sube al 19,9%.",
      },
      {
        q: "¿Cuánto cuesta a la empresa un empleado de 30.000€?",
        a: "El coste empresa para un salario bruto de 30.000€ es de aproximadamente 39.144€ anuales, añadiendo las cotizaciones patronales (contingencias comunes ~23,6%, desempleo, FOGASA, formación y MEI).",
      },
      {
        q: "¿Cuánto varía el neto entre Madrid y Cataluña con 30.000€?",
        a: "La diferencia es de 56€ al mes (672€ al año). En Madrid se cobran 2.274€/mes y en Cataluña 2.218€/mes, debido a los tipos autonómicos del IRPF más elevados en Cataluña.",
      },
    ],
  },
  {
    bruto: 35000,
    brutoLabel: "35.000",
    slug: "35000",
    netoMensual: 2520,
    netoAnual: 30240,
    irpfEf: "20,5",
    costeEmpresa: 45668,
    ssEuros: 2275,
    irpfEuros: 7175,
    ccaaTable: [
      { ccaa: "Comunidad de Madrid",     neto: 2520, irpf: "20,5 %" },
      { ccaa: "Andalucía",               neto: 2500, irpf: "21,2 %" },
      { ccaa: "Castilla y León",         neto: 2505, irpf: "21,0 %" },
      { ccaa: "Comunitat Valenciana",    neto: 2488, irpf: "21,6 %" },
      { ccaa: "Cataluña",               neto: 2450, irpf: "22,9 %" },
    ],
    familyTable: [
      { label: "Soltero/a sin hijos",                extra: 0 },
      { label: "Con 1 hijo",                         extra: 38 },
      { label: "Con 2 hijos",                        extra: 79 },
      { label: "Casado/a, cónyuge sin ingresos",     extra: 52 },
    ],
    faq: [
      {
        q: "¿Cuánto es 35.000€ brutos en neto al mes?",
        a: "Con 35.000€ brutos anuales cobras 2.520€ netos al mes en Madrid (2026). Es un salario por encima de la media española, con una retención IRPF efectiva del 20,5%.",
      },
      {
        q: "¿Cuánto IRPF se paga con 35.000€ brutos?",
        a: "Con 35.000€ brutos, la retención IRPF anual en Madrid es de aproximadamente 7.175€ (tipo efectivo 20,5%). En Cataluña sube a un tipo efectivo del 22,9%, lo que supone unos 70€/mes menos neto.",
      },
      {
        q: "¿Cuánto cuesta a la empresa un empleado de 35.000€?",
        a: "El coste empresa para un salario bruto de 35.000€ es de aproximadamente 45.668€ anuales, incluyendo las cotizaciones patronales a la Seguridad Social.",
      },
      {
        q: "¿Merece la pena negociar de 30.000€ a 35.000€?",
        a: "Un aumento de 5.000€ brutos (de 30k a 35k) supone pasar de 2.274€ a 2.520€ netos mensuales, un incremento real de 246€/mes (2.952€/año). El incremento neto representa el 59% del bruto adicional.",
      },
    ],
  },
  {
    bruto: 40000,
    brutoLabel: "40.000",
    slug: "40000",
    netoMensual: 2876,
    netoAnual: 34516,
    irpfEf: "22,1",
    costeEmpresa: 52191,
    ssEuros: 2600,
    irpfEuros: 8844,
    ccaaTable: [
      { ccaa: "Comunidad de Madrid",     neto: 2876, irpf: "22,1 %" },
      { ccaa: "Andalucía",               neto: 2853, irpf: "22,8 %" },
      { ccaa: "Castilla y León",         neto: 2858, irpf: "22,6 %" },
      { ccaa: "Comunitat Valenciana",    neto: 2842, irpf: "23,2 %" },
      { ccaa: "Cataluña",               neto: 2792, irpf: "24,6 %" },
    ],
    familyTable: [
      { label: "Soltero/a sin hijos",                extra: 0 },
      { label: "Con 1 hijo",                         extra: 42 },
      { label: "Con 2 hijos",                        extra: 88 },
      { label: "Casado/a, cónyuge sin ingresos",     extra: 59 },
    ],
    faq: [
      {
        q: "¿Cuánto es 40.000€ brutos en neto al mes?",
        a: "Con 40.000€ brutos anuales cobras 2.876€ netos al mes en Madrid (2026). Es un salario que ya entra en tramos del IRPF más altos, con una retención efectiva del 22,1%.",
      },
      {
        q: "¿Cuánto IRPF se paga con 40.000€ brutos?",
        a: "Con 40.000€ brutos, la retención IRPF asciende a unos 2.884€ anuales en Madrid (tipo efectivo 22,1%). En Cataluña sube a un tipo efectivo del 24,6%, lo que supone una diferencia de más de 84€ al mes respecto a Madrid.",
      },
      {
        q: "¿Cuánto cuesta a la empresa un empleado de 40.000€?",
        a: "El coste empresa para un salario bruto de 40.000€ es de aproximadamente 52.191€ anuales. Las cotizaciones patronales representan en torno al 30,5% adicional sobre el salario bruto.",
      },
      {
        q: "¿Merece la pena negociar desde 30.000€ a 40.000€?",
        a: "Un aumento de 10.000€ brutos (de 30k a 40k) supone pasar de 2.274€ a 2.876€ netos mensuales, un incremento real de 602€/mes (7.224€/año). La tasa marginal adicional es alta, pero el incremento neto es significativo.",
      },
    ],
  },
  {
    bruto: 45000,
    brutoLabel: "45.000",
    slug: "45000",
    netoMensual: 3145,
    netoAnual: 37740,
    irpfEf: "23,8",
    costeEmpresa: 58715,
    ssEuros: 2925,
    irpfEuros: 10710,
    ccaaTable: [
      { ccaa: "Comunidad de Madrid",     neto: 3145, irpf: "23,8 %" },
      { ccaa: "Andalucía",               neto: 3111, irpf: "24,7 %" },
      { ccaa: "Castilla y León",         neto: 3119, irpf: "24,5 %" },
      { ccaa: "Comunitat Valenciana",    neto: 3092, irpf: "25,2 %" },
      { ccaa: "Cataluña",               neto: 3040, irpf: "26,6 %" },
    ],
    familyTable: [
      { label: "Soltero/a sin hijos",                extra: 0 },
      { label: "Con 1 hijo",                         extra: 47 },
      { label: "Con 2 hijos",                        extra: 98 },
      { label: "Casado/a, cónyuge sin ingresos",     extra: 65 },
    ],
    faq: [
      {
        q: "¿Cuánto es 45.000€ brutos en neto al mes?",
        a: "Con 45.000€ brutos anuales cobras 3.145€ netos al mes en Madrid (2026). La retención IRPF efectiva es del 23,8%, situándose este salario en un tramo alto del IRPF estatal.",
      },
      {
        q: "¿Cuánto IRPF se paga con 45.000€ brutos?",
        a: "Con 45.000€ brutos, la retención IRPF anual en Madrid es de aproximadamente 10.710€ (tipo efectivo 23,8%). En Cataluña sube al 26,6%, lo que supone unos 105€/mes menos neto respecto a Madrid.",
      },
      {
        q: "¿Cuánto cuesta a la empresa un empleado de 45.000€?",
        a: "El coste empresa para un salario bruto de 45.000€ es de aproximadamente 58.715€ anuales. La diferencia entre el bruto y el coste empresa se debe a las cotizaciones patronales a la Seguridad Social.",
      },
      {
        q: "¿Merece la pena negociar de 40.000€ a 45.000€?",
        a: "Un aumento de 5.000€ brutos (de 40k a 45k) supone pasar de 2.876€ a 3.145€ netos mensuales, un incremento real de 269€/mes (3.228€/año). El incremento neto representa el 65% del bruto adicional.",
      },
    ],
  },
  {
    bruto: 50000,
    brutoLabel: "50.000",
    slug: "50000",
    netoMensual: 3414,
    netoAnual: 40968,
    irpfEf: "25,1",
    costeEmpresa: 65239,
    ssEuros: 3250,
    irpfEuros: 12532,
    ccaaTable: [
      { ccaa: "Comunidad de Madrid",     neto: 3414, irpf: "25,1 %" },
      { ccaa: "Andalucía",               neto: 3381, irpf: "26,0 %" },
      { ccaa: "Castilla y León",         neto: 3388, irpf: "25,8 %" },
      { ccaa: "Comunitat Valenciana",    neto: 3364, irpf: "26,5 %" },
      { ccaa: "Cataluña",               neto: 3291, irpf: "28,0 %" },
    ],
    familyTable: [
      { label: "Soltero/a sin hijos",                extra: 0 },
      { label: "Con 1 hijo",                         extra: 50 },
      { label: "Con 2 hijos",                        extra: 105 },
      { label: "Casado/a, cónyuge sin ingresos",     extra: 70 },
    ],
    faq: [
      {
        q: "¿Cuánto es 50.000€ brutos en neto al mes?",
        a: "Con 50.000€ brutos anuales cobras 3.414€ netos al mes en Madrid (2026). La retención IRPF efectiva es del 25,1%, con una retención anual de 5.782€ para un soltero sin hijos.",
      },
      {
        q: "¿Cuánto IRPF se paga con 50.000€ brutos?",
        a: "Con 50.000€, la retención IRPF en Madrid es de unos 5.782€ anuales (tipo efectivo 25,1%). En Cataluña sube a un tipo efectivo del 28%, lo que supone pagar unos 1.476€ más al año que en Madrid.",
      },
      {
        q: "¿Cuánto cuesta a la empresa un empleado de 50.000€?",
        a: "El coste empresa para un salario bruto de 50.000€ es de aproximadamente 65.239€ anuales. La diferencia entre el salario bruto y el coste empresa se debe principalmente a las cotizaciones patronales a la Seguridad Social.",
      },
      {
        q: "¿Qué porcentaje del salario se pierde en impuestos con 50.000€?",
        a: "Con 50.000€ brutos, la suma de SS (6,5%) e IRPF (25,1% ef.) representa el 18,1% del salario bruto en detracciones efectivas. El 81,9% restante llega como neto (40.968€ anuales).",
      },
    ],
  },
];

export const SALARIO_DATA: Record<string, SalarioData> = Object.fromEntries(
  ALL.map((d) => [d.slug, d])
);

export const ALL_SALARIOS = ALL;

export function fmt(n: number): string {
  return n.toLocaleString("es-ES");
}
