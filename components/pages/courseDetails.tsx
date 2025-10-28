'use client'; // This component uses client-side features like useState, useEffect, useRef

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation'; // For navigation and getting pathname
import Slider from 'react-slick';

import { testimonialSlider } from '@/custom/custom'; // Adjust path as needed
import PageServices from '@/services/PageServices'; // Adjust path as needed
import useAsync from '@/hooks/useAsync'; // Adjust path as needed
import { constant } from '@/constant/index.constant'; // Adjust path as needed
import { useForm } from 'react-hook-form'; // Import useForm
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Course = () => { // Receive params from Next.js
  const router = useRouter(); // Use useRouter for navigation
  const params = useParams(); // Get params using useParams
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
  const marqueeRef = useRef(null);

  // --- Initialize react-hook-form for the modal form ---
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
      } else {
        console.log('something went wrong');
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
      } else {
        console.log('something went wrong');
      }
    } catch (error) {
      console.error('Error fetching testimonial data:', error);
    }
  };

  // --- Updated form submission handler using react-hook-form data ---
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
        router.push('/thank-you'); // Use router.push for navigation
      } else {
        console.error('Submission failed:', createJob);
        alert('Something went wrong during submission.');
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert('An error occurred. Please try again.');
    }
  };
  // --- End updated handler ---

  const handledownload = async (value) => {
    if (formSubmitted) {
      window.open(value, '_blank');
    } else {
      setShowModal(true);
    }
  };

  const getColSize = () => {
    if (courseName === 'PTE') {
      return 'col-lg-4 col-sm-6';
    } else if (courseName === 'SAT') {
      return 'col-lg-6 col-sm-6';
    } else if (courseName === 'GRE') {
      return 'col-lg-4 col-sm-6';
    } else {
      return 'col-lg-3 col-sm-6';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!course) return; // Guard clause if course isn't available yet

      try {
        const response = await PageServices.getCourseByName(course.toUpperCase());
        if (response.status === 'success') {
          setCourseName(response.data.page.pageName || '');
          setDescription(response.data.page.description || '');
          setCourseData(response.data.page || {});
          getAllfaqData(response.data.page.pageName);
          getAllTestimonial(response.data.page.pageName);
        } else {
          router.push(`/`); // Redirect on error
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        router.push(`/`); // Redirect on error
      }
    };
    fetchData();
  }, [course, router]); // Added router to dependency array

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



  return (
    <div>
      <section className="hero-gradient min-h-screen section-padding relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500 rounded-full animate-bounce-slow"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-green-500 rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse-slow"></div>
        </div>

        <div className="container-sm mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 pt-12 items-center">
            <div className="space-y-6">
              <div className="animate-fadeInLeft">
                <h1 className="text-gradient text-3xl lg:text-[2.6rem] font-bold pb-3 leading-[1.2]">
                  {courseData?.textFild}
                </h1>
                <h1> </h1>
                <p className="text-base text-justify text-gray-600 leading-relaxed">
                  {courseData.textFild2}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-fadeInLeft animate-stagger-2">
                <Link href="/contact" className="btn-primary">
                  Enroll Now
                </Link>
              </div>
            </div>

            <div className="animate-fadeInRight">
              <div className="relative">
                <Image
                  src={courseData.image2 ? `${constant.REACT_APP_URL}/uploads/${courseData.image2}` : "/placeholder.svg?height=500&width=600"}
                  alt="IELTS Preparation"
                  width={450}
                  height={500}
                  className="rounded-2xl shadow-xl animate-float"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-green-500 text-white p-3 rounded-full animate-bounce-slow">
                  <Star className="h-6 w-6" />
                </div>
              </div>
              {/* Background circle with pulse animation */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-200 bg-opacity-30 rounded-full animate-pulse-slow -z-10"></div>

              {/* Additional decorative elements */}
              <div className="absolute top-30 -right-4 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce-slow"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse-slow"></div>
            </div>

          </div>
        </div>

      </section>

      <section>
        <marquee
          ref={marqueeRef}
          className="marquee-product marquee-product-2"
          behavior="alternate"
          direction="left"
          // scrollAmount={5}
          onMouseEnter={() => marqueeRef.current?.stop()}
          onMouseLeave={() => marqueeRef.current?.start()}
        >
          {sliderData.map((e) => (
            <small id="studentname" key={e._id || e.id}>
              {e.name} {e.courseName} <small id="studentscores">{e.rank}</small>
            </small>
          ))}
        </marquee>
      </section>

      {/* ======== hero section end ===== */}

      {/* ======== GMAT overview section start ===== */}
      <section className="gmat-overview-sec py-70">
        <div className="container">
          <div className="gmat-overview-inner">
            <div className="row align-items-center">
              <div className="col-md-5">
                <div className="about-us-left-new gmat-test-pre-left">
                  <img
                    src={courseData.image3 ? `${constant.REACT_APP_URL}/uploads/${courseData.image3}` : '/placeholder-image.jpg'}
                    alt={`${courseName} Overview`}
                  />
                </div>
              </div>
              <div className="col-md-7">
                <div className="about-us-right-new ps-3 gmat-test-pre-right">
                  <h2 className="heading">What is {courseName}?</h2>
                  <p style={{ textAlign: "left" }} className="descp mb-3">{description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="gmat-descp-sec">
            <h2 className="heading text-center d-block">What is on the {courseName}?</h2>
            <div className="row gy-4 justify-content-center">
              <div className={getColSize()}>
                <div className="gmat-desc-card">
                  <div className="gmat-desc-card-icon">
                    <img src="/img/gmat-descp-img-1.svg" alt="gmat-icon" />
                  </div>
                  <div className="gmat-desc-card-body">
                    <h5>{courseData.whatIsOn?.one ? first(courseData.whatIsOn.one) : ''}</h5>
                    <p>{courseData.whatIsOn?.one ? second(courseData.whatIsOn.one) : ''}</p>
                  </div>
                </div>
              </div>
              <div className={getColSize()}>
                <div className="gmat-desc-card">
                  <div className="gmat-desc-card-icon">
                    <img src="/img/gmat-descp-img-2.svg" alt="gmat-icon" />
                  </div>
                  <div className="gmat-desc-card-body">
                    <h5>{courseData.whatIsOn?.two ? first(courseData.whatIsOn.two) : ''}</h5>
                    <p>{courseData.whatIsOn?.two ? second(courseData.whatIsOn.two) : ''}</p>
                  </div>
                </div>
              </div>
              {courseData?.whatIsOn?.three && (
                <div className={getColSize()}>
                  <div className="gmat-desc-card">
                    <div className="gmat-desc-card-icon">
                      <img src="/img/gmat-descp-img-3.svg" alt="gmat-icon" />
                    </div>
                    <div className="gmat-desc-card-body">
                      <h5>{courseData.whatIsOn?.three ? first(courseData.whatIsOn.three) : ''}</h5>
                      <p>{courseData.whatIsOn?.three ? second(courseData.whatIsOn.three) : ''}</p>
                    </div>
                  </div>
                </div>
              )}
              {courseData?.whatIsOn?.four && (
                <div className={getColSize()}>
                  <div className="gmat-desc-card">
                    <div className="gmat-desc-card-icon">
                      <img src="/img/gmat-descp-img-4.svg" alt="gmat-icon" />
                    </div>
                    <div className="gmat-desc-card-body">
                      <h5>{courseData.whatIsOn?.four ? first(courseData.whatIsOn.four) : ''}</h5>
                      <p>{courseData.whatIsOn?.four ? second(courseData.whatIsOn.four) : ''}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* ======== GMAT overview section end ===== */}

      {/* ======== Country Accept section start ===== */}
      <section className="country-accept-gmat-section py-60">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="country-accept-gmat-left">
                {/* Use conditional rendering for images */}
                {courseName === "GMAT" && <img src="/img/country-gmat_480.png" alt="GMAT Countries" />}
                {courseName === "PTE" && <img src="/img/country-pte_480.png" alt="PTE Countries" />}
                {courseName === "SAT" && <img src="/img/country-sat_480.png" alt="SAT Countries" />}
                {courseName === "GRE" && <img src="/img/country-gre_480.png" alt="GRE Countries" />}
                {courseName === "IELTS" && <img src="/img/country-ielts_480.png" alt="IELTS Countries" />}
                {courseName === "TOEFL" && <img src="/img/country-toefl_480.png" alt="TOEFL Countries" />}
                {courseName === "DUOLINGO" && <img src="https://www.gatewayabroadeducations.com/uploads/1f3013da2ed4.jpg" alt="TOEFL Countries" />}
                {/* Optional: Default image if none match */}
                {!["GMAT", "PTE", "SAT", "GRE", "IELTS", "TOEFL","DUOLINGO"].includes(courseName) && (
                  <img src="/img/default-countries.png" alt="Countries" />
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="country-accept-gmat-right">
                <h2 className="heading">Countries Accepting {courseName} Scores</h2>
                <p style={{ textAlign: "left" }} className="descp">{courseName} is accepted in {courseData?.acceptedCountrie || 'various'} countries around the world.</p>
                <h6>Some of the popular countries accepting {courseName} scores are as follows:</h6>
                <div className="country-accept-list">
                  <ul className="list-unstyled">
                    <li>USA</li>
                    <li>United Kingdom</li>
                    <li>Australia</li>
                    <li>Canada</li>
                    <li>Germany</li>
                    <li>New Zealand</li>
                    <li>France</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ======== Country Accept section end ===== */}

      {/* ======== Why choose Gateway section start ===== */}
      <section className="why-choose-ga py-60">
        <div className="container">
          <h2 className="heading text-center d-block">Why Choose Gateway Abroad for {courseName} Test Prep?</h2>
          <div className="row pt-4 gy-4">
            <div className="col-lg-4 col-sm-6">
              <div className="why-choose-ga-feature-box">
                <div className="why-choose-ga-feature-box-icon">
                  <img src="/img/why-choose-ga-img-1.svg" alt="why-choose-ga-img" />
                </div>
                <p>{courseData?.whyChoose?.one || 'Feature description coming soon.'}</p>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="why-choose-ga-feature-box">
                <div className="why-choose-ga-feature-box-icon">
                  <img src="/img/why-choose-ga-img-2.svg" alt="why-choose-ga-img" />
                </div>
                <p>{courseData?.whyChoose?.two || 'Feature description coming soon.'}</p>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="why-choose-ga-feature-box">
                <div className="why-choose-ga-feature-box-icon">
                  <img src="/img/why-choose-ga-img-3.svg" alt="why-choose-ga-img" />
                </div>
                <p>{courseData?.whyChoose?.three || 'Feature description coming soon.'}</p>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="why-choose-ga-feature-box">
                <div className="why-choose-ga-feature-box-icon">
                  <img src="/img/why-choose-ga-img-4.svg" alt="why-choose-ga-img" />
                </div>
                <p>{courseData?.whyChoose?.four || 'Feature description coming soon.'}</p>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="why-choose-ga-feature-box">
                <div className="why-choose-ga-feature-box-icon">
                  <img src="/img/why-choose-ga-img-5.svg" alt="why-choose-ga-img" />
                </div>
                <p>{courseData?.whyChoose?.five || 'Feature description coming soon.'}</p>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="why-choose-ga-feature-box">
                <div className="why-choose-ga-feature-box-icon">
                  <img src="/img/why-choose-ga-img-6.svg" alt="why-choose-ga-img" />
                </div>
                <p>{courseData?.whyChoose?.six || 'Feature description coming soon.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ======== Why choose Gateway section end ===== */}

      {/* ========brochure section start ===== */}
      <section className="brochure-section py-70">
        <div className="container">
          <div className="brochure-section-inner">
            <div className="row align-items-center">
              <div className="col-lg-9">
                <div className="brochure-content-left">
                  <h2 className="heading text-white mb-lg-0">Ready, set, knowledge! Download our brochure and get started.</h2>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="brochure-download-btn">
                  {/* Conditional download links */}
                  {courseName === "GMAT" && (
                    <a href="javascript:void(0);" className="brochure-download-btn" onClick={() => handledownload('/brosher/GMAT.pdf')}>
                      Download
                    </a>
                  )}
                  {courseName === "PTE" && (
                    <a href="javascript:void(0);" className="brochure-download-btn" onClick={() => handledownload('/brosher/PTE.pdf')}>
                      Download
                    </a>
                  )}
                  {courseName === "SAT" && (
                    <a href="javascript:void(0);" className="brochure-download-btn" onClick={() => handledownload('/brosher/SAT.pdf')}>
                      Download
                    </a>
                  )}
                  {courseName === "GRE" && (
                    <a href="javascript:void(0);" className="brochure-download-btn" onClick={() => handledownload('/brosher/GRE.pdf')}>
                      Download
                    </a>
                  )}
                  {courseName === "IELTS" && (
                    <a href="javascript:void(0);" className="brochure-download-btn" onClick={() => handledownload('/brosher/IELTS.pdf')}>
                      Download
                    </a>
                  )}
                  {courseName === "TOEFL" && (
                    <a href="javascript:void(0);" className="brochure-download-btn" onClick={() => handledownload('/brosher/TOEFL.pdf')}>
                      Download
                    </a>
                  )}
                  {/* Optional: Default button if none match */}
                  {!["GMAT", "PTE", "SAT", "GRE", "IELTS", "TOEFL"].includes(courseName) && (
                    <button className="brochure-download-btn" disabled>
                      Brochure Coming Soon
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ========brochure section end ===== */}

      {/* ======== Our Testimonials section start ===== */}
      <section className="our-testimonials py-70 gmat-testimonials">
        <div className="container">
          <h2 className="heading text-center d-block">What Our {courseName} Prep Achievers Say</h2>
          {testimonials.length === 1 ? (
            <div className="our-testimonials-slider-inner single-testmonial">
              <div className="student-test-box">
                <div className="stundent-content">
                  <div className="d-flex align-items-center justify-content-between">
                    <h6>{testimonials[0].name}</h6>
                    <ul className="list-unstyled d-flex">
                      <li>
                        <span>
                          <i className="fa fa-star" />
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="fa fa-star" />
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="fa fa-star" />
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="fa fa-star" />
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="fa fa-star" />
                        </span>
                      </li>
                    </ul>
                  </div>
                  <p style={{ textAlign: "left" }} className="descp">{testimonials[0].content?.substring(0, 250) || 'No testimonial content available.'}</p>
                </div>
                <div className="test-univ-sec"></div>
              </div>
            </div>
          ) : (
            <Slider {...testimonialSlider} className="our-testimonials-slider">
              {testimonials.map((test) => (
                <div className="our-testimonials-slider-inner" key={test.id || test._id}>
                  <div className="student-test-box">
                    <div className="stundent-content">
                      <div className="d-flex align-items-center justify-content-between">
                        <h6>{test.name}</h6>
                        <ul className="list-unstyled d-flex">
                          <li>
                            <span>
                              <i className="fa fa-star" />
                            </span>
                          </li>
                          <li>
                            <span>
                              <i className="fa fa-star" />
                            </span>
                          </li>
                          <li>
                            <span>
                              <i className="fa fa-star" />
                            </span>
                          </li>
                          <li>
                            <span>
                              <i className="fa fa-star" />
                            </span>
                          </li>
                          <li>
                            <span>
                              <i className="fa fa-star" />
                            </span>
                          </li>
                        </ul>
                      </div>
                      <p style={{ textAlign: "left" }} className="descp">{test.content?.substring(0, 250) || 'No testimonial content available.'}</p>
                    </div>
                    <div className="test-univ-sec"></div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </section>
      {/* ======== Our Testimonials section end ===== */}

      {/* ======== Pricing Plan section start ===== */}
      <section className="pricing-plan-section py-70 linear-bg">
        <div className="container">
          <div className="price-title">
            <h2 className="heading mb-2">Plans &amp; Pricing</h2>
            <p style={{ textAlign: "left" }} className="descp">We are accepting PayPal, Paytm, PhonePe and Debit &amp; Credit Card</p>
          </div>
          <div className="pricing-plan-section-inner">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6">
                <div className="pricing-card">
                  <h5 className="plan-name">Classroom training</h5>
                  <div className="plan-offer-list">
                    <ul className="list-unstyled">
                      <li>
                        Gateway Abroad Jaipur empowers you to achieve your {courseName} goals with top-notch instructors. They provide
                        in-person guidance through a comprehensive offline preparation program.
                      </li>
                      <li>
                        Don't let academic hurdles hold you back from achieving success. Conquer the {courseName} exam entirely offline and
                        unlock the door to a thriving academic journey.
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <button // Changed to button, handle modal opening differently if needed
                      className="choose-plan-btn site-btn"
                      onClick={() => setShowModal(true)} // Open modal on click
                    >
                      Choose Plan
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="pricing-card">
                  <h5 className="plan-name">Live online training</h5>
                  <div className="plan-offer-list">
                    <ul className="list-unstyled">
                      <li>
                        Level Up Your Scores: Anytime, Anywhere. Conquer standardized tests from the comfort of your home with our
                        interactive online prep courses
                      </li>
                      <li>
                        Our flexible online classes and dedicated support ensure you can progress at your own pace, tailoring your learning
                        journey to your busy schedule.
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <button
                      className="choose-plan-btn site-btn"
                      onClick={() => setShowModal(true)} // Open modal on click
                    >
                      Choose Plan
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="pricing-card most-popular-card">
                  <div className="most-p-btn-outer">
                    <button className="most-p-btn">Most Popular</button>
                  </div>
                  <h5 className="plan-name">Hybrid</h5>
                  <div className="plan-offer-list">
                    <ul className="list-unstyled">
                      <li>
                        Get the best of both worlds with our hybrid courses - the flexibility of online learning combined with the
                        personalized support of in-person instruction!
                      </li>
                      <li>
                        Why choose between online convenience and offline expertise when you can have both? Experience the ultimate exam
                        prep fusion with our hybrid courses!
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <button
                      className="choose-plan-btn site-btn"
                      onClick={() => setShowModal(true)} // Open modal on click
                    >
                      Choose Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ======== Pricing Plan section end ===== */}

      {/* ======== Test Prep Resource section start ===== */}
      <section className="test-prep-resource-sec py-70">
        <div className="container">
          <h2 className="heading text-center d-block">Free {courseName} Prep Resources</h2>
          <div className="row gy-3 pt-4 justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div className="test-prep-resource-card">
                <div className="test-prep-resource-card-img">
                  <img src="/img/resource-img-1.svg" alt="Practice Material" />
                </div>
                <div className="test-prep-resource-card-body">
                  <h4>Practice Material</h4>
                  <p>Take the {courseName} practice material and begin your {courseName} preparation now</p>
                  <div className="text-center">
                    {/* Conditional Practice Material links */}
                    {courseName === "GMAT" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("https://drive.google.com/drive/folders/1tqPuj-HBYnHX6A-hB71Aq9gsG4QfoZZ3")}
                        className="resource-red-btn"
                      >
                        Take GMAT Practice Material
                      </a>
                    )}
                    {courseName === "PTE" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("https://drive.google.com/drive/folders/1kM7xUBIZacJM82FteV-SlkwWMtMlTyBM")}
                        className="resource-red-btn"
                      >
                        Take PTE Practice Material
                      </a>
                    )}
                    {courseName === "SAT" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("https://drive.google.com/drive/folders/1OYM497cr2lVjqLsRA8S1m9Ho_EduSBmW")}
                        className="resource-red-btn"
                      >
                        Take SAT Practice Material
                      </a>
                    )}
                    {courseName === "GRE" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("https://drive.google.com/drive/folders/1vY4eXSz0E5V5Qtrr_LbwKjl7vCedqaCE")}
                        className="resource-red-btn"
                      >
                        Take GRE Practice Material
                      </a>
                    )}
                    {courseName === "IELTS" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("https://drive.google.com/drive/folders/1WlxtWu5A2eRlcDswTj0UFJtpp8LHOJwI")}
                        className="resource-red-btn"
                      >
                        Take IELTS Practice Material
                      </a>
                    )}
                    {courseName === "TOEFL" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("https://drive.google.com/drive/folders/1GdcyZq-o831I1zeHaG9w9KlH9z3QLSiy")}
                        className="resource-red-btn"
                      >
                        Take TOEFL Practice Material
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="test-prep-resource-card">
                <div className="test-prep-resource-card-img">
                  <img src="/img/resource-img-2.svg" alt="Other Resources" />
                </div>
                <div className="test-prep-resource-card-body">
                  <h4>Other Resources</h4>
                  <p>
                    Begin your {courseName} coaching with this other resources prepared by our experts to help you with your {courseName}{' '}
                    prep
                  </p>
                  <div className="text-center">
                    {/* Conditional Other Resources links */}
                    {courseName === "GMAT" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("/courseRes/GMAT.pdf")}
                        className="resource-red-btn"
                      >
                        Download GMAT Other Resources
                      </a>
                    )}
                    {courseName === "PTE" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("/courseRes/PTE.pdf")}
                        className="resource-red-btn"
                      >
                        Download PTE Other Resources
                      </a>
                    )}
                    {courseName === "SAT" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("/courseRes/SAT.pdf")}
                        className="resource-red-btn"
                      >
                        Download SAT Other Resources
                      </a>
                    )}
                    {courseName === "GRE" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("/courseRes/GRE.pdf")}
                        className="resource-red-btn"
                      >
                        Download GRE Other Resources
                      </a>
                    )}
                    {courseName === "IELTS" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("https://drive.google.com/drive/folders/1woaEMonJQbQlpco2Ksnc52oC46HLtTHF")}
                        className="resource-red-btn"
                      >
                        Download IELTS Other Resources
                      </a>
                    )}
                    {courseName === "TOEFL" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("https://drive.google.com/drive/folders/1woaEMonJQbQlpco2Ksnc52oC46HLtTHF")}
                        className="resource-red-btn"
                      >
                        Download TOEFL Other Resources
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="test-prep-resource-card">
                <div className="test-prep-resource-card-img">
                  <img src="/img/resource-img-3.svg" alt="Syllabus Download" />
                </div>
                <div className="test-prep-resource-card-body">
                  <h4>Syllabus Download</h4>
                  <p>Download the {courseName} syllabus now and get a head start on your {courseName} preparation</p>
                  <div className="text-center">
                    {/* Conditional Syllabus links */}
                    {courseName === "GMAT" && (
                      <a
                        href="javascript:void(0);"
                        className="resource-red-btn"
                        onClick={() => handledownload("/Syllabus/GMATsyllabus.pdf")}
                      >
                        Download GMAT Syllabus
                      </a>
                    )}
                    {courseName === "PTE" && (
                      <a
                        href="javascript:void(0);"
                        className="resource-red-btn"
                        onClick={() => handledownload("/Syllabus/PTEsyllabus.pdf")}
                      >
                        Download PTE Syllabus
                      </a>
                    )}
                    {courseName === "SAT" && (
                      <a
                        href="javascript:void(0);"
                        className="resource-red-btn"
                        onClick={() => handledownload("/Syllabus/SATsyllabus.pdf")}
                      >
                        Download SAT Syllabus
                      </a>
                    )}
                    {courseName === "GRE" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("/Syllabus/GREsyllabus.pdf")}
                        className="resource-red-btn"
                      >
                        Download GRE Syllabus
                      </a>
                    )}
                    {courseName === "IELTS" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("/Syllabus/IELTSsyllabus.pdf")}
                        className="resource-red-btn"
                      >
                        Download IELTS Syllabus
                      </a>
                    )}
                    {courseName === "TOEFL" && (
                      <a
                        href="javascript:void(0);"
                        onClick={() => handledownload("/Syllabus/TOEFLsyllabus.pdf")}
                        className="resource-red-btn"
                      >
                        Download TOEFL Syllabus
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ======== Test Prep Resource section end ===== */}

      {/* ======== FAQs section start ===== */}
      <section className="faq-section py-70">
        <div className="container">
          <div className="title text-center mb-5">
            <h2 className="heading mb-2">Frequently asked questions</h2>
            <p className="descp text-center">Can't find the answer you are looking for?</p>
          </div>
          <div>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((f: any, index: number) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg font-semibold text-left py-2">{f.title}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-3">{f.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      {/* ======== FAQs section end ===== */}

      {/* ======== become partner section start ===== */}
      <section className="app-banner-section counselling-session-sec">
        <div className="container">
          <div className="app-banner-section-inner counselling-session-sec-inner">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="app-banner-content-left">
                  <h2 className="mb-3">Avail A Complementary Counselling Session</h2>
                  <p className="mb-4">Join thousand of instructors and earn money hassle free!</p>
                  <Link className="site-btn" href="/contact">
                    Contact us
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="app-banner-content-right text-center">
                  <img src="/img/counselling-session.svg" alt="Counselling Session" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ======== become partner section end ===== */}

      {/* --- Updated Modal Form using react-hook-form --- */}
      <div
        className={`modal right bg-black/20 fade ${showModal ? 'show' : ''}`}
        style={{ display: showModal ? 'block' : 'none' }}
        id="pdfdownModel"
        tabIndex={-1}
        aria-labelledby="pdfdownModelLabel"
        aria-hidden={!showModal}
        aria-modal={showModal}
      >
        <div className="modal-dialog">
          <div className="modal-content shadow-xl">
            <div className="modal-header">
              <h5 className="modal-title" id="pdfdownModelLabel">
                Get in touch
              </h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="get-in-touch-form">
                <form onSubmit={handleSubmitContact(handlepUpdate)}>
                  <div className="input-field">
                    <input
                      type="text"
                      {...registerContact('name', { required: 'Name is required' })}
                      className={`form-control ${contactErrors.name ? 'is-invalid' : ''}`}
                      placeholder="Name"
                    />
                    {contactErrors.name && <div className="invalid-feedback">{contactErrors.name.message}</div>}
                  </div>
                  <div className="input-field">
                    <input
                      type="email"
                      {...registerContact('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address',
                        },
                      })}
                      className={`form-control ${contactErrors.email ? 'is-invalid' : ''}`}
                      placeholder="Email"
                    />
                    {contactErrors.email && <div className="invalid-feedback">{contactErrors.email.message}</div>}
                  </div>
                  <div className="input-field">
                    <input
                      type="text"
                      {...registerContact('mobile', {
                        required: 'Mobile No. is required',
                        pattern: {
                          value: /^\d{10,15}$/,
                          message: 'Invalid phone number',
                        },
                      })}
                      className={`form-control ${contactErrors.mobile ? 'is-invalid' : ''}`}
                      placeholder="Mobile No."
                    />
                    {contactErrors.mobile && <div className="invalid-feedback">{contactErrors.mobile.message}</div>}
                  </div>
                  <div className="input-field">
                    <input
                      type="text"
                      {...registerContact('city', { required: 'City is required' })}
                      className={`form-control ${contactErrors.city ? 'is-invalid' : ''}`}
                      placeholder="City"
                    />
                    {contactErrors.city && <div className="invalid-feedback">{contactErrors.city.message}</div>}
                  </div>
                  <div className="input-field type-file-field">
                    <textarea
                      {...registerContact('message')}
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      rows={2}
                      placeholder="Message"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    SUBMIT
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* --- End Updated Modal Form --- */}
    </div>
  );
};

export default Course;