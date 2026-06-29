import StudyAbroadPage from "@/components/pages/studyAbroad";
import { serverInstance } from "@/services/axiosInstance";
import PageServices from "@/services/PageServices";
import Script from "next/script";

const pageContentPromise = async ({ slug }) => {
    try {
        const response = await serverInstance.get(`/page/${slug}?type=city_page`);
        return response.data?.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // or handle the error as needed
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const pageContent = await pageContentPromise({ slug });

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
            canonical: pageContent.canonicalUrl,
        },
    };
}
export default async function StudyAbroad({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;


  const pageContent = await pageContentPromise({
    slug,
  });

  const pageUrl = `https://www.gatewayabroadeducations.com/study-abroad/bangalore`;

  const logo =
    "https://api.gatewayabroadeducations.com/api/uploads/1778565858071-59950305.webp";

   const faq =
    await PageServices
        .getAllFaqForFront(slug);


  
  return (
    <>
      {/* Educational Organization Schema */}
      <Script
        id="edu-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",

            "@type":
              "EducationalOrganization",

            name: "Gateway Abroad Education",

            url: pageUrl,

            logo: logo,

            image: logo,

            description:
              pageContent?.metaDescription ||
              "Gateway Abroad Education helps students study abroad.",

            address: {
              "@type": "PostalAddress",

              addressLocality:
                pageContent?.city ||
                "Bengaluru",

              addressRegion:
                pageContent?.state ||
                "Karnataka",

              addressCountry: "India",
            },

            aggregateRating: {
              "@type":
                "AggregateRating",

              ratingValue: "5",

              ratingCount: "1599",

              bestRating: "5",

              worstRating: "1",
            },
          }),
        }}
      />

      {/* Local Business Schema */}
      <Script
        id="local-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",

            "@type": "LocalBusiness",

            name:
              "Gateway Abroad Education",

            image: logo,

            url: pageUrl,

            telephone:
              pageContent?.phone ||
              "+918302092630",

            address: {
              "@type": "PostalAddress",

              streetAddress:
                pageContent?.address ||
                "1st Floor BHIVE Workspace, Mahalakshmi Chambers, 29, Mahatma Gandhi Rd, near Trinity Metro Station",

              addressLocality:
                pageContent?.city ||
                "Bengaluru",

              postalCode:
                pageContent?.postalCode ||
                "560001",

              addressRegion:
                pageContent?.state ||
                "Karnataka",

              addressCountry: "IN",
            },

            geo: {
              "@type":
                "GeoCoordinates",

              latitude:
                pageContent?.latitude ||
                12.973674609320545,

              longitude:
                pageContent?.longitude ||
                77.61658997671694,
            },

            openingHoursSpecification:
              [
                {
                  "@type":
                    "OpeningHoursSpecification",

                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],

                  opens: "09:00",

                  closes: "18:00",
                },
              ],
          }),
        }}
      />



      

      <StudyAbroadPage
        content={pageContent}
        faq = {faq}
      />
    </>
  );
}