import React from 'react';

const App = () => {
  // Mock data for the "Why Choose" section
  const spokenEnglishDetails = {
    WhyChoose: [
      {
        title: "Accomplished Faculty",
        content: "Composed of seasoned educators, with CELTA and TESOL training, our faculty goes beyond traditional methodologies. They ignite your academic passion, cultivate a deep understanding of core concepts, and empower you to excel.",
        iconImage: "faculty-icon.png"
      },
      {
        title: "Personalized Learning Trajectory",
        content: "Your goals are distinct, and our approach reflects that. We meticulously craft customized learning plans that cater to your individual needs and learning style.",
        iconImage: "personalized-icon.png"
      },
      {
        title: "Focus on Communication, Not Just Grammar",
        content: "We go beyond rote learning and focus on developing your real-world communication skills. You'll learn to express yourself clearly and confidently in various situations, from social gatherings to professional settings.",
        iconImage: "communication-icon.png"
      },
      {
        title: "Beyond the Classroom",
        content: "Gateway Abroad goes beyond spoken English classes. We organize workshops, guest lectures, and cultural events to provide you with a well-rounded learning experience and exposure to diverse accents and communication styles.",
        iconImage: "beyond-classroom-icon.png"
      },
      {
        title: "Building Confidence",
        content: "Fluency in English is more than just grammar and vocabulary; it's about confidence. Our interactive classes and supportive environment will help you overcome hesitation and speak English with self-assurance.",
        iconImage: "confidence-icon.png"
      }
    ]
  };

  return (
   <div className="w-full lg:w-[38%]">
            <div className="flex justify-center">
              <img
                src="/img/help-support-img.svg"
                alt="Study Abroad Help"
                className="w-full max-w-xs sm:max-w-sm lg:max-w-[25rem]"
              />
            </div>
          </div>




 {/* Get in Touch Sidebar */}
      <div className="fixed top-1/2 -right-14 transform -translate-y-1/2 z-40 rotate-90">
        <button
          data-bs-toggle="modal"
          data-bs-target="#getintouchModel"
          className="bg-red-600 text-white px-6 py-3 rounded-t-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
        >
          <span className="mr-2"><i className="fa fa-envelope-o" /> Get in touch</span>
        </button>
      </div>

  );
};

export default App;
