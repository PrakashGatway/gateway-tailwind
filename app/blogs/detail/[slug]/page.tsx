import SingleBlogPage from "@/components/pages/blogDetail";
import DOMPurify from 'isomorphic-dompurify';

// export async function generateStaticParams() {
//   try {
//     const res = await fetch("https://api.gatewayabroadeducations.com/api/v1/blog?all=true", {
//       next: { revalidate: 21600 }
//     })
//     const data = await res.json();

//     const blogs = data?.data?.blog;
//     return blogs
//       .filter((b) => typeof b?.Slug === "string" && b.Slug.trim() !== "")
//       .map((b) => ({
//         slug: b.Slug,
//       }));
//   } catch (error) {
//     console.error("Error generating static params:", error);
//     return [];
//   }
// }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(
      `https://api.gatewayabroadeducations.com/api/v1/blog/${slug}`,
      { next: { revalidate: 21600 } }
    );
    const data = await res.json();
    const seoData = data?.data?.blog;

    const defaultTitle = "Blog - Gateway Abroad | Study Abroad Tips & Updates";
    const defaultDescription = "Stay updated with the latest study abroad news, visa updates, test prep tips, and student success stories from Gateway Abroad.";
    const defaultImage = "https://www.gatewayabroadeducations.com/assets/img/ga-logo.svg";
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
   
    };
  }
}

function sanitizeContent(html) {
  if (!html) return '';
  
  // Use DOMPurify for server-side sanitization
  const cleanHtml = DOMPurify.sanitize(html)
  
  return cleanHtml;
}

export default async function SingleBlog({ params }) {
  const { slug } = await params;
  
  try {
    // Fetch current blog data
    const res = await fetch(`https://api.gatewayabroadeducations.com/api/v1/blog/${slug}`, { 
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch blog: ${res.status}`);
    }
    
    const data = await res.json();
    const blogData = data?.data?.blog;
    
    if (!blogData) {
      throw new Error('Blog data not found');
    }
    
    // Fetch all blogs for similar blogs and navigation
    const allBlogsRes = await fetch("https://api.gatewayabroadeducations.com/api/v1/blog?limit=5", {
      next: { revalidate: 3600 }
    });
    
    const allBlogsData = await allBlogsRes.json();
    const allBlogs = allBlogsData?.data?.blog || [];
    
    // Filter out current blog from all blogs
    const filteredBlogs = allBlogs.filter(blog => blog.Slug !== slug);
    
    // Find similar blogs (same category)
    const similarBlogs = filteredBlogs
    
    // Get adjacent blogs for navigation
    const sortedBlogs = [...filteredBlogs, blogData]
      .filter(blog => blog && blog.Slug)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const currentIndex = sortedBlogs.findIndex(blog => blog.Slug === slug);
    const adjacentBlogs = {
      prevBlog: sortedBlogs[currentIndex + 1] || null,
      nextBlog: sortedBlogs[currentIndex - 1] || null
    };
    
    // Sanitize blog content
    const sanitizedContent = sanitizeContent(blogData?.blogDescription);
    
    return (
      <SingleBlogPage 
        blogData={blogData}
        allBlogs={filteredBlogs}
        similarBlogs={similarBlogs}
        adjacentBlogs={adjacentBlogs}
        sanitizedContent={sanitizedContent}
        slug={slug}
      />
    );
    
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-6">The requested blog post could not be found.</p>
        <a 
          href="/blog" 
          className="bg-[#E12827] text-white px-6 py-3 rounded-md hover:bg-[#c82322] transition duration-200"
        >
          Back to Blog
        </a>
      </div>
    );
  }
}