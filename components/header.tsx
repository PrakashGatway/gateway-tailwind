"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  GraduationCap,
  FileText,
  Languages,
  Award,
  User,
  Settings,
  LayoutDashboard,
  LogOut,
  ImageDownIcon,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { constant } from "@/constant/index.constant";
import { useGlobal } from "@/hooks/AppStateContext";
import { useRouter, usePathname } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [countryPage, setCountyPage] = useState([]);

  const destinationRef = useRef(null);

  const studyAbroadRef = useRef(null);
  const testPrepRef = useRef(null);
  const userMenuRef = useRef(null);

  const { user, course, logout, drawer, setDrawer } = useGlobal();
  const [CourseData, setCourseData] = useState([]);

  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const router = useRouter();

  const contactNumber = "+91-8302092630";

  const path = usePathname()

  async function getPageData(type, setState) {
    const response = await axiosInstance.get(`/page/list/type?type=${type}&featured=true`);
    if (response.data?.data) {
      setState(response.data.data);
    }
  }
  
  useEffect(() => {
    getPageData('country_page', setCountyPage);
  }, []);

  // 👇 click handler
  // const handleClick = (menu) => {
  //   setOpenMenu(openMenu === menu ? null : menu);
  // };

  // Set mounted state to avoid hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (course?.page) {
      setCourseData(course.page);
    }
  }, [course]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-open login drawer when login=true in URL and clean URL
  useEffect(() => {
    if (!isMounted) return;

    const loginParam = searchParams?.get('login');
    if (loginParam === 'true' && !drawer && !user?.email) {
      setDrawer(true);

      // Remove login=true from URL without page refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      const newUrl = url.pathname + url.search;

      // Use replaceState to update URL without reload
      window.history.replaceState(null, '', newUrl);
    }
  }, [searchParams, drawer, user?.email, setDrawer, isMounted]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        studyAbroadRef.current &&
        !studyAbroadRef.current.contains(event.target)
      ) {
        setOpenMenu((prev) => (prev === "studyAbroad" ? null : prev));
      }
      if (testPrepRef.current && !testPrepRef.current.contains(event.target)) {
        setOpenMenu((prev) => (prev === "testPrep" ? null : prev));
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenMenu((prev) => (prev === "userMenu" ? null : prev));
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) { // 👈 Fixed this line
        setOpenMenu((prev) => (prev === "destination" ? null : prev));
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if(path === "/onboarding"){
    return null
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleClick = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  // Don't render anything during SSR to avoid hydration mismatch

  return (
    <header
      className={`fixed w-full top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || isMenuOpen
        ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg py-2.5"
        : "header-gradient dark:bg-slate-900/20 backdrop-blur-sm py-3 sm:py-2"
        }`}
    >
      <div className="mx-auto px-2 lg:p-0 sm:px-4 max-w-7xl container-sm">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0"
          >
            <Image
              src="/images/logo.svg"
              alt="Company Logo"
              width={120}
              height={30}
              className="w-[130px] sm:w-[200px] h-8 sm:h-[60px] object-contain transition-all duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 group text-sm "
            >
              Home
            </Link>

            <Link
              href="/about"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 group text-sm "
            >
              About Us
            </Link>

            <div
              className="relative"
              ref={destinationRef}
              onMouseEnter={() => setOpenMenu("destination")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                onClick={() => handleClick("destination")}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 group text-sm "
              >
                Destination
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform duration-300 ${openMenu === "destination" ? "rotate-180" : ""
                    }`}
                />
              </button>

              <AnimatePresence>
                {openMenu === "destination" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute top-full left-0 mt-2 w-[600px] bg-gradient-to-br from-[#f8f9fa] via-[#f1f3f5] to-[#e9ecef] dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f3460] rounded-xl shadow-2xl py-4 px-4 z-50 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {countryPage.map((country, index) => {
                        const slug = country?.slug?.toLowerCase().replace(/\s+/g, "-");
                        return (

                          <Link
                            key={index}
                            href={`/study-in-${slug}`}
                            className="flex items-center space-x-2 p-3 rounded-lg bg-white dark:bg-slate-800 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 dark:hover:from-slate-700 dark:hover:to-slate-600"
                          >
                            {true && (
                              <Image
                                alt={country.slug || country.name || "country"}
                                src={`https://img.freepik.com/free-vector/planet-earth_1308-82523.jpg`}
                                width={40}
                                height={40}
                                className=" object-cover w-5 h-5 rounded-full shadow-lg"
                              />
                            )}
                            <div className="my-auto">
                              <h3 className="text-sm font-medium text-gray-700 dark:text-white capitalize">
                                Study In  {country?.slug}
                              </h3>

                            </div>
                          </Link>
                        )
                      }
                      )}

                      {countryPage.length === 0 && (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                          No countries available
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            {/* Test Prep Dropdown */}
            <div
              className="relative"
              ref={testPrepRef}
              onMouseEnter={() => setOpenMenu("testPrep")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                onClick={() => handleClick("testPrep")}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 group text-sm "
              >
                Test Preparation
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform duration-300 ${openMenu === "testPrep" ? "rotate-180" : ""
                    }`}
                />
              </button>

              <AnimatePresence>
                {openMenu === "testPrep" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute top-full left-0 mt-2 w-[600px] bg-gradient-to-br from-[#f8f9fa] via-[#f1f3f5] to-[#e9ecef] dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f3460] rounded-xl shadow-2xl py-6 px-6 z-50 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {CourseData.map((course, index) => (
                        <Link
                          key={index}
                          href={`/course/${course.pageName.toLowerCase()}`}
                          className="flex items-center space-x-2 p-3 rounded-lg bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 dark:hover:from-slate-700 dark:hover:to-slate-600"
                        >
                          <Image
                            alt="course logo"
                            src={`${constant.REACT_APP_URL}/api/uploads/${course.image}`}
                            width={60}
                            height={0}
                            className="rounded-full border-2 border-gray-200 dark:border-gray-600"
                          />
                          <div className="my-auto">
                            <h3 className="text-sm font-bold text-gray-600 p-0 m-0 dark:text-white">
                              {course.pageName}
                            </h3>
                            <p className="text-xs m-0 p-0 text-gray-600 line-clamp-1 dark:text-gray-400">
                              {course.textFild}
                            </p>
                          </div>
                        </Link>
                      ))}
                      <Link
                        href="/spoken-english"
                        className="flex items-center space-x-2 p-3 rounded-lg bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 dark:hover:from-slate-700 dark:hover:to-slate-600"
                      >
                        <Image
                          alt="course logo"
                          src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy5TnSFRcyIuhZTSckFhutSF5UJCXvJSJt6w&s`}
                          width={60}
                          height={0}
                          className="rounded-full border-2 border-gray-200 dark:border-gray-600"
                        />
                        <div className="my-auto">
                          <h3 className="text-sm font-bold text-gray-600 p-0 m-0 dark:text-white">
                            {"Spoken English"}
                          </h3>
                          <p className="text-xs m-0 p-0 text-gray-600 dark:text-gray-400">
                            {"Spoken English"}
                          </p>
                        </div>
                      </Link>
                      {/* <Link
                        href="/spoken-english"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 group text-sm "
                      >
                        Spoken English
                      </Link> */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/blog"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 group text-sm "
            >
              Blogs
            </Link>

            <Link
              href="/career"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 group text-sm "
            >
              Career
            </Link>

            <Link
              href="/contact"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 group text-sm "
            >
              Contact Us
            </Link>



          </nav>



          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Contact Number Box */}
            <div className="relative group mt-3 sm:mt-4">
              <div className="flex items-center space-x-1 px-2 py-1 bg-[#fbbf24] border border-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#d61635] hover:text-white">
                <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-black" />
                <Link
                  href={`tel:${contactNumber}`}
                  className="text-black hover:text-white font-bold text-[10px] sm:text-[14px] truncate max-w-[80px] sm:max-w-[130px]"
                >
                  {contactNumber}
                </Link>
              </div>
              <p className="text-[8px] sm:text-[14px] font-bold text-[#d61635] pl-1 sm:pl-2 mt-0.5">
                connect with expert
              </p>
            </div>


            {user?.email ? (
              <div
                className="relative"
                ref={userMenuRef}
                onMouseEnter={() => setOpenMenu("userMenu")}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  onClick={() => handleClick("userMenu")}
                  className="flex items-center space-x-2 p-1 rounded-full bg-red-50 hover:bg-red-100 dark:hover:bg-slate-800 transition-all duration-300 group"
                >
                  <Image
                    src="/placeholder-user.jpg"
                    alt={user?.name || "User"}
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:border-[#E83A3A] dark:group-hover:border-[#FF6B6B] transition-all duration-300"
                  />
                  <ChevronDown
                    className={`hidden lg:block h-4 w-4 text-gray-700 dark:text-gray-300 transition-transform duration-300 ${openMenu === "userMenu" ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {/* User Menu Dropdown */}
                <AnimatePresence>
                  {openMenu === "userMenu" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-xl py-2 z-50 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <Image
                            src={"/placeholder-user.jpg"}
                            alt={user?.name || "User"}
                            width={40}
                            height={40}
                            className="rounded-full border-2 border-gray-200 dark:border-gray-600"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white m-0 p-0">
                              {user?.name || "User"}
                            </p>
                            <p
                              className="text-xs text-gray-600 dark:text-gray-400 m-0 p-0 truncate"
                              title={user?.email}
                            >
                              {user?.email
                                ? user.email.length > 25
                                  ? `${user.email.substring(0, 24)}...`
                                  : user.email
                                : "No email"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <a
                          href="https://dashboard.gatewayabroadeducations.com/profile"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] transition-all duration-300"
                          onClick={() => setOpenMenu(null)}
                        >
                          <User className="h-5 w-5" />
                          <span>My Profile</span>
                        </a>

                        <a
                          href="https://dashboard.gatewayabroadeducations.com"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] transition-all duration-300"
                          onClick={() => setOpenMenu(null)}
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Dashboard</span>
                        </a>

                        <a
                          href="https://dashboard.gatewayabroadeducations.com/profile"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] transition-all duration-300"
                          onClick={() => setOpenMenu(null)}
                        >
                          <Settings className="h-5 w-5" />
                          <span>Settings</span>
                        </a>

                        <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                        <button
                          className="flex items-center space-x-3 px-4 py-2 w-full text-left text-[#E83A3A] dark:text-[#FF6B6B] hover:bg-red-50 dark:hover:bg-slate-700 transition-all duration-300"
                          onClick={() => {
                            setOpenMenu(null);
                            logout();
                          }}
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                className="flex btn-primary lg:flex text-sm hidden items-center justify-center !py-2 !px-3 space-x-1 "
                onClick={() => setDrawer(!drawer)}
              >
                <User className="h-5 w-5" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-md bg-transparent hover:bg-red-50 dark:hover:bg-slate-800 focus:outline-none transition-all duration-300"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                {/* Top Bar */}
                <span
                  className={`absolute h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45" : "-translate-y-2"
                    }`}
                ></span>

                {/* Middle Bar */}
                <span
                  className={`absolute h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                ></span>

                {/* Bottom Bar */}
                <span
                  className={`absolute h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45" : "translate-y-2"
                    }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 overflow-y-auto ${isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
            }`}
          style={{ maxHeight: isMenuOpen ? "calc(100vh - 80px)" : "0" }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
            div {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>

          <nav className="py-4 mt-2 border-t border-gray-100 dark:border-gray-700">
            {/* Mobile User Info */}
            {user?.email && (
              <div className="mb-2 px-2">
                <div className="flex items-center space-x-2 px-3 py-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 rounded-lg">
                  <Image
                    src={"/placeholder-user.jpg"}
                    alt={user?.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-[#E83A3A] dark:border-[#FF6B6B]"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white m-0 p-0 mb-0">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 m-0 p-0">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-1 px-2">
              <Link
                href="/"
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <GraduationCap className="h-5 w-5" />
                <span>Home</span>
              </Link>

              <Link
                href="/about"
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>About Us</span>
              </Link>

              <Link
                href="/spoken-english"
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <Languages className="h-5 w-5" />
                <span>Spoken English</span>
              </Link>
              <div className="relative">
                <button
                  onClick={() => handleClick("destinationsMobile")}
                  className="flex items-center justify-between w-full space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5" />
                    <span>Destinations</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${openMenu === "testPrepMobile" ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {openMenu === "destinationsMobile" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden pl-8"
                    >
                      <div className="space-y-1 py-2">
                        <div className="grid grid-cols-2 gap-2">
                          {countryPage.map((country, index) => {
                            const slug = country?.slug?.toLowerCase().replace(/\s+/g, "-");
                            return (

                              <Link
                                key={index}
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  setOpenMenu(null);
                                }}
                                href={`/study-in-${slug}`}
                                className="flex items-center space-x-2 p-3 rounded-lg bg-white dark:bg-slate-800 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 dark:hover:from-slate-700 dark:hover:to-slate-600"
                              >
                                {true && (
                                  <Image
                                    alt={country.slug || country.name || "country"}
                                    src={`https://img.freepik.com/free-vector/planet-earth_1308-82523.jpg`}
                                    width={40}
                                    height={40}
                                    className=" object-cover w-5 h-5 rounded-full shadow-lg"
                                  />
                                )}
                                <div className="my-auto">
                                  <h3 className="text-sm font-medium text-gray-700 dark:text-white capitalize">
                                    Study In  {country?.slug}
                                  </h3>

                                </div>
                              </Link>
                            )
                          }
                          )}

                          {countryPage.length === 0 && (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                              No countries available
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


              {/* Test Prep Mobile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => handleClick("testPrepMobile")}
                  className="flex items-center justify-between w-full space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5" />
                    <span>Test Preparation</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${openMenu === "testPrepMobile" ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {openMenu === "testPrepMobile" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden pl-8"
                    >
                      <div className="space-y-1 py-2">
                        {CourseData.map((course, index) => (
                          <Link
                            key={index}
                            href={`/course/${course.pageName.toLowerCase()}`}
                            className="block text-sm text-gray-600 dark:text-gray-400 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setOpenMenu(null);
                            }}
                          >
                            <FileText className="h-4 w-4" />
                            <span>{course.pageName}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/blog"
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="h-5 w-5" />
                <span>Blogs</span>
              </Link>

              <Link
                href="/career"
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <Award className="h-5 w-5" />
                <span>Career</span>
              </Link>

              <Link
                href="/gallery"
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <ImageDownIcon className="h-5 w-5" />
                <span>Gallery</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] font-medium transition-all duration-300 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Contact Us</span>
              </Link>

              {/* Mobile Contact Number Box */}
              <div className="my-3">
                <Link
                  href={`tel:${contactNumber}`}
                  className="flex btn-primary !m-0 items-center justify-center px-4 py-2 !bg-[#fbbf24] rounded-lg shadow-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Phone className="h-5 w-5 text-white" />
                  <span className="text-white font-bold text-base">
                    {contactNumber}
                  </span>
                </Link>
              </div>

              {/* Mobile User Menu */}
              {user?.email && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                  <a
                    href="https://dashboard.gatewayabroadeducations.com/profile"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] transition-all duration-300"
                    onClick={() => setOpenMenu(null)}
                  >
                    <User className="h-5 w-5" />
                    <span>My Profile</span>
                  </a>

                  <a
                    href="https://dashboard.gatewayabroadeducations.com"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] transition-all duration-300"
                    onClick={() => setOpenMenu(null)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </a>

                  <a
                    href="https://dashboard.gatewayabroadeducations.com/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-[#E83A3A] dark:hover:text-[#FF6B6B] transition-all duration-300"
                    onClick={() => setOpenMenu(null)}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </a>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                  <button
                    className="flex items-center space-x-3 text-red-600 dark:text-red-400 font-medium transition-all duration-300 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800 w-full text-left"
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {!user?.email && (
                <button
                  className="btn-primary flex items-center !py-2 justify-center "
                  onClick={() => setDrawer(!drawer)}
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;