import React, { useState } from 'react';
import { Phone, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';

const LandingPage = ({ content }) => {
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting number:', whatsappNumber);
    // Add your API logic here
  };
  console.log(content)

  return (
    <div className="  flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans" style={{
          background: "linear-gradient(180deg, rgba(188, 140, 252, 0.2), rgba(215, 22, 53, 0.2))"
        }}>
      
      {/* Main Container */}
      <div className="max-w-4xl w-full text-center z-10 space-y-8">
        
        {/* Headline Section */}
        <div className="space-y-2">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight tracking-tight">
            {content?.title}
          </h2>
        
        </div>

        {/* Subheadline */}
        <p className="text-gray-800 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light" dangerouslySetInnerHTML={{__html : content?.subTitle}}>
          
        </p>

        {/* CTA Section (Input + Button) */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mt-8">
          
          {/* Input Field */}
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-800 group-focus-within:text-black transition-colors" />
            </div>
            <input
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Enter your WhatsApp number"
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white border border-white/20 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:bg-white transition-all duration-300 text-sm sm:text-base "
              required
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-[#fca311] hover:bg-[#e0920f] text-black font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Free Roadmap
            <ArrowRight className="w-4 h-4" strokeWidth={3} />
          </button>
        </form>

        {/* Trust Badges / Features */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 mt-8 text-[10px] sm:text-xs md:text-sm text-gray-800 font-medium tracking-wide">
          {content?.features?.map((feature, index) => (
            <div key={index} className="flex items-center gap-1 bg-white/80 px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>{feature?.featuretitle}</span>
            </div>
          ))}


        </div>

      </div>

   

    </div>
  );
};



export default LandingPage;