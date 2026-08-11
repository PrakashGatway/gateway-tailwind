// components/sections/WhyStudyUK.jsx
"use client";
import Link from "next/link";


import { useState } from "react";
import { highlightText } from "../pages/studyInUk";
import { DynamicIcon } from "../sections/processRoad";

export default function WhyStudyUK({ content }) {

 



    return (
        <section className="bg-white py-12 px-5">
            <div className="max-w-7xl px-2 mx-auto">

                {/* Title */}
                <h2 className="text-2xl lg:text-4xl xl:text-[2.4rem] max-w-7xl font-bold text-gray-800 !leading-[1.3] mb-2">
                    <span>{content.sections[1].content.title?.split("||")[0]}</span>
                    <span className="text-red-600 font-bold">{content.sections[1].title?.split("||")[1]}</span>
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-7xl mb-12 text-justify">
                    {content.sections[1].content.subTittle}
                </p>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    {content?.sections[1]?.content?.Cards && content?.sections[1]?.content?.Cards?.map((reason, index) => (
                        <div
                            key={index}
                            className="group relative bg-gradient-to-br from-pink-100 to-amber-50 border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/5 hover:border-red-200 overflow-hidden"
                        >

                            <p className='absolute -top-[1px] rounded-bl-3xl -right-1 border bg-red-500 text-white font-semibold px-4 text-sm py-2'>
                                Free Counselling
                            </p>

                            {/* Left accent border */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#C8102E] to-[#012169] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-l-2xl" />

                            <DynamicIcon name={reason.icon} size={45} className="!stroke-[1.2px]" color="#C8102E" />
                            {/* <span className="text-2xl">{reason.icon}</span> */}

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                {reason.name}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {reason.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


export function TopUKUniversities({ content }) {

    const [hoveredCard, setHoveredCard] = useState(null);


    const handleGetStarted = () => {

        window.dispatchEvent(new CustomEvent('openFooterModal'));
    };

    


    return (
        <section className="bg-pink-100 py-12 px-5 relative overflow-hidden">

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-10">
                    <h2 className="text-2xl lg:text-4xl xl:text-[2.4rem] font-bold text-gray-800 !leading-[1.3] mb-2">
                        {content?.title}
                    </h2>

                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed w-full">
                        {content?.subTittle}
                    </p>
                </div>

                {/* Universities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    {content?.Cards && content?.Cards?.map((uni, index) => (
                        <div
                            key={index}
                            className={`group relative bg-white border border-black/10 border-inner rounded-2xl p-6 transition-all duration-500 overflow-hidden
                ${hoveredCard === index ? 'scale-[1.02] shadow-2xl shadow-[#C9A84C]/10 border-[#C9A84C]/40' : 'hover:border-[#C9A84C]/30'}
              `}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="absolute top-0 right-0 bg-red-600 px-3 py-1.5 rounded-bl-2xl text-sm font-medium text-white ">
                                {uni.qsRank}
                            </div>
                            {/* Animated gradient overlay on hover */}
                            <div className={`absolute inset-0  bg-gradient-to-br from-[#C9A84C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none`} />

                            {/* QS Rank Tag - Enhanced */}
                            <div className="relative z-10  items-start justify-between mt-4">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-600 mt-1 group-hover:text-red-600 transition-colors duration-300">
                                    {uni?.name}
                                </h3>
                                <p className="text-base">{uni?.description}</p>
                                {/* <span className="text-3xl filter drop-shadow-lg">{uni.image}</span> */}
                            </div>

                            {/* University Name & Location */}
                            <div className="relative z-10 mb-4">

                                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {uni?.location}
                                </div>
                                <p className="text-gray-500 text-sm mt-1"> {uni?.year}</p>
                            </div>
                            <div className="relative z-10 flex flex-wrap gap-2 mb-5">
                                {/* {uni?.Courses && uni?.Courses?.map((course, i) => (
                                    <span
                                        key={i}
                                        className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 hover:bg-[#C9A84C]/20 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all duration-300"
                                    >
                                        {course.trim()}
                                    </span>
                                ))} */}
                            </div>
                            <div className="flex gap-3">

                                {/* Apply Button */}
                                <button
                                    onClick={handleGetStarted}
                                    className="px-10 text-center text-sm py-2 rounded-full bg-red-600 text-white font-semibold  flex items-center disabled:opacity-70 cursor-pointer"
                                >
                                    Apply
                                </button>

                                {/* Visit Button */}
                                <Link
                                    href={`${uni?.slug}`}
                                    onClick={!uni?.slug ? handleGetStarted : undefined}
                                    className="px-10 text-center text-sm py-2 rounded-full bg-[#F7E8FA] text-black font-semibold  flex items-center disabled:opacity-70 cursor-pointer"
                                >
                                    Visit
                                </Link>

                            </div>


                      
                        </div>
                    ))}
                </div>

                {/* Bottom CTA - Enhanced */}
                <div className="text-center">
                    <a
                        onClick={handleGetStarted}
                        className="inline-flex items-center text-xs gap-3 bg-[#C8102E] hover:bg-[#a80d26] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg shadow-[#C8102E]/30 hover:shadow-[#C8102E]/50 hover:-translate-y-1 group"
                    >
                        Get Matched to the Right UK University
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}


export function UKStudyCosts({ content }) {





    return (
        <section className="bg-white py-12 px-5">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-2xl lg:text-4xl xl:text-[2.4rem] font-bold text-gray-800 !leading-[1.3] mb-4">
                        {content?.sections[3]?.content?.title}
                    </h2>

                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                        {content?.sections[3]?.content?.subTitle}

                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

                    {/* Left Column: Tables */}
                    <div className="lg:col-span-2 space-y-6">

                        {content?.sections[3]?.content?.Table?.map((item, i) => (
                            <>
                                {/* Tuition Fees Table */}
                                <div className="bg-gradient-to-br from-pink-50 to-amber-50 border border-gray-200 rounded-2xl overflow-hidden">
                                    <div className="px-6 py-4 bg-red-600 text-white">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            <DynamicIcon name={item?.iconitem || "GraduationCap"} size={20} color="#fff" />
                                            {item?.tableTitle}
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {item.tablerow.split("||").map((row, i) => (
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{row}</th>
                                                    ))}


                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {item?.tablecolumn1?.split("||")?.map((col, index) => (
                                                    <tr key={index} className="hover:bg-red-50/50 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                            {col}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-bold text-red-600">
                                                            {item?.tablecolumn2?.split("||")[index]}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {item?.tablecolumn3?.split("||")[index]}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div></>
                        ))}





                        {/* Cost Insight Card */}
                        {/* <div className="bg-gradient-to-r from-red-50 to-amber-50 border-l-4 border-red-500 rounded-xl p-5">
              <div className="flex gap-3">
                <DynamicIcon name="Lightbulb" size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-red-700">Why UK is affordable despite higher fees:</strong> A 1-year UK master's typically costs <strong className="text-gray-900">£20,000–35,000 total</strong> vs a 2-year Australian master's costing AUD 80,000–100,000. Factor in the saved year of living costs — UK often works out cheaper for Indian students pursuing PG education.
                  </p>
                </div>
              </div>
            </div> */}
                    </div>

                    {/* Right Column: Sidebar Cards */}
                    <div className="space-y-5">

                        {/* Education Loans Card */}
                        {content?.sections[3]?.content?.educationloan?.map((item, i) => {
                            const loanOptions = item?.educationlist?.split("//") || [];

                            return (
                                <div
                                    key={i}
                                    className="group bg-white border-2 border-red-100 hover:border-red-300 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                            <DynamicIcon name="Landmark" size={20} className="text-red-600" />
                                        </div>

                                        <h4 className="font-bold text-gray-800">{item?.title}</h4>
                                    </div>

                                    <ul className="space-y-3">
                                        {loanOptions.map((loan, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="text-red-500 font-bold mt-0.5">•</span>
                                                {loan}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}


                        {/* Part-Time Work Card */}
                        {/* <div className="group bg-white border-2 border-amber-100 hover:border-amber-300 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <DynamicIcon name="Wallet" size={20} className="text-amber-600" />
                </div>
                <h4 className="font-bold text-gray-800">💰 Part-Time Work</h4>
              </div>
              <ul className="space-y-3">
                {partTimeWork.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-amber-500 font-bold mt-0.5">✓</span>
                    <span className="text-gray-600">
                      <strong className="text-gray-800">{item.label}:</strong> {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div> */}

                        {/* Scholarships Card */}
                        {content?.sections[3]?.content?.scholarship?.map((item, i) => {
                            const names = item?.scholarshiplist?.split("//") || [];
                            const tags = item?.scholarshiptag?.split("//") || [];
                            const benefits = item?.scholarshipsublist?.split("//") || [];

                            return (
                                <div
                                    key={i}
                                    className="group bg-white border-2 border-green-100 hover:border-green-300 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                            <DynamicIcon name="Award" size={20} className="text-green-600" />
                                        </div>

                                        <h4 className="font-bold text-gray-800">🎓 {item?.title}</h4>
                                    </div>

                                    <ul className="space-y-3">
                                        {names.map((name, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm">
                                                <span className="text-green-500 font-bold mt-0.5">★</span>

                                                <div>
                                                    <span className="font-medium text-gray-800">{name}</span>

                                                    <span className="ml-2 inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                        {tags[index]}
                                                    </span>

                                                    <p className="text-gray-600 text-xs mt-0.5">
                                                        {benefits[index]}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}

                        {/* Quick CTA Card */}
                        <div className="bg-gradient-to-br from-red-600 to-pink-500 rounded-2xl p-5 text-white">
                            <h4 className="font-bold text-lg mb-2">📊 Free Cost Analysis</h4>
                            <p className="text-sm text-white/80 mb-4">
                                Not sure if UK fits your budget? Get a personalised cost-benefit report.
                            </p>
                            <a
                                href="#apply"
                                className="inline-flex items-center gap-2 bg-white text-red-700 font-bold px-4 py-2.5 rounded-full text-sm hover:bg-amber-400 transition-colors"
                            >
                                Get Free Estimate
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}


export function GatewayAbroadProcess({ content }) {
    const [activeStep, setActiveStep] = useState(null);


    return (
        <section className="py-12 bg-pink-100 px-5" id="process">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Column: Process Timeline */}
                    <div className="w-full lg:w-[67%]">

                        {/* Header */}
                        <div className="mb-8">

                            <h2 className="text-2xl lg:text-4xl xl:text-[2.4rem] max-w-3xl font-bold text-gray-800 !leading-[1.3] mb-4">
                                {content?.sections[5]?.content?.sectiontitle}
                            </h2>

                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl">
                                {content?.sections[5]?.content?.sectionsubtitle}

                            </p>
                        </div>

                        {/* SEO Text Block */}
                        <div className="bg-pink-50 border-l-4 border-red-500 rounded-r-xl p-6 mb-10">
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: content?.sections[5]?.content?.sectioncontent || ""
                                }}
                            />
                        </div>

                        {/* Timeline */}
                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-[#012169] to-red-500 hidden lg:block" />

                            <div className="space-y-2">

                                <ProcessStep



                                    activeStep={activeStep}
                                    setActiveStep={setActiveStep}
                                    content={content}
                                />

                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="w-full lg:w-[33%]">
                        <div className="sticky top-24 space-y-4">


                            <ContactForm />


                            {/* Contact Info Card */}
                            <div className="bg-pink-50 border border-red-600 rounded-xl p-5 text-center">
                                <p className="text-gray-600 text-xs uppercase font-bold mb-2">
                                    Call / WhatsApp
                                </p>
                                <a
                                    href="tel:+918302092630"
                                    className="text-2xl font-black text-[#C9A84C] block hover:text-[#EDD68A] transition-colors"
                                >
                                    +91 8302092630
                                </a>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-gradient-to-br from-red-50 to-amber-50 border border-red-100 rounded-xl p-5">
                                <h4 className="font-bold text-gray-800 mb-3 text-sm">Why Choose Gateway Abroad?</h4>
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
    );
}

// Individual Process Step Component
export function ProcessStep({ index, activeStep, setActiveStep, content }) {
    const isActive = activeStep === index;

    return (
        <>
            {content?.sections[5]?.content?.sectioncard?.map((item, index) => {

                const colors = [
                    "bg-red-500",
                    "bg-orange-500",
                    "bg-amber-500",
                    "bg-yellow-500",
                    "bg-green-500",
                    "bg-blue-500",
                    "bg-purple-500"
                ];

                const stepData = {
                    tag: item?.cardbadge,
                    title: item?.cardtitle,
                    description: item?.cardsubtitle,
                    icon: item?.cardicon || "📋",
                    color: colors[index] || "bg-gray-400"
                };

                const isActive = activeStep === index;

                return (
                    <div
                        key={index}
                        className={`relative flex gap-4 lg:gap-6 group cursor-pointer transition-all duration-300 ${isActive ? "scale-[1.01]" : ""
                            }`}
                        onMouseEnter={() => setActiveStep(index)}
                        onMouseLeave={() => setActiveStep(null)}
                    >

                        {/* Step Icon */}
                        <div className="relative z-10 flex-shrink-0">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm border-4 border-white shadow-lg transition-all duration-300 ${isActive
                                    ? stepData.color + " text-white scale-110"
                                    : "bg-white text-gray-400 border-gray-200 group-hover:border-red-300"
                                    }`}
                            >
                                {stepData.icon}
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
                            <span className="absolute top-0 right-0 px-2 py-1 bg-red-600 inline-block text-xs sm:text-[9px] font-bold uppercase text-white rounded-bl-xl">
                                {stepData.tag}
                            </span>

                            {/* Title */}
                            <h4 className={`font-bold text-base lg:text-lg mb-2 ${isActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                                }`}>
                                {stepData.title}
                            </h4>

                            {/* Description */}
                            <p className={`text-sm font-medium leading-relaxed ${isActive ? "text-gray-700" : "text-gray-500"
                                }`}>
                                {stepData.description}
                            </p>
                        </div>

                        {/* Hover Glow */}
                        <div
                            className={`absolute inset-0 rounded-xl bg-gradient-to-r ${stepData.color
                                }/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                        />
                    </div>
                );
            })}</>
    );
}

import ContactForm from "../pages/UkForm";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";


export function ScrollStackIntakes() {
    const containerRef = useRef(null);

    const intakes = [
        {
            id: 1,
            title: "September 2025 Intake",
            badge: "🔥 Most Popular",
            badgeColor: "bg-red-600",
            applicationWindow: "Oct 2024 – June 2025",
            status: "Now Open",
            features: [
                "All programs available including competitive courses",
                "Maximum scholarship options open",
                "Largest Indian student cohort joins together",
                "Best university choices available",
                "UCAS deadline: Jan 2025"
            ],
            cta: "Apply for September 2025",
            color: "from-red-500 to-red-700",
            urgency: "⚠️ Apply NOW — offers are already being made"
        },
        {
            id: 2,
            title: "January 2026 Intake",
            badge: "✅ Less Competition",
            badgeColor: "bg-green-600",
            applicationWindow: "July 2025 – October 2025",
            status: "Coming Soon",
            features: [
                "Ideal if you missed September 2025 deadline",
                "Less competition — faster offer turnaround",
                "Many universities offer MOI waiver",
                "Strong for MBA, MS in Business & Data Science",
                "Perfect for students finishing exams in Nov 2025"
            ],
            cta: "Apply for January 2026",
            color: "from-green-500 to-green-700",
            urgency: "Perfect backup option with less competition"
        }

    ];

    return (
        <section className="py-20 px-5 bg-[#F8F6F2]">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 font-bold text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 border border-red-100">
                        📅 UK University Intakes 2025–26
                    </span>
                    <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 !leading-[1.3] mb-4">
                        Choose Your Perfect <span className="text-red-600">UK Intake</span>
                    </h2>
                    <p className="text-gray-600 text-base max-w-2xl mx-auto">
                        Scroll down to explore different intake options. Cards will stack automatically as you navigate.
                    </p>
                </div>

                {/* Scroll Stack Container */}
                <div ref={containerRef} className="relative h-[300vh]">
                    <div className="sticky top-20 h-screen flex items-center justify-center">
                        {intakes.map((intake, index) => (
                            <ScrollCard
                                key={intake.id}
                                intake={intake}
                                index={index}
                                totalCards={intakes.length}
                                containerRef={containerRef}
                            />
                        ))}
                    </div>
                </div>

                {/* Scroll Progress Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                    {intakes.map((_, index) => (
                        <ScrollProgressDot key={index} index={index} totalCards={intakes.length} containerRef={containerRef} />
                    ))}
                </div>

            </div>
        </section>
    );
}

// Individual Scroll Card Component
function ScrollCard({ intake, index, totalCards, containerRef }) {
    const cardRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth the scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Calculate when this card should be active
    // Each card gets an equal portion of the scroll
    const cardStart = index / totalCards;
    const cardEnd = (index + 1) / totalCards;
    const cardRange = cardEnd - cardStart;

    // Transform values based on scroll progress
    const opacity = useTransform(
        smoothProgress,
        [cardStart - 0.1, cardStart, cardStart + cardRange * 0.3, cardEnd],
        [1, 1, 1, 1]
    );

    const scale = useTransform(
        smoothProgress,
        [cardStart - 0.1, cardStart, cardStart + cardRange * 0.3, cardEnd],
        [1, 1, 1, 1]
    );

    const y = useTransform(
        smoothProgress,
        [cardStart - 0.1, cardStart, cardStart + cardRange * 0.3, cardEnd],
        [100, 0, 0, -20]
    );

    const zIndex = useTransform(
        smoothProgress,
        [cardStart, cardStart + cardRange * 0.3],
        [index, index + totalCards]
    );

    const rotateX = useTransform(
        smoothProgress,
        [cardStart + cardRange * 0.3, cardEnd],
        [0, 5]
    );

    return (
        <motion.div
            ref={cardRef}
            className="absolute w-full max-w-md"
            style={{
                opacity,
                scale,
                y,
                zIndex,
                rotateX
            }}
        >
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100">

                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${intake.color} p-6 pb-8`}>
                    <div className="flex items-center justify-between mb-3">
                        <span className={`${intake.badgeColor} text-white font-bold text-xs px-4 py-1.5 rounded-full tracking-wide shadow-lg flex items-center gap-2`}>
                            <span className="animate-pulse">●</span>
                            {intake.badge}
                        </span>
                        <span className="text-white/80 text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
                            {intake.status}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white font-serif">
                        {intake.title}
                    </h3>
                </div>

                {/* Card Body */}
                <div className="p-6 -mt-4">
                    {/* Application Timeline */}
                    <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                            <p className="text-xs text-gray-500">Application Window</p>
                            <p className="font-semibold text-gray-800 text-sm">{intake.applicationWindow}</p>
                        </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2.5 mb-6">
                        {intake.features.map((feature, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-2.5 text-sm text-gray-700"
                            >
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0 mt-1.5" />
                                {feature}
                            </motion.li>
                        ))}
                    </ul>

                    {/* Urgency Note */}
                    <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-800 font-medium">{intake.urgency}</p>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        {intake.cta}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </motion.button>
                </div>

                {/* Card Number */}
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/20 to-transparent rounded-br-full" />
            </div>
        </motion.div>
    );
}

// Progress Dot Component
function ScrollProgressDot({ index, totalCards, containerRef }) {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const cardStart = index / totalCards;
    const cardEnd = (index + 1) / totalCards;

    const isActive = useTransform(
        scrollYProgress,
        [cardStart - 0.05, cardStart, cardEnd - 0.05, cardEnd],
        [0, 1, 1, 0]
    );

    return (
        <motion.div
            className="h-2 rounded-full bg-gray-300"
            style={{
                width: isActive,
                minWidth: 16,
                maxWidth: 40,
                backgroundColor: isActive,
            }}
        />
    );
}


export function UKScholarships({ content }) {


    return (
        <section className="bg-white py-12 px-5">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className=" mb-12">
                    <h2 className="text-2xl lg:text-5xl xl:text-[2.4rem]  font-bold text-gray-800 !leading-[1.3] mb-4">
                        {content?.sections[6]?.content?.sectiontitle}
                    </h2>

                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                        {content?.sections[6]?.content?.sectionsubtitle}

                    </p>
                </div>

                {/* Scholarships Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

                    <ScholarshipCard content={content} />

                </div>

            </div>
        </section>
    );
}

// Individual Scholarship Card Component
function ScholarshipCard({ content }) {
    return (
        <>
            {content?.sections[6]?.content?.scholarshipcards?.map((item, index) => {

                const icons = ["🇬🇧", "🏆", "🌍", "🏫", "🎓", "🇮🇳"];

                const bgColors = [
                    "from-red-50 to-amber-50",
                    "from-amber-50 to-yellow-50",
                    "from-blue-50 to-indigo-50",
                    "from-green-50 to-emerald-50",
                    "from-purple-50 to-pink-50",
                    "from-red-50 to-orange-50"
                ];

                const amountColors = [
                    "text-red-600",
                    "text-amber-600",
                    "text-blue-600",
                    "text-green-600",
                    "text-purple-600",
                    "text-red-600"
                ];

                const scholarship = {
                    name: item?.cardtitle,
                    tag: item?.cardbadge,
                    description: item?.cardsubtitle,
                    amount: item?.cardtags,
                    icon: icons[index] || "🎓",
                    bgColor: bgColors[index] || "from-gray-50 to-white",
                    amountColor: amountColors[index] || "text-gray-600"
                };

                const handleGetStarted = () => {

                    window.dispatchEvent(new CustomEvent('openFooterModal'));
                };




                return (
                    <Link
                        href={item?.slug || "#"}
                        onClick={!item?.slug ? handleGetStarted : undefined}
                    >
                        <div
                            key={index}
                            className={`group relative bg-gradient-to-br ${scholarship.bgColor} border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-200/50 hover:border-gray-300 overflow-hidden`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >

                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Tag */}
                            {scholarship.tag && (
                                <div className="absolute bg-red-600 text-white text-sm rounded-bl-2xl font-bold px-3 py-2 top-0 right-0 z-10">
                                    {scholarship.tag}
                                </div>
                            )}

                            {/* Name */}
                            <h3 className="relative z-10 text-lg font-bold text-gray-800 my-3 group-hover:text-red-600 transition-colors duration-300">
                                {scholarship.name}
                            </h3>

                            {/* Description */}
                            <p className="relative z-10 text-sm font-medium text-gray-600 leading-relaxed mb-5 line-clamp-4">
                                {scholarship.description}
                            </p>

                            {/* Amount */}
                            <div className="relative z-10 flex items-center justify-between">
                                <span className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm ${scholarship.amountColor} font-bold text-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm`}>
                                    <DynamicIcon name="Coins" size={16} />
                                    {scholarship.amount}
                                </span>

                                <svg
                                    className="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>

                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/30 to-transparent rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Left Border */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-amber-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-l-2xl" />
                        </div>
                    </Link>
                );
            })}</>
    );
}



export function UKUniversityIntakes({ content }) {


    // Determine grid layout based on number of cards
    const getGridClass = (count) => {
        if (count === 1) return "grid-cols-1 max-w-2xl mx-auto";
        if (count === 2) return "grid-cols-1 lg:grid-cols-2";
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    };

 const handleGetStarted = () => {

    window.dispatchEvent(new CustomEvent('openFooterModal'));
  };


    return (
        <section className="bg-[#F8F6F2] py-12 px-5">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className=" mb-12">
                    <h2 className="text-2xl lg:text-4xl xl:text-[2.4rem] font-bold text-gray-800 !leading-[1.3] mb-4">
                        {content?.sections[4]?.content?.sectiontitle}
                    </h2>

                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                        {content?.sections[4]?.content?.sectionsubtitle}

                    </p>
                </div>

                {/* Intake Cards Grid - Dynamic based on count */}
                <div className={`grid gap-6 lg:gap-8 mb-12 ${getGridClass(content?.sections[4]?.content?.intakecards?.length)}`}>

                    <IntakeCard

                        content={content}
                    />

                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <a
                        onClick={handleGetStarted}
                        className="inline-flex items-center text-base gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg shadow-red-200 hover:shadow-red-300 hover:-translate-y-1 group"
                    >
                        Get Free Intake Counselling
                        <svg
                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>

            </div>
        </section>
    );
}

// Individual Intake Card Component
function IntakeCard({ content }) {

     const handleGetStarted = () => {

    window.dispatchEvent(new CustomEvent('openFooterModal'));
  };


    return (
        <>
            {content?.sections[4]?.content?.intakecards?.map((item, index) => {

                const features = item?.cardlist?.split("//") || [];
                const universities = item?.cardfeature?.split(",") || [];

                const intake = {
                    title: item?.cardtitle,
                    badge: item?.cardtag,
                    features,
                    universities,
                    isPrimary: index === 0
                };

                return (
                    <div
                        key={index}
                        className={`group relative bg-white border-2 rounded-2xl p-6 lg:p-8 transition-all duration-500 overflow-hidden hover:-translate-y-2
            ${intake.isPrimary
                                ? "border-red-200 hover:border-red-400 hover:shadow-2xl hover:shadow-red-100/50"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-xl"
                            }
            `}
                    >

                        <div className={`absolute inset-0 bg-gradient-to-br ${intake.isPrimary
                            ? "from-red-50/80 to-amber-50/50"
                            : "from-gray-50/80 to-white/50"
                            } opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                        {/* Badge */}
                        <div className="absolute top-0 right-0 bg-red-600 rounded-bl-2xl text-white text-sm font-bold py-2 px-4 z-10">
                            {intake.badge}
                        </div>

                        {/* Title */}
                        <h3 className="relative z-10 text-2xl lg:text-3xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300">
                            {intake.title}
                        </h3>

                        {/* Features */}
                        <ul className="relative z-10 space-y-0 mt-3 mb-3">
                            {intake.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm">
                                    <span className="text-lg text-gray-400">•</span>
                                    <span className="text-gray-600">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Universities */}
                        <div className="relative z-10 mb-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <DynamicIcon name="Building" size={12} />
                                Featured Universities
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {intake.universities.map((uni, i) => (
                                    <span
                                        key={i}
                                        className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200"
                                    >
                                        {uni}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Button */}
                        <a
                            onClick={handleGetStarted}
                            className="relative z-10 block w-full text-center text-sm bg-red-600 text-white font-bold py-2.5 px-6 rounded-full transition-all duration-300 shadow-lg"
                        >
                            Apply Now
                        </a>

                        {/* Index */}
                        <div className={`absolute top-0 left-0 p-2 px-4 rounded-br-2xl flex items-center justify-center font-bold text-sm shadow-lg
            ${intake.isPrimary ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"}
            `}>
                            {index + 1}
                        </div>
                    </div>
                );
            })}
        </>
    );
}