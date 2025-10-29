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

  return (
    <div>

      {/* ====== Hero Section ====== */}
      <section className="hero-gradient">
        <div className="px-4 min-h-[40vh]">
          <div className="text-center mx-auto max-w-4xl pt-32 pb-8">
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

      {/* ====== About Us Sections ====== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Culture of Success */}
          <div className="flex flex-col md:flex-row items-center mb-12 gap-8">
            <div className="w-full md:w-5/12 mb-6 md:mb-0">
              <img
                src="img/career-img-new-1.jpeg"
                alt="Culture of Success"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
            <div className="w-full md:w-7/12">
              <div className="ps-1">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Culture of Success at <br />Gateway Abroad
                </h2>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed text-justify">
                  {pageTitle ? pageTitle : "We support the empowerment of everyone in our community. Join us if you enjoy exploring and want to learn more about schooling outside of India. We are seeking people who are ready to make a move to promote high-quality education. We are a group of driven and career-oriented people that are eager to develop by cooperating in a welcoming and goal- oriented environment. Gateway Abroad is spread across eight branches in India. Join us right away if you're seeking for a dynamic and welcoming environment that supports your growth."}
                </p>
              </div>
            </div>
          </div>

          <hr className="my-12 border-gray-200" />

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-7/12 order-2 md:order-1">
              <div className="pe-3">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Working with Gateway Abroad
                </h2>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed text-justify mb-4">
                  {description ? description : "In a relatively short period of time, Gateway Abroad has assembled such a strong team. Staff members that are committed and diligent have made this possible. We make an effort to encourage and reward personnel on a regular basis. After all, what good is labour without praise? We seek people who can contribute to our team with innovative ideas and effectively interact with clients."}
                </p>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed text-justify">
                  Join us immediately if you're looking for opportunities to improve your talents and have excellent communication skills.
                </p>
              </div>
            </div>
            <div className="w-full md:w-5/12 order-1 md:order-2">
              <img 
                src="img/career-img-new-2.jpeg" 
                alt="Working with Gateway Abroad" 
                className="w-full rounded-2xl shadow-lg" 
              />
            </div>
          </div>
        </div>
      </section>

  {/* ====== Vacancies Section ====== */}
<section className="py-16 bg-[#e9def7]">
  <div className="container mx-auto px-4 max-w-6xl">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">Vacancies</h2>
    <div className="pt-4">
      <div className="flex flex-wrap justify-center gap-6">
        {jobData.map((job) => (
          <div key={job._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 w-[31.333333%]">
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{job.jobTitle}</h4>
              <h6 className="text-[#666276] text-base font-medium pt-2">
                No. of Vacancy: {job.vacancy}
              </h6>
              <h6 className="text-[#666276] text-base font-medium pt-2 mb-4">
                Location: {job.location}
              </h6>
              <div className="max-h-48 overflow-y-auto mb-4 pe-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                <div className="text-gray-700 text-sm mb-2" dangerouslySetInnerHTML={{ __html: job.jobShortDescription }} />
                <div className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: job.jobDescription }} />
              </div>
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="rounded bg-[#fbe7ea] px-3 py-1 text-sm font-medium text-[#455A64] me-2">
                    {job.jobType}
                  </span>
                  <span className="rounded bg-[#fbe7ea] px-3 py-1 text-sm font-medium text-[#455A64] me-2">
                    {job.jobExp} Year
                  </span>
                  <span className="rounded bg-[#fbe7ea] px-3 py-1 text-sm font-medium text-[#455A64] me-2">
                    {job.jobLevel} Level
                  </span>
                </div>
                <div className="text-center">
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center mx-auto"
                    onClick={() => section1Ref.current.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Apply Now 
                    <span className="ml-2">
                      <i className="fa fa-paper-plane"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* ====== Career Form Section ====== */}
      <section className="py-16 bg-white" ref={section1Ref}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-7/12">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Boost Your Career! Find the Perfect <br />Role with Gateway Abroad
                </h2>
                <div className="mt-8">
                  <img src="img/career-form-img.svg" alt="Career Form" className="w-full max-w-md" />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-5/12">
              <div className="bg-gray-50 rounded-2xl p-6 shadow-lg">
                <form className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      name="name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-300"
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Name" 
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      name="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-300"
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Email" 
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      name="phone" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-300"
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="Phone" 
                    />
                  </div>
                  <div>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-300"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    >
                      <option value="">Select Vacancies</option>
                      {jobData.map((job) => (
                        <option key={job._id} value={job.jobTitle}>{job.jobTitle}</option>
                      ))}
                    </select>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-400 transition-colors duration-300">
                    <label className="cursor-pointer flex flex-col items-center">
                      <img src="img/upload-img.svg" className="w-8 h-8 mb-2" alt="Upload" />
                      <span className="text-gray-600 font-medium">
                        {file ? file.name : "Upload your CV here"}
                      </span>
                      <input 
                        className="hidden" 
                        onChange={handleFileChange} 
                        id="FileInput" 
                        name="booking_attachment" 
                        type="file" 
                        accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps" 
                      />
                    </label>
                  </div>
                  <button 
                    type="submit" 
                    onClick={handleUpdate}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-lg transition-colors duration-300"
                  >
                    SUBMIT
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== Counselling Session Section ====== */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="bg-[#fbe7ea] rounded-2xl sm:rounded-[24px] shadow-lg">
            <div className="px-6 py-[10px] sm:px-6 sm:py-[10px] lg:px-6 lg:py-[10px]">
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
                <div className="w-full lg:w-1/2">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[36px] font-bold mb-4 text-[#D71635]">
                      Avail A Complementary Counselling Session
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 text-[#666276] whitespace-normal sm:whitespace-nowrap">
                      Join thousand of instructors and earn money hassle free!
                    </p>
                    <a 
                      href="/contact" 
                      className="inline-block bg-[#974552] text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-3xl text-sm sm:text-base font-bold shadow-[0_0_8px_0_rgba(0,0,0,0.2)] hover:bg-[#b5122b] transition-all duration-300"
                    >
                      Contact us
                    </a>
                  </div>
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="flex justify-center">
                    <img
                      src="img/counselling-session.svg"
                      alt="Counselling Session"
                      className="w-full max-w-xs sm:max-w-sm lg:max-w-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}