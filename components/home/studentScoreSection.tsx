import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import KeenSlider from 'keen-slider';
import 'keen-slider/keen-slider.min.css'; // Import default styles

const StudentScoresSection = ({ content, studentslider }: { content: any, studentslider: any }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderInstance, setSliderInstance] = useState<KeenSlider.Slider | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);

  // Initialize Keen Slider
  useEffect(() => {
    if (sliderRef.current && studentslider?.media?.length > 0) {
      const slider = new KeenSlider(sliderRef.current, {
        loop: false, // Set to true if you want infinite looping
        slides: {
          perView: 1,
          spacing: 16, // Gap between slides (matches gap-4)
        },
        breakpoints: {
          '(min-width: 640px)': {
            slides: { perView: 2, spacing: 24 },
          },
          '(min-width: 768px)': {
            slides: { perView: 3, spacing: 24 },
          },
          '(min-width: 1024px)': {
            slides: { perView: 4, spacing: 24 },
          },
          '(min-width: 1280px)': {
            slides: { perView: 6, spacing: 24 },
          },
        },
        slideChanged: (s) => {
          setCurrentSlide(s.track.details.rel);
          setSlidesPerView(s.track.details.slidesPerView);
        },
        created: (s) => {
          setSlidesPerView(s.track.details.slidesPerView);
        },
      });

      setSliderInstance(slider);

      // Cleanup
      return () => slider.destroy();
    }
  }, [studentslider]);

  // Navigation Handlers
  const handlePrev = () => {
    if (sliderInstance) sliderInstance.prev();
  };

  const handleNext = () => {
    if (sliderInstance) sliderInstance.next();
  };

  // Check if buttons should be disabled
  const isStart = currentSlide === 0;
  // Calculate total pages roughly for disabling next button at end
  const totalSlides = studentslider?.media?.length || 0;
  const isEnd = currentSlide >= totalSlides - slidesPerView;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="bg-red-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 bg-red-100 px-4 py-2  rounded-full mb-6 shadow-sm border border-gray-200"
          >
            <Award className="w-4 h-4 text-[#EF4444]" />
            <span className="text-[#D81635] py-1 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wider">
              {content?.label}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight"
          >
            {content?.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 text-base sm:text-base max-w-3xl leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content?.subTitle }}
          />
        </motion.div>

        {/* Slider Container with Arrows */}
        <div className="relative group">
          
          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            disabled={isStart}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-[#EF4444] transition-all duration-300 hover:bg-[#EF4444] hover:text-white hover:border-[#EF4444] ${
              isStart ? 'opacity-0 pointer-events-none' : 'opacity-100'
            } lg:-ml-12`}
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Keen Slider Wrapper */}
          <div ref={sliderRef} className="keen-slider "> {/* Padding ensures shadow isn't cut off */}
            {studentslider?.media?.map((item: any, index: number) => {
              const starCount = 5;
              return (
                <div key={index} className="keen-slider__slide">
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ 
                      
                      boxShadow: "0 20px 40px rgba(239, 68, 68, 0.15)"
                    }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#EF4444]/30 transition-all duration-300 group/card cursor-pointer h-full"
                  >
                    <div className="text-center flex flex-col h-full justify-between">
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                          {item.courseName}
                        </span>
                        
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 group-hover/card:text-[#EF4444] transition-colors duration-300">
                          {item.name}
                        </h3>
                        
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#C41430]  group-hover/card:scale-110 transition-transform duration-300">
                          {item.rank}
                        </div>
                      </div>
                      
                      <div className="flex justify-center gap-1 mt-auto">
                        {[...Array(starCount)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            disabled={isEnd}
            className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-[#EF4444] transition-all duration-300 hover:bg-[#EF4444] hover:text-white hover:border-[#EF4444] ${
              isEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'
            } lg:-mr-12`}
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* CTA Band */}
      <motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.4 }}
  viewport={{ once: true }}
  // Responsive padding & rounded corners
  className="mt-8 sm:mt-10 md:mt-12 bg-gradient-to-r from-[#FF1D45] to-red-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center text-center md:text-left gap-4 sm:gap-6 shadow-xl"
>
  {/* Content Section - centered on mobile, left-aligned on desktop */}
  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 w-full">
    {/* Icon - consistent sizing with minimum touch area */}
    <div className="flex-shrink-0 bg-white/10 p-2.5 sm:p-3 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center">
      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
    </div>
    
    {/* Text Content - minimum font sizes enforced */}
    <div className="flex-1">
      {/* Minimum heading: text-sm on mobile */}
      <p className="text-white text-sm sm:text-base md:text-lg font-semibold mb-0.5 sm:mb-1 leading-tight">
        Want results like these?
      </p>
      {/* Minimum body: text-xs on mobile */}
      <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
        Our coaches know exactly what it takes to crack your exam.
      </p>
    </div>
  </div>

  {/* Buttons Section - full width on mobile, auto on desktop */}
  <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
    <a
      href="#lead-form"
      // Minimum touch target: 44px height, full width on mobile
      className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold text-sm sm:text-base px-4 sm:px-6 py-3 rounded-full transition-all transform hover:scale-105 shadow-lg min-h-[44px] flex items-center justify-center whitespace-nowrap"
    >
      🎯 Get Free Country Match
    </a>
    <a
      href="tel:+91-8302092630"
      // Secondary button - same responsive treatment
      className="w-xs sm:w-auto border-2 border-white/30 hover:border-amber-400 text-white font-semibold text-sm sm:text-base px-4 sm:px-6 py-3 rounded-full transition-all min-h-[44px] flex items-center justify-center whitespace-nowrap"
    >
      📞 Call Our Expert
    </a>
  </div>
</motion.div>
      </div>
    </section>
  );
};

export default StudentScoresSection;