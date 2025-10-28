"use client"

import MultiStepForm from "@/components/pages/multiStep";
import CardStackGridSection from "@/components/pages/cardStack";
import Component from "@/components/pages/partnerSlider";
import Image from "next/image";
import Link from "next/link";
import CounterUp from "@/components/CounterUp";
import { useGlobal } from "@/hooks/AppStateContext";
import { useCallback, useEffect, useState } from "react";
import Slider from 'react-slick';
import { blogSlider, testimonialSlider } from '@/custom/custom'; // Ensure path is correct
import { useRouter } from "next/navigation";
import PageServices from "@/services/PageServices";
import { constant } from "@/constant/index.constant";
import { DynamicIcon } from "../sections/processRoad";
import { baseUrl } from "@/services/axiosInstance";


const StudyInUk = ({ content ,country}:any) => {

  const [form, setform] = useState([]);
  const { teamMembers: member, youtubeVideo: videoStudednt, } = useGlobal();
  const [blogData, setBlogData] = useState([]);
  const router = useRouter(); // For App Router
  const [video, setVideo] = useState([]);


  const fetchBlogs = useCallback(async (page = 1, category = country.toUpperCase(), search = '') => {
    try {
      const res = await PageServices.getBlogData({ page, limit: 5, category, search });
      setBlogData(res.data.blog || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  }, []);

  function getContentByType(type) {
    const item = content && content.sections.find(obj => obj.type === type);
    return item ? item.content : undefined; // Return undefined if not found
  }

  useEffect(() => {
    fetchBlogs();
  }, [Slider]);


  useEffect(() => {
    if (videoStudednt?.media) {
      setVideo(videoStudednt.media);
    }
    if (member?.member) {
      setform(member.member || []);
    }
  }, [member, videoStudednt]);

  return (
    <>
      <section className="hero-gradient pt-12 py-1 md:py-12 flex items-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-28 left-10 w-4 h-4 bg-red-500 rounded-full animate-bounce-slow"></div>
          <div className="absolute top-32 left-16 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-1"></div>
          <div className="absolute top-44 left-12 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-2"></div>
          <div className="absolute top-56 left-18 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-3"></div>
          <div className="absolute top-68 left-14 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-4"></div>

          <div className="absolute top-20 right-20 w-20 h-20 border-2 border-red-300 rounded-full animate-rotate-slow"></div>
          <div className="absolute bottom-40 left-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-red-300 animate-float"></div>

          {/* Additional floating elements */}
          <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-pink-400 rounded-full animate-float animate-stagger-2"></div>
          {/* <div className="absolute bottom-1/3 right-1/3 w-8 h-8 bg-yellow-400 rounded-full animate-bounce-slow animate-stagger-3"></div> */}
        </div>

        <div className="container-sm mx-auto px-12 py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 items-center">
            {/* Left Content with staggered animations */}
            <div className="space-y-3">
              <div className="">
                <h1 className="text-3xl lg:text-[2.6rem] font-bold text-black leading-tight">
                  <span className="">{" "}</span>
                  <span className="text-red-600 py-2">

                  </span>
                  <br />
                  <span>{content?.title}</span>
                  <span className="text-red-600 py-2">
                  </span>
                </h1>
                <p
                  className="text-base lg:text-base leading-relaxed"
                  style={{
                    color: "rgba(0, 0, 0, 0.9)",
                    textShadow: "0 2px 8px rgba(255, 255, 255, 0.6)"
                  }}
                >{content?.subTitle || "Unlock your potential with world-class education in the United Kingdom. Experience academic excellence in historic universities."}
                </p>
              </div>

              <div className="flex gap-0 md:gap-2 lg:space-x-2 pt-4 overflow-x-auto md:overflow-visible">
                {/* Card 1 */}
                <div className="bg-pink-300 rounded-[28px] px-3 py-2 min-w-[90px] sm:min-w-[130px] md:min-w-[150px] text-center flex-shrink-0">
                  <h3 className="text-lg sm:text-2xl md:text-3xl text-black font-semibold mb-0">
                    {<CounterUp end={getContentByType('hero')?.students} />}<span className="text-red-600">+</span>
                  </h3>
                  <p className="text-black font-semibold text-xs sm:text-sm md:text-sm mb-0">Students Placed</p>
                </div>

                {/* Card 2 */}
                <div className="bg-pink-300 rounded-[28px] px-3 py-2 min-w-[90px] sm:min-w-[130px] md:min-w-[150px] text-center flex-shrink-0">
                  <h3 className="text-lg sm:text-2xl md:text-3xl text-black font-semibold mb-0">
                    <CounterUp end={getContentByType('hero')?.university} /><span className="text-red-600">+</span>
                  </h3>
                  <p className="text-black font-semibold text-xs sm:text-sm md:text-sm mb-0">Universities</p>
                </div>

                {/* Card 3 */}
                <div className="bg-pink-300 rounded-[28px] px-3 py-2 min-w-[90px] sm:min-w-[130px] md:min-w-[150px] text-center flex-shrink-0">
                  <h3 className="text-lg sm:text-2xl md:text-3xl text-black font-semibold mb-0">
                    <CounterUp end={getContentByType('hero')?.cities} /><span className="text-red-600">+</span>
                  </h3>
                  <p className="text-black font-semibold text-xs sm:text-sm md:text-sm mb-0">Cities</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-stagger-4">
                <Link href="#" data-bs-toggle="modal" data-bs-target="#getintouchModel" className="btn-primary inline-block text-center group">
                  <span className="relative z-10">Get Started Today</span>
                </Link>
              </div>
            </div>

            {/* Right Illustration with floating animation */}
            <div className="relative animate-fadeInRight mx-auto">
              <div className="relative z-10 mx-auto ">
                <Image
                  src={ content?.pageContent?.heroImage ? `${baseUrl}/uploads/${content?.pageContent?.heroImage}` : '/anime/map.png'}
                  alt="Study Abroad Illustration"
                  width={500}
                  height={470}
                  className="drop-shadow-2xl mr-6"
                  priority
                />
              </div>

              {/* Background circle with pulse animation */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white bg-opacity-30 rounded-full animate-pulse-slow -z-10"></div>

              {/* Additional decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce-slow"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse-slow"></div>
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

      <section className="py-14 bg-[#FAFBFF]">
        <div className="container-sm mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading text-center d-block mb-2">
              {getContentByType('WhyChooseUs')?.title}
            </h2>
            <p className="sub-heading !text-base max-w-3xl mx-auto">
              {getContentByType('WhyChooseUs')?.subTittle || "We provide comprehensive support to make your UK education dreams a reality with personalized guidance and expert assistance."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getContentByType('WhyChooseUs')?.Cards.map((reason, index) =>
              <div key={index}
                className="flex items-start gap-3 
      p-4 
      border-1 border-black-300 
      shadow 
      rounded-2xl 
      bg-white
      backdrop-blur-[2px] 
      hover:backdrop-blur-sm 
      hover:border-black 
      transition-all duration-300 
      relative 
      overflow-hidden 
      group
      hover:shadow-blue-200/20 hover:shadow-2xl
      animate-slide-up"
                style={{ animationDelay: '0.3s' }}
              >
                {/* Text Content */}
                <div className="text-left flex-1">
                  <div className="sub-heading mb-2 !text-black
      ">
                    {reason.name}
                  </div>
                  <div className="descp !text-left !text-gray-800 !text-sm drop-shadow-sm">
                    {reason.content}
                  </div>
                </div>

                {/* Anime Character */}
                <div className="flex-shrink-0 w-20 h-20 opacity-90 pointer-events-none transition-transform duration-300 group-hover:scale-105">
                 <DynamicIcon name={reason.icon} color="red" className="w-12 h-12" />
                </div>

                {/* Glow Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-200/5 to-pink-200/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="container-sm py-20 lg:mt-0">
        <div className="text-center">
          <h2 className="heading text-center d-block pb-10">
            {getContentByType('form-section')?.title || "The Roadmap With Gateway Abroad"}
          </h2>
        </div>

        {/* Desktop Image (shown on lg and above) */}
        <img
          src={ content?.pageContent?.roadmapImage ? `${baseUrl}/uploads/${content?.pageContent?.roadmapImage}` : "/anime/road.svg"}
          alt={getContentByType('form-section')?.title}
          className="hidden md:block h-full w-full"
        />

        {/* Mobile Image (shown on sm to lg- screens) */}
        <img
          src={ content?.pageContent?.mobileRoadMap ? `${baseUrl}/uploads/${content?.pageContent?.mobileRoadMap}` : "/anime/mobileRoad.png"}
          alt="Study in UK Roadmap - Mobile"
          className="block md:hidden h-full w-full"
        />

      </section>
      <Component />
      <section className="people-behind-us-section py-70">
        <div className="container">
          <h2 className="heading text-center d-block">People behind Gateway Abroad</h2>
          <div className="behind-us-inner pt-4">
            <div className="row gy-4 justify-content-center">
              {form.map((m) => (
                <div className="col-lg-6 col-md-6" key={m._id}>
                  <div className="profile-card">
                    <div className="top-red-header">
                      <h4>{m.name}</h4>
                    </div>
                    <div className="profile-card-body">
                      <div className="scroll-container">
                        <p className="descp">{m.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <CardStackGridSection video={video} />

      <section className="blog-section py-70">
        <div className="container">
          <div className="title d-flex justify-content-between align-items-center mb-4">
            <h2 className="heading bottom-divider mb-0">Important Facts &amp; Information</h2>
            {/* Changed Link usage for Next.js */}
            <Link href="/blog" className="ms-4 site-btn">Go to blog</Link>
          </div>
          <div className="blog-section-inner">
            <Slider {...blogSlider} className="blog-section-slider">
              {blogData && blogData.map((blog, index) => (
                <div
                  onClick={() => router.push(`/blog-description/${blog.Slug}`)} // For App Router
                  className="blog-section-slider-inner cursor-pointer p-2"
                  key={index}
                >
                  <div className="blog-card">
                    <div className="card">
                      <div className="card-img-top">
                        <img src={`${constant.REACT_APP_URL}/uploads/${blog.image}`} alt="blog-img" />
                      </div>
                      <div className="card-body ps-0 pb-0">
                        <h5 className="card-title">
                          <Link href={`/blog-description/${blog.Slug}`}>{blog.blogTitle}</Link>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
};

export default StudyInUk;