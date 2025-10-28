import StudyAbroadPage from "@/components/pages/studyAbroad";
import { serverInstance } from "@/services/axiosInstance";

const pageContentPromise = async () => {
    try {
        const response = await serverInstance.get(`/page/main?type=city_page`);
        return response.data?.data;
    } catch (error) {
        return null; // or handle the error as needed
    }
}

export const revalidate = 21600; 

export async function generateMetadata() {
    const pageContent = await pageContentPromise();

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
                    alt: pageContent?.metaTitle || "Study Abroad",
                },
            ],
            type: "website",
            site_name: "Gateway Abroad Education",
            url: pageContent?.canonicalUrl || "https://www.gatewayabroadeducations.com/study-abroad",
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

export default async function StudyAbroad() {
    const pageContent = await pageContentPromise();
    return <StudyAbroadPage content={pageContent} />;
}