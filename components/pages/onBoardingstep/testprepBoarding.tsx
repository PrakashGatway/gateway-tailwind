"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import axiosInstance from "@/services/axiosInstance";

// --- Types & Interfaces ---
type FormData = {
  // Root Level (Personal Info)
  name: string;
  email: string;
  mobile: string;
  city: string;
  
  // Nested Level (Extra Details)
  extraDetails: {
    exam: string[]; // Multi-select
    reason: string[]; // Multi-select
    targetScore: string;
    examDate: string;
    attempts: string;
    englishLevel: string;
    weakAreas: string[]; // Multi-select
    batchType: string;
    startTimeline: string;
    notes: string;
    source: string;
    profile: string;
    age: string;
  };
};

// --- Constants ---
const EXAMS = [
  { val: "IELTS", icon: "📗" },
  { val: "TOEFL", icon: "📘" },
  { val: "PTE", icon: "📙" },
  { val: "GRE", icon: "🧠" },
  { val: "GMAT", icon: "💼" },
  { val: "SAT", icon: "📐" },
];

const REASONS = [
  { val: "Study Abroad", icon: "✈️" },
  { val: "Job / PR Visa", icon: "🛂" },
  { val: "MBA Admission", icon: "🎓" },
  { val: "English Proficiency", icon: "🗣️" },
];

const WEAK_AREAS = [
  { val: "Reading", icon: "📖" },
  { val: "Writing", icon: "✍️" },
  { val: "Listening", icon: "👂" },
  { val: "Speaking", icon: "🗣️" },
  { val: "Verbal", icon: "🔤" },
  { val: "Quant/Math", icon: "🔢" },
];

const BATCHES = [
  { val: "Weekday Morning", icon: "🌅" },
  { val: "Weekday Evening", icon: "🌆" },
  { val: "Weekend", icon: "📅" },
  { val: "Online", icon: "💻" },
];

export default function TestPrepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const totalSteps = 4;

  const methods = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      city: "",
      extraDetails: {
        exam: [],
        reason: [],
        targetScore: "",
        examDate: "",
        attempts: "First attempt",
        englishLevel: "",
        weakAreas: [],
        batchType: "",
        startTimeline: "Immediately (within 1 week)",
        notes: "",
        source: "",
        profile: "",
        age: "",
      },
    },
    mode: "onBlur",
  });

  const { handleSubmit, control, watch, setValue, trigger, formState: { errors } } = methods;

  // Watch specific fields for conditional rendering
  const selectedExams = watch("extraDetails.exam");
  const hasTakenTest = !selectedExams.includes("Not yet") && selectedExams.length > 0;

  // --- Handlers ---

  const toggleArrayValue = (field: keyof FormData["extraDetails"], value: string) => {
    const current = watch(`extraDetails.${field}`) as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(`extraDetails.${field}`, updated, { shouldValidate: true });
  };

  const onNext = async () => {
    let fieldsToValidate: (keyof FormData | `extraDetails.${keyof FormData["extraDetails"]}`)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["name", "email", "mobile"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["extraDetails.exam"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["extraDetails.englishLevel"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onPrev = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        // Root Level
        fullName: data.name, // Mapping name -> fullName if API expects it, otherwise use data.name
        email: data.email,
        phone: String(data.mobile),
        city: data.city,
        source: "website",
        
        // Nested Level
        extraDetails: {
          type: "test_prep",
          ...data.extraDetails,
          submittedAt: new Date().toISOString(),
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        },
      };

      await axiosInstance.post("/leads", payload);
      setCurrentStep(5); // Success Step
    } catch (error: any) {
      console.error(error);
      setSubmitError(error.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Helpers ---

  const renderProgressBar = () => (
    <div className="flex items-center gap-0 mt-6">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center flex-1">
          <div className={`flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${
            step < currentStep ? "text-white/90" : step === currentStep ? "text-white" : "text-white/50"
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-300 ${
              step < currentStep 
                ? "bg-[#e8a020] border-[#e8a020] text-black" 
                : step === currentStep 
                  ? "bg-white border-white text-[#0d7a6b]" 
                  : "border-white/30 text-white/50"
            }`}>
              {step < currentStep ? <Check size={12} /> : step}
            </div>
            <span className="hidden sm:inline">
              {step === 1 && "Personal"}
              {step === 2 && "Exam"}
              {step === 3 && "Level"}
              {step === 4 && "Confirm"}
            </span>
          </div>
          {step < 4 && (
            <div className={`h-[2px] flex-1 mx-2 rounded transition-colors duration-300 ${
              step < currentStep ? "bg-[#e8a020]" : "bg-white/20"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const OptionCard = ({ 
    label, 
    icon, 
    value, 
    field, 
    type = "multi" 
  }: { 
    label: string; 
    icon: string; 
    value: string; 
    field: keyof FormData["extraDetails"];
    type?: "multi" | "single";
  }) => {
    const isSelected = watch(`extraDetails.${field}`)?.includes(value);
    
    return (
      <div
        onClick={() => {
          if (type === "single") {
             // For single select logic if needed, currently using multi logic for all arrays
             setValue(`extraDetails.${field}`, [value], { shouldValidate: true });
          } else {
             toggleArrayValue(field, value);
          }
        }}
        className={`
          relative flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none
          ${isSelected 
            ? "border-[#0d7a6b] bg-red-100 text-[#0d7a6b]" 
            : "border-black bg-[#fafaf8] hover:border-red-500 hover:bg-white text-gray-700"}
        `}
      >
        <span className="text-xl text-red-500">{icon}</span>
        <span className="text-xm font-medium flex-1 text-black">{label}</span>
        {isSelected && (
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <Check size={12} className="text-white" />
          </div>
        )}
      </div>
    );
  };

  // --- Steps ---

  const Step1Personal = () => (
    <motion.div className="space-y-1">
      <h3 className="text-red-500 font-semibold border-b-2 border-[#e0f5f2] pb-2 mb-1">Step 1 — Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-0">
          <label className="text-xm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
          <Controller name="name" control={control} rules={{ required: "Required" }}
            render={({ field }) => (
              <input {...field} className="w-full p-2.5 bg-[#fafaf8] border border-[rgba(10,34,64,0.13)] rounded-lg focus:border-[#0d7a6b] outline-none transition-colors" placeholder="Priya" />
            )}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-0">
          <label className="text-xm font-medium text-gray-700">Last Name</label>
          <Controller name="extraDetails.profile" control={control}
             render={({ field }) => (
               <input {...field} className="w-full p-2.5 bg-[#fafaf8] border border-[rgba(10,34,64,0.13)] rounded-lg focus:border-[#0d7a6b] outline-none transition-colors" placeholder="Mehta" />
             )}
          />
        </div>
      </div>

      <div className="space-y-0">
        <label className="text-xm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
        <Controller name="email" control={control} rules={{ required: "Required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" } }}
          render={({ field }) => (
            <input {...field} type="email" className="w-full p-2.5 bg-[#fafaf8] border border-[rgba(10,34,64,0.13)] rounded-lg focus:border-[#0d7a6b] outline-none transition-colors" placeholder="priya@email.com" />
          )}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-0">
        <label className="text-xm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
        <Controller name="mobile" control={control} rules={{ required: "Required" }}
          render={({ field }) => (
            <input {...field} type="tel" className="w-full p-2.5 bg-[#fafaf8] border border-[rgba(10,34,64,0.13)] rounded-lg focus:border-[#0d7a6b] outline-none transition-colors" placeholder="+91 98765 43210" />
          )}
        />
        {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="">
          <label className="text-xm font-medium text-gray-700">City</label>
          <Controller name="city" control={control}
            render={({ field }) => (
              <input {...field} className="w-full p-2.5 bg-[#fafaf8] border border-[rgba(10,34,64,0.13)] rounded-lg focus:border-[#0d7a6b] outline-none transition-colors" placeholder="Jaipur" />
            )}
          />
        </div>
        <div className="">
          <label className="text-xm font-medium text-gray-700">Age</label>
          <Controller name="extraDetails.age" control={control}
            render={({ field }) => (
              <input {...field} type="number" className="w-full p-2.5 bg-[#fafaf8] border border-[rgba(10,34,64,0.13)] rounded-lg focus:border-[#0d7a6b] outline-none transition-colors" placeholder="24" />
            )}
          />
        </div>
      </div>
      
       <div className="">
          <label className="text-xm font-medium text-gray-700">Current Profile</label>
          <Controller name="extraDetails.profile" control={control}
            render={({ field }) => (
              <select {...field} className="w-full p-2.5 bg-[#fafaf8] border border-[rgba(10,34,64,0.13)] rounded-lg focus:border-[#0d7a6b] outline-none transition-colors appearance-none">
                <option value="">Select Profile</option>
                <option>School student</option>
                <option>Undergraduate student</option>
                <option>Recent graduate</option>
                <option>Working professional</option>
              </select>
            )}
          />
       </div>
    </motion.div>
  );

  const Step2Exam = () => (
    <motion.div  className="space-y-6">
      <h3 className="text-red-500 font-semibold border-b-2 border-[#e0f5f2] pb-2 mb-4">Step 2 — Exam & Goal</h3>

      <div className="space-y-2">
        <label className="text-xm font-medium text-gray-700">Which exam? <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {EXAMS.map((e) => (
            <OptionCard key={e.val} label={e.val} icon={e.icon} value={e.val} field="exam" />
          ))}
        </div>
        {errors.extraDetails?.exam && <p className="text-xs text-red-500">Please select at least one exam.</p>}
      </div>

      <div className="space-y-2">
        <label className="text-xm font-medium text-gray-700">Purpose</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REASONS.map((r) => (
            <OptionCard key={r.val} label={r.val} icon={r.icon} value={r.val} field="reason" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xm font-medium text-gray-700">Target Score</label>
          <Controller name="extraDetails.targetScore" control={control}
            render={({ field }) => (
              <input {...field} className="w-full p-2.5 bg-[#fafaf8] border border-[rgba(10,34,64,0.13)] rounded-lg focus:border-red-500 outline-none" placeholder="e.g. IELTS 7.5" />
            )}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xm font-medium text-gray-700">Attempts Taken</label>
          <Controller name="extraDetails.attempts" control={control}
            render={({ field }) => (
              <select {...field} className="w-full p-2.5 bg-[#fafaf8] border border-[rgba(10,34,64,0.13)] rounded-lg focus:border-[#0d7a6b] outline-none appearance-none">
                <option>First attempt</option>
                <option>Second attempt</option>
                <option>Third attempt or more</option>
              </select>
            )}
          />
        </div>
      </div>

      {/* Conditional Score Field */}
      <AnimatePresence>
        {hasTakenTest && (
          <motion.div  className="overflow-hidden">
             <div className="space-y-1 p-4 bg-gray-100 rounded-lg border border-gray/20">
                <label className="text-xm font-medium text-[#0d7a6b]">Previous Score (if any)</label>
                <Controller name="extraDetails.examDate" control={control}
                  render={({ field }) => (
                    <input {...field} className="w-full p-2.5 bg-white border border-[#0d7a6b]/30 rounded-lg focus:border-[#0d7a6b] outline-none" placeholder="e.g. Listening: 7, Reading: 6.5..." />
                  )}
                />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const Step3Level = () => (
    <motion.div className="space-y-6">
      <h3 className="text-red-500 font-semibold border-b-2 border-[#e0f5f2] pb-2 mb-4">Step 3 — Current Level</h3>

      <div className="space-y-2">
        <label className="text-xm font-medium text-gray-700">Self-Assessed English Level</label>
        <div className="grid grid-cols-2 gap-3">
          {["Beginner", "Intermediate", "Upper-Int.", "Advanced"].map((lvl) => (
             <div 
               key={lvl}
               onClick={() => setValue("extraDetails.englishLevel", lvl, { shouldValidate: true })}
               className={`p-3 rounded-lg border cursor-pointer text-center text-xm font-medium transition-all  ${
                 watch("extraDetails.englishLevel") === lvl 
                 ? "bg-red-100 text-black border-[#0d7a6b]" 
                 : "bg-[#fafaf8] border-[rgba(10,34,64,0.13)] hover:border-red-500"
               }`}
             >
               {lvl}
             </div>
          ))}
        </div>
        {errors.extraDetails?.englishLevel && <p className="text-xs text-red-500">Please select your level.</p>}
      </div>

      <div className="space-y-2">
        <label className="text-xm font-medium text-gray-700">Weak Areas (Optional)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {WEAK_AREAS.map((w) => (
            <OptionCard key={w.val} label={w.val} icon={w.icon} value={w.val} field="weakAreas" />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xm font-medium text-gray-700">Preferred Batch</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BATCHES.map((b) => (
            <OptionCard key={b.val} label={b.val} icon={b.icon} value={b.val} field="batchType" type="single" />
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xm font-medium text-gray-700">Additional Comments</label>
        <Controller name="extraDetails.notes" control={control}
          render={({ field }) => (
            <textarea {...field} rows={3} className="w-full p-2.5 bg-[#fafaf8] border border-[rgba(10,34,64,0.13)] rounded-lg focus:border-[#0d7a6b] outline-none resize-none" placeholder="Any specific requirements..." />
          )}
        />
      </div>
    </motion.div>
  );

  const Step4Review = () => {
    const data = watch();
    return (
      <motion.div className="space-y-6">
        <h3 className="text-red-500 font-semibold border-b-2 border-[#e0f5f2] pb-2 mb-4">Step 4 — Review</h3>
        
        <div className="bg-[#f0faf7] border border-[#0d7a6b]/20 rounded-lg p-4 text-xm space-y-2 text-gray-700">
           <p><strong>Name:</strong> {data.name}</p>
           <p><strong>Email:</strong> {data.email}</p>
           <p><strong>Phone:</strong> {data.mobile}</p>
           <p><strong>Exam:</strong> {data.extraDetails.exam.join(", ")}</p>
           <p><strong>Target:</strong> {data.extraDetails.targetScore || "Not specified"}</p>
           <p><strong>Batch:</strong> {data.extraDetails.batchType || "Not specified"}</p>
        </div>

        {submitError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xm flex items-center gap-2">
            <AlertCircle size={16} /> {submitError}
          </div>
        )}

        <div className="flex items-start gap-3 p-3 bg-[#fafaf8] rounded-lg border border-gray-200">
          <input type="checkbox" id="consent" className="mt-1 w-4 h-4 accent-[#0d7a6b]" required />
          <label htmlFor="consent" className="text-xs text-gray-500 leading-relaxed">
            I agree that Gateway Abroad Educations may contact me via call, WhatsApp, or email regarding test preparation batches. My data is kept confidential.
          </label>
        </div>
      </motion.div>
    );
  };

  const SuccessScreen = () => (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
      <div className="w-20 h-20 bg-[#e0f5f2] rounded-full flex items-center justify-center mx-auto mb-6">
        <Check size={40} className="text-[#0d7a6b]" />
      </div>
      <h2 className="text-2xl font-serif text-[#0a2240] mb-2">You're all set!</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Our test prep counsellor will get in touch within <strong>24 hours</strong> to discuss batches and your personalised study plan.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="text-xm text-gray-400 underline hover:text-[#0d7a6b]"
      >
        Submit another enquiry
      </button>
    </motion.div>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto  rounded-2xl shadow-xl  overflow-hidden border border-gray-100  my-10">
        
        {/* Header */}
        <div className="bg-red-500 p-6 sm:p-8 text-white ">
          <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase mb-3 backdrop-blur-sm">
            Test Preparation Enquiry
          </div>
          <h1 className="font-serif text-3xl mb-2">Ace Your Target Exam</h1>
          <p className="text-white/70 text-xm">GRE · GMAT · IELTS · SAT · PTE · TOEFL</p>
          {currentStep <= 4 && renderProgressBar()}
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 min-h-[200px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <Step1Personal key="s1" />}
            {currentStep === 2 && <Step2Exam key="s2" />}
            {currentStep === 3 && <Step3Level key="s3" />}
            {currentStep === 4 && <Step4Review key="s4" />}
            {currentStep === 5 && <SuccessScreen key="success" />}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {currentStep <= 4 && (
          <div className="px-6 sm:px-8 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
            {currentStep > 1 ? (
              <button type="button" onClick={onPrev} className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 text-xm font-medium hover:border-[#0a2240] hover:text-[#0a2240] transition-colors">
                Back
              </button>
            ) : <div />}
            
            {currentStep < 4 ? (
              <button type="button" onClick={onNext} className="px-8 py-2 rounded-full bg-red-500 text-white text-xm font-bold hover:bg-red-500 transition-all flex items-center gap-2 shadow-lg shadow-[#0d7a6b]/20">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="px-8 py-2 rounded-full bg-red-500 text-[#1a1000] text-xm font-bold hover:bg-[#d4901a] transition-all flex items-center gap-2 shadow-lg shadow-[#e8a020]/20 disabled:opacity-70">
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Submit Enquiry 🚀"}
              </button>
            )}
          </div>
        )}
      </form>
    </FormProvider>
  );
}