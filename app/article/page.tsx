import AllArticles from "@/components/pages/ArticlePage";
import Script from "next/script";

export async function generateMetadata() {
  const seoData = {
    title: "Article - Gateway Abroad | Study Abroad Tips & Updates",
    description:
      "Stay updated with the latest study abroad news, visa updates, test prep tips, and student success stories from Gateway Abroad.",
    keywords:
      "study abroad blog, IELTS tips, student visa updates, university admissions, abroad education news, Gateway Abroad blog",
    canonical: "https://www.gatewayabroadeducations.com/article",
  };

  return {
    metadataBase: new URL("https://www.gatewayabroadeducations.com"),
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: { canonical: seoData.canonical },
  };
}

export default function BlogsPage() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.gatewayabroadeducations.com/#website",
    "url": "https://www.gatewayabroadeducations.com/",
    "name": "Gateway Abroad Educations",
    "potentialAction": {
      "@type": "SearchAction",
      "target":
        "https://www.gatewayabroadeducations.com/article?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
   
      <Script
        id="website-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <AllArticles />
    </>
  );
}
