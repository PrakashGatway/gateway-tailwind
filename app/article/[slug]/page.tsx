import ArticleClient from "@/components/pages/ArticleDetails";
import Script from "next/script";
import { prepareBlogContent } from "@/lib/blog-content";
// export const revalidate = 21600;

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
      article?.title || "Article - Gateway Abroad | Study Abroad Tips & Updates";
    const description =
      article?.meta?.metaDescription || article?.description ||
      "Expert study abroad & test prep guidance from Gateway Abroad.";
    const keyword = article?.meta?.keywords?.map((k) => k).join(", ");
    const ogImage = article?.coverImage
      ? /^https?:\/\//i.test(article.coverImage)
        ? article.coverImage
        : `https://uat.gatewayabroadeducations.com/uploads/${article.coverImage}`
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


function decodeContent(content) {
  if (!content) return '';
  try {
    return decodeURIComponent(escape(atob(content)));
  } catch (error) {
    console.error('Error decoding content:', error);
    return content || '';
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  const slugdata = slug.includes("polysyllabic");
  const isDiphthong = slug.includes("diphthong");

  // Fetch article data
  const res = await fetch(
    `https://uat.gatewayabroadeducations.com/api/v1/web/blog/${slug}`,
    { next: { revalidate: 21600 } }
  );

  if (!res.ok) {
    console.error(`❌ Failed to fetch blog: ${slug}`);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Article Not Found</h1>
          <a
            href="/article"
            className="inline-flex items-center bg-[#E12827] text-white px-6 py-3 rounded-lg hover:bg-[#c82322] transition-colors font-medium"
          >
            Back to Articles
          </a>
        </div>
      </div>
    );
  }

  const data = await res.json();
  const article = data?.data;

  // Decode and process content
  const decodedContent = decodeContent(article.content);
  const { html: processedContent, headings: tableOfContents } = prepareBlogContent(decodedContent);

  // Related articles and comments are independent; fetch them together.
  const [latestArticles, comments] = await Promise.all([
    fetch('https://uat.gatewayabroadeducations.com/api/v1/web/blog?page=1&limit=5',
      { next: { revalidate: 21600 } })
      .then(async latestRes => latestRes.ok
        ? (await latestRes.json())?.data?.filter(articleItem => articleItem.slug !== slug) || []
        : [])
      .catch(error => { console.error('Error fetching latest articles:', error); return []; }),
    fetch(`https://uat.gatewayabroadeducations.com/api/v1/web/comments/${article._id}`,
      { next: { revalidate: 3600 } })
      .then(async commentsRes => commentsRes.ok
        ? (await commentsRes.json())?.data?.comments || []
        : [])
      .catch(error => { console.error('Error fetching comments:', error); return []; }),
  ]);

 


  // Schema definitions
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.gatewayabroadeducations.com/article/${slug}`
    },
    "headline": "A comprehensive guide on polysyllabic and monosyllabic words",
    "description": "Understand the difference between polysyllabic and monosyllabic words in English...",
    "image": "https://uat.gatewayabroadeducations.com/uploads/1765364096888-719265531.png",
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
    "description": "A diphthong is a complicated spoken sound that starts with one vowel...",
    "image": "https://uat.gatewayabroadeducations.com/uploads/1765363725464-602544642.png",
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
        processedContent={processedContent}
        tableOfContents={tableOfContents}
        latestArticles={latestArticles}
        comments={comments}
        slug={slug}
      />
    </>
  );
}
