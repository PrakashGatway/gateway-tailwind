"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, ChevronLeft, Check, User, MapPin, Calendar, GraduationCap } from "lucide-react"
import PageServices from "@/services/PageServices"
import Swal from 'sweetalert2'

const steps = ["course", "country", "intake", "details"]
const courses = ["UG", "PG", "PHD"]
const countries = ["UK", "USA", "Canada", "Australia"]
const intakes = ["Jan 2026", "May 2026", "September", "Nov 2026"]

const stepIcons = [GraduationCap, MapPin, Calendar, User]

export default function EnhancedMultiStepForm() {
  const [step, setStep] = useState(0)
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    reset
  } = useForm({ mode: "onChange" })

  const onNext = async () => {
    const valid = await trigger()
    if (valid) setStep((prev) => prev + 1)
  }

  const onBack = () => setStep((prev) => prev - 1)

  const onSubmit = async (data: any) => {
    const formatData = {
      name: data.name,
      email: data.email,
      phone: data.mobile,
      program: data.course,
      grade: null,
      city: data.city,
      perferedCountry: data.country,
      study: data.intake,
    }
    let response = await PageServices.newPreferences(formatData)
    Swal.fire({
      title: "Thank You",
      text: response.message,
      icon: "success"
    });
    reset()
    setStep(0)
  }

  return (
    <section className="relative bg-white py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h6 className="text-xl sm:text-2xl lg:text-2xl !text-black mx-auto font-semibold !text-center mb-8 sm:mb-12 lg:mb-16 pb-4 sm:pb-6">
          Let's calculate your chances of getting into your dream University
        </h6>

        {/* Main Form Container */}
        <div className="bg-pink-100 relative mx-auto w-full rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/30 overflow-hidden px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 sm:gap-8 items-center">
            
            {/* Form Section - Full width on mobile/tablet, 4 cols on desktop */}
            <div className="lg:col-span-4">
              
              {/* Progress Steps */}
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-center">
                  {steps.map((_, index) => {
                    const Icon = stepIcons[index]
                    return (
                      <div key={index} className="flex items-center">
                        {/* Step Circle */}
                        <motion.div
                          initial={false}
                          animate={{
                            scale: step === index ? 1.05 : 1,
                            backgroundColor: step >= index ? "#D71635" : "#D1D5DB",
                          }}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md ${
                            step >= index ? "bg-[#D71635]" : "bg-gray-300"
                          }`}
                        >
                          {step > index ? (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </motion.div>
                        
                        {/* Step Connector */}
                        {index < steps.length - 1 && (
                          <motion.div
                            initial={false}
                            animate={{
                              backgroundColor: step > index ? "#ec4848ff" : "#D1D5DB",
                            }}
                            className="w-4 sm:w-6 lg:w-8 h-1 mx-1 sm:mx-2 rounded-full"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Form Content */}
              <div className="bg-white/0 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-white/0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      
                      {/* Step 1: Course Selection */}
                      {step === 0 && (
                        <div className="space-y-4">
                          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 !text-black text-center sm:text-left">
                            What is your desired academic course?
                          </h2>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                            {courses.map((course, index) => (
                              <motion.label
                                key={course}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`group relative p-3 sm:p-4 border-2 rounded-lg text-center cursor-pointer transition-all duration-200 ${
                                  watch("course") === course
                                    ? "bg-[#D71635] border-[#D71635] text-white shadow-lg"
                                    : "bg-white border-gray-300 hover:bg-gray-50 hover:shadow-md hover:border-gray-400"
                                }`}
                              >
                                <input
                                  type="radio"
                                  value={course}
                                  {...register("course", { required: "Please select a course" })}
                                  className="hidden"
                                />
                                <div className="font-medium text-sm sm:text-base lg:text-lg">{course}</div>
                              </motion.label>
                            ))}
                          </div>
                          {errors.course && (
                            <p className="text-red-600 text-sm text-center sm:text-left mt-2">
                              {errors.course.message as string}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Step 2: Country Selection */}
                      {step === 1 && (
                        <div className="space-y-4">
                          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-gray-800 text-center sm:text-left">
                            Which country do you want to go to?
                          </h2>
                          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                            {countries.map((country, index) => (
                              <motion.label
                                key={country}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`group relative p-3 sm:p-4 border-2 rounded-lg text-center cursor-pointer transition-all duration-200 ${
                                  watch("country") === country
                                    ? "bg-[#D71635] border-[#D71635] text-white shadow-lg"
                                    : "bg-white border-gray-300 hover:bg-gray-50 hover:shadow-md hover:border-gray-400"
                                }`}
                              >
                                <input
                                  type="radio"
                                  value={country}
                                  {...register("country", { required: "Please select a country" })}
                                  className="hidden"
                                />
                                <div className="font-medium text-sm sm:text-base">{country}</div>
                              </motion.label>
                            ))}
                          </div>
                          {errors.country && (
                            <p className="text-red-600 text-sm text-center sm:text-left mt-2">
                              {errors.country.message as string}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Step 3: Intake Selection */}
                      {step === 2 && (
                        <div className="space-y-4">
                          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-gray-800 text-center sm:text-left">
                            Preferred Intake Month?
                          </h2>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            {intakes.map((month, index) => (
                              <motion.label
                                key={month}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`group relative p-3 sm:p-4 border-2 rounded-lg text-center cursor-pointer transition-all duration-200 ${
                                  watch("intake") === month
                                    ? "bg-[#D71635] border-[#D71635] text-white shadow-lg"
                                    : "bg-white border-gray-300 hover:bg-gray-50 hover:shadow-md hover:border-gray-400"
                                }`}
                              >
                                <input
                                  type="radio"
                                  value={month}
                                  {...register("intake", { required: "Please select an intake month" })}
                                  className="hidden"
                                />
                                <div className="font-medium text-sm sm:text-base">{month}</div>
                              </motion.label>
                            ))}
                          </div>
                          {errors.intake && (
                            <p className="text-red-600 text-sm text-center sm:text-left mt-2">
                              {errors.intake.message as string}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Step 4: Personal Details */}
                      {step === 3 && (
                        <div className="space-y-4">
                          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-center sm:text-left">
                            Basic Details
                          </h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {[
                              {
                                name: "name",
                                label: "Full Name",
                                type: "text",
                                validation: { required: "Name is required" },
                                colSpan: "sm:col-span-2"
                              },
                              {
                                name: "city",
                                label: "City",
                                type: "text",
                                validation: { required: "City is required" },
                                colSpan: ""
                              },
                              {
                                name: "mobile",
                                label: "Mobile",
                                type: "tel",
                                validation: {
                                  required: "Mobile is required",
                                  pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
                                },
                                colSpan: ""
                              },
                              {
                                name: "email",
                                label: "Email",
                                type: "email",
                                validation: {
                                  required: "Email is required",
                                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                                },
                                colSpan: "sm:col-span-2"
                              },
                            ].map((field, index) => (
                              <motion.div
                                key={field.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={field.colSpan}
                              >
                                <label className="block text-sm sm:text-base font-medium mb-1 sm:mb-2 text-gray-700">
                                  {field.label}
                                </label>
                                <input
                                  type={field.type}
                                  {...register(field.name, field.validation)}
                                  className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D71635] focus:ring-2 focus:ring-[#D71635]/20 transition-all duration-200 bg-white text-sm sm:text-base"
                                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                                />
                                {errors[field.name] && (
                                  <p className="text-red-600 text-xs sm:text-sm mt-1">
                                    {errors[field.name]?.message as string}
                                  </p>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-4 sm:pt-6">
                    {step > 0 ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={onBack}
                        className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm sm:text-base font-medium"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2" />
                        Back
                      </motion.button>
                    ) : (
                      <div></div>
                    )}

                    {step < steps.length - 1 ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={onNext}
                        className="flex items-center px-6 sm:px-8 py-2 sm:py-3 bg-[#D71635] text-white rounded-lg hover:bg-[#c11430] transition-colors duration-200 text-sm sm:text-base font-medium ml-auto"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1 sm:ml-2" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex items-center px-6 sm:px-8 py-2 sm:py-3 bg-[#D71635] text-white rounded-lg hover:bg-[#c11430] transition-colors duration-200 text-sm sm:text-base font-medium ml-auto"
                      >
                        Submit
                        <Check className="w-4 h-4 ml-1 sm:ml-2" />
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Image Section - Hidden on mobile & tablet, shown on desktop */}
            <div className="lg:col-span-2 hidden lg:flex justify-center relative">
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <div className="w-48 h-48 bg-white opacity-20 blur-2xl rounded-full"></div>
              </div>

              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                src="/anime/formsid.png"
                alt="University Illustration"
                className="w-full max-w-[300px] xl:max-w-[360px] h-auto object-contain drop-shadow-xl relative z-10"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}