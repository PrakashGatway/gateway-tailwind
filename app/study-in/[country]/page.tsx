import NotFound from "@/app/not-found";
import StudyInUk from "@/components/pages/studyInUk";
import { serverInstance } from "@/services/axiosInstance";
import Script from "next/script";

const pageContentPromise = async ({ country }) => {
    try {
        const response = await serverInstance.get(`/page/${country}?type=country_page`);
        return response.data?.data;
    } catch (error) {
        return null; // or handle the error as needed
    }
}

export async function generateMetadata({ params }) {
    const { country } = await params;
    const pageContent = await pageContentPromise({ country });
    return {
        metadataBase: new URL('https://www.gatewayabroadeducations.com'),
        title: pageContent?.metaTitle || "Default Study Abroad Title",
        description: pageContent?.metaDescription || "Default study abroad description.",
        openGraph: {
            title: pageContent?.metaTitle || "Study Abroad",
            description: pageContent?.metaDescription || "Learn about study abroad programs",
            images: [
                {
                    url: "img/ga-logo.svg",
                    width: 1200,
                    height: 630,
                    alt: pageContent?.metaTitle || "Study Abroad",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: pageContent.metaTitle,
            description: pageContent.metaDescription,
            images: ["img/ga-logo.svg"],
        },
        keywords: pageContent?.keywords || "study abroad, international education",
        alternates: {
            canonical: pageContent?.canonicalUrl,
        },
    };
}

const UkPage = async ({ params }) => {
    const { country } = await params;
    const pageContent = await pageContentPromise({ country });
    if (!pageContent) {
        return <NotFound />;
    }


     const studyUkSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://www.gatewayabroadeducations.com/study-in-${country}#webpage`,
    "url": `https://www.gatewayabroadeducations.com/study-in-${country}`,
    "name":
      pageContent?.metaTitle ||
      "Study in UK for Indian Students | Gateway Abroad Education",
    "description":
      pageContent?.metaDescription ||
      "Study in the UK with Gateway Abroad Educations. Get expert guidance on UK universities, courses, admission process, visa assistance, and scholarships.",
    "inLanguage": "en-IN",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://www.gatewayabroadeducations.com/#website",
    },
    "about": {
      "@type": "Service",
      "name": "Study in UK Consultancy",
      "description":
        "Overseas education consultancy providing guidance for studying in the United Kingdom including university selection, admissions, visa support and scholarships.",
      "provider": {
        "@type": "Organization",
        "name": "Gateway Abroad Education",
        "url": "https://www.gatewayabroadeducations.com",
        "logo": {
          "@type": "ImageObject",
          "url":
            "https://api.gatewayabroadeducations.com/api/uploads/1766811326565-285362223.jpg",
        },
      },
      "areaServed": {
        "@type": "Country",
        "name": "India",
      },
    },
  };


    return (
        <>
          <Script
        id="study-country-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(studyUkSchema),
        }}
      />


        <StudyInUk country={country} content={pageContent} />
        </>
    );
};

export default UkPage;