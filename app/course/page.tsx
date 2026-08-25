import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Clock, Users, Award, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Test Preparation - Gateway Abroad Education | IELTS, TOEFL, GRE, GMAT Coaching",
  description:
    "Expert test preparation coaching for IELTS, TOEFL, GRE, GMAT, PTE, and SAT. Achieve your target scores with our proven methods and experienced instructors.",
}

export default function TestPreparationPage() {
  const tests = [
    {
      name: "IELTS",
      fullName: "International English Language Testing System",
      description: "Most widely accepted English proficiency test for study abroad and immigration.",
      duration: "2 hours 45 minutes",
      sections: ["Listening", "Reading", "Writing", "Speaking"],
      image: "/placeholder.svg?height=300&width=400",
      link: "/test-preparation/ielts",
    },
    {
      name: "TOEFL",
      fullName: "Test of English as a Foreign Language",
      description: "Preferred by American universities and institutions worldwide.",
      duration: "3 hours",
      sections: ["Reading", "Listening", "Speaking", "Writing"],
      image: "/placeholder.svg?height=300&width=400",
      link: "/test-preparation/toefl",
    },
    {
      name: "GRE",
      fullName: "Graduate Record Examination",
      description: "Required for graduate school admissions in the US and other countries.",
      duration: "3 hours 45 minutes",
      sections: ["Verbal Reasoning", "Quantitative Reasoning", "Analytical Writing"],
      image: "/placeholder.svg?height=300&width=400",
      link: "/test-preparation/gre",
    },
    {
      name: "GMAT",
      fullName: "Graduate Management Admission Test",
      description: "Essential for MBA and business school admissions worldwide.",
      duration: "3 hours 7 minutes",
      sections: ["Analytical Writing", "Integrated Reasoning", "Quantitative", "Verbal"],
      image: "/placeholder.svg?height=300&width=400",
      link: "/test-preparation/gmat",
    },
    {
      name: "PTE",
      fullName: "Pearson Test of English",
      description: "Computer-based English proficiency test accepted globally.",
      duration: "3 hours",
      sections: ["Speaking & Writing", "Reading", "Listening"],
      image: "/placeholder.svg?height=300&width=400",
      link: "/test-preparation/pte",
    },
    {
      name: "SAT",
      fullName: "Scholastic Assessment Test",
      description: "Standardized test for undergraduate admissions in the US.",
      duration: "3 hours",
      sections: ["Reading", "Writing & Language", "Math"],
      image: "/placeholder.svg?height=300&width=400",
      link: "/test-preparation/sat",
    },
  ]

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Instructors",
      description: "Learn from certified trainers with years of experience",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Comprehensive Material",
      description: "Updated study materials and practice tests",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Flexible Timings",
      description: "Weekend and evening batches available",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Proven Results",
      description: "95% of our students achieve their target scores",
    },
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Test <span className="text-gradient">Preparation</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Achieve your target scores with our expert coaching for IELTS, TOEFL, GRE, GMAT, PTE, and SAT
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Test Preparation?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-red-600 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tests Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Test Preparation Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive coaching programs designed to help you excel in standardized tests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tests.map((test, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={test.image || "/placeholder.svg"}
                    alt={`${test.name} preparation`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">{test.name}</h3>
                    <span className="text-sm text-gray-500">{test.duration}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{test.fullName}</p>
                  <p className="text-gray-600 mb-4">{test.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Test Sections:</h4>
                    <div className="flex flex-wrap gap-2">
                      {test.sections.map((section, idx) => (
                        <span key={idx} className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link href={test.link} className="w-full btn-primary block text-center">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Test Preparation?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful students who achieved their target scores with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Free Consultation
            </Link>
            <Link
              href="/test-preparation/demo"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
            >
              Take Free Demo Class
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
