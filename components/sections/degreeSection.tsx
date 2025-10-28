"use client"

import { useKeenSlider, KeenSliderPlugin, KeenSliderInstance } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { useState, useEffect, useRef } from "react"
import { GraduationCap, Clock, Users, Award, BookOpen, Star } from "lucide-react"
import Swal from "sweetalert2"
import axiosInstance from "@/services/axiosInstance"
import { DynamicIcon } from "./processRoad"
import { useRouter } from "next/navigation"

// Define types for our data
interface Program {
  id: string
  title: string
  subTitle?: string
  description?: string
  duration?: string
  rating?: number
  studentCount?: string
  keyFeatures?: string[]
  icon?: string
  [key: string]: any
}

interface DegreesSectionProps {
  content?: {
    title?: string
    subTitle?: string
  }
}

// Auto-play plugin with proper null checks
const AutoPlayPlugin: KeenSliderPlugin = (slider: KeenSliderInstance) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let mouseOver = false

  function clearNextTimeout() {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  function nextTimeout() {
    clearNextTimeout()
    if (mouseOver || !slider.track.details) return
    
    timeout = setTimeout(() => {
      if (slider.track.details) {
        slider.next()
      }
    }, 5000)
  }

  slider.on("created", () => {
    if (!slider.container) return
    
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true
      clearNextTimeout()
    })
    
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false
      nextTimeout()
    })
    
    nextTimeout()
  })

  slider.on("dragStarted", clearNextTimeout)
  slider.on("animationEnded", nextTimeout)
  slider.on("updated", nextTimeout)
  slider.on("destroyed", clearNextTimeout)
}

export default function DegreesSection({ content }: DegreesSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const sliderContainerRef = useRef<HTMLDivElement>(null)
  let Router = useRouter()

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: true,
    mode: "free",
    slides: {
      perView: 1,
      spacing: 2,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 2,
          spacing: 6,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3.5,
          spacing: 6,
        },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
  }, [AutoPlayPlugin])

  const fetchPages = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get("/entities?limit=12&type=course")
      setPrograms(data?.data || [])
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Failed to fetch programs",
      })
      setPrograms([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  // Reset slider when programs change
  useEffect(() => {
    if (programs.length > 0 && instanceRef.current) {
      instanceRef.current.update()
    }
  }, [programs, instanceRef])

  if (loading) {
    return (
      <section className="py-20 bg-[#F3E0F2] overflow-hidden">
        <div className="container-sm mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="heading text-center d-block mb-2">Loading programs...</h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-[#F3E0F2] overflow-hidden">
      <div className="container-sm mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="heading text-center d-block mb-2">
            {content?.title || "Academic Programs"}
          </h2>
          <p className="sub-heading !text-base max-w-3xl mx-auto">
            {content?.subTitle || "Explore our comprehensive range of academic programs designed to help you achieve your educational and career goals"}
          </p>
        </div>

        {/* Slider */}
        <div className="relative" ref={sliderContainerRef}>
          {programs.length > 0 ? (
            <>
              <div ref={sliderRef} className="keen-slider">
                {programs.map((program, index) => (
                  <div key={program.id || index} className="keen-slider__slide p-2 overflow-hidden">
                    <div
                      className={`group relative h-full bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 bg-[#FAFBFF] border border-red-800 border-2 hover:border-red-700 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden`}
                    >
                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon and Badge */}
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`p-3 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg group-hover:scale-105 transition-transform duration-300`}
                          >
                            <DynamicIcon 
                              name={program?.icon}  
                              className="w-6 h-6 text-white" 
                              fallback={<GraduationCap className="w-6 h-6 text-white" />}
                            />
                          </div>
                          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-semibold text-gray-700">{program?.rating || 4.5}</span>
                          </div>
                        </div>

                        {/* Title and Duration */}
                        <div className="mb-2">
                          <h3 className="sub-heading font-bold mb-1 group-hover:text-red-700 transition-colors duration-300">
                            {program?.title || "Program Title"}
                          </h3>
                          <p className="text-red-600 text-base font-medium mb-2">{program?.subTitle || "Program Subtitle"}</p>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">{program?.duration || "2-4 years"}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-800 text-base mb-2 leading-relaxed">
                          {program?.description || "Comprehensive program designed to provide in-depth knowledge and practical skills."}
                        </p>

                        {/* Features */}
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
                          <div className="space-y-2">
                            {(program?.keyFeatures || [
                              "Industry-relevant curriculum",
                              "Experienced faculty",
                              "Hands-on learning"
                            ]).slice(0, 3).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-800">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Students Count */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">{program?.studentCount || "500+ students"}</span>
                          </div>
                          <button onClick={() => Router.push(`/blog-description/${program?.slug}`)} className="btn-primary py-2">
                            Learn More
                          </button>
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Dots */}
              {loaded && instanceRef.current && programs.length > 3 && (
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(instanceRef.current.track.details.slides.length)].map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? "bg-red-600 w-8" : "bg-gray-300 hover:bg-red-400"}`}
                      onClick={() => {
                        instanceRef.current?.moveToIdx(idx)
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No academic programs available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}