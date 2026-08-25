"use client"; // This directive is necessary for client-side components in Next.js

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

// Simple utility to conditionally join class names, similar to 'clsx' or 'classnames'
// This is included because it's a dependency for the styling of these components.
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex flex-col w-48 h-auto max-h-[calc(100vh-8rem)] items-start justify-start rounded-lg bg-red-100 p-1 text-red-800 shadow-md overflow-y-auto", // Changed to vertical flex, fixed width, max height, and vertical scrolling
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  // Wrap TabsPrimitive.Trigger with motion for animations
  <motion.div
    layoutId={props.value} // Unique ID for layout animations
    transition={{ type: "spring", stiffness: 500, damping: 30 }} // Smooth spring animation
    className="w-full" // Ensure trigger takes full width in vertical list
  >
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all duration-300 w-full", // Added w-full to fill vertical space
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "bg-transparent text-red-700 hover:bg-red-200 hover:text-red-900 shadow-sm", // Default red styling
        "data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:font-semibold data-[state=active]:ring-2 data-[state=active]:ring-red-500", // Active red styling
        className
      )}
      {...props}
    />
  </motion.div>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  // Use AnimatePresence for mount/unmount animations and motion.div for content
  <AnimatePresence mode="wait"> {/* 'wait' mode ensures one animation finishes before the next starts */}
    <motion.div
      key={props.value} // Crucial for AnimatePresence to track unique content
      initial={{ opacity: 0, y: 10 }} // Initial state (starts slightly below and transparent)
      animate={{ opacity: 1, y: 0 }} // Animates to full opacity and original position
      exit={{ opacity: 0, y: -10 }} // Animates out (moves slightly up and fades)
      transition={{ duration: 0.2 }} // Animation duration
      className={cn(
        "mt-4 p-4 rounded-lg bg-white shadow-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <TabsPrimitive.Content
        ref={ref}
        {...props}
      />
    </motion.div>
  </AnimatePresence>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };