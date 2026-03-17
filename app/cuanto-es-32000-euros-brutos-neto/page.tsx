import type { Metadata } from "next";
import SalarioPage from "@/components/SalarioPage";
import { SALARIO_DATA } from "@/lib/salario-data";

const data = SALARIO_DATA["32000"];

export const metadata: Metadata = {
  title: "¿Cuánto es 32.000€ Brutos en Neto? → 2.388€/mes en 2026",
  description:
    "Con 32.000€ brutos anuales cobras 2.388€ netos al mes en Madrid (2026). Desglose completo por comunidad autónoma y situación familiar.",
  alternates: { canonical: "https://calculadoranomina.org/cuanto-es-32000-euros-brutos-neto" },
  openGraph: {
    title: "¿Cuánto es 32.000€ Brutos en Neto? → 2.388€/mes en 2026",
    description: "Con 32.000€ brutos cobras 2.388€ netos/mes en Madrid. Compara por CCAA y situación familiar.",
    url: "https://calculadoranomina.org/cuanto-es-32000-euros-brutos-neto",
    type: "website",
  },
};

export default function Page() {
  return <SalarioPage data={data} />;
}
