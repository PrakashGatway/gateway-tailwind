import React, { useState } from 'react';
import { Plus, MessageCircle } from 'lucide-react';

const FAQSection = ({ content,faq }) => {
  const [openIndex, setOpenIndex] = useState(null);

  

  const faqs = [
    {
      question: "Which is the best study abroad consultancy in India?",
      answer: "Gateway Abroad is ranked among India’s top consultancies with 5,000+ student placements, expert counselors, and end-to-end support from university selection to visa approval."
    },
    {
      question: "Does Gateway Abroad offer IELTS coaching?",
      answer: "Yes! We provide certified IELTS, PTE, TOEFL, GRE, GMAT & SAT coaching with personalized plans, mock tests, and score guarantees."
    },
    {
      question: "Can I study abroad without IELTS from India?",
      answer: "Some universities accept alternatives like Duolingo, internal tests, or waive IELTS if you studied in English medium. Our counselors guide you based on your profile."
    },
    {
      question: "Is the first counselling session really free?",
      answer: "Absolutely! Your first consultation is 100% free — no hidden charges, no commitment. Just clarity on your next steps."
    },
    {
      question: "What is the IELTS score required for UK universities?",
      answer: "Most UK universities require 6.0–7.0 overall. Top Russell Group unis may ask for 7.0+. We help you target the right score for your dream course."
    },
    {
      question: "Which scholarships can Indian students get to study abroad?",
      answer: "We assist with Chevening, Commonwealth, DAAD, Erasmus Mundus, Fulbright, and university-specific merit/need-based scholarships."
    },
    {
      question: "How much does it cost to study in UK from India?",
      answer: "Tuition ranges from £10,000–£38,000/year depending on course/university. Living costs ~£12,000/year. We help you plan budget + scholarships."
    },
    {
      question: "Does Gateway Abroad offer online counselling and IELTS coaching?",
      answer: "Yes! We offer 100% online counseling sessions and live/virtual IELTS classes so you can prepare from anywhere in India."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-5 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 md:mb-14 text-center md:text-left">
          <span className="inline-flex items-center gap-2 bg-red-100 text-[#DC2626] font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-full border border-red-200 mb-4">
            {content?.label}
          </span>
          
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-black leading-tight">
            {content?.title}
          </h2>
        </div>

        {/* FAQ Grid - 2 cols on desktop, 1 col on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {faq?.faq?.map((faq, index) => (
            <div 
              key={index}
              className={`bg-[#f5f2eb] rounded-xl md:rounded-2xl p-5 md:p-3 cursor-pointer transition-all duration-300 hover:shadow-md ${
                openIndex === index ? 'ring-2 ring-red-500' : ''
              }`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-snug flex-1">
                  {faq.title}
                </h3>
                <button 
                  className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-700 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-45' : ''
                  }`}
                  aria-label={openIndex === index ? "Close answer" : "Open answer"}
                >
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
              
              {/* Answer - Only visible when open */}
              {openIndex === index && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                    {faq.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-10 md:mt-14 flex justify-center">
          <button className="bg-[#f59e0b]  text-black font-bold px-4 py-2 rounded-full text-sm sm:text-base md:text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-orange-500/30 flex items-center gap-2">
            💬 Have More Questions? Ask Us Free
          </button>
        </div>

      </div>

     

    </section>
  );
};

export default FAQSection;