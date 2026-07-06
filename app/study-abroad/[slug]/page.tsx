import StudyAbroadPage from "@/components/pages/studyAbroad";
import { serverInstance } from "@/services/axiosInstance";
import PageServices from "@/services/PageServices";

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

  console.log("faq", pageContent);

  return (
    <>
      {/* Educational Organization Schema */}
      {(slug == "bangalore" || slug == "jaipur") &&
        <script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "@id": `${pageUrl}#organization`,

              name: "Gateway Abroad Education",

              url: pageUrl,

              logo: logo,

              image: logo,

              description:
                pageContent?.metaDescription ||
                "Gateway Abroad Education helps students study abroad.",

              telephone: "+91-8302092630",

              address: {
                "@type": "PostalAddress",
                streetAddress: slug == "bangalore" ? "Mahalakshmi Chambers, 29 ,1st floor BHIVE Work space, Mahatma Gandhi Rd, near Trinity Metro Station" : "105A, first floor, Geetanjali Towers Geetanjali Tower, Ajmer Rd, Jai Ambey Colony, Civil Lines",
                addressLocality: pageContent?.slug,
                addressRegion: slug == "bangalore" ? "Karnataka" : "Rajasthan",
                postalCode: slug == "bangalore" ? "560001" : "302006",
                addressCountry: "IN"
              },

              sameAs: [
                "https://www.facebook.com/Gatewayabroadjeducation1/",
                "https://www.instagram.com/gatewayabroadeducation",
                "https://www.linkedin.com/company/gateway-abroad-jaipur1"
              ],

              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                ratingCount: "1599",
                bestRating: "5",
                worstRating: "1"
              }
            }),
          }}
        />
      }

      {(slug == "bangalore" || slug == "jaipur") && <script
        id="professional-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",

            "@id": `${pageUrl}#service`,

            name: "Gateway Abroad Education",

            url: pageUrl,

            image: logo,

            logo: logo,

            telephone: "+91-8302092630",

            priceRange: "$$",

            parentOrganization: {
              "@id": `${pageUrl}#organization`
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: slug == "bangalore" ? "Mahalakshmi Chambers, 29 ,1st floor BHIVE Work space, Mahatma Gandhi Rd, near Trinity Metro Station" : "105A, first floor, Geetanjali Towers Geetanjali Tower, Ajmer Rd, Jai Ambey Colony, Civil Lines",
              addressLocality: pageContent?.slug,
              addressRegion: slug == "bangalore" ? "Karnataka" : "Rajasthan",
              postalCode: slug == "bangalore" ? "560001" : "302006",
              addressCountry: "IN"
            },
            // geo: {
            //   "@type": "GeoCoordinates",

            //   latitude: pageContent?.latitude,

            //   longitude: pageContent?.longitude
            // },

            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday"
                ],
                opens: "09:00",
                closes: "18:00"
              }
            ],

            sameAs: [
              "https://www.facebook.com/Gatewayabroadjeducation1/",
              "https://www.instagram.com/gatewayabroadeducation",
              "https://www.linkedin.com/company/gateway-abroad-jaipur1"
            ]
          }),
        }}
      />
      }

      <StudyAbroadPage
        content={pageContent}
        faq={faq}
      />
    </>
  );
}