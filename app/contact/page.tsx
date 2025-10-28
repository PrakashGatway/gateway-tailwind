import Contact from "@/components/pages/contact";

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

function ContactPage() {

  return (
    <Contact/>
  );
}

export default ContactPage;