import StudyAbroadPage from "@/components/pages/studyAbroad";
import { serverInstance } from "@/services/axiosInstance";

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

export default async function StudyAbroad({ params }) {
    const { slug } = await params;
    const pageContent = await pageContentPromise({ slug });
    return <StudyAbroadPage content={pageContent} />;
}