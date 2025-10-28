import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@/public/css/style.css";
import "@/public/css/responsive.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ClientLayout from "@/components/home/mainLayout";
import { Noto_Sans } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });
const notoSans = Noto_Sans({
  weight: ['400', '500', '700'], // Specify the weights you need
  style: ['normal'], // Add 'italic' if you need it
  subsets: ['latin'], // Specify the character subsets you need
  display: 'swap', // Optional, but 'swap' is good practice for performance
});

export const metadata = {
  title: "Gateway Abroad | Study Abroad Consultants",
  description: "Discover the best consultant for studying abroad..."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" />
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet" />
        <meta name="google-site-verification" content="TupPl-3FF3IFmClspLl1nNOTl9IjjES7HRWUZi5qJyQ" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "home",
                "item": "https://www.gatewayabroadeducations.com/"
              }, {
                "@type": "ListItem",
                "position": 2,
                "name": "About us",
                "item": "https://www.gatewayabroadeducations.com/about"
              }, {
                "@type": "ListItem",
                "position": 3,
                "name": "Spoken English",
                "item": "https://www.gatewayabroadeducations.com/spoken-english"
              }, {
                "@type": "ListItem",
                "position": 4,
                "name": "Blogs",
                "item": "https://www.gatewayabroadeducations.com/blog"
              }, {
                "@type": "ListItem",
                "position": 5,
                "name": "Career",
                "item": "https://www.gatewayabroadeducations.com/career"
              }, {
                "@type": "ListItem",
                "position": 6,
                "name": "Contact",
                "item": "https://www.gatewayabroadeducations.com/contact"
              }, {
                "@type": "ListItem",
                "position": 7,
                "name": "GMAT",
                "item": "https://www.gatewayabroadeducations.com/course/GMAT"
              }, {
                "@type": "ListItem",
                "position": 8,
                "name": "IELTS",
                "item": "https://www.gatewayabroadeducations.com/course/IELTS"
              }, {
                "@type": "ListItem",
                "position": 9,
                "name": "TOEFL",
                "item": "https://www.gatewayabroadeducations.com/course/TOEFL"
              }, {
                "@type": "ListItem",
                "position": 10,
                "name": "GRE",
                "item": "https://www.gatewayabroadeducations.com/course/GRE"
              }, {
                "@type": "ListItem",
                "position": 11,
                "name": "PTE",
                "item": "https://www.gatewayabroadeducations.com/course/PTE"
              }, {
                "@type": "ListItem",
                "position": 12,
                "name": "SAT",
                "item": "https://www.gatewayabroadeducations.com/course/SAT"
              }]
            })
          }}
        />

        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '913163584366474');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=913163584366474&ev=PageView&noscript=1"
            alt="facebook pixel"
          />
        </noscript>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "EducationalOrganization",
                  "@id": "https://www.gatewayabroadeducations.com/#organization",
                  "name": "Gateway Abroad Educations",
                  "url": "https://www.gatewayabroadeducations.com/",
                  "logo": "https://www.gatewayabroadeducations.com/assets/img/ga-logo.svg",
                  "description": "Gateway Abroad Educations offers expert guidance for studying abroad, including university admissions, visa assistance, test preparation, and scholarship support.",
                  "sameAs": [
                    "https://www.facebook.com/gagatewayabroadjaipur",
                    "https://twitter.com/gatewayabroadjp",
                    "https://www.linkedin.com/company/gateway-abroad-jaipur1",
                    "https://www.instagram.com/gatewayabroadjaipur"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-8302092630",
                    "email": "gatewayabroadeducation@gmail.com",
                    "contactType": "Customer service",
                    "areaServed": "IN"
                  }
                },
                {
                  "@type": "LocalBusiness",
                  "name": "Gateway Abroad Educations",
                  "telephone": "+91-8302092630",
                  "@id": "https://www.gatewayabroadeducations.com/#localbusiness",
                  "parentOrganization": {
                    "@id": "https://www.gatewayabroadeducations.com/#organization"
                  },
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "105 Geetanjali Tower, Ajmer Road",
                    "addressLocality": "Civil Line",
                    "addressRegion": "Rajasthan",
                    "postalCode": "302006",
                    "addressCountry": "IN"
                  },
                  "image": "https://www.gatewayabroadeducations.com/uploads/1753516103974-178845458.PNG",
                  "priceRange": "Free Consultation",
                  "areaServed": [
                    "IN",
                    "US",
                    "GB",
                    "CA",
                    "AU"
                  ],
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday"
                      ],
                      "opens": "09:00",
                      "closes": "18:00"
                    }
                  ]
                },
                {
                  "@type": "Service",
                  "name": "University Admissions Assistance",
                  "serviceType": "Study Abroad Counseling",
                  "provider": {
                    "@id": "https://www.gatewayabroadeducations.com/#organization"
                  },
                  "description": "Personalized guidance for selecting and applying to top universities worldwide.",
                  "areaServed": [
                    "IN"
                  ]
                },
                {
                  "@type": "Service",
                  "name": "IELTS Test Preparation",
                  "serviceType": "English Test Coaching",
                  "provider": {
                    "@id": "https://www.gatewayabroadeducations.com/#organization"
                  },
                  "description": "Comprehensive IELTS coaching with speaking labs, writing evaluation, and 7+ band guarantee strategies.",
                  "offers": {
                    "@type": "Offer",
                    "category": "Test Preparation"
                  }
                },
                {
                  "@type": "Service",
                  "name": "GMAT/GRE/SAT Prep",
                  "serviceType": "Graduate Test Coaching",
                  "provider": {
                    "@id": "https://www.gatewayabroadeducations.com/#organization"
                  },
                  "description": "Specialized training for GMAT Focus Edition, shorter GRE format, and Digital SAT adaptive testing strategies.",
                  "offers": {
                    "@type": "Offer",
                    "category": "Test Preparation"
                  }
                },
                {
                  "@type": "Service",
                  "name": "PTE/TOEFL Training",
                  "serviceType": "English Proficiency Coaching",
                  "provider": {
                    "@id": "https://www.gatewayabroadeducations.com/#organization"
                  },
                  "description": "Fast-result PTE Academic and TOEFL iBT preparation with AI evaluation and speaking templates.",
                  "offers": {
                    "@type": "Offer",
                    "category": "Test Preparation"
                  }
                },
                {
                  "@type": "Service",
                  "name": "Student Visa Assistance",
                  "serviceType": "Immigration Consulting",
                  "provider": {
                    "@id": "https://www.gatewayabroadeducations.com/#organization"
                  },
                  "description": "End-to-end visa support for F1 (USA), SDS (Canada), UKVI, and Australian student visas with document preparation.",
                  "offers": {
                    "@type": "Offer",
                    "category": "Visa Application"
                  }
                },
                {
                  "@type": "Service",
                  "name": "Scholarship Guidance",
                  "serviceType": "Financial Aid Consulting",
                  "provider": {
                    "@id": "https://www.gatewayabroadeducations.com/#organization"
                  },
                  "description": "Expert assistance in securing merit-based scholarships, need-based aid, and country-specific funding opportunities.",
                  "offers": {
                    "@type": "Offer",
                    "category": "Scholarship Support"
                  }
                },
                {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "bestRating": "5",
                  "ratingCount": "1200",
                  "reviewCount": "1100",
                  "itemReviewed": {
                    "@type": "EducationalOrganization",
                    "@id": "https://www.gatewayabroadeducations.com/#organization"
                  }
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "How do I start the process for studying abroad?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Begin by scheduling a free consultation with our experts to assess your goals, academic background, and preferred destinations."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Do you offer IELTS/TOEFL preparation?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, we provide personalized test preparation programs to help you achieve your target scores."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What's the minimum IELTS score for UK universities?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Most UK universities require 6.0-6.5 for undergraduate and 6.5-7.0 for postgraduate programs. We help you achieve required scores."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Do you assist with scholarship applications?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, our experts help identify suitable scholarships and craft compelling applications to maximize funding opportunities."
                      }
                    }
                  ]
                },
                {
                  "@type": "Event",
                  "name": "Free Study Abroad Consultation Week 2025",
                  "startDate": "2025-07-15T09:00+05:30",
                  "endDate": "2025-07-21T18:00+05:30",
                  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                  "eventStatus": "https://schema.org/EventScheduled",
                  "location": {
                    "@type": "Place",
                    "name": "Gateway Abroad Educations Office",
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": "105 Geetanjali Tower, Ajmer Road",
                      "addressLocality": "Jaipur",
                      "addressRegion": "Rajasthan",
                      "postalCode": "302006",
                      "addressCountry": "India"
                    }
                  },
                  "description": "Free consultancy sessions covering admission requirements, scholarships, test preparation strategies, and visa processes.",
                  "organizer": {
                    "@id": "https://www.gatewayabroadeducations.com/#organization"
                  }
                }]
            })
          }}
        />

        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KBCB5JV7');
          `}
        </Script>

        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-6SL4VEMM29" />
        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6SL4VEMM29');
            gtag('config', 'AW-11490727253');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning className={`${notoSans.className} ${inter.className}`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KBCB5JV7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ClientLayout>{children}</ClientLayout>
        <script async src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js" integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q" crossOrigin="anonymous"></script>
      </body>
    </html>
  );
}
