"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import HeroSection from '@/components/hero-section';
import { useGlobal } from '@/hooks/AppStateContext';
import Image from 'next/image';

function About() {
  const [pageTitle, setPageTitle] = useState('');
  const [description, setDescription] = useState('');
  const [, setPageName] = useState('');
  const [, setHtmlData] = useState('');
  const [form, setform] = useState([]);
  const [nationalOfc, setNationalofc] = useState(11);
  const [interNationalOfc, setInterNationalOfc] = useState(11);
  const [students, setStudents] = useState(1000000);
  const [experience, setExperience] = useState(15);

  const { aboutPage: data, teamMembers: member } = useGlobal();

  useEffect(() => {
    if (data?.page) {
      setPageTitle(data.page.pageTitle || '');
      setPageName(data.page.pageName || '');
      setHtmlData(data.page.htmldes || '');
      setDescription(data.page.description || '');
      setExperience(data.page.experience || 0);
      setInterNationalOfc(data.page.interNationalOfc || 0);
      setNationalofc(data.page.nationalOfc || 0);
      setStudents(data.page.students || 0);
    }
    if (member?.member) {
      setform(member.member || []);
    }
  }, [data, member]);

  const [counted, setCounted] = useState(0);
  const handleScroll = () => {
    if (counted == 0 && window.scrollY > 200) {
      document.querySelectorAll('.count').forEach(element => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 5000;
        let start;
        const updateCounter = timestamp => {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const increment = (target / duration) * progress;
          element.innerText = Math.ceil(increment);
          if (progress < duration) {
            requestAnimationFrame(updateCounter);
          } else {
            element.innerText = target;
          }
        };
        requestAnimationFrame(updateCounter);
      });
      setCounted(1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [counted]);

  return (
    <>
      <div>
        <HeroSection
          type="about"
          title={'About Us'}
          description={`<p>Gateway Abroad: Your Launchpad to Global Education
                      We empower students to achieve their dreams of studying abroad with expert coaching for: IELTS, TOEFL, PTE, GRE, GMAT, SAT
                      Our experienced faculty, personalized guidance, and proven track record helps navigate admissions, secure scholarships, hence ensure success.
                      <br /><br /> Join us and unlock your limitless potential!</p>`}
          image={`/img/about-us-banner-img.svg`}
        />

        {/* About Us Section */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container-sm mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl ">
            {/* First Section */}
            <div className="mb-12 md:mb-16">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="w-full md:w-2/5">
                  <div className="flex justify-center">
                    <Image
                      src="/img/about-us-img-1.svg"
                      alt="About Us Image 1"
                      width={400}
                      height={300}
                      className="w-full max-w-xs sm:max-w-sm md:max-w-md"
                    />
                  </div>
                </div>
                <div className="w-full md:w-3/5 sm:px-[3rem]">
                  <div className="md:pl-6 lg:pl-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 pb-3 md:pb-4">
                      Who Are We?
                    </h2>
                    <p className="text-gray-700 text-base sm:text-lg leading-6 sm:leading-7 text-justify">
                      {pageTitle || 'Gateway Abroad is run by a team of British education consultants who have themselves been students in various UK universities for a number of years. We are connected to a large network of overseas students and staff currently studying or working in universities throughout the UK. Through this network and through our in-house experience, we are able to find the best solution for each student, depending on specific requirements.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-12 md:my-16 border-gray-300" />

            {/* Second Section */}
            <div>
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="w-full md:w-3/5 order-2 md:order-1">
                  <div className="md:pr-6 lg:pr-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 pb-3 md:pb-4">
                      What Will We Do for You?
                    </h2>
                    <p className="text-gray-700 text-base sm:text-lg leading-6 sm:leading-7 text-justify">
                      {description || 'Gateway Abroad will be your direct window to British further education. Selecting a university for postgraduate studies in an unfamiliar country can be a daunting task. Gateway Abroad will help you to find the right university, based on your individual requirements. Once a pre-selection is made, we can contact the institutions and make all enquiries and admissions arrangements on your behalf.'}
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-2/5 order-1 md:order-2">
                  <div className="flex justify-center">
                    <Image
                      src="/img/about-us-img-2.svg"
                      alt="About Us Image 2"
                      width={400}
                      height={300}
                      className="w-full max-w-xs sm:max-w-sm md:max-w-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Counter Section */}
        <section className="py-16 md:py-24 lg:py-36 px-4 sm:px-6 lg:px-[82px] relative bg-[rgb(231,214,214)]">
          {/* Background Pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("/img/number-counter-bg.svg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-[7rem] max-w-6xl relative z-10">
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-3">
              {/* National Office Counter */}
              <div className="py-6 sm:py-8 md:py-[45px] text-center w-full rounded-[16px] bg-white/80 dark:bg-gray-800/80 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-center">
                  <h4
                    className="count text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 dark:text-white mb-2"
                    data-target={nationalOfc}
                  >
                    {nationalOfc}
                  </h4>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 dark:text-white mb-2">+</span>
                </div>
                <p className="text-black dark:text-white text-sm sm:text-base font-medium dark:font-semibold">National Office</p>
              </div>

              {/* International Office Counter */}
              <div className="py-6 sm:py-8 md:py-[45px] text-center w-full rounded-[16px] bg-white/80 dark:bg-gray-800/80 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-center">
                  <h4
                    className="count text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 dark:text-white mb-2"
                    data-target={interNationalOfc}
                  >
                    {interNationalOfc}
                  </h4>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 dark:text-white mb-2">+</span>
                </div>
                <p className="text-black dark:text-white text-sm sm:text-base font-medium dark:font-semibold">International Office</p>
              </div>

              {/* Students Counter */}
              <div className="py-6 sm:py-8 md:py-[45px] text-center w-full rounded-[16px] bg-white/80 dark:bg-gray-800/80 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-center">
                  <h4
                    className="count text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 dark:text-white mb-2"
                    data-target={students}
                  >
                    {students}
                  </h4>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 dark:text-white mb-2">+</span>
                </div>
                <p className="text-black dark:text-white text-sm sm:text-base font-medium dark:font-semibold">Students</p>
              </div>

              {/* Experience Counter */}
              <div className="py-6 sm:py-8 md:py-[45px] text-center w-full rounded-[16px] bg-white/80 dark:bg-gray-800/80 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-center">
                  <h4
                    className="count text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 dark:text-white mb-2"
                    data-target={experience}
                  >
                    {experience}
                  </h4>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 dark:text-white mb-2">+</span>
                </div>
                <p className="text-black dark:text-white text-sm sm:text-base font-medium dark:font-semibold">Experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-8 md:mb-12 pb-3 md:pb-4 inline-block">
              People behind Gateway Abroad
            </h2>
            <div className="pt-6 md:pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 justify-items-center">
                {form.map((m) => (
                  <div key={m._id} className="bg-[#fcedf0] rounded-xl shadow-lg overflow-hidden border border-gray-200 w-full max-w-[550px]">
                    {/* Header */}
                    <div className="bg-red-600 px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-white">{m.name}</h4>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                      <div className="h-48 sm:h-[260px] overflow-y-auto pe-3 sm:pe-[15px]">
                        <p className="text-[#666276] text-justify text-sm sm:text-base font-medium leading-5 sm:leading-6">
                          {m.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

       {/* ====== Counselling Session Section ====== */}
<section className="py-12 md:py-16 bg-white">
  <div className="container mx-auto px-4 max-w-7xl">
    <div className="bg-[#fbe7ea] rounded-2xl sm:rounded-[24px] shadow-lg mx-auto w-full max-w-[1127px]">
      {/* Content container with specific padding */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
          <div className="w-full lg:w-[48%]">
            <div className="text-center lg:text-left pl-[17px]">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[36px] font-bold mb-4 text-[#D71635] lg:leading-[37px]">
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
              <img
                src="img/counselling-session.svg"
                alt="Counselling Session"
                className="w-full max-w-xs sm:max-w-sm lg:max-w-[25rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      </div>
    </>
  );
}

export default About;