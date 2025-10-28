"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Changed from react-router-dom
import HeroSection from '@/components/hero-section';
import { useGlobal } from '@/hooks/AppStateContext';


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
        <HeroSection type="about" title={'About Us'} description={`<p>Gateway Abroad: Your Launchpad to Global Education
                      We empower students to achieve their dreams of studying abroad with expert coaching for: IELTS, TOEFL, PTE, GRE, GMAT, SAT
                      Our experienced faculty, personalized guidance, and proven track record helps navigate admissions, secure scholarships, hence ensure success.
                      <br /><br /> Join us and unlock your limitless potential!</p>`} image={`/img/about-us-banner-img.svg`} />

        <section className="about-us-sec py-70">
          <div className="container">
            <div className="about-us-inner">
              <div className="row align-items-center">
                <div className="col-md-5">
                  <div className="about-us-left-new">
                    {/* Ensure image path is correct for Next.js public directory */}
                    <img src="/img/about-us-img-1.svg" alt="About Us Image 1" />
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="about-us-right-new ps-3">
                    <h2 className="heading">Who Are We?</h2>
                    <p style={{ textAlign: 'left' }} className="descp !text-justify">{pageTitle ? pageTitle : 'Gateway Abroad is run by a team of British education consultants who have themselves been students in various UK universities for a number of years. We are connected to a large network of overseas students and staff currently studying or working in universities throughout the UK. Through this network and through our in-house experience, we are able to find the best solution for each student, depending on specific requirements.'}</p>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="about-us-inner">
              <div className="row align-items-center">
                <div className="col-md-7">
                  <div className="about-us-right-new ps-3">
                    <h2 className="heading">What Will We Do for You?</h2>
                    <p style={{ textAlign: 'left' }} className="descp !text-justify">{description ? description : 'Gateway Abroad will be your direct window to British further education. Selecting a university for postgraduate studies in an unfamiliar country can be a daunting task. Gateway Abroad will help you to find the right university, based on your individual requirements. Once a pre-selection is made, we can contact the institutions and make all enquiries and admissions arrangements on your behalf.'}</p>
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="about-us-left-new">
                    {/* Ensure image path is correct for Next.js public directory */}
                    <img src="/img/about-us-img-2.svg" alt="About Us Image 2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="number-counter-section">
          <div className="container">
            <div className="number-counter-inner">
              <div className="counter-box">
                <h4 className="count" data-target={nationalOfc}>{nationalOfc}</h4>
                <p>National Office</p>
              </div>
              <div className="counter-box">
                <h4 className="count" data-target={interNationalOfc}>{interNationalOfc}+</h4>
                <p>International Office</p>
              </div>
              <div className="counter-box">
                <h4 className="count" data-target={students}>{students}+</h4>
                <p>Students</p>
              </div>
              <div className="counter-box">
                <h4 className="count" data-target={experience}>{experience}+</h4>
                <p>Experience</p>
              </div>
            </div>
          </div>
        </section>

        <section className="people-behind-us-section py-70">
          <div className="container">
            <h2 className="heading text-center d-block">People behind Gateway Abroad</h2>
            <div className="behind-us-inner pt-4">
              <div className="row gy-4 justify-content-center">
                {form.map((m) => (
                  <div className="col-lg-6 col-md-6" key={m._id}>
                    <div className="profile-card">
                      <div className="top-red-header">
                        <h4>{m.name}</h4>
                      </div>
                      <div className="profile-card-body">
                        <div className="scroll-container">
                          <p className="descp">{m.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="app-banner-section counselling-session-sec">
          <div className="container">
            <div className="app-banner-section-inner counselling-session-sec-inner">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="app-banner-content-left">
                    <h2 className="mb-3">Avail A Complementary Counselling Session</h2>
                    <p className="mb-4">Join thousand of instructors and earn money hassle free!</p>
                    {/* Changed Link import and usage for Next.js */}
                    <Link href='/contact' className='site-btn'>Contact us</Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="app-banner-content-right text-center">
                    {/* Ensure image path is correct for Next.js public directory */}
                    <img src="/img/counselling-session.svg" alt="Counselling Session" />
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