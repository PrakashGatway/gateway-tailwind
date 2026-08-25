"use client";

import MultiStepForm from "@/components/pages/multiStep";
import CardStackGridSection from "@/components/pages/cardStack";
import Component, { SingleSlider } from "@/components/pages/partnerSlider";
import Image from "next/image";
import Link from "next/link";
import CounterUp from "@/components/CounterUp";
import { useCallback, useEffect, useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useRouter } from "next/navigation";
import PageServices from "@/services/PageServices";
import { constant } from "@/constant/index.constant";
import ProcessRoadmap, { DynamicIcon } from "../sections/processRoad";
import { baseUrl } from "@/services/axiosInstance";
import { Select } from "../ui/select";
import ContactForm from "./UkForm";
import WhyStudyUK, {
  GatewayAbroadProcess,
  HorizontalStackCards,
  ScrollStackIntakes,
  TopUKUniversities,
  UKScholarships,
  UKStudyCosts,
  UKUniversityIntakes,
} from "../ukpageComponent/whyStudyin";
import BlogNew, { formatDate, sanitizedData } from "../blognew";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Star } from "lucide-react";
import FAQSection from "../home/FaqSection";

// Type Definitions
interface BlogArticle {
  _id?: string;
  id?: string;
  image?: string;
  coverImage?: string;
  blogTitle?: string;
  title?: string;
  Slug?: string;
  slug?: string;
  createdAt?: string;
  blogDescription?: string;
  description?: string;
  type?: string;
}

interface ContentSection {
  type: string;
  content: any;
}

interface StudyInUkProps {
  content?: {
    title?: string;
    subTitle?: string;
    sections?: ContentSection[];
    pageContent?: {
      heroImage?: string;
    };
  };
  country?: string;
  teamMembers?: {
    member?: any[];
  };
  youtubeVideo?: {
    media?: any[];
  };
  faq?: {
    faq?: Array<{ title: string; content: string }>;
  };
  articleres?: BlogArticle[];
}

interface Testimonial {
  name: string;
  content: string;
  rating?: number;
}

// Helper Functions
export const highlightText = (text: string): (string | JSX.Element)[] => {
  if (!text) return [text || ""];
  const parts = text.split("||");

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="text-red-600 font-bold">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const StudyInUk = ({
  content,
  country,
  teamMembers: member,
  youtubeVideo: videoStudednt,
  faq,
  articleres,
}: StudyInUkProps) => {
  // State Management
  const [form, setForm] = useState<any[]>([]);
  const [blogData, setBlogData] = useState<BlogArticle[]>([]);
  const [mergedData, setMergedData] = useState<BlogArticle[]>([]);
  const [video, setVideo] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [faqData, setFaqData] = useState<any[]>([]);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [testimonials, setTestimonial] = useState<Testimonial[]>([]);

  const router = useRouter();
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Testimonial Slider Configuration
  const [testimonialSliderRef, testimonialInstanceRef] = useKeenSlider({
    initial: 0,
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 2,
          spacing: 16,
        },
      },
      "(min-width: 768px)": {
        slides: {
          perView: 3,
          spacing: 20,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 2,
          spacing: 20,
        },
      },
    },
    drag: true,
    rubberband: true,
    mode: "snap",
  });

  // Blog Slider Configuration
  const [blogSliderRef, blogInstanceRef] = useKeenSlider({
    initial: 0,
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 2,
          spacing: 16,
        },
      },
      "(min-width: 768px)": {
        slides: {
          perView: 3,
          spacing: 20,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3,
          spacing: 20,
        },
      },
    },
    drag: true,
    rubberband: true,
    mode: "snap",
  });

  // Autoplay Functions
  const startAutoplay = useCallback((): void => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    if (!blogInstanceRef.current) return;

    autoplayRef.current = setInterval(() => {
      blogInstanceRef.current?.next();
    }, 3000);
  }, [blogInstanceRef]);

  const stopAutoplay = useCallback((): void => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  // Auto slide effect for blog
  useEffect(() => {
    if (!autoPlay || !blogInstanceRef.current || blogData.length <= 1) return;

    const interval = setInterval(() => {
      const totalSlides = blogInstanceRef.current?.track.details.slides.length || 0;
      const nextSlide = (currentSlide + 1) % totalSlides;

      blogInstanceRef.current?.moveToIdx(nextSlide);
      setCurrentSlide(nextSlide);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSlide, autoPlay, blogData.length, blogInstanceRef]);

  // API Functions
  const fetchBlogs = useCallback(
    async (page = 1, category = country?.toUpperCase() || "", search = "") => {
      try {
        const res = await PageServices.getBlogData({
          page,
          limit: 4,
          category,
          search,
        });
        setBlogData(res.data.blog || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    },
    [country]
  );

  const getAllTestimonial = useCallback(async (value: string): Promise<void> => {
    try {
      const response = await PageServices.getTestimonialByCat(value);
      if (response.status === "success") {
        setTestimonial(response.data.testimonial || []);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  }, []);

  const getAllFaqData = useCallback(async (value: string): Promise<void> => {
    try {
      const response = await PageServices.getAllFaqForFront(value);
      if (response.status === "success") {
        setFaqData(response.data.faq || []);
      }
    } catch (error) {
      console.error("Error fetching FAQ data:", error);
    }
  }, []);

  const getContentByType = useCallback(
    (type: string): any => {
      const item = content?.sections?.find((obj) => obj.type === type);
      return item ? item.content : undefined;
    },
    [content]
  );

  const getCoverImageUrl = useCallback((coverImage: string): string => {
    if (!coverImage) return "/img/placeholder-blog.jpg";
    if (coverImage.startsWith("http")) return coverImage;
    return `https://uat.gatewayabroadeducations.com/uploads/${coverImage}`;
  }, []);

  // Event Handlers
  const handleGetStarted = (): void => {
    window.dispatchEvent(new CustomEvent("openFooterModal"));
  };

  // Effects
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    const merged: BlogArticle[] = [
      ...(blogData || []).map((item: BlogArticle) => ({
        ...item,
        type: "blog",
      })),
      ...(articleres || []).map((item: BlogArticle) => ({
        ...item,
        type: "article",
      })),
    ];
    setMergedData(merged);
  }, [blogData, articleres]);

  console.log(articleres,'blog',blogData,mergedData)

  useEffect(() => {
    getAllTestimonial("spokenEnglish");
  }, [getAllTestimonial]);

  useEffect(() => {
    getAllFaqData("spokenEnglish");
  }, [getAllFaqData]);

  useEffect(() => {
    if (videoStudednt?.media) {
      setVideo(videoStudednt.media);
    }
    if (member?.member) {
      setForm(member.member || []);
    }
  }, [member, videoStudednt]);

  // Render Helper for Blog Card
  const renderBlogCard = (blog: BlogArticle, index: number) => {
    const imageUrl =
      blog?.image
        ? `https://api.gatewayabroadeducations.com/api/uploads/${blog.image}`
        : blog?.coverImage
        ? getCoverImageUrl(blog.coverImage)
        : "https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg";

    const title = blog?.blogTitle || blog?.title || "Blog";
    const slug = blog?.Slug
      ? `/blog-description/${blog.Slug}`
      : blog?.slug
      ? `/article/${blog.slug}`
      : "#";

    return (
      <div
        key={blog?._id || blog?.id || index}
        className="keen-slider__slide min-w-0 cursor-pointer p-3"
        onClick={() => {
          if (slug !== "#") {
            router.push(slug);
          }
        }}
      >
        <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="relative h-48 w-full shrink-0 overflow-hidden bg-gray-100 xl:h-52">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="w-full object-cover object-top transition-transform duration-500 hover:scale-105"
              loading="lazy"
              // sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
              <span>{formatDate(blog?.createdAt)}</span>
            </div>
            <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors duration-300 hover:text-red-600">
              {title}
            </h3>
            <div
              className="line-clamp-2 text-sm leading-6 text-gray-600"
              dangerouslySetInnerHTML={sanitizedData(
                blog?.blogDescription || blog?.description || ""
              )}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderMobileBlogCard = (blog: BlogArticle, index: number) => {
    const imageUrl =
      blog?.image
        ? `https://api.gatewayabroadeducations.com/api/uploads/${blog.image}`
        : blog?.coverImage
        ? getCoverImageUrl(blog.coverImage)
        : "https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg";

    return (
      <div
        key={blog?._id || blog?.id || index}
        className="cursor-pointer"
        onClick={() => {
          const slug = blog?.Slug
            ? `/blog-description/${blog.Slug}`
            : `/article/${blog.slug}`;
          router.push(slug);
        }}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
          <div className="relative h-48 sm:h-52 w-full shrink-0 bg-gray-100">
            <Image
              src={imageUrl}
              alt={blog?.blogTitle || blog?.title || "Blog"}
              fill
              className="object-cover w-full object-top"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="flex-1 p-3 sm:p-4">
            <div className="mb-1.5 sm:mb-2 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <span>{formatDate(blog?.createdAt)}</span>
            </div>
            <h3 className="mb-1.5 sm:mb-2 line-clamp-2 text-sm sm:text-base font-bold text-gray-900 transition-colors hover:text-red-600">
              {blog?.blogTitle || blog?.title}
            </h3>
            <div
              className="line-clamp-2 text-xs sm:text-sm text-gray-600"
              dangerouslySetInnerHTML={sanitizedData(
                blog?.blogDescription || blog?.description || ""
              )}
            />
          </div>
        </div>
      </div>
    );
  };

  const heroContent = getContentByType("hero");
  const stats = heroContent?.stats || [];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-pink-100 pt-8 py-1 flex items-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="space-y-4 w-full items-start lg:w-[62%]">
              <div className="">
                <h1 className="text-3xl lg:text-5xl xl:text-[2.6rem] font-bold text-black !leading-[1.3]">
                  {highlightText(content?.title) || content?.title}
                </h1>
                <div
                  className="text-base lg:text-lg text-justify leading-relaxed mt-4"
                  style={{
                    color: "rgba(0, 0, 0, 0.9)",
                    textShadow: "0 2px 8px rgba(255, 255, 255, 0.6)",
                  }}
                  dangerouslySetInnerHTML={{
                    __html:
                      content?.subTitle ||
                      "Unlock your potential with world-class education in the United Kingdom. Experience academic excellence in historic universities.",
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                {content?.sections?.[0]?.content?.points?.map(
                  (item: any, i: number) => (
                    <div
                      key={i}
                      className="px-4 py-1.5 flex rounded-full border bg-white/50 backdrop-blur-sm shadow border-1 border-gray-300 hover:shadow-md transition"
                    >
                      <p className="font-semibold">{item?.content}</p>
                    </div>
                  )
                )}
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 pt-4 flex-wrap">
                {stats[0] && (
                  <div className="border-2 border-red-300 rounded-[20px] px-3 py-2 min-w-[120px] sm:min-w-[140px] text-center flex-shrink-0">
                    <h3 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold mb-1">
                      <CounterUp end={stats[0]?.value} />
                      <span className="text-red-600"></span>
                    </h3>
                    <p className="text-black font-semibold text-xs mb-0">
                      Students Placed
                    </p>
                  </div>
                )}
                {stats[1] && (
                  <div className="border-2 border-red-300 rounded-[20px] px-3 py-2 min-w-[120px] sm:min-w-[140px] text-center flex-shrink-0">
                    <h3 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold mb-1">
                      <CounterUp end={stats[1]?.value} />
                      <span className="text-red-600"></span>
                    </h3>
                    <p className="text-black font-semibold text-xs mb-0">
                      Universities
                    </p>
                  </div>
                )}
                {stats[2] && (
                  <div className="border-2 border-red-300 rounded-[20px] px-3 py-2 min-w-[120px] sm:min-w-[140px] text-center flex-shrink-0">
                    <h3 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold mb-1">
                      <CounterUp end={stats[2]?.value} />
                      <span className="text-red-600"></span>
                    </h3>
                    <p className="text-black font-semibold text-xs mb-0">
                      Cities
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={handleGetStarted}
                  className="btn-primary inline-block text-center group"
                >
                  <span className="relative z-10">Get Started Today</span>
                </button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative animate-fadeInRight w-full lg:w-[38%]">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      <SingleSlider />
      <WhyStudyUK content={content} country={country} />
      <MultiStepForm />

      <TopUKUniversities
        content={content?.sections?.[2]?.content}
        country={country}
      />
      <UKStudyCosts content={content} country={country} />
      <UKUniversityIntakes content={content} />
      <GatewayAbroadProcess content={content} country={country} />
      <UKScholarships content={content} />
      <ProcessRoadmap />

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-300 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/gmat-testimonials-bg.svg"
            alt="Background"
            fill
            className="object-cover"
            loading="lazy"
            quality={75}
          />
        </div>
        <div className="absolute inset-0 bg-gray-400/10 z-1"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-8">
            What Our Achievers Say
          </h2>

          {testimonials.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Loading testimonials...
            </div>
          ) : (
            <div className="relative group">
              <div ref={testimonialSliderRef} className="keen-slider">
                {testimonials.map((test, idx) => (
                  <div key={idx} className="keen-slider__slide p-2 pb-6">
                    <div className="relative bg-white box-border caret-transparent z-0 ml-[30px] rounded-3xl md:ml-[50px] shadow-lg before:accent-auto before:border-b-gray-200 before:box-border before:caret-transparent before:text-neutral-800 before:block before:text-base before:not-italic before:normal-nums before:font-normal before:h-0 before:left-[-35px] before:tracking-[normal] before:leading-6 before:list-outside before:list-disc before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-0 before:z-[-1] before:border-t-white before:border-t-[25px] before:border-x-transparent before:border-x-[50px] before:border-separate before:border-solid before:top-0 before:font-noto_sans before:md:left-[-50px] before:md:border-t-[55px] before:md:border-x-[80px]">
                      <div className="box-border caret-transparent pt-5 px-5 md:pt-[35px] md:px-[30px]">
                        <div className="items-center box-border caret-transparent flex justify-between">
                          <h6 className="text-gray-700 text-lg font-bold box-border caret-transparent leading-[21.6px] mb-2">
                            {test.name}
                          </h6>
                          <ul className="box-border caret-transparent flex leading-[normal] list-none mb-4 pl-0">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <li
                                key={star}
                                className="text-amber-400 text-lg box-border caret-transparent"
                              >
                                <Star className="w-[18px] h-[18px] fill-amber-400" />
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium box-border caret-transparent max-w-[90%] min-h-0 text-left mb-4 py-[15px] md:max-w-none md:min-h-[198px]">
                          {test.content}
                        </p>
                      </div>
                      <div className="bg-red-600 box-border caret-transparent px-5 py-3.5 rounded-b-3xl md:px-[30px]"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Counselling Session Section */}
      <section className="py-12 md:py-12 bg-white">
        <div className="mx-auto px-4 max-w-7xl">
          <div className="bg-[#fbe7ea] rounded-2xl sm:rounded-[24px] shadow-lg mx-auto w-full">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                <div className="w-full lg:w-[75%] pt-6">
                  <div className="text-center lg:text-left pl-[17px]">
                    <h2 className="text-xl sm:text-2xl lg:text-4xl xl:text-[36px] font-bold mb-4 text-[#D71635] lg:leading-[37px]">
                      Avail A Complementary Counselling Session
                    </h2>
                    <p className="text-base lg:text-[18px] mb-4 sm:mb-6 text-[#666276]">
                      Join thousand of instructors and earn money hassle free!
                    </p>
                    <a
                      href="/contact"
                      className="inline-block bg-[#d71635] text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-3xl text-sm sm:text-base font-bold shadow-[0_0_8px_0_rgba(0,0,0,0.2)] hover:bg-[#b5122b] transition-all duration-300"
                    >
                      Contact us
                    </a>
                  </div>
                </div>
                <div className="w-full lg:w-[38%]">
                  <div className="flex justify-center">
                    <img
                      src="img/counselling-session.svg"
                      alt="Counselling Session"
                      className="w-full max-w-xs sm:max-w-sm lg:max-w-[25rem]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 lg:mb-10 xl:mb-12 gap-3 sm:gap-4">
            <h2 className="heading text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-0 leading-tight">
              Important Facts & Information
            </h2>
            <button className="bg-[#da1634] text-white hover:scale-105 duration-200 transform transition px-4 sm:px-5 md:px-[20px] py-2 sm:py-2.5 md:py-[10px] rounded-[30px] font-bold text-sm sm:text-base whitespace-nowrap flex-shrink-0">
              <Link
                href={`/blog?category=${country?.toUpperCase()}`}
                className="site-btn ng-[] whitespace-nowrap"
              >
                Go to blog
              </Link>
            </button>
          </div>

          <div className="w-full min-w-0 max-w-full overflow-hidden">
            {mergedData.length > 0 ? (
              <>
                {/* Desktop Blog Slider */}
                <div
                  className=" hidden w-full min-w-0 max-w-full overflow-hidden lg:flex"
                >
                  

                  <BlogNew blog={mergedData} layout="slider" />

                </div>

                {/* Mobile/Tablet Grid View */}
                <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {mergedData.slice(0, 4).map((blog, index) =>
                    renderMobileBlogCard(blog, index)
                  )}
                  {mergedData.length > 4 && (
                    <div className="col-span-1 sm:col-span-2 flex justify-center mt-2">
                      <button className="bg-[#da1634] text-white hover:scale-105 duration-200 transform transition px-6 py-2.5 rounded-[30px] font-bold text-sm">
                        <Link
                          href={`/blog?category=${country?.toUpperCase()}`}
                          className="whitespace-nowrap"
                        >
                          View All Blogs
                        </Link>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-8 sm:py-12 text-center">
                <p className="text-gray-500 text-sm sm:text-base">
                  No blog posts available.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white">
        <FAQSection content={"Frequently asked questions"} faq={faq} />
      </section>
    </>
  );
};

export default StudyInUk;






// "use client";

// import MultiStepForm from "@/components/pages/multiStep";
// import CardStackGridSection from "@/components/pages/cardStack";
// import Component, { SingleSlider } from "@/components/pages/partnerSlider";
// import Image from "next/image";
// import Link from "next/link";
// import CounterUp from "@/components/CounterUp";
// // import { useGlobal } from "@/hooks/AppStateContext";
// import { useCallback, useEffect, useState, useRef } from "react";
// import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";
// import { useRouter } from "next/navigation";
// import PageServices from "@/services/PageServices";
// import { constant } from "@/constant/index.constant";
// import ProcessRoadmap, { DynamicIcon } from "../sections/processRoad";
// import { baseUrl } from "@/services/axiosInstance";
// import { Select } from "../ui/select";
// import ContactForm from "./UkForm";
// import WhyStudyUK, {
//   GatewayAbroadProcess,
//   HorizontalStackCards,
//   ScrollStackIntakes,
//   TopUKUniversities,
//   UKScholarships,
//   UKStudyCosts,
//   UKUniversityIntakes,
// } from "../ukpageComponent/whyStudyin";
// import BlogNew, { formatDate, sanitizedData } from "../blognew";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../ui/accordion";
// import { Star } from "lucide-react";
// import FAQSection from "../home/FaqSection";

// export const highlightText = (text) => {
//   const parts = text.split("||");

//   return parts.map((part, index) =>
//     index % 2 === 1 ? (
//       <span key={index} className="text-red-600 font-bold">
//         {part}
//       </span>
//     ) : (
//       part
//     ),
//   );
// };
// const StudyInUk = ({
//   content,
//   country,
//   teamMembers: member,
//   youtubeVideo: videoStudednt,
//   faq,
//   articleres,
// }: any) => {
//   const [form, setform] = useState([]);
//   // const { teamMembers: member, youtubeVideo: videoStudednt, } = useGlobal();
//   const [blogData, setBlogData] = useState([]);
//   const [mergedData, setMergedData] = useState([]);
//   const router = useRouter();
//   const [video, setVideo] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [loaded, setLoaded] = useState(false);
//   const [faqData, setFaqData] = useState([]);

//   // Component ke start me, useKeenSlider ke baad:

//   // Component ke top level me
//   const [autoPlay, setAutoPlay] = useState(true);
//   const [testimonials, setTestimonial] = useState([]);

//   // Type definitions for blog/article data
//   interface BlogArticle {
//     _id?: string;
//     id?: string;
//     image?: string;
//     coverImage?: string;
//     blogTitle?: string;
//     title?: string;
//     Slug?: string;
//     slug?: string;
//     createdAt?: string;
//     blogDescription?: string;
//     description?: string;
//     type?: string;
//   }

//   // Auto slide functionality
//   useEffect(() => {
//     if (!autoPlay || !instanceRef.current || blogData.length <= 1) return;

//     const interval = setInterval(() => {
//       const totalSlides = instanceRef.current.track.details.slides.length;
//       const nextSlide = (currentSlide + 1) % totalSlides;

//       instanceRef.current.moveToIdx(nextSlide);
//       setCurrentSlide(nextSlide);
//     }, 3000); // 3 seconds

//     return () => clearInterval(interval);
//   }, [currentSlide, autoPlay, blogData.length]);

//   // Mouse hover pe pause karne ke liye
//   const handleMouseEnter = () => setAutoPlay(false);
//   const handleMouseLeave = () => setAutoPlay(true);

//   const autoplayRef = useRef(null);

//   const startAutoplay = () => {
//     if (autoplayRef.current) {
//       clearInterval(autoplayRef.current);
//     }

//     autoplayRef.current = setInterval(() => {
//       instanceRef.current?.next();
//     }, 3000);
//   };

//   const stopAutoplay = () => {
//     if (autoplayRef.current) {
//       clearInterval(autoplayRef.current);
//       autoplayRef.current = null;
//     }
//   };

//   // Slider configuration update karein
//   const [sliderRef, instanceRef] = useKeenSlider({
//     initial: 0,
//     loop: true,

//     slideChanged(slider) {
//       setCurrentSlide(slider.track.details.rel);
//     },

//     created() {
//       setLoaded(true);

//       setTimeout(() => {
//         startAutoplay();
//       }, 300);
//     },

//     slides: {
//       perView: 1,
//       spacing: 16,
//     },

//     breakpoints: {
//       "(min-width: 640px)": {
//         slides: {
//           perView: 2,
//           spacing: 16,
//         },
//       },

//       "(min-width: 768px)": {
//         slides: {
//           perView: 3,
//           spacing: 20,
//         },
//       },

//       "(min-width: 1024px)": {
//         slides: {
//           perView: 2,
//           spacing: 20,
//         },
//       },
//     },

//     drag: true,
//     rubberband: true,
//     mode: "snap",
//   });

//   const fetchBlogs = useCallback(
//     async (page = 1, category = country?.toUpperCase(), search = "") => {
//       try {
//         const res = await PageServices.getBlogData({
//           page,
//           limit: 3,
//           category,
//           search,
//         });
//         setBlogData(res.data.blog || []);
//       } catch (err) {
//         console.error("Error fetching blogs:", err);
//       }
//     },
//     [country],
//   );

//   useEffect(() => {
//     const mergedData: BlogArticle[] = [
//       ...(blogData || []).map((item: BlogArticle) => ({
//         ...item,
//         type: "blog",
//       })),
//       ...(articleres || []).map((item: BlogArticle) => ({
//         ...item,
//         type: "article",
//       })),
//     ];

//     setMergedData(mergedData);
//   }, [blogData, articleres]);

//   const getAllTestimonial = async (value: string) => {
//     try {
//       const response = await PageServices.getTestimonialByCat(value);
//       if (response.status === "success") {
//         setTestimonial(response.data.testimonial || []);
//       }
//     } catch (error) {
//       console.error("Error fetching testimonials:", error);
//     }
//   };

//   useEffect(() => {
//     getAllTestimonial("spokenEnglish");
//   }, []);

//   function getContentByType(type) {
//     const item = content && content.sections.find((obj) => obj.type === type);
//     return item ? item.content : undefined;
//   }

//   const getAllfaqData = async (value: string) => {
//     try {
//       const response = await PageServices.getAllFaqForFront(value);
//       if (response.status === "success") {
//         setFaqData(response.data.faq || []);
//       }
//     } catch (error) {
//       console.error("Error fetching FAQ data:", error);
//     }
//   };

//   useEffect(() => {
//     getAllfaqData("spokenEnglish");
//   }, []);

//   useEffect(() => {
//     fetchBlogs();
//   }, [fetchBlogs]);

//   useEffect(() => {
//     if (videoStudednt?.media) {
//       setVideo(videoStudednt.media);
//     }
//     if (member?.member) {
//       setform(member.member || []);
//     }
//   }, [member, videoStudednt]);

//   const handleGetStarted = () => {
//     window.dispatchEvent(new CustomEvent("openFooterModal"));
//   };

//   const getCoverImageUrl = (coverImage: string) => {
//     if (!coverImage) return "/img/placeholder-blog.jpg";
//     if (coverImage.startsWith("http")) return coverImage;
//     return `https://uat.gatewayabroadeducations.com/uploads/${coverImage}`;
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <section className="bg-pink-100 pt-8 py-1 flex items-center relative overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
//           <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
//             <div className="space-y-4 w-full items-start lg:w-[62%]">
//               <div className="">
//                 <h1 className="text-3xl lg:text-5xl xl:text-[2.6rem] font-bold text-black !leading-[1.3]">
//                   {highlightText(content?.title) || content?.title}
//                 </h1>
//                 <div
//                   className="text-base lg:text-lg text-justify leading-relaxed mt-4"
//                   style={{
//                     color: "rgba(0, 0, 0, 0.9)",
//                     textShadow: "0 2px 8px rgba(255, 255, 255, 0.6)",
//                   }}
//                   dangerouslySetInnerHTML={{
//                     __html:
//                       content?.subTitle ||
//                       "Unlock your potential with world-class education in the United Kingdom. Experience academic excellence in historic universities.",
//                   }}
//                 />
//               </div>
//               <div className="flex flex-wrap gap-2 text-sm">
//                 {content?.sections[0]?.content?.points &&
//                   content?.sections[0]?.content?.points?.map((item, i) => (
//                     <div className="px-4 py-1.5 flex rounded-full border bg-white/50 backdrop-blur-sm shadow border-1 border-gray-300 hover:shadow-md transition">
//                       <p className="font-semibold"> {item?.content}</p>
//                     </div>
//                   ))}
//               </div>
//               <div className=" grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 pt-4 flex-wrap">
//                 {/* Stats Cards */}
//                 {getContentByType("hero")?.stats[0] && (
//                   <div className="border-2 border-red-300 rounded-[20px] px-3 py-2 min-w-[120px] sm:min-w-[140px] text-center flex-shrink-0">
//                     <h3 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold mb-1">
//                       <CounterUp
//                         end={getContentByType("hero")?.stats[0]?.value}
//                       />
//                       <span className="text-red-600"></span>
//                     </h3>
//                     <p className="text-black font-semibold text-xs mb-0">
//                       Students Placed
//                     </p>
//                   </div>
//                 )}

//                 {getContentByType("hero")?.stats[1] && (
//                   <div className="border-2 border-red-300 rounded-[20px] px-3 py-2 min-w-[120px] sm:min-w-[140px] text-center flex-shrink-0">
//                     <h3 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold mb-1">
//                       <CounterUp
//                         end={getContentByType("hero")?.stats[1]?.value}
//                       />
//                       <span className="text-red-600"></span>
//                     </h3>
//                     <p className="text-black font-semibold text-xs mb-0">
//                       Universities
//                     </p>
//                   </div>
//                 )}

//                 {getContentByType("hero")?.stats[2] && (
//                   <div className="border-2 border-red-300 rounded-[20px] px-3 py-2 min-w-[120px] sm:min-w-[140px] text-center flex-shrink-0">
//                     <h3 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold mb-1">
//                       <CounterUp
//                         end={getContentByType("hero")?.stats[2]?.value}
//                       />
//                       <span className="text-red-600"></span>
//                     </h3>
//                     <p className="text-black font-semibold text-xs mb-0">
//                       Cities
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4 mt-6">
//                 <button
//                   onClick={handleGetStarted}
//                   className="btn-primary inline-block text-center group"
//                 >
//                   <span className="relative z-10">Get Started Today</span>
//                 </button>
//               </div>
//             </div>

//             {/* Right Illustration */}
//             <div className="relative animate-fadeInRight w-full lg:w-[38%]">
//               <ContactForm />

//               {/* <div className="relative z-10 mx-auto">
//                 <Image
//                   src={content?.pageContent?.heroImage ? `${baseUrl}/uploads/${content?.pageContent?.heroImage}` : '/anime/map.png'}
//                   alt="Study Abroad Illustration"
//                   width={600}
//                   height={470}
//                   onError={(e) => (e.currentTarget.src = "/anime/bg01.png")}
//                   className=" mx-auto"
//                   priority
//                 />
//               </div> */}
//             </div>
//           </div>
//         </div>

//         {/* Scroll indicator */}
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//           <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
//             <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
//           </div>
//         </div>
//       </section>
//       <SingleSlider />

//       <WhyStudyUK content={content} country={country} />
//       <MultiStepForm />
//       {/* Why Choose Us Section */}
//       <TopUKUniversities
//         content={content?.sections[2]?.content}
//         country={country}
//       />
//       <UKStudyCosts content={content} country={country} />
//       <UKUniversityIntakes content={content} />
//       <GatewayAbroadProcess content={content} country={country} />
//       <UKScholarships content={content} />
//       <ProcessRoadmap />

//       <section className="py-12 bg-gray-300 relative">
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="/img/gmat-testimonials-bg.svg"
//             alt="Background"
//             fill
//             className="object-cover"
//             loading="lazy"
//             quality={75}
//           />
//         </div>
//         <div className="absolute inset-0 bg-gray-400/10 z-1"></div>
//         <div className="max-w-7xl mx-auto px-4 relative z-10">
//           <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-8">
//             What Our Achievers Say
//           </h2>

//           {testimonials.length === 0 ? (
//             <div className="text-center text-gray-500 py-8">
//               Loading testimonials...
//             </div>
//           ) : (
//             <div className="relative group">
//               <div ref={sliderRef} className="keen-slider">
//                 {testimonials.map((test, idx) => (
//                   <div key={idx} className="keen-slider__slide p-2 pb-6">
//                     <div className="relative bg-white box-border caret-transparent z-0 ml-[30px] rounded-3xl md:ml-[50px] shadow-lg before:accent-auto before:border-b-gray-200 before:box-border before:caret-transparent before:text-neutral-800 before:block before:text-base before:not-italic before:normal-nums before:font-normal before:h-0 before:left-[-35px] before:tracking-[normal] before:leading-6 before:list-outside before:list-disc before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-0 before:z-[-1] before:border-t-white before:border-t-[25px] before:border-x-transparent before:border-x-[50px] before:border-separate before:border-solid before:top-0 before:font-noto_sans before:md:left-[-50px] before:md:border-t-[55px] before:md:border-x-[80px]">
//                       <div className="box-border caret-transparent pt-5 px-5 md:pt-[35px] md:px-[30px]">
//                         <div className="items-center box-border caret-transparent flex justify-between">
//                           <h6 className="text-gray-700 text-lg font-bold box-border caret-transparent leading-[21.6px] mb-2">
//                             {test.name}
//                           </h6>
//                           <ul className="box-border caret-transparent flex leading-[normal] list-none mb-4 pl-0">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                               <li
//                                 key={star}
//                                 className="text-amber-400 text-lg box-border caret-transparent"
//                               >
//                                 <Star className="w-[18px] h-[18px] fill-amber-400" />
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                         <p className="text-zinc-500 text-sm font-medium box-border caret-transparent max-w-[90%] min-h-0 text-left mb-4 py-[15px] md:max-w-none md:min-h-[198px]">
//                           {test.content}
//                         </p>
//                       </div>
//                       <div className="bg-red-600 box-border caret-transparent px-5 py-3.5 rounded-b-3xl md:px-[30px]"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Navigation buttons — only show if more than 1 testimonial */}
//               {/* {testimonials.length > 1 && (
//                                 <>
//                                     <button
//                                         onClick={handlePrev}
//                                         className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200 z-10"
//                                     >
//                                         <ChevronLeft className="h-6 w-6 text-gray-600" />
//                                     </button>
//                                     <button
//                                         onClick={handleNext}
//                                         className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200 z-10"
//                                     >
//                                         <ChevronRight className="h-6 w-6 text-gray-600" />
//                                     </button>
//                                 </>
//                             )} */}
//             </div>
//           )}
//         </div>
//       </section>
//       {/* <CardStackGridSection video={video} /> */}
//       <section className="py-12 md:py-12 bg-white">
//         <div className=" mx-auto px-4 max-w-7xl">
//           <div className="bg-[#fbe7ea] rounded-2xl sm:rounded-[24px] shadow-lg mx-auto w-full">
//             {/* Content container with specific padding */}
//             <div className="px-4 sm:px-6 lg:px-8">
//               <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
//                 <div className="w-full lg:w-[75%] pt-6">
//                   <div className="text-center lg:text-left pl-[17px]">
//                     <h2 className="text-xl sm:text-2xl lg:text-4xl xl:text-[36px] font-bold mb-4 text-[#D71635] lg:leading-[37px] ">
//                       Avail A Complementary Counselling Session
//                     </h2>
//                     <p className="text-base  lg:text-[18px] mb-4 sm:mb-6 text-[#666276]">
//                       Join thousand of instructors and earn money hassle free!
//                     </p>
//                     <a
//                       href="/contact"
//                       className="inline-block bg-[#d71635] text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-3xl text-sm sm:text-base font-bold shadow-[0_0_8px_0_rgba(0,0,0,0.2)] hover:bg-[#b5122b] transition-all duration-300"
//                     >
//                       Contact us
//                     </a>
//                   </div>
//                 </div>
//                 <div className="w-full lg:w-[38%]">
//                   <div className="flex justify-center">
//                     <img
//                       src="img/counselling-session.svg"
//                       alt="Counselling Session"
//                       className="w-full max-w-xs sm:max-w-sm lg:max-w-[25rem]"
//                       loading="lazy"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="py-8 sm:py-10 md:py-12 lg:py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header Section */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 lg:mb-10 xl:mb-12 gap-3 sm:gap-4">
//             <h2 className="heading text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-0 leading-tight">
//               Important Facts & Information
//             </h2>
//             <button className="bg-[#da1634] text-white hover:scale-105 duration-200 transform transition px-4 sm:px-5 md:px-[20px] py-2 sm:py-2.5 md:py-[10px] rounded-[30px] font-bold text-sm sm:text-base whitespace-nowrap flex-shrink-0">
//               <Link
//                 href={`/blog?category=${country?.toUpperCase()}`}
//                 className="site-btn ng-[] whitespace-nowrap"
//               >
//                 Go to blog
//               </Link>
//             </button>
//           </div>

//           {/* Blog Cards Grid - Responsive */}
//           <div className="w-full min-w-0 max-w-full overflow-hidden">
//             {mergedData.length > 0 ? (
//               <>
               
//                {/* Desktop Blog Slider - Visible only on large screens */}
// <div
//   ref={sliderRef}
//   className="keen-slider hidden w-full min-w-0 max-w-full overflow-hidden lg:flex"
//   onMouseEnter={stopAutoplay}
//   onMouseLeave={startAutoplay}
// >
//   {mergedData.map((blog: BlogArticle, index) => {
//     const imageUrl = (blog as BlogArticle)?.image
//       ? `https://api.gatewayabroadeducations.com/api/uploads/${(blog as BlogArticle).image}`
//       : (blog as BlogArticle)?.coverImage
//         ? getCoverImageUrl((blog as BlogArticle).coverImage)
//         : "https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg";

//     const title = (blog as BlogArticle)?.blogTitle || (blog as BlogArticle)?.title || "Blog";

//     const slug = (blog as BlogArticle)?.Slug
//       ? `/blog-description/${(blog as BlogArticle).Slug}`
//       : (blog as BlogArticle)?.slug
//         ? `/article/${(blog as BlogArticle).slug}`
//         : "#";

//     return (
//       <div
//         key={(blog as BlogArticle)?._id || (blog as BlogArticle)?.id || index}
//         className="keen-slider__slide min-w-0 cursor-pointer p-3"
//         onClick={() => {
//           if (slug !== "#") {
//             router.push(slug);
//           }
//         }}
//       >
//         <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

//           {/* Image */}
//           <div className="relative h-48 w-full shrink-0 overflow-hidden bg-gray-100 xl:h-52">
//             <Image
//               src={imageUrl}
//               alt={title}
//               fill
//               className="w-full object-cover object-top transition-transform duration-500 hover:scale-105"
//               loading="lazy"
//               sizes="(max-width: 1024px) 100vw, 33vw"
//             />
//           </div>

//           {/* Content */}
//           <div className="flex flex-1 flex-col p-4">

//             {/* Date */}
//             <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
//               <span>{formatDate((blog as BlogArticle)?.createdAt)}</span>
//             </div>

//             {/* Title */}
//             <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors duration-300 hover:text-red-600">
//               {title}
//             </h3>

//             {/* Description */}
//             <div
//               className="line-clamp-2 text-sm leading-6 text-gray-600"
//               dangerouslySetInnerHTML={sanitizedData(
//                 (blog as BlogArticle)?.blogDescription || (blog as BlogArticle)?.description || ""
//               )}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   })}
// </div>

//                 {/* Mobile/Tablet Grid View - Shows on smaller screens */}
//                 <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   {mergedData.slice(0, 4).map((blog, index) => {
//                     const imageUrl = blog?.image
//                       ? `https://api.gatewayabroadeducations.com/api/uploads/${blog.image}`
//                       : blog?.coverImage
//                         ? getCoverImageUrl(blog.coverImage)
//                         : "https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg";

//                     return (
//                       <div
//                         key={index}
//                         className="cursor-pointer"
//                         onClick={() =>
//                           router.push(
//                             blog?.Slug
//                               ? `/blog-description/${blog.Slug}`
//                               : `/article/${blog.slug}`,
//                           )
//                         }
//                       >
//                         <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
//                           <div className="relative h-48 sm:h-52 w-full shrink-0 bg-gray-100">
//                             <Image
//                               src={imageUrl}
//                               alt={blog?.blogTitle || blog?.title || "Blog"}
//                               fill
//                               className="object-cover w-full object-top"
//                               loading="lazy"
//                               sizes="(max-width: 640px) 100vw, 50vw"
//                             />
//                           </div>

//                           <div className="flex-1 p-3 sm:p-4">
//                             <div className="mb-1.5 sm:mb-2 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
//                               <span>{formatDate(blog?.createdAt)}</span>
//                             </div>

//                             <h3 className="mb-1.5 sm:mb-2 line-clamp-2 text-sm sm:text-base font-bold text-gray-900 transition-colors hover:text-red-600">
//                               {blog?.blogTitle || blog?.title}
//                             </h3>

//                             {/* Description */}
//                             <div
//                               className="line-clamp-2 text-xs sm:text-sm text-gray-600"
//                               dangerouslySetInnerHTML={sanitizedData(
//                                 blog?.blogDescription || blog?.description,
//                               )}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}

//                   {/* Show more button on mobile if there are more than 4 items */}
//                   {mergedData.length > 4 && (
//                     <div className="col-span-1 sm:col-span-2 flex justify-center mt-2">
//                       <button className="bg-[#da1634] text-white hover:scale-105 duration-200 transform transition px-6 py-2.5 rounded-[30px] font-bold text-sm">
//                         <Link
//                           href={`/blog?category=${country?.toUpperCase()}`}
//                           className="whitespace-nowrap"
//                         >
//                           View All Blogs
//                         </Link>
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="py-8 sm:py-12 text-center">
//                 <p className="text-gray-500 text-sm sm:text-base">
//                   No blog posts available.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* <section className="lg:py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-12 gap-4">
//             <h2 className="heading text-4xl font-bold mb-0">
//               Important Facts & Information
//             </h2>
//             <button className="bg-[#da1634] text-white hover:scale-105 duration-200 transform transition px-[20px] py-[10px] rounded-[30px] font-bold">
//               <Link
//                 href={`/blog?category=${country?.toUpperCase()}`}
//                 className="site-btn ng-[] whitespace-nowrap"
//               >
//                 Go to blog
//               </Link>
//             </button>
//           </div>

//           <div className="w-full min-w-0 max-w-full overflow-hidden">
//             {mergedData.length > 0 ? (
//               <>
//                 <div
//                   ref={sliderRef}
//                   className="keen-slider !flex w-full min-w-0 max-w-full overflow-hidden"
//                   onMouseEnter={stopAutoplay}
//                   onMouseLeave={startAutoplay}
//                 >
//                   {mergedData.map((blog, index) => {
//                     const imageUrl = blog?.image
//                       ? `https://api.gatewayabroadeducations.com/api/uploads/${blog.image}`
//                       : blog?.coverImage
//                         ? getCoverImageUrl(blog.coverImage)
//                         : "https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg";

//                     return (
//                       <div
//                         key={index}
//                         className="keen-slider__slide !min-w-0 !max-w-none cursor-pointer p-2 lg:p-3"
//                         onClick={() =>
//                           router.push(
//                             blog?.Slug
//                               ? `/blog-description/${blog.Slug}`
//                               : `/article/${blog.slug}`,
//                           )
//                         }
//                       >
//                         <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                          
//                           <div className="relative h-40 w-full shrink-0">
//                             <Image
//                               src={imageUrl}
//                               alt={blog?.blogTitle || blog?.title || "Blog"}
//                               fill
//                               className="object-cover w-full object-top"
//                               loading="lazy"
//                             />
//                           </div>

                          
//                           <div className="flex-1 p-4">
                            
//                             <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
//                               <span>{formatDate(blog?.createdAt)}</span>
//                             </div>

                            
//                             <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 transition-colors hover:text-red-600">
//                               {blog?.blogTitle || blog?.title}
//                             </h3>

                            
//                             <div
//                               className="line-clamp-2 text-sm text-gray-600"
//                               dangerouslySetInnerHTML={sanitizedData(
//                                 blog?.blogDescription || blog?.description,
//                               )}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </>
//             ) : (
//               <div className="py-12 text-center">
//                 <p className="text-gray-500">No blog posts available.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </section> */}
//       <section className="py-12 bg-white">
//         <FAQSection content={"Frequently asked questions"} faq={faq} />

//         {/* <div className="max-w-7xl mx-auto px-4">
//           <div className="text-center mb-8">
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//               Frequently asked questions
//             </h2>
//             <p className="text-gray-600">
//               Can't find the answer you are looking for?
//             </p>
//           </div>
//           <div className="max-w-7xl mx-auto">
//             <Accordion type="single" collapsible className="w-full space-y-3">
//               {faq?.faq?.map((f: any, index: number) => (
//                 <AccordionItem
//                   value={`item-${index}`}
//                   key={index}
//                   className="border border-gray-200 rounded-lg px-4"
//                 >
//                   <AccordionTrigger className="text-left py-3 hover:no-underline font-medium">
//                     {f.title}
//                   </AccordionTrigger>
//                   <AccordionContent className="text-gray-700 pb-3 text-sm">
                    
//                     <p dangerouslySetInnerHTML={{ __html: f.content }} />
//                   </AccordionContent>
//                 </AccordionItem>
//               ))}
//             </Accordion>
//           </div>
//         </div> */}
//       </section>
//     </>
//   );
// };

// export default StudyInUk;
