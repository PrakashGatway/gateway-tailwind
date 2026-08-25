import React, { useState } from 'react';
import { Plus, MessageCircle } from 'lucide-react';

const FAQSection = ({ content,faq }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

   const handleGetStarted = () => {

    window.dispatchEvent(new CustomEvent('openFooterModal'));
  };
  return (
    <section className="py-12 md:py-12 px-4 md:px-0 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 md:mb-14 text-center md:text-left">
          <span className="inline-flex items-center gap-2 bg-red-100 text-[#DC2626] font-semibold text-sm tracking-wider uppercase px-4 py-2 rounded-full border border-red-200 mb-4">
            {content?.label || "Frequently Asked Question"}
          </span>
          
          <h2 className=" text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black ">
            {content?.title || "Study Abroad & Test Prep FAQs — Answered Honestly"}
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
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed"
                   dangerouslySetInnerHTML={{__html : faq.content}}/>
                    {/* {faq.content}
                  </p> */}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-10 md:mt-14 flex justify-center">
          <button onClick={handleGetStarted} className="bg-[#f59e0b]  text-black font-bold px-4 py-2 rounded-full text-sm sm:text-base md:text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-orange-500/30 flex items-center gap-2">
            💬 Have More Questions? Ask Us Free
          </button>
        </div>

      </div>

     

    </section>
  );
};

export default FAQSection;