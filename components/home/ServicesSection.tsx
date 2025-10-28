"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion"; // Import Framer Motion

// Simulate your constant data
const TEST_PREPARATION = [
  { imageName: "coaching-services-img1.svg", text1: "Experienced and qualified coaches" },
  { imageName: "coaching-services-img2.svg", text1: "Personalized attention" },
  { imageName: "coaching-services-img3.svg", text1: "Proven track record of success" },
  { imageName: "coaching-services-img4.svg", text1: "Comprehensive study materials" },
  { imageName: "coaching-services-img5.svg", text1: "Flexible scheduling" },
  { imageName: "coaching-services-img6.svg", text1: "Positive student testimonials" },
  { imageName: "coaching-services-img7.svg", text1: "Regular progress tracking" },
  { imageName: "coaching-services-img8.svg", text1: "Affordable fees" },
];

const CoachingServicesSection = () => {
  const headingStyle = {
    color: "#454056",
  };

  return (
    <section className="py-6 lg:py-10 bg-white">
      <div className="container mx-auto px-10 lg:px-16">
        <h2
          className="heading text-center text-3xl lg:text-4xl font-bold mb-12"
          style={headingStyle} // ← Custom color applied here
        >
          Best in the Industry Coaching Services
        </h2>

        {/* Scroll Reveal Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center -mx-3"
        >
          {TEST_PREPARATION.map((item, index) => {
            return (
              <motion.div
                key={item.text1}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-full px-3 sm:w-1/2 md:w-1/2 lg:w-1/4 mb-8 flex justify-center"
              >
                <div
                  className="coaching-service-box text-center animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: "both",
                  }}
                >
                  <div
                    className={`flex items-center justify-center mx-auto mb-3`}
                  >
                    <Image
                      src={`/images/${item.imageName}`}
                      alt={item.text1}
                      width={140}
                      height={140}
                      className="object-contain hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Description */}
                  <p className="descp text-gray-700 max-w-60 font-semibold leading-relaxed">
                    {item.text1}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CoachingServicesSection;