import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import Script from "next/script";
import StructuredData from "./structured-data";
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
  metadataBase: new URL("https://calculadoranomina.org"),

  title: {
    default: "Calculadora de Nómina 2026 — Salario Bruto y Neto | IRPF y Seguridad Social",
    template: "%s | Calculadora de Nómina 2026",
  },
  description:
    "Calcula tu salario neto desde el bruto o el bruto desde el neto en segundos. Aplica los tramos del IRPF 2026, cotizaciones a la Seguridad Social y mínimos personales. Situaciones familiares completas. Datos oficiales AEAT España.",
  keywords: [
    "calculadora nómina",
    "calculadora salario neto",
    "salario bruto neto",
    "IRPF 2026",
    "tramos IRPF 2026",
    "Seguridad Social 2026",
    "calculadora IRPF España",
    "retención IRPF",
    "sueldo neto España",
    "calculadora retención",
    "nómina España",
    "salario neto 2026",
  ],

  alternates: {
    canonical: "https://calculadoranomina.org",
  },

  openGraph: {
    title: "Calculadora de Nómina 2026 — Salario Bruto y Neto",
    description:
      "Calcula tu salario neto desde el bruto (o al revés) con IRPF 2026 y Seguridad Social. Datos oficiales AEAT. Gratis y sin registro.",
    url: "https://calculadoranomina.org",
    siteName: "Calculadora de Nómina",
    type: "website",
    locale: "es_ES",
  },

  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Nómina 2026 — Bruto / Neto",
    description:
      "Calcula tu salario neto o bruto con IRPF 2026 y Seguridad Social. Gratis, sin registro, datos AEAT.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
  },

  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <StructuredData />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JXB1C0F6ET"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JXB1C0F6ET');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
