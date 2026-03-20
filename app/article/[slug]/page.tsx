import ArticleClient from "@/components/pages/ArticleDetails";
import Script from "next/script";
import DOMPurify from 'isomorphic-dompurify';
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
      article?.description ||
      "Expert study abroad & test prep guidance from Gateway Abroad.";
    const keyword = article?.meta?.keywords?.map((k) => k).join(", ");
    const ogImage =
      article?.coverImage
        ? `https://uat.gatewayabroadeducations.com/uploads/${article.coverImage}`
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

function sanitizeContent(html) {
  if (!html) return '';

  return DOMPurify.sanitize(html);
}

function processContentWithIds(htmlContent) {
  if (!htmlContent) return htmlContent;

  // Use regex to add IDs to headings
  let processedContent = htmlContent;

  // Add IDs to h2 elements
  let h2Index = 0;
  processedContent = processedContent.replace(/<h2(.*?)>(.*?)<\/h2>/g, (match, attrs, content) => {
    h2Index++;
    const id = `h2-${h2Index}-${Date.now()}`;
    return `<h2 id="${id}"${attrs}>${content}</h2>`;
  });

  // Add IDs to h3 elements
  // let h3Index = 0;
  // processedContent = processedContent.replace(/<h3(.*?)>(.*?)<\/h3>/g, (match, attrs, content) => {
  //     h3Index++;
  //     const id = `h3-${h3Index}-${Date.now()}`;
  //     return `<h3 id="${id}"${attrs}>${content}</h3>`;
  // });

  return processedContent;
}

function extractTableOfContents(htmlContent) {
  if (!htmlContent) return [];

  // Parse HTML content to extract headings
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/g;
  // const h3Regex = /<h3[^>]*>(.*?)<\/h3>/g;

  const headings = [];
  let h2Matches = [...htmlContent.matchAll(h2Regex)];
  // let h3Matches = [...htmlContent.matchAll(h3Regex)];

  // Process h2 elements
  h2Matches.forEach((match, index) => {
    const content = match[1].replace(/<[^>]*>/g, ''); // Remove HTML tags
    const h2Id = `h2-${index + 1}-${Date.now()}`;
    const h2Item = {
      id: h2Id,
      text: content || `Section ${index + 1}`,
      level: 2,
      children: []
    };
    headings.push(h2Item);
  });

  // Process h3 elements
  // h3Matches.forEach((match, index) => {
  //     const content = match[1].replace(/<[^>]*>/g, '');
  //     const h3Id = `h3-${index + 1}-${Date.now()}`;

  //     // Find parent h2 (associate with last h2)
  //     let parentH2 = headings.length > 0 ? headings[headings.length - 1] : null;

  //     if (parentH2 && parentH2.level === 2) {
  //         parentH2.children.push({
  //             id: h3Id,
  //             text: content || `Subsection ${index + 1}`,
  //             level: 3
  //         });
  //     } else {
  //         // Independent h3
  //         headings.push({
  //             id: h3Id,
  //             text: content || `Section ${index + 1}`,
  //             level: 3,
  //             children: [],
  //             isIndependent: true
  //         });
  //     }
  // });

  return headings;
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
  const sanitizedContent = sanitizeContent(decodedContent);
  const processedContent = processContentWithIds(sanitizedContent);

  // Extract table of contents
  const tableOfContents = extractTableOfContents(sanitizedContent);

  // Fetch latest articles
  let latestArticles = [];
  try {
    const latestRes = await fetch(
      'https://uat.gatewayabroadeducations.com/api/v1/web/blog?page=1&limit=5',
      { next: { revalidate: 21600 } }
    );
    if (latestRes.ok) {
      const latestData = await latestRes.json();
      latestArticles = latestData?.data?.filter(
        articleItem => articleItem.slug !== slug
      ) || [];
    }
  } catch (error) {
    console.error('Error fetching latest articles:', error);
  }

  // Fetch comments
  let comments = [];
  try {
    const commentsRes = await fetch(
      `https://uat.gatewayabroadeducations.com/api/v1/web/comments/${article._id}`,
      { next: { revalidate: 3600 } }
    );
    if (commentsRes.ok) {
      const commentsData = await commentsRes.json();
      comments = commentsData?.data?.comments || [];
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
  }

 


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
      <Script id="smooth-scroll-script" strategy="afterInteractive">
        {`
          document.addEventListener('DOMContentLoaded', function() {
            // Handle anchor clicks with offset
            document.addEventListener('click', function(e) {
              if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                  const offset = 120; // Adjust this value for your header height
                  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                  
                  window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                  });
                  
                  // Update URL without page reload
                  history.pushState(null, null, '#' + targetId);
                }
              }
            });
            
            // Also handle URL hash on page load
            if (window.location.hash) {
              setTimeout(() => {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                  const offset = 120;
                  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                  window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                  });
                }
              }, 100);
            }
          });
        `}
      </Script>
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
        decodedContent={decodedContent}
        processedContent={processedContent}
        tableOfContents={tableOfContents}
        latestArticles={latestArticles}
        comments={comments}
        slug={slug}
      />
    </>
  );
}
