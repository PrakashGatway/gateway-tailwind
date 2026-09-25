import Index from "@/components/home/HomePage";
import { serverInstance } from "@/services/axiosInstance";
import PageServices from "@/services/PageServices";

export async function generateMetadata() {
  const response = await serverInstance.get(`/page/home?type=home_page`);

  const pageContent = response.data.data;

  return {
    metadataBase: new URL("https://www.gatewayabroadeducations.com"),
    title: pageContent?.metaTitle || "Default Study Abroad Title",
    description:
      pageContent?.metaDescription || "Default study abroad description.",
    openGraph: {
      title: pageContent?.metaTitle || "Study Abroad",
      description:
        pageContent?.metaDescription || "Learn about study abroad programs",
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
    robots: {
      index: true,
      follow: true,
    },
    keywords: pageContent?.keywords || "study abroad, international education",
    alternates: {
      canonical: pageContent.canonicalUrl,
    },
  };
}

export const revalidate = 60; // revalidate every 6 hours

export default async function Home({ slug }) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://www.gatewayabroadeducations.com/#organization",
    name: "Gateway Abroad Education",
    url: "https://www.gatewayabroadeducations.com/",
    logo: "https://api.gatewayabroadeducations.com/api/uploads/1766116981292-730003835.jpg",
    image:
      "https://api.gatewayabroadeducations.com/api/uploads/1766116981292-730003835.jpg",
    telephone: "+91-8302092630",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "105, First Floor, Geetanjali Tower, Ajmer Road, Civil Lines",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      postalCode: "302006",
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
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
    sameAs: [
      "https://www.facebook.com/Gatewayabroadjeducation1/",
      "https://www.instagram.com/gatewayabroadeducation",
      "https://www.linkedin.com/company/gateway-abroad-jaipur1",
    ],
  };

  const [
    aboutPage,
    course,
    testimonials,
    youtubeVideo,
    studentSlider,
    studentHome,
    faq,
  ] = await Promise.all([
    PageServices.getAboutPageById()
      .then((res) => res?.data || null)
      .catch(() => null),
    PageServices.getCourse()
      .then((res) => res?.data || null)
      .catch(() => null),
    PageServices.getTestimonial()
      .then((res) => res?.data || null)
      .catch(() => null),
    PageServices.getYoutubeVideo()
      .then((res) => res?.data || null)
      .catch(() => null),
    PageServices.getStudentSlider()
      .then((res) => res?.data || null)
      .catch(() => null),
    PageServices.getStudentHome()
      .then((res) => res?.data || null)
      .catch(() => null),
    PageServices.getAllFaqForFront("home")
      .then((res) => res?.data || null)
      .catch(() => null),
  ]);

  const response = await serverInstance.get(`/page/home?type=home_page`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <Index
        aboutPage={aboutPage}
        homePage={response?.data?.data}
        course={course}
        testimonials={testimonials}
        youtubeVideo={youtubeVideo}
        studentSlider={studentSlider}
        studentHome={studentHome}
        faq={faq}
      />
    </>
  );
}
