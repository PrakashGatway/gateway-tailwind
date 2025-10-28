import Gallery from "@/components/pages/galleryPage";

export async function generateMetadata() {
  const seoData = {
    title: "Gallery - Gateway Abroad | Study Abroad Moments & Events",
    description: "Explore the journey of students at Gateway Abroad. View photos from counseling sessions, test prep classes, farewell events, and university acceptances.",
    keywords: "Gateway Abroad gallery, student moments, study abroad events, IELTS class photos, student success stories, abroad education photos",
    ogTitle: "Gallery - Gateway Abroad | Student Success & Events",
    ogDescription: "See the moments that matter. Browse photos from classes, counseling, and celebrations at Gateway Abroad.",
    ogImage: "/img/ga-logo.svg",
    twitterTitle: "Photo Gallery - Gateway Abroad",
    twitterDescription: "Check out real moments from students preparing for global success at Gateway Abroad.",
    twitterImage: "/img/ga-logo.svg",
    canonical: "https://www.gatewayabroadeducations.com/gallery"
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

const GalleryPage = () => {
  return (
    <Gallery />
  );
};

export default GalleryPage;