"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GraduationCap,
  Plane,
  MapPin,
  FileCheck2,
  Calendar,
  Star,
  Quote,
  Building2,
  Globe,
  CheckCircle,
  IndianRupee,
  CalendarDays,
  PlaneTakeoff,
  Landmark,
  Award,
  FileEdit,
  BookOpen,
  UserCheck,
  Monitor,
  Sun,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import EnhancedMultiStepForm from "@/components/pages/multiStep";
import Component from "@/components/pages/partnerSlider";
import DestinationSection from "@/components/sections/destination";
import ReadMoreSection from "@/components/sections/content";
import CardLayout from "@/components/sections/whyus";
import DegreesSection from "@/components/sections/degreeSection";
import ProcessRoadmap from "@/components/sections/processRoad";
import PageServices from "@/services/PageServices";
import Loader from "../loader";
import { baseUrl } from "@/services/axiosInstance";
import ContactForm from "./UkForm";
import DestinationsSection from "../home/DestinationSection";
import { it } from "node:test";



import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import LandingPage from "../home/ctaSection";
import FAQSection from "../home/FaqSection";
import { Html } from "next/document";
import { TopUKUniversities } from "../ukpageComponent/whyStudyin";
import { useRouter } from "next/navigation";

const StudyAbroadPage = ({ content, faq, slug }: any) => {
  if (!content) {
    return <Loader />;
  }

  function getContentByType(type) {
    const item = content && content.sections.find((obj) => obj.type === type);
    return item ? item.content : undefined; // Return undefined if not found
  }

  const handleGetStarted = () => {
    window.dispatchEvent(new CustomEvent("openFooterModal"));
  };

  const items = [
    { icon: "✅", value: "5,000+", label: `Students from ${slug} Placed` },
    { icon: "", value: "450+", label: "University Partnerships" },
    { icon: "", value: "18+", label: "Countries Covered" },
    { icon: "", value: "96%", label: "Visa Success Rate" },
    { icon: "", value: "FREE", label: "First Counselling Session" },
    { icon: "", value: "16 Yrs", label: "In Business Since 2008" },
  ];

  const Router = useRouter();

  return (
    <>
      {/* HERO */}
      <section className="hero-gradient py-12 pb-0  flex items-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content with staggered animations */}
            <div className="space-y-4">
              <div className="">
                <h1 className="text-3xl lg:text-4xl xl:text-[2.5rem] font-bold leading-tight">
                  <span className="inline-block">
                    {content?.title.split(" ").slice(0, 3).join(" ")}
                  </span>
                  <br />
                  {
                    <>
                      {" "}
                      <span className="text-[#D41833] py-2 inline-block">
                        {content?.title.split(" ").slice(3).join(" ")}
                      </span>
                      <br />{" "}
                    </>
                  }
                </h1>
              </div>

              <div className="mb-3">
                <div
                  className="text-gray-800 text-base lg:text-lg leading-relaxed text-justify max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: content?.subTitle }}
                />
                {/* <div className="text-gray-800 text-base lg:text-lg leading-relaxed max-w-2xl" >{content?.subTitle} </div> */}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-stagger-4">
                <p className="btn-primary inline-block text-center group px-6 py-3 sm:px-8 sm:py-4">
                  <span className="relative z-10" onClick={handleGetStarted}>
                    Get Started Today
                  </span>
                </p>
                {/* <Link href="/about" className="btn-secondary text-center group px-6 py-3 sm:px-8 sm:py-4">
                  Learn More
                </Link> */}
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm sm:text-base text-muted-foreground">
                <Star className="text-yellow-500 fill-yellow-500" /> Trusted by
                5,000+ students | 4.9/5 reviews
              </div>
            </div>

            {/* Right Illustration with floating animation */}
            <div className="relative animate-fadeInRight mx-auto w-full max-w-md lg:max-w-lg xl:max-w-none">
              <div className="relative z-10 mx-auto">
                <ContactForm />
              </div>

              <div className="absolute lg:-bottom-8 -bottom-12 lg:-left-4 -left-2 z-10 border-2 border-red-600 bg-white shadow-3xl rounded-xl p-3 sm:p-4">
                <h3 className="text-lg sm:text-xl m-0 font-bold text-center">
                  99.99%
                </h3>
                <p className="text-xs sm:text-sm m-0 text-center">
                  Success Rate
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="bg-[#D71635] overflow-hidden">
        {/* Mobile Marquee */}
        <div className="md:hidden">
          <div className="flex w-max animate-[marquee_15s_linear_infinite]">
            {[...items, ...items]?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-8 py-[13px] whitespace-nowrap"
              >
                {item.icon}

                <div>
                  <div className=" text-[1.1rem] font-bold text-white leading-none">
                    {item.value}
                  </div>

                  <div className="text-[0.80rem] font-semibold text-yellow-500">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex justify-center items-stretch min-w-max">
          {items &&
            items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-[46px] py-[14px] border-r border-[rgba(26,20,64,0.12)] whitespace-nowrap"
              >
                {item.icon}

                <div>
                  <div className=" text-[1.1rem] font-bold text-white leading-none">
                    {item.value}
                  </div>

                  <div className="text-[0.80rem] font-semibold text-yellow-500">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <style jsx>{`
          @keyframes marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}</style>

      </div>

      <EnhancedMultiStepForm />
      {/* <DestinationSection content={getContentByType('StudyDestinations')} /> */}
      <DestinationsSection content={content?.sections[0].content} />
      <DegreesSection content={getContentByType("AcademicPrograms")} />
      <section className="bg-white py-14 md:py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex  mb-3">
            <span className="bg-red-100 text-[#D81635] px-4 py-1 rounded-full text-xs md:text-sm font-bold uppercase">
              {getContentByType("whychooseus")?.label}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-4xl lg:text-4xl font-bold  text-gray-900 leading-tight">
            {getContentByType("whychooseus")?.title}
          </h2>

          {/* Subtext */}
          <p
            className=" text-gray-500 mt-3 md:mt-4 w-full  text-sm md:text-base"
            dangerouslySetInnerHTML={{
              __html: getContentByType("whychooseus")?.subTitle,
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-10 md:mt-14">
            {/* Loop through features */}
            {getContentByType("whychooseus")?.cards &&
              getContentByType("whychooseus")?.cards?.map((item) => {
                const IconComponent = Icons[item?.icon] || Icons.Target;
                return (
                  <div
                    key={item._id}
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
                    <span className="absolute top-3 right-4 md:top-4 md:right-6 text-4xl md:text-5xl font-bold text-[#E7E9E1]">
                      {item._id}
                    </span>

                    {/* Icon */}
                    <div className="text-[#D81635] text-2xl md:text-3xl mb-2 md:mb-3">
                      <IconComponent className="w-8 h-8 md:w-10 md:h-10" />
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-base md:text-lg text-gray-800">
                      {item?.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-gray-500 text-xs md:text-sm mt-1 md:mt-2 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: item?.description,
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      {/* <CardLayout content={getContentByType('WhyChooseUs')} /> */}

      <section id="services" className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-12">
          {/* Heading */}
          <div className="text-center">
            <span className="inline-block text-lg md:text-xl lg:text-2xl font-semibold mb-3">
              {getContentByType("servicesection")?.label}
            </span>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {getContentByType("servicesection")?.title}
            </h2>

            <p
              className="mt-3 text-base md:text-base text-gray-800 mx-auto"
              dangerouslySetInnerHTML={{
                __html: getContentByType("servicesection")?.subtitle,
              }}
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px] mt-[40px]">
            {getContentByType("servicesection")?.Cards &&
              getContentByType("servicesection")?.Cards?.map((item, index) => {
                const Icon = Icons[item?.icon] || Icons.Target;

                return (
                  <div
                    key={index}
                    className="flex gap-[15px] items-start bg-white border-[1.5px] border-[var(--border)] rounded-[15px] p-[20px] transition-all duration-300 hover:border-[var(--teal)] hover:-translate-y-[4px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.07)]"
                  >
                    {/* Icon */}
                    <div className="w-[48px] h-[48px] rounded-[11px] flex-shrink-0 bg-[#D81635] flex items-center justify-center text-[1.35rem]">
                      <Icon size={24} color="white" />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="font-bold text-lg text-black mb-[5px]">
                        {item.title}
                      </h3>

                      <p
                        className="text-sm text-gray-800  leading-[1.6]"
                        dangerouslySetInnerHTML={{
                          __html: item.subtitle,
                        }}
                      />

                      <a
                        href="#lead-form"
                        className="block mt-[7px] text-[0.75rem] cursor-pointer  text-left font-bold text-gray-800 relative z-10"
                      >
                        {item?.slug}
                      </a>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      <ProcessRoadmap />

      <section className="bg-red-50 py-12 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 md:mb-14">
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-red-100 text-[#C41430] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wider mb-4"
            >
              <span className="w-1.5 h-1.5 bg-red-500 text-sm uppercase font-bold rounded-full"></span>
              {getContentByType("citysection")?.label}
            </motion.span>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#C41430] leading-tight  mb-6"
            >
              {getContentByType("citysection")?.title}
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-gray-800 w-full leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: getContentByType("citysection")?.subTitle,
              }}
            ></motion.p>
          </div>

          {/* Location Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
            {getContentByType("citysection")?.cities?.map(
              (loc: any, index: number) => {
                const IconComponent = Icons[loc.icon] || Icons.Target; // Fallback to a default icon if not found
                return (
                  <Link href={`/${loc?.slug}`}>
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ y: -5 }}
                      className={`
                flex flex-col items-center justify-center text-center p-5 sm:p-6 rounded-2xl transition-all duration-300 cursor-pointer border
                ${
                  index === getContentByType("citysection")?.cities?.length - 1
                    ? "bg-[#D71635] border-[#064E3B] text-white shadow-lg shadow-red-900/20"
                    : "bg-white border-gray-200 hover:border-[#C41430] hover:shadow-md text-gray-900"
                }
              `}
                    >
                      <div
                        className={`mb-3 ${index === getContentByType("citysection")?.cities?.length - 1 ? "text-white" : "text-[#C41430]"}`}
                      >
                        <IconComponent className="w-8 h-8" />
                      </div>

                      <h3 className="text-base sm:text-lg font-bold mb-1">
                        {loc.name}
                      </h3>

                      <p
                        className={`text-xs sm:text-sm leading-snug ${index === loc.length - 1 ? "text-green-100" : "text-gray-500"}`}
                        dangerouslySetInnerHTML={{
                          __html: loc.description,
                        }}
                      />
                    </motion.div>
                  </Link>
                );
              },
            )}
          </div>

          {/* SEO Text Block with Side Border */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="border-l-4 border-[#C41430] pl-4 md:pl-6 py-2"
          >
            <p
              className="text-sm md:text-base text-gray-700 leading-relaxed font-medium text-justify"
              dangerouslySetInnerHTML={{
                __html: getContentByType("citysection")?.sectiondescription,
              }} />
              
          </motion.div>
        </div>
      </section>

      <LandingPage content={getContentByType("ctasection")} />

      <TopUKUniversities content={getContentByType("BestUniversities")} />
      <Component />

      <ReadMoreSection content={getContentByType("content")} />

    <section className="w-full bg-[#fff1f1] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">

        {/* Heading */}
        <h2 className="max-w-5xl text-[32px] font-bold leading-[1.2] text-[#dc2626] sm:text-[40px] md:text-[46px] lg:text-[48px]"
        dangerouslySetInnerHTML={{__html : getContentByType("Banner")?.title || `Study Abroad in {slug} – Visit Gateway
          <br className="hidden sm:block" />
          Abroad Today!
        `}}
        />
        

        {/* Description */}
        <p className="mt-6 max-w-5xl text-[18px] font-medium leading-[1.6] text-[#374151] sm:text-[20px] md:text-[22px]"
          dangerouslySetInnerHTML={{__html : getContentByType('Banner')?.content || `Get expert guidance for{" "}
          <strong>Study Abroad Admissions, Student Visa, IELTS/PTE Coaching,</strong>
          <br className="hidden md:block" />
          and top universities worldwide.`}}
        />
          
        {/* Buttons */}
        <div className="mt-7 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">

          {/* Consultation Button */}
          <button
            type="button"
            onClick={() => Router.push(getContentByType('Banner')?.url || '#') }
            className="w-full rounded-full bg-[#f04444] px-9 py-4 text-[17px] font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#dc3838] hover:shadow-[0_12px_25px_rgba(0,0,0,0.18)] sm:w-auto"
          >
            {getContentByType('Banner')?.buttonText || "Book a Free Consultation"}
          </button>

          {/* Expert Button */}
          <button
            type="button"
            onClick={() => Router.push('/contact')}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[#e7e8ff] px-9 py-4 text-[17px] font-bold text-[#111827] shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#dedfff] hover:shadow-[0_12px_25px_rgba(0,0,0,0.16)] sm:w-auto"
          >
            <Icons.Phone
              size={20}
              strokeWidth={2.5}
              className="fill-[#e83e8c] text-[#e83e8c]"
            />
            Connect With an Expert
          </button>

        </div>
      </div>
    </section>

      <FAQSection faq={faq?.data || []} content={""} />

      {/* FAQ Section */}
      {/* <section className="faq-section py-16 lg:py-20 mb-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 lg:mb-12">
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4">Frequently asked questions</h2>
                        <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">Can't find the answer you are looking for?</p>
                    </div>
                    <div className="max-w-7xl mx-auto">
                        <Accordion type="single" collapsible className="w-full">
                            {faqData.map((f: any, index: number) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="text-lg font-semibold text-left py-4 hover:no-underline">
                                        {f.title}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-700 pb-4 text-base">
                                        {f.content}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section> */}

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto ">
          <div className="bg-[#fbe7ea] rounded-2xl sm:rounded-[24px] shadow-lg w-full max-w-[90rem] mx-auto">
            {" "}
            {/* max-w-[90rem] for 7xl width */}
            {/* Content container with specific padding */}
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                <div className="w-full lg:w-[48%]">
                  <div className="text-center lg:text-left pl-[17px]">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[36px] font-bold mb-4 text-[#D71635] lg:leading-[37px] ">
                      Avail A Complementary Counselling Session
                    </h2>
                    <p className="text-base sm:text-lg lg:text-[18px] mb-4 sm:mb-6 text-[#666276]">
                      Join thousand of instructors and earn money hassle free!
                    </p>
                    <a
                      href="/contact"
                      className="inline-block bg-[#d71635] text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-3xl text-sm sm:text-base font-bold shadow-[0_0_8px_0_rgba(0,0,0,0.2)] hover:bg-[#b5122b] transition-all duration-300"
                    >
                      Contact us
                    </a>
                  </div>
                </div>
                <div className="w-full lg:w-[38%]">
                  <div className="flex justify-center">
                    <Image
                      src="/img/counselling-session.svg"
                      alt="Counselling Session"
                      width={400}
                      height={300}
                      className="w-full max-w-xs sm:max-w-sm lg:max-w-[25rem]"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "25rem",
                      }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StudyAbroadPage;


