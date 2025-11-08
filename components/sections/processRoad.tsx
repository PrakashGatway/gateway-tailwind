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

  const steps = content?.steps || []
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
      className="py-8 md:py-12 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden px-[140px]"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-rose-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="container-sm mx-auto px-4 relative z-5">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="heading mb-3 text-2xl font-bold">
            {content?.title.split(" ").slice(0, 3).join(" ") || "Your Study Abroad"}
            <span className="text-[#D71635]"> {content?.title.split(" ").slice(3).join(" ") || ""}</span>
          </h2>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            {content?.subTittle || "Navigate your journey to studying abroad with our comprehensive 6-step process, designed to make your dreams a reality."}
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

            <div className="grid grid-cols-6 gap-2 lg:gap-4 items-stretch">
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
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-rose-700 border-2 border-white shadow-lg flex items-center justify-center relative z-10 transition-all duration-300 ${visibleSteps.includes(index) ? "" : ""
                        } ${hoveredStep && (index < hoveredStep) ? "scale-[1.1] shadow-2xl" : ""}`}
                    >
                      <DynamicIcon name={step.icon} color="white" className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:scale-[1.1] hover:z-10 group hover:-translate-y-1 flex-1 flex flex-col">
                    {/* Step Number & Title */}
                    <div className="text-center mb-1">
                      <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Step {index + 1}</span>
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300 leading-tight">
                        {step.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-xs mb-1 leading-relaxed flex-1">{step.content}</p>

                    {/* Details */}
                    <div className="space-y-1 mb-3">
                      {step.Points.split(",").map((detail, idx) => (
                        <div key={idx} className="flex items-center text-gray-700">
                          <CheckCircle className="w-2.5 h-2.5 text-green-500 mr-1.5 flex-shrink-0" />
                          <span className="text-xs">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
                      className={`w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-rose-700 border-2 border-white shadow-lg flex items-center justify-center transition-all duration-300 ${visibleSteps.includes(index) ? "" : ""
                        } ${hoveredStep && (index < hoveredStep) ? "scale-110 shadow-2xl" : ""}`}
                    >
                      <DynamicIcon name={step.icon} color="white" className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="ml-2 flex-1">
                    <div className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                      {/* Step Number & Title */}
                      <div className="mb-2">
                        <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                          Step {index + 1}
                        </span>
                        <h3 className="text-base font-bold text-gray-900">{step.name}</h3>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-3">{step.content}</p>

                      {/* Details */}
                      <div className="space-y-1 mb-3">
                        {step.Points.split(",").map((detail, idx) => (
                          <div key={idx} className="flex items-center text-gray-700">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-xs">{detail}</span>
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
