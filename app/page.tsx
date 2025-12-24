import Index from "@/components/home/HomePage"
import Script from "next/script";


export async function generateMetadata() {
  const seoData = {
    title: "Gateway Abroad Education, Study Abroad and Test Preparation",
    description: "Planning to study abroad from India? Gateway Abroad offers expert test prep, visa support & admissions for Canada, UK, USA, Germany & more",
    keywords: "study abroad, test preparation, visa support, overseas education",
    ogTitle: "Gateway Abroad Education, Study Abroad and Test Preparation",
    ogDescription: "Planning to study abroad from India? Gateway Abroad offers expert test prep, visa support & admissions for Canada, UK, USA, Germany & more.",
    ogImage: "/img/ga-logo.svg",
    twitterTitle: "Gateway Abroad Education | Study Abroad Consultants in India",
    twitterDescription: "Complete your overseas education dreams with the best Study Abroad Consultants in India. Higher studies in the USA, UK, Canada, Australia, Dubai.",
    twitterImage: "/img/ga-logo.svg",
    canonical: "https://www.gatewayabroadeducations.com"
  }

  return {
    metadataBase: new URL('https://www.gatewayabroadeducations.com'),
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.ogTitle,
      description: seoData.ogDescription,
      images: [seoData.ogImage],
      url: seoData.canonical,
      type: "website",
      site_name: "Gateway Abroad Education",
    },
    twitter: {
      card: "summary_large_image",
      title: seoData.twitterTitle,
      description: seoData.twitterDescription,
      images: [seoData.twitterImage],
    },
    alternates: { canonical: seoData.canonical },
    // icons: seoData.icons,
  };
}

export default function Home() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Gateway Abroad Education",
    "image":
      "https://api.gatewayabroadeducations.com/api/uploads/1766116981292-730003835.jpg",
    "@id": "https://www.gatewayabroadeducations.com/",
    "url": "https://www.gatewayabroadeducations.com/",
    "telephone": "08302092630",
    "address": {
      "@type": "PostalAddress",
      "streetAddress":
        "105, First Floor, Geetanjali Tower, Ajmer Road, Civil Lines, Jaipur, Rajasthan 302006",
      "addressLocality": "Jaipur",
      "addressRegion": "Rajasthan",
      "postalCode": "302006",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/Gatewayabroadjeducation1/",
      "https://www.instagram.com/gatewayabroadeducation",
      "https://www.linkedin.com/company/gateway-abroad-jaipur1"
    ]
  };

  return (
    <>
      {/* Local Business Schema */}
      <Script
        id="local-business-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <Index />
    </>
  );
}

