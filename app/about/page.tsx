import About from "@/components/pages/aboutUs";

export async function generateMetadata() {
  const seoData = {
    title: "About Gateway Abroad Education | Overseas Education Consultants in india",
    description: "Learn about Gateway Abroad education's mission, team, and 16+ years of expertise in overseas education.",
    keywords: "about Gateway Abroad, our team, overseas education consultants, education experts",
    ogTitle: "About Gateway Abroad Education | Overseas Education Consultants in india",
    ogDescription: "Learn about Gateway Abroad education's mission, team, and 16+ years of expertise in overseas education.",
    ogImage: "/img/ga-logo.svg",
    twitterTitle: "About Gateway Abroad | Our Story & Team",
    twitterDescription: "Discover our mission and the team behind Gateway Abroad's success.",
    twitterImage: "/img/ga-logo.svg",
    canonical: "https://www.gatewayabroadeducations.com/about"
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

function AboutPage() {

  return (
    <About />
  );
}

export default AboutPage;