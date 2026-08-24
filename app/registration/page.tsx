"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import axiosInstance from "@/services/axiosInstance";

// --- TypeScript interface matching your form fields ---
interface FormData {
  // Personal Details
  fullName: string;
  fathersName: string;
  dateofbirth: string;
  age: string;
  martialStatus: string;
  mobileNo: string;
  address: string;
  fathersNo: string;
  parentIncome: string;
  parentOccupation: string;
  budget: string;

  // Interest
  courseSubject: string;
  experience: string;
  intake: string;
  levelOfStudy: string;
  bachelors: string;
  masters: string;

  // Country Preferences
  preference1: string;
  preference2: string;
  preference3: string;
  preference4: string;

  // Additional fields for API
  email?: string;
  city?: string;
}

const App: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      martialStatus: "",
      levelOfStudy: "",
      preference1: "",
      preference2: "",
      preference3: "",
      preference4: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // Get UTM source from URL
    const rawSource =
      new URLSearchParams(window.location.search)
        .get("utm_source")
        ?.toLowerCase() || "website";

    let finalSource = "website";

    if (["google", "googleads", "adwords"].includes(rawSource)) {
      finalSource = "googleAds";
    } else if (["meta", "instagram", "ig", "facebookads"].includes(rawSource)) {
      finalSource = "facebook";
    } else if (rawSource === "facebook") {
      finalSource = "facebook";
    }

    try {
      // Determine the primary country preference
      const primaryCountry = data.preference1 || data.preference2 || data.preference3 || data.preference4 || "";

      // Determine course/program
      const program = data.courseSubject || data.bachelors || data.masters || "studyPreference";

      // Determine intake
      const intakeValue = data.intake || "";

      const payload = {
        fullName: data.fullName,
        email: data.email || "", // Make email optional or add to form
        phone: String(data.mobileNo),
        source: rawSource,
        coursePreference: data.courseSubject || "studyPreference",
        city: data.city || "", // Make city optional or add to form
        extraDetails: {
          preferredCountry: primaryCountry,
          intake: intakeValue,
          program: program,
          grade: data.levelOfStudy || null,
          type: "study-preference",
          // Additional data from your form
          fathersName: data.fathersName,
          dateOfBirth: data.dateofbirth,
          age: data.age,
          maritalStatus: data.martialStatus,
          address: data.address,
          fathersNo: data.fathersNo,
          parentIncome: data.parentIncome,
          parentOccupation: data.parentOccupation,
          budget: data.budget,
          experience: data.experience,
          levelOfStudy: data.levelOfStudy,
          bachelors: data.bachelors,
          masters: data.masters,
          preference2: data.preference2,
          preference3: data.preference3,
          preference4: data.preference4,
        },
      };

      const response = await axiosInstance.post("/leads", payload);

      if (response?.data?.success) {
        Swal.fire({
          title: "Thank You",
          text: response.data.message || "Your preferences have been submitted successfully.",
          icon: "success",
        });

        reset();
      } else {
        Swal.fire({
          title: "Error",
          text: response.data?.message || "Something went wrong. Please try again.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Study preference lead error:", error);

      Swal.fire({
        title: "Error",
        text: "An error occurred. Please try again later.",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-24 mt-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Government Style */}
        <div className="mb-8 border-b-2 border-[#D71635] pb-4">
          <div className="flex justify-start gap-4 mb-2">
            <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">Gateway Abroad Education</h1>
          </div>
          <p className="text-xm text-gray-600 uppercase tracking-wider">
            (Confidential when filled) • All fields are mandatory
          </p>
        </div>

        {/* Form with Government Style */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border-2 border-gray-200 shadow-2xl"
        >
          {/* Form Header */}
          <div className="bg-[#D71635] text-white py-4 px-6">
            <h2 className="text-2xl font-bold uppercase tracking-wide">
              STUDENT APPLICATION FORM
            </h2>
            <p className="text-xm opacity-90 mt-1">Gateway Education Abroad Application</p>
          </div>

          {/* Form Body */}
          <div className="p-8">
            <div className="space-y-8">

              {/* Personal Details */}
              <div className="border-2 border-gray-200">
                <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                  <h3 className="font-bold text-gray-800">1. PERSONAL DETAILS</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Full Name <span className="text-[#D71635]">*</span>
                      </label>
                      <input
                        {...register("fullName", { required: "Full name is required" })}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                      {errors.fullName && (
                        <p className="text-[#D71635] text-xs mt-1 font-bold">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Date Of Birth <span className="text-[#D71635]">*</span>
                      </label>
                      <input
                        type="date"
                        {...register("dateofbirth", { required: "Date of birth is required" })}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                      {errors.dateofbirth && (
                        <p className="text-[#D71635] text-xs mt-1 font-bold">{errors.dateofbirth.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Age (in yrs.) <span className="text-[#D71635]">*</span>
                      </label>
                      <input
                        type="number"
                        {...register("age", {
                          required: "Age is required",
                          min: { value: 16, message: "Age must be at least 16" },
                          max: { value: 100, message: "Age must be less than 100" }
                        })}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                      {errors.age && (
                        <p className="text-[#D71635] text-xs mt-1 font-bold">{errors.age.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Marital Status
                      </label>
                      <div className="flex items-center gap-6 p-3 border-2 border-gray-300 bg-gray-50">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="Single"
                            {...register("martialStatus")}
                            className="w-4 h-4 text-[#D71635] focus:ring-[#D71635]"
                          />
                          <span className="font-medium">Single</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="Married"
                            {...register("martialStatus")}
                            className="w-4 h-4 text-[#D71635] focus:ring-[#D71635]"
                          />
                          <span className="font-medium">Married</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Mobile No. <span className="text-[#D71635]">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register("mobileNo", {
                          required: "Mobile number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Please enter a valid 10-digit mobile number"
                          }
                        })}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                      {errors.mobileNo && (
                        <p className="text-[#D71635] text-xs mt-1 font-bold">{errors.mobileNo.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        {...register("address")}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Father's Name
                      </label>
                      <input
                        {...register("fathersName")}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Father's No.
                      </label>
                      <input
                        type="tel"
                        {...register("fathersNo")}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Parent's Annual Income
                      </label>
                      <input
                        type="number"
                        {...register("parentIncome")}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Parent's Occupation
                      </label>
                      <input
                        {...register("parentOccupation")}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Budget (in ₹)
                      </label>
                      <input
                        type="number"
                        {...register("budget")}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-gray-200">
                <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                  <h3 className="font-bold text-gray-800">2. CONTACT INFORMATION</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...register("email", {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                        placeholder="student@example.com"
                      />
                      {errors.email && (
                        <p className="text-[#D71635] text-xs mt-1 font-bold">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        {...register("city")}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                        placeholder="Your city"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Interest */}
              <div className="border-2 border-gray-200">
                <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                  <h3 className="font-bold text-gray-800">3. COURSE INTEREST</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Course/Subject
                      </label>
                      <input
                        {...register("courseSubject")}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Experience
                      </label>
                      <input
                        {...register("experience")}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Intake
                      </label>
                      <select
                        {...register("intake")}
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      >
                        <option value="">Select Intake</option>
                        <option value="Spring 2025">Spring 2025</option>
                        <option value="Fall 2025">Fall 2025</option>
                        <option value="Summer 2025">Summer 2025</option>
                        <option value="Spring 2026">Spring 2026</option>
                        <option value="Fall 2026">Fall 2026</option>
                        <option value="Summer 2026">Summer 2026</option>
                        <option value="Spring 2027">Spring 2027</option>
                        <option value="Fall 2027">Fall 2027</option>
                        <option value="Summer 2027">Summer 2027</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Level of Study
                      </label>
                      <div className="flex items-center gap-6 p-3 border-2 border-gray-300 bg-gray-50">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="Bachelor's"
                            {...register("levelOfStudy", { required: "Please select level of study" })}
                            className="w-4 h-4 text-[#D71635] focus:ring-[#D71635]"
                          />
                          <span className="font-medium">Bachelor's</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="Master's"
                            {...register("levelOfStudy", { required: "Please select level of study" })}
                            className="w-4 h-4 text-[#D71635] focus:ring-[#D71635]"
                          />
                          <span className="font-medium">Master's</span>
                        </label>
                      </div>
                      {errors.levelOfStudy && (
                        <p className="text-[#D71635] text-xs mt-1 font-bold">{errors.levelOfStudy.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Bachelor's
                      </label>
                      <input
                        {...register("bachelors")}
                        placeholder="Bachelor's degree details"
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Masters
                      </label>
                      <input
                        {...register("masters")}
                        placeholder="Master's degree details"
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Country Preferences */}
              <div className="border-2 border-gray-200">
                <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                  <h3 className="font-bold text-gray-800">4. COUNTRY PREFERENCES</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Preference 1
                      </label>
                      <input
                        type="text"
                        {...register("preference1")}
                        placeholder="e.g., USA, UK, Canada"
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Preference 2
                      </label>
                      <input
                        type="text"
                        {...register("preference2")}
                        placeholder="e.g., Australia, Germany, Ireland"
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Preference 3
                      </label>
                      <input
                        type="text"
                        {...register("preference3")}
                        placeholder="e.g., Australia, Germany, Ireland"
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xm font-bold text-gray-700 mb-1">
                        Preference 4
                      </label>
                      <input
                        type="text"
                        {...register("preference4")}
                        placeholder="e.g., Australia, Germany, Ireland"
                        className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8 pt-6 border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-[#D71635] text-white font-bold uppercase tracking-wide hover:bg-[#b0122a] transition-colors ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>

            {/* Footer Note */}
            <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
              <p>GATEWAY ABROAD EDUCATION APPLICATION FORM</p>
              <p className="mt-1">All information provided is confidential and verified</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;