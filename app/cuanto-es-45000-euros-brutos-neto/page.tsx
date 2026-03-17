import type { Metadata } from "next";
import SalarioPage from "@/components/SalarioPage";
import { SALARIO_DATA } from "@/lib/salario-data";

const data = SALARIO_DATA["45000"];

export const metadata: Metadata = {
  title: "¿Cuánto es 45.000€ Brutos en Neto? → 3.145€/mes en 2026",
  description:
    "Con 45.000€ brutos anuales cobras 3.145€ netos al mes en Madrid (2026). Calcula tu neto exacto por comunidad autónoma y situación familiar. IRPF 23,8% · SS 6,5%.",
  alternates: { canonical: "https://calculadoranomina.org/cuanto-es-45000-euros-brutos-neto" },
  openGraph: {
    title: "¿Cuánto es 45.000€ Brutos en Neto? → 3.145€/mes en 2026",
    description: "Con 45.000€ brutos cobras 3.145€ netos/mes en Madrid. Compara por CCAA y situación familiar.",
    url: "https://calculadoranomina.org/cuanto-es-45000-euros-brutos-neto",
    type: "website",
  },
};

export default function Page() {
  return <SalarioPage data={data} />;
}
