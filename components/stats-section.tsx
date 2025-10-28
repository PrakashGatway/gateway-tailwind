"use client";

import React, { useState, useRef, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const testimonials = [
  {
    id: 1,
    name: "Mohit",
    score: "1540",
    text: "Superb coaching institute. All the faculties are immensely qualified and are masters of their areas of teaching. Before the real exam, they provide several mock tests and intensive drill sessions, which are very helpful.",
  },
  {
    id: 2,
    name: "Nikita",
    score: "1500",
    text: "When I visited Gateway Abroad Jaipur, my quest for SAT coaching stopped. You can tell from the first class itself that these people are genuinely interested in you doing well and achieving a good score in the SAT.",
  },
  {
    id: 3,
    name: "Priyanshi",
    score: "1510",
    text: "The personalized attention and study plan helped me improve my score significantly. The faculty goes above and beyond to ensure student success.",
  },
  {
    id: 4,
    name: "Yatti",
    score: "1490",
    text: "Excellent test series and doubt-solving sessions. The regular feedback helped me identify my weak areas and improve them systematically.",
  },
];

export default function TestimonialSlider() {
  const [pause, setPause] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    initial: 0,
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
          perView: 2,
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
    dragStarted: () => {
      setPause(true);
    },
    dragEnded: () => {
      setPause(false);
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
    <div 
      className="relative py-16 md:py-24"
      style={{
        backgroundImage: "url('https://www.gatewayabroadeducations.com/assets/img/testimonials-bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Testimonials
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto rounded-full"></div>
        </div>

        <div
          ref={sliderRef}
          className="keen-slider pb-2"
          onMouseEnter={() => setPause(true)}
          onMouseLeave={() => setPause(false)}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="keen-slider__slide">
            <div>
              <div className="flex h-full">
                {/* Triangle Corner */}
                {/* <div className=" w-0 h-0 border-t-[40px] border-l-[40px] border-t-gray-300 border-l-transparent shadow-lg"></div> */}

                <div className="p-6 pt-10 bg-gray-300 " style={{borderRadius:"[-20px] 10px 10px 10px"}}>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{testimonial.text}</p>
                  <div className="flex items-center">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">5/5</span>
                  </div>
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-2 mt-10">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide % testimonials.length === idx
                  ? "bg-red-600 w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}