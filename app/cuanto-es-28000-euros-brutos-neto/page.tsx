import type { Metadata } from "next";
import SalarioPage from "@/components/SalarioPage";
import { SALARIO_DATA } from "@/lib/salario-data";

const data = SALARIO_DATA["28000"];

export const metadata: Metadata = {
  title: "¿Cuánto es 28.000€ Brutos en Neto? → 2.107€/mes en 2026",
  description:
    "Con 28.000€ brutos anuales cobras 2.107€ netos al mes en Madrid (2026). Calcula tu neto exacto por comunidad autónoma y situación familiar. IRPF 16,1% · SS 6,5%.",
  alternates: { canonical: "https://calculadoranomina.org/cuanto-es-28000-euros-brutos-neto" },
  openGraph: {
    title: "¿Cuánto es 28.000€ Brutos en Neto? → 2.107€/mes en 2026",
    description: "Con 28.000€ brutos cobras 2.107€ netos/mes en Madrid. Compara por CCAA y situación familiar.",
    url: "https://calculadoranomina.org/cuanto-es-28000-euros-brutos-neto",
    type: "website",
  },
};

export default function Page() {
  return <SalarioPage data={data} />;
}
