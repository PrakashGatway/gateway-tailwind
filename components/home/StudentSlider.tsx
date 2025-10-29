"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect } from "react";

const StudentInfoSection = () => {
  const [studentData, setStudentData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Keen Slider configuration
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    loop: true,
    mode: "snap",
    slides: {
      perView: 1,
      spacing: 15,
    },
  });

  // Form state and handlers (keep your existing form logic)
  const [registerErrors, setRegisterErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    studyDestination: "",
    query: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your existing form submission logic
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Mock data - replace with your actual data fetching
  useEffect(() => {
    // Simulate data fetch
    setStudentData([
      {
        image: "student1.jpg",
        name: "John Doe",
        courseName: "GMAT",
        rank: "750",
        content: "Excellent coaching institute with dedicated faculty and comprehensive study materials."
      },
      {
        image: "student2.jpg",
        name: "Jane Smith",
        courseName: "IELTS",
        rank: "8.5",
        content: "The personalized attention and mock tests helped me achieve my target score."
      },
      // Add more student data as needed
    ]);
  }, []);

  return (
    <section className="bg-[#F2E7FC] py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content - Student Info & Slider */}
          <div className="w-full lg:w-1/2">
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-white">
                Established in <span className="text-yellow-300">2009</span>, this institute is a leader in preparing students for standardized tests like GMAT, GRE, SAT, TOEFL, IELTS, and PTE.
              </h3>
            </div>

            {/* Keen Slider */}
            {studentData.length > 0 && (
              <div className="relative">
                <div ref={sliderRef} className="keen-slider">
                  {studentData.map((student, index) => (
                    <div key={index} className="keen-slider__slide">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center gap-4 mb-4">
                          <img 
                            src={`/uploads/${student.image}`} 
                            alt={student.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h5 className="text-white font-semibold text-lg">{student.name}</h5>
                              <div className="text-right">
                                <p className="text-white/80 text-sm">{student.courseName} Score</p>
                                <h5 className="text-yellow-300 font-bold text-lg">{student.rank}</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed">{student.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slider Navigation */}
                {loaded && instanceRef.current && studentData.length > 1 && (
                  <div className="flex items-center justify-center mt-6 space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        instanceRef.current?.prev();
                      }}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="flex space-x-2">
                      {[...Array(instanceRef.current.track.details.slides.length)].map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => instanceRef.current?.moveToIdx(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentSlide === idx ? 'bg-white w-6' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        instanceRef.current?.next();
                      }}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Content - Registration Form */}
          <div className="lg:w-1/2 max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-center text-gray-800 uppercase mb-8">
                Register Now
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  {registerErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  {registerErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  {registerErrors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.mobile}</p>
                  )}
                </div>

                {/* Test Preparation Select */}
                <div>
                  <select
                    name="studyDestination"
                    value={formData.studyDestination}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Test Preparation</option>
                    <option value="GMAT">GMAT</option>
                    <option value="IELTS">IELTS</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="GRE">GRE</option>
                    <option value="PTE">PTE</option>
                    <option value="SAT">SAT</option>
                  </select>
                  {registerErrors.studyDestination && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.studyDestination}</p>
                  )}
                </div>

                {/* Message Textarea */}
                <div>
                  <textarea
                    name="query"
                    value={formData.query}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Message"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  SUBMIT
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentInfoSection;