"use client";

import { baseUrl } from "@/services/axiosInstance";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

// --- Types ---
interface Destination {
    id: string;
    flag: string;
    name: string;
    description: string; // Cleaned text without HTML tags
    link: string;
    badge?: string;
    badgeColor?: string;
    bgClass: string;
    image: string;
}

// --- Helper: Map API Response to Component Interface ---
const mapApiToDestination = (apiItem: any, index: number): Destination => {
    // 1. Generate a stable ID from slug or index
    const id = apiItem.slug ? apiItem.slug.replace('study-in-', '') : `dest-${index}`;
    
    // 2. Extract Flag (Simple mapping based on name, fallback to globe)
 

    // 3. Clean HTML tags from subtitle for the description text
    const cleanText = (html: string) => {
        if (!html) return "";
        // Remove divs, spans, but keep bullets/dots if they are text content
        // A simple regex to strip tags is usually enough for this display
        return html.replace(/<[^>]+>/g, '').replace(/&middot;/g, '·').replace(/&nbsp;/g, ' ').trim();
    };


    // 5. Dynamic Background Colors based on index or name (Optional aesthetic touch)
    const bgColors = [
        "from-blue-900/20", "from-red-900/20", "from-cyan-900/20", 
        "from-indigo-900/20", "from-emerald-900/20", "from-orange-900/20", "from-purple-900/20"
    ];


    return {
        id: id,
        name: apiItem.name,
        description: cleanText(apiItem.subtitle),
        link: `/${apiItem.slug}`, // Ensure slug exists in API
        image: apiItem.image ? (apiItem.image) : "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop",
        bgClass: bgColors[index % bgColors.length],
        // Add badges dynamically if needed, e.g., if name is UK
        badge: (id === 'uk' || id === 'united-kingdom') ? "Most Popular" : undefined,
        badgeColor: "bg-rose-600"
    };

};

export default function DestinationsSection({ content }: { content: any }) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [mappedDestinations, setMappedDestinations] = useState<Destination[]>([]);


    // Transform API data when content changes
    useEffect(() => {
        if (content?.destinations && Array.isArray(content.destinations)) {
            const transformed = content.destinations.map((item: any, index: number) => 
                mapApiToDestination(item, index)
            );
            setMappedDestinations(transformed);
        }
    }, [content]);

    // --- Dynamic Layout Logic ---
    
    // Split into two rows dynamically
    // Row 1: First 4 items
    // Row 2: Remaining items (padded to 4 if necessary for layout consistency, or just flexible)
    const firstRow = useMemo(() => mappedDestinations.slice(0, 4), [mappedDestinations]);
    
    // For the second row, we take the rest. 
    // To maintain the "accordion" visual balance, we ideally want 4 items in row 2 as well.
    // If API returns exactly 7, Row 2 has 3. We can pad it or just handle 3.
    // Let's assume we want to fill the row. If < 4, we can add placeholders or just render what we have.
    // Here, I will strictly use the API data. If you want placeholders, add them here.
    let secondRowRaw = mappedDestinations.slice(4);
    
    // OPTIONAL: If you want to ensure the second row always has 4 slots for the animation logic:
    // You can push dummy objects if secondRowRaw.length < 4. 
    // For now, I will stick to the actual data to avoid broken links.
    
    const secondRow = secondRowRaw;

    /**
     * Dynamic Width Calculator
     * Logic: 
     * 1. Identify the "Dominant" card in each row.
     *    - Row 1 Default Dominant: Index 0 (First item)
     *    - Row 2 Default Dominant: Last Item (to mimic your previous "Ireland" logic) OR First Item.
     *      *Note: Your previous code had Ireland (last) as big. Let's stick to that pattern for Row 2.*
     * 2. If Hovering a card in that row, THAT card becomes dominant (40%), others shrink (20%).
     * 3. If not hovering, default dominant stays big.
     */
    const getCardWidth = (id: string, rowType: 'first' | 'second') => {
        const rowItems = rowType === 'first' ? firstRow : secondRow;
        const idsInRow = rowItems.map(d => d.id);
        
        if (!idsInRow.includes(id)) return "lg:w-[20%]"; // Safety check

        // Determine default "Big" card for this row
        // Row 1: First item is big by default
        // Row 2: Last item is big by default (matching your previous Ireland logic)
        const defaultBigId = rowType === 'first' ? idsInRow[0] : idsInRow[idsInRow.length - 1];

        // Scenario 1: No hover anywhere
        if (!hoveredId) {
            return id === defaultBigId ? "lg:w-[40%]" : "lg:w-[20%]";
        }

        // Scenario 2: Hovering inside THIS row
        if (idsInRow.includes(hoveredId)) {
            return id === hoveredId ? "lg:w-[40%]" : "lg:w-[20%]";
        }

        // Scenario 3: Hovering in the OTHER row -> Reset to default state
        return id === defaultBigId ? "lg:w-[40%]" : "lg:w-[20%]";
    };

    // Mobile Grouping (Pairs)
    const firstRowPairs = [];
    for (let i = 0; i < firstRow.length; i += 2) {
        firstRowPairs.push(firstRow.slice(i, i + 2));
    }
    
    const secondRowPairs = [];
    for (let i = 0; i < secondRow.length; i += 2) {
        secondRowPairs.push(secondRow.slice(i, i + 2));
    }

    if (!mappedDestinations.length) return null; // Or a loader

  

    return (
        <section className="py-12 sm:py-12 px-4 md:px-8" id="destinations" style={{
            background: "linear-gradient(180deg, rgba(188, 140, 252, 0.2), rgba(215, 22, 53, 0.2))"
        }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-red-100 text-[#C41430] font-semibold text-xs lg:text-xm tracking-wider uppercase px-4 py-2 rounded-full border border-emerald-900/20 mb-4"
                >
                    {content?.label || "Study Abroad Destinations"}
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className=" text-2xl sm:text-3xl md:text-4xl font-bold font-black text-gray-900 leading-tight mb-3"
                >
                    {content?.title || "Choose Your Country"}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="text-gray-600 w-full text-base sm:text-base mb-8 sm:mb-12 text-justify"
                    dangerouslySetInnerHTML={{
                        __html : content.subTitle || ""
                    }}
                />

                {/* --- FIRST ROW --- */}
                
                {/* Mobile View */}
                <div className="lg:hidden mb-4">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 lg:hidden">
  {firstRow?.map((dest, index) => (
    <MobileCard key={dest.id || index} dest={dest} />
  ))}
</div>
                </div>

                {/* Desktop View */}
                <div className="hidden lg:flex lg:flex-row gap-4 mb-4">
                    {firstRow.map((dest) => (
                        <DesktopCard 
                            key={dest.id}
                            dest={dest}
                            widthClass={getCardWidth(dest.id, 'first')}
                            hoveredId={hoveredId}
                            setHoveredId={setHoveredId}
                        />
                    ))}
                </div>

                {/* --- SECOND ROW --- */}

                {/* Mobile View */}
                <div className="lg:hidden">
                   <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 lg:hidden">
  {secondRow?.map((dest, index) => (
    <MobileCard key={dest.id || index} dest={dest} />
  ))}
</div>
                </div>

                {/* Desktop View */}
                <div className="hidden lg:flex lg:flex-row gap-4">
                    {secondRow.map((dest, index) => (
                        <DesktopCard 
                            key={dest.id}
                            dest={dest}
                            widthClass={getCardWidth(dest.id, 'second')}
                            hoveredId={hoveredId}
                            setHoveredId={setHoveredId}
                            delay={0.2 + index * 0.05}
                        />
                    ))}
                </div>

                {/* CTA Band */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 sm:mt-12 bg-[#D71635] rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
                >
                    <p className="text-white font-medium text-base sm:text-lg flex items-center gap-3 text-center md:text-left">
                        <span className="text-2xl">🤔</span> Not sure which country is best for your profile, budget, and career goals?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
                        <a
                            href="/onboarding"
                            className="bg-amber-400 text-gray-900 font-bold px-5 sm:px-6 py-3 rounded-full transition-all transform hover:scale-105 shadow-lg text-center"
                        >
                            🎯 Get Free Country Match
                        </a>
                        <Link
                            href="tel:+91-8302092630"
                            className="border-2 border-white/30 hover:border-amber-400 text-white font-semibold px-5 sm:px-6 py-3 rounded-full transition-all text-center"
                        >
                            📞 Call Our Expert
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// --- Sub-Components for Cleaner Code ---

function DesktopCard({ 
    dest, 
    widthClass, 
    hoveredId, 
    setHoveredId, 
    delay = 0.2 
}: { 
    dest: Destination; 
    widthClass: string; 
    hoveredId: string | null; 
    setHoveredId: (id: string | null) => void;
    delay?: number;
}) {

    
    
    return (
        <motion.a
            href={dest.link}
            className={`relative h-64 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out ${widthClass} bg-gradient-to-br ${dest.bgClass} hover:shadow-2xl group`}
            onHoverStart={() => setHoveredId(dest.id)}
            onHoverEnd={() => setHoveredId(null)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            layout // Important for smooth width transitions
        >
            <img
                  src={`${baseUrl}/uploads/${dest?.image}`}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
            
            {dest.badge && (
                <span className={`absolute top-4 right-4 z-20 ${dest.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg`}>
                    {dest.badge}
                </span>
            )}
             <div className="absolute -bottom-14 left-0 right-0 z-20 p-5 text-white transition-all duration-300 ease-out group-hover:bottom-0">
                <h3 className=" text-2xl font-bold leading-tight"> {dest.name}</h3>
                <p className="text-xm text-white/90 mt-1 line-clamp-2">{dest.description}</p>
                
                {/* 
                    3. Updated Button Logic:
                    - Default: opacity-0 (Invisible)
                    - Group Hover: opacity-100 (Visible)
                    - Removed individual motion hover props to let parent control it
                */}
                <span
                    className="inline-flex items-center gap-1 mt-3 bg-amber-400 text-gray-900 text-xs font-bold px-4 py-2 rounded-full opacity-0 transition-opacity duration-300 delay-100 group-hover:opacity-100"
                >
                    Explore {dest.name.split(' ')[0]} →
                </span>
            </div>
        </motion.a>
    );
}

function MobileCard({ dest }: { dest: Destination }) {
   
    return (
        <motion.a
            href={dest.link}
            className="relative h-48 sm:h-56 rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br from-gray-900/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <img
                src={`${baseUrl}/uploads/${dest?.image}`}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
            
            {dest.badge && (
                <span className={`absolute top-3 right-3 z-20 ${dest.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-lg`}>
                    {dest.badge}
                </span>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 text-white">
                <h3 className=" text-base sm:text-xl font-bold leading-tight">{dest.flag} {dest.name}</h3>
                <span className="inline-flex items-center gap-1 mt-2 bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">
                    Explore →
                </span>
            </div>
        </motion.a>
    );
}