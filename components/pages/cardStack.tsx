"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { Play, Star } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function CardStackGridSection({ video: cards }) {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: false, amount: 0.2 });

  const [gridCols, setGridCols] = useState(3);
  // Use ref to store card dimensions for calculations without triggering re-renders
  const cardDimensionsRef = useRef({ width: 0, height: 0, gap: 20 });
  const [gridPositions, setGridPositions] = useState([]);
  const [containerHeight, setContainerHeight] = useState('auto'); // State for dynamic height

  // Determine number of columns and estimate card dimensions
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      let cols;
      if (width < 640) {
        cols = 1;
      } else if (width < 1024) {
        cols = 2;
      } else {
        cols = 3;
      }
      setGridCols(cols);

      const gap = 20; // 0.5rem in Tailwind default
      // Estimate base card width based on screen size and Tailwind classes (w-full max-w-xs)
      // Note: This is still an approximation. getBoundingClientRect would be more precise.
      let cardWidth;
      const assumedPaddingX = 32; // Roughly px-4 on each side
      if (cols === 1) {
        cardWidth = width - assumedPaddingX;
      } else {
        // For multi-column, assume container max-w-7xl padding and gap
        const containerPaddingX = 32; // Approx px-4 on container
        cardWidth = (width - containerPaddingX - (cols - 1) * gap) / cols;
        // Tailwind max-w-xs is 22rem = 352px. Cap the width.
        cardWidth = Math.min(cardWidth, 352);
      }
      // Estimate height: 16:9 video + fixed content height
      const videoHeight = cardWidth * (9 / 16);
      const contentHeight = 120; // Estimated height of title, rating, tags area
      const cardHeight = videoHeight + contentHeight;

      cardDimensionsRef.current = { width: cardWidth, height: cardHeight, gap };

      // Recalculate positions based on new dimensions
      recalculateGridPositions(cols, cardWidth, cardHeight, gap);
    };

    const recalculateGridPositions = (cols, width, height, gap) => {
        if (cards.length > 0 && width > 0) {
            const totalGridWidth = cols * width + (cols - 1) * gap;
            const numRows = Math.ceil(cards.length / cols);
            const totalGridHeight = numRows * height + (numRows - 1) * gap;

            const newPositions = cards.map((_, index) => {
                const col = index % cols;
                const row = Math.floor(index / cols);
                const targetX = col * (width + gap) - totalGridWidth / 2 + width / 2;
                const targetY = row * (height + gap) - totalGridHeight / 2 + height / 2;
                return { targetX, targetY };
            });
            setGridPositions(newPositions);
        }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [cards]); // Recalculate on resize and card changes

  // Manage container height dynamically for smoother transitions and correct spacing
  useEffect(() => {
     const { height, gap } = cardDimensionsRef.current;
     if (height > 0) {
         if (inView) {
             // When in view and animated to grid, set height based on grid
             if (gridPositions.length > 0) {
                 const numRows = Math.ceil(cards.length / gridCols);
                 const totalGridHeight = numRows * height + (numRows - 1) * gap;
                 setContainerHeight(`${totalGridHeight}px`);
             }
         } else {
             // When out of view (stacked), set height based on stack
             const stackHeight = height + (cards.length > 0 ? (cards.length - 1) * 10 : 0);
             setContainerHeight(`${stackHeight}px`);
         }
     }
  }, [inView, gridPositions, cards.length, gridCols]); // Depend on state that affects height


  const cardVariants = (index) => ({
    hidden: {
      x: 0,
      y: index * 10,
      rotate: (index - cards.length / 2) * 3,
      scale: 1 - Math.min(cards.length - index, 5) * 0.02,
      opacity: 1,
      zIndex: cards.length - index,
      width: '100%',
      maxWidth: '22rem', // Tailwind max-w-xs
    },
    visible: {
      x: gridPositions[index]?.targetX ?? 0,
      y: gridPositions[index]?.targetY ?? 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      zIndex: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 18,
        duration: 1.7,
      },
      width: '100%',
      maxWidth: '22rem',
    },
  });

  const currentAnimationState = inView ? "visible" : "hidden";

  return (
    // Main wrapper: Added relative positioning and z-index to create a stacking context
    // Increased vertical padding for more spacing
    <div className="relative z-10 bg-pink-100 py-16 flex flex-col items-center justify-center">
      <div className="text-center mb-10 md:mb-12 px-4">
        <h2 className="heading text-2xl font-bold">What Our Students Say</h2>
      </div>

      {/* Animated Cards Container */}
      <motion.div
        ref={containerRef}
        className="relative w-full container-sm px-4 flex items-center justify-center mx-auto"
        variants={{
          hidden: { opacity: 1 },
          visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
        }}
        initial="hidden"
        animate={currentAnimationState}
        // Dynamically set height with transition
        style={{
          height: containerHeight,
          transition: "height 0.8s ease-in-out",
        }}
      >
        <AnimatePresence>
          {cards.map((card, index) => {
            const videoSrc = `https://www.youtube.com/embed/${card.mediaLink}?autoplay=0&rel=0&showinfo=0&modestbranding=1`;

            return (
              <motion.div
                key={card._id}
                custom={index}
                variants={cardVariants(index)}
                className="absolute w-full max-w-xs flex flex-col rounded-xl shadow-lg overflow-hidden bg-white"
                // Ensure zIndex is set correctly based on animation state within the variant
              >
                {/* Responsive Video Embed Container */}
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    src={videoSrc}
                    title={`Student story: ${card.title || `Video ${index + 1}`}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full rounded-t-xl border-0"
                    loading="lazy"
                  />
                </div>

                {/* Card Content */}
                <div className="p-3 md:p-4 bg-gradient-to-br from-white to-gray-50 flex-1 flex flex-col justify-between min-h-[120px]">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 text-xs md:text-sm line-clamp-2 flex-1 mr-2">
                        {card.title || `Student Story ${index + 1}`}
                      </h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-500">{card.rating || "5.0"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-0">
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                      Success Story
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      aria-label={`Watch video: ${card.title || `Student Story ${index + 1}`}`}
                    >
                      Watch <Play className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}