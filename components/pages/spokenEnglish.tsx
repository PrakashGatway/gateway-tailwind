"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For App Router
import Slider from 'react-slick';

import { testimonialSlider } from '@/custom/custom'; // Ensure path is correct
import PageServices from '@/services/PageServices'; // Ensure path is correct
import Head from 'next/head'; // For managing head tags
import { constant } from '@/constant/index.constant'; // Ensure path is correct
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from 'next/image';
import { Star } from 'lucide-react';
import { useGlobal } from '@/hooks/AppStateContext';

function SpokenEnglish() {
  const router = useRouter(); // For App Router
  const [testimonials, setTestimonial] = useState([]);
  const [faqData, setFaqData] = useState([]);
  const [activeTab, setActiveTab] = useState<string | null>()

  const { spokenEnglish: spokenEnglishDetails } = useGlobal();

  const getAllfaqData = async (value) => {
    try {
      const response = await PageServices.getAllFaqForFront(value);
      if (response.status === 'success') {
        setFaqData(response.data.faq || [])
      } else {
        console.log('something went wrong');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getAllTestimonial = async (value) => {
    try {
      const response = await PageServices.getTestimonialByCat(value);
      if (response.status === 'success') {
        setTestimonial(response.data.testimonial || [])
      } else {
        console.log('something went wrong');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    setActiveTab(spokenEnglishDetails?.ComponentsLanguage[0]?.section)
  }, [spokenEnglishDetails]);

  useEffect(() => {
    getAllfaqData("spokenEnglish");
    getAllTestimonial("spokenEnglish");
  }, []);

  const sanitizedData = () => ({
    __html: spokenEnglishDetails?.Description || ''
  });

  return (
    <div>
      <section className="hero-gradient min-h-screen section-padding relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-60 left-10 w-4 h-4 bg-blue-500 rounded-full animate-bounce-slow"></div>
          <div className="absolute top-80 right-20 w-6 h-6 bg-green-500 rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse-slow"></div>
        </div>

        <div className="container-sm mx-auto px-12 py-12 mx-auto relative z-2">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 items-center">
            <div className="">
              <div className="animate-fadeInLeft">
                <h1 className="text-3xl lg:text-[2.6rem] font-bold text-gray-900 mb-2 leading-[1.2]">
                  {spokenEnglishDetails?.Title?.split(';')[0]} <span className="text-gradient">{spokenEnglishDetails?.Title?.split(';')?.slice(1, spokenEnglishDetails?.Title?.split(';')?.length)?.join(" ")}</span>
                </h1>
                <div className="text-base text-gray-600 text-justify leading-relaxed">
                  {spokenEnglishDetails?.SubTitle ? spokenEnglishDetails?.SubTitle : ''}
                  <div dangerouslySetInnerHTML={sanitizedData()}></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-fadeInLeft animate-stagger-2">
                <Link href="/contact" className="btn-primary inline-block text-center">
                  Enroll Now
                </Link>
              </div>
            </div>

            <div className="animate-fadeInRight">
              <div className="relative">
                <Image
                  src={`${constant.REACT_APP_URL}/uploads/${spokenEnglishDetails?.image}`}
                  alt="IELTS Preparation"
                  width={600}
                  height={500}
                  className="w-full animate-float p-2"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-green-500 text-white p-3 rounded-full animate-bounce-slow">
                  <Star className="h-6 w-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-green-500 text-white p-3 rounded-full animate-bounce-slow">
                  <Star className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="contact-us-section py-70">
        <div className="container">
          <div className="get-in-touch-section">
            <h2 className="heading text-center d-block mb-3">Why Choose Gateway Abroad for Spoken English Classes ?</h2>
            <div className="spoken-english-feature-section pt-4">
              <div className="row row-cols-1 row-cols-md-2 g-3 g-lg-4 justify-content-center">
                {spokenEnglishDetails?.WhyChoose?.map((data, index) => (
                  <div className="col" key={index}>
                    <div className="d-flex flex-column flex-sm-row align-items-start p-4 rounded-xl shadow-lg hover:shadow-xl bg-gray-100 border border-light h-100">
                      {/* Icon */}
                      <div className="features-guide-left me-sm-4 mb-3 mb-sm-0 mx-auto">
                        <div className="d-flex align-items-center justify-content-center rounded-circle p-3 shadow-sm" style={{ width: '60px', height: '60px' }}>
                          <img
                            decoding="async"
                            src={`${constant.REACT_APP_URL}/uploads/${data?.iconImage}`}
                            alt={data.title}
                            width={50}
                            height={50}
                            className="img-fluid rounded-circle"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="features-guide-right">
                        <h3 className="h5 text-dark font-bold mb-2">{data?.title}</h3>
                        <p className="text-secondary mb-0">
                          {typeof data?.content === 'string'
                            ? data?.content
                            : data?.content?.toString() || 'No description available.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      <section className="our-testimonials py-70 gmat-testimonials">
        <div className="container">
          <h2 className="heading text-center d-block">What Our Spoken English Prep Achievers Say</h2>
          {testimonials.length === 1 ? (
            <div className="our-testimonials-slider-inner single-testmonial">
              <div className="student-test-box">
                <div className="stundent-content">
                  <div className="d-flex align-items-center justify-content-between">
                    <h6>{testimonials[0].name}</h6>
                    <ul className="list-unstyled d-flex">
                      <li><span><i className="fa fa-star" /></span></li>
                      <li><span><i className="fa fa-star" /></span></li>
                      <li><span><i className="fa fa-star" /></span></li>
                      <li><span><i className="fa fa-star" /></span></li>
                      <li><span><i className="fa fa-star" /></span></li>
                    </ul>
                  </div>
                  <p className="descp">{testimonials[0].content.substring(0, 250)}</p>
                </div>
              </div>
            </div>
          ) : (
            <Slider {...testimonialSlider} className="our-testimonials-slider">
              {testimonials.map((test) => (
                <div className="our-testimonials-slider-inner" key={test._id || test.id}>
                  <div className="student-test-box">
                    <div className="stundent-content">
                      <div className="d-flex align-items-center justify-content-between">
                        <h6>{test.name}</h6>
                        <ul className="list-unstyled d-flex">
                          <li><span><i className="fa fa-star" /></span></li>
                          <li><span><i className="fa fa-star" /></span></li>
                          <li><span><i className="fa fa-star" /></span></li>
                          <li><span><i className="fa fa-star" /></span></li>
                          <li><span><i className="fa fa-star" /></span></li>
                        </ul>
                      </div>
                      <p className="descp">{test.content.substring(0, 250)}</p>
                    </div>
                    <div className="test-univ-sec">
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </section>

      <section className="english-components-section py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Components of the English Language</h2>
            <p className="text-gray-600">
              The English language can be broken down into several key components that work together to create meaning
            </p>
          </div>
          <div className="english-components-section-inner">
            <div className="flex flex-col lg:flex-row items-start pt-8 gap-8">
              <div className="lg:w-5/12 text-center">
                <div className="english-components-inner-left">
                  <img
                    src="/img/english-components-img.svg"
                    alt="english-components"
                    width={400}
                    height={400}
                    className="mx-auto"
                  />
                </div>
              </div>
              <div className="lg:w-7/12 w-full">
                <div className="english-components-inner-right">
                  {spokenEnglishDetails?.ComponentsLanguage && spokenEnglishDetails.ComponentsLanguage.length > 0 && (
                    <>
                      {/* Custom Tab Triggers */}
                      <div className="flex flex-wrap w-full gap-1 mb-4">
                        {spokenEnglishDetails.ComponentsLanguage.map((data: any) => (
                          <button
                            key={`trigger-${data.id}`}
                            className={`
                              px-3 py-2 rounded-md text-sm font-medium transition-colors
                              ${activeTab === data.section
                                ? "bg-red-600 text-white shadow-md"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }
                            `}
                            onClick={() => setActiveTab(data.section)}
                          >
                            {data.section}
                          </button>
                        ))}
                      </div>

                      {/* Custom Tab Contents */}
                      {spokenEnglishDetails.ComponentsLanguage.map((data: any) => (
                        <div
                          key={`content-${data.section}`}
                          className={`
                            transition-opacity duration-300 ease-in-out
                            ${activeTab === data.section ? "opacity-100 block" : "opacity-0 hidden"}
                          `}
                        >
                          {activeTab === data.section && (
                            <div className="space-y-4 rounded-xl bg-gray-50 p-3 font-semibold shadow-sm">
                              <p className="text-gray-700 leading-relaxed !text-justify">{data.content}</p>
                              {data.components && data.components.length > 0 ? (
                                <div className="mt-1 space-y-2">
                                  {data.components.map((innerData: any, idx: number) => (
                                    <p key={`${innerData.name}-${idx}`} className="text-gray-700 !text-justify">
                                      <strong className="font-semibold text-gray-800">{innerData.name}</strong>{" "}
                                      {innerData.description}
                                    </p>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="faq-section py-70 mb-0">
        <div className="container">
          <div className="title text-center mb-5">
            <h2 className="heading mb-2">Frequently asked questions</h2>
            <p className="descp text-center">Can't find the answer you are looking for?</p>
          </div>
          <div className="max-w-6xl mx-auto">
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
      <section className="pricing-plan-section py-70 linear-bg spoken-english">
        <div className="container">
          <div className="price-title">
            <h2 className="heading mb-2">Plans &amp; Pricing</h2>
            <p style={{ textAlign: 'left' }} className="descp">We are accepting PayPal, Paytm, PhonePe and Debit &amp; Credit Card</p>
          </div>
          <div className="pricing-plan-section-inner">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6">
                <div className="pricing-card">
                  <h5 className="plan-name">Classroom training</h5>
                  <div className="plan-offer-list">
                    <ul className="list-unstyled">
                      <li>Tired of feeling tongue-tied? Gateway Abroad's interactive English test preparation classes are designed to transform you from shy to shine!  Our engaging classroom environment provides a supportive space where you'll gain the confidence and fluency you need to ace your English language exam</li>
                      <li>Don’t just learn English, live it. Our interactive spoken English classes get you talking from day one.</li>
                    </ul>
                  </div>
                  <div className='text-center'>
                    {/* Changed Link usage for Next.js */}
                    <Link href="#" className="choose-plan-btn site-btn" data-bs-toggle="modal" data-bs-target="#getintouchModel">Choose Plan</Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="pricing-card">
                  <h5 className="plan-name">Live online training</h5>
                  <div className="plan-offer-list">
                    <ul className="list-unstyled">
                      <li>Can't make it to a physical classroom? No problem! Gateway Abroad's comprehensive online English test preparation classes offer the same exceptional instruction and proven results  - all from the comfort of your own home.</li>
                      <li>Fit fluency into your busy schedule. Gateway Abroad’s online spoken English courses offer flexibility and results.</li>
                    </ul>
                  </div>
                  <div className='text-center'>
                    {/* Changed Link usage for Next.js */}
                    <Link href="#" className="choose-plan-btn site-btn" data-bs-toggle="modal" data-bs-target="#getintouchModel">Choose Plan</Link>
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
                      <li>Get   the   best   of   both worlds  with  our  hybrid courses - the flexibility of   online   learning combined   with   the personalized support of in-person instruction!</li>
                      <li>Do you crave the structure and focus of a classroom environment, but also enjoy the flexibility of online learning? Gateway Abroad's hybrid English test preparation classes offer the perfect solution!</li>
                    </ul>
                  </div>
                  <div className='text-center'>
                    {/* Changed Link usage for Next.js */}
                    <Link href="#" className="choose-plan-btn site-btn" data-bs-toggle="modal" data-bs-target="#getintouchModel">Choose Plan</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="app-banner-section counselling-session-sec">
        <div className="container">
          <div className="app-banner-section-inner counselling-session-sec-inner">
            <div className="row align-items-center p-8">
              <div className="col-lg-6">
                <div className="app-banner-content-left">
                  <h2 className="mb-3">Avail A Complementary Counselling Session</h2>
                  <p className="mb-4">Join thousand of instructors and earn money hassle free!</p>
                  <Link className="site-btn" href="/contact">Contact us</Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="app-banner-content-right text-center">
                  <img
                    src="/img/counselling-session.svg"
                    alt="Counselling Session"
                    width={300}
                    height={200}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SpokenEnglish;