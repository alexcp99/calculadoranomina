import type { Metadata } from "next";
import SalarioPage from "@/components/SalarioPage";
import { SALARIO_DATA } from "@/lib/salario-data";

const data = SALARIO_DATA["60000"];

export const metadata: Metadata = {
  title: "¿Cuánto es 60.000€ Brutos en Neto? → 3.795€/mes en 2026",
  description:
    "Con 60.000€ brutos anuales cobras 3.795€ netos al mes en Madrid (2026). Desglose completo por comunidad autónoma y situación familiar.",
  alternates: { canonical: "https://calculadoranomina.org/cuanto-es-60000-euros-brutos-neto" },
  openGraph: {
    title: "¿Cuánto es 60.000€ Brutos en Neto? → 3.795€/mes en 2026",
    description: "Con 60.000€ brutos cobras 3.795€ netos/mes en Madrid. Compara por CCAA y situación familiar.",
    url: "https://calculadoranomina.org/cuanto-es-60000-euros-brutos-neto",
    type: "website",
  },
};

export default function Page() {
  return <SalarioPage data={data} />;
}
