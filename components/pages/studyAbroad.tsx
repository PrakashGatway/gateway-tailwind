"use client"

import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Plane, MapPin, FileCheck2, Calendar, Star, Quote } from "lucide-react";
import Link from "next/link";
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

    return (
        <>
            {/* HERO */}
            <section className="hero-gradient pt-10 py-12 pb-0 lg:pb-10 flex items-center relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-28 left-10 w-4 h-4 bg-red-500 rounded-full animate-bounce-slow"></div>
                    <div className="absolute top-32 left-16 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-1"></div>
                    <div className="absolute top-44 left-12 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-2"></div>
                    <div className="absolute top-56 left-18 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-3"></div>
                    <div className="absolute top-68 left-14 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow animate-stagger-4"></div>

                    <div className="absolute top-20 right-20 w-20 h-20 border-2 border-red-300 rounded-full animate-rotate-slow"></div>
                    <div className="absolute bottom-40 left-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-red-300 animate-float"></div>

                    {/* Additional floating elements */}
                    <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-pink-400 rounded-full animate-float animate-stagger-2"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-8 h-8 bg-yellow-400 rounded-full animate-bounce-slow animate-stagger-3"></div>
                </div>

                <div className="container-sm mx-auto px-12 py-28 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content with staggered animations */}
                        <div className="space-y-3">
                            <div className="">
                                <h1 className="text-3xl lg:text-[2.5rem] font-bold leading-tight">
                                    <span className="inline-block">{content?.title.split(" ").slice(0, 3).join(" ")}</span>
                                    <br />
                                    {<> <span className="text-[#D41833] py-2 inline-block">
                                        {content?.title.split(" ").slice(3).join(" ")}
                                    </span>
                                        <br /> </>}
                                </h1>
                            </div>

                            <div className="mb-3">
                                <div className="text-gray-800 text-base leading-relaxed max-w-2xl" >{content?.subTitle} </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 animate-stagger-4">
                                <Link href="/contact" className="btn-primary inline-block text-center group">
                                    <span className="relative z-10">Get Started Today</span>
                                </Link>
                                <Link href="/about" className="btn-secondary text-center group">
                                    Learn More
                                </Link>
                            </div>
                            <div className="mt-6 flex items-center gap-3 text-base text-muted-foreground">
                                <Star className="text-primary" /> Trusted by 5,000+ students | 4.9/5 reviews
                            </div>
                        </div>

                        {/* Right Illustration with floating animation */}
                        <div className="relative animate-fadeInRight mx-auto w-full max-w-xl lg:max-w-none">
                            <div className="relative z-10 mx-auto ">
                                <img className="max-h-[80vh]" src={content?.pageContent?.heroImage ? `${baseUrl}/uploads/${content?.pageContent?.heroImage}` : "/anime/bg01.png"} alt="" height={'auto'} width={'auto'} />
                            </div>

                            {/* Background circle with pulse animation */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-white bg-opacity-20 rounded-full animate-pulse-slow -z-10"></div>

                            <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce-slow"></div>
                            <div className="absolute lg:-bottom-8 -bottom-12 lg:-left-0 left-0 z-10 border border-2 border-red-600 bg-white shadow-3xl rounded-xl p-2 sm:p-3">
                                <h3 className="text-lg sm:text-xl m-0 font-bold text-center">99.99%</h3>
                                <p className="text-xs sm:text-sm m-0 text-center">Success Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <EnhancedMultiStepForm />
            <DestinationSection content={getContentByType('StudyDestinations')} />
            <DegreesSection content={getContentByType('AcademicPrograms')} />
            <CardLayout content={getContentByType('WhyChooseUs')} />
            <ProcessRoadmap content={getContentByType('roadmap')} />
            <Component />
            <ReadMoreSection content={getContentByType('content')} />
            <section className="faq-section py-70 mb-0">
                <div className="container">
                    <div className="title text-center mb-5">
                        <h2 className="heading mb-2">Frequently asked questions</h2>
                        <p className="descp text-center">Can't find the answer you are looking for?</p>
                    </div>
                    <div className="max-w-6xl mx-auto">
                        <Accordion type="single" collapsible className="w-full">
                            {faqData.map((f: any, index: number) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="text-lg font-semibold text-left py-2">{f.title}</AccordionTrigger>
                                    <AccordionContent className="text-gray-700 pb-3">{f.content}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            <section className="app-banner-section counselling-session-sec">
                <div className="container-sm">
                    <div className="app-banner-section-inner counselling-session-sec-inner">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="app-banner-content-left">
                                    <h2 className="mb-3">Avail A Complementary Counselling Session</h2>
                                    <p className="mb-4">Join thousand of instructors and earn money hassle free!</p>
                                    {/* Changed Link import and usage for Next.js */}
                                    <Link href='/contact' className='site-btn'>Contact us</Link>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="app-banner-content-right text-center">
                                    {/* Ensure image path is correct for Next.js public directory */}
                                    <img className="mx-auto" src="/img/counselling-session.svg" alt="Counselling Session" />
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