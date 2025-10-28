"use client"

import { useKeenSlider, KeenSliderPlugin, KeenSliderInstance } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { useEffect, useState, useRef } from "react"
import Swal from "sweetalert2"
import axiosInstance, { baseUrl } from "@/services/axiosInstance"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Define types for our data
interface PageContent {
    sliderImage?: string
    [key: string]: any
}

interface Section {
    type: string
    content: any
}

interface Destination {
    slug: string
    pageContent?: PageContent
    tags?: string[]
    sections?: Section[]
    sliderData?: any
    universities?: number
    students?: number
}

interface DestinationsSectionProps {
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

export default function DestinationsSection({ content }: DestinationsSectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(true)
    const [pages, setPages] = useState<Destination[]>([])
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)
    const sliderContainerRef = useRef<HTMLDivElement>(null)

    let Router = useRouter()

    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
        {
            loop: true,
            mode: "free",
            slides: {
                perView: 3.4,
                spacing: 20,
            },
            breakpoints: {
                "(max-width: 768px)": {
                    slides: {
                        perView: 2.1,
                        spacing: 16,
                    },
                },
                "(max-width: 1024px)": {
                    slides: {
                        perView: 1,
                        spacing: 4,
                    },
                },
            },
            slideChanged(slider) {
                setCurrentSlide(slider.track.details.rel)
            },
            created() {
                setLoaded(true)
            },
        },
        [AutoPlayPlugin]
    )

    function getDestinationsWithSlider(destinationsData: any[]): Destination[] {
        return destinationsData
            .filter((destination: any) =>
                destination.pageContent &&
                destination.pageContent.sliderImage &&
                destination.slug &&
                destination.sections
            )
            .map((destination: any) => {
                const sliderSection = destination.sections.find(
                    (section: any) => section.type === 'slider'
                )

                return {
                    slug: destination.slug,
                    sliderImage: destination.pageContent.sliderImage,
                    tags: destination.tags || [],
                    sliderData: sliderSection ? sliderSection.content : {},
                    universities: destination.universities || 200,
                    students: destination.students || 2000
                }
            })
    }

    const fetchPages = async () => {
        try {
            setLoading(true)
            const { data } = await axiosInstance.get("/page?limit=10&pageType=country_page")

            if (data?.data && data.data.length > 0) {
                const destinationsWithSlider = getDestinationsWithSlider(data.data)
                setPages(destinationsWithSlider)
            } else {
                setPages([])
            }
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.message || "Failed to fetch pages",
            })
            setPages([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPages()
    }, [])

    // Reset slider when pages change
    useEffect(() => {
        if (pages.length > 0 && instanceRef.current) {
            instanceRef.current.update()
        }
    }, [pages, instanceRef])

    if (loading) {
        return (
            <section className="py-20 bg-[#FAFBFF] relative overflow-hidden">
                <div className="container-sm mx-auto px-4 relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="heading mb-1">Loading destinations...</h2>
                    </div>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 bg-[#FAFBFF] relative overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0">
                {/* Floating Particles */}
                <div className="absolute top-20 left-10 w-2 h-2 bg-red-400 rounded-full animate-float"></div>
                <div className="absolute top-40 right-20 w-3 h-3 bg-rose-400 rounded-full animate-float-delayed opacity-40"></div>
                <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-float-slow opacity-50"></div>

                {/* Gradient Blobs */}
                <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-red-300/20 to-rose-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-r from-rose-300/20 to-orange-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-10 left-1/3 w-72 h-72 bg-gradient-to-r from-orange-300/20 to-red-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="container-sm mx-auto px-4 relative z-10">
                {/* Enhanced Section Header */}
                <div className="text-center mb-10 animate-fade-in">
                    <h2 className="heading mb-1">
                        {content?.title || "Study Destinations that you want"}
                    </h2>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        {content?.subTitle || "Explore world-class education opportunities across the globe. Choose your dream destination and start your journey to academic excellence."}
                    </p>
                </div>

                {/* Enhanced Slider Container */}
                <div className="relative" ref={sliderContainerRef}>
                    {pages.length > 0 ? (
                        <>
                            <div ref={sliderRef} className="keen-slider">
                                {pages.map((destination, index) => (
                                    <div key={index} className="keen-slider__slide px-1 py-6">
                                        <div
                                            className="destination-card bg-white backdrop-blur-sm rounded-2xl transition-all duration-700 overflow-hidden group border border-white/50 animate-slide-up hover:shadow-2xl hover:-translate-y-4 hover:rotate-1 hover:border-red-200 hover:shadow-red-100/50 hover:bg-white"
                                            style={{ animationDelay: `${index * 150}ms` }}
                                            onMouseEnter={() => setHoveredCard(index)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            {/* Enhanced Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-rose-500/0 to-orange-500/0 group-hover:from-red-500/5 group-hover:via-rose-500/5 group-hover:to-orange-500/5 rounded-2xl transition-all duration-700"></div>

                                            {/* Enhanced Image Container */}
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={destination?.sliderImage ? `${baseUrl}/uploads/${destination.sliderImage}` : "https://acko-cms.ackoassets.com/Best_time_to_visit_UK_6dae1f2b10.png"}
                                                    alt={`Study in ${destination?.sliderData?.label || destination.slug}`}
                                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                                                />

                                                {/* Enhanced Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-red-900/70 transition-all duration-700"></div>

                                                {/* Enhanced Stats Badge */}
                                                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-2 py-1 transform transition-all duration-500 group-hover:scale-110 group-hover:bg-red-50 shadow-lg">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-red-600 font-bold text-sm">{destination.universities}+</span>
                                                        <span className="text-gray-700 text-xs">Universities</span>
                                                    </div>
                                                </div>

                                                {/* Students Count Badge */}
                                                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-red-600 to-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform transition-all duration-300 group-hover:scale-110">
                                                    {destination.students}+ Students
                                                </div>
                                            </div>

                                            {/* Enhanced Content */}
                                            <div className="p-3">
                                                <h3 className="sub-heading transition-all duration-300 mb-2 flex items-center gap-2">
                                                    {destination?.sliderData?.label || destination.slug}
                                                </h3>

                                                <p className="text-slate-600 text-sm mb-2 leading-relaxed duration-300">
                                                    {destination?.sliderData?.title || "World-class education opportunities"}
                                                </p>

                                                {/* Enhanced Programs Tags */}
                                                <div className="mb-3">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {destination?.tags && destination.tags
                                                            .slice(0, 2)
                                                            .map((program, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="bg-gradient-to-r from-red-50 to-rose-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium border border-red-200/50 transition-all duration-300 group-hover:from-red-100 group-hover:to-rose-100 group-hover:border-red-300 group-hover:scale-105 group-hover:-translate-y-0.5"
                                                                    style={{ animationDelay: `${idx * 100}ms` }}
                                                                >
                                                                    {program}
                                                                </span>
                                                            ))}
                                                        {destination.tags && destination.tags.length > 2 && (
                                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:bg-red-100 group-hover:text-red-600">
                                                                +{destination.tags.length - 2} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Enhanced CTA Button */}
                                                <button onClick={()=>Router.push(`/study-in-${destination?.slug?.toLowerCase()}`)} className="w-full btn-primary group/btn">
                                                    <span className="flex items-center justify-center relative z-10 gap-2">
                                                        <span>Explore Now</span>
                                                        <svg
                                                            className="w-4 h-4 transform group-hover/btn:translate-x-1 group-hover/btn:scale-110 transition-all duration-300"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                            />
                                                        </svg>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Dots - Only show if we have multiple pages */}
                            {loaded && instanceRef.current && pages.length > 3 && (
                                <div className="flex justify-center mt-12 space-x-2">
                                    {[...Array(instanceRef.current.track.details.slides.length)].map((_, idx) => (
                                        <button
                                            key={idx}
                                            className={`relative transition-all duration-500 ${currentSlide === idx
                                                ? "w-8 h-3 bg-gradient-to-r from-red-600 to-rose-600 rounded-full shadow-lg"
                                                : "w-3 h-3 bg-slate-300 hover:bg-red-300 rounded-full hover:scale-125"
                                                }`}
                                            onClick={() => {
                                                instanceRef.current?.moveToIdx(idx)
                                            }}
                                        >
                                            {currentSlide === idx && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 rounded-full animate-pulse shadow-lg"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-600">No destinations available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}