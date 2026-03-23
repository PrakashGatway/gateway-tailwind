"use client"

import MultiStepForm from "@/components/pages/multiStep";
import CardStackGridSection from "@/components/pages/cardStack";
import Component, { SingleSlider } from "@/components/pages/partnerSlider";
import Image from "next/image";
import Link from "next/link";
import CounterUp from "@/components/CounterUp";
// import { useGlobal } from "@/hooks/AppStateContext";
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
import WhyStudyUK, { GatewayAbroadProcess, HorizontalStackCards, ScrollStackIntakes, TopUKUniversities, UKScholarships, UKStudyCosts, UKUniversityIntakes } from "../ukpageComponent/whyStudyin";
import BlogNew, { formatDate, sanitizedData } from "../blognew";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Star } from "lucide-react";

export const highlightText = (text) => {
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
const StudyInUk = ({ content, country, teamMembers: member, youtubeVideo: videoStudednt }: any) => {
  const [form, setform] = useState([]);
  // const { teamMembers: member, youtubeVideo: videoStudednt, } = useGlobal();
  const [blogData, setBlogData] = useState([]);
  const router = useRouter();
  const [video, setVideo] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [faqData, setFaqData] = useState([]);

  // Component ke start me, useKeenSlider ke baad:

  // Component ke top level me
  const [autoPlay, setAutoPlay] = useState(true);
  const [testimonials, setTestimonial] = useState([]);

  // Auto slide functionality
  useEffect(() => {
    if (!autoPlay || !instanceRef.current || blogData.length <= 1) return;

    const interval = setInterval(() => {
      const totalSlides = instanceRef.current.track.details.slides.length;
      const nextSlide = (currentSlide + 1) % totalSlides;

      instanceRef.current.moveToIdx(nextSlide);
      setCurrentSlide(nextSlide);
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [currentSlide, autoPlay, blogData.length]);


  // Mouse hover pe pause karne ke liye
  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);

  // Slider configuration update karein
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 2,
          spacing: 16,
          origin: 'center'
        },
      },
      "(min-width: 768px)": {
        slides: {
          perView: 3,
          spacing: 20,
          origin: 'center'
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3,
          spacing: 12,
          origin: 'center'
        },
      },
    },
    slides: {
      perView: 1,
      spacing: 12,
      origin: 'center'
    },
    drag: true,
    rubberband: true,
    mode: "snap",
  });

  const fetchBlogs = useCallback(async (page = 1, category = country.toUpperCase(), search = '') => {
    try {
      const res = await PageServices.getBlogData({ page, limit: 3, category, search });
      setBlogData(res.data.blog || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  }, [country]);

  const getAllTestimonial = async (value: string) => {
    try {
      const response = await PageServices.getTestimonialByCat(value);
      if (response.status === 'success') {
        setTestimonial(response.data.testimonial || []);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  useEffect(() => {
    getAllTestimonial("spokenEnglish");
  }, []);

  function getContentByType(type) {
    const item = content && content.sections.find(obj => obj.type === type);
    return item ? item.content : undefined;
  }

  const getAllfaqData = async (value: string) => {
    try {
      const response = await PageServices.getAllFaqForFront(value);
      if (response.status === 'success') {
        setFaqData(response.data.faq || []);
      }
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
    }
  };

  useEffect(() => {
    getAllfaqData("spokenEnglish");
  }, []);


  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    if (videoStudednt?.media) {
      setVideo(videoStudednt.media);
    }
    if (member?.member) {
      setform(member.member || []);
    }
  }, [member, videoStudednt]);

  const handleGetStarted = () => {

    window.dispatchEvent(new CustomEvent('openFooterModal'));
  };



  


  return (
    <>
      {/* Hero Section */}
      <section className="bg-pink-100 pt-8 py-1 flex items-center relative overflow-hidden">


        <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

            <div className="space-y-4 w-full items-start lg:w-[62%]">
              <div className="">
                <h1 className="text-3xl lg:text-5xl xl:text-[2.6rem] font-bold text-black !leading-[1.3]">
                  {highlightText(content?.title) || content?.title}
                </h1>
                <p
                  className="text-base lg:text-lg leading-relaxed mt-4"
                  style={{
                    color: "rgba(0, 0, 0, 0.9)",
                    textShadow: "0 2px 8px rgba(255, 255, 255, 0.6)"
                  }}
                >
                  {content?.subTitle || "Unlock your potential with world-class education in the United Kingdom. Experience academic excellence in historic universities."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">


                {content?.sections[0]?.content?.points && content?.sections[0]?.content?.points?.map((item, i) => (
                  <div className="px-4 py-1.5 flex rounded-full border bg-white/50 backdrop-blur-sm shadow border-1 border-gray-300 hover:shadow-md transition">
                    <p className="font-semibold"> {item?.content}</p>
                  </div>

                ))}


              </div>
              <div className=" grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 pt-4 flex-wrap">
                {/* Stats Cards */}
                <div className="border-2 border-red-300 rounded-[20px] px-3 py-2 min-w-[120px] sm:min-w-[140px] text-center flex-shrink-0">
                  <h3 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold mb-1">
                    <CounterUp end={getContentByType('hero')?.stats[0].value} /><span className="text-red-600"></span>

                 
                  </h3>
                  <p className="text-black font-semibold text-xs mb-0">Students Placed</p>
                </div>

                <div className="border-2 border-red-300 rounded-[20px] px-3 py-2 min-w-[120px] sm:min-w-[140px] text-center flex-shrink-0">
                  <h3 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold mb-1">
                    <CounterUp end={getContentByType('hero')?.stats[1].value} /><span className="text-red-600"></span>
                  </h3>
                  <p className="text-black font-semibold text-xs mb-0">Universities</p>
                </div>

                <div className="border-2 border-red-300 rounded-[20px] px-3 py-2 min-w-[120px] sm:min-w-[140px] text-center flex-shrink-0">
                  <h3 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold mb-1">
                    <CounterUp end={getContentByType('hero')?.stats[2].value} /><span className="text-red-600"></span>
                  </h3>
                  <p className="text-black font-semibold text-xs mb-0">Cities</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link href="#" data-bs-toggle="modal" data-bs-target="#getintouchModel" className="btn-primary inline-block text-center group">
                  <span onClick={handleGetStarted} className="relative z-10">Get Started Today</span>
                </Link>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative animate-fadeInRight w-full lg:w-[38%]">
              <ContactForm />

              {/* <div className="relative z-10 mx-auto">
                <Image
                  src={content?.pageContent?.heroImage ? `${baseUrl}/uploads/${content?.pageContent?.heroImage}` : '/anime/map.png'}
                  alt="Study Abroad Illustration"
                  width={600}
                  height={470}
                  onError={(e) => (e.currentTarget.src = "/anime/bg01.png")}
                  className=" mx-auto"
                  priority
                />
              </div> */}
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

      <WhyStudyUK content={content} />
      <MultiStepForm />
      {/* Why Choose Us Section */}
      <TopUKUniversities content={content} />
      <UKStudyCosts content={content} />
      <UKUniversityIntakes content={content} />
      <GatewayAbroadProcess content={content} />
      <UKScholarships content={content} />
      <ProcessRoadmap />

      <section className="py-12 bg-gray-300 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/gmat-testimonials-bg.svg"
            alt="Background"
            fill
            className="object-cover"
            quality={75}
          />
        </div>
        <div className="absolute inset-0 bg-gray-400/10 z-1"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            What Our Achievers Say
          </h2>

          {testimonials.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Loading testimonials...</div>
          ) : (
            <div className="relative group">
              <div ref={sliderRef} className="keen-slider">
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
                              <li key={star} className="text-amber-400 text-lg box-border caret-transparent">
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

              {/* Navigation buttons — only show if more than 1 testimonial */}
              {/* {testimonials.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200 z-10"
                                    >
                                        <ChevronLeft className="h-6 w-6 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200 z-10"
                                    >
                                        <ChevronRight className="h-6 w-6 text-gray-600" />
                                    </button>
                                </>
                            )} */}
            </div>
          )}
        </div>
      </section>
      {/* <CardStackGridSection video={video} /> */}
      <section className="py-12 md:py-16 bg-white">
        <div className=" mx-auto px-4 max-w-7xl">
          <div className="bg-[#fbe7ea] rounded-2xl sm:rounded-[24px] shadow-lg mx-auto w-full">
            {/* Content container with specific padding */}
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                <div className="w-full lg:w-[75%] pt-6">
                  <div className="text-center lg:text-left pl-[17px]">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[36px] font-bold mb-4 text-[#D71635] lg:leading-[37px] ">
                      Avail A Complementary Counselling Session
                    </h2>
                    <p className="text-base  lg:text-[18px] mb-4 sm:mb-6 text-[#666276]">
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
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-12 gap-4">
            <h2 className="heading text-2xl font-bold mb-0">Important Facts & Information</h2>
            <button className="bg-[#da1634] text-white hover:scale-105 duration-200 transform transition px-[20px] py-[10px] rounded-[30px] font-bold">
              <Link href="/blog" className="site-btn ng-[] whitespace-nowrap">Go to blog</Link>
            </button>
          </div>

          <div className="blog-section-inner">
            {/* Keen Slider Container with Auto Play */}
            {blogData.length > 0 ? (
              <>
                <div
                  ref={sliderRef}
                  className="keen-slider relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {blogData.map((blog, index) => (
                    <div
                      className="keen-slider__slide cursor-pointer p-2 lg:p-3"
                      key={index}
                      onClick={() => router.push(`/blog-description/${blog.Slug}`)}
                    >
                      <div
                        key={index}
                        className={`min-w-[360px] max-w-[360px] border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white`}
                      >
                        {/* Image */}
                        <div className="relative h-52">
                          <Image
                            src={
                              blog.image
                                ? `https://api.gatewayabroadeducations.com/api/uploads/${blog.image}`
                                : "https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg"
                            }
                            alt={blog.blogTitle}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {/* Date */}
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>{formatDate(blog.createdAt)}</span>
                          </div>

                          {/* Title */}
                          <Link href={`/blog-description/${blog.Slug}`}>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors">
                              {blog.blogTitle}
                            </h3>
                          </Link>

                          {/* Description */}
                          <div
                            className="text-gray-600 text-sm line-clamp-2"
                            dangerouslySetInnerHTML={sanitizedData(blog.blogDescription)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No blog posts available.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Frequently asked questions
            </h2>
            <p className="text-gray-600">Can't find the answer you are looking for?</p>
          </div>
          <div className="max-w-7xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqData.map((f: any, index: number) => (
                <AccordionItem
                  value={`item-${index}`}
                  key={index}
                  className="border border-gray-200 rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left py-3 hover:no-underline font-medium">
                    {f.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-3 text-sm">
                    {f.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
};

export default StudyInUk;