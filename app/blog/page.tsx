import AllBlogs from "@/components/pages/blogs";
export async function generateMetadata() {
  const seoData = {
    title: "Blog - Gateway Abroad | Study Abroad Tips & Updates",
    description: "Stay updated with the latest study abroad news, visa updates, test prep tips, and student success stories from Gateway Abroad.",
    keywords: "study abroad blog, IELTS tips, student visa updates, university admissions, abroad education news, Gateway Abroad blog",
    ogTitle: "Blog - Gateway Abroad | Expert Study Abroad Advice",
    ogDescription: "Expert insights on studying abroad, test preparation, and visa guidance. Your go-to resource for global education updates.",
    ogImage: "/img/ga-logo.svg",
    twitterTitle: "Blog - Gateway Abroad Education",
    twitterDescription: "Latest tips and news on IELTS, GRE, GMAT, and studying abroad from Gateway Abroad experts.",
    twitterImage: "/img/ga-logo.svg",
    canonical: "https://www.gatewayabroadeducations.com/blog"
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

function BlogsPage() {

  return (
    <AllBlogs/>
  );
}

export default BlogsPage;