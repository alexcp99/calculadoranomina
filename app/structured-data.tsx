export default function StructuredData() {
  const webApp = {
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

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Calculadora Nómina",
    url: "https://calculadoranomina.org",
    logo: {
      "@type": "ImageObject",
      url: "https://calculadoranomina.org/apple-touch-icon.png",
      width: 180,
      height: 180,
    },
    sameAs: ["https://calculadoranomina.org"],
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Calculadora Nómina",
    url: "https://calculadoranomina.org",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://calculadoranomina.org/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }} />
    </>
  );
}
