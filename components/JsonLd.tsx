import { BRAND_NAME, siteUrl } from "@/config/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Layout conceptual GMP",
    serviceType: "Conceptual GMP facility layout",
    description:
      "Layouts conceptuales GMP con variantes asistidas por IA, revisión de un equipo de expertos, planos 2D y modelo 3D interactivo.",
    url: siteUrl,
    provider: {
      "@type": "Organization",
      name: BRAND_NAME,
    },
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
    areaServed: ["ES", "Latin America"],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
