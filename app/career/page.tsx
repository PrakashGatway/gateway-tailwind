import CareerPage from "@/components/pages/career";
import PageServices from "@/services/PageServices";


export const revalidate = 21600; // revalidate every 6 hours

export async function generateMetadata() {
  const seoData = {
    title: "Join Gateway Abroad education Team | counselor, trainer, visa expert, Coach",
    description: "Launch your career in study abroad! Join Gateway Abroad Education as a counselor, IELTS trainer, or visa expert. Grow with industry leaders & empower student dreams.",
    keywords: "Career Gateway Abroad jaipur, counselor, trainer, visa expert, coach",
    ogTitle: "Join Gateway Abroad education Team | counselor, trainer, visa expert, Coach",
    ogDescription: "Launch your career in study abroad! Join Gateway Abroad Education as a counselor, IELTS trainer, or visa expert. Grow with industry leaders & empower student dreams",
    ogImage: "/img/ga-logo.svg",
    twitterTitle: "Work at Gateway Abroad - Career Opportunities",
    twitterDescription: "Join our team of education experts and help students achieve their global dreams.",
    twitterImage: "/img/ga-logo.svg",
    canonical: "https://www.gatewayabroadeducations.com/career"
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

async function Career() {
  const [
    careerPage,
    jobFormData
  ] = await Promise.all([
    PageServices.getCareerPageById().then(res => res?.data || null).catch(() => null),
    PageServices.getJobData().then(res => res?.data || null).catch(() => null)
  ]);

  return (
    <CareerPage careerPage={careerPage} jobFormData={jobFormData} />
  );
}

export default Career;