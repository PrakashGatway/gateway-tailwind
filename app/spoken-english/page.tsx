import SpokenEnglish from "@/components/pages/spokenEnglish";

export async function generateMetadata() {
  const seoData = {
    title: "Best Spoken English Classes in Jaipur | English Speaking class",
    description: "Master fluent English for study abroad! Join top spoken English class in Jaipur with personalized training and English Speaking class. Free demo class.",
    keywords: "spoken english classes in jaipur, spoken english coaching, english speaking class, english spoken, personality development class, english expert coach, free spoken english demo class",
    ogTitle: "Best Spoken English Classes in Jaipur | English Speaking class",
    ogDescription: "Master fluent English for study abroad! Join top spoken English class in Jaipur with personalized training and English Speaking class. Free demo class",
    ogImage: "/img/ga-logo.svg",
    twitterTitle: "Spoken English Classes in Jaipur - Gateway Abroad",
    twitterDescription: "Improve your fluency with expert-led spoken English coaching in Jaipur. Free demo available.",
    twitterImage: "/img/ga-logo.svg",
    canonical: "https://www.gatewayabroadeducations.com/spoken-english"
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

function Spoken() {
  return (
    <SpokenEnglish />
  );
}

export default Spoken;