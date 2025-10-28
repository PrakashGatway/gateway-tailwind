import NotFound from "@/app/not-found";
import StudyInUk from "@/components/pages/studyInUk";
import { serverInstance } from "@/services/axiosInstance";

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

    return (
        <StudyInUk country={country} content={pageContent} />
    );
};

export default UkPage;