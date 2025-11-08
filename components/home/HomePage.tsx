"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

function Index() {
  const router = useRouter();
  const [blogData, setBlogData] = useState([]);
  const [video, setVideo] = useState([]);
  const [sliderData, setSliderData] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const { homePage: homePageDetails, course: CourseData, aboutPage: aboutPageData, testimonials: testimonials, youtubeVideo: videoStudednt, studentSlider: slider, studentHome: slider2 } = useGlobal();

  // Keen Slider for student info - UPDATED with autoplay
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [studentInfoRef, studentInfoInstanceRef] = useKeenSlider({
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
    // Autoplay configuration
    drag: false, // Optional: disable drag if you only want autoplay
  });

  // Autoplay effect
  useEffect(() => {
    if (!studentInfoInstanceRef.current) return;

    const interval = setInterval(() => {
      if (studentInfoInstanceRef.current) {
        studentInfoInstanceRef.current.next();
      }
    }, 2000); // Change slide every 3 seconds

    return () => {
      clearInterval(interval);
    };
  }, [studentInfoInstanceRef]);

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
  const [testimonialRef, testimonialInstanceRef] = useKeenSlider({
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
  });

  // Autoplay for testimonials slider
  useEffect(() => {
    if (!testimonialInstanceRef.current) return;

    const interval = setInterval(() => {
      if (testimonialInstanceRef.current) {
        testimonialInstanceRef.current.next();
      }
    }, 2000); // Change slide every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [testimonialInstanceRef]);



  // Keen Slider for YouTube videos
  const [youtubeRef, youtubeInstanceRef] = useKeenSlider({
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
  });

  // Autoplay for YouTube videos slider
  useEffect(() => {
    if (!youtubeInstanceRef.current) return;

    const interval = setInterval(() => {
      if (youtubeInstanceRef.current) {
        youtubeInstanceRef.current.next();
      }
    }, 2000); // Change slide every 4 seconds

    return () => {
      clearInterval(interval);
    };
  }, [youtubeInstanceRef]);

  // Keen Slider for blogs with navigation
  const [currentBlogSlide, setCurrentBlogSlide] = useState(0);
  const [blogRef, blogInstanceRef] = useKeenSlider({
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
  });

  // Autoplay for blog slider
  useEffect(() => {
    if (!blogInstanceRef.current) return;

    const interval = setInterval(() => {
      if (blogInstanceRef.current) {
        blogInstanceRef.current.next();
      }
    }, 4000); // Change slide every 4 seconds

    return () => {
      clearInterval(interval);
    };
  }, [blogInstanceRef]);

  const fetchBlogs = useCallback(async (page = 1, category = 'All', search = '') => {
    try {
      const res = await PageServices.getBlogData({ page, limit: 5, category, search });
      setBlogData(res.data.blog || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  }, []);

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
      studyDestination: '',
      query: ''
    }
  });

  const handleUpdate = async (data) => {
    const { name, email, mobile, studyDestination, query } = data;
    try {
      const createJob = await PageServices.createForme({
        name,
        email,
        mobileNo: mobile,
        message: query,
        studyDestination,
        type: 'register'
      });
      if (createJob.status === 'success') {
        resetRegisterForm();
        Swal.fire({
          title: "Success",
          text: "Thanks for registering!",
          icon: "success",
        });
      } else {
        alert('Something went wrong');
      }
    } catch (error) {
      console.error("Error submitting register form:", error);
      alert('An error occurred. Please try again.');
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

  const handleUpdate2 = async (data) => { // 'data' now contains validated form values
    const {
      name, lastName, email, mobile, whatsappNo, age, city,
      occupation, adress, howDidyouKnow, qualifications, query
    } = data;
    try {
      const createJob = await PageServices.createForme({
        name,
        email,
        mobileNo: mobile,
        lastName,
        whatsappNo,
        city,
        age,
        occupation,
        adress, // Keep typo for consistency
        howDidyouKnow,
        qualification: qualifications,
        message: query,
        type: 'partner'
      });

      if (createJob.status === 'success') {
        resetPartnerForm();
        const modalEl = document.getElementById("partnerModal");
        modalEl.classList.remove("show");
        modalEl.style.display = "none";
        modalEl.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();// ✅ safer method
        Swal.fire({
          title: "Success",
          text: 'thanks for your submission!',
          icon: "success",
          customClass: {
            popup: "swal-zindex"
          }
        });
      } else {
        alert('Something went wrong');
      }
    } catch (error) {
      console.error("Error submitting partner form:", error);
      alert('An error occurred. Please try again.'); // Provide user feedback
    }
  };

  return (
    <>
      <HeroSection title={homePageDetails?.Title} description={homePageDetails?.Description} image={`${constant.REACT_APP_URL}/uploads/${homePageDetails?.image}`} />

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



      {/* Student Info Section */}
      <section
        className="py-12 md:py-[2rem] relative overflow-hidden h-[800px]"
        style={{
          background: "linear-gradient(180deg, rgba(188, 140, 252, 0.2), rgba(215, 22, 53, 0.2))"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Student Info & Slider */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 text-center lg:text-left mb-8 leading-[35px]">
                Established in <span className="bg-red-600 py-[4px] px-[6px] text-white rounded-[4px]">2009</span>, this institute is a leader in preparing students for standardized tests like <span>GMAT</span>, <span>GRE</span>, <span>SAT</span>, <span>TOEFL</span>, <span>IELTS</span>, and <span>PTE</span>.
              </h3>

              {studentData.length > 0 && (
                <div className="relative">
                  <div ref={studentInfoRef} className="keen-slider">
                    {studentData.map((s, index) => (
                      <div key={index} className="keen-slider__slide">
                        <div className="relative">
                          {/* Student Image - Larger and centered above content */}
                          <div className="flex justify-center">
                            <div className="relative">
                              <Image
                                src={`${constant.REACT_APP_URL}/uploads/${s.image}`}
                                alt={s.name}
                                width={360}
                                height={120}
                                className="rounded-full w-full max-w-[360px] h-auto"
                              />
                            </div>
                          </div>

                          {/* Name and Score side by side */}
                          <div className="absolute top-[280px] flex ml-[95px] items-center w-[68%] h-[94px] sm:ml-[70px] sm:w-[75%] md:ml-[85px] md:w-[70%] lg:ml-[95px] lg:w-[68%]">
                            <div className='w-[60%] bg-gray-300 h-[100%]'>
                              <h5 className="text-center pt-[30px] font-bold text-gray-900 text-xl">{s.name}</h5>
                            </div>
                            <div className="text-center bg-[#9e0072] py-[11px] px-[25px] h-[100%]">
                              <p className="text-sm text-white mb-1">{s.courseName} Score</p>
                              <h5 className="text-2xl mt-[10px] font-bold text-white">{s.rank}</h5>
                            </div>
                          </div>

                          {/* Content below */}
                          <div className="mt-[400px] sm:mt-[380px] md:mt-[370px] lg:mt-[400px]">
                            <p className="text-gray-600 leading-relaxed text-center text-lg">
                              {s.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Slider Navigation */}
                  {loaded && studentInfoInstanceRef.current && studentData.length > 1 && (
                    <div className="flex items-center justify-center mt-6 space-x-4">

                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Register Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 mb-[160px] w-[70%]">
              <h3 className="text-2xl font-bold text-gray-900 text-center uppercase mb-6">Register Now</h3>
              <form onSubmit={handleSubmitRegister(handleUpdate)} className="space-y-4">
                <div>
                  <input
                    type="text"
                    {...registerRegister("name", { required: "Name is required" })}
                    className={`w-full flex h-10 bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full py-[17px] px-4 text-gray-900 transition-colors`}
                    placeholder="Name"
                  />
                  {registerErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.name.message}</p>
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
                    className={`w-full flex h-10 bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full py-[17px] px-4 text-gray-900 transition-colors`}
                    placeholder="Email"
                  />
                  {registerErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.email.message}</p>
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
                    className={`w-full flex h-10 bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full py-[17px] px-4 text-gray-900 transition-colors`}
                    placeholder="Phone"
                  />
                  {registerErrors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.mobile.message}</p>
                  )}
                </div>

                <div>
                  <select
                    {...registerRegister("studyDestination", { required: "Test Preparation is required" })}
                    className={`w-full flex h-10 bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full  px-4 text-gray-900 transition-colors`}
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
                    <p className="text-red-500 text-sm mt-1">{registerErrors.studyDestination.message}</p>
                  )}
                </div>

                <div>
                  <textarea
                    {...registerRegister("query")}
                    className="w-full flex h-10 bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full py-2  px-4 text-gray-900 transition-colors h-[110px]"
                    rows={3}
                    placeholder="Message"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 transform hover:scale-105 shadow-lg"
                >
                  SUBMIT
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>





      {/* Student Rank Section */}
      <section className=" bg-[#d71635] relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <div className="bg-black text-white px-4 p-[10px]  rounded-full absolute h-[65px] w-[211px] top-[-33px] right-[-158px]">
            <p className="text-xl font-semibold text-center pl-[22px] pt-[8px]">Since 2009</p>
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
      animation: infinite-scroll 20s linear infinite;
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
      animation: infinite-scroll-reverse 40s linear infinite;
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
      <div className="relative">
        <div ref={blogRef} className="keen-slider">
          {blogData.map((blog) => (
            <div key={blog.id} className="keen-slider__slide">
              <BlogCard
                blog={blog}
                showDescription={false} // Add this prop to hide description
                onClick={() => router.push(`/blog-description/${blog.Slug}`)}
              />
            </div>
          ))}
        </div>

        {/* Blog Slider Navigation */}
        {blogData.length > 3 && (
          <div className="flex items-center justify-center mt-8 space-x-4">
            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {[...Array(Math.ceil(blogData.length / 3))].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => blogInstanceRef.current?.moveToIdx(idx * 3)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentBlogSlide === idx ? 'bg-red-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
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
<dialog id="partnerModal" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box max-w-4xl">
    <div className="modal-header mb-6">
      <h3 className="text-2xl font-bold text-gray-900">Become A Partner</h3>
      <form method="dialog">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
    </div>
    
    <div className="modal-body max-h-[70vh] overflow-y-auto">
      <div className="get-in-touch-form">
        <form onSubmit={handleSubmitPartner(handleUpdate2)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <input
                type="text"
                {...registerPartner("name", { required: "First Name is required" })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  partnerErrors.name ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  partnerErrors.lastName ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  partnerErrors.email ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  partnerErrors.mobile ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  partnerErrors.city ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  partnerErrors.occupation ? 'border-red-500' : 'border-gray-300'
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                partnerErrors.adress ? 'border-red-500' : 'border-gray-300'
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                partnerErrors.howDidyouKnow ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">How did you come to know about Gateway Abroad?</option>
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                partnerErrors.qualifications ? 'border-red-500' : 'border-gray-300'
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                partnerErrors.query ? 'border-red-500' : 'border-gray-300'
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
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 transform hover:scale-105 shadow-lg"
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