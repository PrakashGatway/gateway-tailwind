// components/sections/WhyStudyUK.jsx
"use client";

import { useState } from "react";
import { highlightText } from "../pages/studyInUk";
import { DynamicIcon } from "../sections/processRoad";

export default function WhyStudyUK() {
    const reasons = [
        {
            icon: "⏱️",
            title: "1-Year Master's Degrees",
            description: "UK PG programs take just 12 months vs 2 years in Australia or USA — saving one full year of living costs (₹8–15 lakhs) and getting you into the job market faster.",
            badge: "Huge Cost Saving"
        },
        {
            icon: "🏛️",
            title: "World's Best Universities",
            description: "24 Russell Group universities including Oxford, Cambridge, UCL, Imperial, Manchester and LSE rank consistently in the global top 100. UK has more top-100 universities per capita than any other country.",
            badge: "Global Ranking"
        },
        {
            icon: "💼",
            title: "2-Year Post-Study Work Visa",
            description: "The Graduate Route Visa lets you work in the UK for 2 years (3 years for PhD holders) after graduation — with no job offer required. In 2025, 90,153 Indian nationals received Graduate Route extensions.",
            badge: "Work Freely"
        },
        {
            icon: "💷",
            title: "High Earning Potential",
            description: "UK minimum wage for graduate roles is £12.21/hour (2025). Tech, finance, and healthcare graduates from Russell Group unis average £28,000–£55,000 starting salary.",
            badge: "Great ROI"
        },
        {
            icon: "🎓",
            title: "Full Scholarships Available",
            description: "Chevening (fully funded), GREAT Scholarship (£10,000), Charles Wallace India Trust, Commonwealth Scholarships — UK has more scholarship options for Indian students than almost any other country.",
            badge: "Free Education"
        },
        {
            icon: "🌍",
            title: "No IELTS Required at Many Unis",
            description: "If your bachelor's degree was taught in English, many top UK universities accept a Medium of Instruction (MOI) certificate — no IELTS needed. Universities like Hertfordshire, UCLan, Sunderland and more.",
            badge: "IELTS Waiver"
        },
        {
            icon: "🇮🇳",
            title: "Largest Indian Student Community",
            description: "Over 150,000 Indian students currently study in the UK. Cities like London, Manchester, Birmingham, and Edinburgh have vibrant Indian communities, cultural events, and familiar food options.",
            badge: "Community"
        },
        {
            icon: "🏥",
            title: "Free NHS Healthcare",
            description: "UK students pay the Immigration Health Surcharge (IHS) which grants full access to the National Health Service (NHS) — free doctor visits, prescriptions, and hospital care throughout your stay.",
            badge: "Health Coverage"
        }
    ];

    return (
        <section className="bg-white pt-20 px-5">
            <div className="max-w-7xl px-2 mx-auto">

                {/* Title */}
                <h2 className="text-2xl lg:text-4xl xl:text-[2.4rem] max-w-3xl font-bold text-gray-800 !leading-[1.3] mb-2">
                    {highlightText("Why Study in UK from || India || in 2026? || 10 Compelling Reasons. ||")}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mb-12">
                    The UK is the world's second most popular study abroad destination, and India has now become its #1 source of international students — surpassing China for the first time. Here's why 95,000+ Indian students chose the UK in 2025.
                </p>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            className="group relative bg-gradient-to-br from-pink-100 to-amber-50 border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/5 hover:border-red-200 overflow-hidden"
                        >

                            <p className='absolute -top-[1px] rounded-bl-3xl -right-1 border bg-red-500 text-white font-semibold px-4 text-sm py-2'>
                                Free Counselling
                            </p>

                            {/* Left accent border */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#C8102E] to-[#012169] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-l-2xl" />

                            <DynamicIcon name={"Landmark"} size={45} className="!stroke-[1.2px]" color="#C8102E" />

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-gray-700 mt-3 mb-2">
                                {reason.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {reason.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


export function TopUKUniversities() {
    const [hoveredCard, setHoveredCard] = useState(null);

    const universities = [
        {
            rank: "QS #1",
            name: "University of Oxford",
            location: "Oxford, England",
            established: "Est. 1096",
            courses: ["PPE", "Law", "Medicine", "Computer Science"],
            highlight: "World's #1 University",
            image: "🏛️"
        },
        {
            rank: "QS #2",
            name: "University of Cambridge",
            location: "Cambridge, England",
            established: "Est. 1209",
            courses: ["Natural Sciences", "Engineering", "Economics"],
            highlight: "Oldest University",
            image: "🎓"
        },
        {
            rank: "QS #9",
            name: "Imperial College London",
            location: "South Kensington, London",
            established: "Est. 1907",
            courses: ["STEM", "Medicine", "Business"],
            highlight: "STEM Excellence",
            image: "🔬"
        },
        {
            rank: "QS #22",
            name: "University College London (UCL)",
            location: "Bloomsbury, London",
            established: "Est. 1826",
            courses: ["Architecture", "Law", "Data Science"],
            highlight: "Most Diverse",
            image: "🌍"
        },
        {
            rank: "QS #34",
            name: "University of Edinburgh",
            location: "Edinburgh, Scotland",
            established: "Est. 1583",
            courses: ["AI", "Informatics", "Business"],
            highlight: "AI & Tech Hub",
            image: "🏰"
        },
        {
            rank: "QS #32",
            name: "King's College London (KCL)",
            location: "Strand, London",
            established: "Est. 1829",
            courses: ["Medicine", "Law", "Nursing"],
            highlight: "Healthcare Leader",
            image: "⚕️"
        },
        {
            rank: "QS #52",
            name: "University of Manchester",
            location: "Manchester, England",
            established: "Est. 1824",
            courses: ["Business", "Engineering", "Life Sciences"],
            highlight: "Strong Indian Community",
            image: "🤝"
        },
        {
            rank: "QS #81",
            name: "University of Birmingham",
            location: "Birmingham, England",
            established: "Est. 1900",
            courses: ["MBA", "Finance", "Engineering"],
            highlight: "High Acceptance Rate",
            image: "✨"
        }
    ];

    return (
        <section className="bg-pink-100 py-20 px-5 relative overflow-hidden">

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-10">
                    <h2 className="text-2xl lg:text-4xl xl:text-[2.4rem] max-w-3xl font-bold text-gray-800 !leading-[1.3] mb-2">
                        {highlightText("Best || UK || Universities for || Indian || Students 2025–26")}
                    </h2>

                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-3xl">
                        From Oxford to Manchester, these are the most popular and highly ranked UK universities among Indian applicants — with courses, rankings, and entry requirements for 2025 intake.
                    </p>
                </div>

                {/* Universities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    {universities.map((uni, index) => (
                        <div
                            key={index}
                            className={`group relative bg-white border border-black/10 border-inner rounded-2xl p-6 transition-all duration-500 cursor-pointer overflow-hidden
                ${hoveredCard === index ? 'scale-[1.02] shadow-2xl shadow-[#C9A84C]/10 border-[#C9A84C]/40' : 'hover:border-[#C9A84C]/30'}
              `}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="absolute top-0 right-0 bg-red-600 px-3 py-1.5 rounded-bl-2xl text-sm font-medium text-white ">
                                {uni.rank}
                            </div>
                            {/* Animated gradient overlay on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

                            {/* QS Rank Tag - Enhanced */}
                            <div className="relative z-10 flex items-start justify-between mb-1">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-600 mt-1 group-hover:text-red-600 transition-colors duration-300">
                                    {uni.name}
                                </h3>
                                {/* <span className="text-3xl filter drop-shadow-lg">{uni.image}</span> */}
                            </div>

                            {/* University Name & Location */}
                            <div className="relative z-10 mb-4">

                                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {uni.location}
                                </div>
                                <p className="text-gray-500 text-sm mt-1"> {uni.established}</p>
                            </div>
                            <div className="relative z-10 flex flex-wrap gap-2 mb-5">
                                {uni.courses.map((course, i) => (
                                    <span
                                        key={i}
                                        className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 hover:bg-[#C9A84C]/20 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all duration-300"
                                    >
                                        {course}
                                    </span>
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="px-4 w-full text-sm mx-auto py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-green-700 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >

                                
                                <span>Apply With Gateway Abroad</span>
                            </button>

                            {/* Corner decoration */}
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#C9A84C]/30 to-transparent rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    ))}
                </div>

                {/* Bottom CTA - Enhanced */}
                <div className="text-center">
                    <a
                        href="#apply"
                        className="inline-flex items-center text-xs gap-3 bg-[#C8102E] hover:bg-[#a80d26] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg shadow-[#C8102E]/30 hover:shadow-[#C8102E]/50 hover:-translate-y-1 group"
                    >
                        Get Matched to the Right UK University
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}


export function UKStudyCosts() {
    const tuitionData = [
        { program: "Undergraduate (UG)", gbp: "£10,000 – £26,000", inr: "₹10.5 – 27 Lakhs" },
        { program: "Masters / MS (PG)", gbp: "£12,000 – £35,000", inr: "₹12.5 – 37 Lakhs" },
        { program: "MBA (Top Russell Group)", gbp: "£30,000 – £68,000", inr: "₹31 – 71 Lakhs" },
        { program: "PhD / Research", gbp: "£16,000 – £26,000", inr: "₹17 – 27 Lakhs" },
        { program: "Foundation Program", gbp: "£10,000 – £18,000", inr: "₹10.5 – 19 Lakhs" }
    ];

    const livingCosts = [
        { category: "Accommodation", london: "£8,000–12,000", other: "£4,500–7,500" },
        { category: "Food & Groceries", london: "£2,400–3,600", other: "£1,800–2,400" },
        { category: "Transport", london: "£1,200–1,800", other: "£600–1,000" },
        { category: "Books & Supplies", london: "£500–800", other: "£400–700" },
        { category: "Total Living Cost", london: "£12,000–15,000", other: "£8,000–11,500", isTotal: true }
    ];

    const loanOptions = [
        "SBI Global Ed-Vantage Loan — up to ₹1.5 Crore",
        "HDFC Credila — up to ₹75 Lakhs, no collateral",
        "Axis Bank — quick processing, no margin money",
        "IDFC First Bank — 100% funding available",
        "Prodigy Finance — for top Russell Group unis"
    ];

    const partTimeWork = [
        { label: "Work Hours", value: "20 hrs/week during term time" },
        { label: "Vacation Work", value: "Full-time during official vacations" },
        { label: "Minimum Wage", value: "£12.21/hour (2025)" },
        { label: "Monthly Earnings", value: "£800–1,200/month part-time" },
        { label: "Covers", value: "Food + transport costs easily" }
    ];

    const scholarships = [
        { name: "Chevening", benefit: "Full tuition + living costs", tag: "Fully Funded" },
        { name: "GREAT Scholarship", benefit: "£10,000 towards tuition", tag: "India" },
        { name: "University Merit", benefit: "10–30% of fees", tag: "All Unis" },
        { name: "Commonwealth", benefit: "Full funding for select courses", tag: "Prestigious" }
    ];

    return (
        <section className="bg-white pt-14 px-5">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-2xl lg:text-4xl xl:text-[2.4rem] max-w-3xl font-bold text-gray-800 !leading-[1.3] mb-4">
                        {highlightText("Cost of Studying in || UK || for || Indian Students || 2026–27")}
                    </h2>

                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl">
                        Understanding tuition fees and living costs before you decide is critical. Here's a complete cost breakdown for Indian students planning to study in UK — by program, city, and level.
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

                    {/* Left Column: Tables */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Tuition Fees Table */}
                        <div className="bg-gradient-to-br from-pink-50 to-amber-50 border border-gray-200 rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 bg-red-600 text-white">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <DynamicIcon name="GraduationCap" size={20} color="#fff" />
                                    Annual Tuition Fees by Program
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Program</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Annual Tuition (GBP)</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">In INR (Approx.)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {tuitionData.map((item, index) => (
                                            <tr key={index} className="hover:bg-red-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.program}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-red-600">{item.gbp}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{item.inr}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Living Costs Table */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 bg-[#012169] text-white">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <DynamicIcon name="Home" size={20} color="#fff" />
                                    Annual Living Costs
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">London / yr</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Other Cities / yr</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {livingCosts.map((item, index) => (
                                            <tr key={index} className={`hover:bg-blue-50/50 transition-colors ${item.isTotal ? 'bg-amber-50/50 font-bold' : ''}`}>
                                                <td className={`px-6 py-4 text-sm ${item.isTotal ? 'text-gray-900' : 'text-gray-600'}`}>
                                                    {item.category}
                                                </td>
                                                <td className={`px-6 py-4 text-sm ${item.isTotal ? 'text-amber-700' : 'text-gray-700'}`}>
                                                    {item.london}
                                                </td>
                                                <td className={`px-6 py-4 text-sm ${item.isTotal ? 'text-green-700' : 'text-gray-700'}`}>
                                                    {item.other}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Cost Insight Card */}
                        {/* <div className="bg-gradient-to-r from-red-50 to-amber-50 border-l-4 border-red-500 rounded-xl p-5">
              <div className="flex gap-3">
                <DynamicIcon name="Lightbulb" size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-red-700">Why UK is affordable despite higher fees:</strong> A 1-year UK master's typically costs <strong className="text-gray-900">£20,000–35,000 total</strong> vs a 2-year Australian master's costing AUD 80,000–100,000. Factor in the saved year of living costs — UK often works out cheaper for Indian students pursuing PG education.
                  </p>
                </div>
              </div>
            </div> */}
                    </div>

                    {/* Right Column: Sidebar Cards */}
                    <div className="space-y-5">

                        {/* Education Loans Card */}
                        <div className="group bg-white border-2 border-red-100 hover:border-red-300 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <DynamicIcon name="Landmark" size={20} className="text-red-600" />
                                </div>
                                <h4 className="font-bold text-gray-800">🏦 Education Loans</h4>
                            </div>
                            <ul className="space-y-3">
                                {loanOptions.map((loan, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-red-500 font-bold mt-0.5">•</span>
                                        {loan}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Part-Time Work Card */}
                        {/* <div className="group bg-white border-2 border-amber-100 hover:border-amber-300 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <DynamicIcon name="Wallet" size={20} className="text-amber-600" />
                </div>
                <h4 className="font-bold text-gray-800">💰 Part-Time Work</h4>
              </div>
              <ul className="space-y-3">
                {partTimeWork.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-amber-500 font-bold mt-0.5">✓</span>
                    <span className="text-gray-600">
                      <strong className="text-gray-800">{item.label}:</strong> {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div> */}

                        {/* Scholarships Card */}
                        <div className="group bg-white border-2 border-green-100 hover:border-green-300 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <DynamicIcon name="Award" size={20} className="text-green-600" />
                                </div>
                                <h4 className="font-bold text-gray-800">🎓 Scholarships</h4>
                            </div>
                            <ul className="space-y-3">
                                {scholarships.map((sch, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500 font-bold mt-0.5">★</span>
                                        <div>
                                            <span className="font-medium text-gray-800">{sch.name}</span>
                                            <span className="ml-2 inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                {sch.tag}
                                            </span>
                                            <p className="text-gray-600 text-xs mt-0.5">{sch.benefit}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quick CTA Card */}
                        <div className="bg-gradient-to-br from-red-600 to-pink-500 rounded-2xl p-5 text-white">
                            <h4 className="font-bold text-lg mb-2">📊 Free Cost Analysis</h4>
                            <p className="text-sm text-white/80 mb-4">
                                Not sure if UK fits your budget? Get a personalised cost-benefit report.
                            </p>
                            <a
                                href="#apply"
                                className="inline-flex items-center gap-2 bg-white text-red-700 font-bold px-4 py-2.5 rounded-full text-sm hover:bg-amber-400 transition-colors"
                            >
                             Get Free Estimate
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}


export function GatewayAbroadProcess() {
    const [activeStep, setActiveStep] = useState(null);

    const processSteps = [
        {
            step: 1,
            tag: "Free · Week 1",
            title: "Free Profile Evaluation & UK University Matching",
            description: "We assess your academic background, IELTS score (or MOI eligibility), budget, preferred course, and career goals. You receive a personalised UK university shortlist — within 48 hours, completely free.",
            icon: "📋",
            color: "bg-red-500"
        },
        {
            step: 2,
            tag: "If needed · Month 1–3",
            title: "IELTS / PTE / Duolingo Coaching",
            description: "Our certified IELTS coaches help you achieve your target band score with a personalised study plan, weekly mock tests, and focused speaking and writing practice sessions.",
            icon: "📚",
            color: "bg-orange-500"
        },
        {
            step: 3,
            tag: "Month 2–4",
            title: "SOP, LOR & Application Document Preparation",
            description: "Our UK-experienced writers craft a compelling Statement of Purpose, guide your referees on LOR content, and prepare your complete application package tailored to each university's requirements.",
            icon: "📝",
            color: "bg-amber-500"
        },
        {
            step: 4,
            tag: "Month 3–5",
            title: "UCAS / University Portal Application Filing",
            description: "We handle your complete UCAS submission (for UG) or direct university portal applications (for PG), track all deadlines, and communicate with admissions offices on your behalf until the offer is received.",
            icon: "🖥️",
            color: "bg-yellow-500"
        },
        {
            step: 5,
            tag: "After Offer Letter",
            title: "Scholarship Applications & Education Loan",
            description: "We identify every scholarship you're eligible for and complete those applications. We also assist with education loan documentation for SBI, HDFC Credila, Axis, and other lenders — ensuring you get the best rate.",
            icon: "💰",
            color: "bg-green-500"
        },
        {
            step: 6,
            tag: "2–3 Months Before Travel",
            title: "UK Student Visa Application (Tier 4 / Student Route)",
            description: "We prepare your complete visa package — CAS, bank statements, IHS payment, DS-160 equivalent documents — and conduct mock visa interview preparation. Our UK visa success rate is 96%.",
            icon: "🛂",
            color: "bg-blue-500"
        },
        {
            step: 7,
            tag: "Pre-Departure",
            title: "Pre-Departure Orientation & Post-Arrival Support",
            description: "Accommodation guidance, forex cards, NHS registration, UK bank account tips, transport orientation, and connections to Indian student communities at your university — we're with you even after you land.",
            icon: "✈️",
            color: "bg-purple-500"
        }
    ];

    return (
        <section className="py-14 bg-pink-100 px-5" id="process">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Column: Process Timeline */}
                    <div className="w-full lg:w-[67%]">

                        {/* Header */}
                        <div className="mb-8">

                            <h2 className="text-2xl lg:text-4xl xl:text-[2.4rem] max-w-3xl font-bold text-gray-800 !leading-[1.3] mb-4">
                                {highlightText("How Gateway Abroad Helps || You Study in UK || — End to End")}
                            </h2>

                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl">
                                From your first free consultation to your flight to the UK — we manage every step with precision and care.
                            </p>
                        </div>

                        {/* SEO Text Block */}
                        <div className="bg-pink-50 border-l-4 border-red-500 rounded-r-xl p-6 mb-10">
                            <p className="text-base text-gray-700 leading-relaxed">
                                <strong className="text-gray-900">Gateway Abroad Education</strong> is one of India's most experienced <strong className="text-gray-900">study in UK consultants</strong>, having guided students from across India into <strong className="text-gray-900">Russell Group universities</strong>, top London institutions, and regional UK universities since 2008.
                                We provide complete <strong className="text-gray-900">UK study abroad services</strong> including <strong className="text-gray-900">IELTS and PTE coaching</strong>, <strong className="text-gray-900">SOP and LOR writing</strong>
                                Whether you want to <strong className="text-gray-900">study in UK after 12th</strong>, pursue an <strong className="text-gray-900">MS or MBA in UK</strong>, or do a <strong className="text-gray-900">PhD at a Russell Group university</strong> — Gateway Abroad is your end-to-end UK education partner.
                                We also specialise in helping students <strong className="text-gray-900">study in UK without IELTS</strong> through MOI certificate pathways at qualifying universities.
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-[#012169] to-red-500 hidden lg:block" />

                            <div className="space-y-2">
                                {processSteps.map((item, index) => (
                                    <ProcessStep
                                        key={item.step}
                                        item={item}
                                        index={index}
                                        activeStep={activeStep}
                                        setActiveStep={setActiveStep}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="w-full lg:w-[33%]">
                        <div className="sticky top-24 space-y-4">


                            <ContactForm />


                            {/* Contact Info Card */}
                            <div className="bg-pink-50 border border-red-600 rounded-xl p-5 text-center">
                                <p className="text-gray-600 text-xs uppercase font-bold mb-2">
                                    Call / WhatsApp
                                </p>
                                <a
                                    href="tel:+918302092630"
                                    className="text-2xl font-black text-[#C9A84C] block hover:text-[#EDD68A] transition-colors"
                                >
                                    +91 8302092630
                                </a>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-gradient-to-br from-red-50 to-amber-50 border border-red-100 rounded-xl p-5">
                                <h4 className="font-bold text-gray-800 mb-3 text-sm">Why Choose Gateway Abroad?</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                        16+ Years Experience
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                        500+ Students Placed in UK
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                        96% Visa Success Rate
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                        Russell Group Specialists
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

// Individual Process Step Component
function ProcessStep({ item, index, activeStep, setActiveStep }) {
    const isActive = activeStep === index;

    return (
        <div
            className={`relative flex gap-4 lg:gap-6 group cursor-pointer transition-all duration-300 ${isActive ? "scale-[1.01]" : ""
                }`}
            onMouseEnter={() => setActiveStep(index)}
            onMouseLeave={() => setActiveStep(null)}
        >
            {/* Step Number Dot */}
            <div className="relative z-10 flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm border-4 border-white shadow-lg transition-all duration-300 ${isActive ? item.color + " text-white scale-110" : "bg-white text-gray-400 border-gray-200 group-hover:border-red-300"
                    }`}>
                    {item.icon}
                </div>
            </div>

            {/* Content Card */}
            <div className={`flex-1 relative bg-white shadow-md border rounded-xl p-5 pt-6 overflow-hidden transition-all duration-300 ${isActive
                ? "border-red-300 shadow-lg shadow-red-100/50"
                : "border-gray-200 hover:border-red-200 hover:shadow-md"
                }`}>

                {/* Tag */}
                <span className={` absolute top-0 right-0 px-2 py-1 bg-red-600 inline-block text-xs sm:text-[9px] font-bold uppercase text-white rounded-bl-xl ${isActive ? "text-red-600" : "text-gray-500"
                    }`}>
                    {item.tag}
                </span>

                {/* Title */}
                <h4 className={`font-bold text-base lg:text-lg mb-2 transition-colors duration-300 ${isActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                    }`}>
                    {item.title}
                </h4>

                {/* Description */}
                <p className={`text-sm font-medium leading-relaxed transition-colors duration-300 ${isActive ? "text-gray-700" : "text-gray-500"
                    }`}>
                    {item.description}
                </p>
            </div>

            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
        </div>
    );
}

import ContactForm from "../pages/UkForm";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function ScrollStackIntakes() {
    const containerRef = useRef(null);

    const intakes = [
        {
            id: 1,
            title: "September 2025 Intake",
            badge: "🔥 Most Popular",
            badgeColor: "bg-red-600",
            applicationWindow: "Oct 2024 – June 2025",
            status: "Now Open",
            features: [
                "All programs available including competitive courses",
                "Maximum scholarship options open",
                "Largest Indian student cohort joins together",
                "Best university choices available",
                "UCAS deadline: Jan 2025"
            ],
            cta: "Apply for September 2025",
            color: "from-red-500 to-red-700",
            urgency: "⚠️ Apply NOW — offers are already being made"
        },
        {
            id: 2,
            title: "January 2026 Intake",
            badge: "✅ Less Competition",
            badgeColor: "bg-green-600",
            applicationWindow: "July 2025 – October 2025",
            status: "Coming Soon",
            features: [
                "Ideal if you missed September 2025 deadline",
                "Less competition — faster offer turnaround",
                "Many universities offer MOI waiver",
                "Strong for MBA, MS in Business & Data Science",
                "Perfect for students finishing exams in Nov 2025"
            ],
            cta: "Apply for January 2026",
            color: "from-green-500 to-green-700",
            urgency: "Perfect backup option with less competition"
        }

    ];

    return (
        <section className="py-20 px-5 bg-[#F8F6F2]">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 font-bold text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 border border-red-100">
                        📅 UK University Intakes 2025–26
                    </span>
                    <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 !leading-[1.3] mb-4">
                        Choose Your Perfect <span className="text-red-600">UK Intake</span>
                    </h2>
                    <p className="text-gray-600 text-base max-w-2xl mx-auto">
                        Scroll down to explore different intake options. Cards will stack automatically as you navigate.
                    </p>
                </div>

                {/* Scroll Stack Container */}
                <div ref={containerRef} className="relative h-[300vh]">
                    <div className="sticky top-20 h-screen flex items-center justify-center">
                        {intakes.map((intake, index) => (
                            <ScrollCard
                                key={intake.id}
                                intake={intake}
                                index={index}
                                totalCards={intakes.length}
                                containerRef={containerRef}
                            />
                        ))}
                    </div>
                </div>

                {/* Scroll Progress Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                    {intakes.map((_, index) => (
                        <ScrollProgressDot key={index} index={index} totalCards={intakes.length} containerRef={containerRef} />
                    ))}
                </div>

            </div>
        </section>
    );
}

// Individual Scroll Card Component
function ScrollCard({ intake, index, totalCards, containerRef }) {
    const cardRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth the scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Calculate when this card should be active
    // Each card gets an equal portion of the scroll
    const cardStart = index / totalCards;
    const cardEnd = (index + 1) / totalCards;
    const cardRange = cardEnd - cardStart;

    // Transform values based on scroll progress
    const opacity = useTransform(
        smoothProgress,
        [cardStart - 0.1, cardStart, cardStart + cardRange * 0.3, cardEnd],
        [1, 1, 1, 1]
    );

    const scale = useTransform(
        smoothProgress,
        [cardStart - 0.1, cardStart, cardStart + cardRange * 0.3, cardEnd],
        [1, 1, 1, 1]
    );

    const y = useTransform(
        smoothProgress,
        [cardStart - 0.1, cardStart, cardStart + cardRange * 0.3, cardEnd],
        [100, 0, 0, -20]
    );

    const zIndex = useTransform(
        smoothProgress,
        [cardStart, cardStart + cardRange * 0.3],
        [index, index + totalCards]
    );

    const rotateX = useTransform(
        smoothProgress,
        [cardStart + cardRange * 0.3, cardEnd],
        [0, 5]
    );

    return (
        <motion.div
            ref={cardRef}
            className="absolute w-full max-w-md"
            style={{
                opacity,
                scale,
                y,
                zIndex,
                rotateX
            }}
        >
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100">

                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${intake.color} p-6 pb-8`}>
                    <div className="flex items-center justify-between mb-3">
                        <span className={`${intake.badgeColor} text-white font-bold text-xs px-4 py-1.5 rounded-full tracking-wide shadow-lg flex items-center gap-2`}>
                            <span className="animate-pulse">●</span>
                            {intake.badge}
                        </span>
                        <span className="text-white/80 text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
                            {intake.status}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white font-serif">
                        {intake.title}
                    </h3>
                </div>

                {/* Card Body */}
                <div className="p-6 -mt-4">
                    {/* Application Timeline */}
                    <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                            <p className="text-xs text-gray-500">Application Window</p>
                            <p className="font-semibold text-gray-800 text-sm">{intake.applicationWindow}</p>
                        </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2.5 mb-6">
                        {intake.features.map((feature, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-2.5 text-sm text-gray-700"
                            >
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0 mt-1.5" />
                                {feature}
                            </motion.li>
                        ))}
                    </ul>

                    {/* Urgency Note */}
                    <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-800 font-medium">{intake.urgency}</p>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        {intake.cta}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </motion.button>
                </div>

                {/* Card Number */}
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/20 to-transparent rounded-br-full" />
            </div>
        </motion.div>
    );
}

// Progress Dot Component
function ScrollProgressDot({ index, totalCards, containerRef }) {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const cardStart = index / totalCards;
    const cardEnd = (index + 1) / totalCards;

    const isActive = useTransform(
        scrollYProgress,
        [cardStart - 0.05, cardStart, cardEnd - 0.05, cardEnd],
        [0, 1, 1, 0]
    );

    return (
        <motion.div
            className="h-2 rounded-full bg-gray-300"
            style={{
                width: isActive,
                minWidth: 16,
                maxWidth: 40,
                backgroundColor: isActive,
            }}
        />
    );
}


export function UKScholarships() {
    const scholarships = [
        {
            icon: "🇬🇧",
            name: "Chevening Scholarship",
            tag: "Fully Funded",
            tagColor: "bg-red-600",
            description: "The UK Government's flagship international scholarship — covers full tuition, living allowance, airfare, and visa costs. For Indian students with 2+ years of work experience applying for a 1-year master's.",
            amount: "100% Fully Funded",
            amountColor: "text-red-600",
            bgColor: "from-red-50 to-amber-50"
        },
        {
            icon: "🏆",
            name: "GREAT Scholarship",
            tag: "India",
            tagColor: "bg-amber-600",
            description: "A collaboration between the British Council and UK universities. Offers £10,000 towards tuition for Indian students applying to participating UK universities for PG programs.",
            amount: "£10,000 Award",
            amountColor: "text-amber-600",
            bgColor: "from-amber-50 to-yellow-50"
        },
        {
            icon: "🌍",
            name: "Commonwealth Scholarship",
            tag: "Prestigious",
            tagColor: "bg-blue-600",
            description: "For students from Commonwealth countries including India. Covers tuition, airfare, stipend and living costs for a master's or PhD at a UK university. Competitive and prestigious.",
            amount: "Full Funding",
            amountColor: "text-blue-600",
            bgColor: "from-blue-50 to-indigo-50"
        },
        {
            icon: "🏫",
            name: "University Merit Scholarships",
            tag: "All Unis",
            tagColor: "bg-green-600",
            description: "Almost every UK university offers merit-based fee waivers of 10–50% for high-achieving international students. Manchester, Birmingham, Edinburgh, and Bristol are particularly generous.",
            amount: "10–50% Fee Waiver",
            amountColor: "text-green-600",
            bgColor: "from-green-50 to-emerald-50"
        },
        {
            icon: "🎓",
            name: "Charles Wallace India Trust",
            tag: "Arts & Culture",
            tagColor: "bg-purple-600",
            description: "For Indian citizens at early-career stage applying for short-term courses and fellowships at UK institutions in arts, culture, and heritage. Competitive annual selection.",
            amount: "Partial Funding",
            amountColor: "text-purple-600",
            bgColor: "from-purple-50 to-pink-50"
        },
        {
            icon: "🇮🇳",
            name: "Inlaks Shivdasani Foundation",
            tag: "Top Unis",
            tagColor: "bg-red-600",
            description: "For outstanding young Indians under 30 pursuing master's degrees at top global universities including Russell Group. Covers tuition + living allowance. Very competitive.",
            amount: "Up to £100,000",
            amountColor: "text-red-600",
            bgColor: "from-red-50 to-orange-50"
        }
    ];

    return (
        <section className="bg-white py-10 px-5">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className=" mb-12">
                    <h2 className="text-2xl lg:text-5xl xl:text-[2.4rem] max-w-2xl font-bold text-gray-800 !leading-[1.3] mb-4">
                        {highlightText("UK Scholarships for || Indian Students || 2026–27")}
                    </h2>

                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl">
                        UK offers more scholarship opportunities for Indian students than almost any other country. Here are the most sought-after awards — from fully funded government scholarships to university merit grants.
                    </p>
                </div>

                {/* Scholarships Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {scholarships.map((sch, index) => (
                        <ScholarshipCard key={index} scholarship={sch} index={index} />
                    ))}
                </div>

            </div>
        </section>
    );
}

// Individual Scholarship Card Component
function ScholarshipCard({ scholarship, index }) {
    return (
        <div
            className={`group relative bg-gradient-to-br ${scholarship.bgColor} border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-200/50 hover:border-gray-300 overflow-hidden`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Animated Background Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top Badge */}
            {scholarship.tag && <div className="absolute bg-red-600 text-white text-sm rounded-bl-2xl font-bold px-3 py-2 top-0 right-0 z-10 flex items-start justify-between mb-4">
                {scholarship.tag}
            </div>}

            {/* Scholarship Name */}
            <h3 className="relative z-10 text-lg font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
                {scholarship.name}
            </h3>

            {/* Description */}
            <p className="relative z-10 text-sm font-medium text-gray-600 leading-relaxed mb-5 line-clamp-4">
                {scholarship.description}
            </p>

            {/* Amount Badge */}
            <div className="relative z-10 flex items-center justify-between">
                <span className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm ${scholarship.amountColor} font-bold text-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm`}>
                    <DynamicIcon name="Coins" size={16} />
                    {scholarship.amount}
                </span>

                {/* Arrow Icon */}
                <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/30 to-transparent rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Left Accent Border */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-amber-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-l-2xl" />
        </div>
    );
}



export function UKUniversityIntakes() {
    const intakes = [
        {
            id: "september-2025",
            title: "September 2025",
            badge: "🔥 Most Popular",
            badgeColor: "bg-red-600",
            applicationWindow: "Oct 2024 – June 2025",
            status: "Now Ongoing",
            statusColor: "text-red-600",
            isPrimary: true,
            features: [
                "All programs available including competitive courses",
                "Maximum scholarship options open",
                "Largest Indian student cohort joins together",
                "Best university choices available at this intake",
                "UCAS deadline: Jan 2025 (Oxford/Cambridge: Oct 2024)",
                "⚠️ Apply NOW — offers are already being made"
            ],
            cta: "Apply for September 2025",
            ctaBg: "bg-red-600 hover:bg-red-700",
            universities: ["Oxford", "Cambridge", "Imperial", "UCL", "Edinburgh"]
        },
        {
            id: "january-2026",
            title: "January 2026",
            badge: "✅ Applications Open",
            badgeColor: "bg-green-600",
            applicationWindow: "July 2025 – October 2025",
            status: "Coming Soon",
            statusColor: "text-green-600",
            isPrimary: false,
            features: [
                "Ideal if you missed September 2025 deadline",
                "Less competition — faster offer turnaround",
                "Many universities offer MOI waiver at this intake",
                "Strong for MBA, MS in Business & Data Science",
                "Perfect for students finishing exams in Nov 2025",
                "Universities: Hertfordshire, UCLan, Sunderland, Portsmouth"
            ],
            cta: "Apply for January 2026",
            ctaBg: "bg-[#012169] hover:bg-[#01317a]",
            universities: ["Hertfordshire", "UCLan", "Sunderland", "Portsmouth"]
        },
        {
            id: "september-2026",
            title: "September 2026",
            badge: "📅 Early Planning",
            badgeColor: "bg-blue-600",
            applicationWindow: "Oct 2025 – June 2026",
            status: "Future Intake",
            statusColor: "text-blue-600",
            isPrimary: false,
            features: [
                "Best university selection available",
                "Early scholarship applications",
                "Ample preparation time",
                "Plan your IELTS/PTE accordingly",
                "Secure your spot early",
                "All Russell Group universities open"
            ],
            cta: "Plan for September 2026",
            ctaBg: "bg-blue-600 hover:bg-blue-700",
            universities: ["All UK Unis", "Russell Group", "London Unis"]
        }
    ];

    // Determine grid layout based on number of cards
    const getGridClass = (count) => {
        if (count === 1) return "grid-cols-1 max-w-2xl mx-auto";
        if (count === 2) return "grid-cols-1 lg:grid-cols-2";
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    };

    return (
        <section className="bg-[#F8F6F2] py-12 px-5">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className=" mb-12">
                    <h2 className="text-2xl lg:text-4xl xl:text-[2.4rem] max-w-3xl font-bold text-gray-800 !leading-[1.3] mb-4">
                        {highlightText("UK University Intakes — || September 2026 || & || January 2027")}
                    </h2>

                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-4xl">
                        UK universities offer two main intakes per year. Choosing the right intake can significantly impact your scholarship chances, visa timeline, and admission competitiveness.
                    </p>
                </div>

                {/* Intake Cards Grid - Dynamic based on count */}
                <div className={`grid gap-6 lg:gap-8 mb-12 ${getGridClass(intakes.length)}`}>
                    {intakes.map((intake, index) => (
                        <IntakeCard
                            key={intake.id}
                            intake={intake}
                            index={index}
                            totalCards={intakes.length}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <a
                        href="#apply"
                        className="inline-flex items-center text-sm gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg shadow-red-200 hover:shadow-red-300 hover:-translate-y-1 group"
                    >
                        Get Free Intake Counselling
                        <svg
                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>

            </div>
        </section>
    );
}

// Individual Intake Card Component
function IntakeCard({ intake, index, totalCards }) {
    return (
        <div
            className={`group relative bg-white border-2 rounded-2xl p-6 lg:p-8 transition-all duration-500 overflow-hidden hover:-translate-y-2
        ${intake.isPrimary
                    ? "border-red-200 hover:border-red-400 hover:shadow-2xl hover:shadow-red-100/50"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-xl"
                }
      `}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${intake.isPrimary ? "from-red-50/80 to-amber-50/50" : "from-gray-50/80 to-white/50"
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Top Section: Badge + Status */}
            <div className="absolute top-0 right-0 bg-red-600 rounded-bl-2xl text-white text-sm font-bold py-2 px-4 z-10 flex items-start justify-between mb-5">
                {intake.badge}
            </div>

            {/* Intake Title */}
            <h3 className="relative z-10 text-2xl lg:text-3xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300">
                {intake.title}
            </h3>

            {/* Features List */}
            <ul className="relative z-10 space-y-0 mt-3 mb-3">
                {intake.features.map((feature, i) => (
                    <li
                        key={i}
                        className={`flex items-start gap-3 text-sm group/li ${feature.includes("⚠️") || feature.includes("NOW")
                            ? "bg-red-50 -mx-3 px-3 py-2 rounded-lg border-l-2 border-red-500"
                            : ""
                            }`}
                    >
                        <span className={`text-lg flex-shrink-0 mt-0.5 transform group-hover/li:scale-110 transition-transform text-gray-400
                            `}>
                            {feature.includes("✓") || feature.includes("✅") ? "✓" :
                                feature.includes("⚠️") ? "⚠️" : "•"}
                        </span>
                        <span className={`${feature.includes("⚠️") || feature.includes("NOW")
                            ? "font-semibold text-red-700"
                            : "text-gray-600"
                            }`}>
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Featured Universities Pills */}
            <div className="relative z-10 mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <DynamicIcon name="Building" size={12} />
                    Featured Universities
                </p>
                <div className="flex flex-wrap gap-2">
                    {intake.universities.map((uni, i) => (
                        <span
                            key={i}
                            className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 hover:bg-red-100 hover:text-red-700 hover:border-red-200 transition-all duration-300 cursor-default"
                        >
                            {uni}
                        </span>
                    ))}
                </div>
            </div>
            {/* CTA Button */}
            <a
                href="#apply"
                className={`relative z-10 block w-full text-center text-sm bg-red-600 text-white font-bold py-2.5 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group/btn`}
            >
                <span className="flex items-center justify-center gap-2">
                    {"Apply Now"}
                    <svg
                        className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </span>
            </a>

            {/* Card Number Badge */}
            <div className={`absolute -top-0 -left-0 p-2 px-4 rounded-br-2xl flex items-center justify-center font-bold text-sm shadow-lg ${intake.isPrimary ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                {index + 1}
            </div>

            {/* Decorative Corner */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${intake.isPrimary ? "from-red-200/30" : "from-gray-200/30"
                } to-transparent rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        </div>
    );
}