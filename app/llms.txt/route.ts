export const revalidate = 21600;

async function getBlogs() {
    const res = await fetch(
        "https://api.gatewayabroadeducations.com/api/v1/blog?limit=100",
        {
            cache: "no-store",
        }
    );

    const data = await res.json();
    return data?.data?.blog || [];
}

async function getArt() {
    const res = await fetch(
        "https://uat.gatewayabroadeducations.com/api/v1/web/blog?limit=500",
        {
            next: { revalidate: 21600 },
        }
    );
    const data = await res.json();
    return data?.data || [];
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


export async function GET() {
    const baseUrl = "https://www.gatewayabroadeducations.com";

    const [blogs, cityPages, countryPages, arts] = await Promise.all([
        getBlogs(),
        getPagesByType("city_page"),
        getPagesByType("country_page"),
        getArt(),
    ])

    const blogLinks = blogs
        .map(
            (blog: any) =>
                `- [${blog.blogTitle}](${baseUrl}/blog-description/${blog.Slug?.toLowerCase()}) - ${blog.descriptions}`
        )
        .join("\n");
    const artLinks = arts
        .map(
            (blog: any) =>
                `- [${blog.title}](${baseUrl}/article/${blog.slug}) - ${blog.description}`
        )
        .join("\n");

    const cityLinks = cityPages
        .map(
            (blog: any) =>
                `- [${blog.title}](${baseUrl}/study-abroad/${blog.slug}) - ${blog.metaDescription}`
        )
        .join("\n");

        const countryLinks = countryPages
        .map(
            (blog: any) =>
                `- [${blog.title}](${baseUrl}/study-in-${blog.slug}) - ${blog.metaDescription}`
        )
        .join("\n");


    const content = `# Gateway Abroad Educations

> Study abroad consultancy and test preparation institute.

Website: ${baseUrl}

## Key Services
- Study Abroad Consulting
- Visa Assistance
- University Admissions
- IELTS Coaching
- GRE Coaching
- GMAT Coaching
- PTE Coaching

## Important Pages
- ${baseUrl}/about
- ${baseUrl}/study-abroad
- ${baseUrl}/contact

## Cities
${cityLinks}

## Countries
${countryLinks}

## Recent Blogs
${blogLinks}

## Recent Articles
${artLinks}

## Sitemap
- ${baseUrl}/sitemap.xml
`;

    return new Response(content, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}