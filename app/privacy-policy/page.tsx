
import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, Users, FileText, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl md:text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-xl text-red-100 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how Gateway Abroad Educations protects and manages your personal information.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-lg p-8 md:p-12">
            {/* Last Updated */}
            <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 font-semibold">
                Last Updated: December 2023
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 text-red-600 mr-3" />
                Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                At Gateway Abroad Educations ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <span className="text-red-600 font-semibold">gatewayabroadeducations.com</span> and use our services.
              </p>
              <p className="text-gray-700">
                By accessing our website and using our services, you consent to the practices described in this Privacy Policy. Please read this policy carefully to understand our views and practices regarding your personal data.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 text-red-600 mr-3" />
                Information We Collect
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Personal Information</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      Full name and contact details
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      Email address and phone number
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      Academic background and qualifications
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      Passport and identification details
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      Financial information for payment processing
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Automatically Collected Information</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      IP address and browser type
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      Device information and operating system
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      Website usage data and analytics
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      Cookies and tracking technologies
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="w-6 h-6 text-red-600 mr-3" />
                How We Use Your Information
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-4 text-lg">Primary Purposes</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                    <p className="text-blue-800">Provide educational counseling and university admission services</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-semibold">2</span>
                    </div>
                    <p className="text-blue-800">Process visa applications and documentation</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-semibold">3</span>
                    </div>
                    <p className="text-blue-800">Communicate important updates and information</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-semibold">4</span>
                    </div>
                    <p className="text-blue-800">Improve our services and website experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sharing and Disclosure */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 text-red-600 mr-3" />
                Data Sharing and Disclosure
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="text-gray-700 space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2">•</span>
                  <span><strong>Educational Institutions:</strong> We share necessary information with universities and colleges for admission processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2">•</span>
                  <span><strong>Government Authorities:</strong> Required for visa processing and compliance with legal obligations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2">•</span>
                  <span><strong>Service Providers:</strong> Trusted partners who assist in delivering our services (under strict confidentiality agreements)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2">•</span>
                  <span><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</span>
                </li>
              </ul>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-800 mb-2">Encryption</h4>
                  <p className="text-green-700 text-sm">SSL encryption for data transmission</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-800 mb-2">Access Control</h4>
                  <p className="text-green-700 text-sm">Strict access controls and authentication</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-800 mb-2">Regular Audits</h4>
                  <p className="text-green-700 text-sm">Regular security assessments and updates</p>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal information:
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    <span className="text-purple-800">Right to access your personal data</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    <span className="text-purple-800">Right to correct inaccurate data</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    <span className="text-purple-800">Right to delete your personal data</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    <span className="text-purple-800">Right to withdraw consent</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    <span className="text-purple-800">Right to data portability</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    <span className="text-purple-800">Right to object to processing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us:
              </p>
              <ul className="text-gray-700 space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Remember your preferences and settings
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Analyze website traffic and usage patterns
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Improve our services and user experience
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Provide personalized content and recommendations
                </li>
              </ul>
              <p className="text-gray-700">
                You can control cookie preferences through your browser settings. However, disabling cookies may affect your experience on our website.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Mail className="w-6 h-6 text-red-600 mr-3" />
                Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> jaipur@gatewayabroad.in</p>
                <p><strong>Phone:</strong> +91-9166144321</p>
                <p><strong>Address:</strong> Gateway Abroad Educations, [105, first floor, Geetanjali Tower, Ajmer Road, Civil Lines, Jaipur, Rajasthan 302006]</p>
              </div>
            </div>

            {/* Policy Updates */}
            <div className="mt-8 p-6 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Policy Updates</h3>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website with a new effective date.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}