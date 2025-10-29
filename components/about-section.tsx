"use client"
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { constant } from "@/constant/index.constant";

const AboutSection = ({ aboutUs }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 items-center">
      <div className="relative animate-fadeInLeft">
        <Image
          src={`${constant.REACT_APP_URL}/uploads/${aboutUs?.image}`}
          alt="Education Illustration"
          width={500}
          height={400}
          className="w-full h-auto rounded-2xl shadow-lg"
        />
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce-slow"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse-slow"></div>
      </div>

      <div className="space-y-6">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-bold text-gray-900"
        >
          Who Are We?
        </motion.h3>

        <p className="text-gray-600 text-base text-justify max-w-2xl">{aboutUs?.pageTitle ? aboutUs?.pageTitle : `Gateway Abroad is run by a team of British education consultants who have themselves been students in various UK universities for a number of years. We are connected to a large network of overseas students and staff currently studying or working in universities throughout the UK. Through this network and through our in-house experience, we are able to find the best solution for each student, depending on specific requirements.`}</p>
        <Link href="/contact" className="btn-primary inline-block text-center group">
          <span className="relative z-10">Know More</span>
        </Link>
      </div>
    </div>
  );
};

export default AboutSection;