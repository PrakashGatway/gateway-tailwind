"use client"

import MultiStepForm from "@/components/pages/multiStep";
import CardStackGridSection from "@/components/pages/cardStack";
import Component from "@/components/pages/partnerSlider";
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
import { DynamicIcon } from "../sections/processRoad";
import { baseUrl } from "@/services/axiosInstance";

const StudyInUk = ({ content, country, teamMembers: member, youtubeVideo: videoStudednt }: any) => {
  const [form, setform] = useState([]);
  // const { teamMembers: member, youtubeVideo: videoStudednt, } = useGlobal();
  const [blogData, setBlogData] = useState([]);
  const router = useRouter();
  const [video, setVideo] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Component ke start me, useKeenSlider ke baad:

  // Component ke top level me
  const [autoPlay, setAutoPlay] = useState(true);

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
          spacing: 24,
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

  function getContentByType(type) {
    const item = content && content.sections.find(obj => obj.type === type);
    return item ? item.content : undefined;
  }

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
      <section className="hero-gradient pt-12 py-1 md:py-12 flex items-center relative overflow-hidden">


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-4 w-full ">
              <div className="">
                <h1 className="text-3xl lg:text-5xl xl:text-[2.6rem] font-bold text-black leading-tight">
                  {content?.title}
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

              <div className="flex gap-2 md:gap-4 pt-4 overflow-x-auto md:overflow-visible">
                {/* Stats Cards */}
                <div className="bg-pink-300 rounded-[28px] px-4 py-3 min-w-[120px] sm:min-w-[140px] text-center flex-shrink-0">
                  <h3 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold mb-1">
                    {<CounterUp end={getContentByType('hero')?.students} />}<span className="text-red-600">+</span>
                  </h3>
                  <p className="text-black font-semibold text-xs sm:text-sm mb-0">Students Placed</p>
                </div>

                <div className="bg-pink-300 rounded-[28px] px-4 py-3 min-w-[120px] sm:min-w-[140px] text-center flex-shrink-0">
                  <h3 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold mb-1">
                    <CounterUp end={getContentByType('hero')?.university} /><span className="text-red-600">+</span>
                  </h3>
                  <p className="text-black font-semibold text-xs sm:text-sm mb-0">Universities</p>
                </div>

                <div className="bg-pink-300 rounded-[28px] px-4 py-3 min-w-[120px] sm:min-w-[140px] text-center flex-shrink-0">
                  <h3 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold mb-1">
                    <CounterUp end={getContentByType('hero')?.cities} /><span className="text-red-600">+</span>
                  </h3>
                  <p className="text-black font-semibold text-xs sm:text-sm mb-0">Cities</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link href="#" data-bs-toggle="modal" data-bs-target="#getintouchModel" className="btn-primary inline-block text-center group">
                  <span onClick={handleGetStarted} className="relative z-10">Get Started Today</span>
                </Link>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative animate-fadeInRight mx-auto w-full">
              <div className="relative z-10 mx-auto">
                <Image
                  src={content?.pageContent?.heroImage ? `${baseUrl}/uploads/${content?.pageContent?.heroImage}` : '/anime/map.png'}
                  alt="Study Abroad Illustration"
                  width={600}
                  height={470}
                  onError={(e) => (e.currentTarget.src = "/anime/bg01.png")}
                  className="drop-shadow-2xl mx-auto"
                  priority
                />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 lg:w-96 lg:h-96 bg-white bg-opacity-30 rounded-full animate-pulse-slow -z-10"></div>
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

      <MultiStepForm />

      {/* Why Choose Us Section */}
      <section className="py-14 bg-[#FAFBFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="heading text-2xl font-bold text-center d-block mb-4">
              {getContentByType('WhyChooseUs')?.title}
            </h2>
            <p className="sub-heading !text-base max-w-3xl mx-auto">
              {getContentByType('WhyChooseUs')?.subTittle || "We provide comprehensive support to make your UK education dreams a reality with personalized guidance and expert assistance."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {getContentByType('WhyChooseUs')?.Cards?.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 lg:p-6 border border-gray-300 shadow rounded-2xl bg-white backdrop-blur-[2px] hover:border-black transition-all duration-300 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-200/20 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-left flex-1">
                  <div className="sub-heading mb-2 !text-black">
                    {reason.name}
                  </div>
                  <div className="descp !text-left !text-gray-800 !text-sm drop-shadow-sm">
                    {reason.content}
                  </div>
                </div>

                <div className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 opacity-90 pointer-events-none transition-transform duration-300 group-hover:scale-105">
                  <DynamicIcon name={reason.icon} color="red" className="w-12 h-12" />
                </div>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-200/5 to-pink-200/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="heading text-2xl font-bold  text-center d-block pb-8 lg:pb-10">
              {getContentByType('form-section')?.title || "The Roadmap With Gateway Abroad"}
            </h2>
          </div>

          {/* Desktop Image */}
          <Image
            src={content?.pageContent?.roadmapImage ? `${baseUrl}/uploads/${content?.pageContent?.roadmapImage}` : "/anime/road.svg"}
            alt={getContentByType('form-section')?.title || "image"}
            className="hidden md:block w-full h-auto"
            width={600}
            height={470}
            onError={(e) => (e.currentTarget.src = "/anime/road.svg")}
          />

          {/* Mobile Image */}
          <Image
            src={content?.pageContent?.mobileRoadMap ? `${baseUrl}/uploads/${content?.pageContent?.mobileRoadMap}` : "/anime/mobileRoad.png"}
            alt="Study in UK Roadmap - Mobile"
            className="block md:hidden w-full h-auto"
            width={600}
            height={470}
            onError={(e) => (e.currentTarget.src = "/anime/mobileRoad.png")}
          />
        </div>
      </section>

      <Component />

      {/* Team Members Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-8 md:mb-12 pb-3 md:pb-4 inline-block">
            People behind Gateway Abroad
          </h2>
          <div className="pt-6 md:pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 justify-items-center">
              {form.map((m) => (
                <div key={m._id} className="bg-[#fcedf0] rounded-xl shadow-lg overflow-hidden border border-gray-200 w-full max-w-[550px]">
                  {/* Header */}
                  <div className="bg-red-600 px-4 sm:px-6 py-3 sm:py-4 text-center">
                    <h4 className="text-lg sm:text-xl font-bold text-white">{m.name}</h4>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <div className="h-48 sm:h-[260px] overflow-y-auto pe-3 sm:pe-[15px]">
                      <p className="text-[#666276] text-justify text-sm sm:text-base font-medium leading-5 sm:leading-6">
                        {m.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CardStackGridSection video={video} />

      {/* Blog Section with Auto Slider */}
      <section className="py-14 lg:py-20">
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
                      <div className="blog-card h-full  hover:text-red-600 transition-colors hover:border-red-600 duration-300">
                        <div className="card h-full  rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white transform hover:translate-x hover:border-red-600">
                          <div className="card-img-top aspect-[4/3] overflow-hidden ">
                            <Image
                              src={`${constant.REACT_APP_URL}/api/uploads/${blog.image}`}
                              alt="blog-img"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              width={400}
                              height={300}
                              onError={(e) => (e.currentTarget.src = "https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg?s=612x612&w=0&k=20&c=xR2vOmtg-N6Lo6_I269SoM5PXEVRxlgvKxXUBMeMC_A=")}
                            />
                          </div>
                          <div className="card-body p-4 lg:p-6">
                            <h5 className="card-title text-lg lg:text-xl font-semibold mb-3 line-clamp-2 min-h-[56px]">
                              <Link href={`/blog-description/${blog.Slug}`} className="hover:text-red-600 transition-colors duration-300 text-gray-800">
                                {blog.blogTitle}
                              </Link>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Dots with Auto Play Indicator */}
                {loaded && instanceRef.current && blogData.length > 1 && (
                  <div className="flex flex-col items-center mt-8 lg:mt-12">


                    {/* Navigation Dots */}
                    <div className="flex justify-center space-x-2">
                      {Array.from({ length: instanceRef.current.track.details.slides.length }).map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === idx
                              ? "bg-red-600 scale-125"
                              : "bg-gray-300 hover:bg-gray-400"
                            }`}
                          onClick={() => {
                            instanceRef.current?.moveToIdx(idx);
                            setCurrentSlide(idx);
                          }}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No blog posts available.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default StudyInUk;