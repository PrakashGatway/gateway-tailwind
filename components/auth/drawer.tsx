"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, User, LogIn } from "lucide-react"
import Auth from "./auth"

const AuthDrawer = ({ isOpen, setIsOpen }:any) => {
    const toggleDrawer = () => setIsOpen(!isOpen)

    return (
        <>
            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={toggleDrawer}
                    />
                )}
            </AnimatePresence>

            {/* Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            duration: 0.4,
                        }}
                        style={{zIndex:"999"}}
                        className="fixed top-0 right-0 h-full w-full max-w-md header-gradient shadow-2xl overflow-y-auto"
                    >
                        {/* Close Button */}
                        <Button
                            onClick={toggleDrawer}
                            variant="ghost"
                            className="absolute top-4 p-3 border right-4 z-10 rounded-full hover:bg-gray-100"
                        >
                            <X className="w-12 h-12 font-bold" />
                        </Button>

                        <div className="absolute inset-0 overflow-hidden">
                            <motion.div
                                className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full"
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div
                                className="absolute top-32 right-20 w-6 h-6 bg-secondary rounded-full"
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1
                                }}
                            />
                            <motion.div
                                className="absolute bottom-40 left-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-accent"
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 2
                                }}
                            />
                            <motion.div
                                className="absolute top-40 left-5 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-accent"
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 2
                                }}
                            />  <motion.div
                                className="absolute bottom-40 right-10 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-accent"
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 3
                                }}
                            />
                            <motion.div
                                className="absolute top-1/4 right-1/4 w-8 h-8 bg-primary rounded-full"
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 3
                                }}
                            />
                        </div>

                        {/* Auth Component Container */}
                        <div className="h-full flex items-center justify-center p-1">
                            <div className="w-full max-w-md">
                                <Auth toggleDrawer={toggleDrawer}/>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}


export default AuthDrawer
