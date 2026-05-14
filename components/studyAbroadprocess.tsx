import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Target, FileText, Building2, FileCheck, Plane, MessageCircle, PlaneIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import Index from './home/HomePage';
import Link from 'next/link';



const StudyAbroadProcess = ({ content }: { content: any }) => {


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "100%",
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  const circleVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  return (
    <section className="  py-16 px-4 relative overflow-hidden" style={{
          background: "linear-gradient(180deg, rgba(188, 140, 252, 0.2), rgba(215, 22, 53, 0.2))"
        }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-white rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex  gap-2 bg-[#D81635] rounded-full  px-6 py-2  mb-6 border border-white/20"
          >
            <FileText className="w-4 h-4 text-white " />
            <span className="text-white  font-semibold text-sm tracking-wide">OUR 6-STEP PROCESS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-3xl lg:text-4xl font-bold text-black mb-6 leading-tight"
          >
            {content?.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-800 text-lg md:text-lg max-w-3xl leading-relaxed"
            dangerouslySetInnerHTML={{
              __html : content.subTitle
            }}
          >
            
          </motion.p>
        </motion.div>

        {/* Desktop Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hidden lg:block relative mb-16"
        >
          {/* Connecting Line */}
          <div className="absolute top-16 left-0 right-0 h-1 bg-white/20">
            <motion.div
              variants={lineVariants}
              className="h-full bg-gradient-to-r from-[#D81635] via-[#ff6b6b] to-[#D81635]"
            />
          </div>

          <div className="grid grid-cols-6 gap-4 relative">
            {content?.processsteps?.map((step, index) => {
            
              const IconComponent = Icons[step.icon] || Target;

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover="hover"
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  {/* Step Circle */}
                  <motion.div
                    variants={circleVariants}
                    className="relative mb-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-black flex items-center justify-center relative overflow-hidden group-hover:border-[#D81635] transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-black group-hover:text-[#D81635] transition-colors duration-300" />
                      
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-[#D81635]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-xl"></div>
                    </div>
                    
                    {/* Step Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                      className="absolute -top-2 -right-2 bg-[#D81635] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                    >
                      STEP {index + 1}
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <motion.h3
                    variants={itemVariants}
                    className="text-black font-bold text-lg mb-3 group-hover:text-[#D81635] transition-colors duration-300"
                  >
                    {step.title}
                  </motion.h3>
                  
                  <motion.p
                    variants={itemVariants}
                    className="text-gray-800 text-sm leading-relaxed group-hover:text-gray-800 transition-colors duration-300"
                  dangerouslySetInnerHTML={{
                      __html: step.description
                    }} >
                   
                  </motion.p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile/Tablet Vertical Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:hidden space-y-8 mb-16"
        >
          {content?.processsteps?.map((step, index) => {
                         const IconComponent = Icons[step.icon] || Target;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-[#D81635]/50 transition-all duration-300 group"
              >
                {/* Step Circle */}
                <motion.div
                  variants={circleVariants}
                  className="flex-shrink-0 relative"
                >
                  <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-black flex items-center justify-center group-hover:border-[#D81635] transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-black group-hover:text-[#D81635] transition-colors duration-300" />
                  </div>
                  
                  {/* Step Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                    className="absolute -top-2 -right-2 bg-[#D81635] text-white text-xs font-bold px-2 py-1 rounded-full"
                  >
                    STEP {index+1}
                  </motion.div>
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-black font-bold text-xl mb-2 group-hover:text-[#D81635] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-800 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-center mb-12"
        >
          <Link href="/onboarding">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(216, 22, 53, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#D81635] hover:bg-[#c41430] text-white font-bold text-lg px-5 py-4 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto group"
          >
            <Target className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Begin My Free Counselling
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-block"
            >
              →
            </motion.span>
          </motion.button>
          </Link>
        </motion.div>

    
      </div>

   
    </section>
  );
};

export default StudyAbroadProcess;