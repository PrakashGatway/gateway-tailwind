// components/CompactCounsellingForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';

const CompactCounsellingForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      service: 'Study Abroad', // Default tab
      fullName: '',
      email: '',
      phone: '',
      // Study Abroad Specifics
      programLevel: '',
      destinationCountry: '',
      intakeYear: '',
      city: '',
      // Test Prep Specifics
      testType: '',
      targetScore: '',
      preferredTestDate: '',
      // Common
      message: '',
      englishTestScore: '',
      agreeToContact: false,
    },
  });

  const currentService = watch('service');

  const handleTabChange = (service) => {
    setValue('service', service);
    // Optional: Reset specific fields when switching tabs to avoid confusion
    if (service === 'Study Abroad') {
      setValue('testType', '');
      setValue('targetScore', '');
      setValue('preferredTestDate', '');
    } else {
      setValue('programLevel', '');
      setValue('destinationCountry', '');
      setValue('intakeYear', '');
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        console.log('Form Data:', data);
        alert('Thank you! Our counsellor will contact you within 24 hours.');
      }
      reset();
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  // --- Styles ---
  const label = "block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide";
  const baseInput = "w-full px-3 py-2 rounded-md border text-sm transition-all focus:outline-none focus:ring-2 focus:border-transparent";
  const validInput = `${baseInput} border-gray-300 focus:border-blue-500 focus:ring-blue-100`;
  const errorInput = `${baseInput} border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50`;
  const errorMsg = "text-[10px] text-red-500 mt-0.5";

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* Top Tabs / Service Selector */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => handleTabChange('Study Abroad')}
          className={`flex-1 py-4 text-sm font-bold transition-colors relative ${
            currentService === 'Study Abroad' 
              ? 'text-white bg-[#DC2626]' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          🎓 Study Abroad
          {currentService === 'Study Abroad' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('Test Preparation')}
          className={`flex-1 py-4 text-sm font-bold transition-colors relative ${
            currentService === 'Test Preparation' 
              ? 'text-red-600 bg-blue-50/50' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          📝 Test Preparation
          {currentService === 'Test Preparation' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#DC2626]"></span>
          )}
        </button>
      </div>

      <div className="p-6 md:p-8">
        {/* Dynamic Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentService === 'Study Abroad' ? 'Start Your Global Journey' : 'Ace Your Exam'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {currentService === 'Study Abroad' 
              ? 'Get expert guidance on universities, visas, and scholarships.' 
              : 'Book a demo class and get a personalized study plan.'}
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          
          {/* ROW 1: Personal Info (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={label}>Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('fullName', { required: 'Name is required' })}
                placeholder="John Doe"
                className={errors.fullName ? errorInput : validInput}
              />
              {errors.fullName && <p className={errorMsg}>{errors.fullName.message}</p>}
            </div>

            <div>
              <label className={label}>Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                })}
                placeholder="john@example.com"
                className={errors.email ? errorInput : validInput}
              />
              {errors.email && <p className={errorMsg}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={label}>Phone Number <span className="text-red-500">*</span></label>
              <input
                type="tel"
                {...register('phone', { 
                  required: 'Phone is required',
                  pattern: { value: /^\+?[0-9\s\-()]{7,15}$/, message: 'Invalid number' }
                })}
                placeholder="+1 234 567 890"
                className={errors.phone ? errorInput : validInput}
              />
              {errors.phone && <p className={errorMsg}>{errors.phone.message}</p>}
            </div>
          </div>

          {/* CONDITIONAL: STUDY ABROAD FIELDS */}
          {currentService === 'Study Abroad' && (
            <>
              {/* ROW 2: Academic Details (3 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={label}>Program Level <span className="text-red-500">*</span></label>
                  <select
                    {...register('programLevel', { required: 'Required' })}
                    className={`${errors.programLevel ? errorInput : validInput} bg-white`}
                  >
                    <option value="">Select Level</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="PhD">PhD</option>
                  </select>
                  {errors.programLevel && <p className={errorMsg}>Required</p>}
                </div>

                <div>
                  <label className={label}>Destination Country</label>
                  <input
                    type="text"
                    {...register('destinationCountry')}
                    placeholder="e.g. UK, Canada"
                    className={validInput}
                  />
                </div>

                <div>
                  <label className={label}>Intake Year</label>
                   <select
                    {...register('intakeYear', { required: 'Required' })}
                    className={`${errors.intakeYear ? errorInput : validInput} bg-white`}
                  >
                    <option value="">Select Year</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                   
                  </select>
                </div>
              </div>

              {/* ROW 3: Location (1 Column for City to balance layout or add more fields) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="md:col-span-1">
                  <label className={label}>Current City</label>
                  <input
                    type="text"
                    {...register('city')}
                    placeholder="e.g. New Delhi"
                    className={validInput}
                  />
                </div>
                 <div>
                  <label className={label}>Do you have an English test score?
 </label>
                  <select
                    {...register('englishTestScore')}
                    className={`${errors.englishTestScore ? errorInput : validInput} bg-white`}
                  >
                    <option value="">Select Option</option>
                    <option value="IELTS">YES--IELTS</option>
                    <option value="PTE">YES--PTE</option>
                    <option value="TOEFL">YES--TOEFL</option>
                    <option value="SAT">YES--DUOLINGO</option>
                      <option value="NO">NO--need coaching first</option>
                    <option value="NO">NO--have MOI certificate</option>
                  </select>
                  {errors.englishTestScore && <p className={errorMsg}>Required</p>}
                </div>
              </div>
            </>
          )}

          {/* CONDITIONAL: TEST PREP FIELDS */}
          {currentService === 'Test Preparation' && (
            <>
              {/* ROW 2: Test Details (3 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={label}>Test Type <span className="text-red-500">*</span></label>
                  <select
                    {...register('testType', { required: 'Required' })}
                    className={`${errors.testType ? errorInput : validInput} bg-white`}
                  >
                    <option value="">Select Test</option>
                    <option value="IELTS">IELTS</option>
                    <option value="PTE">PTE</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="GRE">GRE</option>
                    <option value="GMAT">GMAT</option>
                    <option value="SAT">SAT</option>
                  </select>
                  {errors.testType && <p className={errorMsg}>Required</p>}
                </div>

                <div>
                  <label className={label}>Target Score</label>
                  <input
                    type="text"
                    {...register('targetScore')}
                    placeholder="e.g. 7.5 Bands"
                    className={validInput}
                  />
                </div>

                <div>
                  <label className={label}>Preferred Date</label>
                  <input
                    type="date"
                    {...register('preferredTestDate')}
                    className={validInput}
                  />
                </div>
              </div>

               {/* ROW 3: Location */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="md:col-span-1">
                  <label className={label}>Current City</label>
                  <input
                    type="text"
                    {...register('city')}
                    placeholder="e.g. Mumbai"
                    className={validInput}
                  />
                </div>
                <div>
                  <label className={label}>Do you have an English test score?</label>

 
                  <select
                    {...register('englishTestScore')}
                    className={`${errors.englishTestScore ? errorInput : validInput} bg-white`}
                  >
                    <option value="">Select Option</option>
                    <option value="IELTS">YES--IELTS</option>
                    <option value="PTE">YES--PTE</option>
                    <option value="TOEFL">YES--TOEFL</option>
                    <option value="SAT">YES--DUOLINGO</option>
                    <option value="NO">NO--need coaching first</option>
                    <option value="NO">NO--have MOI certificate</option>


                  </select>
                  {errors.englishTestScore && <p className={errorMsg}>Required</p>}
                </div>
                 
              </div>
            </>
          )}

          {/* ROW 4: Contact & Message (Split 1 col + 2 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
           

            <div className="md:col-span-2">
              <label className={label}>Short Message</label>
              <input
                type="text"
                {...register('message')}
                placeholder={currentService === 'Study Abroad' ? "I'm interested in MS in USA..." : "I need help with IELTS Speaking..."}
                className={validInput}
              />
            </div>
          </div>

          {/* Footer: Checkbox & Submit */}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <div className="flex items-start gap-2 mb-4">
              <input
                type="checkbox"
                {...register('agreeToContact', { required: true })}
                id="agree"
                className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="agree" className="text-xs text-gray-500 leading-tight">
                I agree to be contacted via regarding my inquiry. <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.agreeToContact && <p className="text-xs text-red-500 mb-2">Please agree to continue.</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#DC2626] hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  {currentService === 'Study Abroad' ? 'Get Free Counselling' : 'Book Free Demo Class'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
            
            <p className="text-[10px] text-gray-400 text-center mt-3">
              By submitting, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CompactCounsellingForm;