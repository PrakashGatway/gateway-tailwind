"use client"

import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Plane, MapPin, FileCheck2, Calendar, Star, Quote } from "lucide-react";
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
                                    <span className="relative z-10">Get Started Today</span>
                                </Link>
                                <Link href="/about" className="btn-secondary text-center group px-6 py-3 sm:px-8 sm:py-4">
                                    Learn More
                                </Link>
                            </div>
                            <div className="mt-6 flex items-center gap-3 text-sm sm:text-base text-muted-foreground">
                                <Star className="text-primary" /> Trusted by 5,000+ students | 4.9/5 reviews
                            </div>
                        </div>

                        {/* Right Illustration with floating animation */}
                        <div className="relative animate-fadeInRight mx-auto w-full max-w-md lg:max-w-lg xl:max-w-none">
                            <div className="relative z-10 mx-auto">
                                <Image
                                    src={content?.pageContent?.heroImage ? `${baseUrl}/uploads/${content?.pageContent?.heroImage}` : "/anime/bg01.png"}
                                    alt="Study Abroad Hero Image"
                                    width={600}
                                    height={500}
                                    className="w-full h-auto max-h-[400px] lg:max-h-[500px] xl:max-h-[80vh]"
                                    priority
                                />
                            </div>

                            {/* Background circle with pulse animation */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 sm:w-72 lg:w-96 h-64 sm:h-72 lg:h-96 bg-white bg-opacity-20 rounded-full animate-pulse-slow -z-10"></div>

                            <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce-slow"></div>
                            <div className="absolute lg:-bottom-8 -bottom-12 lg:-left-4 -left-2 z-10 border-2 border-red-600 bg-white shadow-3xl rounded-xl p-3 sm:p-4">
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

            {/* FAQ Section */}
            <section className="faq-section py-16 lg:py-20 mb-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 lg:mb-12">
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4">Frequently asked questions</h2>
                        <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">Can't find the answer you are looking for?</p>
                    </div>
                    <div className="max-w-4xl mx-auto">
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
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-16 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="bg-[#fbe7ea] rounded-2xl sm:rounded-[24px] shadow-lg mx-auto w-full max-w-[1127px]">
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