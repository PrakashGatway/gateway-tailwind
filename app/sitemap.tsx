// app/sitemap.ts
import type { MetadataRoute } from "next";

export const revalidate = 21600;

async function getBlogs() {
  const res = await fetch("https://www.gatewayabroadeducations.com/api/v1/blog?all=true", {
    next: { revalidate: 21600 },
  });
  const data = await res.json();
  return data?.data?.blog || [];
}
async function getPagesByType(type: string) {
  const res = await fetch(
    `https://uat.gatewayabroadeducations.com/api/v1/page/list/type?type=${type}&featured=true`,
    {
      next: { revalidate: 21600 },
    }
  );
  const data = await res.json();
  return data?.data || [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.gatewayabroadeducations.com";
  const [blogs, cityPages, countryPages] = await Promise.all([
    getBlogs(),
    getPagesByType("city_page"),
    getPagesByType("country_page"),
  ]);

  const StaticURL = ['/about', '/spoken-english', '/gallary', '/course/TOEFL', '/study-abroad' ,'/course/IELTS', '/course/GRE', '/course/SAT', '/course/PTE', '/course/GMAT', '/blog', '/career', '/contact', '/study-abroad', '/study-in-uk', '/course/duolingo']

  const staticRoutes: MetadataRoute.Sitemap = StaticURL.map((item: any) => ({
    url: `${baseUrl}${item.toLowerCase()}`,
    lastModified: new Date(),
  })
  )
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
    url: `${baseUrl}/blog-description/${blog.Slug.toLowerCase()}`,
    lastModified: blog.createdAt ? new Date(blog.createdAt) : new Date(),
  }));

  const cityRoutes: MetadataRoute.Sitemap = cityPages.map((page: any) => ({
    url: `${baseUrl}/study-abroad/${page.slug?.toLowerCase()}`,
    lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
  }));

  const countryRoutes: MetadataRoute.Sitemap = countryPages.map((page: any) => ({
    url: `${baseUrl}/study-in-${page.slug?.toLowerCase()}`,
    lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
  }));

  return [...staticRoutes, ...cityRoutes,...countryRoutes, ...blogRoutes];
}
