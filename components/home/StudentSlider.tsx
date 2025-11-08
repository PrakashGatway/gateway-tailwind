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

  // Form state and handlers
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
    <section 
      className="py-16 lg:py-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(188, 140, 252, 0.2), rgba(215, 22, 53, 0.2))"
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-500 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-red-400 rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content - Student Info & Slider */}
          <div className="w-full lg:w-1/2">
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                Established in <span className="text-purple-600">2009</span>, this institute is a leader in preparing students for standardized tests like <span className="text-blue-600">GMAT</span>, <span className="text-green-600">GRE</span>, <span className="text-pink-600">SAT</span>, <span className="text-red-600">TOEFL</span>, <span className="text-indigo-600">IELTS</span>, and <span className="text-teal-600">PTE</span>.
              </h3>
            </div>

            {/* Keen Slider */}
            {studentData.length > 0 && (
              <div className="relative">
                <div ref={sliderRef} className="keen-slider">
                  {studentData.map((student, index) => (
                    <div key={index} className="keen-slider__slide">
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                          <img 
                            src={`/uploads/${student.image}`} 
                            alt={student.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-purple-500 shadow-lg"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="text-gray-800 font-bold text-lg">{student.name}</h5>
                                <p className="text-gray-600 text-sm">{student.courseName} Student</p>
                              </div>
                              <div className="text-right bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg px-3 py-2 text-white">
                                <p className="text-white/90 text-xs font-medium">SCORE</p>
                                <h5 className="text-white font-bold text-xl">{student.rank}</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start mb-3">
                          <i className='bx bxs-quote-alt-left text-purple-500 text-2xl mr-2'></i>
                          <p className="text-gray-700 text-sm leading-relaxed flex-1">{student.content}</p>
                        </div>
                        <div className="flex justify-end">
                          <i className='bx bxs-quote-alt-right text-purple-500 text-2xl'></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slider Navigation with Boxicons */}
                {loaded && instanceRef.current && studentData.length > 1 && (
                  <div className="flex items-center justify-center mt-8 space-x-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        instanceRef.current?.prev();
                      }}
                      className="p-3 rounded-full bg-white/80 hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg border border-gray-200"
                    >
                      <i className='bx bx-chevron-left text-purple-600 text-2xl'></i>
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="flex space-x-3">
                      {[...Array(instanceRef.current.track.details.slides.length)].map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => instanceRef.current?.moveToIdx(idx)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            currentSlide === idx ? 'bg-purple-500 w-8 shadow-lg' : 'bg-gray-400 hover:bg-gray-500'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        instanceRef.current?.next();
                      }}
                      className="p-3 rounded-full bg-white/80 hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg border border-gray-200"
                    >
                      <i className='bx bx-chevron-right text-purple-600 text-2xl'></i>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Content - Registration Form */}
          <div className="w-full lg:w-1/2 max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 relative overflow-hidden">
              {/* Form header with icon */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                  <i className='bx bxs-edit-alt text-white text-2xl'></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 uppercase tracking-wide mb-2">
                  Register Now
                </h3>
                <p className="text-gray-600 text-sm">Start your journey to success</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className='bx bx-user text-gray-400'></i>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className='bx bx-envelope text-gray-400'></i>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className='bx bx-phone text-gray-400'></i>
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                    required
                  />
                </div>

                {/* Test Preparation Select */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className='bx bx-book-alt text-gray-400'></i>
                  </div>
                  <select
                    name="studyDestination"
                    value={formData.studyDestination}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white"
                    required
                  >
                    <option value="">Select Test Preparation</option>
                    <option value="GMAT">GMAT</option>
                    <option value="IELTS">IELTS</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="GRE">GRE</option>
                    <option value="PTE">PTE</option>
                    <option value="SAT">SAT</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className='bx bx-chevron-down text-gray-400'></i>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <i className='bx bx-message text-gray-400'></i>
                  </div>
                  <textarea
                    name="query"
                    value={formData.query}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Your Message or Query"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none bg-white"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <i className='bx bx-paper-plane text-xl'></i>
                  SUBMIT NOW
                </button>
              </form>

              {/* Bottom decoration */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentInfoSection;