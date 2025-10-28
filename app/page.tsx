import Index from "@/components/home/HomePage"


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
  return (
    <>
      <Index />
    </>
  )
}
