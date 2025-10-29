"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For App Router
import { useForm } from 'react-hook-form'; // Import useForm
import Slider from 'react-slick';
import { slider2settings, settings, youtubeSlider, blogSlider, testimonialSlider } from '@/custom/custom'; // Ensure path is correct
import PageServices from '@/services/PageServices'; // Ensure path is correct
import { constant } from '@/constant/index.constant.js'; // Ensure path is correct
import HeroSection from '../hero-section';
import AboutSection from '../about-section';
import TestPreparation from '../TestPreparationSection';
import { useGlobal } from '@/hooks/AppStateContext';
import Swal from 'sweetalert2';
import StudentInfoSection from './StudentSlider';
import StudentRankSection from './StudentSlider';

function Index() {
  const router = useRouter(); // For App Router
  const [blogData, setBlogData] = useState([]);
  const [video, setVideo] = useState([]);
  const [sliderData, setSliderData] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const { homePage: homePageDetails, course: CourseData, aboutPage: aboutPageData, testimonials: testimonials, youtubeVideo: videoStudednt, studentSlider: slider, studentHome: slider2 } = useGlobal();

  const fetchBlogs = useCallback(async (page = 1, category = 'All', search = '') => {
    try {
      const res = await PageServices.getBlogData({ page, limit: 5, category, search });
      setBlogData(res.data.blog || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  }, []);


  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (videoStudednt?.media) {
      setVideo(videoStudednt.media);
    }
    if (slider?.media) {
      setSliderData(slider?.media);
    }
    if (slider2?.media) {
      setStudentData(slider2?.media);
    }
  }, [slider, slider2, videoStudednt]);


  const marqueeRef = useRef(null);

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors },
    reset: resetRegisterForm
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      studyDestination: '', // Default to empty string or a specific option if needed
      query: ''
    }
  });

  const handleUpdate = async (data) => { // 'data' now contains validated form values
    const { name, email, mobile, studyDestination, query } = data;
    try {
      const createJob = await PageServices.createForme({
        name,
        email,
        mobileNo: mobile,
        message: query,
        studyDestination,
        type: 'register'
      });
      if (createJob.status === 'success') {
        resetRegisterForm();
        Swal.fire({
          title: "Success",
          text: "Thanks for registering!",
          icon: "success",
          customClass: {
            popup: "swal-zindex"
          }
        });
      } else {
        alert('Something went wrong');
      }
    } catch (error) {
      console.error("Error submitting register form:", error);
      alert('An error occurred. Please try again.'); // Provide user feedback
    }
  };

  const {
    register: registerPartner,
    handleSubmit: handleSubmitPartner,
    formState: { errors: partnerErrors },
    reset: resetPartnerForm
  } = useForm({
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      mobile: '',
      whatsappNo: '',
      age: '',
      city: '',
      occupation: '',
      adress: '', // Note: Typo in state name 'adress' kept for consistency with original logic
      howDidyouKnow: '',
      qualifications: '',
      query: ''
    }
  });

  const handleUpdate2 = async (data) => { // 'data' now contains validated form values
    const {
      name, lastName, email, mobile, whatsappNo, age, city,
      occupation, adress, howDidyouKnow, qualifications, query
    } = data;
    try {
      const createJob = await PageServices.createForme({
        name,
        email,
        mobileNo: mobile,
        lastName,
        whatsappNo,
        city,
        age,
        occupation,
        adress, // Keep typo for consistency
        howDidyouKnow,
        qualification: qualifications,
        message: query,
        type: 'partner'
      });

      if (createJob.status === 'success') {
        resetPartnerForm();
        const modalEl = document.getElementById("partnerModal");
        modalEl.classList.remove("show");
        modalEl.style.display = "none";
        modalEl.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();// ✅ safer method
        Swal.fire({
          title: "Success",
          text: 'thanks for your submission!',
          icon: "success",
          customClass: {
            popup: "swal-zindex"
          }
        });
      } else {
        alert('Something went wrong');
      }
    } catch (error) {
      console.error("Error submitting partner form:", error);
      alert('An error occurred. Please try again.'); // Provide user feedback
    }
  };


  return (
    <>
      <HeroSection title={homePageDetails?.Title} description={homePageDetails?.Description} image={`${constant.REACT_APP_URL}/uploads/${homePageDetails?.image}`} />
      <section className="py-20">
        <div className="container-sm max-w-7xl mx-auto">
          <h2 className="text-2xl lg:text-[2rem] font-bold leading-[1.1] mb-6">About us</h2>
          <div className="about-us-inner">
            <AboutSection aboutUs={aboutPageData?.page} />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-[2rem] font-bold text-center mb-12">
            Best in the Industry Coaching Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 justify-items-center">
            {constant.TEST_PREPARATION.map((x) => {
              return (
                <div key={x.text1} className="w-full max-w-[200px]">
                  <div className="text-center p-2 transition-all duration-300 hover:transform hover:scale-105">
                    <img
                      className="mx-auto w-16 h-16 md:w-28 md:h-28 object-contain"
                      src={`/img/${x.imageName}`}
                      alt={x.imageName}
                    />
                    <p className="text-sm md:text-base text-gray-800 dark:text-gray-300 mt-1 leading-relaxed">
                      {x.text1}
                      {x.text2 && <br />}
                      {x.text2}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <StudentRankSection/>

      <section className="student-info-sec linear-bg">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="students-info-left">
                <h3 className="sub-heading text-center">
                  Established in <span>2009</span>, this institute is a leader in preparing students for standardized tests like GMAT, GRE, SAT, TOEFL, IELTS, and PTE.
                </h3>
                {studentData.length === 1 ? (
                  <div className="student-info-slider">
                    <div className="student-info-slider-inner">
                      <div className='st-img-field'>
                        {/* Ensure image path is correct for Next.js public directory */}
                        <img src={`${constant.REACT_APP_URL}/uploads/${studentData?.[0].image}`} alt='icon' />
                        <div className='student-info-name-rank'>
                          <div className='st-name'><h5>{studentData[0].name}</h5></div>
                          <div className='st-rank'><p>{studentData[0].courseName} Score</p><h5>{studentData[0].rank}</h5></div>
                        </div>
                      </div>
                      <h6>{studentData[0].content}</h6>
                    </div>
                  </div>
                ) : (
                  <Slider {...slider2settings} className="student-info-slider">
                    {studentData.map((s) => (
                      <div key={s.image} className="student-info-slider-inner">
                        <div className='st-img-field'>
                          {/* Ensure image path is correct for Next.js public directory */}
                          <img src={`${constant.REACT_APP_URL}/uploads/${s.image}`} alt='Student Profile' />
                          <div className='student-info-name-rank'>
                            <div className='st-name'><h5>{s.name}</h5></div>
                            <div className='st-rank'><p>{s.courseName} Score</p><h5>{s.rank}</h5></div>
                          </div>
                        </div>
                        <h6>{s.content}</h6>
                      </div>
                    ))}
                  </Slider>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="students-info-right">
                <div className="register-form">
                  <h3 className="sub-heading text-center text-uppercase">Register Now</h3>
                  {/* --- Updated Register Form --- */}
                  <form onSubmit={handleSubmitRegister(handleUpdate)}>
                    <div className="input-field">
                      <input
                        type="text"
                        {...registerRegister("name", { required: "Name is required" })}
                        className={`form-control ${registerErrors.name ? 'is-invalid' : ''}`}
                        placeholder="Name"
                      />
                      {registerErrors.name && <div className="invalid-feedback">{registerErrors.name.message}</div>}
                    </div>
                    <div className="input-field">
                      <input
                        type="email"
                        {...registerRegister("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address"
                          }
                        })}
                        className={`form-control ${registerErrors.email ? 'is-invalid' : ''}`}
                        placeholder="Email"
                      />
                      {registerErrors.email && <div className="invalid-feedback">{registerErrors.email.message}</div>}
                    </div>
                    <div className="input-field">
                      <input
                        type="text"
                        {...registerRegister("mobile", {
                          required: "Phone is required",
                          pattern: {
                            value: /^\d{10,15}$/, // Adjust pattern as needed
                            message: "Invalid phone number"
                          }
                        })}
                        className={`form-control ${registerErrors.mobile ? 'is-invalid' : ''}`}
                        placeholder="Phone"
                      />
                      {registerErrors.mobile && <div className="invalid-feedback">{registerErrors.mobile.message}</div>}
                    </div>
                    <div className="input-field">
                      <select
                        {...registerRegister("studyDestination", { required: "Test Preparation is required" })}
                        className={`form-select ${registerErrors.studyDestination ? 'is-invalid' : ''}`}
                        aria-label="Default select example"
                      >
                        <option value="">Test Preparation</option>
                        <option value='GMAT'>GMAT</option>
                        <option value='IELTS'>IELTS</option>
                        <option value="TOEFL">TOEFL</option>
                        <option value="GRE">GRE</option>
                        <option value="PTE">PTE</option>
                        <option value="SAT">SAT</option>
                      </select>
                      {registerErrors.studyDestination && <div className="invalid-feedback">{registerErrors.studyDestination.message}</div>}
                    </div>
                    <div className="input-field">
                      <textarea
                        {...registerRegister("query")}
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows={2}
                        placeholder="Message"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">SUBMIT</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="student-info-rank-sec">
        <div className="established-sec">
          <p>Since 2009</p>
        </div>
        <Slider {...settings} className="student-info-rank-slider">
          {sliderData.map((s, index) => (
            <div key={index} className="student-info-rank-inner">
              <p className="st-name">{s.name}</p>
              <p className="st-uni-name">{s.courseName} {s.rank}</p>
            </div>
          ))}
        </Slider>
      </section>

      <marquee
        ref={marqueeRef}
        className="marquee-product"
        behavior="alternate"
        direction="right"
        // scrollAmount={5}
        onMouseEnter={() => marqueeRef.current?.stop()}
        onMouseLeave={() => marqueeRef.current?.start()}
      >
        {sliderData.map((s, index) => (
          <small key={index} id="studentname">
            {s.name} {s.courseName} <small id="studentscores">{s.rank}</small>
          </small>
        ))}
      </marquee>
      

      <section className="test-preparation-sec py-70">
        <div className="container">
          <h2 className="heading bottom-divider">Test Preparation</h2>
          <div className="row gy-4 justify-content-center">
            <TestPreparation CourseData={CourseData?.page} />
          </div>
        </div>
      </section>

    <div className="box-border caret-transparent mt-12 pt-12">
      <div className="box-border caret-transparent flex flex-wrap -mx-3">
        <div className="relative box-border caret-transparent shrink-0 max-w-full min-h-0 min-w-0 text-right w-full px-3 right-5 md:min-h-[auto] md:min-w-[auto] md:w-[33.3333%]">
          <div className="static box-border caret-transparent text-left w-full mx-auto my-5 top-[18px] md:absolute md:text-right md:m-0 md:top-12">
            <div className="relative box-border caret-transparent text-left md:static md:text-right">
              <img
                alt="ampityinfotech"
                src="https://c.animaapp.com/mhagjno9ooS9eW/assets/vetting2.svg"
                className="box-border caret-transparent h-[70px] max-w-full text-left ml-auto md:h-auto md:text-right"
              />
              <h3 className="text-teal-700 text-base font-bold box-border caret-transparent leading-[30px] text-left mb-2 md:text-xl md:font-semibold md:text-right">
                Teach
              </h3>
              <p className="text-zinc-500 text-sm font-medium box-border caret-transparent leading-5 text-left mb-4 md:text-right">
                Guiding individuals through a comprehensive process aimed at
                clearing the fundamentals of the students.
              </p>
            </div>
          </div>
          <div className="static box-border caret-transparent text-left w-full mx-auto my-5 top-[220px] md:absolute md:text-right md:m-0 md:top-[284px]">
            <div className="relative box-border caret-transparent text-left md:static md:text-right">
              <img
                alt="ampityinfotech"
                src="https://c.animaapp.com/mhagjno9ooS9eW/assets/vetting4.svg"
                className="box-border caret-transparent h-[70px] max-w-full text-left ml-auto md:h-auto md:text-right"
              />
              <h3 className="text-stone-500 text-base font-bold box-border caret-transparent leading-[30px] text-left mb-2 md:text-xl md:font-semibold md:text-right">
                Feedback &amp; Mock
              </h3>
              <p className="text-zinc-500 text-sm font-medium box-border caret-transparent leading-5 text-left mb-4 md:text-right">
                Regularly engage in mock exams and feedback sessions to
                familiarize yourself with the exam environment, improve time
                management, and identify areas that need further attention.
              </p>
            </div>
          </div>
          <div className="static box-border caret-transparent text-left w-full mx-auto my-5 top-[445px] md:absolute md:text-right md:m-0 md:top-[545px]">
            <div className="relative box-border caret-transparent text-left md:static md:text-right">
              <img
                alt="ampityinfotech"
                src="https://c.animaapp.com/mhagjno9ooS9eW/assets/vetting6.svg"
                className="box-border caret-transparent h-[70px] max-w-full text-left ml-auto md:h-auto md:text-right"
              />
            </div>
          </div>
        </div>
        <div className="box-border caret-transparent hidden shrink-0 max-w-full min-h-0 min-w-0 w-full px-3 md:block md:min-h-[auto] md:min-w-[auto] md:w-[33.3333%]">
          <div className="box-border caret-transparent">
            <img
              alt="ampityinfotech"
              src="https://c.animaapp.com/mhagjno9ooS9eW/assets/vaetting-process-number.svg"
              className="box-border caret-transparent max-w-full w-[90%] mx-auto"
            />
          </div>
        </div>
        <div className="relative box-border caret-transparent basis-0 grow shrink-0 max-w-full min-h-0 min-w-0 w-full px-3 md:basis-auto md:grow-0 md:min-h-[auto] md:min-w-[auto] md:w-[33.3333%]">
          <div className="static box-border caret-transparent top-[-55px] w-full mx-auto my-5 md:absolute md:top-[-45px] md:m-0">
            <div className="relative box-border caret-transparent md:static">
              <img
                alt="ampityinfotech"
                src="https://c.animaapp.com/mhagjno9ooS9eW/assets/vetting1.svg"
                className="box-border caret-transparent h-[70px] max-w-full md:h-auto"
              />
              <h3 className="text-amber-500 text-base font-bold box-border caret-transparent leading-[30px] mb-2 md:text-xl md:font-semibold">
                Counsell
              </h3>
              <p className="text-zinc-500 text-sm font-medium box-border caret-transparent leading-5 mb-4">
                It involves providing personalized advice to aid students in
                selecting the most suitable exam for their desired countries.
              </p>
            </div>
          </div>
          <div className="static box-border caret-transparent w-full mx-auto my-5 top-[130px] md:absolute md:m-0 md:top-44">
            <div className="relative box-border caret-transparent md:static">
              <img
                alt="ampityinfotech"
                src="https://c.animaapp.com/mhagjno9ooS9eW/assets/vetting3.svg"
                className="box-border caret-transparent h-[70px] max-w-[100px] md:h-auto"
              />
              <h3 className="text-red-400 text-base font-bold box-border caret-transparent leading-[30px] mb-2 md:text-xl md:font-semibold">
                Practice
              </h3>
              <p className="text-zinc-500 text-sm font-medium box-border caret-transparent leading-5 mb-4">
                Engaging in regular and focused practice not only enhances
                one&#39;s understanding of the material but also hones skills,
                refines problem-solving abilities, and builds confidence.
              </p>
            </div>
          </div>
          <div className="static box-border caret-transparent w-full mx-auto my-5 top-[325px] md:absolute md:m-0 md:top-[410px]">
            <div className="relative box-border caret-transparent md:static">
              <img
                alt="ampityinfotech"
                src="https://c.animaapp.com/mhagjno9ooS9eW/assets/vetting5.svg"
                className="box-border caret-transparent h-[70px] max-w-full md:h-auto"
              />
              <h3 className="text-orange-400 text-base font-bold box-border caret-transparent leading-[30px] mb-2 md:text-xl md:font-semibold">
                Book Test Date
              </h3>
              <p className="text-zinc-500 text-sm font-medium box-border caret-transparent leading-5 mb-4">
                Test date booking facility offered by Gateway Abroad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>


      <section className="mobile-vetting-process vetting-process-section py-60">
        <div className="container">
          <h2 className="heading text-center d-block mb-3">Our working Process</h2>
          <p className="descp text-center">
            A platform that takes care of everything beforehand. Gateway Abroad sources,<br /> vets, matches and manages all the talents.
          </p>
          <div className="vetting-process-section-inner pt-3">
            <div className="row">
              <div className="col-lg-4 col-md-12 col-sm-12 text-left" style={{ position: 'relative' }}>
                <div className="vetting-content vp4 vetting-left-p2">
                  <div className="vetting-box">
                    <div className="vetting-num">1</div>
                    {/* Ensure image path is correct for Next.js public directory */}
                    <img src="/img/vetting1.svg" alt="ampityinfotech" />
                    <h3 className="vetting-tittle" style={{ color: '#ffa515' }}>Counsell</h3>
                    <p className="vetting-subtittle">
                      It involves providing personalized advice to aid students in selecting the most suitable exam for their desired countries.
                    </p>
                  </div>
                </div>
                <div className="vetting-content vp1 vetting-left-p1">
                  <div className="vetting-box">
                    <div className="vetting-num">2</div>
                    {/* Ensure image path is correct for Next.js public directory */}
                    <img src="/img/vetting2.svg" alt="ampityinfotech" />
                    <h3 className="vetting-tittle" style={{ color: '#00817d' }}>Teach</h3>
                    <p className="vetting-subtittle">
                      Guiding individuals through a comprehensive process aimed at clearing the fundamentals of the students.
                    </p>
                  </div>
                </div>
                <div className="vetting-content vp5 vetting-left-p2">
                  <div className="vetting-box">
                    <div className="vetting-num">3</div>
                    {/* Ensure image path is correct for Next.js public directory */}
                    <img src="/img/vetting3.svg" alt="ampityinfotech" style={{ maxWidth: '100px' }} />
                    <h3 className="vetting-tittle" style={{ color: '#ff5e5b' }}>Practice</h3>
                    <p className="vetting-subtittle">
                      Engaging in regular and focused practice not only enhances one's understanding of the material but also hones skills, refines problem-solving abilities, and builds confidence.
                    </p>
                  </div>
                </div>
                <div className="vetting-content vp2 vetting-left-p1">
                  <div className="vetting-box">
                    <div className="vetting-num">4</div>
                    {/* Ensure image path is correct for Next.js public directory */}
                    <img src="/img/vetting4.svg" alt="ampityinfotech" />
                    <h3 className="vetting-tittle" style={{ color: '#7e5c6a' }}>Feedback & Mock</h3>
                    <p className="vetting-subtittle">
                      Regularly engage in mock exams and feedback sessions to familiarize yourself with the exam environment, improve time management, and identify areas that need further attention.
                    </p>
                  </div>
                </div>
                <div className="vetting-content vp6 vetting-left-p2">
                  <div className="vetting-box">
                    <div className="vetting-num">5</div>
                    {/* Ensure image path is correct for Next.js public directory */}
                    <img src="/img/vetting5.svg" alt="ampityinfotech" />
                    <h3 className="vetting-tittle" style={{ color: '#ff824b' }}>Book Test Date</h3>
                    <p className="vetting-subtittle">Test date booking facility offered by Gateway Abroad.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="student-yt-testimonials py-70">
        <div className="container">
          <h2 className="heading bottom-divider">What Our Students Say</h2>
          <Slider {...youtubeSlider} className="student-yt-slider">
            {video.map((video) => (
              <div className="student-yt-slider-inner" key={video._id}>
                <iframe
                  width={530}
                  height={310}
                  src={`https://www.youtube.com/embed/${video.mediaLink}`}
                  title="YouTube video player"
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <section className="our-testimonials py-70">
        <div className="container">
          <h2 className="heading bottom-divider mb-0">Our Testimonials</h2>
          {testimonials?.testimonial?.length === 1 ? (
            <div className="our-testimonials-slider-inner single-testmonial">
              <div className="student-test-box">
                <div className="stundent-content"> {/* Note: Typo in class name 'stundent-content' kept */}
                  <div className="d-flex align-items-center justify-content-between">
                    <h6>{testimonials?.testimonial[0]?.name}</h6>
                    <ul className="list-unstyled d-flex">
                      <li><span><i className="fa fa-star" /></span></li>
                      <li><span><i className="fa fa-star" /></span></li>
                      <li><span><i className="fa fa-star" /></span></li>
                      <li><span><i className="fa fa-star" /></span></li>
                      <li><span><i className="fa fa-star" /></span></li>
                    </ul>
                  </div>
                  <p className="descp">{testimonials?.testimonial[0]?.content.substring(0, 250)}</p>
                </div>
                <div className="test-univ-sec">
                  <h5></h5>
                </div>
              </div>
            </div>
          ) : (
            <Slider {...testimonialSlider} className="our-testimonials-slider">
              {testimonials?.testimonial?.map((test) => (
                <div className="our-testimonials-slider-inner" key={test._id}>
                  <div className="student-test-box">
                    <div className="stundent-content"> {/* Note: Typo in class name 'stundent-content' kept */}
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
                      <h5></h5>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </section>

      <section className="blog-section py-70">
        <div className="container">
          <div className="title d-flex justify-content-between align-items-center mb-4">
            <h2 className="heading bottom-divider mb-0">Important Facts &amp; Information</h2>
            {/* Changed Link usage for Next.js */}
            <Link href="/blog" className="ms-4 site-btn">Go to blog</Link>
          </div>
          <div className="blog-section-inner">
            <Slider {...blogSlider} className="blog-section-slider">
              {blogData.map((blog) => (
                // Changed onClick navigation for Next.js
                <div
                  onClick={() => router.push(`/blog-description/${blog.Slug}`)} // For App Router
                  // onClick={() => router.push(`/blog-description/${blog.Slug}`)} // For Pages Router (same method)
                  className="blog-section-slider-inner cursor-pointer p-2"
                  key={blog.id}
                >
                  <div className="blog-card">
                    <div className="card">
                      <div className="card-img-top">
                        {/* Ensure image path is correct for Next.js public directory */}
                        <img src={`${constant.REACT_APP_URL}/uploads/${blog.image}`} alt="blog-img" />
                      </div>
                      <div className="card-body ps-0 pb-0">
                        <h5 className="card-title">
                          {/* Changed Link usage for Next.js */}
                          <Link href={`/blog-description/${blog.Slug}`}>{blog.blogTitle}</Link>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
      {/* <PartnerSection/> */}
      <section className="app-banner-section">
        <div className="container">
          <div className="app-banner-section-inner">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="app-banner-content-left">
                  <h2 className="mb-3">Become a Partner</h2>
                  <p className="mb-4">Join thousand of instructors and earn money hassle free!</p>
                  <button className="site-btn" data-bs-toggle="modal" data-bs-target="#partnerModal">Apply Now</button>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="app-banner-content-right text-center">
                  <img className='mx-auto' src="/img/partner-img.svg" alt="partner" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="modal right fade" id="partnerModal" tabIndex={-1} aria-labelledby="partnerModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="partnerModalLabel">Become A Partner</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="get-in-touch-form">
                {/* --- Updated Partner Form --- */}
                <form onSubmit={handleSubmitPartner(handleUpdate2)}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-field">
                        <input
                          type="text"
                          {...registerPartner("name", { required: "First Name is required" })}
                          className={`form-control ${partnerErrors.name ? 'is-invalid' : ''}`}
                          placeholder="First Name"
                        />
                        {partnerErrors.name && <div className="invalid-feedback">{partnerErrors.name.message}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <input
                          type="text"
                          {...registerPartner("lastName", { required: "Last Name is required" })}
                          className={`form-control ${partnerErrors.lastName ? 'is-invalid' : ''}`}
                          placeholder="Last Name"
                        />
                        {partnerErrors.lastName && <div className="invalid-feedback">{partnerErrors.lastName.message}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <input
                          type="email"
                          {...registerPartner("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email address"
                            }
                          })}
                          className={`form-control ${partnerErrors.email ? 'is-invalid' : ''}`}
                          placeholder="Email"
                        />
                        {partnerErrors.email && <div className="invalid-feedback">{partnerErrors.email.message}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <input
                          type="text"
                          {...registerPartner("mobile", {
                            required: "Mobile No. is required",
                            pattern: {
                              value: /^\d{10,15}$/, // Adjust pattern as needed
                              message: "Invalid phone number"
                            }
                          })}
                          className={`form-control ${partnerErrors.mobile ? 'is-invalid' : ''}`}
                          placeholder="Mobile No."
                        />
                        {partnerErrors.mobile && <div className="invalid-feedback">{partnerErrors.mobile.message}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <input
                          type="text"
                          {...registerPartner("whatsappNo", {
                          })}
                          className={`form-control ${partnerErrors.whatsappNo ? 'is-invalid' : ''}`}
                          placeholder="WhatsApp No."
                        />
                        {partnerErrors.whatsappNo && <div className="invalid-feedback">{partnerErrors.whatsappNo.message}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <input
                          type="number"
                          {...registerPartner("age", { min: 0, max: 120 })} // Optional: Add min/max
                          className="form-control"
                          placeholder="Age"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <input
                          type="text"
                          {...registerPartner("city", { required: "City is required" })}
                          className={`form-control ${partnerErrors.city ? 'is-invalid' : ''}`}
                          placeholder="City"
                        />
                        {partnerErrors.city && <div className="invalid-feedback">{partnerErrors.city.message}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <input
                          type="text"
                          {...registerPartner("occupation", { required: "Occupation is required" })}
                          className={`form-control ${partnerErrors.occupation ? 'is-invalid' : ''}`}
                          placeholder="What is your current Occupation?"
                        />
                        {partnerErrors.occupation && <div className="invalid-feedback">{partnerErrors.occupation.message}</div>}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="input-field type-file-field">
                        <textarea
                          {...registerPartner("adress", { required: "Address is required" })}
                          className={`form-control ${partnerErrors.adress ? 'is-invalid' : ''}`} // Keep typo for consistency
                          id="yourAddress"
                          rows={2}
                          placeholder="Your Address"
                        ></textarea>
                        {partnerErrors.adress && <div className="invalid-feedback">{partnerErrors.adress.message}</div>} {/* Keep typo for consistency */}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="input-field">
                        <select
                          {...registerPartner("howDidyouKnow", { required: "Please select how you know about us" })}
                          className={`form-control ${partnerErrors.howDidyouKnow ? 'is-invalid' : ''}`}
                          aria-label="Default select example"
                        >
                          <option value="">How did you come to know about Gateway Abroad?</option>
                          <option value='google'>Google Ad</option>
                          <option value='facebook'>Facebook Ad</option>
                          <option value='email'>Email Campaign</option>
                          <option value='sms' >SMS Campaign</option>
                          <option value='whatsapp'>WhatsApp</option>
                          <option value='linkedin'>Linkedin</option>
                          <option value='reference'>Reference</option>
                          <option value='newspaper'>Newspaper</option>
                          <option value='website' >Website</option>
                          <option value='call'>Call</option>
                          <option value='instagram'>Instagram</option>
                          <option value='other'>Other</option>
                        </select>
                        {partnerErrors.howDidyouKnow && <div className="invalid-feedback">{partnerErrors.howDidyouKnow.message}</div>}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="input-field type-file-field">
                        <textarea
                          {...registerPartner("qualifications", { required: "Qualifications are required" })}
                          className={`form-control ${partnerErrors.qualifications ? 'is-invalid' : ''}`}
                          id="qualifications"
                          rows={2}
                          placeholder="What are your Educational Qualifications?"
                        ></textarea>
                        {partnerErrors.qualifications && <div className="invalid-feedback">{partnerErrors.qualifications.message}</div>}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="input-field type-file-field">
                        <textarea
                          {...registerPartner("query", { required: "Introduction is required" })}
                          className={`form-control ${partnerErrors.query ? 'is-invalid' : ''}`}
                          id="introduction"
                          rows={2}
                          placeholder="Please provide a Brief Introduction about yourself"
                        ></textarea>
                        {partnerErrors.query && <div className="invalid-feedback">{partnerErrors.query.message}</div>}
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">SUBMIT</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;