"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import PageServices from '../services/PageServices';
import useAsync from '../hooks/useAsync';
import { useForm } from 'react-hook-form';
import LocationAvailability from './sections/cityLocation';
import axiosInstance from '@/services/axiosInstance';

export const Footer = () => {
  const { data } = useAsync(PageServices.getSettingData);
  const { data: course } = useAsync(PageServices.getCourse);
  const [CourseData, setCourseData] = useState([]);
  const router = useRouter();
  const [contactData, setContactData] = useState([]);
  const [cityPage, setCityPage] = useState([]);
  const [countryPage, setCountyPage] = useState([]);
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
    formState: { errors: contactErrors },
    reset: resetContactForm
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      city: '',
      message: ''
    }
  });

  const {
    register: registerNewsletter,
    handleSubmit: handleSubmitNewsletter,
    formState: { errors: newsletterErrors },
    reset: resetNewsletterForm
  } = useForm({
    defaultValues: {
      newsEmail: ''
    }
  });

  useEffect(() => {
    if (course?.data?.page) {
      setCourseData(course.data.page);
    }
    if (data?.data?.setting) {
      setContactData(data.data.setting);
    }
  }, [data, course]);

  async function getPageData(type, setState) {
    const response = await axiosInstance.get(`/page/list/type?type=${type}&featured=true`);
    if (response.data?.data) {
      setState(response.data.data);
    }
  }

  useEffect(() => {
    getPageData('city_page', setCityPage);
    getPageData('country_page', setCountyPage);
  }, []);

  const handleUpdate = async (formData) => {
    const { name, email, mobile, city, message } = formData;
    try {
      const createJob = await PageServices.createForme({
        name,
        email,
        mobileNo: mobile,
        city,
        message,
        type: 'contact'
      });
      if (createJob.status === 'success') {
        resetContactForm();
        setShowModal(false);
        router.push('/thank-you');
      } else {
        console.error('Contact form submission failed:', createJob);
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
    }
  };

  const handleUpdate2 = async (formData) => {
    const { newsEmail } = formData;
    try {
      const createJob = await PageServices.addEmail({
        email: newsEmail,
        Subscribed: 'Yes'
      });
      if (createJob.status === 'success') {
        resetNewsletterForm();
      } else {
        console.error('Newsletter subscription failed:', createJob);
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    const handleClickOutside = (e) => {
      if (showModal && e.target.classList.contains('modal-overlay')) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showModal]);

  return (
    <>
      <footer className="bg-[url('/img/footer-bg.svg')] bg-no-repeat bg-cover bg-bottom font-noto_sans relative z-10">

        {pathname.includes("study-abroad")}

        <div className="container-6xl w-[80%] pt-[30px] mx-auto">
          <h4 className="text-sm font-semibold text-gray-800 inline-block px-1 py-1 rounded-full mb-3 ">
            🌍 Choose Your Destination
          </h4>
          <div className="flex gap-1 flex-wrap justify-start items-center sm:gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-3">

            {countryPage.map((country, index) => {
              const slug = country?.slug?.toLowerCase().replace(/\s+/g, "-");
              return (
                <Link
                  key={index}
                  href={`/study-in-${slug}`}
                  className={`relative flex flex-wrap items-center justify-center px-3 sm:px-3 py-2 rounded-full text-sm md:text-xs font-medium capitalize whitespace-nowrap transition-all duration-300 !border !border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm text-gray-700 `}
                >
                  {country?.slug.toUpperCase()}
                </Link>
              );
            })}
          </div>
        </div>
        {<LocationAvailability cities={cityPage} />}

        {/* Footer Content */}
        <div className="py-10 md:py-[60px]">
          <div className="max-w-none w-full mx-auto px-3 md:max-w-7xl">
            <div className="flex flex-wrap -mx-3">

              {/* Brand Column */}
              <div className="shrink-0 max-w-full w-full px-3 md:w-3/12">
                <div className="mb-6">
                  <div className="mb-4">
                    <Link href="/" className="text-blue-600 inline-block hover:text-blue-700">
                      <img
                        src="/img/ga-logo.svg"
                        alt="logo"
                        className="h-[58px] max-w-full md:h-[72px]"
                      />
                    </Link>
                  </div>
                  <div className="mb-6">
                    <p className="text-zinc-800 text-[15px] leading-5 text-justify my-[25px]">
                      Gateway Abroad (an educational consultant) has been counselling and assisting students to study in the UK, IRELAND, AUSTRALIA, the USA, CANADA, NEW ZEALAND, SINGAPORE, and other countries for 15+ years.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-zinc-800 text-[17px] font-semibold leading-[normal] mb-[15px]">
                      Follow us
                    </h4>
                    <ul className="flex flex-wrap list-none mb-4 pl-0">
                      {[
                        { href: contactData.facebook, icon: 'fa-facebook' },
                        { href: contactData.tweeter, icon: 'fa-quora' },
                        { href: contactData.googlePlus, icon: 'fa-google-plus' },
                        { href: contactData.pintrest, icon: 'fa-pinterest' },
                        { href: contactData.instagram, icon: 'fa-instagram' },
                        { href: contactData.linkdin, icon: 'fa-linkedin' },
                        { href: contactData.youtube, icon: 'fa-youtube' },
                        { href: `https://api.whatsapp.com/send?phone=${contactData.contectOne || ''}`, icon: 'fa-whatsapp' }
                      ].map((social, index) => (
                        <li key={index} className="mb-[15px]">
                          <Link
                            href={social.href || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white bg-zinc-800 inline-block h-8 leading-8 text-center w-8 mr-2 rounded-[50%] hover:bg-red-600"
                          >
                            <i className={`fa ${social.icon}`} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {/* Quick Links Column */}
              <div className="shrink-0 max-w-full w-full px-3 md:w-[16.6667%]">
                <div className="pl-5 mb-6">
                  <h4 className="text-zinc-800 text-[17px] font-semibold leading-[normal] mb-[15px]">
                    Quick Links
                  </h4>
                  <ul className="leading-[normal] list-none mb-4 pl-0">
                    {[
                      { href: "/", text: "Home" },
                      { href: "/about", text: "About Us" },
                      { href: "/spoken-english", text: "Spoken English" },
                      { href: "/blog", text: "Blog" },
                      { href: "/article", text: "Articles" },
                      { href: "/career", text: "Career" },
                      { href: "/contact", text: "Contact Us" },
                      { href: "/gallary", text: "Gallery" }
                    ].map((link, index) => (
                      <li
                        key={index}
                        className="relative mb-2 pl-[15px] before:accent-auto before:bg-zinc-800 before:text-neutral-800 before:block before:text-base before:not-italic before:normal-nums before:font-normal before:h-[5px] before:tracking-[normal] before:leading-[normal] before:list-outside before:list-none before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-[5px] before:rounded-[50%] before:border-separate before:left-0 before:top-[9px] before:font-noto_sans"
                      >
                        <Link
                          href={link.href}
                          className="text-zinc-800 text-sm font-medium inline-block hover:text-red-600 transition-colors duration-200"
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>


                </div>
              </div>

            

              {/* Test Preparation Column */}
              <div className="shrink-0 max-w-full w-full px-3 md:w-[16.6667%]">
                <div className="pl-2 mb-6">
                  <h4 className="text-zinc-800 text-[17px] font-semibold leading-[normal] mb-[15px]">
                    Test Preparation
                  </h4>
                  <ul className="leading-[normal] list-none mb-4 pl-0">
                    {CourseData?.map((course) => (
                      <li
                        key={course.pageName}
                        className="relative mb-2 pl-[15px] before:accent-auto before:bg-zinc-800 before:text-neutral-800 before:block before:text-base before:not-italic before:normal-nums before:font-normal before:h-[5px] before:tracking-[normal] before:leading-[normal] before:list-outside before:list-none before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-[5px] before:rounded-[50%] before:border-separate before:left-0 before:top-[9px] before:font-noto_sans"
                      >
                        <Link
                          href={`/course/${course.pageName.toLowerCase()}`}
                          className="text-zinc-800 text-sm font-medium inline-block hover:text-red-600 transition-colors duration-200"
                        >
                          {course.pageName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact Column */}
              <div className="shrink-0 max-w-full w-full px-3 md:w-3/12">
                <div className="mb-6">
                  <div className="mb-6">
                    <h4 className="text-zinc-800 text-[17px] font-semibold leading-[normal] mb-[15px]">
                      Contact us
                    </h4>
                    <ul className="leading-[normal] list-none mb-4 pl-0">
                      <li className="mb-2.5">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://maps.app.goo.gl/${contactData.officeAdress ? encodeURIComponent(contactData.officeAdress) : ""}`}
                          className="text-zinc-800 text-base font-medium inline-block md:text-sm hover:text-red-600 transition-colors duration-200"
                        >
                          {contactData.officeAdress || "Address not available"}
                        </Link>
                      </li>
                      <li className="mb-2.5">
                        <span className="text-lg inline-block mr-1.5">
                          <i className="fa fa-whatsapp" />
                        </span>
                        {contactData.contectOne && (
                          <Link
                            href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(contactData.contectOne)}`}
                            className="text-zinc-800 text-base font-medium inline-block md:text-sm hover:text-red-600 transition-colors duration-200"
                          >
                            {contactData.contectOne}
                          </Link>
                        )}{' '}
                        {contactData.contectTwo && (
                          <Link
                            href={`tel:${contactData.contectTwo}`}
                            className="text-zinc-800 text-base font-medium inline-block md:text-sm hover:text-red-600 transition-colors duration-200"
                          >
                            {contactData.contectTwo}
                          </Link>
                        )}{' '}
                        {contactData.contectThree && (
                          <Link
                            href={`tel:${contactData.contectThree}`}
                            className="text-zinc-800 text-base font-medium inline-block md:text-sm hover:text-red-600 transition-colors duration-200"
                          >
                            {contactData.contectThree}
                          </Link>
                        )}
                      </li>
                      <li className="mb-2.5">
                        <span className="text-lg inline-block mr-1.5">
                          <i className="fa fa-envelope-o" />
                        </span>
                        {contactData.email && (
                          <Link
                            href={`mailto:${contactData.email}`}
                            className="text-zinc-800 text-base font-medium inline-block md:text-sm hover:text-red-600 transition-colors duration-200"
                          >
                            {contactData.email}
                          </Link>
                        )}
                      </li>
                    </ul>
                  </div>

                  {/* Newsletter Form */}
                  <div className="mt-6">
                    <h4 className="text-zinc-800 text-[17px] font-semibold leading-[normal] mb-[15px]">
                      Newsletter
                    </h4>
                    <form onSubmit={handleSubmitNewsletter(handleUpdate2)}>
                      <input
                        type="email"
                        {...registerNewsletter("newsEmail", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address"
                          }
                        })}
                        className={`bg-clip-padding bg-white/60 block w-full border border-zinc-500 mb-5 px-3 py-2.5 rounded-md border-solid ${newsletterErrors.newsEmail ? 'border-red-500' : ''}`}
                        placeholder="Enter your email"
                      />
                      {newsletterErrors.newsEmail && (
                        <div className="text-red-500 text-sm mb-2">{newsletterErrors.newsEmail.message}</div>
                      )}
                      <button
                        type="submit"
                        className="text-white font-semibold bg-red-600 shadow-[rgba(0,0,0,0.25)_0px_0px_12px_0px] text-center px-[30px] py-[9px] hover:bg-red-700 transition-colors duration-200"
                      >
                        Subscribe
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-white border-b-gray-200 border-l-gray-200 border-r-gray-200 text-center px-5 py-6 border-t-white border-t border-solid">
          <p className="leading-[normal] mb-4">
            Copyrights © {new Date().getFullYear()} All Rights Reserved by Gateway Abroad.
          </p>
        </div>
      </footer>

      {/* Scroll to Top */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href="#"
          id="scroll-button"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="text-white bg-red-600 inline-block h-10 w-10 leading-10 text-center rounded-[50%] hover:bg-red-700 transition-colors duration-200"
        >
          <i className="fa fa-angle-up" />
        </Link>
      </div>

      {/* Get in Touch Sidebar */}
      <div className="fixed top-1/2 -right-[63px] transform -translate-y-1/2 z-40 rotate-90">
        <button
          onClick={openModal}
          className="bg-[#d71635] text-white px-3 py-3 rounded-br-lg hover:bg-red-700 transition-colors duration-200 flex items-center relative group"
        >
          {/* Arrow with black background */}
          <span className="mr-2  bg-black p-[1rem] rounded-bl-lg rounded-br-lg absolute -left-8 top-0 h-full flex items-center justify-center">
            <i className="fa fa-long-arrow-down text-white pb-[30px] rotate-180" />
          </span>

          <span className="pb-[30px]  rotate-180"><i className="fa fa-envelope-o mr-[5px]" /> Get in touch</span>
        </button>

      </div>

     

{/* Modern Contact Modal - Premium Design */}
{showModal && (
  <div className="fixed inset-0 z-[9999] modal-overlay">
    {/* Premium Backdrop with Blur & Gradient */}
    <div 
      className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/30 backdrop-blur-md"
      onClick={closeModal}
    ></div>

    {/* Modal Container with Glassmorphism */}
    <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-[92vw] sm:max-w-md overflow-hidden">
        {/* Animated Border Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#d71635] via-[#9e0072] to-[#d71635] rounded-2xl blur opacity-75 animate-gradient-xy"></div>
        
        {/* Modal Card */}
        <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl overflow-hidden border border-white/20">
          
          {/* Premium Header with Gradient */}
          <div className="relative bg-gradient-to-r from-[#d71635] to-[#9e0072] py-4 sm:py-5 px-5 sm:px-6">
            {/* Shiny Overlay Effect */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h5 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Get In Touch</h5>
              </div>
              
              <button
                onClick={closeModal}
                className="group p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <p className="text-white/90 text-sm mt-2 font-light">
              We'll get back to you within 24 hours
            </p>
          </div>

          {/* Modal Body with Subtle Pattern */}
          <div className="relative p-5 sm:p-6 bg-gradient-to-b from-white to-gray-50/50">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d71635' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '20px'
              }}></div>
            </div>

            <div className="relative space-y-1">
              {/* Floating Label Inputs */}
              <div className="space-y-1">
                {/* Name Field */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d71635]/20 to-transparent rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center mb-1">
                      <svg className="w-4 h-4 text-[#d71635] mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-600">Full Name</span>
                    </div>
                    <input
                      type="text"
                      {...registerContact("name", { required: "Name is required" })}
                      className={`w-full px-4 py-3.5 bg-white/80 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400
                        ${contactErrors.name 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-[#d71635] focus:ring-2 focus:ring-[#d71635]/20'
                        }`}
                      placeholder="John Doe"
                    />
                    {contactErrors.name && (
                      <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-medium flex items-center mt-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        {contactErrors.name.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d71635]/20 to-transparent rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center mb-1">
                      <svg className="w-4 h-4 text-[#d71635] mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-600">Email Address</span>
                    </div>
                    <input
                      type="email"
                      {...registerContact("email", {
                        required: "Email is required",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
                      })}
                      className={`w-full px-4 py-3.5 bg-white/80 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400
                        ${contactErrors.email 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-[#d71635] focus:ring-2 focus:ring-[#d71635]/20'
                        }`}
                      placeholder="john@example.com"
                    />
                    {contactErrors.email && (
                      <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-medium flex items-center mt-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        {contactErrors.email.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Field */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d71635]/20 to-transparent rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center mb-1">
                      <svg className="w-4 h-4 text-[#d71635] mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-600">Mobile Number</span>
                    </div>
                    <input
                      type="tel"
                      {...registerContact("mobile", {
                        required: "Mobile is required",
                        pattern: { value: /^\d{10,15}$/, message: "Invalid number" }
                      })}
                      className={`w-full px-4 py-3.5 bg-white/80 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400
                        ${contactErrors.mobile 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-[#d71635] focus:ring-2 focus:ring-[#d71635]/20'
                        }`}
                      placeholder="9876543210"
                    />
                    {contactErrors.mobile && (
                      <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-medium flex items-center mt-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        {contactErrors.mobile.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* City Field */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d71635]/20 to-transparent rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center mb-1">
                      <svg className="w-4 h-4 text-[#d71635] mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-600">City</span>
                    </div>
                    <input
                      type="text"
                      {...registerContact("city", { required: "City is required" })}
                      className={`w-full px-4 py-3.5 bg-white/80 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400
                        ${contactErrors.city 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-[#d71635] focus:ring-2 focus:ring-[#d71635]/20'
                        }`}
                      placeholder="New Delhi"
                    />
                    {contactErrors.city && (
                      <div className="absolute -bottom-5 left-0 text-red-500 text-xs font-medium flex items-center mt-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        {contactErrors.city.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d71635]/20 to-transparent rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center mb-1">
                      <svg className="w-4 h-4 text-[#d71635] mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-600">Your Message</span>
                    </div>
                    <textarea
                      {...registerContact("message")}
                      className="w-full px-4 py-3.5 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#d71635] focus:ring-2 focus:ring-[#d71635]/20 transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none"
                      rows="3"
                      placeholder="Tell us about your requirements..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Animated Submit Button */}
              <button
                type="submit"
                className="group relative w-full overflow-hidden bg-gradient-to-r from-[#d71635] to-[#9e0072] text-white font-semibold py-4 px-6 rounded-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-[100px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                </div>
                
                {/* Button Content */}
                <div className="relative flex items-center justify-center space-x-2">
                  <span className="text-lg">Send Message</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#9e0072] to-[#d71635] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Privacy Note */}
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 flex items-center justify-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                  Your information is secure and private
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* Add these animations to your global CSS */}
<style jsx>{`
  @keyframes gradient-xy {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(10px, 10px); }
  }
  
  @keyframes shine {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
  
  .animate-gradient-xy {
    animation: gradient-xy 3s ease-in-out infinite;
  }
  
  .animate-shine {
    animation: shine 2s infinite;
  }
`}</style>


     
    </>
  );
};

export default Footer;