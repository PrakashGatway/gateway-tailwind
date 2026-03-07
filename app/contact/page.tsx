import Contact from "@/components/pages/contact";
import PageServices from "@/services/PageServices";
import Script from "next/script";

export const revalidate = 21600; // revalidate every 6 hours

export async function generateMetadata() {
  const seoData = {
    title: "Contact Gateway Abroad Education | Top Foreign educational consultants",
    description: "Get instant help! Call/visit Gateway Abroad Jaipur for test preparation, Study Abroad & Visa Guidance.",
    keywords: "Contact Gateway Abroad Jaipur, call to enqury, free counselling, join free consultance, foreign education consultants",
    ogTitle: "Contact Gateway Abroad Education | Top Foreign educational consultants",
    ogDescription: "Get instant help! Call/visit Gateway Abroad Jaipur for test preparation, Study Abroad & Visa Guidance.",
    ogImage: "/img/ga-logo.svg",
    twitterTitle: "Contact Us - Gateway Abroad",
    twitterDescription: "Reach out to Gateway Abroad for expert study abroad and test prep guidance.",
    twitterImage: "/img/ga-logo.svg",
    canonical: "https://www.gatewayabroadeducations.com/contact"
  };

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
  };
}



async function ContactPage() {

  const [
    contactPage,
    contactSettings,
    faqData
  ] = await Promise.all([
    PageServices.getContactPageById().then(res => res?.data || null).catch(() => null),
    PageServices.getSettingData().then(res => res?.data || null).catch(() => null),
    PageServices.getOffice().then(res => res?.data || null).catch(() => null)
  ]);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Career",
        "item": "https://www.gatewayabroadeducations.com/career"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact Us",
        "item": "https://www.gatewayabroadeducations.com/contact"
      }
    ]
  };

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Contact contactPage={contactPage} contactSettings={contactSettings} faqData={faqData} />

    </>
  );
}

export default ContactPage;