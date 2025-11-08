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
      <footer className="bg-[url('https://www.gatewayabroadeducations.com/_next/static/media/footer-bg.f6e76235.svg')] bg-no-repeat bg-cover bg-bottom font-noto_sans relative z-10">
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
        {href: "/article" , text: "Articles"},
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

              {/* Study Abroad Column */}
              <div className="shrink-0 max-w-full w-full px-3 md:w-[16.6667%]">
                <div className="pl-2 mb-6">
                  <h4 className="text-zinc-800 text-[17px] font-semibold leading-[normal] mb-[15px]">
                    <Link href="/study-abroad" className="text-gray-800 hover:text-red-600 transition-colors duration-200">
                      Study Abroad
                    </Link>
                  </h4>
                  <ul className="leading-[normal] list-none mb-4 pl-0">
                    {countryPage.map((country, index) => (
                      <li
                        key={index}
                        className="relative mb-2 pl-[15px] before:accent-auto before:bg-zinc-800 before:text-neutral-800 before:block before:text-base before:not-italic before:normal-nums before:font-normal before:h-[5px] before:tracking-[normal] before:leading-[normal] before:list-outside before:list-none before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-[5px] before:rounded-[50%] before:border-separate before:left-0 before:top-[9px] before:font-noto_sans"
                      >
                        <Link
                          href={`/study-in-${country?.slug.toLowerCase().replace(' ', '-')}`}
                          className="capitalize text-zinc-800 text-sm font-medium inline-block hover:text-red-600 transition-all duration-200 hover:translate-x-[6px]"
                        >
                          Study in {country?.slug}
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
<div className="fixed top-1/2 -right-14 transform -translate-y-1/2 z-40 rotate-90">
  <button
    onClick={openModal}
    className="bg-[#d71635] text-white px-6 py-3 rounded-b-lg hover:bg-red-700 transition-colors duration-200 flex items-center relative group"
  >
    {/* Arrow with black background */}
    <span className="mr-2  bg-black p-[1.5rem] rounded-l-lg absolute -left-10 top-0 h-full flex items-center justify-center">
      <i className="fa fa-long-arrow-down text-white rotate-180" />
    </span>
    
    <span className="ml-4 rotate-180"><i className="fa fa-envelope-o" /> Get in touch</span>
  </button>
</div>

      {/* Contact Modal - Now properly positioned */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] modal-overlay">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          
          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform animate-scale-in">
              
              {/* Modal Header with Gradient Background */}
              <div className="bg-[#d71635] text-white py-6 px-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-2xl font-bold">
                      Get In Touch
                    </h5>
                    <p className="text-red-100 text-sm mt-1">
                      Let's start your educational journey together
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="text-black  transition-colors duration-200 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Left Side - Contact Information */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Why Choose Gateway Abroad?</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <i className="fa fa-check-circle text-red-600 mt-1 mr-3 flex-shrink-0"></i>
                          <span className="text-gray-700">15+ Years of Experience</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fa fa-check-circle text-red-600 mt-1 mr-3 flex-shrink-0"></i>
                          <span className="text-gray-700">Expert Counselling</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fa fa-check-circle text-red-600 mt-1 mr-3 flex-shrink-0"></i>
                          <span className="text-gray-700">Multiple Country Options</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fa fa-check-circle text-red-600 mt-1 mr-3 flex-shrink-0"></i>
                          <span className="text-gray-700">Test Preparation Support</span>
                        </li>
                      </ul>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="bg-red-100 p-2 rounded-full mr-3">
                            <i className="fa fa-phone text-red-600 text-sm"></i>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Call us at</p>
                            <p className="text-gray-800 font-medium">{contactData.contectOne || '+91-XXXXXXXXXX'}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-red-100 p-2 rounded-full mr-3">
                            <i className="fa fa-envelope text-red-600 text-sm"></i>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Email us</p>
                            <p className="text-gray-800 font-medium">{contactData.email || 'info@gatewayabroad.com'}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-red-100 p-2 rounded-full mr-3">
                            <i className="fa fa-whatsapp text-red-600 text-sm"></i>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">WhatsApp</p>
                            <p className="text-gray-800 font-medium">{contactData.contectOne || '+91-XXXXXXXXXX'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Contact Form */}
                  <div className="p-8">
                    <form onSubmit={handleSubmitContact(handleUpdate)} className="space-y-6">
                      {/* Name Field */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name <span className="text-[#d71635]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            {...registerContact("name", { required: "Name is required" })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-[#d71635] transition-all duration-200 ${
                              contactErrors.name ? 'border-[#d71635] ring-2 ring-[#d71635]' : 'border-gray-300'
                            }`}
                            placeholder="Enter your full name"
                          />
                          <i className="fa fa-user absolute right-3 top-3 text-gray-400"></i>
                        </div>
                        {contactErrors.name && (
                          <div className="text-[#d71635] text-sm mt-1 flex items-center">
                            <i className="fa fa-exclamation-circle mr-1"></i>
                            {contactErrors.name.message}
                        </div>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address <span className="text-[#d71635]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            {...registerContact("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address"
                              }
                            })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d71635] focus:border-red-500 transition-all duration-200 ${
                              contactErrors.email ? 'border-[#d71635] ring-2 ring-[#d71635]' : 'border-gray-300'
                            }`}
                            placeholder="Enter your email address"
                          />
                          <i className="fa fa-envelope absolute right-3 top-3 text-gray-400"></i>
                        </div>
                        {contactErrors.email && (
                          <div className="text-[#d71635] text-sm mt-1 flex items-center">
                            <i className="fa fa-exclamation-circle mr-1"></i>
                            {contactErrors.email.message}
                          </div>
                        )}
                      </div>

                      {/* Mobile Field */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number <span className="text-[#d71635]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            {...registerContact("mobile", {
                              required: "Mobile No. is required",
                              pattern: {
                                value: /^\d{10,15}$/,
                                message: "Invalid phone number"
                              }
                            })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                              contactErrors.mobile ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                            }`}
                            placeholder="Enter your mobile number"
                          />
                          <i className="fa fa-phone absolute right-3 top-3 text-gray-400"></i>
                        </div>
                        {contactErrors.mobile && (
                          <div className="text-red-500 text-sm mt-1 flex items-center">
                            <i className="fa fa-exclamation-circle mr-1"></i>
                            {contactErrors.mobile.message}
                          </div>
                        )}
                      </div>

                      {/* City Field */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            {...registerContact("city", { required: "City is required" })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                              contactErrors.city ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
                            }`}
                            placeholder="Enter your city"
                          />
                          <i className="fa fa-map-marker absolute right-3 top-3 text-gray-400"></i>
                        </div>
                        {contactErrors.city && (
                          <div className="text-red-500 text-sm mt-1 flex items-center">
                            <i className="fa fa-exclamation-circle mr-1"></i>
                            {contactErrors.city.message}
                          </div>
                        )}
                      </div>

                      {/* Message Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <textarea
                          {...registerContact("message")}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                          rows={3}
                          placeholder="Tell us about your requirements or any questions..."
                        ></textarea>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full bg-[#d71635] to-[#d71635] text-white font-semibold py-4 px-6 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        <i className="fa fa-paper-plane mr-2"></i>
                        SUBMIT YOUR REQUEST
                      </button>

                      {/* Privacy Note */}
                      <p className="text-xs text-gray-500 text-center mt-4">
                        By submitting this form, you agree to our privacy policy and consent to being contacted by our educational counsellors.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add custom animation */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Footer;