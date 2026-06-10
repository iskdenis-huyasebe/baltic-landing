import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Showcase } from "@/components/sections/Showcase";
import { WhatsIncluded } from "@/components/sections/WhatsIncluded";
import { Pricing } from "@/components/sections/Pricing";
import { Templates } from "@/components/sections/Templates";
import { Subscriptions } from "@/components/sections/Subscriptions";
import { Comparison } from "@/components/sections/Comparison";
import { Process } from "@/components/sections/Process";
import { ForWhom } from "@/components/sections/ForWhom";
import { FAQ } from "@/components/sections/FAQ";
import { ContactCTA } from "@/components/sections/ContactCTA";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://unoweb.eu";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Unoweb",
    description:
      "Landing pages for Baltic businesses — €200, ready in 3 business days.",
    url: `${BASE_URL}/${locale}`,
    inLanguage: locale,
    priceRange: "€200",
    areaServed: ["LT", "LV", "EE"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vilnius",
      addressCountry: "LT",
    },
    offers: [
      { "@type": "Offer", name: "Setup", price: "200", priceCurrency: "EUR", category: "OneTime" },
      { "@type": "Offer", name: "Setup Pro", price: "500", priceCurrency: "EUR", category: "OneTime" },
      { "@type": "Offer", name: "Custom", price: "1200", priceCurrency: "EUR", category: "OneTime" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <TrustStrip />
      <Showcase />
      <WhatsIncluded />
      <Pricing />
      <Templates />
      <Subscriptions />
      <Comparison />
      <Process />
      <ForWhom />
      <FAQ />
      <ContactCTA />
    </>
  );
}
