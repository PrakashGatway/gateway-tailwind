
"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle, Users, GraduationCap, FileText, Plane, MapPin, Home } from "lucide-react"
import * as Icons from "lucide-react";

export function DynamicIcon({ name, size = 24, color = "currentColor", className = "" }) {
  const LucideIcon = Icons[name];

  if (!LucideIcon) {
    return <Icons.HelpCircle size={size} color={color || "#D71635"} className={className} />;
  }
  return <LucideIcon size={size} color={color} className={className} />;
}


const ProcessRoadmap = ({ content }: any) => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const steps = [
  {
    icon: "User",
    name: "Personalized Counseling",
    content:
      "We begin with understanding each student's academic background, goals, and aspirations.",
    Points:
      "One-to-one counseling sessions,Career mapping & country selection,Clear guidance for future success",
  },
  {
    icon: "BookOpen",
    name: "Test Preparation",
    content:
      "We help students ace required entrance and language exams.",
    Points:
      "IELTS PTE TOEFL GRE GMAT SAT coaching,Mock tests & practice material,Proven strategies for top scores",
  },
  {
    icon: "GraduationCap",
    name: "University Shortlisting",
    content:
      "Our experts match students with the best-fit universities.",
    Points:
      "Dream,Safe & Practical options,Updated university databases,Guidance on rankings,Location & affordability",
  },
  {
    icon: "FileText",
    name: "Application Support",
    content:
      "We make sure every application is flawless and on time.",
    Points:
      "SOP/LOR/CV drafting assistance,Step-by-step application submission,Continuous follow-ups with universities",
  },
  {
    icon: "Wallet",
    name: "Scholarships & Finance Guidance",
    content:
      "We reduce financial stress by exploring funding options.",
    Points:
      "Scholarship search & application help,Education loan support,Budget planning for tuition & living",
  },
  {
    icon: "Plane",
    name: "Visa & Pre-Departure",
    content:
      "We prepare students to begin their international journey smoothly.",
    Points:
      "Visa documentation & interview practice,Pre-departure orientation sessions,Accommodation,travel & cultural tips",
  },
];
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = Number.parseInt(entry.target.getAttribute("data-step") || "0")
            setVisibleSteps((prev) => [...new Set([...prev, stepId])])
          }
        })
      },
      { threshold: 0.3 },
    )

    const stepElements = document.querySelectorAll("[data-step]")
    stepElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const getGlowProgress = () => {
    if (!hoveredStep) return 0
    return (hoveredStep / steps.length) * 100
  }

  return (
    <section
      ref={sectionRef}
      className="py-6 sm:py-8 md:py-12 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden px-4"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="hidden sm:block absolute top-10 left-10 w-20 h-20 bg-red-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="hidden sm:block absolute bottom-10 right-10 w-24 h-24 bg-rose-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-7xl mx-auto relative z-5">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="heading mb-2 sm:mb-3 text-xl sm:text-4xl font-bold">
            Your Study Abroad
            <span className="text-[#D71635]"> {content?.title.split(" ").slice(3).join(" ") || ""}</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-full mx-auto">
            Navigate your journey to studying abroad with our comprehensive 6-step process, designed to make your dreams a reality.
          </p>
        </div>

        {/* Horizontal Timeline for Desktop */}
        <div className="hidden md:block">
          <div className="relative mx-auto">
            {/* Horizontal Timeline Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gradient-to-r from-red-200 via-rose-300 to-red-400"></div>

            <div
              className="absolute top-5 left-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-600 shadow-lg transition-all duration-500 ease-out"
              style={{
                width: `${getGlowProgress() - 7}%`,
                boxShadow: hoveredStep ? "0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.3)" : "none",
                opacity: hoveredStep ? 1 : 0,
              }}
            ></div>

            <div className="grid grid-cols-6 gap-1 sm:gap-2 lg:gap-4 items-stretch">
              {steps.map((step, index) => (
                <div
                  key={index}
                  data-step={index}
                  className={`relative flex flex-col ${visibleSteps.includes(index) ? "animate-slide-up opacity-100" : "opacity-0 translate-y-4"
                    } transition-all duration-700`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredStep(index+1)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Timeline Node */}
                  <div className="flex justify-center mb-3">
                    <div
                      className={`w-[2.5rem] h-[2.5rem] rounded-full bg-gradient-to-r from-red-600 to-rose-700 border-2 border-white shadow-lg flex items-center justify-center relative z-10 transition-all duration-300 ${visibleSteps.includes(index) ? "" : ""
                        } ${hoveredStep && (index < hoveredStep) ? "scale-[1.1] shadow-2xl" : ""}`}
                    >
                      <DynamicIcon name={step.icon} color="white" className="w-[18px] h-[30px]" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-2 sm:p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:scale-[1.05] hover:z-10 group hover:-translate-y-1 flex-1 flex flex-col">
                    {/* Step Number & Title */}
                    <div className="text-center mb-1">
                      <span className="text-[10px] sm:text-xs font-semibold text-red-600 uppercase tracking-wide">Step {index + 1}</span>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300 leading-tight">
                        {step.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-[10px] sm:text-xs mb-1 leading-relaxed flex-1">{step.content}</p>

                    {/* Details */}
                    <div className="space-y-1 mb-3">
                      {step.Points.split(",").map((detail, idx) => (
                        <div key={idx} className="flex items-center text-gray-700">
                          <CheckCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-green-500 mr-1 flex-shrink-0" />
                          <span className="text-[8px] sm:text-xs">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden">
          <div className="relative max-w-full mx-auto">
            {/* Vertical Timeline Line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-200 via-rose-300 to-red-400"></div>

            <div
              className="absolute left-5 top-0 w-1 bg-[#D71635] shadow-lg transition-all duration-500 ease-out"
              style={{
                height: `${getGlowProgress()}%`,
                boxShadow: hoveredStep ? "0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.3)" : "none",
                opacity: hoveredStep ? 1 : 1,
              }}
            ></div>

            {/* Steps */}
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  data-step={index}
                  className={`relative flex items-start ${visibleSteps.includes(index) ? "animate-slide-in-left opacity-100" : "opacity-0 translate-x-4"
                    } transition-all duration-700`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onTouchStart={() => setHoveredStep(index+1)}
                  onTouchEnd={() => setHoveredStep(null)}
                >
                  {/* Timeline Node */}
                  <div className="flex-shrink-0 relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-rose-700 border-2 border-white shadow-lg flex items-center justify-center transition-all duration-300 ${visibleSteps.includes(index) ? "" : ""
                        } ${hoveredStep && (index < hoveredStep) ? "scale-110 shadow-2xl" : ""}`}
                    >
                      <DynamicIcon name={step.icon} color="white" className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="ml-2 flex-1">
                    <div className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                      {/* Step Number & Title */}
                      <div className="mb-2">
                        <span className="text-[10px] sm:text-xs font-semibold text-red-600 uppercase tracking-wide">
                          Step {index + 1}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900">{step.name}</h3>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm">{step.content}</p>

                      {/* Details */}
                      <div className="space-y-1 mt-2">
                        {step.Points.split(",").map((detail, idx) => (
                          <div key={idx} className="flex items-center text-gray-700">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProcessRoadmap
