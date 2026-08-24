import { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import CourseClient from '@/components/CoursePage';
import { serverInstance } from '@/services/axiosInstance';
import PageServices from '@/services/PageServices';

interface PageProps {
  params: Promise<{ slug: string[] | string }>;
}

interface CourseData {
  pageData: any;
  faqData: any[];
  testimonials: any[];
  sliderData: any[];
}

interface SchemaData {
  breadcrumb: Record<string, any>;
  product: Record<string, any>;
}

const BASE_URL = 'https://www.gatewayabroadeducations.com';
const API_BASE_URL = 'https://uat.gatewayabroadeducations.com';
const DEFAULT_COURSE = 'sat';

const getLastSlug = (slug: string[] | string): string => {
  if (Array.isArray(slug)) {
    return slug[slug.length - 1] || DEFAULT_COURSE;
  }
  return slug || DEFAULT_COURSE;
};

const formatSlugForDisplay = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const generateBreadcrumbItems = (slugs: string[] | string, pageData: any) => {
  const items = [];
  
  items.push({
    '@type': 'ListItem',
    position: 1,
    name: 'Home',
    item: BASE_URL
  });

  let slugArray: string[] = [];
  
  if (Array.isArray(slugs)) {
    slugArray = slugs;
  } else if (slugs) {
    slugArray = [slugs];
  }

  let currentPath = '';
  slugArray.forEach((slug, index) => {
    currentPath += `/${slug}`;
    
    let displayName = formatSlugForDisplay(slug);
    
    if (index === slugArray.length - 1 && pageData) {
      displayName = pageData.title || pageData.metaTitle || displayName;
    }
    
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: displayName,
      item: `${BASE_URL}${currentPath}`
    });
  });

  return items;
};

const getBaseCourseData = cache(async (course: string) => {
  try {
    const response = await serverInstance.get(`/page/${course}?type=course_page`);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`Error fetching base course data for ${course}:`, error);
    return null;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getLastSlug(slug).toLowerCase();

  const data = await getBaseCourseData(course);

  if (data) {
    const title = data.metaTitle || data.title || `${course.toUpperCase()} Preparation`;
    const description = data.metaDescription || data.subTitle || `Best ${course} preparation course`;
    const keywords = data.keywords?.join(', ') || `${course}, preparation, course`;
    const baseUrl = `${BASE_URL}/${Array.isArray(slug) ? slug.join('/') : slug}`;
    const imageUrl = data.pageContent?.heroImage 
      ? `${API_BASE_URL}/uploads/${data.pageContent.heroImage}` 
      : null;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'website',
        url: baseUrl,
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
      alternates: {
        canonical: data.canonicalUrl || baseUrl,
      },
    };
  }

  return {
    title: `${course.toUpperCase()} Preparation Course`,
    description: `Best ${course} preparation course at Gateway Abroad`,
  };
}

async function fetchAllCourseData(course: string): Promise<CourseData> {
  const pageData = await getBaseCourseData(course);

  if (!pageData) {
    return { pageData: null, faqData: [], testimonials: [], sliderData: [] };
  }

  const pageName = pageData.title || pageData.pageName || course;

  try {
    const [faqResponse, testimonialResponse, sliderResponse] = await Promise.all([
      PageServices.getAllFaqForFront(pageName).catch(() => ({ status: 'error', data: { faq: [] } })),
      PageServices.getTestimonialByCat(pageName).catch(() => ({ status: 'error', data: { testimonial: [] } })),
      PageServices.getStudent().catch(() => ({ data: { media: [] } }))
    ]);

    return {
      pageData,
      faqData: faqResponse?.status === 'success' ? faqResponse.data || [] : [],
      testimonials: testimonialResponse?.status === 'success' ? testimonialResponse.data.testimonial || [] : [],
      sliderData: sliderResponse?.data?.media || []
    };
  } catch (error) {
    console.error('Error fetching supplementary course data:', error);
    return { pageData, faqData: [], testimonials: [], sliderData: [] };
  }
}

const generateProductSchema = (pageData: any, course: string, currentUrl: string) => {
  const courseUpper = course?.toUpperCase();
  
  const name = pageData.title || pageData.metaTitle || `${courseUpper} Coaching Class`;
  const description = pageData.metaDescription || pageData.subTitle || `Best ${course} preparation course at Gateway Abroad`;
  
  const image = pageData.pageContent?.heroImage 
    ? `${API_BASE_URL}/uploads/${pageData.pageContent.heroImage}`
    : `${BASE_URL}/img/ga-logo.svg`;

  const keywords = pageData.keywords || [course];

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: name,
    image: image,
    description: description,
    brand: {
      '@type': 'Brand',
      name: 'Gateway Abroad Education'
    },
    offers: {
      '@type': 'AggregateOffer',
      url: currentUrl,
      priceCurrency: 'INR',
      lowPrice: pageData.priceRange?.low || '5000',
      highPrice: pageData.priceRange?.high || '19000',
      offerCount: pageData.offerCount || '20'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: pageData.rating?.value || '5',
      bestRating: '5',
      worstRating: '1',
      ratingCount: pageData.rating?.count || '1000'
    },
    keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords
  };
};

const getCourseSchema = (pageData: any, slugs: string[] | string): SchemaData => {
  const fullPath = Array.isArray(slugs) ? slugs.join('/') : slugs;
  const currentUrl = `${BASE_URL}/${fullPath}`;
  
  const course = getLastSlug(slugs);
  const breadcrumbItems = generateBreadcrumbItems(slugs, pageData);
  const productSchema = generateProductSchema(pageData, course, currentUrl);

  return {
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems
    },
    product: productSchema
  };
};

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  const course = getLastSlug(slug).toLowerCase();
  const { pageData, faqData, testimonials, sliderData } = await fetchAllCourseData(course);
  
  if (!pageData) {
    notFound();
  }
  
  const schema = getCourseSchema(pageData, slug);
  const pathId = Array.isArray(slug) ? slug.join('-') : slug;

  return (
    <>
      <Script
        id={`breadcrumb-schema-${pathId}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema.breadcrumb),
        }}
        strategy="afterInteractive"
      />

      <Script
        id={`product-schema-${pathId}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema.product),
        }}
        strategy="afterInteractive"
      />

      <CourseClient
        initialData={pageData}
        courseSlug={course}
        initialFaqData={faqData}
        initialTestimonials={testimonials}
        initialSliderData={sliderData}
      />
    </>
  );
}












// import { Metadata } from 'next';
// import { cache } from 'react'; // 1. Added for Axios deduplication
// import CourseClient from '@/components/CoursePage';
// import { serverInstance } from '@/services/axiosInstance';
// import PageServices from '@/services/PageServices';

// interface PageProps {
//   params: Promise<{ slug: string }>;
// }

// // 1. Memoized fetch function to prevent duplicate network calls across metadata & page rendering
// const getBaseCourseData = cache(async (course: string) => {
//   try {
//     const response = await serverInstance.get(`/page/${course}?type=course_page`);
//     return response?.data?.data || null;
//   } catch (error) {
//     console.error('Error fetching base course data:', error);
//     return null;
//   }
// });

// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//   const { slug } = await params;
//   const course = (slug || 'sat').toLowerCase(); // 3. Lowercase for clean SEO URLs

//   const data = await getBaseCourseData(course);

//   if (data) {
//     const title = data.metaTitle || data.title || `${course.toUpperCase()} Preparation`;
//     const description = data.metaDescription || data.subTitle || `Best ${course} preparation course`;
//     const keywords = data.keywords?.join(', ') || `${course}, preparation, course`;
//     const baseUrl = `https://www.gatewayabroadeducations.com/${course}`;
//     const imageUrl = data.pageContent?.heroImage ? `https://uat.gatewayabroadeducations.com/uploads/${data.pageContent.heroImage}` : null;

//     return {
//       title,
//       description,
//       keywords,
//       openGraph: {
//         title,
//         description,
//         type: 'website',
//         url: baseUrl,
//         images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : [],
//       },
//       twitter: {
//         card: 'summary_large_image',
//         title,
//         description,
//         images: imageUrl ? [imageUrl] : [],
//       },
//       alternates: {
//         canonical: data.canonicalUrl || baseUrl,
//       },
//     };
//   }

//   // Fallback metadata
//   return {
//     title: `${course.toUpperCase()} Preparation Course`,
//     description: `Best ${course} preparation course at Gateway Abroad`,
//   };
// }

// async function fetchAllCourseData(course: string) {
//   // Fetch base course data (deduplicated via cache)
//   const pageData = await getBaseCourseData(course);

//   if (!pageData) {
//     return { pageData: null, faqData: [], testimonials: [], sliderData: [] };
//   }

//   const pageName = pageData.title || pageData.pageName || course;

//   // Fetch secondary dynamic elements concurrently
//   try {
//     const [faqResponse, testimonialResponse, sliderResponse] = await Promise.all([
//       PageServices.getAllFaqForFront(pageName).catch(() => ({ status: 'error', data: { faq: [] } })),
//       PageServices.getTestimonialByCat(pageName).catch(() => ({ status: 'error', data: { testimonial: [] } })),
//       PageServices.getStudent().catch(() => ({ data: { media: [] } }))
//     ]);

//     return {
//       pageData,
//       faqData: faqResponse?.status === 'success' ? faqResponse.data.faq || [] : [],
//       testimonials: testimonialResponse?.status === 'success' ? testimonialResponse.data.testimonial || [] : [],
//       sliderData: sliderResponse?.data?.media || []
//     };
//   } catch (error) {
//     console.error('Error fetching supplementary course data:', error);
//     return { pageData, faqData: [], testimonials: [], sliderData: [] };
//   }
// }

// export default async function CoursePage({ params }: PageProps) {
//   const { slug } = await params;
//   const course = (slug || 'sat').toLowerCase();

//   const { pageData, faqData, testimonials, sliderData } = await fetchAllCourseData(course);

//   return (
//     <CourseClient
//       initialData={pageData}
//       courseSlug={course}
//       initialFaqData={faqData}
//       initialTestimonials={testimonials}
//       initialSliderData={sliderData}
//     />
//   );
// }



