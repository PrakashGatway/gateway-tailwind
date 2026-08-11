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
// import { useGlobal } from '@/hooks/AppStateContext';
import Swal from 'sweetalert2';
import StudentRankSection from './StudentSlider';
import Image from 'next/image';
import BlogCard from '../pages/usable components/BlogCard';
import axiosInstance, { baseUrl } from '@/services/axiosInstance';
import BlogNew from '../blognew';
import { error } from 'console';
import ContactForm from '../pages/UkForm';
import { ProcessStep } from '../ukpageComponent/whyStudyin';
import UniversitySliderClient from '../universityslider';
import DestinationsSection from './DestinationSection';
import StudyAbroadProcess from '../studyAbroadprocess';
import StudentScoresSection from './studentScoreSection';
import TestimonialsSection from './testimonialSection';
import { Building2, GraduationCap, Landmark, MapPin, Monitor, Sun } from 'lucide-react';
import * as Icons from 'lucide-react';
import ctasection from './ctaSection';
import LandingPage from './ctaSection';
import FAQSection from './FaqSection';
import { SingleSlider } from '../pages/partnerSlider';
import About from './AboutSection';
import DynamicCounsellingForm from './dynamiccounsellingform';


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



function Index({ homePage: homePageDetails, course: CourseData, aboutPage: aboutPageData, testimonials: testimonials, youtubeVideo: videoStudednt, studentSlider: slider, studentHome: slider2, faq: faqdata }: any) {
  const router = useRouter();
  const [blogData, setBlogData] = useState([]);
  const [video, setVideo] = useState([]);
  const [sliderData, setSliderData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);

  // const { homePage: homePageDetails, course: CourseData, aboutPage: aboutPageData, testimonials: testimonials, youtubeVideo: videoStudednt, studentSlider: slider, studentHome: slider2 } = useGlobal();

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


  const contactNumber = "+91-8302092630";

  // Keen Slider for student rank
  // const [studentRankRef] = useKeenSlider({
  //   loop: true,
  //   slides: {
  //     perView: 2,
  //     spacing: 16,
  //   },
  //   breakpoints: {
  //     '(min-width: 640px)': {
  //       slides: {
  //         perView: 3,
  //         spacing: 20,
  //       },
  //     },
  //     '(min-width: 1024px)': {
  //       slides: {
  //         perView: 4,
  //         spacing: 24,
  //       },
  //     },
  //   },
  // });

  // Keen Slider for testimonials


  const [activeStep, setActiveStep] = useState(null);

  const processSteps = [
    {
      step: 1,
      tag: "Free · Week 1",
      title: "Free Profile Evaluation & Destination University Matching",
      description: "We assess your academic background, IELTS score (or MOI eligibility), budget, preferred course, and career goals. You receive a personalised Destination university shortlist — within 48 hours, completely free.",
      icon: "📋",
      color: "bg-red-500"
    },
    {
      step: 2,
      tag: "If needed · Month 1–3",
      title: "IELTS / PTE / Duolingo Coaching",
      description: "Our certified IELTS coaches help you achieve your target band score with a personalised study plan, weekly mock tests, and focused speaking and writing practice sessions.",
      icon: "📚",
      color: "bg-orange-500"
    },
    {
      step: 3,
      tag: "Month 2–4",
      title: "SOP, LOR & Application Document Preparation",
      description: "Our UK-experienced writers craft a compelling Statement of Purpose, guide your referees on LOR content, and prepare your complete application package tailored to each university's requirements.",
      icon: "📝",
      color: "bg-amber-500"
    },

    {
      step: 5,
      tag: "After Offer Letter",
      title: "Scholarship Applications & Education Loan",
      description: "We identify every scholarship you're eligible for and complete those applications. We also assist with education loan documentation for SBI, HDFC Credila, Axis, and other lenders — ensuring you get the best rate.",
      icon: "💰",
      color: "bg-green-500"
    },
    {
      step: 6,
      tag: "2–3 Months Before Travel",
      title: "Student Visa Application (Tier 4 / Student Route)",
      description: "We prepare your complete visa package — CAS, bank statements, IHS payment, DS-160 equivalent documents — and conduct mock visa interview preparation.",
      icon: "🛂",
      color: "bg-blue-500"
    },
    {
      step: 7,
      tag: "Pre-Departure",
      title: "Pre-Departure Orientation & Post-Arrival Support",
      description: "Accommodation guidance, forex cards, NHS registration,bank account tips, transport orientation, and connections to Indian student communities at your university — we're with you even after you land.",
      icon: "✈️",
      color: "bg-purple-500"
    }
  ];










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
  // const [blogRef, blogInstanceRef] = useKeenSlider(
  //   {
  //     loop: true,
  //     slides: {
  //       perView: 1,
  //       spacing: 16,
  //     },
  //     breakpoints: {
  //       '(min-width: 640px)': {
  //         slides: {
  //           perView: 2,
  //           spacing: 20,
  //         },
  //       },
  //       '(min-width: 1024px)': {
  //         slides: {
  //           perView: 3,
  //           spacing: 24,
  //         },
  //       },
  //     },
  //     slideChanged(slider) {
  //       setCurrentBlogSlide(slider.track.details.rel);
  //     },
  //   },
  //   // Add the autoplay plugin
  //   [
  //     (slider) => {
  //       let timeout;
  //       let mouseOver = false;

  //       function clearNextTimeout() {
  //         if (timeout) {
  //           clearTimeout(timeout);
  //         }
  //       }

  //       function nextTimeout() {
  //         if (mouseOver) return;
  //         timeout = setTimeout(() => {
  //           slider.next();
  //         }, 10000); // 4 seconds as per your comment
  //       }

  //       slider.on("created", () => {
  //         slider.container.addEventListener("mouseover", () => {
  //           mouseOver = true;
  //           clearNextTimeout();
  //         });
  //         slider.container.addEventListener("mouseout", () => {
  //           mouseOver = false;
  //           nextTimeout();
  //         });
  //         nextTimeout();
  //       });
  //       slider.on("dragStarted", clearNextTimeout);
  //       slider.on("animationEnded", nextTimeout);
  //       slider.on("updated", nextTimeout);
  //     },
  //   ]
  // );




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

  const handleGetStarted = () => {

    window.dispatchEvent(new CustomEvent('openFooterModal'));
  };




  return (
    <>
      <HeroSection content={homePageDetails?.sections[0]?.content} title={homePageDetails?.sections[0]?.content?.title} description={homePageDetails?.sections[0]?.content?.subtitle} image={`${baseUrl}/uploads/${homePageDetails?.pageContent?.heroImage}`} />

      {/* Student Info Section - AUTO HEIGHT */}
      <section
        className=" relative bg-white"

      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 l lg:py-12 lg:px-8">
          <div className=" flex flex-col lg:flex-row gap-8 md:gap-12">

            {/* Student Info Column - MOBILE: FULL WIDTH, DESKTOP: HALF */}
            <div className="w-full lg:w-[50%] order-2 lg:order-1 ">


              {studentData.length > 0 && (
                <div className="relative max-h-[320px]">
                  <div ref={studentInfoRef} className="keen-slider">
                    {homePageDetails?.sections[12]?.content?.aboutimage?.map((s, index) => (
                      <div key={index} className="keen-slider__slide">
                        <div className="relative">
                          {/* Student Image - Responsive */}
                          <div className="flex justify-center">
                            <div className="relative">
                              <Image
                                src={`${baseUrl}/uploads/${s.image}`}
                                alt={s.name}
                                width={300}
                                height={300}
                                className=" w-100 md:w-full  object-cover"
                                priority
                              />
                            </div>
                          </div>

                          {/* Name and Score side by side - Responsive */}
                          {/* <div className="absolute top-[200px] md:top-[240px] lg:top-[260px] lg:-left-30 flex items-center justify-center w-full">
                            <div className="flex items-center w-[90%] md:w-[75%] lg:w-[68%] h-[70px] md:h-[84px]">
                              <div className='w-[60%] bg-gray-300 h-full flex items-center justify-center'>
                                <h5 className="font-bold text-gray-900 text-base md:text-lg lg:text-xl px-2 text-center">{s.name}</h5>
                              </div>
                           
                            </div>
                          </div> */}

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
            <div className="w-full lg:w-[50%] order-1 lg:order-2 flex justify-center lg:justify-start items-start">
              <DynamicCounsellingForm />
            </div>

          </div>
        </div>
      </section>

      <div className="my-6">
        <SingleSlider />
      </div>


      {/* About Us Section */}

      <About content={homePageDetails?.sections[1]?.content} />
      {/* <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8">About us</h2>
          <div className="about-us-inner">
            <AboutSection aboutUs={aboutPageData?.page} />
          </div>
        </div>
      </section> */}

      <DestinationsSection content={homePageDetails?.sections[2]?.content} />



      {/* Coaching Services Section */}

      <section id="exams" className="relative py-16 md:py-12 bg-white overflow-hidden ">
        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full  opacity-60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-red-100  border border-[#F4A62A]/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-[#C41430] text-sm md:text-sm font-bold uppercase tracking-wider">
                {homePageDetails?.sections[3]?.content?.label}
              </span>
            </div>
            <h2 className=" text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4">
              {homePageDetails?.sections[3]?.content?.title}
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{
              __html: homePageDetails?.sections[3]?.content?.description
            }}>

            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {homePageDetails?.sections[3]?.content?.testprepcourses?.map((exam) => {

              const colorbgClass = exam?.coursetitle === "IELTS" ? "bg-red-500" :
                exam?.coursetitle === "PTE" ? "bg-cyan-500" :
                  exam?.coursetitle === "TOEFL" ? "bg-blue-800" :
                    exam?.coursetitle === "GRE" ? "bg-[#0C447C]" :
                      exam?.coursetitle === "GMAT" ? "bg-cyan-600" :
                        exam?.coursetitle === "SAT" ? "bg-cyan-400" :
                          exam?.coursetitle === "Duolingo" ? "bg-[#76c442]" : "bg-gray-500";

              const colorClass = exam?.coursetitle === "IELTS" ? "text-red-500" :
                exam?.coursetitle === "PTE" ? "text-cyan-500" :
                  exam?.coursetitle === "TOEFL" ? "text-blue-800" :
                    exam?.coursetitle === "GRE" ? "text-[#0C447C]" :
                      exam?.coursetitle === "GMAT" ? "text-cyan-600" :
                        exam?.coursetitle === "SAT" ? "text-cyan-400" :
                          exam?.coursetitle === "Duolingo" ? "text-[#76c442]" : "text-gray-500";
              return (
                <div
                  key={exam.id}
                  className={`group relative bg-[#FFF7EE] border border-white/10 rounded-2xl p-5  hover:border-white/20 hover:-translate-y-1 transition-all duration-300 flex flex-col ${exam.wide ? 'md:col-span-2 lg:col-span-1 xl:col-span-1' : ''
                    }`}
                >
                  {/* Top colored border on hover */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${colorbgClass}  rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />

                  {/* Category Badge */}
                  <span className={`inline-block w-fit px-3 py-1 rounded-full ${exam.badgeClass} text-sm md:text-[11px] font-bold uppercase tracking-wide mb-3`}>
                    {exam.category}
                  </span>

                  {/* Exam Name & Details */}
                  <h3 className={`text-2xl lg:text-4xl font-bold ${colorClass} mb-1`}>{exam.coursetitle}</h3>
                  <p className=" h-full lg:text-base mb-2" dangerouslySetInnerHTML={{ __html: exam.coursesubtitle }} />

                  {/* Features List */}
                  {/* <ul className="space-y-2 mb-6 flex-grow">
                {exam.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className={`w-1.5 h-1.5 rounded-full bg-[#F4A62A] mt-1.5 shrink-0`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul> */}

                  {/* Enroll Button */}
                  <a
                    href={`/${exam?.slug}`}
                    className="w-full py-2.5 rounded-lg bg-red-500 text-white text-base font-semibold border border-white/20 hover:bg-[#F4A62A] hover:text-[#5a2d00] hover:border-[#F4A62A] transition-colors text-center"
                  >
                    {exam?.btntext}
                  </a>
                </div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-center">
            <p className="text-black text-sm md:text-base">
              <strong className="text-black">Not sure which test to take?</strong> Our experts will guide you to the right exam for your target country & university.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-[#e9971e] transition-colors shadow-lg shadow-[#F4A62A]/20 whitespace-nowrap"
            >
              Get Free Test Guidance →
            </button>
          </div>
        </div>
      </section>
      {/* <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            Best Study Abroad Services
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
      </section> */}


      <section className=" py-10 md:py-12 px-4 md:px-8" id="destinations" style={{
        background: "linear-gradient(180deg, rgba(188, 140, 252, 0.2), rgba(215, 22, 53, 0.2))"
      }}>
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <div className="mb-8 md:mb-12">
            <span

              className="inline-flex items-center gap-2 bg-red-100 text-[#C41430] font-semibold text-sm md:text-sm tracking-wider uppercase px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-emerald-900/20 mb-4"
            >
              {homePageDetails?.sections[4]?.content?.label}
            </span>

            <h2

              className=" text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-3 font-bold">
              {homePageDetails?.sections[4]?.content?.title}

            </h2>

            <p

              className="text-gray-600 text-sm sm:text-base md:text-base mb-8 md:mb-12"
              dangerouslySetInnerHTML={{
                __html: homePageDetails?.sections[4]?.content?.subTitle
              }}
            >

            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-0 md:p-6">
            {homePageDetails.sections[4]?.content?.abroadconsulting?.map((service, index) => {
              return (
                <div className="rounded-xl md:rounded-2xl p-5 md:p-8 bg-white border-2 border-[#D81635] shadow-lg duration-300 ease-in-out  flex flex-col h-full">
                  <span className="inline-block mb-4 px-3 py-1 md:px-4 md:py-1 text-sm md:text-sm font-semibold bg-black text-white rounded-full tracking-wide w-fit">
                    {service?.label}
                  </span>


                  <p
                    className="
    
    [&_ul]:list-disc
    [&_ul]:pl-5
    [&_ul]:space-y-0
    [&_li]:leading-tight
    [&_li]:mb-0
    lg:text-base
  "
                    dangerouslySetInnerHTML={{ __html: service?.content }}
                  />


                  <button onClick={handleGetStarted} className="w-full md:w-auto bg-[#D81635] text-white px-6 py-3 rounded-full font-semibold text-sm md:text-base hover:bg-yellow-300 hover:text-black transition-colors duration-300 mt-auto">
                    {service?.buttontext}
                  </button>
                </div>

              )
            })}

            {/* Card 1: Consulting */}


            {/* Card 2: Test Prep */}
            {homePageDetails.sections[4]?.content?.testprepcourses?.map((course, index) => {
              return (
                <div className="rounded-xl md:rounded-2xl p-5 md:p-8 bg-[#FFF7EE] border-2 border-black shadow-lg duration-300 ease-in-out  flex flex-col h-full">
                  <span className="inline-block mb-4 px-3 py-1 md:px-4 md:py-1 text-sm md:text-sm font-semibold bg-black text-white rounded-full tracking-wide w-fit">
                    {course?.label}
                  </span>



                  <p className="text-sm sm:text-sm md:text-base text-black mb-4 md:mb-6 leading-relaxed" dangerouslySetInnerHTML={{
                    __html: course?.content
                  }}>

                  </p>


                  <Link href="/onboarding">
                    <button className="w-full md:w-full border border-black/10 px-6 py-3 rounded-full bg-[#D81635] text-white font-semibold text-sm md:text-base hover:bg-black hover:text-white transition-all duration-300 mt-auto">
                      {course?.buttontext}
                    </button>
                  </Link>

                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Badge */}
          <div className="flex  mb-3">
            <span className="bg-red-100 text-[#D81635] px-4 py-1 rounded-full text-sm md:text-sm font-semibold uppercase tracking-wider">
              {homePageDetails?.sections[5]?.content?.label}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-4xl lg:text-4xl font-bold  text-gray-900 leading-tight">
            {homePageDetails?.sections[5]?.content?.title}
          </h2>

          {/* Subtext */}
          <p className=" text-gray-500 mt-3 md:mt-4  text-sm md:text-base" dangerouslySetInnerHTML={{
            __html: homePageDetails?.sections[5]?.content?.subTitle
          }}>

          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-10 md:mt-14">

            {/* Loop through features */}
            {homePageDetails?.sections[5]?.content?.cards?.map((item, idx) => {
              const IconComponent = Icons[item.icon] || Icons.Target;
              return (
                <div
                  key={idx}
                  className="
    relative bg-[#F7F4EE] rounded-xl md:rounded-2xl p-5 md:p-6 
    shadow-sm transition-all duration-300
    hover:shadow-md hover:-translate-y-1

    /* Bottom line */
    after:absolute after:left-0 after:bottom-0
    after:h-[3px] after:w-0
    after:bg-[#D81635]
    after:transition-all after:duration-300
    after:rounded-b-xl

    hover:after:w-full
  "
                >
                  {/* Background Number */}


                  {/* Icon */}
                  <div className="text-[#D81635] text-2xl md:text-3xl mb-2 md:mb-3">
                    <IconComponent className="w-8 h-8 md:w-10 md:h-10" />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-base md:text-lg text-gray-800">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm md:text-base mt-1 md:mt-2 leading-relaxed" dangerouslySetInnerHTML={{
                    __html: item.description
                  }}>

                  </p>
                </div>
              )
            })}

          </div>
        </div>
      </section>

      <StudyAbroadProcess content={homePageDetails?.sections[6]?.content} />

      <StudentScoresSection content={homePageDetails?.sections[7]?.content} studentslider={slider} />



      <section className="bg-red-50 py-12 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <div className="mb-10 md:mb-14">
            {/* Badge */}
            <span

              className="inline-flex items-center gap-2 bg-red-100 text-[#C41430] px-4 py-1.5 rounded-full text-sm sm:text-sm font-semibold uppercase tracking-wider mb-4"
            >
              <span className="w-1.5 h-1.5 bg-red-500 uppercase rounded-full"></span>
              {homePageDetails?.sections[9]?.content?.label}
            </span>

            {/* Main Heading */}
            <h2

              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#C41430] leading-tight  mb-6"
            >
              {homePageDetails?.sections[9]?.content?.title}
            </h2>

            {/* Subtext */}
            <p

              className="text-sm sm:text-base md:text-base text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: homePageDetails?.sections[9]?.content?.subTitle
              }}
            >

            </p>
          </div>

          {/* Location Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
            {homePageDetails?.sections[9]?.content?.cities?.map((loc: any, index: number) => {
              const IconComponent = Icons[loc.icon] || Icons.Target; // Fallback to a default icon if not found
              return (
                <Link href={`/${loc?.slug}`}>
                  <div
                    key={index}

                    className={`
                flex flex-col items-center justify-center text-center p-5 sm:p-6 rounded-2xl transition-all duration-300 cursor-pointer border
                ${index === homePageDetails?.sections[9]?.content?.cities?.length - 1
                        ? 'bg-[#D71635] border-[#064E3B] text-white shadow-lg shadow-red-900/20'
                        : 'bg-white border-gray-200 hover:border-[#C41430] hover:shadow-md text-gray-900'
                      }
              `}
                  >
                    <div className={`mb-3 ${index === homePageDetails?.sections[9]?.content?.cities?.length - 1 ? 'text-white' : 'text-[#C41430]'}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>

                    <h3 className="text-base sm:text-lg font-bold mb-1">
                      {loc.name}
                    </h3>

                    <p className={`text-sm sm:text-base leading-snug ${index ===  homePageDetails?.sections[9]?.content?.cities?.length - 1 ? 'text-white' : 'text-gray-500'}`} dangerouslySetInnerHTML={{
                      __html: loc.description
                    }}>

                    </p>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* SEO Text Block with Side Border */}
          <div

            className="border-l-4 border-[#C41430] pl-4 md:pl-6 py-2"
          >
            <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium text-justify" dangerouslySetInnerHTML={
              { __html: homePageDetails?.sections[9]?.content?.sectiondescription }
            }>

            </p>
          </div>

        </div>
      </section>

      <LandingPage content={homePageDetails?.sections[10]?.content} />

















      {/* Test Preparation Section */}
      {/* <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12 border-b-2 border-gray-200 pb-4">
            Test Preparation
          </h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 ">
            <TestPreparation CourseData={CourseData?.page} />
          </div>
        </div>
      </section> */}

      <section className="py-12 bg-pink-100 px-5" id="process">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Left Column: Process Timeline */}
            <div className="w-full lg:w-[67%]">

              {/* Header */}
              <div className="mb-8">

                <h2 className="text-2xl lg:text-4xl max-w-3xl font-bold text-gray-800 !leading-[1.3] mb-4">
                  {highlightText("How Gateway Abroad Helps || To Achieve Your Dream Destination || — End to End")}
                </h2>

                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  From your first free consultation to your flight to the Destination — we manage every step with precision and care.
                </p>
              </div>



              {/* Timeline */}
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-[#012169] to-red-500 hidden lg:block" />

                <div className="space-y-2">
                  {processSteps.map((item, index) => {
                    const isActive = activeStep === index;

                    return (
                      <div
                        key={index}
                        className={`relative flex gap-4 lg:gap-6 group cursor-pointer transition-all duration-300 ${isActive ? "scale-[1.01]" : ""
                          }`}
                        onMouseEnter={() => setActiveStep(index)}
                        onMouseLeave={() => setActiveStep(null)}
                      >
                        {/* Step Number Dot */}
                        <div className="relative z-10 flex-shrink-0">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm border-4 border-white shadow-lg transition-all duration-300 ${isActive
                              ? item?.color + " text-white scale-110"
                              : "bg-white text-gray-400 border-gray-200 group-hover:border-red-300"
                              }`}
                          >
                            {item?.icon}
                          </div>
                        </div>

                        {/* Content Card */}
                        <div
                          className={`flex-1 relative bg-white shadow-md border rounded-xl p-5 pt-6 overflow-hidden transition-all duration-300 ${isActive
                            ? "border-red-300 shadow-lg shadow-red-100/50"
                            : "border-gray-200 hover:border-red-200 hover:shadow-md"
                            }`}
                        >
                          {/* Tag */}
                          <span className="absolute top-0 right-0 px-2 py-1 bg-red-600 inline-block text-sm sm:text-[9px] font-bold uppercase text-white rounded-bl-xl">
                            {item?.tag}
                          </span>

                          {/* Title */}
                          <h3
                            className={`font-bold text-base lg:text-lg mb-2 transition-colors duration-300 ${isActive
                              ? "text-gray-900"
                              : "text-gray-700 group-hover:text-gray-900"
                              }`}
                          >
                            {item?.title}
                          </h3>

                          {/* Description */}
                          <p
                            className={`text-sm font-medium leading-relaxed transition-colors duration-300 ${isActive ? "text-gray-700" : "text-gray-500"
                              }`}
                          >
                            {item?.description}
                          </p>
                        </div>

                        {/* Hover Glow */}
                        <div
                          className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item?.color
                            }/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="w-full lg:w-[33%]">
              <div className="sticky top-24 space-y-4">


                <ContactForm />


                {/* Contact Info Card */}
                <div className="bg-pink-50 border border-red-600 rounded-xl p-5 text-center">
                  <p className="text-gray-600 text-sm uppercase font-bold mb-2">
                    Call / WhatsApp
                  </p>
                  <a
                    href="tel:+918302092630"
                    className=" text-sm lg:text-2xl font-black text-[#C9A84C] block hover:text-[#EDD68A] transition-colors"
                  >
                    +91 8302092630
                  </a>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-red-50 to-amber-50 border border-red-100 rounded-xl p-5">
                  <h3 className="font-bold text-gray-800 mb-3 text-sm">Why Choose Gateway Abroad?</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      16+ Years Experience
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      500+ Students Placed in UK
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      96% Visa Success Rate
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      Russell Group Specialists
                    </li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* YouTube Testimonials Section */}
      <section className="py-12 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-left mb-12 border-b-2 border-gray-200 pb-4">
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
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gray-400/10 z-1"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div

            className="mb-10 sm:mb-12 lg:mb-16"
          >
            <div

              className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-4 sm:mb-6"
            >
              <span className="text-[#C41430] font-bold text-sm sm:text-sm tracking-wider uppercase">
                {homePageDetails?.sections[8]?.content?.label}
              </span>
            </div>

            <h2
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"

            >
              {homePageDetails?.sections[8]?.content?.title}
            </h2>

            <p
              className="text-gray-600 text-base sm:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: homePageDetails?.sections[8]?.content?.subTitle }}
            >

            </p>
          </div>

          {(!testimonials?.testimonial || testimonials.testimonial.length === 0) ? (
            <div className="text-center text-gray-500 py-8">Loading testimonials...</div>
          ) : (
            <div className="relative group">
              <div ref={testimonialRef} className="keen-slider">
                {testimonials.testimonial.map((test, idx) => {

                  return (
                    <div key={test._id} className="keen-slider__slide p-2 pb-6">
                      <div className="relative bg-white box-border caret-transparent z-0 ml-[30px] rounded-3xl md:ml-[50px] shadow-lg before:accent-auto before:border-b-gray-200 before:box-border before:caret-transparent before:text-neutral-800 before:block before:text-base before:not-italic before:normal-nums before:font-normal before:h-0 before:left-[-35px] before:tracking-[normal] before:leading-6 before:list-outside before:list-disc before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-0 before:z-[-1] before:border-t-white before:border-t-[25px] before:border-x-transparent before:border-x-[50px] before:border-separate before:border-solid before:top-0 before:font-noto_sans before:md:left-[-50px] before:md:border-t-[55px] before:md:border-x-[80px]">

                        <div className="box-border caret-transparent pt-5 px-5 md:pt-[35px] md:px-[30px]">

                          {/* Header */}
                          <div className="items-center box-border caret-transparent flex justify-between">
                            <p className="text-gray-700 text-lg font-bold box-border caret-transparent leading-tight mb-2">
                              {test.name}
                            </p>

                            <ul className="box-border caret-transparent flex leading-[normal] list-none mb-4 pl-0">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <li key={star} className="text-amber-400 text-lg box-border caret-transparent">
                                  <span className="text-yellow-400 text-lg">★</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Content */}
                          <div>
                            <p
                              className="text-zinc-500 text-sm font-medium box-border caret-transparent 
        max-w-full text-left mb-14   
        overflow-hidden line-clamp-3"
                            >
                              {test.content}
                            </p>

                            {/* Tags */}
                            <div className='flex justify-between mb-4'>
                              <span className="px-4 py-2 mt-2 rounded-full text-sm font-semibold bg-red-500 text-white">
                                {test?.univercity}
                              </span>
                              <span className="inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-700">
                                {test?.type}
                              </span>
                            </div>


                          </div>

                        </div>

                        {/* Footer */}
                        <div className="bg-red-600 box-border caret-transparent px-5 py-3.5 rounded-b-3xl md:px-[30px]"></div>

                      </div>
                    </div>
                  )
                })}
              </div>


            </div>
          )}
          <div
            // Responsive spacing & layout
            className="mt-6 sm:mt-8 md:mt-10 bg-gradient-to-r from-[#FF1D45] to-red-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center text-center md:text-left gap-4 sm:gap-6 shadow-xl"
          >
            {/* Content Section - stacked on mobile, row on desktop */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 w-full">

              {/* Icon Container - minimum touch target */}
              <div className="flex-shrink-0 bg-white/10 p-2.5 sm:p-3 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Icons.BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
              </div>

              {/* Text Content - minimum font sizes enforced */}
              <div className="flex-1">
                {/* Minimum heading: text-sm (14px) on mobile */}
                <p className="text-white text-sm sm:text-base md:text-lg font-semibold mb-0.5 sm:mb-1 leading-tight">
                  Want results like these?
                </p>
                {/* Minimum body: text-sm (12px) on mobile */}
                <p className="text-gray-300 text-sm sm:text-sm md:text-base leading-relaxed">
                  Our coaches know exactly what it takes to crack your exam.
                </p>
              </div>
            </div>

            {/* Buttons Section - full width on mobile, inline on desktop */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleGetStarted}
                // Primary button: full-width mobile, min 44px touch target
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-gray-900 font-bold text-sm sm:text-base px-4 sm:px-6 py-3 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg min-h-[44px] flex items-center justify-center whitespace-nowrap"
              >
                🎯 Get in Touch
              </button>
              <a
                href={`tel:${contactNumber}`}
                // Secondary button: same responsive treatment
                className="w-full sm:w-auto border-2 border-white/30 hover:border-amber-400 active:border-amber-500 text-white font-semibold text-sm sm:text-base px-4 sm:px-6 py-3 rounded-full transition-all min-h-[44px] flex items-center justify-center whitespace-nowrap"
              >
                📞 Call Our Expert
              </a>
            </div>
          </div>
        </div>


      </section>
      {/* Blog Section */}
      <section className="py-12 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center ">
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

      <FAQSection content={homePageDetails?.sections[11]?.content} faq={faqdata} />


      {/* ====== Partner Section ====== */}
      <section className="py-12 md:py-12 bg-white">
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
                      onClick={handleGetStarted}
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
                      loading='lazy'
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


