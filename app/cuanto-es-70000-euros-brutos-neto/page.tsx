import type { Metadata } from "next";
import SalarioPage from "@/components/SalarioPage";
import { SALARIO_DATA } from "@/lib/salario-data";

const data = SALARIO_DATA["70000"];

export const metadata: Metadata = {
  title: "¿Cuánto es 70.000€ Brutos en Neto? → 4.289€/mes en 2026",
  description:
    "Con 70.000€ brutos anuales cobras 4.289€ netos al mes en Madrid (2026). Calcula tu neto exacto por comunidad autónoma y situación familiar. IRPF 29,0% · SS 6,5%.",
  alternates: { canonical: "https://calculadoranomina.org/cuanto-es-70000-euros-brutos-neto" },
  openGraph: {
    title: "¿Cuánto es 70.000€ Brutos en Neto? → 4.289€/mes en 2026",
    description: "Con 70.000€ brutos cobras 4.289€ netos/mes en Madrid. Compara por CCAA y situación familiar.",
    url: "https://calculadoranomina.org/cuanto-es-70000-euros-brutos-neto",
    type: "website",
  },
};

export default function Page() {
  return <SalarioPage data={data} />;
}
