"use client";

import React, { useRef, useEffect, useState } from "react";
import PageServices from "@/services/PageServices";
import { useGlobal } from "@/hooks/AppStateContext";

export default function CareerPage() {
  const {careerPage:data,jobFormData} = useGlobal();

  const [jobData, setJobData] = useState([]);
  const [pageTitle, setPageTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pageName, setPageName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(null);
  const [branch, setBranch] = useState("");

  const section1Ref = useRef(null);


  // Update state when API data loads
  useEffect(() => {
    if (data?.page) {
      setPageTitle(data.page.pageTitle || "");
      setPageName(data.page.pageName || "");
      setDescription(data.page.description || "");
    }
    if (jobFormData?.jobs) {
      setJobData(jobFormData.jobs);
    }
  }, [data, jobFormData]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !file) {
      alert("All fields are required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("mobileNo", phone);
      formData.append("type", "resume");
      formData.append("eduInterest", branch);
      formData.append("file", file);

      const createJob = await PageServices.createForme(formData);
      if (createJob.status === "success") {
        setName("");
        setEmail("");
        setPhone("");
        setBranch("");
        setFile(null);
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Submission failed. Please try again.");
    }
  };

  // Benefits (static or from CMS)
  const benefits = [
    "Competitive salary and performance bonuses",
    "Health insurance coverage",
    "Professional development opportunities",
    "Flexible working hours",
    "Friendly and supportive work environment",
    "Career growth opportunities",
  ];

  return (
    <div>

      {/* ====== Hero Section (Tailwind UI) ====== */}
      <section className="hero-gradient">
        <div className="px-4 min-h-[40vh]">
          <div className="text-center m-auto max-w-4xl pt-32 pb-8">
            <h1 className="text-3xl lg:text-[2.6rem] font-bold text-gray-900 mb-6">
              Join Our <span className="text-gradient">Team</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Be part of a dynamic team that helps students achieve their study abroad dreams. Explore exciting career
              opportunities with Gateway Abroad Education.
            </p>
          </div>
        </div>
      </section>

      {/* ====== About Us Sections (Bootstrap Content + Images) ====== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Culture of Success */}
          <div className="row align-items-center mb-12">
            <div className="col-md-5 mb-6 mb-md-0">
              <img
                src="img/career-img-new-1.jpeg"
                alt="Culture of Success"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
            <div className="col-md-7">
              <div className="about-us-right-new ps-1 career-content-box">
                  <h2 className="heading">Culture of Success at <br />Gateway Abroad</h2>
                  <p style={{textAlign:"left"}} className="descp !text-justify">{pageTitle ? pageTitle : "We support the empowerment of everyone in our community. Join us if you enjoy exploring and want to learn more about schooling outside of India. We are seeking people who are ready to make a move to promote high-quality education. We are a group of driven and career-oriented people that are eager to develop by cooperating in a welcoming and goal- oriented environment. Gateway Abroad is spread across eight branches in India. Join us right away if you're seeking for a vibrant and welcoming environment that supports your growth."}</p>
                </div>
            </div>
          </div>

          <hr className="my-12 border-gray-200" />

          <div className="about-us-inner">
            <div className="row align-items-center">
              <div className="col-md-7">
                <div className="about-us-right-new career-content-box pe-3">
                  <h2 className="heading">Working with Gateway Abroad</h2>
                  <p style={{textAlign:"left"}} className="descp !text-justify mb-2">{description ? description : "In a relatively short period of time, Gateway Abroad has assembled such a strong team. Staff members that are committed and diligent have made this possible. We make an effort to encourage and reward personnel on a regular basis. After all, what good is labour without praise? We seek people who can contribute to our team with innovative ideas and effectively interact with clients."}</p>
                  <p style={{textAlign:"left"}} className="descp !text-justify">Join us immediately if you're looking for opportunities to improve your talents and have excellent communication skills.</p>
                </div>
              </div>
              <div className="col-md-5">
                <div className="career-img-box">
                  <img src="img/career-img-new-2.jpeg" className="w-full rounded-2xl shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== Vacancies Section (Tailwind UI + API Data) ====== */}
      <section className="vacancy-section py-60 linear-bg">
        <div className="container  max-w-3xl">
          <h2 className="heading text-center d-block">Vacancies</h2>
          <div className="vacancy-section-inner pt-4">
            <div className="row gy-4 justify-content-center">
              {jobData.map((job) => (
                <div className="col-lg-4 col-md-6" key={job._id}>
                  <div className="vacancy-card">
                    <div className="vacancy-card-body">
                      <h4 className="job-title">{job.jobTitle}</h4>
                      <h6 className="vacancy-num">No. of Vacancy: {job.vacancy}</h6>
                      <h6 className="vacancy-location">Location: {job.location}</h6>
                      <div className="scroll-container">
                        <div style={{textAlign:"left"}} className="descp" dangerouslySetInnerHTML={{ __html: job.jobShortDescription }} />
                        <div style={{textAlign:"left"}} className="descp" dangerouslySetInnerHTML={{ __html: job.jobDescription }} />
                      </div>
                      <div>
                        <div className="list-unstyled flex flex-row job-duration mt-3">
                          <li>{job.jobType}</li>
                          <li>{job.jobExp}. Year</li>
                          <li>{job.jobLevel} Level</li>
                        </div>
                        <div className='text-center'>
                          <button className="apply-btn" onClick={() => section1Ref.current.scrollIntoView({ behavior: 'smooth' })}>Apply Now <span><i className="fa fa-paper-plane ms-2" /></span></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="career-form-section py-60" ref={section1Ref}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="career-form-section-left">
                <h2 className="heading">Boost Your Career! Find the Perfect <br />Role with Gateway Abroad</h2>
                <div className="career-form-section-img">
                  <img src="img/career-form-img.svg" />
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="career-form-section-right">
                <div className="career-form-inner students-info-right">
                  <form>
                    <div className="input-field">
                      <input type="text" name="name" className="form-control" onChange={(e) => setName(e.target.value)} placeholder="Name" />
                    </div>
                    <div className="input-field">
                      <input type="email" name="email" className="form-control" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    </div>
                    <div className="input-field">
                      <input type="text" name="phone" className="form-control" onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
                    </div>
                    <div className="input-field">
                      <select className="form-select"
                        value={branch} // Set the selected value
                        onChange={(e) => setBranch(e.target.value)}
                        aria-label="Default select example">
                        <option selected>Select Vacancies</option>
                        {jobData.map((job) => (
                          <option value={job.jobTitle}>{job.jobTitle}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-field type-file-field">
                      <label className="filelabel"><img src="img/upload-img.svg" className="file_img mx-auto" />
                        <span className="title">
                          {file ? file.name : "Upload your CV here"}
                        </span>
                        <input className="FileUpload1 form-control py-3" onChange={(e) => { handleFileChange(e) }} id="FileInput" name="booking_attachment" type="file" accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps" />
                      </label>
                    </div>
                    <button type="submit" onClick={(e) => { handleUpdate(e) }} >SUBMIT</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="app-banner-section counselling-session-sec">
        <div className="container">
          <div className="app-banner-section-inner counselling-session-sec-inner">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="app-banner-content-left">
                  <h2 className="mb-3">Avail A Complementary Counselling Session</h2>
                  <p className="mb-4">Join thousand of instructors and earn money hassle free!</p>
                  <a className="site-btn" href="/contact">Contact us</a>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="app-banner-content-right text-center">
                  <img src="img/counselling-session.svg" alt="partner" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}