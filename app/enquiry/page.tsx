"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";

// --- TypeScript interface matching your form fields ---
interface FormData {
  // Choice of country (dynamic fields from table)
  [key: string]: any;

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

  // Work Experience
  companyName: string;
  designation: string;
  totalExperience: string;

  // Education
  educationFrom: string;
  cbsc: string;
  ib: string;
  stateBoard: string;
  schoolName: string;
  yearOfPassing: string;
  marksObtained: string;
  subject: string;

  // Higher Education
  grade12: string;
  bachelorsDegree: string;
  mastersDegree: string;
  doctorates: string;
  otherQualifications: string;

  // Tests
  ielts: boolean;
  toefl: boolean;
  pte: boolean;
  gre: boolean;
  gmat: boolean;
  sat: boolean;
  oet: boolean;
  spokenEnglish: boolean;

  // How did you hear about us
  internet: string;
  advertisement: string;
  friend: string;
  other: string;
  counsellor: string;
}

const App: React.FC = () => {
  const {
    register,
    handleSubmit, watch, trigger,
    formState: { errors },
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

  // Transform form data to match MongoDB schema
  // Transform form data to match MongoDB schema
  const transformFormDataToSchema = (data: FormData) => {
    // Find the first country with preference data
    const countries = ["UK", "USA", "CANADA", "IRELAND", "EUROPE", "Other"];
    let selectedCountry = "";
    let countryData = {
      date: "",
      preference1: "",
      preference2: "",
      preference3: "",
      preference4: ""
    };

    for (const country of countries) {
      if (data[`pref1_${country}`]) {
        selectedCountry = country;
        countryData = {
          date: data[`date_${country}`] || "",
          preference1: data[`pref1_${country}`] || "",
          preference2: data[`pref2_${country}`] || "",
          preference3: data[`pref3_${country}`] || "",
          preference4: data[`pref4_${country}`] || ""
        };
        break;
      }
    }

    // Create education array
    const educationArray = [];

    if (data.grade12) {
      educationArray.push({
        examPassed: "12th Grade",
        schoolName: data.schoolName || "",
        yearOfPassing: data.yearOfPassing ? parseInt(data.yearOfPassing) : undefined,
        marks: data.marksObtained ? parseFloat(data.marksObtained) : undefined,
        subject: data.subject || ""
      });
    }

    if (data.bachelorsDegree) {
      educationArray.push({
        examPassed: "Bachelors Degree",
        schoolName: data.schoolName || "",
        yearOfPassing: data.yearOfPassing ? parseInt(data.yearOfPassing) : undefined,
        marks: data.marksObtained ? parseFloat(data.marksObtained) : undefined,
        subject: data.subject || ""
      });
    }

    if (data.mastersDegree) {
      educationArray.push({
        examPassed: "Masters Degree",
        schoolName: data.schoolName || "",
        yearOfPassing: data.yearOfPassing ? parseInt(data.yearOfPassing) : undefined,
        marks: data.marksObtained ? parseFloat(data.marksObtained) : undefined,
        subject: data.subject || ""
      });
    }

    if (data.doctorates) {
      educationArray.push({
        examPassed: "Doctorates",
        schoolName: data.schoolName || "",
        yearOfPassing: data.yearOfPassing ? parseInt(data.yearOfPassing) : undefined,
        marks: data.marksObtained ? parseFloat(data.marksObtained) : undefined,
        subject: data.subject || ""
      });
    }

    // Determine heardAboutUs source
    let heardAboutUs = "";
    if (data.internet) heardAboutUs = "Internet";
    else if (data.advertisement) heardAboutUs = "Advertisement";
    else if (data.friend) heardAboutUs = "Friend";
    else if (data.counsellor) heardAboutUs = "Counsellor";
    else if (data.other) heardAboutUs = "Other";

    // Build the final object matching the schema - WITH PROPER ENUM HANDLING
    return {
      date: countryData.date || new Date().toISOString().split('T')[0],

      preferences: {
        preference1: countryData.preference1 || undefined,
        preference2: countryData.preference2 || undefined,
        preference3: countryData.preference3 || undefined,
        preference4: countryData.preference4 || undefined
      },

      // Only include countryChoice if it has a value
      ...(selectedCountry && { countryChoice: selectedCountry }),

      personalDetails: {
        name: data.fullName || "",
        ...(data.fathersName && { fatherName: data.fathersName }),
        ...(data.dateofbirth && { dateOfBirth: data.dateofbirth }),
        ...(data.age && { age: parseInt(data.age) }),
        mobile: data.mobileNo || "",
        // Only include maritalStatus if it's a valid enum value
        ...(data.martialStatus && { maritalStatus: data.martialStatus }),
        ...(data.address && { address: data.address }),
        ...(data.parentIncome && { parentAnnualIncome: parseFloat(data.parentIncome) }),
        ...(data.parentOccupation && { parentOccupation: data.parentOccupation }),
        ...(data.budget && { budget: parseFloat(data.budget) })
      },

      interest: {
        ...(data.courseSubject && { course: data.courseSubject }),
        ...(data.intake && { intake: data.intake }),
        // Only include levelOfStudy if it's a valid enum value
        ...(data.levelOfStudy && {
          levelOfStudy: data.levelOfStudy === "Bachelor's" ? "Bachelors" :
            data.levelOfStudy === "Master's" ? "Masters" :
              data.levelOfStudy
        }),
        ...((data.bachelors || data.masters) && {
          universityInterest: data.bachelors || data.masters
        })
      },

      // Only include experience if at least one field has value
      ...((data.companyName || data.designation || data.totalExperience) && {
        experience: {
          ...(data.companyName && { companyName: data.companyName }),
          ...(data.designation && { designation: data.designation }),
          ...(data.totalExperience && { totalExperience: parseInt(data.totalExperience) })
        }
      }),

      // Only include educationFrom if it's a valid enum value
      ...(data.educationFrom && {
        educationFrom: data.educationFrom as "CBSC" | "IB" | "State Board"
      }),

      // Only include education array if it has items
      ...(educationArray.length > 0 && { education: educationArray }),

    testGiven: {
  IELTS: data.ielts
    ? {
        selected: true,
        score: data.ielts_score || "",
        year: data.ielts_year || "",
      }
    : null,

  TOEFL: data.toefl
    ? {
        selected: true,
        score: data.toefl_score || "",
        year: data.toefl_year || "",
      }
    : null,

  PTE: data.pte
    ? {
        selected: true,
        score: data.pte_score || "",
        year: data.pte_year || "",
      }
    : null,

  GRE: data.gre
    ? {
        selected: true,
        score: data.gre_score || "",
        year: data.gre_year || "",
      }
    : null,

  GMAT: data.gmat
    ? {
        selected: true,
        score: data.gmat_score || "",
        year: data.gmat_year || "",
      }
    : null,

  SAT: data.sat
    ? {
        selected: true,
        score: data.sat_score || "",
        year: data.sat_year || "",
      }
    : null,

  OET: data.oet
    ? {
        selected: true,
        score: data.oet_score || "",
        year: data.oet_year || "",
      }
    : null,

  spokenEnglish: data.spokenEnglish
    ? {
        selected: true,
        score: data.spokenEnglish_score || "",
        year: data.spokenEnglish_year || "",
      }
    : null,
},
      // Only include heardAboutUs if it has a value
      ...(heardAboutUs && { heardAboutUs })
    };
  };

const onSubmit = async (data: FormData) => {
  try {
    const TESTS = [
      "ielts", "toefl", "pte", "gre",
      "gmat", "sat", "oet", "spokenEnglish",
    ];

    const testGiven = TESTS
      .filter((test) => data[test])
      .map((test) => ({
        name: test.toUpperCase(),
        score: data[`${test}_score`] || "",
        year: data[`${test}_year`] || "",
      }));

    // transform existing data
    const apiData = transformFormDataToSchema(data);

    // 🔥 ADD THIS LINE
    apiData.testGiven = testGiven;

    console.log("Final Payload:", JSON.stringify(apiData, null, 2));

    const res = await fetch("https://api.ooshasglobal.com/api/enquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiData)
    });

    const result = await res.json();

    if (res.ok) {
      alert("Form submitted successfully!");
    } else {
      alert("Error: " + (result.message || "Unknown error"));
    }

  } catch (error) {
    console.error(error);
    alert("Network error");
  }
};

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (step === 1) {
      // Trigger validation for step 1 fields
      trigger(["fullName", "dateofbirth", "age", "mobileNo"]).then((isValid) => {
        if (isValid) {
          setStep((prev) => Math.min(prev + 1, 3));
        } else {
          // Optional: Show a message that fields are required

        }
      });
    } else if (step === 2) {
      setStep((prev) => Math.min(prev + 1, 3));
    } else {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const TESTS = [
    "ielts", "toefl", "pte", "gre",
    "gmat", "sat", "oet", "spokenEnglish",
  ];

  const selectedTests = watch(TESTS);


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


                {/* Personal Details - Government style */}
                <div className="border-2 border-gray-200">
                  <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                    <h3 className="font-bold text-gray-800">1. PERSONAL DETAILS</h3>
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
                          Marital Status
                        </label>
                        <div className="flex items-center gap-6 p-3 border-2 border-gray-300 bg-gray-50">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="Single"
                              {...register("martialStatus")}
                              className="w-4 h-4 text-[#D71635] focus:ring-[#D71635]"
                            />
                            <span className="font-medium">Single</span>
                          </label>
                          <label className="flex items-center gap-2">
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
                          Address
                        </label>
                        <input
                          {...register("address")}
                          className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                        />

                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Father's Name
                        </label>
                        <input
                          {...register("fathersName")}
                          className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                        />

                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Father's No.
                        </label>
                        <input
                          type="tel"
                          {...register("fathersNo")}
                          className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                        />

                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Parent's Annual Income
                        </label>
                        <input
                          type="number"
                          {...register("parentIncome")}
                          className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                        />

                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Parent's Occupation
                        </label>
                        <input
                          {...register("parentOccupation")}
                          className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                        />

                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
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



                {/* Interest In */}
                <div className="border-2 border-gray-200">
                  <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                    <h3 className="font-bold text-gray-800">2. COURSE INTEREST</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Course/Subject
                        </label>
                        <input
                          {...register("courseSubject")}
                          className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Experience
                        </label>
                        <input
                          {...register("experience")}
                          className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Intake
                        </label>
                        <input
                          {...register("intake")}
                          className="w-full p-3 border-2 border-gray-300 focus:border-[#D71635] outline-none bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Level of Study

                        </label>
                        <div className="flex items-center gap-6 p-3 border-2 border-gray-300 bg-gray-50">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="Bachelor's"
                              {...register("levelOfStudy")}
                              className="w-4 h-4 text-[#D71635] focus:ring-[#D71635]"
                            />
                            <span className="font-medium">Bachelor's</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="Masters"
                              {...register("levelOfStudy")}
                              className="w-4 h-4 text-[#D71635] focus:ring-[#D71635]"
                            />
                            <span className="font-medium">Masters</span>
                          </label>
                        </div>

                      </div>


                    </div>
                  </div>
                </div>


                {/* Choice of country table - Government style */}
                <div className="border-2 border-gray-200">
                  <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                    <h3 className="font-bold text-gray-800">3. COUNTRY PREFERENCES</h3>
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
                        {["UK", "USA", "CANADA", "IRELAND", "EUROPE", "Other"].map((country, idx) => (
                          <tr key={country} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="p-3 font-bold border">{country}</td>
                            <td className="p-3 border">
                              <input
                                type="date"
                                {...register(`date_${country}`)}
                                className="w-full p-2 border border-gray-300 focus:border-[#D71635] focus:ring-1 focus:ring-[#D71635] outline-none"
                              />
                            </td>
                            <td className="p-3 border">
                              <input
                                type="text"
                                {...register(`pref1_${country}`)}
                                className="w-full p-2 border border-gray-300 focus:border-[#D71635] outline-none"
                              />
                            </td>
                            <td className="p-3 border">
                              <input
                                type="text"
                                {...register(`pref2_${country}`)}
                                className="w-full p-2 border border-gray-300 focus:border-[#D71635] outline-none"
                              />
                            </td>
                            <td className="p-3 border">
                              <input
                                type="text"
                                {...register(`pref3_${country}`)}
                                className="w-full p-2 border border-gray-300 focus:border-[#D71635] outline-none"
                              />
                            </td>
                            <td className="p-3 border">
                              <input
                                type="text"
                                {...register(`pref4_${country}`)}
                                className="w-full p-2 border border-gray-300 focus:border-[#D71635] outline-none"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

                <div className="border-2 border-gray-300 p-6 bg-white">
                  <h3 className="font-bold text-xl text-center text-gray-800 mb-6 border-b-2 border-red-700 pb-2">5. EDUCATION DETAILS</h3>

                  {/* Education Board Selection */}
                  <div className="mb-6 flex flex-wrap gap-4 justify-center">
                    <span className="font-bold text-gray-700 self-center">Education From:</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" {...register("educationBoard")} value="CBSC" className="w-4 h-4" />
                      <span className="text-gray-700">CBSC</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" {...register("educationBoard")} value="IB" className="w-4 h-4" />
                      <span className="text-gray-700">IB</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" {...register("educationBoard")} value="State Board" className="w-4 h-4" />
                      <span className="text-gray-700">State Board</span>
                    </label>
                  </div>

                  {/* Responsive Table Wrapper */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] border-collapse border border-gray-400">
                      <thead>
                        <tr className="bg-red-700 text-white">
                          <th className="border border-gray-400 p-2 text-left font-semibold">Exam Passed</th>
                          <th className="border border-gray-400 p-2 text-left font-semibold">School/ College name</th>
                          <th className="border border-gray-400 p-2 text-left font-semibold">Year of Passing</th>
                          <th className="border border-gray-400 p-2 text-left font-semibold">Marks Obtained (%)</th>
                          <th className="border border-gray-400 p-2 text-left font-semibold">Subject</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* We map over an array of qualifications to create the rows */}
                        {["10th Grade", "12th Grade", "Bachelors Degree", "Masters Degree", "Doctorates", "Other qualifications"].map((qual, index) => (
                          <tr key={index}>
                            <td className="border border-gray-400 p-2 bg-red-100 font-medium text-gray-800">
                              {qual}
                            </td>
                            <td className="border border-gray-400 p-2">
                              <input
                                {...register(`education[${index}].schoolName`)}
                                className="w-full p-1 border border-gray-300 focus:border-red-700 outline-none"
                              />
                            </td>
                            <td className="border border-gray-400 p-2">
                              <input
                                type="number"
                                {...register(`education[${index}].yearOfPassing`)}
                                className="w-full p-1 border border-gray-300 focus:border-red-700 outline-none"
                              />
                            </td>
                            <td className="border border-gray-400 p-2">
                              <input
                                type="number"
                                step="0.01"
                                {...register(`education[${index}].marksObtained`)}
                                className="w-full p-1 border border-gray-300 focus:border-red-700 outline-none"
                              />
                            </td>
                            <td className="border border-gray-400 p-2">
                              <input
                                {...register(`education[${index}].subject`)}
                                className="w-full p-1 border border-gray-300 focus:border-red-700 outline-none"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                      {TESTS.map((test) => (
                        <label
                          key={test}
                          className="flex items-center gap-3 p-3 border-2 border-gray-200 hover:border-[#D71635] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            {...register(test as keyof FormData)}
                            className="w-5 h-5 text-[#D71635]"
                          />
                          <span className="font-medium uppercase">
                            {test === "spokenEnglish" ? "SPOKEN ENGLISH" : test}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {TESTS.map((test, index) => {
                    const isSelected = selectedTests?.[index];

                    if (!isSelected) return null;

                    return (
                      <div key={test} className="border p-4 rounded-lg bg-gray-50">
                        <h4 className="font-semibold mb-2 uppercase">
                          {test === "spokenEnglish" ? "Spoken English" : test}
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Score Input */}
                          <input
                            type="text"
                            placeholder="Enter Score"
                            {...register(`${test}_score` as any)}
                            className="border p-2 rounded"
                          />

                          {/* Year / Attempt */}
                          <input
                            type="text"
                            placeholder="Year / Attempt"
                            {...register(`${test}_year` as any)}
                            className="border p-2 rounded"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-2 border-gray-200">
                  <div className="bg-gray-100 px-4 py-2 border-b-2 border-gray-200">
                    <h3 className="font-bold text-gray-800">8. HOW DID YOU HEAR ABOUT US?</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Internet</label>
                        <input type="radio" value="Internet" {...register("heardAboutUs")} className="mr-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Advertisement</label>
                        <input type="radio" value="Advertisement" {...register("heardAboutUs")} className="mr-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Friend</label>
                        <input type="radio" value="Friend" {...register("heardAboutUs")} className="mr-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Counsellor</label>
                        <input type="radio" value="Counsellor" {...register("heardAboutUs")} className="mr-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Other</label>
                        <input type="radio" value="Other" {...register("heardAboutUs")} className="mr-2" />
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
                  onClick={(e) => nextStep(e)}
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