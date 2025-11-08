'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import PageServices from '@/services/PageServices';
import useAsync from '@/hooks/useAsync';
import { constant } from '@/constant/index.constant';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Course = () => {
  const router = useRouter();
  const params = useParams();
  const { course } = params;

  const { data: testimonialsData } = useAsync(PageServices.getTestimonial);
  const { data: slider } = useAsync(PageServices.getStudent);

  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [testimonials, setTestimonial] = useState([]);
  const [courseData, setCourseData] = useState({});
  const [faqData, setFaqData] = useState([]);
  const [sliderData, setSliderData] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Keen Slider for testimonials
const [sliderRef, instanceRef] = useKeenSlider({
  loop: true,
  slides: {
    perView: 1,
    spacing: 24, // Adequate spacing between slides
  },
  breakpoints: {
    '(min-width: 768px)': {
      slides: {
        perView: 2,
        spacing: 32, // More spacing for larger screens
      },
    },
  },
  drag: true,
}, [
  (slider) => {
    let interval;
    let mouseOver = false;
    
    function startAutoplay() {
      interval = setInterval(() => {
        if (!mouseOver && slider) {
          slider.next();
        }
      }, 4000);
    }
    
    function stopAutoplay() {
      clearInterval(interval);
    }
    
    startAutoplay();
    
    slider.container.addEventListener('mouseover', () => {
      mouseOver = true;
      stopAutoplay();
    });
    
    slider.container.addEventListener('mouseout', () => {
      mouseOver = false;
      startAutoplay();
    });
    
    slider.on('destroyed', () => {
      stopAutoplay();
    });
  }
]);

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

  const getAllfaqData = async (value) => {
    try {
      const response = await PageServices.getAllFaqForFront(value);
      if (response.status === 'success') {
        setFaqData(response.data.faq || []);
      }
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
    }
  };

  const getAllTestimonial = async (value) => {
    try {
      const response = await PageServices.getTestimonialByCat(value);
      if (response.status === 'success') {
        setTestimonial(response.data.testimonial || []);
      }
    } catch (error) {
      console.error('Error fetching testimonial data:', error);
    }
  };

  const handlepUpdate = async (data) => {
    const { name, email, mobile, city, message } = data;
    try {
      const createJob = await PageServices.createForme({
        name,
        email,
        mobileNo: mobile,
        city,
        message,
        type: 'contact',
      });
      if (createJob.status === 'success') {
        resetContactForm();
        setFormSubmitted(true);
        setShowModal(false);
        router.push('/thank-you');
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert('An error occurred. Please try again.');
    }
  };

  const handledownload = async (value) => {
    if (formSubmitted) {
      window.open(value, '_blank');
    } else {
      setShowModal(true);
    }
  };

  const getColSize = () => {
    if (courseName === 'PTE') {
      return 'md:w-1/2 lg:w-1/3';
    } else if (courseName === 'SAT') {
      return 'md:w-1/2';
    } else if (courseName === 'GRE') {
      return 'md:w-1/2 lg:w-1/3';
    } else {
      return 'md:w-1/2 lg:w-1/4';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!course) return;

      try {
        const response = await PageServices.getCourseByName(course.toUpperCase());
        if (response.status === 'success') {
          setCourseName(response.data.page.pageName || '');
          setDescription(response.data.page.description || '');
          setCourseData(response.data.page || {});
          getAllfaqData(response.data.page.pageName);
          getAllTestimonial(response.data.page.pageName);
        } else {
          router.push(`/`);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        router.push(`/`);
      }
    };
    fetchData();
  }, [course, router]);

  useEffect(() => {
    if (testimonialsData?.data?.testimonial) {
      setTestimonial(testimonialsData.data.testimonial);
    }
    if (slider?.data?.media) {
      setSliderData(slider.data.media);
    }
  }, [testimonialsData, slider]);

  function first(data1) {
    const split = data1.split(':');
    return split[0];
  }

  function second(data1) {
    const split = data1.split(':');
    return split[1];
  }

  const handlePrev = useCallback(() => {
    instanceRef.current?.prev();
  }, [instanceRef]);

  const handleNext = useCallback(() => {
    instanceRef.current?.next();
  }, [instanceRef]);


  return (
    <div>
  {/* Hero Section with responsive fixes */}
<section className="hero-gradient min-h-screen py-12 md:py-20 relative overflow-hidden">
  <div className="absolute inset-0">
    <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500 rounded-full animate-bounce-slow"></div>
    <div className="absolute top-40 right-20 w-6 h-6 bg-green-500 rounded-full animate-float"></div>
    <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse-slow"></div>
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-[9rem] pt-16 md:pt-[85px] items-center">
      <div className="space-y-4 md:space-y-6 text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-red-600 leading-tight break-words">
          {courseData?.textFild}
        </h1>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed break-words">
          {courseData.textFild2}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link href="/contact" className="bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-3 rounded-lg font-semibold transition-colors duration-300 text-center whitespace-nowrap">
            Enroll Now
          </Link>
        </div>
      </div>

      <div className="relative flex justify-center mt-8 md:mt-0">
        <Image
          src={courseData.image2 ? `${constant.REACT_APP_URL}/uploads/${courseData.image2}` : "/placeholder.svg"}
          alt={`${courseName} Preparation`}
          width={500}
          height={400}
          className="rounded-2xl shadow-xl w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px]"
          priority
        />
        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-green-500 text-white p-2 md:p-3 rounded-full">
          <Star className="h-4 w-4 md:h-6 md:w-6" />
        </div>
      </div>
      
    </div>
  </div>
</section>

      {/* Marquee Section */}
      <section className="bg-[#1F1B2D] py-3 ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative ">
            <div
              className="flex space-x-8 marquee-alternate"
              style={{
                '--marquee-duration': '25s',
                '--marquee-direction': 'alternate'
              } as React.CSSProperties}
            >
              {sliderData.map((e) => (
                <div key={e._id || e.id} className="flex-shrink-0 text-white font-medium whitespace-nowrap">
                  {e.name} {e.courseName} <span className="text-red-400 font-bold">{e.rank}</span>
                </div>
              ))}

              {/* Duplicate for seamless loop
        {sliderData.map((e) => (
          <div key={`${e._id}-dup` || `${e.id}-dup`} className="flex-shrink-0 text-white font-medium whitespace-nowrap">
            {e.name} {e.courseName} <span className="text-red-400 font-bold">{e.rank}</span>
          </div>
        ))} */}
            </div>

            <style jsx>{`
        .marquee-alternate {
          animation: marqueeAlternate var(--marquee-duration, 20s) linear infinite var(--marquee-direction, alternate);
        }
        
        .marquee-alternate:hover {
          animation-play-state: paused;
        }
        
        @keyframes marqueeAlternate {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src={courseData.image3 ? `${constant.REACT_APP_URL}/uploads/${courseData.image3}` : '/placeholder-image.jpg'}
                alt={`${courseName} Overview`}
                width={500}
                height={400}
                className="rounded-lg w-[90%]"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What is {courseName}?</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
            </div>
          </div>

          {/* What's on Section */}
<div className="mt-16">
  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
    What is on the {courseName}?
  </h2>
  
  <div className="flex flex-wrap justify-center gap-6">
    {courseData.whatIsOn?.one && (
      <div className="bg-white rounded-lg shadow-[0_0_20px_5px_rgba(0,0,0,0.1)] p-6 border border-gray-200 text-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[300px]">
        <div className="flex items-center justify-center mx-auto mb-4">
          <Image 
            src="/img/gmat-descp-img-1.svg" 
            alt="Icon" 
            width={60} 
            height={60} 
          />
        </div>
        <h5 className="text-lg font-bold text-gray-900 mb-2">
          {first(courseData.whatIsOn.one)}
        </h5>
        <p className="text-black-600 font-bold text-sm">
          {second(courseData.whatIsOn.one)}
        </p>
      </div>
    )}
    
    {courseData.whatIsOn?.two && (
      <div className="bg-white rounded-lg shadow-[0_0_20px_5px_rgba(0,0,0,0.1)] p-6 border border-gray-200 text-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[300px]">
        <div className="flex items-center justify-center mx-auto mb-4">
          <Image 
            src="/img/gmat-descp-img-2.svg" 
            alt="Icon" 
            width={60} 
            height={60} 
          />
        </div>
        <h5 className="text-lg font-bold text-gray-900 mb-2">
          {first(courseData.whatIsOn.two)}
        </h5>
        <p className="text-black-600 font-bold text-sm">
          {second(courseData.whatIsOn.two)}
        </p>
      </div>
    )}
    
    {courseData.whatIsOn?.three && (
      <div className="bg-white rounded-lg shadow-[0_0_20px_5px_rgba(0,0,0,0.1)] p-6 border border-gray-200 text-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[300px]">
        <div className="flex items-center justify-center mx-auto mb-4">
          <Image 
            src="/img/gmat-descp-img-3.svg" 
            alt="Icon" 
            width={60} 
            height={60} 
          />
        </div>
        <h5 className="text-lg font-bold text-gray-900 mb-2">
          {first(courseData.whatIsOn.three)}
        </h5>
        <p className="text-black-600 font-bold text-sm">
          {second(courseData.whatIsOn.three)}
        </p>
      </div>
    )}
    
    {courseData.whatIsOn?.four && (
      <div className="bg-white rounded-lg shadow-[0_0_20px_5px_rgba(0,0,0,0.1)] p-6 border border-gray-200 text-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[300px]">
        <div className="flex items-center justify-center mx-auto mb-4">
          <Image 
            src="/img/gmat-descp-img-4.svg" 
            alt="Icon" 
            width={60} 
            height={60} 
          />
        </div>
        <h5 className="text-lg font-bold text-gray-900 mb-2">
          {first(courseData.whatIsOn.four)}
        </h5>
        <p className="text-black-600 font-bold text-sm">
          {second(courseData.whatIsOn.four)}
        </p>
      </div>
    )}
  </div>
</div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Image Column */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src="/img/country-toefl_480.png"
                  alt={`${courseName} Countries`}
                  className="rounded-lg shadow-lg w-full max-w-md"
                />

              </div>
            </div>

            {/* Content Column */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Countries Accepting {courseName} Scores
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                {courseName} is accepted in 160 countries around the world.
              </p>
              <h6 className="text-lg font-semibold mb-4">
                Some of the popular countries accepting {courseName} scores are as follows:
              </h6>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {['USA', 'United Kingdom', 'Australia', 'Canada', 'Germany', 'New Zealand', 'France'].map((country) => (
                  <div key={country} className="flex items-center text-gray-700">
                    <img
                      src="/img/arrow-up-right.svg"
                      alt="arrow icon"
                      className="w-10 h-[25px] mr-2 text-green-500"
                    />
                    <span>{country}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 md:py-20 bg-[#f5f4f8]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Why Choose Gateway Abroad for {courseName} Test Prep?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              courseData.whyChoose?.[['one', 'two', 'three', 'four', 'five', 'six'][num - 1]] && (
                <div key={num} className="bg-white rounded-lg  p-6  text-center">
                  <div className="w-[90px] h-[90px] bg-[#D71635] rounded-full flex items-center justify-center mx-auto mb-5">
                    <Image src={`/img/why-choose-ga-img-${num}.svg`} alt="Feature" width={60} height={32} />
                  </div>
                  <p className="text-black-600 font-bold">{courseData.whyChoose[['one', 'two', 'three', 'four', 'five', 'six'][num - 1]]}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Brochure Section */}
      <section className="py-1 md:py-10 bg-red-600 max-w-[69rem] mx-auto rounded-[20px] my-[70px]">
        <div className="max-w-7xl mx-auto px-8 ">
          <div className="grid grid-cols-1 lg:grid-cols-3 items-center">
            <div className="lg:col-span-2 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready, set, knowledge! Download our brochure and get started.</h2>
            </div>
            <div className="text-center">
              {courseName && ["GMAT", "PTE", "SAT", "GRE", "IELTS", "TOEFL"].includes(courseName) ? (
                <button
                  onClick={() => handledownload(`/brosher/${courseName}.pdf`)}
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
        />
    </div>
    <div className="absolute inset-0 bg-gray-400/10 z-1"></div>
    <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            What Our {courseName} Prep Achievers Say
        </h2>

        {testimonials.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Loading testimonials...</div>
        ) : (
            <div className="relative group">
                <div ref={sliderRef} className="keen-slider py-4"> {/* Added vertical padding */}
                    {testimonials.map((test, idx) => (
                        <div key={idx} className="keen-slider__slide p-4"> {/* Added padding around each slide */}
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
                                        {test.content?.substring(0, 250) || 'No testimonial content available.'}
                                    </p>
                                </div>
                                <div className="bg-red-600 box-border caret-transparent px-5 py-3.5 rounded-b-3xl md:px-[30px]"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation buttons — only show if more than 1 testimonial */}
                {testimonials.length > 1 && (
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
                )}
            </div>
        )}
    </div>
</section>



   {/* Pricing Section */}
<section className="relative bg-gradient-to-b from-purple-400/20 to-red-600/20  py-12 md:py-20">
  <div className="max-w-7xl mx-auto px-4">
    <div className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">Plans & Pricing</h2>
      <p className="text-zinc-500 font-medium">We are accepting PayPal, Paytm, PhonePe and Debit & Credit Card</p>
    </div>

    <div className="backdrop-blur-lg bg-white/80 shadow-2xl rounded-3xl py-10 px-4 md:px-6 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Classroom Training */}
        <div className="px-4 md:px-6">
          <h5 className="text-2xl md:text-[28px] font-medium text-zinc-700 mb-6">Classroom training</h5>
          <div className="mb-8">
            <ul className="space-y-4 min-h-[200px] md:min-h-[242px]">
              <li className="relative text-neutral-600 font-medium text-justify pl-8 before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:bg-[url('https://www.gatewayabroadeducations.com/_next/static/media/check-circle.532cdb95.svg')] before:bg-cover">
                Gateway Abroad Jaipur empowers you to achieve your {courseName} goals with top-notch instructors. They provide
                in-person guidance through a comprehensive offline preparation program.
              </li>
              <li className="relative text-neutral-600 font-medium text-justify pl-8 before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:bg-[url('https://www.gatewayabroadeducations.com/_next/static/media/check-circle.532cdb95.svg')] before:bg-cover">
                Don't let academic hurdles hold you back from achieving success. Conquer the {courseName} exam entirely offline and
                unlock the door to a thriving academic journey.
              </li>
            </ul>
          </div>
          <div className="text-center">
            <button
              onClick={() => setShowModal(true)}
              className="text-white text-base md:text-lg font-bold bg-red-600 shadow-lg px-12 py-3 rounded-full hover:bg-red-700 transition-colors duration-300"
            >
              Choose Plan
            </button>
          </div>
        </div>

        {/* Live Online Training */}
        <div className="px-4 md:px-6">
          <h5 className="text-2xl md:text-[28px] font-medium text-zinc-700 mb-6">Live online training</h5>
          <div className="mb-8">
            <ul className="space-y-4 min-h-[200px] md:min-h-[242px]">
              <li className="relative text-neutral-600 font-medium text-justify pl-8 before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:bg-[url('https://www.gatewayabroadeducations.com/_next/static/media/check-circle.532cdb95.svg')] before:bg-cover">
                Level Up Your Scores: Anytime, Anywhere. Conquer standardized tests from the comfort of your home with our
                interactive online prep courses.
              </li>
              <li className="relative text-neutral-600 font-medium text-justify pl-8 before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:bg-[url('https://www.gatewayabroadeducations.com/_next/static/media/check-circle.532cdb95.svg')] before:bg-cover">
                Our flexible online classes and dedicated support ensure you can progress at your own pace, tailoring your learning
                journey to your busy schedule.
              </li>
            </ul>
          </div>
          <div className="text-center">
            <button
              onClick={() => setShowModal(true)}
              className="text-white text-base md:text-lg font-bold bg-red-600 shadow-lg px-12 py-3 rounded-full hover:bg-red-700 transition-colors duration-300"
            >
              Choose Plan
            </button>
          </div>
        </div>

        {/* Hybrid - Most Popular */}
        <div className="px-4 md:px-6 bg-red-600 shadow-2xl rounded-3xl p-6 md:p-8 md:-mt-20 relative">
          <div className="text-right mb-4">
            <span className="text-white text-xs font-extrabold bg-zinc-800 tracking-wider px-4 py-2 rounded-full">
              Most Popular
            </span>
          </div>
          <h5 className="text-2xl md:text-[28px] font-medium text-white mb-6">Hybrid</h5>
          <div className="mb-8">
            <ul className="space-y-4 min-h-[200px] md:min-h-[242px]">
              <li className="relative text-white font-medium text-justify pl-8 before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:bg-[url('https://www.gatewayabroadeducations.com/_next/static/media/check-circle-2.3eccd6cf.svg')] before:bg-cover">
                Get the best of both worlds with our hybrid courses - the flexibility of online learning combined with the
                personalized support of in-person instruction!
              </li>
              <li className="relative text-white font-medium text-justify pl-8 before:absolute before:left-0 before:top-0 before:w-5 before:h-5 before:bg-[url('https://www.gatewayabroadeducations.com/_next/static/media/check-circle-2.3eccd6cf.svg')] before:bg-cover">
                Why choose between online convenience and offline expertise when you can have both? Experience the ultimate exam
                prep fusion with our hybrid courses!
              </li>
            </ul>
          </div>
          <div className="text-center">
            <button
              onClick={() => setShowModal(true)}
              className="text-white text-base md:text-lg font-bold bg-black shadow-lg px-12 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300"
            >
              Choose Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

     {/* Test Prep Resources Section */}
<section className="py-12 md:py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Free {courseName} Prep Resources</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Practice Material */}
      <div className="bg-white rounded-2xl shadow-lg p-[1rem] border border-gray-200 text-center">
        <div className=" flex items-center justify-center mx-auto mb-6">
          <Image src="/img/resource-img-1.svg" alt="Practice Material" width={350} height={40} />
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-4">Practice Material</h4>
        <p className="text-gray-600 mb-6">
          Take the {courseName} practice material and begin your {courseName} preparation now
        </p>
        <button
          onClick={() => {
            const links = {
              GMAT: "https://drive.google.com/drive/folders/1tqPuj-HBYnHX6A-hB71Aq9gsG4QfoZZ3",
              PTE: "https://drive.google.com/drive/folders/1kM7xUBIZacJM82FteV-SlkwWMtMlTyBM",
              SAT: "https://drive.google.com/drive/folders/1OYM497cr2lVjqLsRA8S1m9Ho_EduSBmW",
              GRE: "https://drive.google.com/drive/folders/1vY4eXSz0E5V5Qtrr_LbwKjl7vCedqaCE",
              IELTS: "https://drive.google.com/drive/folders/1WlxtWu5A2eRlcDswTj0UFJtpp8LHOJwI",
              TOEFL: "https://drive.google.com/drive/folders/1GdcyZq-o831I1zeHaG9w9KlH9z3QLSiy"
            };
            handledownload(links[courseName] || "#");
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full"
        >
          Take {courseName} Practice Material
        </button>
      </div>

      {/* Other Resources */}
      <div className="bg-white rounded-2xl shadow-lg p-[1rem] border border-gray-200 text-center">
        <div className=" flex items-center justify-center mx-auto mb-6">
          <Image src="/img/resource-img-2.svg" alt="Other Resources" width={350} height={40} />
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-4">Other Resources</h4>
        <p className="text-gray-600 mb-6">
          Begin your {courseName} coaching with this other resources prepared by our experts to help you with your {courseName} prep
        </p>
        <button
          onClick={() => {
            const links = {
              GMAT: "/courseRes/GMAT.pdf",
              PTE: "/courseRes/PTE.pdf",
              SAT: "/courseRes/SAT.pdf",
              GRE: "/courseRes/GRE.pdf",
              IELTS: "https://drive.google.com/drive/folders/1woaEMonJQbQlpco2Ksnc52oC46HLtTHF",
              TOEFL: "https://drive.google.com/drive/folders/1woaEMonJQbQlpco2Ksnc52oC46HLtTHF"
            };
            handledownload(links[courseName] || "#");
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full"
        >
          Download {courseName} Other Resources
        </button>
      </div>

      {/* Syllabus Download */}
      <div className="bg-white rounded-2xl shadow-lg p-[1rem] border border-gray-200 text-center">
        <div className=" flex items-center justify-center mx-auto mb-6">
          <Image src="/img/resource-img-3.svg" alt="Syllabus Download" width={350} height={40} />
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-4">Syllabus Download</h4>
        <p className="text-gray-600 mb-6">
          Download the {courseName} syllabus now and get a head start on your {courseName} preparation
        </p>
        <button
          onClick={() => {
            const links = {
              GMAT: "/Syllabus/GMATsyllabus.pdf",
              PTE: "/Syllabus/PTEsyllabus.pdf",
              SAT: "/Syllabus/SATsyllabus.pdf",
              GRE: "/Syllabus/GREsyllabus.pdf",
              IELTS: "/Syllabus/IELTSsyllabus.pdf",
              TOEFL: "/Syllabus/TOEFLsyllabus.pdf"
            };
            handledownload(links[courseName] || "#");
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full"
        >
          Download {courseName} Syllabus
        </button>
      </div>
    </div>
  </div>
</section>

      {/* FAQ Section */}
      <section className=" py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
            <p className="text-gray-600 text-lg">Can't find the answer you are looking for?</p>
          </div>

          <div className="max-w-7xl mx-auto">
            <Accordion type="single" collapsible className="w-3xl space-y-4">
              {faqData.map((f, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-lg border border-gray-200 px-6"
                >
                  <AccordionTrigger className="text-lg font-semibold py-4 hover:no-underline">
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
              Avail A Complementary Counselling Session
            </h2>
            <p className="text-base sm:text-lg lg:text-[18px] text-[#666276] mb-4 sm:mb-6">
              Join thousand of instructors and earn money hassle free!
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#d71635] hover:bg-[#b5122b] text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-3xl text-sm sm:text-base font-bold shadow-[0_0_8px_0_rgba(0,0,0,0.2)] transition-all duration-300"
            >
              Contact us
            </Link>
          </div>
          <div className="flex justify-center">
            <Image
              src="/img/counselling-session.svg"
              alt="Counselling Session"
              width={400}
              height={300}
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
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmitContact(handlepUpdate)} className="space-y-4">
                <div>
                  <input
                    type="text"
                    {...registerContact('name', { required: 'Name is required' })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${contactErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${contactErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${contactErrors.mobile ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${contactErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
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

export default Course;