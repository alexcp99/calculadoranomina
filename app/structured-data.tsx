export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Calculadora de Nómina 2026",
    url: "https://calculadoranomina.org",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "es-ES",
    description:
      "Calculadora de nómina online para España. Calcula tu salario neto a partir del bruto o viceversa aplicando los tramos del IRPF 2026 y las cotizaciones a la Seguridad Social. Datos oficiales AEAT. Situaciones familiares completas: soltero, casado, monoparental.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    creator: {
      "@type": "Organization",
      name: "Calculadora Nómina",
      url: "https://calculadoranomina.org",
    },
    featureList: [
      "Cálculo salario bruto a neto",
      "Cálculo salario neto a bruto",
      "IRPF 2026 con tramos actualizados",
      "Cotizaciones Seguridad Social 2026",
      "Situaciones familiares: soltero, casado, monoparental",
      "Contratos indefinido y temporal",
    ],
    audience: {
      "@type": "Audience",
      geographicArea: {
        "@type": "Country",
        name: "España",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
