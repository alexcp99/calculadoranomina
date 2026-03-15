import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Calculadora de Nómina 2026 — IRPF y Seguridad Social",
  description:
    "Calcula tu salario neto desde el bruto y viceversa. IRPF 2026 + cotizaciones a la Seguridad Social. Situaciones familiares completas. Datos oficiales AEAT.",
  keywords:
    "calculadora nómina, salario neto, IRPF 2026, seguridad social, bruto neto, España, calculadora salario",
  openGraph: {
    title: "Calculadora de Nómina 2026",
    description: "Calcula tu salario neto o bruto en segundos. AEAT 2026.",
    type: "website",
    locale: "es_ES",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
