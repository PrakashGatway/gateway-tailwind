import Course from "@/components/pages/courseDetails";
import { Metadata } from 'next';
import Script from "next/script";

const seoData = {
  default: {
    title: "Gateway Abroad Education, Study Abroad and Test Preparation",
    description: "Planning to study abroad from India? Gateway Abroad offers expert test prep, visa support & admissions for Canada, UK, USA, Germany & more",
    canonical: "https://www.gatewayabroadeducations.com",
    og: {
      type: "website",
      url: "https://www.gatewayabroadeducations.com",
      title: "Gateway Abroad Education, Study Abroad and Test Preparation",
      description: "Planning to study abroad from India? Gateway Abroad offers expert test prep, visa support & admissions for Canada, UK, USA, Germany & more.",
      image: "/img/ga-logo.jpg",
      site_name: "Gateway Abroad Education"
    },
    twitter: {
      card: "summary_large_image",
      title: "Gateway Abroad Education | Study Abroad Consultants in India",
      description: "Complete your overseas education dreams with the best Study Abroad Consultants in India. Higher studies in the USA, UK, Canada, Australia, Dubai.",
      image: "/img/twitter-default.jpg"
    }
  },
  pages: {
    IELTS: {
      title: "Top IELTS Coaching in Jaipur | 7+ Band Guarantee | IELTS",
      description: "Ace IELTS coaching in Jaipur's #1 institute! Expert trainers, personalized study plans with mock tests. Score 7+ bands for UK/US visas. Free diagnostic test.",
      keywords: "IELTS coaching in jaipur, ielts institute in jaipur, ielts class, ielts free demo class, 9+ Band score, usa ielts, ielts coach, ielts mock test, ielts speaking class, ielts listening classes, ielts writing topic, reading topic, expert classes",
      canonical: "https://www.gatewayabroadeducations.com/course/IELTS",
      og: {
        title: "Top IELTS Coaching in Jaipur | 7+ Band Guarantee | IELTS",
        description: "Ace IELTS coaching in Jaipur's #1 institute! Expert trainers, personalized study plans with mock tests. Score 7+ bands for UK/US visas. Free demo class.",
        image: "https://api.gatewayabroadeducations.com/api/uploads/1712599856913-images%20(2).png"
      },
      twitter: {
        card: "summary_large_image",
        title: "IELTS Coaching in Jaipur - Score 7+ Bands",
        description: "Expert IELTS coaching with guaranteed results. Free demo and mock tests available.",
        image: "/img/ga-logo.svg"
      }
    },
    GMAT: {
      title: "GMAT Coaching in Jaipur | Focus Edition | 700+ Score Strategies",
      description: "Master GMAT coaching in Jaipur! 99th percentile trainers, adaptive DI section strategies, and 700+ score techniques. 40+ hours of live problem-solving.",
      keywords: "GMAT coaching in jaipur, GMAT institute in jaipur, GMAT class, GMAT free demo class, 700+ score, usa GMAT, GMAT coach, Free GMAT mock test, GMAT Math class, expert classes",
      canonical: "https://www.gatewayabroadeducations.com/course/GMAT",
      og: {
        title: "GMAT Coaching in Jaipur | Focus Edition | 700+ Score Strategies",
        description: "Master GMAT coaching in Jaipur! 99th percentile trainers, adaptive DI section strategies, and 700+ score techniques. 40+ hours of live problem-solving.",
        image: "https://api.gatewayabroadeducations.com/api/uploads/1722690849056-gmat.jpg"
      },
      twitter: {
        card: "summary_large_image",
        title: "GMAT Coaching in Jaipur - 700+ Score Guaranteed",
        description: "Ace the GMAT with Jaipur's top trainers. Live classes, mock tests, and proven strategies.",
        image: "/img/ga-logo.svg"
      }
    },
    GRE: {
      title: "Best GRE Coaching in Jaipur | Get 320+ Score | GRE Prep",
      description: "320+ GRE scores guaranteed! Jaipur's top coaching for shorter GRE format. Quant/verbal bootcamps, AWA templates & 10 full-length mocks.",
      keywords: "GRE coaching in jaipur, GRE institute in jaipur, GRE class, gre free demo class, 300+ score, usa gre, gre coach, GRE mock test, expert classes",
      canonical: "https://www.gatewayabroadeducations.com/course/GRE",
      og: {
        title: "Best GRE Coaching in Jaipur | Get 320+ Score | GRE Prep",
        description: "320+ GRE scores guaranteed! Jaipur's top coaching for shorter GRE format. Quant/verbal bootcamps, AWA templates & 10 full-length mocks.",
        image: "https://api.gatewayabroadeducations.com/api/uploads/Rectangle%20783%20(3).png"
      },
      twitter: {
        card: "summary_large_image",
        title: "GRE Coaching in Jaipur - Score 320+ Guaranteed",
        description: "Top GRE coaching in Jaipur with proven strategies and full-length mock tests.",
        image: "/img/ga-logo.svg"
      }
    },
    SAT: {
      title: "Digital SAT Coaching in Jaipur | 1500+ Score | Adaptive Test",
      description: "Conquer the Digital SAT coaching in jaipur for adaptive testing, Desmos calculator mastery & 1500+ strategies. 5 full Bluebook simulations.",
      keywords: "SAT coaching in jaipur, SAT institute in jaipur, SAT class, SAT free demo class, 1500+ score, usa SAT, SAT coach, SAT mock test, expert classes",
      canonical: "https://www.gatewayabroadeducations.com/course/SAT",
      og: {
        title: "Digital SAT Coaching in Jaipur | 1500+ Score | Adaptive Test",
        description: "Conquer the Digital SAT coaching in jaipur for adaptive testing, Desmos calculator mastery & 1500+ strategies. 5 full Bluebook simulations.",
        image: "https://api.gatewayabroadeducations.com/api/uploads/Rectangle%20783%20(4).png"
      },
      twitter: {
        card: "summary_large_image",
        title: "Digital SAT Coaching in Jaipur - 1500+ Score",
        description: "Master the new Digital SAT with expert coaching and full simulations.",
        image: "/img/ga-logo.svg"
      }
    },
    PTE: {
      title: "PTE Academic Coaching in Jaipur | PTE classes | PTE good score",
      description: "Get PTE 80+ in 15 days! AI-based evaluation, speaking templates & accent training at Jaipur's top institute. 97% first-attempt success rate. Free practice test.",
      keywords: "PTE coaching in jaipur, PTE institute in jaipur, PTE class, PTE free demo class, 80+ score, PTE coach, PTE mock test, expert classes",
      canonical: "https://www.gatewayabroadeducations.com/course/PTE",
      og: {
        title: "PTE Academic Coaching Jaipur | PTE classes | PTE good score",
        description: "Get PTE 80+ in 15 days! AI-based evaluation, speaking templates & accent training at Jaipur's top institute. 97% first-attempt success rate. Free practice test.",
        image: "https://api.gatewayabroadeducations.com/api/uploads/Rectangle%20783%20(2).png"
      },
      twitter: {
        card: "summary_large_image",
        title: "PTE Coaching in Jaipur - Score 80+ in 15 Days",
        description: "Fast-track your PTE prep with AI-powered training and expert coaching.",
        image: "/img/ga-logo.svg"
      }
    },
    TOEFL: {
      title: "TOEFL Coaching in Jaipur | US University Focus | TOEFL iBT Institute",
      description: "TOEFL 100+ for USA dreams! Integrated skills training, academic vocabulary & note-taking strategies. TOEFL coaching in jaipur with only ETS-certified trainers.",
      keywords: "TOEFL iBT, TOEFL coaching in jaipur, TOEFL institute in jaipur, TOEFL class, TOEFL free demo class, TOEFL coach, TOEFL mock test, expert classes",
      canonical: "https://www.gatewayabroadeducations.com/course/TOEFL",
      og: {
        title: "TOEFL Coaching in Jaipur | US University Focus | TOEFL iBT Institute",
        description: "TOEFL 100+ for USA dreams! Integrated skills training, academic vocabulary & note-taking strategies. TOEFL coaching in jaipur with only ETS-certified trainers.",
        image: "https://api.gatewayabroadeducations.com/api/uploads/1712599042549-toefl2023%20(1).png"
      },
      twitter: {
        card: "summary_large_image",
        title: "TOEFL Coaching in Jaipur - Score 100+ for USA",
        description: "ETS-certified TOEFL coaching in Jaipur with full skill integration and mock tests.",
        image: "/img/ga-logo.svg"
      }
    }
  }
};


const getCourseSchema = (course: string) => {
  const courseUpper = course?.toUpperCase();
  const courseLower = course?.toLowerCase();

  const courseConfig: any = {
    IELTS: {
      name: "IELTS Coaching Class",
      image:
        "https://api.gatewayabroadeducations.com/api/uploads/1712810045348-33756158_8085941%202.png",
      ratingCount: "6289",
      description:
        "Gateway Abroad Education offers expert IELTS coaching in Jaipur with certified trainers, mock tests, and proven strategies to help students score 7+ bands."
    },
    GMAT: {
      name: "GMAT Coaching Class",
      image:
        "https://api.gatewayabroadeducations.com/api/uploads/1722690849056-Add%20a%20subheading.png",
      ratingCount: "5019",
      description:
        "Gateway Abroad Education is a leading GMAT coaching institute in Jaipur, providing expert faculty, structured study plans, live classes, and strategies for achieving 700+ GMAT scores."
    },
    GRE: {
      name: "GRE Coaching Class",
      image: "https://api.gatewayabroadeducations.com/api/uploads/1707468162388-33756158_8085941%205.png",
      ratingCount: "4120",
      description:
        "Top GRE coaching in Jaipur with expert mentors, quant & verbal bootcamps, and full-length mock tests."
    }
  };

  const data = courseConfig[courseUpper] || {
    name: "Coaching Course",
    image: "/img/ga-logo.svg",
    ratingCount: "9554",
    description:
      "Gateway Abroad Education offers expert coaching for international exams."
  };

  return {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.gatewayabroadeducations.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": data.name,
          "item": `https://www.gatewayabroadeducations.com/course/${courseLower}`
        }
      ]
    },

   product: {
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": data.name,
  "image": data.image,
  "description": data.description,
  "brand": {
    "@type": "Brand",
    "name": "Gateway Abroad Education"
  },
  "offers": {
    "@type": "AggregateOffer",
    "url": `https://www.gatewayabroadeducations.com/course/${courseLower}`,
    "priceCurrency": "INR",
    "lowPrice": "5000",
    "highPrice": "19000",
    "offerCount": "20"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": data.ratingCount
  }
}

  };
};


export async function generateMetadata({ params }:any) {
  const { course } = await params;

  const normalizedCourse = course?.toUpperCase();
  const courseData = seoData.pages[normalizedCourse] || seoData.default;

  return {
    metadataBase: new URL('https://www.gatewayabroadeducations.com'),
    title: courseData.title,
    description: courseData.description,
    keywords: courseData.keywords,
    openGraph: {
      title: courseData.og?.title || courseData.title,
      description: courseData.og?.description || courseData.description,
      images: [courseData.og?.image],
      url: courseData.canonical,
      type: courseData.og?.type || 'website',
      site_name: courseData.og?.site_name || 'Gateway Abroad Education',
    },
    twitter: {
      card: courseData.twitter?.card || 'summary_large_image',
      title: courseData.twitter?.title || courseData.title,
      description: courseData.twitter?.description || courseData.description,
      images: [courseData.og?.image],
    },
    alternates: {
      canonical: courseData.canonical,
    },
  };
}

const CoursePage = ({ params }: any) => {
  const { course } =  params;
  const schema = getCourseSchema(course);

  return (
    <>
      {/* Breadcrumb Schema */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema.breadcrumb),
        }}
      />

      {/* Product Schema */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema.product),
        }}
      />

      <Course />
    </>
  );
};

export default CoursePage;
