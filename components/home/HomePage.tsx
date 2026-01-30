"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {  useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import PageServices from '@/services/PageServices';
import { constant } from '@/constant/index.constant.js';
import HeroSection from '../hero-section';
import AboutSection from '../about-section';
import TestPreparation from '../TestPreparationSection';
import { useGlobal } from '@/hooks/AppStateContext';
import Swal from 'sweetalert2';
import StudentRankSection from './StudentSlider';
import Image from 'next/image';
import BlogCard from '../pages/usable components/BlogCard';
import axiosInstance from '@/services/axiosInstance';
import BlogNew from '../blognew';
import { error } from 'console';

function Index() {
  const router = useRouter();
  const [blogData, setBlogData] = useState([]);
  const [video, setVideo] = useState([]);
  const [sliderData, setSliderData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { homePage: homePageDetails, course: CourseData, aboutPage: aboutPageData, testimonials: testimonials, youtubeVideo: videoStudednt, studentSlider: slider, studentHome: slider2 } = useGlobal();

  // Keen Slider for student info - UPDATED with autoplay
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);





  const [studentInfoRef, studentInfoInstanceRef] = useKeenSlider(
    {
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
      loop: true,
      mode: "snap",
      slides: {
        perView: 1,
        spacing: 16,
      },
      drag: false, // Disable drag since you want autoplay
    },
    // Add the autoplay plugin
    [
      (slider) => {
        let timeout;
        let mouseOver = false;

        function clearNextTimeout() {
          if (timeout) {
            clearTimeout(timeout);
          }
        }

        function nextTimeout() {
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 2000); // 2 seconds as per your comment
        }

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  // Keen Slider for student rank
  const [studentRankRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 2,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: {
          perView: 3,
          spacing: 20,
        },
      },
      '(min-width: 1024px)': {
        slides: {
          perView: 4,
          spacing: 24,
        },
      },
    },
  });

  // Keen Slider for testimonials
  const [testimonialRef, testimonialInstanceRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 16,
      },
      breakpoints: {
        '(min-width: 768px)': {
          slides: {
            perView: 2,
            spacing: 24,
          },
        },
      },
    },
    // Add the autoplay plugin as a separate plugin
    [
      (slider) => {
        let timeout;
        let mouseOver = false;

        function clearNextTimeout() {
          if (timeout) {
            clearTimeout(timeout);
          }
        }

        function nextTimeout() {
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 2000);
        }

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );


  // Keen Slider for YouTube videos with built-in autoplay plugin
  const [youtubeRef, youtubeInstanceRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 16,
      },
      breakpoints: {
        '(min-width: 640px)': {
          slides: {
            perView: 2,
            spacing: 20,
          },
        },
      },
    },
    // Add the autoplay plugin
    [
      (slider) => {
        let timeout;
        let mouseOver = false;

        function clearNextTimeout() {
          if (timeout) {
            clearTimeout(timeout);
          }
        }

        function nextTimeout() {
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 4000); // 4 seconds as per your comment
        }

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  // Keen Slider for blogs with navigation
  const [currentBlogSlide, setCurrentBlogSlide] = useState(0);
  const [blogRef, blogInstanceRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 16,
      },
      breakpoints: {
        '(min-width: 640px)': {
          slides: {
            perView: 2,
            spacing: 20,
          },
        },
        '(min-width: 1024px)': {
          slides: {
            perView: 3,
            spacing: 24,
          },
        },
      },
      slideChanged(slider) {
        setCurrentBlogSlide(slider.track.details.rel);
      },
    },
    // Add the autoplay plugin
    [
      (slider) => {
        let timeout;
        let mouseOver = false;

        function clearNextTimeout() {
          if (timeout) {
            clearTimeout(timeout);
          }
        }

        function nextTimeout() {
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 10000); // 4 seconds as per your comment
        }

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );


 const [slide, setSlide] = useState(0)

const visibleCards = 3
const cardWidth = 360 // adjust if card size changes

const maxSlide = Math.max(blogData.length - visibleCards, 0)


useEffect(() => {
  if (blogData.length <= visibleCards) return

  const interval = setInterval(() => {
    setSlide(prev =>
      prev >= maxSlide ? 0 : prev + 1
    )
  }, 2000) // 4 seconds

  return () => clearInterval(interval)
}, [blogData, maxSlide])



 const fetchBlogs = async () => {
  try {
    const res = await PageServices.getBlogData({
      page: 1,
      limit: 5,
    })

    setBlogData(res.data.blog)
    

  } catch (error) {
    console.log("API ERROR 👉", error)
  }
}


  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (videoStudednt?.media) {
      setVideo(videoStudednt.media);
    }
    if (slider?.media) {
      setSliderData(slider?.media);
    }
    if (slider2?.media) {
      setStudentData(slider2?.media);
    }
  }, [slider, slider2, videoStudednt]);

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors },
    reset: resetRegisterForm
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      studyDestination: '', // Default to empty string or a specific option if needed
      query: ''
    }
  });


 



  const handleUpdate = async (data) => {
    const { name, email, mobile, studyDestination, query } = data;

    const rawSource =
    new URLSearchParams(window.location.search)
      .get("utm_source")
      ?.toLowerCase() || "website";


  let finalSource = "website";

  if (["google", "googleads", "adwords"].includes(rawSource)) {
    finalSource = "googleAds";
  } else if (["meta", "instagram", "ig", "facebookads"].includes(rawSource)) {
    finalSource = "facebook";
  } else if (rawSource === "facebook") {
    finalSource = "facebook";
  }

    try {
      setLoading(true);

      let response = await axiosInstance.post("/leads", {
        fullName: name,
        email,
        phone: mobile,

        // 🔥 UTM SOURCE HERE
        source: rawSource, // instagram | facebook | google | website

        coursePreference: studyDestination,
        extraDetails: {
          message: query,
        
        },
      });

      if (response.data.success) {
        resetRegisterForm();
        router.push("/thank-you");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const {
    register: registerPartner,
    handleSubmit: handleSubmitPartner,
    formState: { errors: partnerErrors },
    reset: resetPartnerForm
  } = useForm({
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      mobile: '',
      whatsappNo: '',
      age: '',
      city: '',
      occupation: '',
      adress: '', // Note: Typo in state name 'adress' kept for consistency with original logic
      howDidyouKnow: '',
      qualifications: '',
      query: ''
    }
  });

  const handleUpdate2 = async (data) => {
  const {
    name,
    lastName,
    email,
    mobile,
    whatsappNo,
    age,
    city,
    occupation,
    adress,
    howDidyouKnow,
    qualifications,
    query,
  } = data;


  const rawSource =
    new URLSearchParams(window.location.search)
      .get("utm_source")
      ?.toLowerCase() || "website";


  let finalSource = "website";

  if (["google", "googleads", "adwords"].includes(rawSource)) {
    finalSource = "googleAds";
  } else if (["meta", "instagram", "ig", "facebookads"].includes(rawSource)) {
    finalSource = "facebook";
  } else if (rawSource === "facebook") {
    finalSource = "facebook";
  }

  try {
    const response = await axiosInstance.post("/leads", {
      fullName: `${name} ${lastName}`,
      email,
      phone: mobile,
      city,

 
      source: finalSource,

      coursePreference: "partnerForm",

      extraDetails: {
        whatsappNo,
        age,
        occupation,
        adress,
        qualification: qualifications,
        message: query,
        howDidyouKnow,
        utmSource: rawSource,
        type: "partner",
      },
    });

    if (response?.data?.success || response?.status === 200) {
      resetPartnerForm();

      const modalEl = document.getElementById("partnerModal");
      if (modalEl?.open) modalEl.close();
      document.body.style.overflow = "auto";

      Swal.fire({
        title: "Success",
        text: "Thanks for your submission!",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Partner form error:", error);
    Swal.fire({
      title: "Error",
      text: "An error occurred. Please try again later.",
      icon: "error",
    });
  }
};






  return (
    <>
      <HeroSection title={homePageDetails?.Title} description={homePageDetails?.Description} image={`${constant.REACT_APP_URL}/api/uploads/${homePageDetails?.image}`} />

      {/* About Us Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8">About us</h2>
          <div className="about-us-inner">
            <AboutSection aboutUs={aboutPageData?.page} />
          </div>
        </div>
      </section>

      {/* Coaching Services Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            Best in the Industry Coaching Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {constant.TEST_PREPARATION.map((x) => (
              <div key={x.text1} className="text-center p-4 bg-white rounded-lg ">
                <div className="w-[7rem] h-16 md:w-[8rem] md:h-20 mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src={`/img/${x.imageName}`}
                    alt={x.imageName}
                    width={130}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <p className="text-sm md:text-base text-gray-800 leading-relaxed font-medium">
                  {x.text1}
                  {x.text2 && <br />}
                  {x.text2}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Student Info Section - AUTO HEIGHT */}
      <section
        className="pt-6 relative"
        style={{
          background: "linear-gradient(180deg, rgba(188, 140, 252, 0.2), rgba(215, 22, 53, 0.2))"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 l py-6 lg:px-8">
          <div className=" flex flex-col lg:flex-row gap-8 md:gap-12">

            {/* Student Info Column - MOBILE: FULL WIDTH, DESKTOP: HALF */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1 ">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center lg:text-left mb-6 ">
                Established in <span className="bg-red-600 py-[2px] px-[4px] md:py-[4px] md:px-[6px] text-white rounded-[4px]">2009</span>, this institute is a leader in preparing students for standardized tests like <span className="font-semibold">GMAT</span>, <span className="font-semibold">GRE</span>, <span className="font-semibold">SAT</span>, <span className="font-semibold">TOEFL</span>, <span className="font-semibold">IELTS</span>, and <span className="font-semibold">PTE</span>.
              </h3>

              {studentData.length > 0 && (
                <div className="relative max-h-[320px]">
                  <div ref={studentInfoRef} className="keen-slider">
                    {studentData.map((s, index) => (
                      <div key={index} className="keen-slider__slide">
                        <div className="relative">
                          {/* Student Image - Responsive */}
                          <div className="flex justify-center">
                            <div className="relative">
                              <Image
                                src={`${constant.REACT_APP_URL}/api/uploads/${s.image}`}
                                alt={s.name}
                                width={300}
                                height={300}
                                className="rounded-full w-full max-w-[250px] md:max-w-[300px] aspect-square object-cover"
                              />
                            </div>
                          </div>

                          {/* Name and Score side by side - Responsive */}
                          <div className="absolute top-[200px] md:top-[240px] lg:top-[260px] flex items-center justify-center w-full">
                            <div className="flex items-center w-[90%] md:w-[75%] lg:w-[68%] h-[70px] md:h-[84px]">
                              <div className='w-[60%] bg-gray-300 h-full flex items-center justify-center'>
                                <h5 className="font-bold text-gray-900 text-base md:text-lg lg:text-xl px-2 text-center">{s.name}</h5>
                              </div>
                              <div className="text-center bg-[#9e0072] py-2 md:py-[10px] px-3 md:px-[20px] h-full flex flex-col items-center justify-center">
                                <p className="text-xs md:text-sm text-white">{s.courseName} Score</p>
                                <h5 className="text-lg md:text-xl lg:text-2xl font-bold text-white mt-1">{s.rank}</h5>
                              </div>
                            </div>
                          </div>

                          {/* Content below - Responsive */}
                          <div className="mt-[280px] md:mt-[340px] lg:mt-[380px] mb-8">
                            <p className="text-gray-600 leading-relaxed text-center text-sm md:text-base lg:text-lg">
                              {s.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Register Form Column - MOBILE: TOP, DESKTOP: RIGHT SIDE */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-start items-start">
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border border-gray-200 w-full max-w-[400px] lg:max-w-[85%]">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 text-center uppercase mb-4 md:mb-6">
                  Register Now
                </h3>
                <form onSubmit={handleSubmitRegister(handleUpdate)} className="space-y-3 md:space-y-4">

                  <div>
                    <input
                      type="text"
                      {...registerRegister("name", { required: "Name is required" })}
                      className="w-full h-10 md:h-11 text-sm md:text-base rounded-lg border border-gray-300 focus:border-red-500 py-2 md:py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-300"
                      placeholder="Name"
                    />
                    {registerErrors.name && (
                      <p className="text-red-500 text-xs mt-1 md:mt-1.5">{registerErrors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      {...registerRegister("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address"
                        }
                      })}
                      className="w-full h-10 md:h-11 text-sm md:text-base rounded-lg border border-gray-300 focus:border-red-500 py-2 md:py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-300"
                      placeholder="Email"
                    />
                    {registerErrors.email && (
                      <p className="text-red-500 text-xs mt-1 md:mt-1.5">{registerErrors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      {...registerRegister("mobile", {
                        required: "Phone is required",
                        pattern: {
                          value: /^\d{10,15}$/,
                          message: "Invalid phone number"
                        }
                      })}
                      className="w-full h-10 md:h-11 text-sm md:text-base rounded-lg border border-gray-300 focus:border-red-500 py-2 md:py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-300"
                      placeholder="Phone"
                    />
                    {registerErrors.mobile && (
                      <p className="text-red-500 text-xs mt-1 md:mt-1.5">{registerErrors.mobile.message}</p>
                    )}
                  </div>

                  <div>
                    <select
                      {...registerRegister("studyDestination", { required: "Test Preparation is required" })}
                      className="w-full h-10 md:h-11 text-sm md:text-base rounded-lg border border-gray-300 focus:border-red-500 px-4 text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-300 appearance-none"
                    >
                      <option value="">Test Preparation</option>
                      <option value='GMAT'>GMAT</option>
                      <option value='IELTS'>IELTS</option>
                      <option value="TOEFL">TOEFL</option>
                      <option value="GRE">GRE</option>
                      <option value="PTE">PTE</option>
                      <option value="SAT">SAT</option>
                    </select>
                    {registerErrors.studyDestination && (
                      <p className="text-red-500 text-xs mt-1 md:mt-1.5">{registerErrors.studyDestination.message}</p>
                    )}
                  </div>

                  <div>
                    <textarea
                      {...registerRegister("query")}
                      className="w-full min-h-[80px] md:min-h-[100px] text-sm md:text-base rounded-lg border border-gray-300 focus:border-red-500 py-2 md:py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-300 resize-none"
                      placeholder="Message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 md:py-3.5 px-4 rounded-lg font-semibold text-sm md:text-base transition-colors duration-300 shadow hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    SUBMIT
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>






      {/* Student Rank Section */}
      <section className=" bg-[#d71635] relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <div className="bg-black text-white px-4 p-[10px]  rounded-full absolute h-[65px] w-[150px] top-[-33px] right-[-105px]">
            <p className="text-base font-semibold text-center pl-[22px] pt-[8px]">Since 2009</p>
          </div>
        </div>

        <div className="mx-auto ml-20 overflow-hidden">
          <div className="flex group">
            {/* First set for seamless loop */}
            <div className="flex items-center animate-infinite-scroll group-hover:animation-paused">
              {sliderData.map((s, index) => (
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 text-center text-white inline-block relative pr-8 my-[10px]"
                >
                  {/* Right border for partition */}
                  <div className="absolute right-4 top-[55%] transform -translate-y-1/2 h-[42px] w-[1px] bg-white"></div>

                  <p className="text-sm text-[#FFD8D8]">{s.name}</p>
                  <p className="text-white font-semibold">{s.courseName} {s.rank}</p>
                </div>
              ))}
            </div>

            {/* Duplicate set for seamless loop */}
            <div className="flex items-center animate-infinite-scroll group-hover:animation-paused">
              {sliderData.map((s, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 text-center text-white inline-block relative pr-8 my-[10px]"
                >
                  {/* Right border for partition */}
                  <div className="absolute right-4 top-[55%] transform -translate-y-1/2 h-[42px] w-[1px] bg-white"></div>

                  <p className="text-sm text-[#FFD8D8]">{s.name}</p>
                  <p className="text-white font-semibold">{s.courseName} {s.rank}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add animation styles */}
          <style jsx>{`
    @keyframes infinite-scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-100%);
      }
    }
    .animate-infinite-scroll {
      animation: infinite-scroll 60s linear infinite;
      flex-shrink: 0;
      min-width: 100%;
    }
    .group:hover .animate-infinite-scroll {
      animation-play-state: paused;
    }
  `}</style>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="bg-[#d9d9d9] overflow-hidden">
        <div className="flex group">
          {/* First set for seamless loop */}
          <div className="flex items-center animate-infinite-scroll-reverse group-hover:animation-paused">
            {sliderData.map((s, index) => (
              <div key={`first-${index}`} className="flex-shrink-0 text-black font-medium inline-block relative pr-8 py-[10px]">
                {/* Right border for partition */}
                <div className="absolute right-4 top-[55%] transform -translate-y-1/2 h-[20px] w-[1px] bg-black"></div>
                {s.name} {s.courseName} <span className="text-black font-bold">{s.rank}</span>
              </div>
            ))}
          </div>

          {/* Duplicate set for seamless loop */}
          <div className="flex items-center animate-infinite-scroll-reverse group-hover:animation-paused">
            {sliderData.map((s, index) => (
              <div key={`second-${index}`} className="flex-shrink-0 text-black font-medium inline-block relative pr-8 py-[10px]">
                {/* Right border for partition */}
                <div className="absolute right-4 top-[55%] transform -translate-y-1/2 h-[42px] w-[1px] bg-black"></div>
                {s.name} {s.courseName} <span className="text-black font-bold">{s.rank}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add animation styles */}
        <style jsx>{`
    @keyframes infinite-scroll-reverse {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(0);
      }
    }
    .animate-infinite-scroll-reverse {
      animation: infinite-scroll-reverse 80s linear infinite;
      flex-shrink: 0;
      min-width: 100%;
    }
    .group:hover .animate-infinite-scroll-reverse {
      animation-play-state: paused;
    }
  `}</style>
      </section>

      {/* Test Preparation Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12 border-b-2 border-gray-200 pb-4">
            Test Preparation
          </h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 ">
            <TestPreparation CourseData={CourseData?.page} />
          </div>
        </div>
      </section>

      {/* Working Process Section */}
      <section className="py-12 md:py-20 bg-[#FAFBFF]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">
            Our Working Process
          </h2>
          <p className="text-gray-600 text-center mb-[50px] max-w-3xl mx-auto">
            A platform that takes care of everything beforehand. Gateway Abroad sources, vets, matches and manages all the talents.
          </p>

          {/* Desktop Process */}
          <div className="hidden lg:block">
            <div className="flex flex-wrap -mx-6">
              {/* Left Column */}
              <div className="w-1/3 px-6 mt-[90px]">
                <div className="text-right space-y-20">
                  <div className="relative">
                    <div className=" items-center justify-end space-x-4 mb-4">
                      <div className="w-[7rem] h-16 flex items-center justify-center flex-shrink-0 ">
                        <Image
                          src="/img/vetting2.svg"
                          alt="Teach"
                          width={100}
                          height={40}
                          className='ml-[560px] mb-[41px]'
                        />
                      </div>
                      <div className="text-right">
                        <h3 className="text-[#00817d] text-xl font-semibold mb-2">Teach</h3>
                        <p className="text-gray-600 text-sm leading-5">
                          Guiding individuals through a comprehensive process aimed at clearing the fundamentals of the students.
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="relative">
                    <div className=" items-center justify-end space-x-4 mb-4">
                      <div className="w-[7rem] h-16 flex items-center justify-center flex-shrink-0 ">
                        <Image
                          src="/img/vetting4.svg"
                          alt="Feedback & Mock"
                          width={100}
                          height={40}
                          className='ml-[560px] mb-[41px]'
                        />
                      </div>
                      <div className="text-right mt-[20px]">
                        <h3 className="text-[#7e5c6a] text-xl font-semibold mb-2">Feedback & Mock</h3>
                        <p className="text-gray-600 text-sm leading-5">
                          Regularly engage in mock exams and feedback sessions to familiarize yourself with the exam environment, improve time management, and identify areas that need further attention.
                        </p>
                      </div>

                    </div>
                  </div>
                  <div className="relative">
                    <div className=" items-center justify-end space-x-4 mb-4">
                      <div className="w-[7rem] h-16 flex items-center justify-center flex-shrink-0 ">
                        <Image
                          src="/img/vetting6.svg"
                          alt="Feedback & Mock"
                          width={100}
                          height={40}
                          className='ml-[560px] mb-[41px]'
                        />
                      </div>


                    </div>
                  </div>
                </div>
              </div>

              {/* Center Column - Process Image */}
              <div className="w-1/3 px-6 flex items-center justify-center">
                <div className="relative">
                  <Image
                    src="/img/vaetting-process-number.svg"
                    alt="Process Steps"
                    width={300}
                    height={400}
                    className="mx-auto"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="w-1/3 px-6 mb-[40px]">
                <div className="space-y-20">
                  <div className="relative">
                    <div className=" items-center space-x-4 mb-4">
                      <div className="w-[7rem] h-16   flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/img/vetting1.svg"
                          alt="Counsell"
                          width={80}
                          height={40}
                          className='mb-[80px]'
                        />
                      </div>
                      <div>
                        <h3 className="text-[#ffa515] text-xl font-semibold mb-2">Counsell</h3>
                        <p className="text-gray-600 text-sm leading-5">
                          It involves providing personalized advice to aid students in selecting the most suitable exam for their desired countries.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className=" items-center space-x-4 mb-4">
                      <div className="w-[7rem] h-16   flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/img/vetting3.svg"
                          alt="Practice"
                          width={100}
                          height={40}
                          className='mb-[40px]'
                        />
                      </div>
                      <div>
                        <h3 className="text-[#ff5e5b] text-xl font-semibold mb-2">Practice</h3>
                        <p className="text-gray-600 text-sm leading-5">
                          Engaging in regular and focused practice not only enhances one's understanding of the material but also hones skills, refines problem-solving abilities, and builds confidence.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className=" items-center space-x-4 mb-4">
                      <div className="w-[7rem] h-16  flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/img/vetting5.svg"
                          alt="Book Test Date"
                          width={100}
                          height={40}
                          className='mb-[80px]'
                        />
                      </div>
                      <div>
                        <h3 className="text-[#ff824b] text-xl font-semibold mb-2">Book Test Date</h3>
                        <p className="text-gray-600 text-sm leading-5">
                          Test date booking facility offered by Gateway Abroad.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Process */}
          <div className="lg:hidden space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/img/vetting1.svg"
                    alt="Counsell"
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <h3 className="text-[#ffa515] text-lg font-semibold mb-1">Counsell</h3>
                  <p className="text-gray-600 text-sm">
                    It involves providing personalized advice to aid students in selecting the most suitable exam for their desired countries.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/img/vetting2.svg"
                    alt="Teach"
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <h3 className="text-[#00817d] text-lg font-semibold mb-1">Teach</h3>
                  <p className="text-gray-600 text-sm">
                    Guiding individuals through a comprehensive process aimed at clearing the fundamentals of the students.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/img/vetting3.svg"
                    alt="Practice"
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <h3 className="text-[#ff5e5b] text-lg font-semibold mb-1">Practice</h3>
                  <p className="text-gray-600 text-sm">
                    Engaging in regular and focused practice not only enhances one's understanding of the material but also hones skills, refines problem-solving abilities, and builds confidence.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/img/vetting4.svg"
                    alt="Feedback & Mock"
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <h3 className="text-[#7e5c6a] text-lg font-semibold mb-1">Feedback & Mock</h3>
                  <p className="text-gray-600 text-sm">
                    Regularly engage in mock exams and feedback sessions to familiarize yourself with the exam environment, improve time management, and identify areas that need further attention.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/img/vetting5.svg"
                    alt="Book Test Date"
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <h3 className="text-[#ff824b] text-lg font-semibold mb-1">Book Test Date</h3>
                  <p className="text-gray-600 text-sm">
                    Test date booking facility offered by Gateway Abroad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Testimonials Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12 border-b-2 border-gray-200 pb-4">
            What Our Students Say
          </h2>

          {video.length > 0 && (
            <div ref={youtubeRef} className="keen-slider">
              {video.map((videoItem) => (
                <div key={videoItem._id} className="keen-slider__slide">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoItem.mediaLink}`}
                        title="YouTube video player"
                        className="w-full h-64 md:h-80"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-300 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/testimonials-bg.svg"
            alt="Background"
            fill
            className="object-cover"
            quality={75}
          />
        </div>
        <div className="absolute inset-0 bg-gray-400/10 z-1"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            What Our Test Preparation Achievers Say
          </h2>

          {(!testimonials?.testimonial || testimonials.testimonial.length === 0) ? (
            <div className="text-center text-gray-500 py-8">Loading testimonials...</div>
          ) : (
            <div className="relative group">
              <div ref={testimonialRef} className="keen-slider">
                {testimonials.testimonial.map((test, idx) => (
                  <div key={test._id} className="keen-slider__slide p-2 pb-6">
                    <div className="relative bg-white box-border caret-transparent z-0 ml-[30px] rounded-3xl md:ml-[50px] shadow-lg before:accent-auto before:border-b-gray-200 before:box-border before:caret-transparent before:text-neutral-800 before:block before:text-base before:not-italic before:normal-nums before:font-normal before:h-0 before:left-[-35px] before:tracking-[normal] before:leading-6 before:list-outside before:list-disc before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-0 before:z-[-1] before:border-t-white before:border-t-[25px] before:border-x-transparent before:border-x-[50px] before:border-separate before:border-solid before:top-0 before:font-noto_sans before:md:left-[-50px] before:md:border-t-[55px] before:md:border-x-[80px]">
                      <div className="box-border caret-transparent pt-5 px-5 md:pt-[35px] md:px-[30px]">
                        <div className="items-center box-border caret-transparent flex justify-between">
                          <h6 className="text-gray-700 text-lg font-bold box-border caret-transparent leading-[21.6px] mb-2">
                            {test.name}
                          </h6>
                          <ul className="box-border caret-transparent flex leading-[normal] list-none mb-4 pl-0">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <li key={star} className="text-amber-400 text-lg box-border caret-transparent">
                                <span className="text-yellow-400 text-lg">★</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium box-border caret-transparent max-w-[90%] min-h-0 text-left mb-4 py-[15px] md:max-w-none md:min-h-[198px]">
                          {test.content?.substring(0, 250)}
                          {test.content?.length > 250 && '...'}
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
      {/* Blog Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-0 border-b-2 border-gray-200 pb-4">
              Important Facts & Information
            </h2>
            <Link href="/blog" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
              View All Blogs
              <i className='bx bx-chevron-right text-lg'></i>
            </Link>
          </div>


         {blogData.length > 0 && (
  <div className="overflow-hidden">

    <div
      className="flex transition-transform duration-700 ease-in-out"
      style={{
        transform: `translateX(-${slide * cardWidth}px)`
      }}
    >
      <BlogNew blog={blogData} layout="slider" />

    </div>

  </div>
)}



        </div>
      </section>

      {/* ====== Partner Section ====== */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-[#fbe7ea] rounded-2xl sm:rounded-[24px] shadow-lg mx-auto w-full max-w-[1127px]">
            {/* Content container with specific padding */}
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                <div className="w-full lg:w-[48%]">
                  <div className="text-center lg:text-left pl-[17px]">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[36px] font-bold mb-4 text-[#d71635] lg:leading-[37px]">
                      Become a Partner
                    </h2>
                    <p className="text-base sm:text-lg lg:text-[18px] mb-4 sm:mb-6 text-[#666276]">
                      Join thousand of instructors and earn money hassle free!
                    </p>
                    <button
                      onClick={() => document.getElementById('partnerModal').showModal()}
                      className="inline-block bg-[#d71635] text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-3xl text-sm sm:text-base font-bold shadow-[0_0_8px_0_rgba(0,0,0,0.2)] hover:bg-[red] transition-all duration-300"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
                <div className="w-full lg:w-[38%]">
                  <div className="flex justify-center">
                    <img
                      src="/img/partner-img.svg"
                      alt="Partner Program"
                      className="w-full max-w-xs sm:max-w-sm lg:max-w-[20rem]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Modal */}
      <dialog id="partnerModal" className="modal modal modal-bottom sm:modal-middle
    backdrop:bg-black/50
    backdrop:backdrop-blur-sm
    px-3 sm:px-6 mx-auto p-4 rounded-[10px] modal-bottom sm:modal-middle">
        <div className="modal-box max-w-4xl">
          <div className="modal-header mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Partner</h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
          </div>

          <div className="modal-body max-h-[70vh] px-2 overflow-y-auto">
            <div className="get-in-touch-form">
              <form onSubmit={handleSubmitPartner(handleUpdate2)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
                  {/* First Name */}
                  <div>
                    <input
                      type="text"
                      {...registerPartner("name", { required: "First Name is required" })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${partnerErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="First Name"
                    />
                    {partnerErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{partnerErrors.name.message}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <input
                      type="text"
                      {...registerPartner("lastName", { required: "Last Name is required" })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${partnerErrors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Last Name"
                    />
                    {partnerErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{partnerErrors.lastName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      {...registerPartner("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address"
                        }
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${partnerErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Email"
                    />
                    {partnerErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{partnerErrors.email.message}</p>
                    )}
                  </div>

                  {/* Mobile No. */}
                  <div>
                    <input
                      type="text"
                      {...registerPartner("mobile", {
                        required: "Mobile No. is required",
                        pattern: {
                          value: /^\d{10,15}$/,
                          message: "Invalid phone number"
                        }
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${partnerErrors.mobile ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Mobile No."
                    />
                    {partnerErrors.mobile && (
                      <p className="text-red-500 text-sm mt-1">{partnerErrors.mobile.message}</p>
                    )}
                  </div>

                  {/* WhatsApp No. */}
                  <div>
                    <input
                      type="text"
                      {...registerPartner("whatsappNo")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="WhatsApp No."
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <input
                      type="number"
                      {...registerPartner("age", { min: 0, max: 120 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Age"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <input
                      type="text"
                      {...registerPartner("city", { required: "City is required" })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${partnerErrors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="City"
                    />
                    {partnerErrors.city && (
                      <p className="text-red-500 text-sm mt-1">{partnerErrors.city.message}</p>
                    )}
                  </div>

                  {/* Occupation */}
                  <div>
                    <input
                      type="text"
                      {...registerPartner("occupation", { required: "Occupation is required" })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${partnerErrors.occupation ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="What is your current Occupation?"
                    />
                    {partnerErrors.occupation && (
                      <p className="text-red-500 text-sm mt-1">{partnerErrors.occupation.message}</p>
                    )}
                  </div>
                </div>

                {/* Address - Full Width */}
                <div>
                  <textarea
                    {...registerPartner("adress", { required: "Address is required" })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${partnerErrors.adress ? 'border-red-500' : 'border-gray-300'
                      }`}
                    rows={3}
                    placeholder="Your Address"
                  />
                  {partnerErrors.adress && (
                    <p className="text-red-500 text-sm mt-1">{partnerErrors.adress.message}</p>
                  )}
                </div>

                {/* How did you know about us - Full Width */}
                <div>
                  <select
                    {...registerPartner("howDidyouKnow", { required: "Please select how you know about us" })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${partnerErrors.howDidyouKnow ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="">did you come to know about Gateway Abroad?</option>
                    <option value='google'>Google Ad</option>
                    <option value='facebook'>Facebook Ad</option>
                    <option value='email'>Email Campaign</option>
                    <option value='sms'>SMS Campaign</option>
                    <option value='whatsapp'>WhatsApp</option>
                    <option value='linkedin'>Linkedin</option>
                    <option value='reference'>Reference</option>
                    <option value='newspaper'>Newspaper</option>
                    <option value='website'>Website</option>
                    <option value='call'>Call</option>
                    <option value='instagram'>Instagram</option>
                    <option value='other'>Other</option>
                  </select>
                  {partnerErrors.howDidyouKnow && (
                    <p className="text-red-500 text-sm mt-1">{partnerErrors.howDidyouKnow.message}</p>
                  )}
                </div>

                {/* Qualifications - Full Width */}
                <div>
                  <textarea
                    {...registerPartner("qualifications", { required: "Qualifications are required" })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${partnerErrors.qualifications ? 'border-red-500' : 'border-gray-300'
                      }`}
                    rows={3}
                    placeholder="What are your Educational Qualifications?"
                  />
                  {partnerErrors.qualifications && (
                    <p className="text-red-500 text-sm mt-1">{partnerErrors.qualifications.message}</p>
                  )}
                </div>

                {/* Introduction - Full Width */}
                <div>
                  <textarea
                    {...registerPartner("query", { required: "Introduction is required" })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${partnerErrors.query ? 'border-red-500' : 'border-gray-300'
                      }`}
                    rows={3}
                    placeholder="Please provide a Brief Introduction about yourself"
                  />
                  {partnerErrors.query && (
                    <p className="text-red-500 text-sm mt-1">{partnerErrors.query.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-purple-600  text-white py-3 px-6 rounded-lg font-semibold "
                >
                  SUBMIT
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Index;