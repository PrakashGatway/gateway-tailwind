"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import PageServices from '@/services/PageServices';
import { constant } from '@/constant/index.constant';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGlobal } from '@/hooks/AppStateContext';

function SpokenEnglish() {
    const router = useRouter();
    const [testimonials, setTestimonial] = useState([]);
    const [faqData, setFaqData] = useState([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    const { spokenEnglish: spokenEnglishDetails } = useGlobal();

    // Keen Slider config — always 2 per view
    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        drag: true,
        slides: {
            perView: 2,
            spacing: 16,
        },
        breakpoints: {
            '(min-width: 1024px)': {
                slides: {
                    perView: 2,
                    spacing: 24,
                },
            },
        },
        created: (slider) => {
            let timeout: NodeJS.Timeout;
            const startAutoPlay = () => {
                timeout = setInterval(() => {
                    if (slider.track.details.slides.length > 1) {
                        slider.next();
                    }
                }, 4000);
            };

            const stopAutoPlay = () => {
                if (timeout) clearInterval(timeout);
            };

            // Only auto-play if more than 1 slide
            if (slider.track.details.slides.length > 1) {
                startAutoPlay();
            }

            slider.container.addEventListener('mouseenter', stopAutoPlay);
            slider.container.addEventListener('mouseleave', startAutoPlay);

            return () => {
                stopAutoPlay();
                slider.container.removeEventListener('mouseenter', stopAutoPlay);
                slider.container.removeEventListener('mouseleave', startAutoPlay);
            };
        },
    });

    const getAllfaqData = async (value: string) => {
        try {
            const response = await PageServices.getAllFaqForFront(value);
            if (response.status === 'success') {
                setFaqData(response.data.faq || []);
            }
        } catch (error) {
            console.error('Error fetching FAQ data:', error);
        }
    };

    const getAllTestimonial = async (value: string) => {
        try {
            const response = await PageServices.getTestimonialByCat(value);
            if (response.status === 'success') {
                setTestimonial(response.data.testimonial || []);
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        }
    };

    useEffect(() => {
        setActiveTab(spokenEnglishDetails?.ComponentsLanguage?.[0]?.section || null);
    }, [spokenEnglishDetails]);

    useEffect(() => {
        getAllfaqData("spokenEnglish");
        getAllTestimonial("spokenEnglish");
    }, []);

    const sanitizedData = () => ({
        __html: spokenEnglishDetails?.Description || '',
    });

    const handlePrev = useCallback(() => {
        instanceRef.current?.prev();
    }, [instanceRef]);

    const handleNext = useCallback(() => {
        instanceRef.current?.next();
    }, [instanceRef]);

    return (
        <div>
            {/* Hero Section */}
            <section className="hero-gradient py-16 md:py-20 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-60 left-10 w-4 h-4 bg-blue-500 rounded-full animate-bounce-slow"></div>
                    <div className="absolute top-80 right-20 w-6 h-6 bg-green-500 rounded-full animate-float"></div>
                    <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse-slow"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 items-center">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-black-600 pt-[40px]">
                                {spokenEnglishDetails?.Title?.split(':')[0]}{' :'}
                                <span className="text-gradient text-black-600 ">
                                    {spokenEnglishDetails?.Title?.split(':')?.slice(1).join(' ')}
                                </span>
                            </h1>
                            <div className="text-gray-600 text-justify leading-relaxed mb-6">
                                {spokenEnglishDetails?.SubTitle || ''}
                                <div dangerouslySetInnerHTML={sanitizedData()} />
                            </div>
                            <Link
                                href="/contact"
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 inline-block"
                            >
                                Enroll Now
                            </Link>
                        </div>

                        <div className="relative">
                            <Image
                                src={`${constant.REACT_APP_URL}/uploads/${spokenEnglishDetails?.image}`}
                                alt="Spoken English"
                                width={500}
                                height={400}
                                className="w-full object-cover pl-[60px]"
                            />
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-green-500 text-white p-2 rounded-full">
                                <Star className="h-5 w-5" />
                            </div>
                            <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-blue-500 to-green-500 text-white p-2 rounded-full">
                                <Star className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

  {/* Why Choose Section */}
<section className="py-12 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 pb-[30px]">
            Why Choose Gateway Abroad for Spoken English Classes?
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
            {spokenEnglishDetails?.WhyChoose?.map((data, index) => (
                <div
                    key={index}
                    className="bg-[#f3f4f6] rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 shadow-[0_4px_6px_rgba(0,0,0,0.18)] w-full md:max-w-[400px] lg:max-w-[480px]"
                >
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-[60px] h-[60px] bg-[#d71635] rounded-full flex items-center justify-center">
                                <Image
                                    src="/img/mic.png"
                                    alt="Icon"
                                    width={30}
                                    height={24}
                                    className="rounded-full object-cover"
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">{data.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {typeof data.content === 'string'
                                    ? data.content
                                    : data.content?.toString() || 'No description available.'}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
</section>

            {/* Testimonials Section */}
            <section className="py-12 bg-gray-300 relative">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/img/gmat-testimonials-bg.svg"
                        alt="Background"
                        fill
                        className="object-cover"
                        quality={75}
                    />
                </div>
                <div className="absolute inset-0 bg-gray-400/10 z-1"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
                        What Our Spoken English Prep Achievers Say
                    </h2>

                    {testimonials.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">Loading testimonials...</div>
                    ) : (
                        <div className="relative group">
                            <div ref={sliderRef} className="keen-slider">
                                {testimonials.map((test, idx) => (
                                    <div key={idx} className="keen-slider__slide p-2 pb-6">
                                        <div className="relative bg-white box-border caret-transparent z-0 ml-[30px] rounded-3xl md:ml-[50px] shadow-lg before:accent-auto before:border-b-gray-200 before:box-border before:caret-transparent before:text-neutral-800 before:block before:text-base before:not-italic before:normal-nums before:font-normal before:h-0 before:left-[-35px] before:tracking-[normal] before:leading-6 before:list-outside before:list-disc before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-0 before:z-[-1] before:border-t-white before:border-t-[25px] before:border-x-transparent before:border-x-[50px] before:border-separate before:border-solid before:top-0 before:font-noto_sans before:md:left-[-50px] before:md:border-t-[55px] before:md:border-x-[80px]">
                                            <div className="box-border caret-transparent pt-5 px-5 md:pt-[35px] md:px-[30px]">
                                                <div className="items-center box-border caret-transparent flex justify-between">
                                                    <h6 className="text-gray-700 text-lg font-bold box-border caret-transparent leading-[21.6px] mb-2">
                                                        {test.name}
                                                    </h6>
                                                    <ul className="box-border caret-transparent flex leading-[normal] list-none mb-4 pl-0">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <li key={star} className="text-amber-400 text-lg box-border caret-transparent">
                                                                <Star className="w-[18px] h-[18px] fill-amber-400" />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <p className="text-zinc-500 text-sm font-medium box-border caret-transparent max-w-[90%] min-h-0 text-left mb-4 py-[15px] md:max-w-none md:min-h-[198px]">
                                                    {test.content}
                                                </p>
                                            </div>
                                            <div className="bg-red-600 box-border caret-transparent px-5 py-3.5 rounded-b-3xl md:px-[30px]"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation buttons — only show if more than 1 testimonial */}
                            {testimonials.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200 z-10"
                                    >
                                        <ChevronLeft className="h-6 w-6 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200 z-10"
                                    >
                                        <ChevronRight className="h-6 w-6 text-gray-600" />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* English Components Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Components of the English Language
                        </h2>
                        <p className="text-gray-600">
                            The English language can be broken down into several key components that work together to create meaning
                        </p>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-5/12">
                            <Image
                                src="/img/english-components-img.svg"
                                alt="english-components"
                                width={350}
                                height={350}
                                className="mx-auto"
                            />
                        </div>
                        <div className="lg:w-7/12">
                            {spokenEnglishDetails?.ComponentsLanguage &&
                                spokenEnglishDetails.ComponentsLanguage.length > 0 && (
                                    <>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {spokenEnglishDetails.ComponentsLanguage.map((data: any) => (
                                                <button
                                                    key={`trigger-${data.id}`}
                                                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === data.section
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                    onClick={() => setActiveTab(data.section)}
                                                >
                                                    {data.section}
                                                </button>
                                            ))}
                                        </div>

                                        {spokenEnglishDetails.ComponentsLanguage.map((data: any) => (
                                            <div
                                                key={`content-${data.section}`}
                                                className={`${activeTab === data.section ? 'block' : 'hidden'}`}
                                            >
                                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                                    <p className="text-gray-700 text-justify mb-3">{data.content}</p>
                                                    {data.components && data.components.length > 0 && (
                                                        <div className="space-y-2">
                                                            {data.components.map(
                                                                (innerData: any, idx: number) => (
                                                                    <p
                                                                        key={`${innerData.name}-${idx}`}
                                                                        className="text-gray-700 text-justify text-sm"
                                                                    >
                                                                        <strong className="font-semibold text-gray-800">
                                                                            {innerData.name}
                                                                        </strong>{' '}
                                                                        {innerData.description}
                                                                    </p>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Frequently asked questions
                        </h2>
                        <p className="text-gray-600">Can't find the answer you are looking for?</p>
                    </div>
                    <div className="max-w-7xl mx-auto">
                        <Accordion type="single" collapsible className="w-full space-y-3">
                            {faqData.map((f: any, index: number) => (
                                <AccordionItem
                                    value={`item-${index}`}
                                    key={index}
                                    className="border border-gray-200 rounded-lg px-4"
                                >
                                    <AccordionTrigger className="text-left py-3 hover:no-underline font-medium">
                                        {f.title}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-700 pb-3 text-sm">
                                        {f.content}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="relative bg-[linear-gradient(rgba(188,140,252,0.2),rgba(215,22,53,0.2))] box-border caret-transparent py-[35px] md:py-[50px] before:accent-auto before:backdrop-blur-[75px] before:box-border before:caret-transparent before:text-neutral-800 before:block before:fill-white/80 before:text-base before:not-italic before:normal-nums before:font-normal before:h-full before:tracking-[normal] before:leading-6 before:list-outside before:list-disc before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-full before:z-[-1] before:border-separate before:inset-0 before:font-noto_sans">
                <div className="box-border caret-transparent max-w-4xl w-full max-w-7xl mx-auto px-3">
                    <div className="box-border caret-transparent">
                        <h2 className="text-gray-700 text-[22px] font-bold box-border caret-transparent inline-block leading-[26.4px] mb-2 md:text-[32px] md:leading-[38.4px]">
                            Plans &amp; Pricing
                        </h2>
                        <p className="text-zinc-500 font-medium box-border caret-transparent text-left mb-4">
                            We are accepting PayPal, Paytm, PhonePe and Debit &amp; Credit Card
                        </p>
                    </div>
                    <div className="backdrop-blur-[17.5px] bg-white shadow-[rgba(0,0,0,0.1)_0px_30px_45px_0px] box-border caret-transparent mt-10 pt-10 pb-2.5 px-2.5 rounded-[26px] md:mt-[50px] md:pb-10 md:px-[15px]">
                        <div className="box-border caret-transparent flex flex-wrap justify-center -mx-3">
                            <div className="box-border caret-transparent shrink-0 max-w-full w-full px-3 md:w-[33.3333%]">
                                <div className="box-border caret-transparent mb-[30px] md:mb-0 md:px-[30px] px-5">
                                    <h5 className="text-[28px] font-medium box-border caret-transparent leading-[33.6px] mb-5 text-zinc-700">Classroom training</h5>
                                    <div className="box-border caret-transparent">
                                        <ul className="box-border caret-transparent leading-[normal] list-none min-h-0 mb-[25px] pl-0 md:min-h-[242px]">
                                            <li className="relative text-neutral-600 font-medium box-border caret-transparent text-justify mb-2.5 pl-[30px] before:accent-auto before:bg-[url('https://www.gatewayabroadeducations.com/_next/static/media/check-circle.532cdb95.svg')] before:bg-size-[100%] before:box-border before:caret-transparent before:text-neutral-600 before:block before:text-base before:not-italic before:normal-nums before:font-medium before:h-5 before:tracking-[normal] before:leading-[normal] before:list-outside before:list-none before:pointer-events-auto before:absolute before:text-justify before:indent-[0px] before:normal-case before:visible before:w-5 before:border-separate before:left-0 before:font-noto_sans">
                                                Tired of feeling tongue-tied? Gateway Abroad's interactive English test preparation classes are designed to transform you from shy to shine!
                                            </li>
                                            <li className="relative text-neutral-600 font-medium box-border caret-transparent text-justify mb-2.5 pl-[30px] before:accent-auto before:bg-[url('https://www.gatewayabroadeducations.com/_next/static/media/check-circle.532cdb95.svg')] before:bg-size-[100%] before:box-border before:caret-transparent before:text-neutral-600 before:block before:text-base before:not-italic before:normal-nums before:font-medium before:h-5 before:tracking-[normal] before:leading-[normal] before:list-outside before:list-none before:pointer-events-auto before:absolute before:text-justify before:indent-[0px] before:normal-case before:visible before:w-5 before:border-separate before:left-0 before:font-noto_sans">
                                                Don't just learn English, live it. Our interactive spoken English classes get you talking from day one.
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="box-border caret-transparent text-center">
                                        <button className="text-white text-base font-bold bg-[#d71635] shadow-[rgba(0,0,0,0.2)_0px_0px_8px_0px] caret-transparent leading-6 px-12 py-2.5 rounded-[35px] md:text-lg md:leading-[27px]">Choose Plan</button>
                                    </div>
                                </div>
                            </div>

                            <div className="box-border caret-transparent shrink-0 max-w-full w-full px-3 md:w-[33.3333%]">
                                <div className="box-border caret-transparent mb-[30px] md:mb-0 md:px-[30px] px-5">
                                    <h5 className="text-[28px] font-medium box-border caret-transparent leading-[33.6px] mb-5 text-zinc-700">Live online training</h5>
                                    <div className="box-border caret-transparent">
                                        <ul className="box-border caret-transparent leading-[normal] list-none min-h-0 mb-[25px] pl-0 md:min-h-[242px]">
                                            <li className="relative text-neutral-600 font-medium box-border caret-transparent text-justify mb-2.5 pl-[30px] before:accent-auto before:bg-[url('https://www.gatewayabroadeducations.com/_next/static/media/check-circle.532cdb95.svg')] before:bg-size-[100%] before:box-border before:caret-transparent before:text-neutral-600 before:block before:text-base before:not-italic before:normal-nums before:font-medium before:h-5 before:tracking-[normal] before:leading-[normal] before:list-outside before:list-none before:pointer-events-auto before:absolute before:text-justify before:indent-[0px] before:normal-case before:visible before:w-5 before:border-separate before:left-0 before:font-noto_sans">
                                                Can't make it to a physical classroom? No problem! Gateway Abroad's comprehensive online English test preparation classes offer the same exceptional instruction.
                                            </li>
                                            <li className="relative text-neutral-600 font-medium box-border caret-transparent text-justify mb-2.5 pl-[30px] before:accent-auto before:bg-[url('https://www.gatewayabroadeducations.com/_next/static/media/check-circle.532cdb95.svg')] before:bg-size-[100%] before:box-border before:caret-transparent before:text-neutral-600 before:block before:text-base before:not-italic before:normal-nums before:font-medium before:h-5 before:tracking-[normal] before:leading-[normal] before:list-outside before:list-none before:pointer-events-auto before:absolute before:text-justify before:indent-[0px] before:normal-case before:visible before:w-5 before:border-separate before:left-0 before:font-noto_sans">
                                                Fit fluency into your busy schedule. Gateway Abroad's online spoken English courses offer flexibility and results.
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="box-border caret-transparent text-center">
                                        <button className="text-white text-base font-bold bg-[#d71635] shadow-[rgba(0,0,0,0.2)_0px_0px_8px_0px] caret-transparent leading-6 px-12 py-2.5 rounded-[35px] md:text-lg md:leading-[27px]">Choose Plan</button>
                                    </div>
                                </div>
                            </div>

                            <div className="box-border caret-transparent shrink-0 max-w-full w-full px-3 md:w-[33.3333%]">
                                <div className="box-border caret-transparent mb-[30px] md:mb-0 md:px-[30px] bg-[#d71635] shadow-[rgba(31,27,45,0.2)_0px_42px_34px_0px] mt-0 p-5 rounded-[26px] md:mt-[-85px]">
                                    <div className="box-border caret-transparent text-right mb-[15px]">
                                        <button className="text-white text-[10px] font-extrabold bg-zinc-800 caret-transparent tracking-[0.833px] leading-[15px] text-center px-4 py-[7px] rounded-[20px]">Most Popular</button>
                                    </div>
                                    <h5 className="text-[28px] font-medium box-border caret-transparent leading-[33.6px] mb-5 text-white">Hybrid</h5>
                                    <div className="box-border caret-transparent">
                                        <ul className="box-border caret-transparent leading-[normal] list-none min-h-0 mb-[25px] pl-0 md:min-h-[242px]">
                                            <li className="relative text-white font-medium box-border caret-transparent text-justify mb-2.5 pl-[30px] before:accent-auto before:bg-[url('https://www.gatewayabroadeducations.com/_next/static/media/check-circle-2.3eccd6cf.svg')] before:bg-size-[100%] before:box-border before:caret-transparent before:text-white before:block before:text-base before:not-italic before:normal-nums before:font-medium before:h-5 before:tracking-[normal] before:leading-[normal] before:list-outside before:list-none before:pointer-events-auto before:absolute before:text-justify before:indent-[0px] before:normal-case before:visible before:w-5 before:border-separate before:left-0 before:font-noto_sans">
                                                Get the best of both worlds with our hybrid courses - the flexibility of online learning combined with personalized support.
                                            </li>
                                            <li className="relative text-white font-medium box-border caret-transparent text-justify mb-2.5 pl-[30px] before:accent-auto before:bg-[url('https://www.gatewayabroadeducations.com/_next/static/media/check-circle-2.3eccd6cf.svg')] before:bg-size-[100%] before:box-border before:caret-transparent before:text-white before:block before:text-base before:not-italic before:normal-nums before:font-medium before:h-5 before:tracking-[normal] before:leading-[normal] before:list-outside before:list-none before:pointer-events-auto before:absolute before:text-justify before:indent-[0px] before:normal-case before:visible before:w-5 before:border-separate before:left-0 before:font-noto_sans">
                                                Do you crave the structure of a classroom but also enjoy online learning flexibility? Our hybrid classes offer the perfect solution!
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="box-border caret-transparent text-center">
                                        <button className="text-white text-base font-bold bg-black shadow-[rgba(0,0,0,0.2)_0px_0px_8px_0px] caret-transparent leading-6 px-12 py-2.5 rounded-[35px] md:text-lg md:leading-[27px]">Choose Plan</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

              {/* ====== Counselling Session Section ====== */}
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
              <img
                src="img/counselling-session.svg"
                alt="Counselling Session"
                className="w-full max-w-xs sm:max-w-sm lg:max-w-[25rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
        </div>
    );
}

export default SpokenEnglish;