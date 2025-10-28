"use client";

import React, { useState, useRef, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const videos = [
    {
        id: "video1",
        src: "https://www.youtube.com/embed/0o6OTMlxR-8",
        title: "Unlock Your Success with IELTS...",
        student: "Rahul Sharma",
        score: "IELTS 8.0"
    },
    {
        id: "video2",
        src: "https://www.youtube.com/embed/0D_bTTy0TiU",
        title: "8-band score in IELTS, Tivin's journey...",
        student: "Tivin Patel",
        score: "IELTS 8.5"
    },
    {
        id: "video3",
        src: "https://www.youtube.com/embed/8gZR4oVxfSg",
        title: "Student success story and IELTS journey",
        student: "Priya Mehta",
        score: "IELTS 7.5"
    },
    {
        id: "video4",
        src: "https://www.youtube.com/embed/X9uEj4JTzko",
        title: "Gateway Abroad IELTS coaching testimony",
        student: "Arjun Kapoor",
        score: "IELTS 8.0"
    },
];

export default function Testimonial() {
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
        <div className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-gray-50 rounded-xl">
            <div className="max-w-7xl mx-auto ">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Our Students Say
                    </h2>
                    <div className="w-20 h-1 bg-red-600 mx-auto rounded-full"></div>
                </div>

                <div
                    ref={sliderRef}
                    className="keen-slider pb-2"
                    onMouseEnter={() => setPause(true)}
                    onMouseLeave={() => setPause(false)}
                >
                    {videos.map((video) => (
                        <div key={video.id} className="keen-slider__slide py-4">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                                <div className="relative pt-[56.25%] overflow-hidden">
                                    <iframe
                                        src={video.src}
                                        title={video.title}
                                        className="absolute top-0 left-0 w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-4 md:p-6 flex-grow">
                                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-gray-700 font-medium">{video.student}</span>
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            {video.score}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center space-x-2 mt-10">
                    {videos.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => instanceRef.current?.moveToIdx(idx)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide % videos.length === idx
                                    ? "bg-red-600 w-6"
                                    : "bg-gray-300 hover:bg-gray-400"
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Navigation Arrows */}
                {/* <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => instanceRef.current?.prev()}
          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-colors"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => instanceRef.current?.next()}
          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-colors"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div> */}
            </div>
        </div>
    );
}