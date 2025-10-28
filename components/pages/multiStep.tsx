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
    <section className="relative bg-white py-12 mx-2 overflow-hidden">
      {/* Background blur effect */}
      {/* <div className="absolute inset-0 backdrop-blr-sm opacity-40"></div> */}

      <div className="relative z-10">
        <h3 className="sub-heading !text-black mx-auto font-semibold !text-center mb-16 pb-6 px-4">
          Let's calculate your chances of getting into your dream University
        </h3>

        {/* Inner container with background image and glassmorphism */}
        <div
          className="bg-pink-100 relative mx-auto max-w-7xl sm:px-6 lg:px-6 py-8 backdrop-blu rounded-3xl  border border-white/30 overflow-hidden"
          style={{
            // backgroundImage: `url('/anime/form.webp')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "bottom center",
            backgroundSize: "cover",
          }}
        >
          {/* Glassmorphism overlay */}
          {/* <div className="absolute inset-0 backdrop-blur-[0px] bg-white/0"></div> */}

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-6 gap-8 items-center">
            {/* Form: 4.5 out of 6 columns = 75% */}
            <div className="md:col-span-4">
              <div className="mb-1">
                <div className="flex mb-1 justify-center">
                  {steps.map((_, index) => {
                    const Icon = stepIcons[index]
                    return (
                      <div key={index} className="flex items-center">
                        <motion.div
                          initial={false}
                          animate={{
                            scale: step === index ? 1.05 : 1,
                            backgroundColor: step >= index ? "#D71635" : "#D71635",
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md ${step >= index ? "bg-pink-500" : "bg-gray-300"
                            }`}
                        >
                          {step > index ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                        </motion.div>
                        {index < steps.length - 1 && (
                          <motion.div
                            initial={false}
                            animate={{
                              backgroundColor: step > index ? "#ec4848ff" : "#c9b29eff",
                            }}
                            className="w-4 md:w-12 h-0.5 mx-2 rounded-full"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Form Content with Glassmorphism */}
              <div className="backdrop-blur-[1px] bg-white/0 rounded-2xl p-6  border-white/0 shadow-3xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {step === 0 && (
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold mb-4 !text-black">
                            What is your desired academic course?
                          </h2>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {courses.map((course, index) => (
                              <motion.label
                                key={course}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`group relative p-3 border rounded-lg text-center cursor-pointer transition-all duration-200 backdrop-blur-sm ${watch("course") === course
                                  ? "bg-[#D71635] border-red-600 text-white shadow-lg"
                                  : "bg-white/80 border-black hover:bg-white/80 hover:shadow-md"
                                  }`}
                              >
                                <input
                                  type="radio"
                                  value={course}
                                  {...register("course")}
                                  className="hidden"
                                />
                                <div className="font-medium text-lg">{course}</div>
                              </motion.label>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 1 && (
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Which country do you want to go to?
                          </h2>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {countries.map((country, index) => (
                              <motion.label
                                key={country}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`group relative p-3 border rounded-lg text-center cursor-pointer transition-all duration-200 backdrop-blur-sm ${watch("country") === country
                                  ? "bg-[#D71635] border-red-600 text-white shadow-lg"
                                  : "bg-white/80 border-black hover:bg-white/60 hover:shadow-md"
                                  }`}
                              >
                                <input
                                  type="radio"
                                  value={country}
                                  {...register("country")}
                                  className="hidden"
                                />
                                <div className="font-medium">{country}</div>
                              </motion.label>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold mb-4 text-gray-800">Preferred Intake Month?</h2>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {intakes.map((month, index) => (
                              <motion.label
                                key={month}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`group relative p-3 border rounded-lg text-center cursor-pointer transition-all duration-200 backdrop-blur-sm ${watch("intake") === month
                                  ? "bg-[#D71635] border-red-600 text-white shadow-lg"
                                  : "bg-white/80 border-black hover:bg-white/60 hover:shadow-md"
                                  }`}
                              >
                                <input
                                  type="radio"
                                  value={month}
                                  {...register("intake")}
                                  className="hidden"
                                />
                                <div className="font-medium">{month}</div>
                              </motion.label>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {[
                              {
                                name: "name",
                                label: "Full Name",
                                type: "text",
                                validation: { required: "Name is required" },
                              },
                              {
                                name: "city",
                                label: "City",
                                type: "text",
                                validation: { required: "City is required" },
                              },
                              {
                                name: "mobile",
                                label: "Mobile",
                                type: "text",
                                validation: {
                                  required: "Mobile is required",
                                  pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
                                },
                              },
                              {
                                name: "email",
                                label: "Email",
                                type: "email",
                                validation: {
                                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                                },
                              },
                            ].map((field, index) => (
                              <motion.div
                                key={field.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className=""
                              >
                                <label className="block text-sm font-medium  mb-1">{field.label}</label>
                                <input
                                  type={field.type}
                                  {...register(field.name, field.validation)}
                                  className="w-full p-2 rounded-lg px-3 backdrop-blur-sm bg-white/90 focus:bg-white/80 border border-pink-400 focus:outline-none focus:border-pink-400 transition-all duration-200 shadow"
                                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                                />
                                {/* {errors[field.name] && (
                                  <p className="text-red-600 text-xs">{errors[field.name].message}</p>
                                )} */}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-6">
                    {step > 0 ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={onBack}
                        className="flex items-center px-6 py-2 btn-secondary transition-colors duration-200"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
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
                        className="flex items-center ml-auto px-6 py-2 btn-primary transition-colors duration-200"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex items-center ml-auto px-6 py-2 btn-primary transition-colors duration-200"
                      >
                        Submit
                        <Check className="w-4 h-4 ml-1" />
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="md:col-span-2 hidden md:flex justify-center relative">
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <div className="w-[260px] h-full bg-white opacity-20 blur-2xl rounded-full"></div>
              </div>

              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                src="/anime/formsid.png"
                alt="University Illustration"
                className="max-w-[460px] h-auto object-contain drop-shadow-xl relative z-10"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
