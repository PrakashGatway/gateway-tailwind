"use client";

import React, { useState } from "react";
import { Mail, User, AlertCircle, CheckCircle, Shield, Trash2, Loader2, ExternalLink } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================
interface FormData {
  fullName: string;
  email: string;
  userId?: string;
  reason?: string;
  confirmationChecked: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  requestId?: string;
  estimatedDays?: number;
}

// =============================================================================
// FAKE API CALL (simulates backend deletion request)
// =============================================================================
const submitDeletionRequest = async (data: FormData): Promise<ApiResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock validation - check if email looks valid and name not empty
  if (!data.fullName.trim() || !data.email.trim()) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  if (!data.confirmationChecked) {
    return {
      success: false,
      message: "You must confirm the understanding of data deletion consequences.",
    };
  }

  // Simulate success for any valid email/name (fake API)
  const requestId = `DEL_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  
  return {
    success: true,
    message: `Your data deletion request has been submitted successfully. We'll process it within the next 30 days.`,
    requestId: requestId,
    estimatedDays: 30,
  };
};

// =============================================================================
// MAIN COMPONENT: DataDeletionRequestPage
// =============================================================================
export default function DataDeletionRequestPage() {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    userId: "",
    reason: "",
    confirmationChecked: false,
  });
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear any previous errors when user starts typing
    if (submitError) setSubmitError(null);
    if (apiResponse && !requestSubmitted) setApiResponse(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic frontend validation
    if (!formData.fullName.trim()) {
      setSubmitError("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setSubmitError("Please enter a valid email address.");
      return;
    }
    if (!formData.confirmationChecked) {
      setSubmitError("You must confirm the data deletion acknowledgment.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setApiResponse(null);
    
    try {
      const response = await submitDeletionRequest(formData);
      if (response.success) {
        setApiResponse(response);
        setRequestSubmitted(true);
        // Optionally reset form after success? Keeping data for reference but can reset
        // For UX, we keep the data but disable further editing? We'll leave as is but show success.
      } else {
        setSubmitError(response.message || "Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form (for new request)
  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      userId: "",
      reason: "",
      confirmationChecked: false,
    });
    setApiResponse(null);
    setSubmitError(null);
    setRequestSubmitted(false);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/40 py-12 mt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section with Meta Badge */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-indigo-100 mb-5">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span className="text-xm font-medium text-gray-700">Meta Verification Requirement</span>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">GDPR / CCPA Ready</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 flex items-center justify-center gap-2 flex-wrap">
            <Trash2 className="w-8 h-8 text-red-500 inline-block" />
            Request Account Data Deletion
          </h1>
          <div className="mt-3 h-1 w-20 bg-indigo-500 rounded-full mx-auto"></div>
          <p className="text-gray-600 max-w-xl mx-auto mt-5 text-base md:text-lg">
            In compliance with <span className="font-semibold">Meta Platform policies</span>, 
            you can request permanent deletion of your data associated with our app. 
            Fill out the form below to initiate this secure process.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-200">
          {/* Compliance Info Banner */}
          <div className="bg-indigo-50/80 px-6 py-4 border-b border-indigo-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="text-xm text-indigo-800">
              <span className="font-semibold">Data Deletion Callback Compliance:</span> Your request will be logged via our deletion pipeline. 
              A confirmation email will be sent to your registered address. This action is irreversible.
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 md:p-8">
            {!requestSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-xm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-gray-400" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    placeholder="John M. Doe"
                  />
                  <p className="text-xs text-gray-400 mt-1">Name as registered with our app</p>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    placeholder="you@example.com"
                  />
                  <p className="text-xs text-gray-400 mt-1">We'll send a deletion confirmation to this address</p>
                </div>

                {/* User ID (optional) */}
                <div>
                  <label htmlFor="userId" className="block text-xm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">ID</span>
                    User ID (Optional)
                  </label>
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                    placeholder="e.g., 123456789 or username"
                  />
                  <p className="text-xs text-gray-400 mt-1">Helps us locate your data faster</p>
                </div>

                {/* Reason for deletion (optional) */}
                <div>
                  <label htmlFor="reason" className="block text-xm font-semibold text-gray-700 mb-1.5">
                    Reason (Optional)
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={3}
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 resize-none"
                    placeholder="We value your feedback. Optional: tell us why you're deleting your data..."
                  />
                </div>

                {/* Confirmation Checkbox */}
                <div className="flex items-start gap-3 p-4 bg-amber-50/40 rounded-xl border border-amber-100">
                  <input
                    type="checkbox"
                    id="confirmationChecked"
                    name="confirmationChecked"
                    checked={formData.confirmationChecked}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="confirmationChecked" className="text-xm text-gray-700 leading-relaxed">
                    I understand that <span className="font-semibold text-red-600">this action is permanent and irreversible</span>. 
                    All my personal data, activity history, and associated records will be removed from our systems 
                    within 30 days as per Meta's data deletion policy. I confirm that I want my data deleted.
                  </label>
                </div>

                {/* Error Display */}
                {submitError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing request...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Request Permanent Data Deletion
                    </>
                  )}
                </button>

                {/* Additional Meta Instructions */}
                <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 flex flex-wrap justify-between gap-2">
                  <span className="flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> 
                    Meta Platform Policy: Data Deletion Callback
                  </span>
                  <span className="text-indigo-500">We'll respond within 30 days</span>
                </div>
              </form>
            ) : (
              // SUCCESS STATE after submission
              <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Deletion Request Received</h2>
                  <div className="mt-2 max-w-md">
                    <p className="text-gray-600">
                      {apiResponse?.message || "Your request has been submitted successfully."}
                    </p>
                  </div>
                  {apiResponse?.requestId && (
                    <div className="mt-4 bg-gray-100 px-4 py-2 rounded-lg inline-block">
                      <span className="text-xs text-gray-500">Request ID:</span>
                      <code className="ml-2 font-mono text-xm font-semibold text-indigo-700">{apiResponse.requestId}</code>
                    </div>
                  )}
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-left w-full">
                    <div className="flex gap-2 text-xm text-blue-800">
                      <Shield className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">What happens next?</p>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-xs text-blue-700">
                          <li>We'll verify your identity and ownership of the data.</li>
                          <li>Within {apiResponse?.estimatedDays || 30} days, your data will be fully anonymized or deleted.</li>
                          <li>You'll receive a final confirmation email once deletion is complete.</li>
                          <li>For any questions, contact our Data Protection Officer (DPO).</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 border border-indigo-300 text-indigo-700 bg-white rounded-xl hover:bg-indigo-50 transition-colors font-medium text-xm"
                  >
                    Submit another request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer / Meta compliance note with callback instructions */}
        <div className="mt-8 text-center text-xs text-gray-500 space-y-2">
          <p className="flex items-center justify-center gap-2">
            <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
            Data deletion callback endpoint: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">/api/data-deletion/webhook</code>
          </p>
          <p>
            In accordance with Meta’s Platform Policy 4.2, this form serves as a valid data deletion request callback mechanism. 
            All deletion requests are logged, audited, and processed in compliance with GDPR & CCPA.
          </p>
          <p className="text-gray-400">
            © 2025 — YourAppName. Data privacy is our priority.
          </p>
        </div>
      </div>

      {/* Add some custom inline style for keyframes if needed (Tailwind doesn't have fade-in by default) */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}