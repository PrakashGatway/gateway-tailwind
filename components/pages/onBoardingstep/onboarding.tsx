"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Search, MapPin, ChevronDown, User, Mail, Phone, Home, Globe, Loader2 } from "lucide-react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { ProgressBar } from "./progressBar";
import axiosInstance from "@/services/axiosInstance";

// --- Animation Variants ---
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.06, type: "spring", stiffness: 300, damping: 24 },
  }),
};

const slideIn = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.25 } },
};

// --- Mock Data ---
const COUNTRIES_DATA = [
  { value: "usa", label: "USA", image: "https://flagcdn.com/w40/us.png" },
  { value: "uk", label: "UK", image: "https://flagcdn.com/w40/gb.png" },
  { value: "canada", label: "Canada", image: "https://flagcdn.com/w40/ca.png" },
  { value: "australia", label: "Australia", image: "https://flagcdn.com/w40/au.png" },
  { value: "germany", label: "Germany", image: "https://flagcdn.com/w40/de.png" },
  { value: "france", label: "France", image: "https://flagcdn.com/w40/fr.png" },
];

const STUDY_FIELDS = [
  { name: "major", label: "Field of Study", options: ["Engineering", "Business", "Medicine", "Arts", "Science"] },
  { name: "specialization", label: "Specialization (Optional)", options: ["Computer Science", "Mechanical", "Marketing", "Finance"] },
];

const STUDY_LEVELS = [
  { value: "bachelors", label: "Bachelor's Degree", icon: "🎓" },
  { value: "masters", label: "Master's Degree", icon: "📜" },
  { value: "phd", label: "PhD / Doctorate", icon: "🔬" },
  { value: "diploma", label: "Diploma / Certificate", icon: "📝" },
];

const NATIONALITIES = [
  { value: "in", label: "India" },
  { value: "cn", label: "China" },
  { value: "ng", label: "Nigeria" },
  { value: "pk", label: "Pakistan" },
  { value: "bd", label: "Bangladesh" },
  { value: "other", label: "Other" },
];

// --- Form Default Values & Validation Schema ---
const defaultValues = {
  // Personal Info (Step 7)
  

  // Study Preferences
  countryInterested: "",
  studyPreference_major: "",
  studyPreference_specialization: "",
  studyLevel: "",
  nationality: "",

  // English Proficiency
  englishProficiency: "",
  englishTestType: "",
  ieltsScore: "",

  // Financial
  financialFunds: 5000,
};

// Validation rules
const validationRules = {
  fullName: { required: "Full name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } },
  email: {
    required: "Email is required",
    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
  },
  phone: {
    required: "Phone number is required",
    pattern: { value: /^\+?[\d\s\-\(\)]{10,}$/, message: "Please enter a valid phone number" }
  },
  city: { required: "city is required" },
  currentCountry: { required: "Please select your country" },
  countryInterested: { required: "Please select a country" },
  studyPreference_major: { required: "Please select a field of study" },
  studyLevel: { required: "Please select a study level" },
  nationality: { required: "Please select your nationality" },
  englishProficiency: { required: "Please select an option" },
  financialFunds: { required: "Please set your budget", min: 1000, max: 100000 },
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const totalSteps = 8;

  // --- React Hook Form Setup ---
  const methods = useForm<typeof defaultValues>({
    defaultValues,
    mode: "onBlur",
  });

  const { handleSubmit, watch, setValue, control, formState: { errors } } = methods;

  // --- API Submission Handler using axiosInstance ---
  const onSubmit = async (data: typeof defaultValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const {
  fullName,
  email,
  phone,
  city,
  ...restData
} = data;

      const payload = {
  fullName,
  email,
  phone,
  city,
  source: "website",
  extraDetails: {
    type: "study abroad",
    ...restData, // ✅ only non-personal fields
    submittedAt: new Date().toISOString(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  },
};
      const response = await axiosInstance.post("/leads",payload )
       

      


      // Proceed to success step
      setCurrentStep(7);

    } catch (error: any) {
      console.error("❌ Submission error:", error);

      // Handle axios error responses
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

      setSubmitError(errorMessage);

      // Optional: Show toast notification
      // toast.error(errorMessage);

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    // Fields to validate per step
    const stepFields: Record<number, (keyof typeof defaultValues)[]> = {
      0: ["countryInterested"],
      1: ["studyPreference_major"],
      2: ["studyLevel"],
      3: ["nationality"],
      4: ["englishProficiency"],
      5: ["financialFunds"],
      6: ["fullName", "email", "phone", "address", "currentCountry"],
    };

    const fieldsToValidate = stepFields[currentStep] || [];

    // Trigger validation for current step fields only
    const result = await methods.trigger(fieldsToValidate);

    if (result && currentStep < totalSteps - 1) {
      // If on last form step (Personal Info), submit the form
      if (currentStep === 6) {
        await handleSubmit(onSubmit)();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // --- Step Renderers ---

  // 0. Country Selection
  const renderCountryStep = () => {
    const selected = watch("countryInterested");

    return (
      <div className="space-y-6">
        <div className="rounded-2xl overflow-hidden relative h-36">
          <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800" alt="Travel" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
            <h2 className="text-white font-bold text-xl">Where do you want to study?</h2>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {COUNTRIES_DATA.map((opt, i) => (
            <motion.div
              key={opt.value}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setValue("countryInterested", opt.value, { shouldValidate: true, shouldDirty: true })}
              className={`flex flex-col items-center justify-center h-28 rounded-2xl border-2 cursor-pointer transition-all ${selected === opt.value
                  ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-200"
                  : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
            >
              <img src={opt.image} className="w-10 h-10 rounded-sm mb-2 object-cover" alt={opt.label} />
              <span className="text-sm font-medium text-gray-800">{opt.label}</span>
            </motion.div>
          ))}
        </div>
        {errors.countryInterested && (
          <p className="text-sm text-red-500 text-center -mt-4">{errors.countryInterested.message}</p>
        )}
      </div>
    );
  };

  // 1. Study Field
  const renderStudyFieldStep = () => (
    <div className="space-y-6">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-lg shrink-0">🎓</div>
        <div>
          <h2 className="font-bold text-lg text-gray-900">What do you want to study?</h2>
          <p className="text-sm text-gray-500">Select your preferred field.</p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden h-32">
        <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800" alt="Study" className="w-full h-full object-cover" />
      </div>

      <div className="space-y-4">
        {STUDY_FIELDS.map((studyField, idx) => {  // ← Renamed to "studyField" for clarity
          const fieldName = `studyPreference_${studyField.name}` as keyof typeof defaultValues;
          return (
            <motion.div
              key={studyField.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
            >
              <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">
                {studyField.label}
              </label>
              <div className="relative border-2 border-gray-200 rounded-xl focus-within:border-blue-500 transition-colors bg-white">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Controller
                  name={fieldName}
                  control={control}
                  rules={validationRules[fieldName]}
                  render={({ field: formField }) => (  // ← Renamed RHF field to "formField"
                    <select
                      {...formField}  // ← Use formField here
                      value={formField.value || ""}
                      className="w-full pl-9 pr-8 py-3 text-sm bg-transparent outline-none appearance-none rounded-xl text-gray-800 cursor-pointer"
                    >
                      <option value="">Select {studyField.label}</option>  // ← Use studyField.label
                      {studyField.options.map((opt, i) => (  // ← Use studyField.options
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors[fieldName] && (
                <p className="text-xs text-red-500 mt-1 ml-1">
                  {(errors[fieldName] as { message?: string })?.message}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // 2. Study Level
  const renderStudyLevelStep = () => {
    const selected = watch("studyLevel");

    return (
      <div className="space-y-6">
        <div className="rounded-2xl overflow-hidden h-36">
          <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800" alt="Level" className="w-full h-full object-cover" />
        </div>

        <h2 className="text-xl font-bold text-gray-900">Select Study Level</h2>

        <div className="space-y-3">
          {STUDY_LEVELS.map((opt, i) => (
            <motion.div
              key={opt.value}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setValue("studyLevel", opt.value, { shouldValidate: true, shouldDirty: true })}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all bg-white ${selected === opt.value
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-blue-300"
                }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${selected === opt.value ? "bg-blue-100" : "bg-gray-100"
                }`}>
                {opt.icon}
              </div>
              <span className="font-medium text-gray-800 flex-1">{opt.label}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selected === opt.value ? "border-blue-600 bg-blue-600" : "border-gray-300"
                }`}>
                {selected === opt.value && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className="w-3.5 h-3.5 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {errors.studyLevel && (
          <p className="text-sm text-red-500 text-center">{errors.studyLevel.message}</p>
        )}
      </div>
    );
  };

  // 3. Nationality
  const renderNationalityStep = () => {
    const selected = watch("nationality");

    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-lg shrink-0">🌍</div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">Your Nationality</h2>
            <p className="text-sm text-gray-500">This helps us determine visa requirements.</p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden h-40">
          <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800" alt="World" className="w-full h-full object-cover" />
        </div>

        <div className="relative">
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Select Country of Passport</label>
          <div className="relative border-2 border-gray-200 rounded-xl focus-within:border-blue-500 bg-white">
            <Controller
              name="nationality"
              control={control}
              rules={validationRules.nationality}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 text-sm bg-transparent outline-none appearance-none rounded-xl text-gray-800"
                >
                  <option value="">Select your nationality</option>
                  {NATIONALITIES.map((n) => (
                    <option key={n.value} value={n.value}>{n.label}</option>
                  ))}
                </select>
              )}
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.nationality && (
            <p className="text-xs text-red-500 mt-1">{errors.nationality.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <MapPin className="w-4 h-4" />
          <span>Location auto-detected based on IP. You can change this above.</span>
        </div>
      </div>
    );
  };

  // 4. English Proficiency
  const renderEnglishStep = () => {
    const selected = watch("englishProficiency");

    return (
      <div className="space-y-6">
        <div className="rounded-2xl overflow-hidden h-40">
          <img src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="English Test" />
        </div>

        <div>
          <h2 className="font-bold text-xl text-gray-900">English Proficiency</h2>
          <p className="text-sm text-gray-500 mt-1">Have you taken an English proficiency test?</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {["yes", "no"].map((val) => (
            <motion.button
              type="button"
              key={val}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setValue("englishProficiency", val, { shouldValidate: true, shouldDirty: true })}
              className={`border-2 rounded-2xl py-5 text-sm font-semibold transition-all capitalize ${selected === val
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md"
                  : "border-gray-200 text-gray-500 hover:border-blue-300 bg-white"
                }`}
            >
              {val}
            </motion.button>
          ))}
        </div>
        {errors.englishProficiency && (
          <p className="text-sm text-red-500 text-center">{errors.englishProficiency.message}</p>
        )}

        <AnimatePresence>
          {selected === "yes" && (
            <motion.div
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4 overflow-hidden bg-gray-50 p-4 rounded-xl"
            >
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Test Type</label>
                <Controller
                  name="englishTestType"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-sm bg-white"
                    >
                      <option value="">Select Test</option>
                      <option value="ielts">IELTS</option>
                      <option value="toefl">TOEFL</option>
                      <option value="pte">PTE</option>
                      <option value="duolingo">Duolingo</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Overall Band Score</label>
                <Controller
                  name="ieltsScore"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      placeholder="e.g., 7.5"
                      step="0.5"
                      min="0"
                      max="9"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none bg-white"
                    />
                  )}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // 5. Financial Funds
  const renderFinancialStep = () => {
    const amount = watch("financialFunds") || 5000;

    return (
      <div className="space-y-8">
        <div className="rounded-2xl overflow-hidden h-40">
          <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800" alt="Financials" className="w-full h-full object-cover" />
        </div>

        <div className="text-center">
          <h2 className="font-bold text-xl text-gray-900">Budget Estimate</h2>
          <p className="text-sm text-gray-500">How much can you spend per year?</p>
        </div>

        <div className="flex justify-center">
          <motion.div
            className="w-40 h-40 rounded-3xl border-2 border-blue-100 flex flex-col items-center justify-center bg-blue-50 shadow-sm"
            key={amount}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <span className="text-blue-600 text-lg font-bold">$</span>
            <motion.span
              className="text-3xl font-bold text-gray-900"
              key={amount}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {Number(amount).toLocaleString()}
            </motion.span>
            <span className="text-xs text-gray-500 mt-1">per year</span>
          </motion.div>
        </div>

        <div className="px-4">
          <Controller
            name="financialFunds"
            control={control}
            rules={validationRules.financialFunds}
            render={({ field }) => (
              <input
                {...field}
                type="range"
                min={1000}
                max={50000}
                step={1000}
                onChange={(e) => {
                  field.onChange(Number(e.target.value));
                }}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-200 accent-blue-600
                  [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white"
              />
            )}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-3 font-medium">
            <span>$1,000</span>
            <span>$50,000+</span>
          </div>
          {errors.financialFunds && (
            <p className="text-xs text-red-500 text-center mt-2">{errors.financialFunds.message}</p>
          )}
        </div>
      </div>
    );
  };

  // 6. Personal Information (Step 7 - Index 6)
  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Final Step: Your Details</h2>
        <p className="text-sm text-gray-500">Enter your contact information to receive your study plan.</p>
      </div>

      {/* API Error Display */}
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
        >
          <span>⚠️</span>
          {submitError}
        </motion.div>
      )}

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 ml-1">Full Name</label>
          <div className="relative">
            <Controller
              name="fullName"
              control={control}
              rules={validationRules.fullName}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl outline-none transition-colors text-sm bg-white ${errors.fullName ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                />
              )}
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-500 ml-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 ml-1">Email Address</label>
          <div className="relative">
            <Controller
              name="email"
              control={control}
              rules={validationRules.email}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  placeholder="john@example.com"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl outline-none transition-colors text-sm bg-white ${errors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                />
              )}
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 ml-1">Phone Number</label>
          <div className="relative">
            <Controller
              name="phone"
              control={control}
              rules={validationRules.phone}
              render={({ field }) => (
                <input
                  {...field}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl outline-none transition-colors text-sm bg-white ${errors.phone ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                />
              )}
            />
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500 ml-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 ml-1">Current Address</label>
          <div className="relative">
            <Controller
              name="city"
              control={control}
              rules={validationRules.city}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="123 Main St, City"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl outline-none transition-colors text-sm bg-white ${errors.city ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                />
              )}
            />
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.city && (
            <p className="text-xs text-red-500 ml-1">{errors.city.message}</p>
          )}
        </div>

      </div>
    </div>
  );

  // 7. Success Step
  const renderSuccessStep = () => (
    <div className="text-center space-y-6 py-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl"
        >
          🎉
        </motion.span>
      </motion.div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">You're All Set!</h2>
        <p className="text-gray-500 mt-2">We've prepared a personalized study plan for you.</p>
      </div>

      <div className="bg-blue-50 rounded-2xl p-5 text-left space-y-4 border border-blue-100">
        <h3 className="font-semibold text-blue-900 text-sm uppercase tracking-wider">Your Profile Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Name</p>
            <p className="font-medium text-gray-900">{watch("fullName") || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Email</p>
            <p className="font-medium text-gray-900">{watch("email") || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Destination</p>
            <p className="font-medium text-gray-900 capitalize">{watch("countryInterested") || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Level</p>
            <p className="font-medium text-gray-900 capitalize">{watch("studyLevel") || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Budget</p>
            <p className="font-medium text-gray-900">${Number(watch("financialFunds")).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Nationality</p>
            <p className="font-medium text-gray-900 capitalize">{watch("nationality") || "—"}</p>
          </div>
        </div>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95">
        View My Universities
      </button>
    </div>
  );

  // --- Main Render Switch ---
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderCountryStep();
      case 1: return renderStudyFieldStep();
      case 2: return renderStudyLevelStep();
      case 3: return renderNationalityStep();
      case 4: return renderEnglishStep();
      case 5: return renderFinancialStep();
      case 6: return renderPersonalInfoStep();
      case 7: return renderSuccessStep();
      default: return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

          {/* Header */}
          <div className="px-8 pt-8 pb-4">
            <span className="text-blue-600 font-bold text-lg tracking-tight">Gateway Abroad</span>
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </div>

          {/* Content Area */}
          <div className="px-8 pb-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          {currentStep < totalSteps - 1 && (
            <div className="px-8 pb-4 border-t border-gray-100 flex justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0 || isSubmitting}
                className={`px-6 py-2 rounded-xl text-sm font-medium transition-colors ${currentStep === 0 || isSubmitting
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-8 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : currentStep === 6 ? (
                  "Get My Plan"
                ) : (
                  "Next Step"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
}