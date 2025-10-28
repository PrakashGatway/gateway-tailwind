import SingleBlogPage from "@/components/pages/blogDetail";
import axios from "axios";
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const res = await fetch("https://www.gatewayabroadeducations.com/api/v1/blog?all=true")
    const data = await res.json();

    const blogs = data?.data?.blogs || [];
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
    const response = await axios.get(`https://www.gatewayabroadeducations.com/api/v1/blog/${slug}`, { next: { revalidate: 3600 } });

    const seoData = response?.data?.data?.blog;

    const defaultTitle = "Blog - Gateway Abroad | Study Abroad Tips & Updates";
    const defaultDescription = "Stay updated with the latest study abroad news, visa updates, test prep tips, and student success stories from Gateway Abroad.";
    const defaultImage = "https://www.gatewayabroadeducations.com/assets/img/ga-logo.svg"; // Fallback image
    const title = seoData?.blogTitle || defaultTitle;
    const description = seoData?.descriptions || defaultDescription;
    const keywords = seoData?.keyword || "study abroad blog, IELTS tips, student visa updates, university admissions, abroad education news, Gateway Abroad blog";
    const ogImage = seoData?.image ? `https://www.gatewayabroadeducations.com/uploads/${seoData.image}` : defaultImage;

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
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [ogImage],
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
      }
    };
  }
}

export default async function SingleBlog({ params }) {
  const { slug } = await params;
  const res = await fetch(`https://www.gatewayabroadeducations.com/api/v1/blog/${slug}`, { next: { revalidate: 3600 } });
  const data = await res.json();

  return <SingleBlogPage data={data?.data?.blog} />;
}