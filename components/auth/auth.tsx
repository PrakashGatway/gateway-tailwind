"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Mail, User, Phone, Key } from "lucide-react";
import Swal from "sweetalert2";
import axiosInstance from "@/services/axiosInstance";
import { useGlobal } from "@/hooks/AppStateContext";

type AuthMode = "email" | "register" | "otp" | "success";

export default function Auth({ toggleDrawer }: any) {
    // const searchParams = useSearchParams();
    // const ReferalFromUrl = searchParams.get("ref");
    const { userInfo } = useGlobal();

    const [mode, setMode] = useState<AuthMode>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(true);
    const [errors, setErrors] = useState<any>({});

    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        referCode: "",
    });

    // useEffect(() => {
    //     if (ReferalFromUrl) {
    //         setFormData((prev) => ({ ...prev, referCode: ReferalFromUrl }));
    //     }
    // }, [ReferalFromUrl]);

    const validatePhone = (value: string) => /^[6-9]\d{9}$/.test(value);
    const validateName = (value: string) => /^[A-Za-z ]{2,}$/.test(value);
    const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    // ✅ STEP 1: Email Verification
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: any = {};

        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            const res = await axiosInstance.get(`/auth/verify_email?email=${email}`);
            const exists = res?.data?.isExists;
            setUserExists(exists);

            if (exists) {
                // Existing user - send OTP directly
                await sendOtp();
                setMode("otp");
            } else {
                // New user - show registration form
                setMode("register");
            }
        } catch (error: any) {
            setErrors({
                email: error.response?.data?.message || "Failed to verify email. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ SEND OTP
    const sendOtp = async () => {
        try {
            const res = await axiosInstance.post("/auth/send_otp", { email });
            if (res?.data?.success) {
                Swal.fire({
                    title: "OTP Sent!",
                    text: "Check your email for the verification code.",
                    icon: "success",
                    timer: 3000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire("Failed", "Unable to send OTP. Please try again.", "error");
            }
        } catch (error: any) {
            Swal.fire(
                "Error",
                error.response?.data?.message || "Failed to send OTP.",
                "error"
            );
        }
    };

    // ✅ STEP 2: Registration Form
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: any = {};

        if (!validateName(formData.name)) {
            newErrors.name = "Please enter a valid name (letters and spaces only).";
        }
        if (!validatePhone(formData.phoneNumber)) {
            newErrors.phoneNumber = "Please enter a valid 10-digit phone number.";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            await sendOtp();
            setMode("otp");
        } catch (error: any) {
            setErrors({
                general: error.response?.data?.message || "Failed to send OTP. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ STEP 3: OTP Verification
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: any = {};

        if (!otp || otp.length !== 6) {
            newErrors.otp = "Please enter a valid 6-digit OTP.";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            const payload = userExists
                ? { email, otp }
                : { email, otp, ...formData };

            const res = await axiosInstance.post("/auth/verify_otp", payload);

            if (res?.data?.success) {
                userInfo();
                setMode("success");

                // Auto redirect after success
                setTimeout(() => {
                    toggleDrawer();
                    window.location.href = "https://dashboard.gatewayabroadeducations.com/";
                }, 2000);
            } else {
                setErrors({ otp: "Invalid OTP. Please try again." });
            }
        } catch (error: any) {
            setErrors({
                otp: error.response?.data?.message || "OTP verification failed. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-4 relative">
            <div className="mx-auto mb-6 absolute top-16 left-0 right-0">
                <img src="/img/ga-logo.svg" alt="Logo" className="w-60 mx-auto" />
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >


                {/* Progress Steps */}
                {/* <ProgressSteps currentStep={getCurrentStep()} /> */}
                <div className="min-h-[50vh]">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: Email Verification */}
                        {mode === "email" && (
                            <motion.form
                                key="email"
                                onSubmit={handleEmailSubmit}
                                className="space-y-6"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-red-800 mb-2">
                                        Welcome to Gateway Abroad
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        Enter your email to get started
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-left">
                                        <div className="flex items-center mb-2.5">
                                            <Mail className="w-5 h-5 text-gray-500 mr-2" />
                                            <Label htmlFor="email" className="font-medium text-gray-700">
                                                Email Address
                                            </Label>
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) setErrors({ ...errors, email: "" });
                                            }}
                                            placeholder="Enter your email address"
                                            required
                                            className="rounded-3xl border-2 border-gray-400 focus:border-red-500 w-full py-3 px-4 text-gray-900 transition-colors"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Terms & Conditions */}
                                    <div className="text-left">
                                        <div className="flex items-start space-x-3 text-xs text-gray-700 p-2 bg-gray-200 rounded-xl">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                className="w-4 h-4 accent-red-600 mt-1 flex-shrink-0"
                                            />
                                            <label htmlFor="terms" className="leading-relaxed">
                                                I agree to the{" "}
                                                <a href="/terms" className="text-red-600 underline font-medium">
                                                    Terms & Conditions
                                                </a>{" "}
                                                and{" "}
                                                <a href="/privacy-policy" className="text-red-600 underline font-medium">
                                                    Privacy Policy
                                                </a>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-red-600 text-white font-semibold rounded-2xl py-3 hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                                    disabled={loading || !termsAccepted}
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Checking Email...
                                        </div>
                                    ) : (
                                        "Continue"
                                    )}
                                </Button>
                            </motion.form>
                        )}

                        {/* STEP 2: Registration Form (New Users) */}
                        {mode === "register" && (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center mb-6">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setMode("email")}
                                        className="border-2 border-gray-300 px-2.5 rounded-full mr-3 mb-3 hover:bg-gray-50"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                    <div>
                                        <h2 className="text-2xl font-bold text-red-800 mb-1">
                                            Complete Your Profile
                                        </h2>
                                        <p className="text-gray-600 text-xs">
                                            Almost there! Just a few more details
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                                    <div className="text-left">
                                        <div className="flex items-center mb-2.5">
                                            <User className="w-4 h-4 text-gray-500 mr-2" />
                                            <Label htmlFor="name" className="font-medium text-gray-700">
                                                Full Name
                                            </Label>
                                        </div>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                if (errors.name) setErrors({ ...errors, name: "" });
                                            }}
                                            required
                                            className="rounded-3xl border-2 border-gray-400 focus:border-red-500 w-full py-3 px-4 transition-colors"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-left">
                                        <div className="flex items-center mb-2.5">
                                            <Phone className="w-4 h-4 text-gray-500 mr-2" />
                                            <Label htmlFor="phone" className="font-medium text-gray-700">
                                                Phone Number
                                            </Label>
                                        </div>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="Enter your 10-digit phone number"
                                            value={formData.phoneNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                setFormData({ ...formData, phoneNumber: value });
                                                if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: "" });
                                            }}
                                            required
                                            maxLength={10}
                                            className="rounded-3xl border-2 border-gray-400 focus:border-red-500 w-full py-3 px-4 transition-colors"
                                        />
                                        {errors.phoneNumber && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                                {errors.phoneNumber}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-left">
                                        <div className="flex items-center mb-2.5">
                                            <Key className="w-4 h-4 text-gray-500 mr-2" />
                                            <Label htmlFor="ref" className="font-medium text-gray-700">
                                                Referral Code (Optional)
                                            </Label>
                                        </div>
                                        <Input
                                            id="ref"
                                            type="text"
                                            placeholder="Enter referral code if any"
                                            value={formData.referCode}
                                            onChange={(e) =>
                                                setFormData({ ...formData, referCode: e.target.value })
                                            }
                                            className="rounded-3xl border-2 border-gray-400 focus:border-red-500 w-full py-3 px-4 transition-colors"
                                        />
                                    </div>

                                    {errors.general && (
                                        <p className="text-red-500 text-sm text-center bg-red-50 py-2 px-3 rounded-xl">
                                            {errors.general}
                                        </p>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-red-600 text-white font-semibold rounded-2xl py-3 hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mt-4"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Sending OTP...
                                            </div>
                                        ) : (
                                            "Send OTP"
                                        )}
                                    </Button>
                                </form>
                            </motion.div>
                        )}

                        {/* STEP 3: OTP Verification */}
                        {mode === "otp" && (
                            <motion.form
                                key="otp"
                                onSubmit={handleVerifyOtp}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center mb-6">
                                    <Button
                                        variant="ghost"
                                        onClick={() => userExists ? setMode("email") : setMode("register")}
                                        className="border-2 border-gray-300 px-2.5 mb-3 rounded-full mr-3 hover:bg-gray-50"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                    <div>
                                        <h2 className="text-2xl font-bold text-red-800 mb-1">
                                            Verify Your Email
                                        </h2>
                                        <p className="text-gray-600 text-xs">
                                            Enter the 6-digit code sent to {email}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-left">
                                    <div className="flex items-center mb-2.5">
                                        <Key className="w-5 h-5 text-gray-500 mr-2" />
                                        <Label htmlFor="otp" className="font-medium text-gray-700">
                                            Verification Code
                                        </Label>
                                    </div>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setOtp(value);
                                            if (errors.otp) setErrors({ ...errors, otp: "" });
                                        }}
                                        required
                                        maxLength={6}
                                        className="rounded-3xl border-2 border-gray-400 focus:border-red-500 w-full py-3 px-4 text-center text-lg font-mono tracking-widest transition-colors"
                                    />
                                    {errors.otp && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center">
                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                            {errors.otp}
                                        </p>
                                    )}
                                </div>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={sendOtp}
                                        className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                                    >
                                        Didn't receive code? Resend OTP
                                    </button>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-red-600 text-white font-semibold rounded-2xl py-3 hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                                    disabled={loading || otp.length !== 6}
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Verifying...
                                        </div>
                                    ) : (
                                        "Verify & Continue"
                                    )}
                                </Button>
                            </motion.form>
                        )}

                        {/* STEP 4: Success */}
                        {mode === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-center space-y-6 py-8"
                            >
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-800">
                                    {userExists ? "Welcome Back!" : "Account Created Successfully!"}
                                </h2>

                                <p className="text-gray-600">
                                    {userExists
                                        ? "You have been successfully logged in."
                                        : "Your account has been created successfully."
                                    }
                                </p>

                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <p className="text-sm text-gray-700">
                                        Redirecting to dashboard...
                                    </p>
                                </div>

                                <div className="flex justify-center">
                                    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </motion.div>
        </div>
    );
}