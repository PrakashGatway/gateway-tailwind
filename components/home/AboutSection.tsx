"use client"

import React from 'react';
import * as Icons from "lucide-react";

const About = ({ content }) => {


  const handleGetStarted = () => {

    window.dispatchEvent(new CustomEvent('openFooterModal'));
  };




  return (
    <section id="about" className="py-12 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">

          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-[#EAF2FD] rounded-full px-3 sm:px-4 py-1.5 animate-fade-up">
              <span className="text-[10px] sm:text-sm font-bold text-[#0C447C] tracking-wider uppercase">
                {content?.label}
              </span>
            </div>

            {/* Heading */}
            <h2 className=" text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight animate-fade-up delay-100">
              {content?.title}

            </h2>

            {/* Body Text - Minimum font sizes for mobile */}
            <div className="space-y-3 sm:space-y-4 animate-fade-up delay-200">
              {/* <p
  className={`[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-0 [&_li]:leading-tight [&_li]:mb-0`}
  dangerouslySetInnerHTML={{
    __html: content?.subtitle || "",
  }}
></p> */}

            </div>


          </div>

          {/* Right Content - Metrics + Story Card */}
          <div className="space-y-4 sm:space-y-6">



            {/* Story Card */}
            <div className="bg-surface rounded-r12 p-4 sm:p-6 border border-border">
              <div
                dangerouslySetInnerHTML={{
                  __html: content?.howwehelp[0]?.description
                }}

                className="text-sm sm:text-base text-justify leading-relaxed"
              />



              {/* Visa Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#EAF3DE] rounded px-2.5 sm:px-3 py-1.5 sm:py-2 mt-3 sm:mt-4">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#166534" strokeWidth="2" />
                </svg>
                <span className="text-[10px] sm:text-xs font-bold text-[#166534]">
                  {content?.howwehelp[0]?.tag}
                </span>
              </div>
            </div>

          </div>

        </div>
        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6 animate-fade-up delay-300">
          {content?.service?.map((pillar, idx) => {
            const Icon = Icons[pillar.icon] || Icons.HelpCircle; // fallback

            return (
              <div
                key={idx}
                className=" bg-surface rounded-r12 p-4 sm:p-5 border border-border hover:border-brand hover:-translate-y-0.5"
              >
                <div className='flex items-center '>
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-100 flex items-center justify-center mb-2.5 sm:mb-3 mr-2 `}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D81635]" />
                  </div>
                  <h3 className="text-base sm:text-base font-bold  mb-3">{pillar.title}</h3>
                </div>
                <p className="text-sm sm:text-sm " dangerouslySetInnerHTML={{
                  __html: pillar.description || ""
                }} />
              </div>
            )
          })}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mt-4 sm:mt-6 animate-fade-up delay-300">
          <button
            onClick={handleGetStarted}
            className="bg-[#D81635] rounded-lg hover:shadow-md hover:-translate-y-0.5 hover:bg-mid text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-r8 text-xs sm:text-sm transition-colors"
          >
            {content?.btn1}
          </button>
          <a
            href="/about"
            className="border-2 border-brand rounded-lg hover:shadow-md hover:-translate-y-0.5 text-brand hover:bg-brand  font-semibold py-2 sm:py-2.5 px-5 sm:px-5.5 rounded-r8 text-xs sm:text-sm transition-all inline-flex items-center"
          >
            {content?.btn2}
          </a>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s ease both;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </section>
  );
};

export default About;