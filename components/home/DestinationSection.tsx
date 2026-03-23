"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Destination {
    id: string;
    flag: string;
    name: string;
    description: string;
    link: string;
    badge?: string;
    badgeColor?: string;
    bgClass: string;
}

const destinations: Destination[] = [
  {
    id: "uk",
    flag: "🇬🇧",
    name: "United Kingdom",
    description: "Russell Group · 1-Year Master's · 2-Year Graduate Route Visa · 95,000+ Indian students in 2025",
    link: "/study-in-uk",
    badge: "Most Popular",
    badgeColor: "bg-rose-600",
    image: "https://images.unsplash.com/photo-1562774053-701939374585",
  },
  {
    id: "canada",
    flag: "🇨🇦",
    name: "Canada",
    description: "PR Pathway · 3-Year PGWP · Top Universities",
    link: "#",
    image: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6",
  },
  {
    id: "australia",
    flag: "🇦🇺",
    name: "Australia",
    description: "Group of Eight · 4-Year Work Visa · Indian Community",
    link: "#",
    image: "https://images.unsplash.com/photo-1603437119287-4a3732b685f9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "usa",
    flag: "🇺🇸",
    name: "USA",
    description: "Ivy League · State Universities · 3-Year STEM OPT",
    link: "#",
    image: "https://images.unsplash.com/photo-1622397333309-3056849bc70b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "germany",
    flag: "🇩🇪",
    name: "Germany",
    description: "FREE Public Tuition · TU Munich · DAAD Scholarship",
    link: "#",
    badge: "Free Tuition!",
    badgeColor: "bg-emerald-700",
    image: "https://images.unsplash.com/photo-1662555500038-3d9ed651fc06?q=80&w=1198&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  
  {
    id: "ireland",
    flag: "🇮🇪",
    name: "Ireland",
    description: "EU Gateway · Tech Hub Dublin · 2-Year Stay-Back",
    link: "#",
    image: "https://images.unsplash.com/photo-1624951517902-e05b4105e123?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function DestinationsSection() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // First row: UK (index 0), Canada (1), Australia (2), USA (3)
    const firstRow = destinations.slice(0, 4);
    // Second row: Germany (4), Ireland (5) + we need two more filler cards to make 4 cards
    // but we want the last card (Ireland) to be 40% when not hovered? Actually requirement:
    // "in 2 row the last one have 40" – means in second row, the last card (Ireland) should be 40% by default.
    // To keep the grid balanced, we'll add two placeholder cards in second row.
    const secondRow = [
  destinations[4], // Germany

  {
    id: "placeholder1",
    flag: "🇳🇿",
    name: "New Zealand",
    description: "Stunning landscapes · Growing Indian community",
    link: "#",
    image: "https://plus.unsplash.com/premium_photo-1742418009234-e6ba86c08ec1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // NZ university style
    placeholder: true,
  },

  {
    id: "placeholder2",
    flag: "🇸🇬",
    name: "Singapore",
    description: "Asian hub · Top business schools",
    link: "#",
    image: "https://plus.unsplash.com/premium_photo-1697729404559-25e36fc1fa8e?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Singapore university campus
    placeholder: true,
  },

  destinations[5], // Ireland (last → 40%)
] as (Destination & { placeholder?: boolean })[];

    const getCardWidth = (id, isLastInSecondRow = false) => {
        // 👉 FIRST ROW IDs
        const firstRowIds = ["uk", "canada", "australia", "usa"];

        // 👉 SECOND ROW IDs
        const secondRowIds = ["germany", "placeholder1", "placeholder2", "ireland"];

        // =========================
        // ✅ FIRST ROW LOGIC
        // =========================
        if (firstRowIds.includes(id)) {
            // No hover → UK big
            if (!hoveredId) {
                return id === "uk" ? "w-[40%]" : "w-[20%]";
            }

            // Hover inside first row
            if (firstRowIds.includes(hoveredId)) {
                return id === hoveredId ? "w-[40%]" : "w-[20%]";
            }

            // Hover on second row → reset to default
            return id === "uk" ? "w-[40%]" : "w-[20%]";
        }

        // =========================
        // ✅ SECOND ROW LOGIC
        // =========================
        if (secondRowIds.includes(id)) {
            // Default → Ireland big
            if (!hoveredId) {
                return id === "ireland" ? "w-[40%]" : "w-[20%]";
            }

            // Hover inside second row
            if (secondRowIds.includes(hoveredId)) {
                return id === hoveredId ? "w-[40%]" : "w-[20%]";
            }

            // Hover on first row → reset
            return id === "ireland" ? "w-[40%]" : "w-[20%]";
        }

        return "w-[20%]";
    };

    return (
        <section className=" py-16 px-4 md:px-8" id="destinations" style={{
          background: "linear-gradient(180deg, rgba(188, 140, 252, 0.2), rgba(215, 22, 53, 0.2))"
        }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-emerald-900/10 text-[#D81635] font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-full border border-emerald-900/20 mb-4"
                >
                    🌍 Study Abroad Destinations
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="font-serif text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-3"
                >
                    India's Most Trusted<br />
                    <em className="text-[#D81635] not-italic">Study Abroad Consultants</em> — Choose Your Country
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="text-gray-600 max-w-2xl text-lg mb-12"
                >
                    From the Russell Group universities of the UK to Germany's tuition-free institutions — we help Indian students reach 450+ universities across 18 countries.
                </motion.p>

                {/* First Row */}
                <div className="flex  gap-2 mb-4">
                    {firstRow.map((dest) => (
                        <motion.a
                            key={dest.id}
                            href={dest.link}
                            className={`relative h-64 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out ${getCardWidth(dest.id)
                                } bg-gradient-to-br ${dest.bgClass}`}
                            onHoverStart={() => setHoveredId(dest.id)}
                            onHoverEnd={() => setHoveredId(null)}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            layout
                        >
                            {/* ✅ IMAGE */}
                            <img
                                src={dest.image}
                                alt={dest.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* ✅ OVERLAY */}
                            <div className="absolute top-48 inset-0 h-[30%] bg-black/40 z-10" />


                            {/* Badge */}
                            {dest.badge && (
                                <span className={`absolute top-4 right-4 z-20 ${dest.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg`}>
                                    {dest.badge}
                                </span>
                            )}

                            {/* Content */}
                            <div className="absolute -bottom-12 left-0 right-0 z-20 p-5 text-white">
                               
                                <h3 className="font-serif text-2xl font-bold leading-tight">{dest.name}</h3>
                            

                                {/* CTA that appears on hover */}
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    whileHover={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="inline-flex items-center gap-1 mt-3 bg-amber-400 text-gray-900 text-xs font-bold px-4 py-2 rounded-full"
                                >
                                    Explore {dest.name.split(' ')[0]} →
                                </motion.span>
                            </div>
                        </motion.a>

                    ))}
                </div>

                {/* Second Row */}
                <div className="flex  gap-4">
                    {secondRow.map((dest, index) => {
                        const isLast = index === secondRow.length - 1; // Ireland is last
                        return (
                            <motion.a
                                key={dest.id}
                                href={dest.link}
                                className={`relative h-64 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out ${isLast ? getCardWidth(dest.id, true) : getCardWidth(dest.id)
                                    } bg-gradient-to-br ${dest.bgClass}`}
                                onHoverStart={() => setHoveredId(dest.id)}
                                onHoverEnd={() => setHoveredId(null)}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                                layout
                            >
                              {/* ✅ IMAGE */}
                            <img
                                src={dest.image}
                                alt={dest.name}
                                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* ✅ OVERLAY */}
                            <div className="absolute top-48 inset-0 h-[30%] bg-black/40 z-10" />


                                {dest.badge && (
                                    <span className={`absolute top-4 right-4 z-20 ${dest.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg`}>
                                        {dest.badge}
                                    </span>
                                )}

                                <div className="absolute -bottom-12 left-0 right-0 z-20 p-5 text-white">
                               
                                    <h3 className="font-serif text-2xl font-bold leading-tight">{dest.name}</h3>
                                 

                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        whileHover={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="inline-flex items-center gap-1 mt-3 bg-amber-400 text-gray-900 text-xs font-bold px-4 py-2 rounded-full"
                                    >
                                        Explore {dest.name.split(' ')[0]} →
                                    </motion.span>
                                </div>

                              
                            </motion.a>
                        );
                    })}
                </div>

                {/* CTA Band */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-12 bg-gradient-to-r from-[#FF1D45] to-red-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
                >
                    <p className="text-white font-medium text-lg flex items-center gap-3">
                        <span className="text-2xl">🤔</span> Not sure which country is best for your profile, budget, and career goals?
                    </p>
                    <div className="flex gap-3 flex-shrink-0">
                        <a
                            href="#lead-form"
                            className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-6 py-3 rounded-full transition-all transform hover:scale-105 shadow-lg"
                        >
                            🎯 Get Free Country Match
                        </a>
                        <a
                            href="tel:+91XXXXXXXXXX"
                            className="border-2 border-white/30 hover:border-amber-400 text-white font-semibold px-6 py-3 rounded-full transition-all"
                        >
                            📞 Call Our Expert
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}