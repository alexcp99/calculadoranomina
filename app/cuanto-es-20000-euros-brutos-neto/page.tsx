import type { Metadata } from "next";
import SalarioPage from "@/components/SalarioPage";
import { SALARIO_DATA } from "@/lib/salario-data";

const data = SALARIO_DATA["20000"];

export const metadata: Metadata = {
  title: "¿Cuánto es 20.000€ Brutos en Neto? → 1.575€/mes en 2026",
  description:
    "Con 20.000€ brutos anuales cobras 1.575€ netos al mes en Madrid (2026). Calcula tu neto exacto por comunidad autónoma y situación familiar. IRPF 9,8% · SS 6,5%.",
  alternates: { canonical: "https://calculadoranomina.org/cuanto-es-20000-euros-brutos-neto" },
  openGraph: {
    title: "¿Cuánto es 20.000€ Brutos en Neto? → 1.575€/mes en 2026",
    description: "Con 20.000€ brutos cobras 1.575€ netos/mes en Madrid. Compara por CCAA y situación familiar.",
    url: "https://calculadoranomina.org/cuanto-es-20000-euros-brutos-neto",
    type: "website",
  },
};

export default function Page() {
  return <SalarioPage data={data} />;
}
