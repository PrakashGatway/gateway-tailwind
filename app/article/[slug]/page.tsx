import ArticleClient from "@/components/pages/ArticleDetails";
import Script from "next/script";

// export const revalidate = 21600;

// export async function generateStaticParams() {
//     try {
//         const res = await fetch("https://uat.gatewayabroadeducations.com/api/v1/web/blog?limit=1000", {
//             next: { revalidate: 21600 },
//         });
//         if (!res.ok) {
//             console.error("❌ Failed to fetch blog slugs for static generation");
//             return [];
//         }
//         const data = await res.json();
//         const blogs = data?.data || [];
//         return blogs.map((blog) => ({
//             slug: blog.slug,
//         }));
//     } catch (error) {
//         console.error("⚠️ Error generating static params:", error);
//         return [];
//     }
// }

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
            article?.title || "Article - Gateway Abroad | Study Abroad Tips & Updates";
        const description =
            article?.description ||
            "Expert study abroad & test prep guidance from Gateway Abroad.";
        const keyword = article?.meta?.keywords?.map((k) => k).join(", ");
        const ogImage =
            article?.coverImage
                ? `https://uat.gatewayabroadeducations.com/api/uploads/${article.coverImage}`
                : "https://www.gatewayabroadeducations.com/img/ga-logo.svg";

        return {
            metadataBase: new URL("https://www.gatewayabroadeducations.com"),
            title,
            description,
            keywords: keyword ||
                "study abroad, IELTS, GMAT, GRE, TOEFL, PTE, SAT, Gateway Abroad, blog",
            openGraph: {
                title,
                description,
                images: [ogImage],
            },
            robots: {
                maxImagePreview: "large",
            },
            alternates: {
                canonical: `https://www.gatewayabroadeducations.com/article/${slug}`,
            },
        };
    } catch (error) {
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

        const slugdata = slug.includes("polysyllabic")

        const isDiphthong = slug.includes("diphthong");

        console.log(isDiphthong)
    console.log(slugdata)

     const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.gatewayabroadeducations.com/article/${slug}`
    },
    "headline": "A comprehensive guide on polysyllabic and monosyllabic words",
    "description":
      "Understand the difference between polysyllabic and monosyllabic words in English. This guide explains their meanings, examples, and how they affect pronunciation and rhythm. Improve your vocabulary, speaking, and writing skills with practical tips to recognize and use both types of words effectively in daily communication and exams like IELTS or TOEFL.",
    "image":
      "https://uat.gatewayabroadeducations.com/uploads/1765364096888-719265531.png",
    "author": {
      "@type": "Organization",
      "name": "Gateway Abroad Education",
      "url": "https://www.gatewayabroadeducations.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Gateway Abroad Education",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.gatewayabroadeducations.com/img/ga-logo.svg"
      }
    },
    "datePublished": "2025-11-11"
  };


  const diphthongSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.gatewayabroadeducations.com/article/what-is-a-diphthong"
    },
    "headline": "What is a Diphthong? Definition and Examples",
    "description":
      "A diphthong is a complicated spoken sound that starts with one vowel and then smoothly transitions into another within the same syllable. If you've ever noticed vowel sounds that glide from one to another—like in coin, loud, or fail—you've encountered diphthongs.",
    "image":
      "https://uat.gatewayabroadeducations.com/uploads/1765363725464-602544642.png",
    "author": {
      "@type": "Organization",
      "name": "Gateway Abroad Education",
      "url": "https://www.gatewayabroadeducations.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Gateway Abroad Education",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.gatewayabroadeducations.com/img/ga-logo.svg"
      }
    },
    "datePublished": "2025-11-26"
  };


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

        <>

        {slugdata && (
        <Script
          id="blogposting-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogSchema),
          }}
        />
      )}

       {isDiphthong && (
        <Script
          id="diphthong-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(diphthongSchema),
          }}
        />
      )}
        


        <ArticleClient
            article={article}
            similarArticles={[]} // You can later add fetch logic here
            latestArticles={[]}
        />
        
        </>
        
    );
}
