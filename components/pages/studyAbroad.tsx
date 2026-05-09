"use client"

import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Plane, MapPin, FileCheck2, Calendar, Star, Quote, Building2, Globe, CheckCircle, IndianRupee, CalendarDays, PlaneTakeoff, Landmark, Award, FileEdit, BookOpen, UserCheck, Monitor, Sun } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import EnhancedMultiStepForm from "@/components/pages/multiStep";
import Component from "@/components/pages/partnerSlider";
import DestinationSection from "@/components/sections/destination";
import ReadMoreSection from "@/components/sections/content";
import CardLayout from "@/components/sections/whyus";
import DegreesSection from "@/components/sections/degreeSection";
import ProcessRoadmap from "@/components/sections/processRoad";
import PageServices from "@/services/PageServices";
import Loader from "../loader";
import { baseUrl } from "@/services/axiosInstance";
import ContactForm from "./UkForm";
import DestinationsSection from "../home/DestinationSection";
import { it } from "node:test";

import { motion } from "framer-motion";
import LandingPage from "../home/ctaSection";
import FAQSection from "../home/FaqSection";


const StudyAbroadPage = ({ content }: any) => {

    if (!content) {
        return <Loader />;
    }

    const [faqData, setFaqData] = useState([]);

    const getAllfaqData = async () => {
        try {
            const response = await PageServices.getAllFaqForFront('Study-abroad');
            if (response.status === 'success') {
                setFaqData(response.data.faq || [])
            } else {
                console.log('something went wrong');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function getContentByType(type) {
        const item = content && content.sections.find(obj => obj.type === type);
        return item ? item.content : undefined; // Return undefined if not found
    }

    useEffect(() => {
        getAllfaqData()
    }, [])
   const handleGetStarted = () => {
    
    window.dispatchEvent(new CustomEvent('openFooterModal'));
  };

   const locations = [
      {
        city: "Jaipur",
        info: "Main Centre · Walk-ins welcome",
        icon: MapPin,
        type: "default"
      },
      {
        city: "Udaipur",
        info: "Full counselling centre",
        icon: Building2,
        type: "default"
      },
      {
        city: "Jodhpur",
        info: "Counselling available",
        icon: Sun,
        type: "default"
      },
      {
        city: "Kota",
        info: "Counselling available",
        icon: GraduationCap,
        type: "default"
      },
      {
        city: "Ajmer",
        info: "Counselling available",
        icon: Landmark,
        type: "default"
      },
      {
        city: "Pan-India Online",
        info: "WhatsApp · Zoom · Live classes",
        icon: Monitor,
        type: "highlight"
      }
    ];

    const features = [
    { id: "01", icon: "🎯", title: "Free Profile Evaluation", desc: "Get expert evaluation of your profile, goals, and IELTS status." },
    { id: "02", icon: "📊", title: "Smart Shortlisting", desc: "Data-driven university selection with best chances." },
    { id: "03", icon: "🏛️", title: "450+ Partnerships", desc: "Global university network across countries." },
    { id: "04", icon: "✍️", title: "IELTS Support", desc: "Structured coaching with mock tests." },
    { id: "05", icon: "📝", title: "SOP Writing", desc: "Custom SOPs tailored to universities." },
    { id: "06", icon: "📄", title: "Visa Success", desc: "96% visa approval success rate." },
    { id: "07", icon: "🏅", title: "Scholarships", desc: "Help with scholarships and education loans." },
    { id: "08", icon: "💰", title: "No Hidden Fees", desc: "Transparent pricing with zero surprises." }
  ];


  const items = [
  { icon: "✅", value: "5,000+", label: "Students from Udaipur Placed" },
  { icon: "", value: "450+", label: "University Partnerships" },
  { icon: "", value: "18+", label: "Countries Covered" },
  { icon: "", value: "96%", label: "Visa Success Rate" },
  { icon: "", value: "FREE", label: "First Counselling Session" },
  { icon: "", value: "16 Yrs", label: "In Business Since 2008" },
];

 const services = [
  {
    icon: UserCheck,
    title: "Free Expert Counselling",
    desc: "One-to-one sessions with country specialists who map your profile to the best universities, course, and intake — at zero cost.",
    link: "Book Free Session →",
  },
  {
    icon: BookOpen,
    title: "IELTS / PTE / TOEFL Coaching",
    desc: "Certified trainers, structured batches, full-length mocks, speaking practice — in Udaipur and online. Results in 6–8 weeks.",
    link: "Join IELTS Batch →",
  },
  {
    icon: Building2,
    title: "University Shortlisting & Applications",
    desc: "Profile-based dream/safe/practical shortlists, complete filing, deadline tracking, and follow-ups with admissions offices.",
    link: "Get My University List →",
  },
  {
    icon: FileEdit,
    title: "SOP, LOR & Resume Writing",
    desc: "Professionally crafted SOP, LOR, and academic CV — tailored to each university, not copy-paste templates.",
    link: "Get SOP Help →",
  },
  {
    icon: CheckCircle,
    title: "Student Visa Assistance",
    desc: "Complete documentation and mock interview prep for UK, USA, Canada, Australia, and Germany visas.",
    link: "Start Visa Prep →",
  },
  {
    icon: Award,
    title: "Scholarship Applications",
    desc: "We find Chevening, GREAT, DAAD, Australia Awards, and merit scholarships you qualify for.",
    link: "Find My Scholarships →",
  },
  {
    icon: Landmark,
    title: "Education Loan Guidance",
    desc: "Loans up to ₹1.5 Crore from SBI, HDFC Credila, Axis, and IDFC First.",
    link: "Check Loan Eligibility →",
  },
  {
    icon: PlaneTakeoff,
    title: "Pre-Departure Orientation",
    desc: "Forex cards, travel insurance, accommodation, and cultural briefings.",
    link: "Know More →",
  },
];

    return (
        <>
            {/* HERO */}
            <section className="hero-gradient pt-10 py-12 pb-0 lg:pb-10 flex items-center relative overflow-hidden">
               

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Content with staggered animations */}
                        <div className="space-y-4">
                            <div className="">
                                <h1 className="text-3xl lg:text-4xl xl:text-[2.5rem] font-bold leading-tight">
                                    <span className="inline-block">{content?.title.split(" ").slice(0, 3).join(" ")}</span>
                                    <br />
                                    {<> <span className="text-[#D41833] py-2 inline-block">
                                        {content?.title.split(" ").slice(3).join(" ")}
                                    </span>
                                        <br /> </>}
                                </h1>
                            </div>

                            <div className="mb-3">
                                <div className="text-gray-800 text-base lg:text-lg leading-relaxed max-w-2xl" >{content?.subTitle} </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-stagger-4">
                                <Link href="/contact" className="btn-primary inline-block text-center group px-6 py-3 sm:px-8 sm:py-4">
                                    <span className="relative z-10" onClick={ handleGetStarted}>Get Started Today</span>
                                </Link>
                                <Link href="/about" className="btn-secondary text-center group px-6 py-3 sm:px-8 sm:py-4">
                                    Learn More
                                </Link>
                            </div>
                            <div className="mt-6 flex items-center gap-3 text-sm sm:text-base text-muted-foreground">
                                <Star className="text-yellow-500 fill-yellow-500" /> Trusted by 5,000+ students | 4.9/5 reviews
                            </div>
                        </div>

                        {/* Right Illustration with floating animation */}
                        <div className="relative animate-fadeInRight mx-auto w-full max-w-md lg:max-w-lg xl:max-w-none">
                            <div className="relative z-10 mx-auto">
                               <ContactForm/>
                            </div>

                          

                            <div className="absolute lg:-bottom-8 -bottom-12 lg:-left-4 -left-2 z-10 border-2 border-red-600 bg-white shadow-3xl rounded-xl p-3 sm:p-4">
                                <h3 className="text-lg sm:text-xl m-0 font-bold text-center">99.99%</h3>
                                <p className="text-xs sm:text-sm m-0 text-center">Success Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
             <div className="bg-[#D71635] overflow-x-auto scrollbar-hide">
      <div className="flex justify-center items-stretch min-w-max">
      {items.map((item, index) => {
  

  return (
    <div
      key={index}
      className="flex items-center gap-2 px-[56px] py-[13px] border-r border-[rgba(26,20,64,0.12)] whitespace-nowrap"
    >
      {item.icon}

      <div>
        <div className="font-serif text-[1.1rem] font-bold text-white leading-none">
          {item.value}
        </div>
        <div className="text-[0.80rem] font-semibold text-yellow-500">
          {item.label}
        </div>
      </div>
    </div>
  );
})}
      </div>
    </div>

            <EnhancedMultiStepForm />
            {/* <DestinationSection content={getContentByType('StudyDestinations')} /> */}
            <DestinationsSection/>
            <DegreesSection content={getContentByType('AcademicPrograms')} />
             <section className="bg-white py-14 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Badge */}
          <div className="flex  mb-3">
            <span className="bg-red-100 text-[#D81635] px-4 py-1 rounded-full text-xs md:text-sm font-medium">
              🎓 WHY CHOOSE GATEWAY ABROAD
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-4xl lg:text-4xl font-bold  text-gray-900 leading-tight">
            Why 5,000+ Students Choose{" "}
            <br /> <span className="text-[#D81635]">Gateway Abroad</span> as Their Study Partner
          </h2>

          {/* Subtext */}
          <p className=" text-gray-500 mt-3 md:mt-4 max-w-2xl  text-sm md:text-lg">
            We’re not a one-size-fits-all consultancy. Every student gets a personalised strategy,
            expert execution, and dedicated support from day one.
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-10 md:mt-14">

            {/* Loop through features */}
            {features.map((item) => (
              <div
                key={item.id}
                className="
    relative bg-[#F7F4EE] rounded-xl md:rounded-2xl p-5 md:p-6 
    shadow-sm transition-all duration-300
    hover:shadow-md hover:-translate-y-1

    /* Bottom line */
    after:absolute after:left-0 after:bottom-0
    after:h-[3px] after:w-0
    after:bg-[#D81635]
    after:transition-all after:duration-300
    after:rounded-b-xl

    hover:after:w-full
  "
              >
                {/* Background Number */}
                <span className="absolute top-3 right-4 md:top-4 md:right-6 text-4xl md:text-5xl font-bold text-[#E7E9E1]">
                  {item.id}
                </span>

                {/* Icon */}
                <div className="text-[#D81635] text-2xl md:text-3xl mb-2 md:mb-3">
                  {item.icon}
                </div>

                {/* Title */}
                <h4 className="font-semibold text-base md:text-lg text-gray-800">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-gray-500 text-xs md:text-sm mt-1 md:mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>
            {/* <CardLayout content={getContentByType('WhyChooseUs')} /> */}

              <section id="services" className="hero-gradient">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        
        {/* Heading */}
        <div className="text-center">
          <span className="inline-block text-lg md:text-xl lg:text-2xl font-semibold mb-3">
            ⚙️ Our Services
          </span>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
            Complete Overseas Education <br />
            <em>Services</em> Under One Roof in Udaipur
          </h2>

          <p className="mt-3 text-sm md:text-base text-gray-800 max-w-2xl mx-auto">
            Stop running between offices. Every service you need — from IELTS coaching to visa filing — is available right here in Udaipur with Gateway Abroad.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px] mt-[40px]">
          {services.map((item, index) => { 
            const Icon = item.icon;

            return (
            <div
              key={index}
              className="flex gap-[15px] items-start bg-white border-[1.5px] border-[var(--border)] rounded-[15px] p-[20px] transition-all duration-300 hover:border-[var(--teal)] hover:-translate-y-[4px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.07)]"
            >
              {/* Icon */}
              <div className="w-[48px] h-[48px] rounded-[11px] flex-shrink-0 bg-[#D81635] flex items-center justify-center text-[1.35rem]">
                <Icon size={24} color="white" />
              </div>

              {/* Content */}
              <div>
                <h3 className="font-bold text-[0.88rem] text-black mb-[5px]">
                  {item.title}
                </h3>

                <p className="text-[0.79rem] text-gray-800  leading-[1.6]">
                  {item.desc}
                </p>

                 <a
                  href="#lead-form"
                  className="block mt-[7px] text-[0.75rem] cursor-pointer  text-left font-bold text-gray-800 relative z-10"
                >
                  {item.link}
                </a>

               
              </div>
              
            </div>
            
  )})}
        </div>

      </div>
    </section>
            <ProcessRoadmap />
            
            <section className="bg-red-50 py-12 md:py-20 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-7xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="mb-10 md:mb-14">
                      {/* Badge */}
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-red-100 text-[#C41430] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wider mb-4"
                      >
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        WE'RE NEAR YOU
                      </motion.span>
            
                      {/* Main Heading */}
                      <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#C41430] leading-tight font-serif mb-6"
                      >
                        Study Abroad Consultants &<br />
                        IELTS Coaching Across Rajasthan
                      </motion.h2>
            
                      {/* Subtext */}
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm sm:text-base md:text-lg text-gray-800 max-w-2xl leading-relaxed"
                      >
                        Whether you visit our centre in person or connect online from anywhere in India — expert study abroad and test prep guidance is always within reach.
                      </motion.p>
                    </div>
            
                    {/* Location Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
                      {locations.map((loc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ y: -5 }}
                          className={`
                            flex flex-col items-center justify-center text-center p-5 sm:p-6 rounded-2xl transition-all duration-300 cursor-pointer border
                            ${loc.type === 'highlight' 
                              ? 'bg-[#D71635] border-[#064E3B] text-white shadow-lg shadow-red-900/20' 
                              : 'bg-white border-gray-200 hover:border-[#C41430] hover:shadow-md text-gray-900'
                            }
                          `}
                        >
                          <div className={`mb-3 ${loc.type === 'highlight' ? 'text-white' : 'text-[#C41430]'}`}>
                            <loc.icon size={32} />
                          </div>
                          
                          <h3 className="text-base sm:text-lg font-bold mb-1">
                            {loc.city}
                          </h3>
                          
                          <p className={`text-xs sm:text-sm leading-snug ${loc.type === 'highlight' ? 'text-green-100' : 'text-gray-500'}`}>
                            {loc.info}
                          </p>
                        </motion.div>
                      ))}
                    </div>
            
                    {/* SEO Text Block with Side Border */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="border-l-4 border-[#C41430] pl-4 md:pl-6 py-2"
                    >
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium text-justify">
                        <strong>Gateway Abroad Education</strong> is one of India's most trusted <strong>study abroad consultants</strong> and test preparation centres, serving students since 2008. As leading <strong>overseas education consultants</strong> in <strong>Jaipur</strong>, <strong>Udaipur</strong> and across Rajasthan, we offer end-to-end guidance for <strong>study in UK from India</strong>, <strong>study in USA from India</strong>, <strong>study in Canada from India</strong>, <strong>study in Australia from India</strong>, and <strong>study in Germany from India</strong> (with free public tuition). Our expert coaches provide <strong>IELTS coaching in Jaipur and Udaipur</strong>, <strong>PTE coaching</strong>, <strong>TOEFL coaching</strong>, <strong>GRE coaching</strong>, <strong>GMAT coaching</strong>, and <strong>SAT coaching</strong> — both in-centre and online across India. Additional services include <strong>SOP writing</strong>, <strong>LOR drafting</strong>, <strong>student visa assistance</strong>, <strong>Chevening and GREAT scholarship guidance</strong>, and <strong>education loan support</strong>. We also help students <strong>study abroad without IELTS</strong> through the MOI certificate pathway. Whether you search "best study abroad consultants near me", "IELTS coaching Jaipur", "overseas education consultant Rajasthan", or "study in UK from India consultants" — Gateway Abroad Education is your answer.
                      </p>
                    </motion.div>
            
                  </div>
                </section>

                <LandingPage/>
            <Component />

            <ReadMoreSection content={getContentByType('content')} />


            <FAQSection/>

            {/* FAQ Section */}
            {/* <section className="faq-section py-16 lg:py-20 mb-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 lg:mb-12">
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4">Frequently asked questions</h2>
                        <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">Can't find the answer you are looking for?</p>
                    </div>
                    <div className="max-w-7xl mx-auto">
                        <Accordion type="single" collapsible className="w-full">
                            {faqData.map((f: any, index: number) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="text-lg font-semibold text-left py-4 hover:no-underline">
                                        {f.title}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-700 pb-4 text-base">
                                        {f.content}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section> */}

          {/* CTA Section */}
<section className="py-12 md:py-16 bg-white">
    <div className="container mx-auto ">
        <div className="bg-[#fbe7ea] rounded-2xl sm:rounded-[24px] shadow-lg w-full max-w-[90rem] mx-auto"> {/* max-w-[90rem] for 7xl width */}
            {/* Content container with specific padding */}
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                    <div className="w-full lg:w-[48%]">
                        <div className="text-center lg:text-left pl-[17px]">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[36px] font-bold mb-4 text-[#D71635] lg:leading-[37px] ">
                                Avail A Complementary Counselling Session
                            </h2>
                            <p className="text-base sm:text-lg lg:text-[18px] mb-4 sm:mb-6 text-[#666276]">
                                Join thousand of instructors and earn money hassle free!
                            </p>
                            <a
                                href="/contact"
                                className="inline-block bg-[#d71635] text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-3xl text-sm sm:text-base font-bold shadow-[0_0_8px_0_rgba(0,0,0,0.2)] hover:bg-[#b5122b] transition-all duration-300"
                            >
                                Contact us
                            </a>
                        </div>
                    </div>
                    <div className="w-full lg:w-[38%]">
                        <div className="flex justify-center">
                            <Image
                                src="/img/counselling-session.svg"
                                alt="Counselling Session"
                                width={400}
                                height={300}
                                className="w-full max-w-xs sm:max-w-sm lg:max-w-[25rem]"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxWidth: '25rem'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
        </>
    );
};

export default StudyAbroadPage;