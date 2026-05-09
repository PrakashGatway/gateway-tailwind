// components/forms/ContactForm.jsx
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/services/axiosInstance';
import { useParams } from 'next/navigation';

export default function ContactForm({ type }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const {slug} = useParams()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            programLevel: '',
            city: '',
            message: ''
        }
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Get source from URL params (SSR-safe)
            const rawSource =
                typeof window !== 'undefined'
                    ? new URLSearchParams(window.location.search)
                        .get("utm_source")
                        ?.toLowerCase() || "website"
                    : "website";

            const response = await axiosInstance.post('/leads', {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                source: rawSource,
                coursePreference: data.programLevel || "unfilled",
                city: data.city,
                extraDetails: {
                    programLevel: data.programLevel,
                    type: 'contact',
                    message: data.message
                }
            });

            if (response.data.success) {
                setIsSuccess(true);
                reset();
                // Auto-hide success message after 5 seconds
                setTimeout(() => setIsSuccess(false), 5000);
            } else {
                setSubmitError(response.data.message || 'Submission failed. Please try again.');
            }
        } catch (error) {
            console.error("Error submitting contact form:", error);
            setSubmitError(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ✅ Success Step (within same boundary)
    if (isSuccess) {
        return (
            <div className="w-full max-w-2xl border-4 border-gray-300 bg-white backdrop-blur-sm rounded-3xl shadow-lg p-6">
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
                    <p className="text-gray-600 mb-4">Your details have been submitted successfully.</p>
                    <p className="text-sm text-gray-500">Our counsellor will contact you within 24 hours.</p>
                    <button
                        type="button"
                        onClick={() => setIsSuccess(false)}
                        className="mt-6 px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-green-700 flex items-center gap-2"
                    >
                        Submit Another ✓
                    </button>
                </div>
            </div>
        );
    }

    // ✅ Main Form (UI preserved exactly as provided)
    return (
        <div className="w-full relatvie max-w-2xl  overflow-hidden border border-gray-500  bg-gray-50 backdrop-blur-sm rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-red-700">Contact Details</h2>
            <p className="text-gray-500 text-sm mb-3">Please provide your contact information</p>

            <p className='absolute -top-[1px] rounded-bl-3xl -right-1 border bg-red-500 text-white font-semibold px-4 text-sm py-3'>
                Free Counselling
            </p>

            {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        {...register("fullName", { required: "Full name is required" })}
                        className={`w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none ${errors.fullName ? 'border-red-500' : ''}`}
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address"
                            }
                        })}
                        className={`w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Phone */}
                {type != "article" && <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        placeholder="Enter your 10-digit mobile number"
                        {...register("phone", {
                            required: "Phone number is required",
                            pattern: {
                                value: /^\d{10}$/,
                                message: "Please enter a valid 10-digit mobile number"
                            }
                        })}
                        className={`w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                </div>}

              

                {/* Program Level + City Grid */}
                <div className="grid grid-cols-2 gap-2">
                    {type === "article" ? <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            placeholder="Enter your 10-digit mobile number"
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: "Please enter a valid 10-digit mobile number"
                                }
                            })}
                            className={`w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none ${errors.phone ? 'border-red-500' : ''}`}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                        )}
                    </div> : <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Preferred Program level *
                        </label>
                        <select
                            {...register("programLevel", { required: "Please select a program level" })}
                            className={`w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none ${errors.programLevel ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select</option>
                            <option value="Undergraduate">Undergraduate(UG)</option>
                            <option value="Postgraduate">Postgraduate(PG)</option>
                            <option value="PhD">PhD</option>
                            <option value="Diploma">Diploma</option>
                            {/* <option value="10th">10th</option>
                            <option value="12th">12th</option> */}
                        </select>
                        {errors.programLevel && (
                            <p className="text-red-500 text-xs mt-1">{errors.programLevel.message}</p>
                        )}
                    </div>}


                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Destination *
                        </label>
                        <select
                            {...register("destination", { required: "Please select a destination" })}
                            className={`w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none ${errors.destination ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Usa">Usa</option>
                            <option value="Germany">Germany</option>
                            <option value="Australia">Australia</option>
                            <option value="Canada">Canada</option>
                            <option value="Dubai">Dubai</option>
                            <option value="France">France</option>
                            <option value="Dubai">Dubai</option>
                            <option value="New Zealand">New Zealand</option>


                            
                        </select>
                        {errors.destination && (
                            <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your city"
                            {...register("city")}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                    </div>
                </div>
                {type === "article" && <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your message"
                        {...register("message")}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                </div>}

                {/* Submit Button */}
                <div className="flex items-center justify-center pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 rounded-full bg-red-600 text-white font-semibold  flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed "
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            "Connect to an expert now ✓"
                        )}
                    </button>
                </div>

                <p className="text-center text-xs text-gray-500 pt-1">
                    Our counsellor will contact you within 24 hours
                </p>
            </form>
        </div>
    );
}