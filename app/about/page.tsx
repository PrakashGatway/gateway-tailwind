


import About from "@/components/pages/aboutUs";
import { serverInstance } from "@/services/axiosInstance";

export async function generateMetadata() {
  try {
    const response = await serverInstance.get(`/page/about?type=about_page`);
    const pageData = response?.data?.data;

    const seoData = {
      title: pageData?.metaTitle || "About Gateway Abroad Education | Overseas Education Consultants in India",
      description: pageData?.metaDescription || "Learn about Gateway Abroad education's mission, team, and 16+ years of expertise in overseas education.",
      keywords: pageData?.keywords?.length > 0 ? pageData.keywords.join(', ') : "about Gateway Abroad, our team, overseas education consultants, education experts",
      ogTitle: pageData?.metaTitle || "About Gateway Abroad Education | Overseas Education Consultants in India",
      ogDescription: pageData?.metaDescription || "Learn about Gateway Abroad education's mission, team, and 16+ years of expertise in overseas education.",
      ogImage: pageData?.pageContent?.heroImage || "/img/ga-logo.svg",
      canonical: pageData?.canonicalUrl || "https://www.gatewayabroadeducations.com/about"
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
        title: seoData.ogTitle,
        description: seoData.ogDescription,
        images: [seoData.ogImage],
      },
      alternates: { canonical: seoData.canonical },
    };
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    
    return {
      metadataBase: new URL('https://www.gatewayabroadeducations.com'),
      title: "About Gateway Abroad Education | Overseas Education Consultants in India",
      description: "Learn about Gateway Abroad education's mission, team, and 16+ years of expertise in overseas education.",
      keywords: "about Gateway Abroad, our team, overseas education consultants, education experts",
      openGraph: {
        title: "About Gateway Abroad Education | Overseas Education Consultants in India",
        description: "Learn about Gateway Abroad education's mission, team, and 16+ years of expertise in overseas education.",
        images: ["/img/ga-logo.svg"],
        url: "https://www.gatewayabroadeducations.com/about",
        type: "website",
        site_name: "Gateway Abroad Education",
      },
      twitter: {
        card: "summary_large_image",
        title: "About Gateway Abroad | Our Story & Team",
        description: "Discover our mission and the team behind Gateway Abroad's success.",
        images: ["/img/ga-logo.svg"],
      },
      alternates: { canonical: "https://www.gatewayabroadeducations.com/about" },
    };
  }
}

export const revalidate = 21600;

async function AboutPage() {
  try {
    const response = await serverInstance.get(`/page/about?type=about_page`);
    const aboutPageData = response?.data?.data;
    
    return <About aboutPage={aboutPageData} />;
  } catch (error) {
    console.error("Error fetching about page data:", error);
    return <About aboutPage={null} />;
  }
}

export default AboutPage;












// import About from "@/components/pages/aboutUs";
// import PageServices from "@/services/PageServices";

// export async function generateMetadata() {
//   const seoData = {
//     title: "About Gateway Abroad Education | Overseas Education Consultants in india",
//     description: "Learn about Gateway Abroad education's mission, team, and 16+ years of expertise in overseas education.",
//     keywords: "about Gateway Abroad, our team, overseas education consultants, education experts",
//     ogTitle: "About Gateway Abroad Education | Overseas Education Consultants in india",
//     ogDescription: "Learn about Gateway Abroad education's mission, team, and 16+ years of expertise in overseas education.",
//     ogImage: "/img/ga-logo.svg",
//     twitterTitle: "About Gateway Abroad | Our Story & Team",
//     twitterDescription: "Discover our mission and the team behind Gateway Abroad's success.",
//     twitterImage: "/img/ga-logo.svg",
//     canonical: "https://www.gatewayabroadeducations.com/about"
//   };

//   return {
//     metadataBase: new URL('https://www.gatewayabroadeducations.com'),
//     title: seoData.title,
//     description: seoData.description,
//     keywords: seoData.keywords,
//     openGraph: {
//       title: seoData.ogTitle,
//       description: seoData.ogDescription,
//       images: [seoData.ogImage],
//       url: seoData.canonical,
//       type: "website",
//       site_name: "Gateway Abroad Education",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: seoData.twitterTitle,
//       description: seoData.twitterDescription,
//       images: [seoData.twitterImage],
//     },
//     alternates: { canonical: seoData.canonical },
//   };
// }

// export const revalidate = 21600; // revalidate every 6 hours


// async function AboutPage() {
//   const [
//     aboutPage,
//     teamMembers
//   ] = await Promise.all([
//     PageServices.getAboutPageById().then(res => res?.data || null).catch(() => null),
//     PageServices.getMember().then(res => res?.data || null).catch(() => null)
//   ]);
//   return (
//     <About aboutPage={aboutPage} teamMembers={teamMembers} />
//   );
// }

// export default AboutPage;