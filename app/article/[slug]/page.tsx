import ArticleClient from "@/components/pages/ArticleDetails";


export const revalidate = 21600;

export async function generateStaticParams() {
    try {
        const res = await fetch("https://uat.gatewayabroadeducations.com/api/v1/web/blog?limit=1000", {
            next: { revalidate: 21600 },
        });
        if (!res.ok) {
            console.error("❌ Failed to fetch blog slugs for static generation");
            return [];
        }
        const data = await res.json();
        const blogs = data?.data || [];
        return blogs.map((blog) => ({
            slug: blog.slug,
        }));
    } catch (error) {
        console.error("⚠️ Error generating static params:", error);
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;

    try {
        const res = await fetch(
            `https://uat.gatewayabroadeducations.com/api/v1/web/blog/${slug}`,
            { next: { revalidate: 21600 } }
        );

        if (!res.ok) throw new Error(`Failed to fetch metadata: ${res.status}`);

        const data = await res.json();
        const article = data?.data;

        const title =
            article?.title || "Blog - Gateway Abroad | Study Abroad Tips & Updates";
        const description =
            article?.description ||
            "Expert study abroad & test prep guidance from Gateway Abroad.";
        const ogImage =
            article?.image
                ? `https://uat.gatewayabroadeducations.com/uploads/${article.image}`
                : "https://www.gatewayabroadeducations.com/img/ga-logo.svg";

        return {
            metadataBase: new URL("https://www.gatewayabroadeducations.com"),
            title,
            description,
            keywords:
                "study abroad, IELTS, GMAT, GRE, TOEFL, PTE, SAT, Gateway Abroad, blog",
            openGraph: {
                title,
                description,
                images: [ogImage],
            },
            alternates: {
                canonical: `https://www.gatewayabroadeducations.com/article/${slug}`,
            },
        };
    } catch (error) {
        console.error("⚠️ Metadata generation error:", error);
        return {
            title: "Article Post | Gateway Abroad",
            description:
                "Get expert advice on IELTS, GMAT, GRE, study abroad, and more.",
            keywords:
                "study abroad, IELTS, GMAT, GRE, TOEFL, PTE, SAT, Gateway Abroad",
        };
    }
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params;

    const res = await fetch(
        `https://uat.gatewayabroadeducations.com/api/v1/web/blog/${slug}`,
        { next: { revalidate: 21600 } }
    );

    if (!res.ok) {
        console.error(`❌ Failed to fetch blog: ${slug}`);
        return null;
    }

    const data = await res.json();
    const article = data?.data;

    return (
        <ArticleClient
            article={article}
            similarArticles={[]} // You can later add fetch logic here
            latestArticles={[]}
        />
    );
}
