import React, { useState } from 'react';
import { Phone, ArrowRight, CheckCircle2, MessageCircle, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/services/axiosInstance';
import { useRouter } from 'next/navigation';

const LandingPage = ({ content }) => {
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const { handleSubmit, register, reset, formState: { errors } } = useForm()
  const router = useRouter();

  const onSubmit = async (data) => {
    // Handle form submission logic here
    try {
      const response = await axiosInstance.post('/leads', {
        fullName: data.name,
        source: "website",
        phone: data.whatsappNumber,
        // countryOfResidence: city,
        extraDetails: {
          type: 'contact'
        }
      })
      router.push('/thank-you');

      reset(); // Reset the form after submission
    }
    catch (error) {
      console.error('Error submitting form:', error);
    }
  }



  return (
    <div className="  flex items-center justify-center px-4 py-12 relative overflow-hidden" style={{
      background: "linear-gradient(180deg, rgba(188, 140, 252, 0.2), rgba(215, 22, 53, 0.2))"
    }}>

      {/* Main Container */}
      <div className="max-w-4xl w-full text-center z-10 space-y-8">

        {/* Headline Section */}
        <div className="space-y-2">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-black leading-tight tracking-tight">
            {content?.title}
          </h2>

        </div>

        {/* Subheadline */}
        <p className="text-gray-800 text-xm sm:text-base md:text-base lg:text-base max-w-2xl mx-auto leading-relaxed font-semibold" dangerouslySetInnerHTML={{ __html: content?.subTitle }}>

        </p>

        {/* CTA Section (Input + Button) */}
      <form
  onSubmit={handleSubmit(onSubmit)}
  className="flex flex-col lg:flex-row items-start justify-center gap-4 max-w-5xl mx-auto mt-6"
>
  {/* Name */}
  <div className="w-full lg:flex-1">
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
        <User className="h-5 w-5 text-gray-700" />
      </div>

      <input
        type="text"
        placeholder="Enter your name"
        {...register("name", {
          required: "Name is required",
        })}
        className={`w-full h-14 pl-14 pr-5 rounded-full bg-white border text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
          errors.name
            ? "border-red-500 focus:ring-red-300"
            : "border-gray-200 focus:ring-[#DC2626]"
        }`}
      />
    </div>

    <div className="min-h-[20px] mt-2 ml-4">
      {errors.name && (
        <p className="text-red-500 text-xs">
          {errors.name.message}
        </p>
      )}
    </div>
  </div>

  {/* WhatsApp */}
  <div className="w-full lg:flex-1">
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
        <Phone className="h-5 w-5 text-gray-700" />
      </div>

      <input
        type="tel"
        placeholder="Enter your WhatsApp number"
        maxLength={10}
        {...register("whatsappNumber", {
          required: "WhatsApp number is required",
          pattern: {
            value: /^[6-9]\d{9}$/,
            message: "Enter a valid 10-digit WhatsApp number",
          },
          onChange: (e) => {
            e.target.value = e.target.value
              .replace(/\D/g, "")
              .slice(0, 10);
          },
        })}
        className={`w-full h-14 pl-14 pr-5 rounded-full bg-white border text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
          errors.whatsappNumber
            ? "border-red-500 focus:ring-red-300"
            : "border-gray-200 focus:ring-[#DC2626]"
        }`}
      />
    </div>

    <div className="min-h-[20px] mt-2 ml-4">
      {errors.whatsappNumber && (
        <p className="text-red-500 text-xs">
          {errors.whatsappNumber.message}
        </p>
      )}
    </div>
  </div>

  {/* Button */}
  <div className="w-full lg:w-auto self-start">
    <button
      type="submit"
      className="w-full lg:w-auto h-14 px-8 rounded-full bg-[#FCA311] hover:bg-[#E0920F] text-black font-bold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap shadow-lg hover:shadow-orange-500/30"
    >
      Get Free Roadmap
      <ArrowRight className="w-4 h-4" strokeWidth={3} />
    </button>
  </div>
</form>

        {/* Trust Badges / Features */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 mt-8 text-[10px] sm:text-xs md:text-base text-gray-800 font-medium tracking-wide">
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