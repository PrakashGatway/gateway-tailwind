import SingleBlogPage from "@/components/pages/blogDetail";

export async function generateStaticParams() {
  try {
    const res = await fetch("https://api.gatewayabroadeducations.com/api/v1/blog?all=true", {
      next: { revalidate: 21600 }
    })
    const data = await res.json();

    const blogs = data?.data?.blog;
    return blogs
      .filter((b) => typeof b?.Slug === "string" && b.Slug.trim() !== "")
      .map((b) => ({
        slug: b.Slug,
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    // const response = await axios.get(`https://api.gatewayabroadeducations.com/api/v1/blog/${slug}`, { next: { revalidate: 3600 } });
    // const res = await fetch(`https://api.gatewayabroadeducations.com/api/v1/blog/${slug}`, { next: { revalidate: 3600 } });
    // const data = await res.json();
    const res = await fetch(
      `https://api.gatewayabroadeducations.com/api/v1/blog/${slug}`,
      { next: { revalidate: 21600 } }
    );
    const data = await res.json();
    const seoData = data?.data?.blog;
    // const seoData = response?.data?.data?.blog;

    const defaultTitle = "Blog - Gateway Abroad | Study Abroad Tips & Updates";
    const defaultDescription = "Stay updated with the latest study abroad news, visa updates, test prep tips, and student success stories from Gateway Abroad.";
    const defaultImage = "https://www.gatewayabroadeducations.com/assets/img/ga-logo.svg"; // Fallback image
    const title = seoData?.blogTitle || defaultTitle;
    const description = seoData?.descriptions || defaultDescription;
    const keywords = seoData?.keyword || "study abroad blog, IELTS tips, student visa updates, university admissions, abroad education news, Gateway Abroad blog";
    const ogImage = seoData?.image ? `https://api.gatewayabroadeducations.com/api/uploads/${seoData.image}` : defaultImage;

    return {
      metadataBase: new URL('https://www.gatewayabroadeducations.com'),
      title: title,
      description: description,
      keywords: keywords,
      openGraph: {
        title: title,
        description: description,
        images: [ogImage],
        type: "article",
        site_name: "Gateway Abroad Education",
      },
      robots: {
        index: true,
        follow: true,
        maxImagePreview: "large",
        googleBot: {
          index: true,
          follow: true,
          maxImagePreview: "large",
        },
      },

      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [ogImage],
      },
      alternates: {
        canonical: `https://www.gatewayabroadeducations.com/blog-description/${slug}`,
      }
    };

  } catch (error) {
    const fallbackTitle = "Blog Post - Gateway Abroad";
    const fallbackDescription = "Read insightful articles on studying abroad, test preparation, and visa guidance.";
    const fallbackImage = "https://www.gatewayabroadeducations.com/assets/img/ga-logo.svg";

    return {
      metadataBase: new URL('https://www.gatewayabroadeducations.com'),
      title: fallbackTitle,
      description: fallbackDescription,
      keywords: "study abroad blog, Gateway Abroad",
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        images: [fallbackImage],
        type: "article",
        site_name: "Gateway Abroad Education",
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDescription,
        images: [fallbackImage],
      },
      alternates: {
        canonical: `https://www.gatewayabroadeducations.com/blog-description/${slug}`,
      }
    };
  }
}

function sanitizeContent(html) {
  if (typeof window === "undefined") return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const allowedTags = [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "blockquote",
    "pre",
    "code",
    "span"
  ];

  const walk = (node) => {
    [...node.children].forEach((child) => {
      // ❌ Remove disallowed tags completely
      if (!allowedTags.includes(child.tagName.toLowerCase())) {
        child.replaceWith(...child.childNodes);
        return;
      }

      // ❌ Remove all styling & editor garbage
      [...child.attributes].forEach((attr) => {
        if (
          attr.name !== "href" &&
          attr.name !== "src" &&
          attr.name !== "alt"
        ) {
          child.removeAttribute(attr.name);
        }
      });

      walk(child);
    });
  };

  walk(doc.body);

  // return doc.body.innerHTML.trim();
  return {
    __html: DOMPurify.sanitize(doc.body.innerHTML.trim(), {
      FORBID_ATTR: ["style", "class"],
    })
  };
}

export default async function SingleBlog({ params }) {
  const { slug } = await params;
  const res = await fetch(`https://api.gatewayabroadeducations.com/api/v1/blog/${slug}`, { next: { revalidate: 3600 } });
  const data = await res.json();
  const blogData = data?.data?.blog;

  return <SingleBlogPage data={{ ...blogData, blogDescription: sanitizeContent(blogData?.blogDescription) }} slug={slug} />;
}