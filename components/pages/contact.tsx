"use client";

import React, { useEffect, useState, useRef } from 'react';
import PageServices from '@/services/PageServices';
import useAsync from '@/hooks/useAsync';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGlobal } from '@/hooks/AppStateContext';

function Contact() {
    const router = useRouter();

    const { contactPage: data, contactSettings: contactData, faqData: faq } = useGlobal();

    const [contact, setContact] = useState({});
    const [pageTitle, setPageTitle] = useState('');
    const [description, setDescription] = useState('');
    const [officeData, setOfficeData] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [mobile, setMobile] = useState('');
    const [message, setMessage] = useState('');

    const section1Ref = useRef(null);

    useEffect(() => {
        if (data?.page) {
            setPageTitle(data.page.pageTitle || '');
            setDescription(data.page.description || '');
        }
        if (contactData?.setting) {
            setContact(contactData.setting || {});
        }
        if (faq?.office) {
            setOfficeData(faq.office || []);
        }
    }, [data, contactData, faq]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!name || !email || !mobile || !city || !message) {
            alert('All fields are required');
            return;
        }

        try {
            const createJob = await PageServices.createForme({
                name,
                email,
                mobileNo: mobile,
                city,
                message,
                type: 'contact'
            });

            if (createJob.status === 'success') {
                setName('');
                setEmail('');
                setMobile('');
                setCity('');
                setMessage('');
                router.push('/thank-you');
            } else {
                alert('Something went wrong');
            }
        } catch (error) {
            console.error("Something went wrong", error);
        }
    };

    const nationalOffices = officeData.filter((office) => office.officeType === 'National');
    const internationalOffices = officeData.filter((office) => office.officeType === 'InterNational');

    return (
        <div>
            {/* Hero Section */}
            <section className="hero-gradient pt-[25px]">
                <div className="min-h-[40vh] flex items-center">
                    <div className="max-w-7xl mx-auto px-4 w-full text-center py-16">
                        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Contact <span className="text-gradient">Us</span>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                            Ready to start your study abroad journey? Get in touch with our expert counselors today.
                        </p>
                    </div>
                </div>
            </section>

            {/* Banner Section */}
            <section className="py-12 relative z-0" style={{
                background: 'linear-gradient(180deg, rgb(250 242 248))'
            }}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="lg:w-1/2">
                            <div className="text-center lg:text-left">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                    We're Here, <span className="text-red-600">Let's Talk</span>
                                </h1>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {pageTitle || `No matter what's bothering you, Our experienced counsellors of the top study abroad destinations are here to solve your every doubt regarding studying abroad. Call us at any time or stop by one of our branches to see us.`}
                                </p>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="flex justify-center">
                                <Image
                                    src="/img/contact-us-img-new.svg"
                                    alt="contact-us"
                                    width={500}
                                    height={400}
                                    className="w-full max-w-md lg:max-w-full"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Get in Touch Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Get in touch</h2>
                        <p className="text-gray-600 text-lg max-w-4xl mx-auto">
                            {description || `We believe in being the best ally to our students. When we say, "quality education is a right and not a luxury," we mean it in every sense. No matter what's bothering you, Our experienced counsellors of the top study abroad destinations are here to solve your every doubt regarding studying abroad. Call us at any time or stop by one of our branches to see us.`}
                        </p>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
                        {/* Call Us */}
                        <div className="bg-white rounded-lg font-bold  p-6 text-center border border-[#bdbdbd]">
                            <div className="group w-[90px] h-[90px] bg-[#faf2f2] rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-red-600 transition-colors duration-300">
                                {/* Outer Circle */}
                                <div className="w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center">
                                    {/* Inner Circle */}
                                    <div className="w-[50px] h-[50px] bg-[#faf2f2] rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                                        {/* Icon */}
                                        <Image
                                            src="/img/call-icon.svg"
                                            alt="Call"
                                            width={20}
                                            height={20}
                                            className="group-hover:invert group-hover:brightness-0 transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-4 text-red-600">Call Us:</h4>
                            <div className="space-y-2">
                                <h5 className="text-gray-700">
                                    <a href={`tel:${contact.contectOne}`} className="hover:text-red-600 transition-colors">
                                        {contact.contectOne}
                                    </a>
                                </h5>
                                <h5 className="text-gray-700">
                                    <a href={`tel:${contact.contectTwo}`} className="hover:text-red-600 transition-colors">
                                        {contact.contectTwo}
                                    </a>
                                </h5>
                                <h5 className="text-gray-700">
                                    <a href={`tel:${contact.contectThree}`} className="hover:text-red-600 transition-colors">
                                        {contact.contectThree}
                                    </a>
                                </h5>
                            </div>
                        </div>

                        {/* Email Us */}
                        <div className="bg-white rounded-lg  p-6 font-bold text-center border border-[#bdbdbd]">
                            <div className="group w-[90px] h-[90px] bg-[#faf2f2] rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-red-600 transition-colors duration-300">
                                {/* Outer Circle */}
                                <div className="w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center">
                                    {/* Inner Circle */}
                                    <div className="w-[50px] h-[50px] bg-[#faf2f2] rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                                        {/* Icon */}
                                        <Image
                                            src="/img/email-icon.svg"
                                            alt="Call"
                                            width={20}
                                            height={20}
                                            className="group-hover:invert group-hover:brightness-0 transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-4 text-red-600">Email Us:</h4>
                            <h5 className="text-gray-700">
                                <a href={`mailto:${contact.email}`} className="hover:text-red-600 transition-colors">
                                    {contact.email}
                                </a>
                            </h5>
                        </div>

                        {/* Office Address */}
                        <div className="bg-white rounded-lg font-bold p-6 text-center border border-[#bdbdbd]">
                            <div className="group w-[90px] h-[90px] bg-[#faf2f2] rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-red-600 transition-colors duration-300">
                                {/* Outer Circle */}
                                <div className="w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center">
                                    {/* Inner Circle */}
                                    <div className="w-[50px] h-[50px] bg-[#faf2f2] rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                                        {/* Icon */}
                                        <Image
                                            src="/img/building-icon.svg"
                                            alt="Call"
                                            width={20}
                                            height={20}
                                            className="group-hover:invert group-hover:brightness-0 transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-4 text-red-600">Office Address:</h4>
                            <h5 className="text-gray-700">
                                <a
                                    href="https://maps.app.goo.gl/APvf2GEjLDNkWuCu9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-red-600 transition-colors"
                                >
                                    {contact.officeAdress}
                                </a>
                            </h5>
                        </div>
                    </div>
                    {/* Branches Section */}
                    <div className="mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">Our Branches</h2>

                        {/* National Offices */}
                        {nationalOffices.length > 0 && (
                            <div className="mb-12">
                                <div className="flex flex-wrap justify-center gap-6">
                                    {nationalOffices.map((office, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-lg  p-8 border border-[#bdbdbd] w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="group w-[90px] h-[90px] bg-[#faf2f2] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-red-600 transition-colors duration-300">
                                                    {/* Outer Circle */}
                                                    <div className="w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center">
                                                        {/* Inner Circle */}
                                                        <div className="w-[50px] h-[50px] bg-[#faf2f2] rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                                                            {/* Icon */}
                                                            <Image
                                                                src="/img/building-icon.svg"
                                                                alt="Branch"
                                                                width={20}
                                                                height={20}
                                                                className="group-hover:invert group-hover:brightness-0 transition-all duration-300"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-900 mb-2 text-red-600">{office.officeCity}</h4>
                                                    <p className="text-gray-600 font-bold text-sm leading-relaxed">{office.officeAdress}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* International Offices */}
                        {internationalOffices.length > 0 && (
                            <div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-8">International Branches</h3>
                                <div className="flex flex-wrap justify-center gap-6">
                                    {internationalOffices.map((office, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-lg shadow-lg p-6 border border-[#bdbdbd] w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-[90px] h-[90px] bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-red-600 transition-colors duration-300">
                                                    <Image
                                                        src="/img/building-icon.svg"
                                                        alt="Branch"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{office.officeCity}</h4>
                                                    <p className="text-gray-600 text-sm leading-relaxed">{office.officeAdress}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Map Section */}
                    <div className="mb-16">
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3557.848799804021!2d75.7769567!3d26.9082933!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db40cd42722ff%3A0xcfc3ab392fa9adf7!2sGateway%20Abroad%20Jaipur%20(Study%20Abroad%20Consultants%20and%20Coaching%20for%20IELTS%2C%20PTE%2C%20TOEFL%2CSELT%2C%20GRE%2CGMAT%20and%20SAT)!5e0!3m2!1sen!2sin!4v1702272800694!5m2!1sen!2sin"
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-16 bg-[#faf2f8]" ref={section1Ref}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* Left Content */}
                        <div className="lg:w-1/2">
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Get in touch</h2>
                                <p className="text-gray-600 text-lg mb-8">
                                    Please fill the below form to schedule a one to one counselling session<br />
                                    with our experts.
                                </p>
                                <div className="flex justify-center lg:justify-start">
                                    <Image
                                        src="/img/get-in-touch-img.svg"
                                        alt="Get in touch"
                                        width={400}
                                        height={300}
                                        className="w-full max-w-sm lg:max-w-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Form */}
                        <div className="lg:w-1/2">
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full flex h-10 bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full py-2  px-4 text-gray-900 transition-colors"
                                            placeholder="Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full flex h-10 bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full py-2  px-4 text-gray-900 transition-colors"
                                            placeholder="Email"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            className="w-full flex h-10 bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full py-2  px-4 text-gray-900 transition-colors"
                                            placeholder="Mobile No."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="city"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full flex h-10 bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full py-2  px-4 text-gray-900 transition-colors"
                                            placeholder="City"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            className="w-full px-4 py-3 bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full py-2  px-4 text-gray-900 transition-colors"
                                            rows={4}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Message"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300"
                                    >
                                        SUBMIT
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;