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
        bgClass: "from-[#012169] to-[#8B0000]",
    },
    {
        id: "canada",
        flag: "🇨🇦",
        name: "Canada",
        description: "PR Pathway · 3-Year PGWP · Top Universities",
        link: "#",
        bgClass: "from-[#8B0000] to-[#C41E3A]",
    },
    {
        id: "australia",
        flag: "🇦🇺",
        name: "Australia",
        description: "Group of Eight · 4-Year Work Visa · Indian Community",
        link: "#",
        bgClass: "from-[#003087] to-[#00563B]",
    },
    {
        id: "usa",
        flag: "🇺🇸",
        name: "USA",
        description: "Ivy League · State Universities · 3-Year STEM OPT",
        link: "#",
        bgClass: "from-[#002868] to-[#BF0A30]",
    },
    {
        id: "germany",
        flag: "🇩🇪",
        name: "Germany",
        description: "FREE Public Tuition · TU Munich · DAAD Scholarship",
        link: "#",
        badge: "Free Tuition!",
        badgeColor: "bg-emerald-700",
        bgClass: "from-[#1a1a1a] via-[#B22222] to-[#DAA520]",
    },
    {
        id: "ireland",
        flag: "🇮🇪",
        name: "Ireland",
        description: "EU Gateway · Tech Hub Dublin · 2-Year Stay-Back",
        link: "#",
        bgClass: "from-[#169B62] to-[#E06F2C]",
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
        { id: "placeholder1", flag: "🇳🇿", name: "New Zealand", description: "Stunning landscapes · Growing Indian community", link: "#", bgClass: "from-slate-600 to-slate-800", placeholder: true },
        { id: "placeholder2", flag: "🇸🇬", name: "Singapore", description: "Asian hub · Top business schools", link: "#", bgClass: "from-rose-800 to-amber-700", placeholder: true },
        destinations[5], // Ireland (last, should be 40% default)
    ] as (Destination & { placeholder?: boolean })[];

    const getCardWidth = (id: string, isLastInSecondRow: boolean = false) => {
        // Default widths: first card (UK) 40%, others 20%
        if (id === "uk" && hoveredId !== "uk" && hoveredId !== "canada" && hoveredId !== "australia" && hoveredId !== "usa") {
            return "w-[40%]";
        }
        // If hoveredId is one of the first row 20% cards, they become 40% and UK becomes 20%
        if (hoveredId === "canada" || hoveredId === "australia" || hoveredId === "usa") {
            if (id === hoveredId) return "w-[40%]";
            if (id === "uk") return "w-[20%]";
        }
        // Second row: last card (Ireland) is 40% by default unless hovered
        if (isLastInSecondRow) {
            if (hoveredId === id) return "w-[40%]";
            if (hoveredId === "germany" || hoveredId === "placeholder1" || hoveredId === "placeholder2") {
                if (id === "ireland") return "w-[20%]";
            }
            return "w-[40%]";
        }
        // If hoveredId is Ireland (last card), it becomes 40% and Germany shrinks? But requirement: last one has 40 default.
        // Handle second row hover on non-last cards: they become 40%, last becomes 20%
        if (hoveredId === "germany" || hoveredId === "placeholder1" || hoveredId === "placeholder2") {
            if (id === hoveredId) return "w-[40%]";
            if (id === "ireland") return "w-[20%]";
        }
        // Default for all other cards: 20%
        return "w-[20%]";
    };

    return (
        <section className="bg-amber-50/50 py-16 px-4 md:px-8" id="destinations">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-emerald-900/10 text-emerald-900 font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-full border border-emerald-900/20 mb-4"
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
                    <em className="text-emerald-700 not-italic">Study Abroad Consultants</em> — Choose Your Country
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
                <div className="flex flex-wrap gap-2 mb-4">
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
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                            {/* Badge */}
                            {dest.badge && (
                                <span className={`absolute top-4 right-4 z-20 ${dest.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg`}>
                                    {dest.badge}
                                </span>
                            )}

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 z-20 p-5 text-white">
                                <span className="text-4xl block mb-2">{dest.flag}</span>
                                <h3 className="font-serif text-2xl font-bold leading-tight">{dest.name}</h3>
                                <p className="text-xs text-white/80 mt-1 line-clamp-2">{dest.description}</p>

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
                <div className="flex flex-wrap gap-4">
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                                {dest.badge && (
                                    <span className={`absolute top-4 right-4 z-20 ${dest.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg`}>
                                        {dest.badge}
                                    </span>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 z-20 p-5 text-white">
                                    <span className="text-4xl block mb-2">{dest.flag}</span>
                                    <h3 className="font-serif text-2xl font-bold leading-tight">{dest.name}</h3>
                                    <p className="text-xs text-white/80 mt-1 line-clamp-2">{dest.description}</p>

                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        whileHover={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="inline-flex items-center gap-1 mt-3 bg-amber-400 text-gray-900 text-xs font-bold px-4 py-2 rounded-full"
                                    >
                                        Explore {dest.name.split(' ')[0]} →
                                    </motion.span>
                                </div>

                                {/* Optional placeholder styling */}
                                {dest.placeholder && (
                                    <div className="absolute inset-0 bg-black/40 z-5" />
                                )}
                            </motion.a>
                        );
                    })}
                </div>

                {/* CTA Band */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-12 bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
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