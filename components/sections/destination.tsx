"use client"

import { useKeenSlider, KeenSliderPlugin, KeenSliderInstance } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { useEffect, useState, useRef } from "react"
import Swal from "sweetalert2"
import axiosInstance, { baseUrl } from "@/services/axiosInstance"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, Users, University, ArrowRight, Star, Globe } from "lucide-react"

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

// Fixed Auto-play plugin with proper typing
const AutoPlayPlugin: KeenSliderPlugin = (slider) => {
    let timeout: ReturnType<typeof setTimeout>
    let mouseOver = false

    function clearNextTimeout() {
        clearTimeout(timeout)
    }

    function nextTimeout() {
        clearTimeout(timeout)
        if (mouseOver) return
        timeout = setTimeout(() => {
            slider.next()
        }, 2000)
    }

    slider.on("created", () => {
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
                perView: 3.2,
                spacing: 25,
            },
            breakpoints: {
                "(max-width: 768px)": {
                    slides: {
                        perView: 1.8,
                        spacing: 20,
                    },
                },
                "(max-width: 640px)": {
                    slides: {
                        perView: 1.2,
                        spacing: 15,
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
        [AutoPlayPlugin] // Now properly defined
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
            <section className="py-20 bg-gradient-to-br from-white via-rose-50/30 to-red-50/20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading destinations...</h2>
                    </div>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 bg-gradient-to-br from-white via-rose-50/30 to-red-50/20 relative overflow-hidden">
            {/* Geometric Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Geometric Shapes */}
                <div className="absolute top-10 left-5 w-6 h-6 border-2 border-red-300/40 rotate-45 animate-float"></div>
                <div className="absolute top-40 right-16 w-8 h-8 border-2 border-rose-300/30 rotate-12 animate-float-delayed"></div>
                <div className="absolute bottom-20 left-20 w-4 h-4 bg-red-400/20 rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-rose-400/30 rotate-45 animate-bounce-slow"></div>

                {/* Gradient Orbs */}
                <div className="absolute -top-24 -left-24 w-80 h-80 bg-gradient-to-r from-red-200/30 to-rose-200/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-l from-rose-200/25 to-orange-200/15 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Enhanced Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-4">
                        <Globe className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-700">Global Study Destinations</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-red-800 bg-clip-text text-transparent mb-4">
                        {content?.title || "Discover Your Dream Study Destination"}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {content?.subTitle || "Embark on an educational journey at world-renowned institutions across the globe. Your future starts here."}
                    </p>
                </div>

                {/* Modern Slider Container */}
                <div className="relative" ref={sliderContainerRef}>
                    {pages.length > 0 ? (
                        <>
                            {/* Navigation Arrows */}
                            {loaded && instanceRef.current && (
                                <>
                                    <button
                                        onClick={() => instanceRef.current?.prev()}
                                        className="absolute -left-4 lg:-left-6 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:border-red-300 group flex items-center justify-center"
                                    >
                                        <ArrowRight className="w-5 h-5 text-gray-600 rotate-180 group-hover:text-red-600 transition-colors" />
                                    </button>
                                    <button
                                        onClick={() => instanceRef.current?.next()}
                                        className="absolute -right-4 lg:-right-6 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:border-red-300 group flex items-center justify-center"
                                    >
                                        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                                    </button>
                                </>
                            )}

                            <div ref={sliderRef} className="keen-slider pb-4">
                                {pages.map((destination, index) => (
                                    <div key={index} className="keen-slider__slide py-2">
                                        {/* Modern Card Design */}
                                        <div
                                            className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-red-100"
                                            onMouseEnter={() => setHoveredCard(index)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            {/* Background Pattern */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white via-red-50/50 to-rose-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            {/* Image Container with Overlay */}
                                            <div className="relative h-48 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
                                                <img
                                                    src={destination?.sliderImage ? `${baseUrl}/uploads/${destination.sliderImage}` : "https://acko-cms.ackoassets.com/Best_time_to_visit_UK_6dae1f2b10.png"}
                                                    alt={`Study in ${destination?.sliderData?.label || destination.slug}`}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                />

                                                {/* Country Badge */}
                                                <div className="absolute top-4 left-4 z-20">
                                                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg">
                                                        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 text-red-600" />
                                                            {destination?.sliderData?.label || destination.slug}
                                                        </h3>
                                                    </div>
                                                </div>

                                                {/* Stats Overlay */}
                                                <div className="absolute bottom-4 left-4 right-4 z-20">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                                                                <div className="flex items-center gap-1">
                                                                    <University className="w-3 h-3 text-red-600" />
                                                                    <span className="text-xs font-bold text-gray-900">{destination.universities}+</span>
                                                                </div>
                                                            </div>
                                                            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                                                                <div className="flex items-center gap-1">
                                                                    <Users className="w-3 h-3 text-red-600" />
                                                                    <span className="text-xs font-bold text-gray-900">{destination.students}+</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl px-3 py-2 shadow-lg">
                                                            <div className="flex items-center gap-1">
                                                                <Star className="w-3 h-3 fill-current" />
                                                                <span className="text-xs font-bold">Top Rated</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="relative z-10 p-6">
                                                <h4 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                                                    {destination?.sliderData?.title || "World-class Education"}
                                                </h4>
                                                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                                    {destination?.sliderData?.subTitle || "Experience exceptional academic programs and vibrant campus life in your dream study destination."}
                                                </p>

                                                {/* CTA Button */}
                                                <button
                                                    onClick={() => Router.push(`/study-in-${destination?.slug?.toLowerCase()}`)}
                                                    className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg group/btn flex items-center justify-center gap-2"
                                                >
                                                    <span>Explore Destination</span>
                                                    <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>

                                            {/* Hover Effect Border */}
                                            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-red-200 group-hover:shadow-2xl transition-all duration-500 pointer-events-none"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Modern Navigation Dots */}
                            {loaded && instanceRef.current && pages.length > 1 && (
                                <div className="flex justify-center mt-8 space-x-2">
                                    {[...Array(instanceRef.current.track.details.slides.length)].map((_, idx) => (
                                        <button
                                            key={idx}
                                            className={`relative transition-all duration-300 ${currentSlide === idx
                                                    ? "w-8 h-2 bg-gradient-to-r from-red-600 to-rose-600 rounded-full shadow-lg transform scale-110"
                                                    : "w-2 h-2 bg-gray-300 hover:bg-red-300 rounded-full hover:scale-125"
                                                }`}
                                            onClick={() => {
                                                instanceRef.current?.moveToIdx(idx)
                                            }}
                                        >
                                            {currentSlide === idx && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 rounded-full animate-pulse"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        !loading && (
                            <div className="text-center py-16">
                                <div className="bg-white rounded-3xl p-8 max-w-md mx-auto shadow-lg border border-gray-100">
                                    <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Destinations Available</h3>
                                    <p className="text-gray-600 mb-4">We're updating our study destinations. Please check back later.</p>
                                    <button
                                        onClick={fetchPages}
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-2xl p-6 inline-block">
                        <p className="text-gray-700 font-medium">
                            Can't find your preferred destination?{" "}
                            <Link href="/contact" className="text-red-600 hover:text-red-700 font-semibold underline transition-colors">
                                Contact our advisors
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}