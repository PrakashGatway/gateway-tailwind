"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";

// --- TypeScript interface matching all fields from the image ---
interface FormData {
    // Choice of country (table)
    name: string;
    date: string;
    preference1: string;
    preference2: string;
    preference3: string;
    preference4: string;
    // Personal Details
    fullName: string
    dateofbirth: string
    age: string
    martialStatus: string
    mobileNo: string
    address: string
    fathersName: string;
    fathersNo: string;
    parentIncome: string
    parentOccupation: string
    budget: string
    // Interest In
    courseSubject: string;
    experience: string;
    intake: string;
    levelOfStudy: string;
    bachelors: string;
    masters: string;
    // Company / Work experience (2nd step)
    companyName: string;
    designation: string;
    totalExperience: string;
    // Education (2nd step)
    educationFrom: string;
    cbsc: string;
    ib: string;
    stateBoard: string;
    // Exam passed (school)
    schoolName: string;
    yearOfPassing: string;
    marksObtained: string;
    subject: string;
    // 12th Grade etc.
    grade12: string;
    bachelorsDegree: string;
    mastersDegree: string;
    doctorates: string;
    otherQualifications: string;
    // Any Test Given Before (3rd step) – checkboxes as booleans
    ielts: boolean;
    toefl: boolean;
    pte: boolean;
    gre: boolean;
    gmat: boolean;
    sat: boolean;
    oet: boolean;
    spokenEnglish: boolean;
    // Heard about us (3rd step)
    internet: string;
    advertisement: string;
    friend: string;
    other: string;
    counsellor: string;
}

const App: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<FormData>({
        defaultValues: {
            ielts: false,
            toefl: false,
            pte: false,
            gre: false,
            gmat: false,
            sat: false,
            oet: false,
            spokenEnglish: false,
        },
        mode: "onChange",
    });

    const [step, setStep] = useState<number>(1);

    const onSubmit = (data: FormData) => {
        console.log("Final Data:", data);
        alert("Form submitted! Check console.");
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-gray-100 py-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with Government Style */}
                <div className="mb-8 text-center border-b-2 border-[#D71635] pb-4">
                    <div className="flex justify-center items-center gap-4 mb-2">
                        <div className="w-16 h-16 bg-[#D71635] rounded-full flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">GA</span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">GATEWAY ABROAD</h1>
                    </div>
                    <p className="text-sm text-gray-600 uppercase tracking-wider">
                        (Confidential when filled) • All fields are mandatory
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                        {[1, 2, 3].map((i) => (
                            <React.Fragment key={i}>
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${step === i
                                            ? "bg-[#D71635] text-white border-[#D71635]"
                                            : step > i
                                                ? "bg-green-600 text-white border-green-600"
                                                : "bg-white text-gray-400 border-gray-300"
                                        }`}
                                >
                                    {step > i ? "✓" : i}
                                </div>
                                {i < 3 && (
                                    <div
                                        className={`w-20 h-1 ${step > i ? "bg-green-600" : "bg-gray-300"}`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form with Government Style */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white border-2 border-gray-200 shadow-2xl"
                >
                    {/* Form Header */}
                    <div className="bg-[#D71635] text-white py-4 px-6">
                        <h2 className="text-2xl font-bold uppercase tracking-wide">
                            {step === 1 && "SECTION A: COUNTRY PREFERENCE & PERSONAL DETAILS"}
                            {step === 2 && "SECTION B: WORK EXPERIENCE & EDUCATION"}
                            {step === 3 && "SECTION C: TESTS & REFERRAL"}
                        </h2>
                        <p className="text-sm opacity-90 mt-1">Gateway Education Abroad Application</p>
                    </div>

                    {/* Form Body */}
                    <div className="p-8">
                        {/* STEP 1 */}
                        {step === 1 && (
                            <div className="space-y-8">
                                {/* Choice of country table - Government style */}
                                <div className="border-2 border-gray-200">
                                    <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                                        <h3 className="font-bold text-gray-800">1. COUNTRY PREFERENCES</h3>
                                    </div>
                                    <div className="overflow-x-auto p-4">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="p-3 text-left font-bold text-gray-700 border">Country</th>
                                                    <th className="p-3 text-left font-bold text-gray-700 border">Date</th>
                                                    <th className="p-3 text-left font-bold text-gray-700 border">Preference 1</th>
                                                    <th className="p-3 text-left font-bold text-gray-700 border">Preference 2</th>
                                                    <th className="p-3 text-left font-bold text-gray-700 border">Preference 3</th>
                                                    <th className="p-3 text-left font-bold text-gray-700 border">Preference 4</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {["UK", "USA", "CANADA", "IRELAND"].map((country, idx) => (
                                                    <tr key={country} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                        <td className="p-3 font-bold border">{country}</td>
                                                        <td className="p-3 border">
                                                            <input
                                                                type="date"
                                                                {...register(`date_${country}` as any)}
                                                                className="w-full p-2 border border-gray-300 focus:border-[#D71635] focus:ring-1 focus:ring-[#D71635] outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-3 border">
                                                            <input
                                                                type="text"
                                                                {...register(`pref1_${country}` as any)}
                                                                className="w-full p-2 border border-gray-300 focus:border-[#D71635] outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-3 border">
                                                            <input
                                                                type="text"
                                                                {...register(`pref2_${country}` as any)}
                                                                className="w-full p-2 border border-gray-300 focus:border-[#D71635] outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-3 border">
                                                            <input
                                                                type="text"
                                                                {...register(`pref3_${country}` as any)}
                                                                className="w-full p-2 border border-gray-300 focus:border-[#D71635] outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-3 border">
                                                            <input
                                                                type="text"
                                                                {...register(`pref4_${country}` as any)}
                                                                className="w-full p-2 border border-gray-300 focus:border-[#D71635] outline-none"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Personal Details - Government style */}
                                <div className="border-2 border-gray-200">
                                    <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                                        <h3 className="font-bold text-gray-800">2. PERSONAL DETAILS</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Personal Details Fields */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Full Name <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    {...register("fullName", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                                {errors.fullName && (
                                                    <p className="text-[#D71635] text-xs mt-1 font-bold">REQUIRED</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Date Of Birth <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    {...register("dateofbirth", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                                {errors.dateofbirth && (
                                                    <p className="text-[#D71635] text-xs mt-1 font-bold">REQUIRED</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Age (in yrs.) <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    {...register("age", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                                {errors.age && (
                                                    <p className="text-[#D71635] text-xs mt-1 font-bold">REQUIRED</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Marital Status <span className="text-[#D71635]">*</span>
                                                </label>
                                                <div className="flex items-center gap-6 p-3 border-2 border-gray-300 bg-gray-50">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            value="Single"
                                                            {...register("martialStatus", { required: true })}
                                                            className="w-4 h-4 text-[#D71635] focus:ring-[#D71635]"
                                                        />
                                                        <span className="font-medium">Single</span>
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            value="Married"
                                                            {...register("martialStatus", { required: true })}
                                                            className="w-4 h-4 text-[#D71635] focus:ring-[#D71635]"
                                                        />
                                                        <span className="font-medium">Married</span>
                                                    </label>
                                                </div>
                                                {errors.martialStatus && (
                                                    <p className="text-[#D71635] text-xs mt-1 font-bold">REQUIRED</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Mobile No. <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    {...register("mobileNo", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                                {errors.mobileNo && (
                                                    <p className="text-[#D71635] text-xs mt-1 font-bold">REQUIRED</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Address <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    {...register("address", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                                {errors.address && (
                                                    <p className="text-[#D71635] text-xs mt-1 font-bold">REQUIRED</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Father's Name <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    {...register("fathersName", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                                {errors.fathersName && (
                                                    <p className="text-[#D71635] text-xs mt-1 font-bold">REQUIRED</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Father's No. <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    {...register("fathersNo", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                                {errors.fathersNo && (
                                                    <p className="text-[#D71635] text-xs mt-1 font-bold">REQUIRED</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Parent's Annual Income <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    {...register("parentIncome", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                                {errors.parentIncome && (
                                                    <p className="text-[#D71635] text-xs mt-1 font-bold">REQUIRED</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Parent's Occupation <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    {...register("parentOccupation", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                                {errors.parentOccupation && (
                                                    <p className="text-[#D71635] text-xs mt-1 font-bold">REQUIRED</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Budget (in ₹) <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    {...register("budget", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                                {errors.budget && (
                                                    <p className="text-[#D71635] text-xs mt-1 font-bold">REQUIRED</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Interest In */}
                                <div className="border-2 border-gray-200">
                                    <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                                        <h3 className="font-bold text-gray-800">3. COURSE INTEREST</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Course/Subject <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    {...register("courseSubject", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Experience <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    {...register("experience", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Intake <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    {...register("intake", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Level of Study <span className="text-[#D71635]">*</span>
                                                </label>
                                                <input
                                                    {...register("levelOfStudy", { required: true })}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Bachelor's
                                                </label>
                                                <input
                                                    {...register("bachelors")}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                                    Masters
                                                </label>
                                                <input
                                                    {...register("masters")}
                                                    className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2 - Similar government styling for other steps */}
                        {step === 2 && (
                            <div className="space-y-8">
                                <div className="border-2 border-gray-200">
                                    <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                                        <h3 className="font-bold text-gray-800">4. WORK EXPERIENCE</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Company Name</label>
                                                <input {...register("companyName")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Designation</label>
                                                <input {...register("designation")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Total Experience (yrs)</label>
                                                <input type="number" {...register("totalExperience")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-2 border-gray-200">
                                    <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                                        <h3 className="font-bold text-gray-800">5. EDUCATION DETAILS</h3>
                                    </div>
                                    <div className="p-6">
                                        {/* Education fields with same styling */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Education From</label>
                                                <input {...register("educationFrom")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">CBSC</label>
                                                <input {...register("cbsc")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">IB</label>
                                                <input {...register("ib")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">State Board</label>
                                                <input {...register("stateBoard")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">School/College Name</label>
                                                <input {...register("schoolName")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Year of Passing</label>
                                                <input type="number" {...register("yearOfPassing")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Marks Obtained (%)</label>
                                                <input type="number" step="0.01" {...register("marksObtained")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                                                <input {...register("subject")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-2 border-gray-200">
                                    <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                                        <h3 className="font-bold text-gray-800">6. HIGHER EDUCATION</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">12th Grade</label>
                                                <input {...register("grade12")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Bachelors Degree</label>
                                                <input {...register("bachelorsDegree")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Masters Degree</label>
                                                <input {...register("mastersDegree")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Doctorates</label>
                                                <input {...register("doctorates")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Other qualifications</label>
                                                <input {...register("otherQualifications")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <div className="space-y-8">
                                <div className="border-2 border-gray-200">
                                    <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                                        <h3 className="font-bold text-gray-800">7. TESTS GIVEN</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                "ielts", "toefl", "pte", "gre",
                                                "gmat", "sat", "oet", "spokenEnglish",
                                            ].map((test) => (
                                                <label key={test} className="flex items-center gap-3 p-3 border-2 border-gray-200 hover:border-[#D71635] cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register(test as keyof FormData)}
                                                        className="w-5 h-5 text-[#D71635] focus:ring-[#D71635]"
                                                    />
                                                    <span className="font-medium uppercase">{test === "spokenEnglish" ? "SPOKEN ENGLISH" : test}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-2 border-gray-200">
                                    <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                                        <h3 className="font-bold text-gray-800">8. HOW DID YOU HEAR ABOUT US?</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Internet</label>
                                                <input {...register("internet")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Advertisement</label>
                                                <input {...register("advertisement")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Friend</label>
                                                <input {...register("friend")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Other</label>
                                                <input {...register("other")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Counsellor</label>
                                                <input {...register("counsellor")} className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons - Government style */}
                        <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-200">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={step === 1}
                                className={`px-8 py-3 font-bold uppercase tracking-wide ${step === 1
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-600 text-white hover:bg-gray-700"
                                    }`}
                            >
                                ← Previous
                            </button>

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-8 py-3 bg-[#D71635] text-white font-bold uppercase tracking-wide hover:bg-[#b0122a]"
                                >
                                    Next Section →
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-green-700 text-white font-bold uppercase tracking-wide hover:bg-green-800"
                                >
                                    Submit Application
                                </button>
                            )}
                        </div>

                        {/* Footer Note */}
                        <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
                            <p>GATEWAY ABROAD EDUCATION ABROAD APPLICATION FORM</p>
                            <p className="mt-1">All information provided is confidential and verified</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default App;