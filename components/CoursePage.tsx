'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

import PageServices from '@/services/PageServices';
import { constant } from '@/constant/index.constant';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Constants
const COURSE_LINKS = {
  practiceMaterial: {
    GMAT: "https://drive.google.com/drive/folders/1tqPuj-HBYnHX6A-hB71Aq9gsG4QfoZZ3",
    PTE: "https://drive.google.com/drive/folders/1kM7xUBIZacJM82FteV-SlkwWMtMlTyBM",
    SAT: "https://drive.google.com/drive/folders/1OYM497cr2lVjqLsRA8S1m9Ho_EduSBmW",
    GRE: "https://drive.google.com/drive/folders/1vY4eXSz0E5V5Qtrr_LbwKjl7vCedqaCE",
    IELTS: "https://drive.google.com/drive/folders/1WlxtWu5A2eRlcDswTj0UFJtpp8LHOJwI",
    TOEFL: "https://drive.google.com/drive/folders/1GdcyZq-o831I1zeHaG9w9KlH9z3QLSiy"
  },
  otherResources: {
    GMAT: "/courseRes/GMAT.pdf",
    PTE: "/courseRes/PTE.pdf",
    SAT: "/courseRes/SAT.pdf",
    GRE: "/courseRes/GRE.pdf",
    IELTS: "https://drive.google.com/drive/folders/1woaEMonJQbQlpco2Ksnc52oC46HLtTHF",
    TOEFL: "https://drive.google.com/drive/folders/1woaEMonJQbQlpco2Ksnc52oC46HLtTHF"
  },
  syllabus: {
    GMAT: "/Syllabus/GMATsyllabus.pdf",
    PTE: "/Syllabus/PTEsyllabus.pdf",
    SAT: "/Syllabus/SATsyllabus.pdf",
    GRE: "/Syllabus/GREsyllabus.pdf",
    IELTS: "/Syllabus/IELTSsyllabus.pdf",
    TOEFL: "/Syllabus/TOEFLsyllabus.pdf"
  }
};

const BANNER_COURSES = ["GMAT", "PTE", "SAT", "GRE", "IELTS", "TOEFL"];
const COUNTRIES = ['USA', 'United Kingdom', 'Australia', 'Canada', 'Germany', 'New Zealand', 'France'];

interface CourseClientProps {
  initialData: any;
  courseSlug: string;
  initialFaqData?: any[];
  initialTestimonials?: any[];
  initialSliderData?: any[];
}

const CourseClient: React.FC<CourseClientProps> = ({ 
  initialData, 
  courseSlug, 
  initialFaqData = [], 
  initialTestimonials = [],
  initialSliderData = []
}) => {
  const router = useRouter();
  const params = useParams();
  const course = params?.slug || courseSlug || "sat";

  // State - initialized with server data
  const [courseName, setCourseName] = useState('');
  const [courseData, setCourseData] = useState({});
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [faqData, setFaqData] = useState(initialFaqData);
  const [sliderData, setSliderData] = useState(initialSliderData);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [pageData, setPageData] = useState(initialData);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Hooks
  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
    formState: { errors: contactErrors },
    reset: resetContactForm,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      city: '',
      message: '',
    },
  });

  // Keen Slider
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 24,
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: {
          perView: 2,
          spacing: 32,
        },
      },
    },
    drag: true,
  });

  // Memoized values
  const hasTestimonials = useMemo(() => testimonials.length > 0, [testimonials]);
  const hasMultipleTestimonials = useMemo(() => testimonials.length > 1, [testimonials]);

  // Helper to extract section content by type
  const getSectionContent = useCallback((type: string) => {
    if (!pageData?.sections) return null;
    const section = pageData.sections.find((s: any) => s.type === type);
    return section?.content || null;
  }, [pageData]);

  const heroContent = useMemo(() => getSectionContent('hero'), [getSectionContent]);
  const whatIsContent = useMemo(() => getSectionContent('whatIsToefl'), [getSectionContent]);
  const whyChooseContent = useMemo(() => getSectionContent('whyChooseUs'), [getSectionContent]);
  const pricingContent = useMemo(() => getSectionContent('pricing'), [getSectionContent]);
  const resourcesContent = useMemo(() => getSectionContent('resources'), [getSectionContent]);
  const counsellingContent = useMemo(() => getSectionContent('counselling'), [getSectionContent]);
  const editorContent = useMemo(() => getSectionContent('editor'), [getSectionContent]);
  const scoreSectionContent = useMemo(() => getSectionContent('Scoresection'), [getSectionContent]);
  const ComponentsLanguage = useMemo(() => getSectionContent('ComponentsLanguage'), [getSectionContent]);

  useEffect(() => {
    if (ComponentsLanguage?.items?.[0]?.section) {
      setActiveTab(ComponentsLanguage.items[0].section);
    }
  }, [ComponentsLanguage]);

  const splitString = useCallback((str: string) => {
    if (!str) return { first: '', second: '' };
    const parts = str.split(':');
    return { first: parts[0] || '', second: parts[1] || '' };
  }, []);

  const getResourceLink = useCallback((resourceType: keyof typeof COURSE_LINKS) => {
    const courseKey = courseName as keyof typeof COURSE_LINKS.practiceMaterial;
    return COURSE_LINKS[resourceType]?.[courseKey] || "#";
  }, [courseName]);

  const stripHtml = useCallback((html: string) => {
    if (!html) return '';
    if (typeof window !== 'undefined') {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    }
    return html.replace(/<[^>]*>/g, '');
  }, []);

  // Handle form submission (client-side only)
  const handleFormSubmit = useCallback(async (data: any) => {
    const { name, email, mobile, city, message } = data;
    try {
      const response = await PageServices.createForme({
        name,
        email,
        mobileNo: mobile,
        city,
        message,
        type: 'contact',
      });
      
      if (response.status === 'success') {
        resetContactForm();
        setIsFormSubmitted(true);
        setShowModal(false);
        router.push('/thank-you');
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert('An error occurred. Please try again.');
    }
  }, [resetContactForm, router]);

  const handleDownload = useCallback((url: string) => {
    if (isFormSubmitted) {
      window.open(url, '_blank');
    } else {
      handleGetStarted();
    }
  }, [isFormSubmitted]);

  const handleGetStarted = useCallback(() => {
    window.dispatchEvent(new CustomEvent('openFooterModal'));
  }, []);

  const handlePrev = useCallback(() => {
    instanceRef.current?.prev();
  }, [instanceRef]);

  const handleNext = useCallback(() => {
    instanceRef.current?.next();
  }, [instanceRef]);

  // Initialize data from server props
  useEffect(() => {
    if (initialData) {
      setPageData(initialData);
      setCourseName(initialData.title || initialData.pageName || '');
      setCourseData(initialData);
    }
  }, [initialData]);

  // Update slider data if provided from server
  useEffect(() => {
    if (initialSliderData.length > 0) {
      setSliderData(initialSliderData);
    }
  }, [initialSliderData]);

  // Autoplay for testimonials
  useEffect(() => {
    if (!instanceRef.current || !hasMultipleTestimonials) return;

    let interval: NodeJS.Timeout;
    const sliderContainer = sliderRef.current;
    let isMouseOver = false;

    const startAutoplay = () => {
      interval = setInterval(() => {
        if (!isMouseOver && instanceRef.current) {
          instanceRef.current.next();
        }
      }, 3000);
    };

    const stopAutoplay = () => {
      if (interval) {
        clearInterval(interval);
        interval = null as any;
      }
    };

    startAutoplay();

    if (sliderContainer) {
      const handleMouseOver = () => {
        isMouseOver = true;
        stopAutoplay();
      };

      const handleMouseOut = () => {
        isMouseOver = false;
        startAutoplay();
      };

      sliderContainer.addEventListener('mouseover', handleMouseOver);
      sliderContainer.addEventListener('mouseout', handleMouseOut);

      return () => {
        stopAutoplay();
        sliderContainer.removeEventListener('mouseover', handleMouseOver);
        sliderContainer.removeEventListener('mouseout', handleMouseOut);
      };
    }

    return () => stopAutoplay();
  }, [instanceRef, sliderRef, hasMultipleTestimonials]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course information...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen py-12 md:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-[9rem] pt-16 md:pt-[85px] items-center">
            <div className="space-y-4 md:space-y-6 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-red-600 leading-tight break-words">
                {heroContent?.title || pageData?.title || `${courseName} Preparation`}
              </h1>
              {heroContent?.highlightText && (
                <p className="text-gray-600 text-base md:text-lg leading-relaxed break-words">
                  {stripHtml(heroContent.highlightText)}
                </p>
              )}
              {heroContent?.description && (
                <p className="text-gray-600 text-base md:text-lg leading-relaxed break-words">
                  {stripHtml(heroContent.description)}
                </p>
              )}
              {pageData?.subTitle && !heroContent?.highlightText && (
                <p className="text-gray-600 text-base md:text-lg leading-relaxed break-words">
                  {pageData.subTitle}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={handleGetStarted} 
                  className="bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-3 rounded-lg font-semibold transition-colors duration-300 text-center whitespace-nowrap"
                >
                  Enroll Now
                </button>
              </div>
            </div>

            <div className="relative flex justify-center mt-8 md:mt-0">
              <Image
                src={
                  pageData?.pageContent?.heroImage 
                    ? `https://uat.gatewayabroadeducations.com/uploads/${pageData.pageContent.heroImage}` 
                    : courseData.image2 
                      ? `https://uat.gatewayabroadeducations.com/uploads/${courseData.image2}`
                      : "/placeholder.svg"
                }
                alt={`${courseName} Preparation`}
                width={500}
                height={400}
                className="rounded-2xl shadow-xl w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Slider/Marquee Section */}
      {sliderData.length > 0 && (
        <section className="bg-[#1F1B2D] py-3">
          <div className="max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-full mx-auto">
            <div className="relative overflow-hidden">
              <div
                className="flex marquee-alternate"
                style={{
                  '--marquee-duration': '25s',
                  '--marquee-direction': 'alternate',
                  gap: '2rem'
                } as React.CSSProperties}
              >
                {sliderData.map((item: any) => (
                  <div key={item._id || item.id} className="flex-shrink-0 text-white font-medium whitespace-nowrap text-xs sm:text-sm">
                    {item.name} {item.courseName} <span className="text-red-400 font-bold">{item.rank}</span>
                  </div>
                ))}
                {sliderData.map((item: any) => (
                  <div key={`${item._id}-dup` || `${item.id}-dup`} className="flex-shrink-0 text-white font-medium whitespace-nowrap text-xs sm:text-sm">
                    {item.name} {item.courseName} <span className="text-red-400 font-bold">{item.rank}</span>
                  </div>
                ))}
              </div>

              <style jsx>{`
                .marquee-alternate {
                  animation: marqueeAlternate var(--marquee-duration, 25s) linear infinite var(--marquee-direction, alternate);
                }
                
                .marquee-alternate:hover {
                  animation-play-state: paused;
                }
                
                @keyframes marqueeAlternate {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                
                @media (max-width: 640px) {
                  .marquee-alternate {
                    gap: 1rem;
                  }
                }
              `}</style>
            </div>
          </div>
        </section>
      )}

      {/* What is Section */}
      {whatIsContent?.sectionTitle && (
        <section className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src={
                    pageData?.pageContent?.WhatIsImage 
                      ? `https://uat.gatewayabroadeducations.com/uploads/${pageData.pageContent.WhatIsImage}`
                      : courseData.image3 
                        ? `https://uat.gatewayabroadeducations.com/uploads/${courseData.image3}`
                        : '/placeholder.jpg'
                  }
                  alt={`${courseName} Overview`}
                  width={500}
                  height={400}
                  className="rounded-lg w-[90%]"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {whatIsContent?.sectionTitle || `What is ${courseName}?`}
                </h2>
                {whatIsContent?.description && (
                  <div 
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: whatIsContent.description }}
                  />
                )}
              </div>
            </div>

            {/* What's on Section */}
            {((whatIsContent?.whatIsOnToefl && whatIsContent.whatIsOnToefl.includes('<p>')) || editorContent) && (
              <div className="mt-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                  {editorContent?.title || `What is on the ${courseName}?`}
                </h2>
                
                {editorContent?.items && editorContent.items.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-6">
                    {editorContent.items.map((item: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg shadow-[0_0_20px_5px_rgba(0,0,0,0.1)] p-6 border border-gray-200 text-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[300px]">
                        <div className="flex items-center justify-center mx-auto mb-4">
                          <Image 
                            src={item.icon ? `/img/gmat-descp-img-${index + 1}.svg` : `/img/gmat-descp-img-${index + 1}.svg`}
                            alt="Icon" 
                            width={60} 
                            height={60}
                            loading="lazy"
                          />
                        </div>
                        <h5 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h5>
                        {item.description && (
                          <div 
                            className="text-black-600 font-bold text-sm"
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  whatIsContent?.whatIsOnToefl && (
                    <div 
                      className="w-full text-center text-gray-600"
                      dangerouslySetInnerHTML={{ __html: whatIsContent.whatIsOnToefl }}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Countries/Scores Section */}
      {scoreSectionContent?.sectionTitle && (
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <div className="relative">
                  <Image
                    src={pageData?.pageContent?.Scoresimg ? `https://uat.gatewayabroadeducations.com/uploads/${pageData.pageContent.Scoresimg}` : "/placeholder.svg"}
                    alt={`${courseName} Countries`}
                    className="rounded-lg shadow-lg w-full max-w-md"
                    width={100}
                    height={100}
                    loading="lazy"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {scoreSectionContent?.sectionTitle || `Countries Accepting ${courseName} Scores`}
                </h2>
                {scoreSectionContent?.sectionSubtitle && (
                  <div dangerouslySetInnerHTML={{ __html: scoreSectionContent.sectionSubtitle }} />
                )}
                {!scoreSectionContent?.sectionSubtitle && (
                  <p className="text-gray-600 mb-6">
                    {courseName} is accepted in 160 countries around the world.
                  </p>
                )}
                <h6 className="text-lg font-semibold mb-4">
                  Some of the popular countries accepting {courseName} scores are as follows:
                </h6>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                  {COUNTRIES.map((country) => (
                    <div key={country} className="flex items-center text-gray-700">
                      <img
                        src="/img/arrow-up-right.svg"
                        alt="arrow icon"
                        className="w-10 h-[25px] mr-2 text-green-500"
                        loading="lazy"
                      />
                      <span>{country}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Section */}
      <section className="py-12 md:py-20 bg-[#f5f4f8]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            {whyChooseContent?.sectionTitle || `Why Choose Gateway Abroad for ${courseName} Test Prep?`}
          </h2>
          
          {whyChooseContent?.items && whyChooseContent.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseContent.items.map((item: any, index: number) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center">
                  <div className="w-[90px] h-[90px] bg-[#D71635] rounded-full flex items-center justify-center mx-auto mb-5">
                    <Image 
                      src={item.icon ? `/img/why-choose-ga-img-${Math.min(index + 1, 6)}.svg` : `/img/why-choose-ga-img-${Math.min(index + 1, 6)}.svg`} 
                      alt={item.title || 'Feature'} 
                      width={60} 
                      height={32} 
                      loading="lazy" 
                    />
                  </div>
                  <p className="text-black-600 font-bold">{item.title}</p>
                  {item.description && (
                    <div 
                      className="text-gray-500 text-sm mt-2"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {['one', 'two', 'three', 'four', 'five', 'six'].map((key, index) => {
                const text = courseData.whyChoose?.[key];
                if (!text) return null;
                
                return (
                  <div key={key} className="bg-white rounded-lg p-6 text-center">
                    <div className="w-[90px] h-[90px] bg-[#D71635] rounded-full flex items-center justify-center mx-auto mb-5">
                      <Image src={`/img/why-choose-ga-img-${index + 1}.svg`} alt="Feature" width={60} height={32} loading="lazy" />
                    </div>
                    <p className="text-black-600 font-bold">{text}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Brochure Section */}
      <section className="py-1 md:py-10 bg-red-600 max-w-[69rem] mx-auto rounded-[20px] my-[70px]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 items-center">
            <div className="lg:col-span-2 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready, set, knowledge! Download our brochure and get started.
              </h2>
            </div>
            <div className="text-center">
              {BANNER_COURSES.includes(courseName) ? (
                <button
                  onClick={() => handleDownload(`/brosher/${courseName}.pdf`)}
                  className="bg-white text-red-600 px-20 py-3 rounded-[40px] font-semibold hover:bg-gray-100 transition-colors duration-300"
                >
                  Download
                </button>
              ) : (
                <button className="bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold cursor-not-allowed" disabled>
                  Brochure Coming Soon
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-300 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/gmat-testimonials-bg.svg"
            alt="Background"
            fill
            className="object-cover"
            quality={75}
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gray-400/10 z-1"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            What Our {courseName} Prep Achievers Say
          </h2>

          {!hasTestimonials ? (
            <div className="text-center text-gray-500 py-8">No testimonials available</div>
          ) : (
            <div className="relative group">
              <div ref={sliderRef} className="keen-slider py-4">
                {testimonials.map((test: any, idx: number) => (
                  <div key={idx} className="keen-slider__slide p-4">
                    <div className="relative bg-white box-border caret-transparent z-0 ml-[30px] rounded-3xl md:ml-[50px] shadow-lg before:accent-auto before:border-b-gray-200 before:box-border before:caret-transparent before:text-neutral-800 before:block before:text-base before:not-italic before:normal-nums before:font-normal before:h-0 before:left-[-35px] before:tracking-[normal] before:leading-6 before:list-outside before:list-disc before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-0 before:z-[-1] before:border-t-white before:border-t-[25px] before:border-x-transparent before:border-x-[50px] before:border-separate before:border-solid before:top-0 before:font-noto_sans before:md:left-[-50px] before:md:border-t-[55px] before:md:border-x-[80px]">
                      <div className="box-border caret-transparent pt-5 px-5 md:pt-[35px] md:px-[30px]">
                        <div className="items-center box-border caret-transparent flex justify-between">
                          <h6 className="text-gray-700 text-lg font-bold box-border caret-transparent leading-[21.6px] mb-2">
                            {test.name}
                          </h6>
                          <ul className="box-border caret-transparent flex leading-[normal] list-none mb-4 pl-0">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <li key={star} className="text-amber-400 box-border caret-transparent">
                                <Star className="w-[18px] h-[18px] fill-amber-400" />
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium box-border caret-transparent max-w-[90%] min-h-0 text-left mb-4 py-[15px] md:max-w-none md:min-h-[198px]">
                          {test.content?.substring(0, 250) || 'No testimonial content available.'}
                        </p>
                      </div>
                      <div className="bg-red-600 box-border caret-transparent px-5 py-3.5 rounded-b-3xl md:px-[30px]"></div>
                    </div>
                  </div>
                ))}
              </div>

              {hasMultipleTestimonials && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200 z-10"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200 z-10"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-600" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative bg-gradient-to-b from-purple-400/20 to-red-600/20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
              {pricingContent?.sectionTitle || 'Plans & Pricing'}
            </h2>
            {pricingContent?.description && (
              <div 
                className="text-zinc-500 font-medium"
                dangerouslySetInnerHTML={{ __html: pricingContent.description }}
              />
            )}
          </div>

          <div className="backdrop-blur-lg bg-white/80 shadow-2xl rounded-3xl py-10 px-4 md:px-6 md:py-12">
            {pricingContent?.plans && pricingContent.plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingContent.plans.map((plan: any, index: number) => {
                  const isHybrid = plan.type === 'hybrid';
                  const isPopular = plan.badge === 'Most Popular';
                  
                  return (
                    <div 
                      key={index} 
                      className={`px-4 md:px-6 ${isHybrid ? 'bg-red-600 shadow-2xl rounded-3xl p-6 md:p-8 md:-mt-20 relative' : ''}`}
                    >
                      {isPopular && (
                        <div className="text-right mb-4">
                          <span className="text-white text-xs font-extrabold bg-zinc-800 tracking-wider px-4 py-2 rounded-full">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <h5 className={`text-2xl md:text-[28px] font-medium ${isHybrid ? 'text-white' : 'text-zinc-700'} mb-6`}>
                        {plan.title}
                      </h5>
                      {plan.badge && !isPopular && (
                        <span className="inline-block bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full mb-4">
                          {plan.badge}
                        </span>
                      )}
                      {plan.price && plan.price !== 'Contact for Pricing' && (
                        <p className={`text-xl font-bold ${isHybrid ? 'text-white' : 'text-zinc-700'} mb-2`}>
                          {plan.price}
                        </p>
                      )}
                      {plan.duration && (
                        <p className={`text-sm ${isHybrid ? 'text-white/80' : 'text-zinc-500'} mb-4`}>
                          {plan.duration}
                        </p>
                      )}
                      <div className="mb-8">
                        <div 
                          className={`${isHybrid ? 'text-white' : 'text-neutral-600'} font-medium text-justify`}
                          dangerouslySetInnerHTML={{ __html: plan.description }}
                        />
                        {plan.additionalDescription && (
                          <div 
                            className={`${isHybrid ? 'text-white' : 'text-neutral-600'} font-medium text-justify mt-2`}
                            dangerouslySetInnerHTML={{ __html: plan.additionalDescription }}
                          />
                        )}
                        {plan.features && (
                          <p className={`${isHybrid ? 'text-white' : 'text-neutral-600'} font-medium text-sm mt-4`}>
                            {plan.features}
                          </p>
                        )}
                      </div>
                      <div className="text-center">
                        <button
                          onClick={() => {
                            if (plan.buttonUrl) {
                              router.push(plan.buttonUrl);
                            } else {
                              handleGetStarted();
                            }
                          }}
                          className={`text-white text-base md:text-lg font-bold ${isHybrid ? 'bg-black hover:bg-gray-800' : 'bg-red-600 hover:bg-red-700'} shadow-lg px-12 py-3 rounded-full transition-colors duration-300`}
                        >
                          {plan.buttonText || 'Choose Plan'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center text-gray-500 col-span-3">No pricing data available</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Test Prep Resources Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            {resourcesContent?.sectionTitle || `Free ${courseName} Prep Resources`}
          </h2>

          {resourcesContent?.items && resourcesContent.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {resourcesContent.items.map((item: any, index: number) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-[1rem] border border-gray-200 text-center">
                  <div className="flex items-center justify-center mx-auto mb-6">
                    <Image 
                      src={item.file || `/img/resource-img-${index + 1}.svg`} 
                      alt={item.title || 'Resource'} 
                      width={350} 
                      height={40} 
                      loading="lazy" 
                    />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h4>
                  {item.description && (
                    <div 
                      className="text-gray-600 mb-6"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}
                  <button
                    onClick={() => {
                      if (item.url) {
                        const link = item.url.startsWith('http') ? item.url : getResourceLink(
                          index === 0 ? 'practiceMaterial' : 
                          index === 1 ? 'otherResources' : 
                          'syllabus' as keyof typeof COURSE_LINKS
                        );
                        handleDownload(link);
                      } else {
                        handleDownload(getResourceLink(
                          index === 0 ? 'practiceMaterial' : 
                          index === 1 ? 'otherResources' : 
                          'syllabus' as keyof typeof COURSE_LINKS
                        ));
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full"
                  >
                    {item.buttonText || 'Access Resource'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Practice Material */}
              <div className="bg-white rounded-2xl shadow-lg p-[1rem] border border-gray-200 text-center">
                <div className="flex items-center justify-center mx-auto mb-6">
                  <Image src="/img/resource-img-1.svg" alt="Practice Material" width={350} height={40} loading="lazy" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Practice Material</h4>
                <p className="text-gray-600 mb-6">
                  Take the {courseName} practice material and begin your {courseName} preparation now
                </p>
                <button
                  onClick={() => handleDownload(getResourceLink('practiceMaterial'))}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full"
                >
                  Take {courseName} Practice Material
                </button>
              </div>

              {/* Other Resources */}
              <div className="bg-white rounded-2xl shadow-lg p-[1rem] border border-gray-200 text-center">
                <div className="flex items-center justify-center mx-auto mb-6">
                  <Image src="/img/resource-img-2.svg" alt="Other Resources" width={350} height={40} loading="lazy" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Other Resources</h4>
                <p className="text-gray-600 mb-6">
                  Begin your {courseName} coaching with this other resources prepared by our experts to help you with your {courseName} prep
                </p>
                <button
                  onClick={() => handleDownload(getResourceLink('otherResources'))}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full"
                >
                  Download {courseName} Other Resources
                </button>
              </div>

              {/* Syllabus Download */}
              <div className="bg-white rounded-2xl shadow-lg p-[1rem] border border-gray-200 text-center">
                <div className="flex items-center justify-center mx-auto mb-6">
                  <Image src="/img/resource-img-3.svg" alt="Syllabus Download" width={350} height={40} loading="lazy" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Syllabus Download</h4>
                <p className="text-gray-600 mb-6">
                  Download the {courseName} syllabus now and get a head start on your {courseName} preparation
                </p>
                <button
                  onClick={() => handleDownload(getResourceLink('syllabus'))}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full"
                >
                  Download {courseName} Syllabus
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Components Language Section */}
      {
        ComponentsLanguage?.sectionTitle && 
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {ComponentsLanguage?.sectionTitle}
            </h2>

            {ComponentsLanguage?.sectionDescription && (
              <p className="text-gray-600">
                {ComponentsLanguage.sectionDescription}
              </p>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-5/12">
              <Image
                src={pageData?.pageContent?.Scoresimg ? `https://uat.gatewayabroadeducations.com/uploads/${pageData.pageContent.Scoresimg}` : "/placeholder.svg"}
                alt={`${courseName} Countries`}
                className="rounded-lg shadow-lg w-full max-w-md"
                width={100}
                height={100}
                loading="lazy"
              />
            </div>

            <div className="lg:w-7/12">
              {ComponentsLanguage?.items?.length > 0 && (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ComponentsLanguage.items.map((item: any, index: number) => (
                      <button
                        key={`trigger-${item.section}-${index}`}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                          activeTab === item.section
                            ? "bg-red-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        onClick={() => setActiveTab(item.section)}
                      >
                        {item.section}
                      </button>
                    ))}
                  </div>

                  {ComponentsLanguage.items.map((item: any, index: number) => (
                    <div
                      key={`content-${item.section}-${index}`}
                      className={activeTab === item.section ? "block" : "hidden"}
                    >
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        {item.content && (
                          <div
                            className="text-gray-700 text-justify mb-3"
                            dangerouslySetInnerHTML={{
                              __html: item.content,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      }

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
            <p className="text-gray-600">Can't find the answer you are looking for?</p>
          </div>

          <div className="max-w-7xl mx-auto">
            <Accordion type="single" collapsible className="w-3xl space-y-4">
              {faqData.map((f: any, index: number) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-lg border border-gray-200 px-6"
                >
                  <AccordionTrigger className="font-semibold py-4 hover:no-underline">
                    {f.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4 text-sm">
                    {f.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Counselling Session Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#fbe7ea] rounded-2xl sm:rounded-[24px] shadow-lg mx-auto w-full max-w-[7xl]">
            <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-[1rem]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div className="text-center lg:text-left lg:pl-[17px]">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[36px] font-bold text-[#D71635] mb-4 lg:leading-[37px]">
                    {counsellingContent?.title || 'Avail A Complementary Counselling Session'}
                  </h2>
                  {counsellingContent?.description && (
                    <div 
                      className="text-base lg:text-[18px] text-[#666276] mb-4 sm:mb-6"
                      dangerouslySetInnerHTML={{ __html: counsellingContent.description }}
                    />
                  )}
                  <Link
                    href={counsellingContent?.buttonUrl || '/contact'}
                    className="inline-block bg-[#d71635] hover:bg-[#b5122b] text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-3xl text-sm sm:text-base font-bold shadow-[0_0_8px_0_rgba(0,0,0,0.2)] transition-all duration-300"
                  >
                    {counsellingContent?.buttonText || 'Contact us'}
                  </Link>
                </div>
                <div className="flex justify-center">
                  <Image
                    src={counsellingContent?.image || '/img/counselling-session.svg'}
                    alt="Counselling Session"
                    width={400}
                    height={300}
                    loading="lazy"
                    className="w-full max-w-xs sm:max-w-sm lg:max-w-[25rem]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Get in touch</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmitContact(handleFormSubmit)} className="space-y-4">
                <div>
                  <input
                    type="text"
                    {...registerContact('name', { required: 'Name is required' })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${contactErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Name"
                  />
                  {contactErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{contactErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    {...registerContact('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${contactErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Email"
                  />
                  {contactErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{contactErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    {...registerContact('mobile', {
                      required: 'Mobile No. is required',
                      pattern: {
                        value: /^\d{10,15}$/,
                        message: 'Invalid phone number',
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${contactErrors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Mobile No."
                  />
                  {contactErrors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{contactErrors.mobile.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    {...registerContact('city', { required: 'City is required' })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${contactErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="City"
                  />
                  {contactErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{contactErrors.city.message}</p>
                  )}
                </div>

                <div>
                  <textarea
                    {...registerContact('message')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder="Message"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300"
                >
                  SUBMIT
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseClient;













// 'use client';

// import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
// import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation';
// import { useKeenSlider } from 'keen-slider/react';
// import 'keen-slider/keen-slider.min.css';
// import Image from 'next/image';
// import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
// import { useForm } from 'react-hook-form';

// import PageServices from '@/services/PageServices';
// import useAsync from '@/hooks/useAsync';
// import { constant } from '@/constant/index.constant';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// import { serverInstance } from '@/services/axiosInstance';

// // Constants
// const COURSE_LINKS = {
//   practiceMaterial: {
//     GMAT: "https://drive.google.com/drive/folders/1tqPuj-HBYnHX6A-hB71Aq9gsG4QfoZZ3",
//     PTE: "https://drive.google.com/drive/folders/1kM7xUBIZacJM82FteV-SlkwWMtMlTyBM",
//     SAT: "https://drive.google.com/drive/folders/1OYM497cr2lVjqLsRA8S1m9Ho_EduSBmW",
//     GRE: "https://drive.google.com/drive/folders/1vY4eXSz0E5V5Qtrr_LbwKjl7vCedqaCE",
//     IELTS: "https://drive.google.com/drive/folders/1WlxtWu5A2eRlcDswTj0UFJtpp8LHOJwI",
//     TOEFL: "https://drive.google.com/drive/folders/1GdcyZq-o831I1zeHaG9w9KlH9z3QLSiy"
//   },
//   otherResources: {
//     GMAT: "/courseRes/GMAT.pdf",
//     PTE: "/courseRes/PTE.pdf",
//     SAT: "/courseRes/SAT.pdf",
//     GRE: "/courseRes/GRE.pdf",
//     IELTS: "https://drive.google.com/drive/folders/1woaEMonJQbQlpco2Ksnc52oC46HLtTHF",
//     TOEFL: "https://drive.google.com/drive/folders/1woaEMonJQbQlpco2Ksnc52oC46HLtTHF"
//   },
//   syllabus: {
//     GMAT: "/Syllabus/GMATsyllabus.pdf",
//     PTE: "/Syllabus/PTEsyllabus.pdf",
//     SAT: "/Syllabus/SATsyllabus.pdf",
//     GRE: "/Syllabus/GREsyllabus.pdf",
//     IELTS: "/Syllabus/IELTSsyllabus.pdf",
//     TOEFL: "/Syllabus/TOEFLsyllabus.pdf"
//   }
// };

// const BANNER_COURSES = ["GMAT", "PTE", "SAT", "GRE", "IELTS", "TOEFL"];
// const COUNTRIES = ['USA', 'United Kingdom', 'Australia', 'Canada', 'Germany', 'New Zealand', 'France'];

// const Course = () => {
//   const router = useRouter();
//   const params = useParams();
//   const course = params?.slug || "sat";

//   // State
//   const [courseName, setCourseName] = useState('');
//   const [courseData, setCourseData] = useState({});
//   const [testimonials, setTestimonials] = useState([]);
//   const [faqData, setFaqData] = useState([]);
//   const [sliderData, setSliderData] = useState([]);
//   const [isFormSubmitted, setIsFormSubmitted] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [pageData, setPageData] = useState(null);
//   const [activeTab, setActiveTab] = useState<string | null>(null);

//   // Hooks
//   const {
//     register: registerContact,
//     handleSubmit: handleSubmitContact,
//     formState: { errors: contactErrors },
//     reset: resetContactForm,
//   } = useForm({
//     defaultValues: {
//       name: '',
//       email: '',
//       mobile: '',
//       city: '',
//       message: '',
//     },
//   });

//   const { data: slider } = useAsync(PageServices.getStudent);

//   // Keen Slider
//   const [sliderRef, instanceRef] = useKeenSlider({
//     loop: true,
//     slides: {
//       perView: 1,
//       spacing: 24,
//     },
//     breakpoints: {
//       '(min-width: 768px)': {
//         slides: {
//           perView: 2,
//           spacing: 32,
//         },
//       },
//     },
//     drag: true,
//   });

//   // Memoized values
//   const hasTestimonials = useMemo(() => testimonials.length > 0, [testimonials]);
//   const hasMultipleTestimonials = useMemo(() => testimonials.length > 1, [testimonials]);

//   // Helper to extract section content by type
//   const getSectionContent = useCallback((type) => {
//     if (!pageData?.sections) return null;
//     const section = pageData.sections.find(s => s.type === type);
//     return section?.content || null;
//   }, [pageData]);

  
//   const heroContent = useMemo(() => getSectionContent('hero'), [getSectionContent]);
  
  
//   const whatIsContent = useMemo(() => getSectionContent('whatIsToefl'), [getSectionContent]);
  
  
//   const whyChooseContent = useMemo(() => getSectionContent('whyChooseUs'), [getSectionContent]);
  
  
//   const pricingContent = useMemo(() => getSectionContent('pricing'), [getSectionContent]);
  
  
//   const resourcesContent = useMemo(() => getSectionContent('resources'), [getSectionContent]);
  
  
//   const counsellingContent = useMemo(() => getSectionContent('counselling'), [getSectionContent]);
  
  
//   const editorContent = useMemo(() => getSectionContent('editor'), [getSectionContent]);
  
  
//   const scoreSectionContent = useMemo(() => getSectionContent('Scoresection'), [getSectionContent]);

//   const ComponentsLanguage = useMemo(() => getSectionContent('ComponentsLanguage'),[getSectionContent]);

//   useEffect(() => {
//     setActiveTab(ComponentsLanguage?.items[0]?.section)
//   },[ComponentsLanguage])
  
  
//   const splitString = useCallback((str) => {
//     if (!str) return { first: '', second: '' };
//     const parts = str.split(':');
//     return { first: parts[0] || '', second: parts[1] || '' };
//   }, []);

//   const getResourceLink = useCallback((resourceType) => {
//     return COURSE_LINKS[resourceType]?.[courseName] || "#";
//   }, [courseName]);

//   const stripHtml = useCallback((html) => {
//     if (!html) return '';
//     const doc = new DOMParser().parseFromString(html, 'text/html');
//     return doc.body.textContent || '';
//   }, []);

//   // API calls
//   const getAllFaqData = useCallback(async (pageName) => {
//     try {
//       const response = await PageServices.getAllFaqForFront(pageName);
//       if (response.status === 'success') {
//         setFaqData(response.data.faq || []);
//       }
//     } catch (error) {
//       console.error('Error fetching FAQ data:', error);
//     }
//   }, []);

//   const getAllTestimonials = useCallback(async (pageName) => {
//     try {
//       const response = await PageServices.getTestimonialByCat(pageName);
//       if (response.status === 'success') {
//         setTestimonials(response.data.testimonial || []);
//       }
//     } catch (error) {
//       console.error('Error fetching testimonial data:', error);
//     }
//   }, []);

//   const fetchCourseData = useCallback(async () => {
//     if (!course) return;
    
//     setIsLoading(true);
//     try {
//       const response1 = await serverInstance.get(`/page/${course}?type=course_page`);
//       const response = response1?.data;
      
//       if (response?.success === true) {
//         const data = response.data;
//         setPageData(data);
//         setCourseName(data.title || data.pageName || '');
//         setCourseData(data);
        
//         // Fetch related data
//         const pageName = data.title || data.pageName || course;
//         await Promise.all([
//           getAllFaqData(pageName),
//           getAllTestimonials(pageName)
//         ]);
//       } else {
//         // router.push('/');
//       }
//     } catch (error) {
//       console.error('Error fetching course data:', error);
//     //   router.push('/');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [course, router, getAllFaqData, getAllTestimonials]);

//   const handleFormSubmit = useCallback(async (data) => {
//     const { name, email, mobile, city, message } = data;
//     try {
//       const response = await PageServices.createForme({
//         name,
//         email,
//         mobileNo: mobile,
//         city,
//         message,
//         type: 'contact',
//       });
      
//       if (response.status === 'success') {
//         resetContactForm();
//         setIsFormSubmitted(true);
//         setShowModal(false);
//         router.push('/thank-you');
//       }
//     } catch (error) {
//       console.error("Error submitting contact form:", error);
//       alert('An error occurred. Please try again.');
//     }
//   }, [resetContactForm, router]);

//   const handleDownload = useCallback((url) => {
//     if (isFormSubmitted) {
//       window.open(url, '_blank');
//     } else {
//       handleGetStarted();
//     }
//   }, [isFormSubmitted]);

//   const handleGetStarted = useCallback(() => {
//     window.dispatchEvent(new CustomEvent('openFooterModal'));
//   }, []);

//   const handlePrev = useCallback(() => {
//     instanceRef.current?.prev();
//   }, [instanceRef]);

//   const handleNext = useCallback(() => {
//     instanceRef.current?.next();
//   }, [instanceRef]);

//   // Effects
//   useEffect(() => {
//     fetchCourseData();
//   }, [fetchCourseData]);

//   useEffect(() => {
//     if (slider?.data?.media) {
//       setSliderData(slider.data.media);
//     }
//   }, [slider]);

//   // Autoplay for testimonials
//   useEffect(() => {
//     if (!instanceRef.current || !hasMultipleTestimonials) return;

//     let interval;
//     const sliderContainer = sliderRef.current;
//     let isMouseOver = false;

//     const startAutoplay = () => {
//       interval = setInterval(() => {
//         if (!isMouseOver && instanceRef.current) {
//           instanceRef.current.next();
//         }
//       }, 3000);
//     };

//     const stopAutoplay = () => {
//       if (interval) {
//         clearInterval(interval);
//         interval = null;
//       }
//     };

//     startAutoplay();

//     if (sliderContainer) {
//       const handleMouseOver = () => {
//         isMouseOver = true;
//         stopAutoplay();
//       };

//       const handleMouseOut = () => {
//         isMouseOver = false;
//         startAutoplay();
//       };

//       sliderContainer.addEventListener('mouseover', handleMouseOver);
//       sliderContainer.addEventListener('mouseout', handleMouseOut);

//       return () => {
//         stopAutoplay();
//         sliderContainer.removeEventListener('mouseover', handleMouseOver);
//         sliderContainer.removeEventListener('mouseout', handleMouseOut);
//       };
//     }

//     return () => stopAutoplay();
//   }, [instanceRef, sliderRef, hasMultipleTestimonials]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading course information...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
      
//       <section className="hero-gradient min-h-screen py-12 md:py-20 relative overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
//           <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-[9rem] pt-16 md:pt-[85px] items-center">
//             <div className="space-y-4 md:space-y-6 text-center lg:text-left">
//               <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-red-600 leading-tight break-words">
//                 {heroContent?.title || pageData?.title || `${courseName} Preparation`}
//               </h1>
//               {heroContent?.highlightText && (
//                 <p className="text-gray-600 text-base md:text-lg leading-relaxed break-words">
//                   {stripHtml(heroContent.highlightText)}
//                 </p>
//               )}
//               {heroContent?.description && (
//                 <p className="text-gray-600 text-base md:text-lg leading-relaxed break-words">
//                   {stripHtml(heroContent.description)}
//                 </p>
//               )}
//               {/* Use subTitle if available */}
//               {pageData?.subTitle && !heroContent?.highlightText && (
//                 <p className="text-gray-600 text-base md:text-lg leading-relaxed break-words">
//                   {pageData.subTitle}
//                 </p>
//               )}
//               <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//                 <button 
//                   onClick={handleGetStarted} 
//                   className="bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-3 rounded-lg font-semibold transition-colors duration-300 text-center whitespace-nowrap"
//                 >
//                   Enroll Now
//                 </button>
//               </div>
//             </div>

//             <div className="relative flex justify-center mt-8 md:mt-0">
//                <Image
//                 src={
//                   pageData?.pageContent?.heroImage 
//                     ? `https://uat.gatewayabroadeducations.com/uploads/${pageData.pageContent.heroImage}` 
//                     : courseData.image2 
//                       ? `https://uat.gatewayabroadeducations.com/uploads/${courseData.image2}`
//                       : "/placeholder.svg"
//                 }
//                 alt={`${courseName} Preparation`}
//                 width={500}
//                 height={400}
//                 className="rounded-2xl shadow-xl w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px]"
//                 priority
//               />
//             </div>
//           </div>
//         </div>
//       </section>


//       {sliderData.length > 0 && (
//         <section className="bg-[#1F1B2D] py-3">
//           <div className="max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-full mx-auto">
//             <div className="relative overflow-hidden">
//               <div
//                 className="flex marquee-alternate"
//                 style={{
//                   '--marquee-duration': '25s',
//                   '--marquee-direction': 'alternate',
//                   gap: '2rem'
//                 } as React.CSSProperties}
//               >
//                 {sliderData.map((item) => (
//                   <div key={item._id || item.id} className="flex-shrink-0 text-white font-medium whitespace-nowrap text-xs sm:text-sm">
//                     {item.name} {item.courseName} <span className="text-red-400 font-bold">{item.rank}</span>
//                   </div>
//                 ))}
//                 {sliderData.map((item) => (
//                   <div key={`${item._id}-dup` || `${item.id}-dup`} className="flex-shrink-0 text-white font-medium whitespace-nowrap text-xs sm:text-sm">
//                     {item.name} {item.courseName} <span className="text-red-400 font-bold">{item.rank}</span>
//                   </div>
//                 ))}
//               </div>

//               <style jsx>{`
//                 .marquee-alternate {
//                   animation: marqueeAlternate var(--marquee-duration, 25s) linear infinite var(--marquee-direction, alternate);
//                 }
                
//                 .marquee-alternate:hover {
//                   animation-play-state: paused;
//                 }
                
//                 @keyframes marqueeAlternate {
//                   0% { transform: translateX(0); }
//                   100% { transform: translateX(-50%); }
//                 }
                
//                 @media (max-width: 640px) {
//                   .marquee-alternate {
//                     gap: 1rem;
//                   }
//                 }
//               `}</style>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* What is Section - Dynamic */}
//       {whatIsContent?.sectionTitle &&
//       <section className="py-12 md:py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <Image
//                 src={
//                   pageData?.pageContent?.WhatIsImage 
//                     ? `https://uat.gatewayabroadeducations.com/uploads/${pageData.pageContent.WhatIsImage}`
//                     : courseData.image3 
//                       ? `https://uat.gatewayabroadeducations.com/uploads/${courseData.image3}`
//                       : '/placeholder.jpg'
//                 }
//                 alt={`${courseName} Overview`}
//                 width={500}
//                 height={400}
//                 className="rounded-lg w-[90%]"
//                 loading="lazy"
//               />
//             </div>
//             <div>
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
//                 {whatIsContent?.sectionTitle || `What is ${courseName}?`}
//               </h2>
//               {whatIsContent?.description && (
//                 <div 
//                   className="text-gray-600 leading-relaxed"
//                   dangerouslySetInnerHTML={{ __html: whatIsContent.description }}
//                 />
//               )}
//               {/* {whatIsContent?.whatIsOnToefl && (
//                 <div 
//                   className="text-gray-600 leading-relaxed mt-4"
//                   dangerouslySetInnerHTML={{ __html: whatIsContent.whatIsOnToefl }}
//                 />
//               )} */}
//             </div>
//           </div>

//           {/* What's on Section - Dynamic from whatIsOnToefl or editor section */}
//           {((whatIsContent?.whatIsOnToefl && whatIsContent.whatIsOnToefl.includes('<p>')) || editorContent) && (
//             <div className="mt-16">
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
//                 {editorContent?.title || `What is on the ${courseName}?`}
//               </h2>
              
//               {editorContent?.items && editorContent.items.length > 0 ? (
//                 <div className="flex flex-wrap justify-center gap-6">
//                   {editorContent.items.map((item, index) => (
//                     <div key={index} className="bg-white rounded-lg shadow-[0_0_20px_5px_rgba(0,0,0,0.1)] p-6 border border-gray-200 text-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[300px]">
//                       <div className="flex items-center justify-center mx-auto mb-4">
//                         <Image 
//                           src={item.icon ? `/img/gmat-descp-img-${index + 1}.svg` : `/img/gmat-descp-img-${index + 1}.svg`}
//                           alt="Icon" 
//                           width={60} 
//                           height={60}
//                           loading="lazy"
//                         />
//                       </div>
//                       <h5 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h5>
//                       {item.description && (
//                         <div 
//                           className="text-black-600 font-bold text-sm"
//                           dangerouslySetInnerHTML={{ __html: item.description }}
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 // Fallback to whatIsOnToefl content
//                 whatIsContent?.whatIsOnToefl && (
//                   <div 
//                     className="w-full text-center text-gray-600"
//                     dangerouslySetInnerHTML={{ __html: whatIsContent.whatIsOnToefl }}
//                   />
//                 )
//               )}
//             </div>
//           )}
//         </div>
//       </section>}

//       {/* Countries/Scores Section - Dynamic */}
//      {scoreSectionContent?.sectionTitle &&
//       <section className="py-12 md:py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <div className="flex justify-center">
//               <div className="relative">
//                 <Image
//                   src={ `https://uat.gatewayabroadeducations.com/uploads/${pageData.pageContent.Scoresimg}` || "/placeholder.svg"}
//                   alt={`${courseName} Countries`}
//                   className="rounded-lg shadow-lg w-full max-w-md"
//                   width={100}
//                   height={100}
//                   loading="lazy"
//                 />
//               </div>
//             </div>

//             <div>
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
//                 {scoreSectionContent?.sectionTitle || `Countries Accepting ${courseName} Scores`}
//               </h2>
//               {scoreSectionContent?.sectionSubtitle && (
//                 <div dangerouslySetInnerHTML={{ __html: scoreSectionContent.sectionSubtitle }} />
//               )}
//               {!scoreSectionContent?.sectionSubtitle && (
//                 <p className="text-gray-600 mb-6">
//                   {courseName} is accepted in 160 countries around the world.
//                 </p>
//               )}
//               <h6 className="text-lg font-semibold mb-4">
//                 Some of the popular countries accepting {courseName} scores are as follows:
//               </h6>
//               <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
//                 {COUNTRIES.map((country) => (
//                   <div key={country} className="flex items-center text-gray-700">
//                     <img
//                       src="/img/arrow-up-right.svg"
//                       alt="arrow icon"
//                       className="w-10 h-[25px] mr-2 text-green-500"
//                       loading="lazy"
//                     />
//                     <span>{country}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>}

//       {/* Why Choose Section - Dynamic */}
//       <section className="py-12 md:py-20 bg-[#f5f4f8]">
//         <div className="max-w-7xl mx-auto px-4">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
//             {whyChooseContent?.sectionTitle || `Why Choose Gateway Abroad for ${courseName} Test Prep?`}
//           </h2>
          
//           {whyChooseContent?.items && whyChooseContent.items.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {whyChooseContent.items.map((item, index) => (
//                 <div key={index} className="bg-white rounded-lg p-6 text-center">
//                   <div className="w-[90px] h-[90px] bg-[#D71635] rounded-full flex items-center justify-center mx-auto mb-5">
//                     <Image 
//                       src={item.icon ? `/img/why-choose-ga-img-${Math.min(index + 1, 6)}.svg` : `/img/why-choose-ga-img-${Math.min(index + 1, 6)}.svg`} 
//                       alt={item.title || 'Feature'} 
//                       width={60} 
//                       height={32} 
//                       loading="lazy" 
//                     />
//                   </div>
//                   <p className="text-black-600 font-bold">{item.title}</p>
//                   {item.description && (
//                     <div 
//                       className="text-gray-500 text-sm mt-2"
//                       dangerouslySetInnerHTML={{ __html: item.description }}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             // Fallback to old data structure
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {['one', 'two', 'three', 'four', 'five', 'six'].map((key, index) => {
//                 const text = courseData.whyChoose?.[key];
//                 if (!text) return null;
                
//                 return (
//                   <div key={key} className="bg-white rounded-lg p-6 text-center">
//                     <div className="w-[90px] h-[90px] bg-[#D71635] rounded-full flex items-center justify-center mx-auto mb-5">
//                       <Image src={`/img/why-choose-ga-img-${index + 1}.svg`} alt="Feature" width={60} height={32} loading="lazy" />
//                     </div>
//                     <p className="text-black-600 font-bold">{text}</p>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Brochure Section */}
//       <section className="py-1 md:py-10 bg-red-600 max-w-[69rem] mx-auto rounded-[20px] my-[70px]">
//         <div className="max-w-7xl mx-auto px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-3 items-center">
//             <div className="lg:col-span-2 text-center lg:text-left">
//               <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
//                 Ready, set, knowledge! Download our brochure and get started.
//               </h2>
//             </div>
//             <div className="text-center">
//               {BANNER_COURSES.includes(courseName) ? (
//                 <button
//                   onClick={() => handleDownload(`/brosher/${courseName}.pdf`)}
//                   className="bg-white text-red-600 px-20 py-3 rounded-[40px] font-semibold hover:bg-gray-100 transition-colors duration-300"
//                 >
//                   Download
//                 </button>
//               ) : (
//                 <button className="bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold cursor-not-allowed" disabled>
//                   Brochure Coming Soon
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>



//       <section className="py-12 bg-gray-300 relative">
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="/img/gmat-testimonials-bg.svg"
//             alt="Background"
//             fill
//             className="object-cover"
//             quality={75}
//             loading="lazy"
//           />
//         </div>
//         <div className="absolute inset-0 bg-gray-400/10 z-1"></div>
//         <div className="max-w-7xl mx-auto px-4 relative z-10">
//           <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
//             What Our {courseName} Prep Achievers Say
//           </h2>

//           {!hasTestimonials ? (
//             <div className="text-center text-gray-500 py-8">No testimonials available</div>
//           ) : (
//             <div className="relative group">
//               <div ref={sliderRef} className="keen-slider py-4">
//                 {testimonials.map((test, idx) => (
//                   <div key={idx} className="keen-slider__slide p-4">
//                     <div className="relative bg-white box-border caret-transparent z-0 ml-[30px] rounded-3xl md:ml-[50px] shadow-lg before:accent-auto before:border-b-gray-200 before:box-border before:caret-transparent before:text-neutral-800 before:block before:text-base before:not-italic before:normal-nums before:font-normal before:h-0 before:left-[-35px] before:tracking-[normal] before:leading-6 before:list-outside before:list-disc before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-0 before:z-[-1] before:border-t-white before:border-t-[25px] before:border-x-transparent before:border-x-[50px] before:border-separate before:border-solid before:top-0 before:font-noto_sans before:md:left-[-50px] before:md:border-t-[55px] before:md:border-x-[80px]">
//                       <div className="box-border caret-transparent pt-5 px-5 md:pt-[35px] md:px-[30px]">
//                         <div className="items-center box-border caret-transparent flex justify-between">
//                           <h6 className="text-gray-700 text-lg font-bold box-border caret-transparent leading-[21.6px] mb-2">
//                             {test.name}
//                           </h6>
//                           <ul className="box-border caret-transparent flex leading-[normal] list-none mb-4 pl-0">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                               <li key={star} className="text-amber-400 box-border caret-transparent">
//                                 <Star className="w-[18px] h-[18px] fill-amber-400" />
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                         <p className="text-zinc-500 text-sm font-medium box-border caret-transparent max-w-[90%] min-h-0 text-left mb-4 py-[15px] md:max-w-none md:min-h-[198px]">
//                           {test.content?.substring(0, 250) || 'No testimonial content available.'}
//                         </p>
//                       </div>
//                       <div className="bg-red-600 box-border caret-transparent px-5 py-3.5 rounded-b-3xl md:px-[30px]"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {hasMultipleTestimonials && (
//                 <>
//                   <button
//                     onClick={handlePrev}
//                     className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200 z-10"
//                     aria-label="Previous testimonial"
//                   >
//                     <ChevronLeft className="h-6 w-6 text-gray-600" />
//                   </button>
//                   <button
//                     onClick={handleNext}
//                     className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200 z-10"
//                     aria-label="Next testimonial"
//                   >
//                     <ChevronRight className="h-6 w-6 text-gray-600" />
//                   </button>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </section>


//       <section className="relative bg-gradient-to-b from-purple-400/20 to-red-600/20 py-12 md:py-20">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="mb-12">
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
//               {pricingContent?.sectionTitle || 'Plans & Pricing'}
//             </h2>
//             {pricingContent?.description && (
//               <div 
//                 className="text-zinc-500 font-medium"
//                 dangerouslySetInnerHTML={{ __html: pricingContent.description }}
//               />
//             )}
//           </div>

//           <div className="backdrop-blur-lg bg-white/80 shadow-2xl rounded-3xl py-10 px-4 md:px-6 md:py-12">
//             {pricingContent?.plans && pricingContent.plans.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 {pricingContent.plans.map((plan, index) => {
//                   const isHybrid = plan.type === 'hybrid';
//                   const isPopular = plan.badge === 'Most Popular';
                  
//                   return (
//                     <div 
//                       key={index} 
//                       className={`px-4 md:px-6 ${isHybrid ? 'bg-red-600 shadow-2xl rounded-3xl p-6 md:p-8 md:-mt-20 relative' : ''}`}
//                     >
//                       {isPopular && (
//                         <div className="text-right mb-4">
//                           <span className="text-white text-xs font-extrabold bg-zinc-800 tracking-wider px-4 py-2 rounded-full">
//                             Most Popular
//                           </span>
//                         </div>
//                       )}
//                       <h5 className={`text-2xl md:text-[28px] font-medium ${isHybrid ? 'text-white' : 'text-zinc-700'} mb-6`}>
//                         {plan.title}
//                       </h5>
//                       {plan.badge && !isPopular && (
//                         <span className="inline-block bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full mb-4">
//                           {plan.badge}
//                         </span>
//                       )}
//                       {/* Show price if available */}
//                       {plan.price && plan.price !== 'Contact for Pricing' && (
//                         <p className={`text-xl font-bold ${isHybrid ? 'text-white' : 'text-zinc-700'} mb-2`}>
//                           {plan.price}
//                         </p>
//                       )}
//                       {/* Show duration if available */}
//                       {plan.duration && (
//                         <p className={`text-sm ${isHybrid ? 'text-white/80' : 'text-zinc-500'} mb-4`}>
//                           {plan.duration}
//                         </p>
//                       )}
//                       <div className="mb-8">
//                         <div 
//                           className={`${isHybrid ? 'text-white' : 'text-neutral-600'} font-medium text-justify`}
//                           dangerouslySetInnerHTML={{ __html: plan.description }}
//                         />
//                         {plan.additionalDescription && (
//                           <div 
//                             className={`${isHybrid ? 'text-white' : 'text-neutral-600'} font-medium text-justify mt-2`}
//                             dangerouslySetInnerHTML={{ __html: plan.additionalDescription }}
//                           />
//                         )}
//                         {plan.features && (
//                           <p className={`${isHybrid ? 'text-white' : 'text-neutral-600'} font-medium text-sm mt-4`}>
//                             {plan.features}
//                           </p>
//                         )}
//                       </div>
//                       <div className="text-center">
//                         <button
//                           onClick={() => {
//                             if (plan.buttonUrl) {
//                               router.push(plan.buttonUrl);
//                             } else {
//                               handleGetStarted();
//                             }
//                           }}
//                           className={`text-white text-base md:text-lg font-bold ${isHybrid ? 'bg-black hover:bg-gray-800' : 'bg-red-600 hover:bg-red-700'} shadow-lg px-12 py-3 rounded-full transition-colors duration-300`}
//                         >
//                           {plan.buttonText || 'Choose Plan'}
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               // Fallback to static pricing
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 <div className="text-center text-gray-500 col-span-3">No pricing data available</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Test Prep Resources Section - Dynamic */}
//       <section className="py-12 md:py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
//             {resourcesContent?.sectionTitle || `Free ${courseName} Prep Resources`}
//           </h2>

//           {resourcesContent?.items && resourcesContent.items.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {/* {console.log(resourcesContent.items)} */}
//               {resourcesContent.items.map((item, index) => (
//                 <div key={index} className="bg-white rounded-2xl shadow-lg p-[1rem] border border-gray-200 text-center">
//                   <div className="flex items-center justify-center mx-auto mb-6">
//                     <Image 
//                       src={item.file || `/img/resource-img-${index + 1}.svg`} 
//                       alt={item.title || 'Resource'} 
//                       width={350} 
//                       height={40} 
//                       loading="lazy" 
//                     />
//                   </div>
//                   <h4 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h4>
//                   {item.description && (
//                     <div 
//                       className="text-gray-600 mb-6"
//                       dangerouslySetInnerHTML={{ __html: item.description }}
//                     />
//                   )}
//                   <button
//                     onClick={() => {
//                       if (item.url) {
//                         const link = item.url.startsWith('http') ? item.url : getResourceLink(
//                           index === 0 ? 'practiceMaterial' : 
//                           index === 1 ? 'otherResources' : 
//                           'syllabus'
//                         );
//                         handleDownload(link);
//                       } else {
//                         handleDownload(getResourceLink(
//                           index === 0 ? 'practiceMaterial' : 
//                           index === 1 ? 'otherResources' : 
//                           'syllabus'
//                         ));
//                       }
//                     }}
//                     className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full"
//                   >
//                     {item.buttonText || 'Access Resource'}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             // Fallback to static resources
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {/* Practice Material */}
//               <div className="bg-white rounded-2xl shadow-lg p-[1rem] border border-gray-200 text-center">
//                 <div className="flex items-center justify-center mx-auto mb-6">
//                   <Image src="/img/resource-img-1.svg" alt="Practice Material" width={350} height={40} loading="lazy" />
//                 </div>
//                 <h4 className="text-xl font-bold text-gray-900 mb-4">Practice Material</h4>
//                 <p className="text-gray-600 mb-6">
//                   Take the {courseName} practice material and begin your {courseName} preparation now
//                 </p>
//                 <button
//                   onClick={() => handleDownload(getResourceLink('practiceMaterial'))}
//                   className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full"
//                 >
//                   Take {courseName} Practice Material
//                 </button>
//               </div>

//               {/* Other Resources */}
//               <div className="bg-white rounded-2xl shadow-lg p-[1rem] border border-gray-200 text-center">
//                 <div className="flex items-center justify-center mx-auto mb-6">
//                   <Image src="/img/resource-img-2.svg" alt="Other Resources" width={350} height={40} loading="lazy" />
//                 </div>
//                 <h4 className="text-xl font-bold text-gray-900 mb-4">Other Resources</h4>
//                 <p className="text-gray-600 mb-6">
//                   Begin your {courseName} coaching with this other resources prepared by our experts to help you with your {courseName} prep
//                 </p>
//                 <button
//                   onClick={() => handleDownload(getResourceLink('otherResources'))}
//                   className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full"
//                 >
//                   Download {courseName} Other Resources
//                 </button>
//               </div>

//               {/* Syllabus Download */}
//               <div className="bg-white rounded-2xl shadow-lg p-[1rem] border border-gray-200 text-center">
//                 <div className="flex items-center justify-center mx-auto mb-6">
//                   <Image src="/img/resource-img-3.svg" alt="Syllabus Download" width={350} height={40} loading="lazy" />
//                 </div>
//                 <h4 className="text-xl font-bold text-gray-900 mb-4">Syllabus Download</h4>
//                 <p className="text-gray-600 mb-6">
//                   Download the {courseName} syllabus now and get a head start on your {courseName} preparation
//                 </p>
//                 <button
//                   onClick={() => handleDownload(getResourceLink('syllabus'))}
//                   className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full"
//                 >
//                   Download {courseName} Syllabus
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

// <section className="py-12 bg-gray-50">
//   <div className="max-w-7xl mx-auto px-4">
//     <div className="text-center mb-8">
//       <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//         {ComponentsLanguage?.sectionTitle}
//       </h2>

//       {ComponentsLanguage?.sectionDescription && (
//         <p className="text-gray-600">
//           {ComponentsLanguage.sectionDescription}
//         </p>
//       )}
//     </div>

//     <div className="flex flex-col lg:flex-row gap-6">
      
//       <div className="lg:w-5/12">
//          <Image
//                   src={ `https://uat.gatewayabroadeducations.com/uploads/${pageData.pageContent.Scoresimg}` || "/placeholder.svg"}
//                   alt={`${courseName} Countries`}
//                   className="rounded-lg shadow-lg w-full max-w-md"
//                   width={100}
//                   height={100}
//                   loading="lazy"
//                 />
//       </div>

//       {/* Content */}
//       <div className="lg:w-7/12">
//         {ComponentsLanguage?.items?.length > 0 && (
//           <>
//             <div className="flex flex-wrap gap-2 mb-4">
//               {ComponentsLanguage.items.map((item: any, index: number) => (
//                 <button
//                   key={`trigger-${item.section}-${index}`}
//                   className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
//                     activeTab === item.section
//                       ? "bg-red-600 text-white"
//                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                   }`}
//                   onClick={() => setActiveTab(item.section)}
//                 >
//                   {item.section}
//                 </button>
//               ))}
//             </div>

//             {ComponentsLanguage.items.map((item: any, index: number) => (
//               <div
//                 key={`content-${item.section}-${index}`}
//                 className={
//                   activeTab === item.section ? "block" : "hidden"
//                 }
//               >
//                 <div className="bg-white rounded-lg p-4 shadow-sm">
                  
//                   {item.content && (
//                     <div
//                       className="text-gray-700 text-justify mb-3"
//                       dangerouslySetInnerHTML={{
//                         __html: item.content,
//                       }}
//                     />
//                   )}

//                 </div>
//               </div>
//             ))}
//           </>
//         )}
//       </div>
//     </div>
//   </div>
// </section>

//       <section className="py-12 md:py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
//             <p className="text-gray-600">Can't find the answer you are looking for?</p>
//           </div>

//           <div className="max-w-7xl mx-auto">
//             <Accordion type="single" collapsible className="w-3xl space-y-4">
//               {faqData.map((f, index) => (
//                 <AccordionItem
//                   key={index}
//                   value={`item-${index}`}
//                   className="bg-white rounded-lg border border-gray-200 px-6"
//                 >
//                   <AccordionTrigger className="font-semibold py-4 hover:no-underline">
//                     {f.title}
//                   </AccordionTrigger>
//                   <AccordionContent className="text-gray-700 pb-4 text-sm">
//                     {f.content}
//                   </AccordionContent>
//                 </AccordionItem>
//               ))}
//             </Accordion>
//           </div>
//         </div>
//       </section>

//       {/* Counselling Session Section - Dynamic */}
//       <section className="py-12 md:py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="bg-[#fbe7ea] rounded-2xl sm:rounded-[24px] shadow-lg mx-auto w-full max-w-[7xl]">
//             <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-[1rem]">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
//                 <div className="text-center lg:text-left lg:pl-[17px]">
//                   <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[36px] font-bold text-[#D71635] mb-4 lg:leading-[37px]">
//                     {counsellingContent?.title || 'Avail A Complementary Counselling Session'}
//                   </h2>
//                   {counsellingContent?.description && (
//                     <div 
//                       className="text-base lg:text-[18px] text-[#666276] mb-4 sm:mb-6"
//                       dangerouslySetInnerHTML={{ __html: counsellingContent.description }}
//                     />
//                   )}
//                   <Link
//                     href={counsellingContent?.buttonUrl || '/contact'}
//                     className="inline-block bg-[#d71635] hover:bg-[#b5122b] text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-3xl text-sm sm:text-base font-bold shadow-[0_0_8px_0_rgba(0,0,0,0.2)] transition-all duration-300"
//                   >
//                     {counsellingContent?.buttonText || 'Contact us'}
//                   </Link>
//                 </div>
//                 <div className="flex justify-center">
//                   <Image
//                     src={counsellingContent?.image || '/img/counselling-session.svg'}
//                     alt="Counselling Session"
//                     width={400}
//                     height={300}
//                     loading="lazy"
//                     className="w-full max-w-xs sm:max-w-sm lg:max-w-[25rem]"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Contact Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-xl font-bold text-gray-900">Get in touch</h3>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                   aria-label="Close modal"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               <form onSubmit={handleSubmitContact(handleFormSubmit)} className="space-y-4">
//                 <div>
//                   <input
//                     type="text"
//                     {...registerContact('name', { required: 'Name is required' })}
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${contactErrors.name ? 'border-red-500' : 'border-gray-300'}`}
//                     placeholder="Name"
//                   />
//                   {contactErrors.name && (
//                     <p className="text-red-500 text-sm mt-1">{contactErrors.name.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <input
//                     type="email"
//                     {...registerContact('email', {
//                       required: 'Email is required',
//                       pattern: {
//                         value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                         message: 'Invalid email address',
//                       },
//                     })}
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${contactErrors.email ? 'border-red-500' : 'border-gray-300'}`}
//                     placeholder="Email"
//                   />
//                   {contactErrors.email && (
//                     <p className="text-red-500 text-sm mt-1">{contactErrors.email.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <input
//                     type="text"
//                     {...registerContact('mobile', {
//                       required: 'Mobile No. is required',
//                       pattern: {
//                         value: /^\d{10,15}$/,
//                         message: 'Invalid phone number',
//                       },
//                     })}
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${contactErrors.mobile ? 'border-red-500' : 'border-gray-300'}`}
//                     placeholder="Mobile No."
//                   />
//                   {contactErrors.mobile && (
//                     <p className="text-red-500 text-sm mt-1">{contactErrors.mobile.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <input
//                     type="text"
//                     {...registerContact('city', { required: 'City is required' })}
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${contactErrors.city ? 'border-red-500' : 'border-gray-300'}`}
//                     placeholder="City"
//                   />
//                   {contactErrors.city && (
//                     <p className="text-red-500 text-sm mt-1">{contactErrors.city.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <textarea
//                     {...registerContact('message')}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                     rows={3}
//                     placeholder="Message"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300"
//                 >
//                   SUBMIT
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Course;



