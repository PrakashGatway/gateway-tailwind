"use client";

import React, { useState, useRef, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const blogs = [
  {
    id: 1,
    title: "Application Writing",
    subtitle: "Format, Example, Tips, How To Write and More",
    image: "/images/blog-application.jpg",
    category: "Writing Guide"
  },
  {
    id: 2,
    title: "Visa Extension Letter",
    subtitle: "How to write a letter of explanation",
    image: "/images/blog-visa.jpg",
    category: "Visa Help"
  },
  {
    id: 3,
    title: "Subject and Object Pronouns",
    subtitle: "A Complete Guide with Examples",
    image: "/images/blog-grammar.jpg",
    category: "Grammar"
  },
  {
    id: 4,
    title: "Professional Email Writing",
    subtitle: "Formal Communication Made Easy",
    image: "/images/blog-email.jpg",
    category: "Business"
  }
];

export default function BlogSlider() {
  const [pause, setPause] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 24,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: {
          perView: 2,
          spacing: 32,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3,
          spacing: 32,
        },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      startTimer();
    },
  });

  function startTimer() {
    stopTimer();
    timer.current = setInterval(() => {
      if (!pause && instanceRef.current) {
        instanceRef.current.next();
      }
    }, 5000);
  }

  function stopTimer() {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }

  useEffect(() => {
    if (pause) {
      stopTimer();
    } else {
      startTimer();
    }
    return () => stopTimer();
  }, [pause]);

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Important Facts & Information
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
        </div>

        <div 
          ref={sliderRef}
          className="keen-slider pb-2"
          onMouseEnter={() => setPause(true)}
          onMouseLeave={() => setPause(false)}
        >
          {blogs.map((blog) => (
            <div key={blog.id} className="keen-slider__slide">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full border border-gray-200 transform transition-all duration-300 hover:shadow-lg">
                {/* Blog Image */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  {/* Category Tag */}
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {blog.category}
                  </span>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{blog.subtitle}</p>
                  
                  {/* Bottom Title */}
                  <div className="border-t border-gray-100 pt-4">
                    <span className="text-sm font-medium text-gray-500">
                      {blog.category} • Read More
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-3 mt-10">
          {blogs.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide % blogs.length === idx
                  ? "bg-red-600 w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}