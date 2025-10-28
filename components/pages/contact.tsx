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
            <section className="hero-gradient">
                <div className="px-4 min-h-[40vh]">
                    <div className="text-center m-auto max-w-4xl pt-32 pb-6">
                        <h1 className="text-3xl lg:text-[2.6rem] font-bold text-gray-900 mb-6">
                            Contact <span className="text-gradient">Us</span>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Ready to start your study abroad journey? Get in touch with our expert counselors today.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <div className="banner-sec banner-new-bg">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <div className="banner-content-sec">
                                    <h1>We&apos;re Here, <span>Let&apos;s Talk</span></h1>
                                    <p>
                                        {pageTitle || `No matter what's bothering you, Our experienced counsellors of the top study abroad destinations are here to solve your every doubt regarding studying abroad. Call us at any time or stop by one of our branches to see us.`}
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="contact-us-img text-center">
                                    <Image
                                        src="img/contact-us-img-new.svg"
                                        alt="contact-us"
                                        width={500}
                                        height={400}
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="contact-us-section py-70">
                <div className="container">
                    <div className="get-in-touch-section">
                        <h2 className="heading text-center d-block mb-3">Get in touch</h2>
                        <p className="descp text-center px-5">
                            {description || `We believe in being the best ally to our students. When we say, "quality education is a right and not a luxury," we mean it in every sense. No matter what's bothering you, Our experienced counsellors of the top study abroad destinations are here to solve your every doubt regarding studying abroad. Call us at any time or stop by one of our branches to see us.`}
                        </p>
                        <div className="get-in-touch-inner my-5">
                            <div className="row gy-4">
                                <div className="col-lg-4 col-sm-6">
                                    <div className="contact-us-box">
                                        <div className="contact-us-icon-outer">
                                            <div className="contact-us-icon-inner">
                                                <Image
                                                    src="img/call-icon.svg"
                                                    alt="Call"
                                                    width={24}
                                                    height={24}
                                                />
                                            </div>
                                        </div>
                                        <h4 className="text-center">Call Us:</h4>
                                        <h5><a href={`tel:${contact.contectOne}`}>{contact.contectOne}</a></h5>
                                        <h5><a href={`tel:${contact.contectTwo}`}>{contact.contectTwo}</a></h5>
                                        <h5><a href={`tel:${contact.contectThree}`}>{contact.contectThree}</a></h5>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-6">
                                    <div className="contact-us-box">
                                        <div className="contact-us-icon-outer">
                                            <div className="contact-us-icon-inner">
                                                <Image
                                                    src="img/email-icon.svg"
                                                    alt="Email"
                                                    width={24}
                                                    height={24}
                                                />
                                            </div>
                                        </div>
                                        <h4 className="text-center">Email Us:</h4>
                                        <h5><a href={`mailto:${contact.email}`}>{contact.email}</a></h5>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-12">
                                    <div className="contact-us-box">
                                        <div className="contact-us-icon-outer">
                                            <div className="contact-us-icon-inner">
                                                <Image
                                                    src="img/building-icon.svg"
                                                    alt="Office"
                                                    width={24}
                                                    height={24}
                                                />
                                            </div>
                                        </div>
                                        <h4 className="text-center">Office Address:</h4>
                                        <h5>
                                            <a href="https://maps.app.goo.gl/APvf2GEjLDNkWuCu9" target="_blank" rel="noopener noreferrer">
                                                {contact.officeAdress}
                                            </a>
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="our-branch-section my-5">
                            <h2 className="heading text-center d-block pb-3">Our Branches</h2>

                            {/* National Offices */}
                            {nationalOffices.length > 0 && (
                                <>
                                    <div className="row gy-4 justify-content-center">
                                        {nationalOffices.map((office, index) => (
                                               <div className="col-md-4" key={index}>
                                        <div className="contact-us-box our-branch-box">
                                            <div className="contact-us-icon-outer">
                                                <div className="contact-us-icon-inner">
                                                    <Image
                                                        src="img/building-icon.svg"
                                                        alt="Branch"
                                                        width={24}
                                                        height={24}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <h4>{office.officeCity}</h4>
                                                <p className="descp text-start">{office.officeAdress}</p>
                                            </div>
                                        </div>
                                    </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* International Offices */}
                            {internationalOffices.length > 0 && (
                                <>
                                    <h3 className="heading text-center d-block pb-3 pt-6">International Branches</h3>
                                    <div className="row gy-4 justify-content-center">
                                        {internationalOffices.map((office, index) => (
                                                <div className="col-md-4" key={index}>
                                        <div className="contact-us-box our-branch-box">
                                            <div className="contact-us-icon-outer">
                                                <div className="contact-us-icon-inner">
                                                    <Image
                                                        src="img/building-icon.svg"
                                                        alt="Branch"
                                                        width={24}
                                                        height={24}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <h4>{office.officeCity}</h4>
                                                <p className="descp text-start">{office.officeAdress}</p>
                                            </div>
                                        </div>
                                    </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="gatewayabroad-map">
                            <div className="gatewayabroad-map-inner pt-5">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3557.848799804021!2d75.7769567!3d26.9082933!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db40cd42722ff%3A0xcfc3ab392fa9adf7!2sGateway%20Abroad%20Jaipur%20(Study%20Abroad%20Consultants%20and%20Coaching%20for%20IELTS%2C%20PTE%2C%20TOEFL%2CSELT%2C%20GRE%2CGMAT%20and%20SAT)!5e0!3m2!1sen!2sin!4v1702272800694!5m2!1sen!2sin"
                                    width={600}
                                    height={450}
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="contact-form-section banner-new-bg py-60" ref={section1Ref}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <div className="career-form-section-left contact-us-left-content">
                                <h2 className="heading mb-2">Get in touch</h2>
                                <p style={{ textAlign: 'left' }} className="descp">
                                    Please fill the below form to schedule a one to one counselling session<br />
                                    with our experts.
                                </p>
                                <div className="career-form-section-img mt-3">
                                    <Image
                                        src="img/get-in-touch-img.svg"
                                        alt="Get in touch"
                                        width={400}
                                        height={300}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="career-form-section-right">
                                <div className="career-form-inner students-info-right">
                                    <form onSubmit={handleUpdate}>
                                        <div className="input-field">
                                            <input
                                                type="text"
                                                name="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="form-control"
                                                placeholder="Name"
                                                required
                                            />
                                        </div>
                                        <div className="input-field">
                                            <input
                                                type="email"
                                                name="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="form-control"
                                                placeholder="Email"
                                                required
                                            />
                                        </div>
                                        <div className="input-field">
                                            <input
                                                type="text"
                                                name="phone"
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value)}
                                                className="form-control"
                                                placeholder="Mobile No."
                                                required
                                            />
                                        </div>
                                        <div className="input-field">
                                            <input
                                                type="text"
                                                name="city"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="form-control"
                                                placeholder="City"
                                                required
                                            />
                                        </div>
                                        <div className="input-field type-file-field">
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Message"
                                            />
                                        </div>
                                        <button type="submit">SUBMIT</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;