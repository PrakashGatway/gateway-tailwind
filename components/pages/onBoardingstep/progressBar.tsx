"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  // Calculate progress percentage safely
  const progress = totalSteps > 1 
    ? (currentStep / (totalSteps - 1)) * 100 
    : 100;

  return (
    <div className="relative py-6 px-2" role="progressbar" aria-valuenow={currentStep} aria-valuemin={0} aria-valuemax={totalSteps - 1}>
      
      {/* Progress Track Background */}
      <div className="absolute top-1/2 left-6 right-6 h-1 bg-gray-200 rounded-full -translate-y-1/2" />
      
      {/* Active Progress Fill */}
      <motion.div
        className="absolute top-1/2 left-6 h-1 bg-red-500 rounded-full -translate-y-1/2"
        initial={false}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Smooth ease-out curve
        style={{ transformOrigin: "left" }}
      />

      {/* Step Indicators */}
      <div className="flex justify-between relative z-10">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;
          
          return (
            <motion.button
              key={i}
              type="button"
              disabled
              initial={false}
              animate={{
                scale: isActive ? 1.1 : 1,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                mass: 0.5
              }}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${isCompleted 
                  ? "bg-red-500 border-white text-white shadow-md shadow-blue-200" 
                  : isActive 
                    ? "bg-white border-red-500 text-red-500 shadow-sm" 
                    : "bg-white border-gray-300 text-gray-400"
                }
              `}
              aria-label={`Step ${i + 1}${isCompleted ? " (completed)" : isActive ? " (current)" : ""}`}
              aria-current={isActive ? "step" : undefined}
            >
              {isCompleted ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.span>
              ) : (
                <span className={isActive ? "text-red-500" : "text-gray-400"}>
                  {i + 1}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}