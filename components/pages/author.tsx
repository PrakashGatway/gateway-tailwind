"use client"

import { useState } from "react"
import ContactForm from "./UkForm"
import { constant } from "@/constant/index.constant"
import Link from "next/link"


export default function AuthorPage({ initialData, latestArticles }) {
    const [blogs, setblogs] = useState(initialData?.data?.blog)
    const [article, setarticle] = useState(latestArticles)
    const [active, setactive] = useState("blogs")

    const getCoverImageUrl = (coverImage: string) => {
        if (!coverImage) return "/img/placeholder-blog.jpg";
        if (coverImage.startsWith("http")) return coverImage;
        return `https://uat.gatewayabroadeducations.com/uploads/${coverImage}`;
    };

    return (
        <>
            <section className="bg-white min-h-screen mt-32">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-[2fr_1fr] gap-8">

                        {/* LEFT SIDE */}
                        <div>
                            {/* Author Card */}
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
                                <section className="bg-white rounded-3xl overflow-hidden shadow-sm border">
                                    {/* Header */}
                                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#D71635] via-[#E84A5F] to-[#FFB347] px-8 py-10">
                                        <div className="absolute inset-0 bg-black/10"></div>

                                        <div className="relative flex flex-col md:flex-row items-center md:items-center gap-8">

                                            {/* Profile Image */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcxSIkbDpRi11M201gRDRamK_4nK4D1rGbeGT3LUJM3g&s=10"
                                                    alt="Author"
                                                    className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-2xl"
                                                />
                                            </div>

                                            {/* Author Info */}
                                            <div className="flex-1 text-center md:text-left">

                                                <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-xm font-medium text-white border border-white/30">
                                                    🎓 Teacher & Study Abroad Expert
                                                </span>

                                                <h1 className="mt-4 text-xl font-bold text-white">
                                                    Sakshi Taneja
                                                </h1>

                                                <p className="mt-2 text-lg text-white/90">
                                                    Content Writer & International Education Specialist
                                                </p>

                                                {/* Stats */}
                                                <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-5">

                                                    <div className="bg-white/15 backdrop-blur-lg rounded-2xl px-2 py-4 text-center min-w-[120px] border border-white/20">
                                                        <h3 className="text-xl font-bold text-white">120+</h3>
                                                        <p className="text-white/80 text-xm mt-1">
                                                            Articles
                                                        </p>
                                                    </div>

                                                    <div className="bg-white/15 backdrop-blur-lg rounded-2xl px-2 py-4 text-center min-w-[120px] border border-white/20">
                                                        <h3 className="text-xl font-bold text-white">500K</h3>
                                                        <p className="text-white/80 text-xm mt-1">
                                                            Readers
                                                        </p>
                                                    </div>

                                                    <div className="bg-white/15 backdrop-blur-lg rounded-2xl px-2 py-4 text-center min-w-[120px] border border-white/20">
                                                        <h3 className="text-xl font-bold text-white">5+</h3>
                                                        <p className="text-white/80 text-xm mt-1">
                                                            Years Experience
                                                        </p>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile */}
                                    <div className="px-8 pb-8">
                                        <div className="-mt-16 flex flex-col lg:flex-row gap-8">
                                            {/* Left */}


                                            {/* Right */}
                                            <div className="flex-1 pt-4">
                                                <h2 className="text-2xl font-bold mb-6">
                                                    About the Author
                                                </h2>

                                                <div className="space-y-5 text-gray-600 leading-8">

                                                    <div>
                                                        <span className="font-semibold text-gray-900">
                                                            Education:
                                                        </span>{" "}
                                                        Academic Background in Education & International Studies
                                                    </div>

                                                    <div>
                                                        <span className="font-semibold text-gray-900">
                                                            Expertise:
                                                        </span>{" "}
                                                        Study Abroad Guidance, University Admissions, Student Visa
                                                        Processes, IELTS, TOEFL & PTE Preparation, Scholarship
                                                        Guidance, Career Counseling, and Educational Content Writing.
                                                    </div>

                                                    <p>
                                                        Sakshi Taneja is a dedicated <strong>Teacher</strong> and
                                                        <strong> Content Writer</strong> at
                                                        <strong> Gateway Abroad Education</strong>, specializing in
                                                        international education and study abroad counseling. She
                                                        simplifies complex admission processes into practical,
                                                        student-friendly guidance.
                                                    </p>

                                                    <p>
                                                        Her expertise includes university admissions, student visa
                                                        guidance, scholarship opportunities, and preparation for
                                                        IELTS, TOEFL, and PTE examinations. Through detailed and
                                                        research-backed articles, she helps students confidently
                                                        pursue their dream of studying abroad.
                                                    </p>

                                                    <p>
                                                        Passionate about global education, Sakshi creates
                                                        easy-to-understand resources that empower aspiring
                                                        international students to make informed decisions and
                                                        successfully navigate every stage of their overseas
                                                        education journey.
                                                    </p>

                                                    <div className="pt-4 border-t">
                                                        <span className="font-semibold text-gray-900">
                                                            Specializations:
                                                        </span>

                                                        <div className="flex flex-wrap gap-3 mt-4">
                                                            {[
                                                                "Study Abroad",
                                                                "University Admissions",
                                                                "Student Visa",
                                                                "IELTS",
                                                                "TOEFL",
                                                                "PTE",
                                                                "Scholarship",
                                                                "Career Counseling",
                                                                "International Education",
                                                            ].map((item) => (
                                                                <span
                                                                    key={item}
                                                                    className="px-4 py-2 rounded-full bg-red-50 text-[#D71635] text-xm font-medium"
                                                                >
                                                                    {item}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>


                                {/* Latest Articles */}
                                <div className="mt-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-3xl font-bold text-gray-900">
                                            Recent Articles & Blogs
                                        </h2>

                                        <span className="text-xm text-gray-500">
                                            Latest writings from this author
                                        </span>
                                    </div>
                                    <div className="inline-flex items-center p-1 bg-gray-100 rounded-2xl shadow-sm">
                                        <button
                                            onClick={() => setactive("blogs")}
                                            className={`relative px-6 py-3 rounded-xl text-xm font-semibold transition-all duration-300 ${active === "blogs"
                                                    ? "bg-[#D71635] text-white shadow-md scale-105"
                                                    : "text-gray-600 hover:text-[#D71635] hover:bg-white"
                                                }`}
                                        >
                                            Blogs
                                        </button>

                                        <button
                                            onClick={() => setactive("articles")}
                                            className={`relative px-6 py-3 rounded-xl text-xm font-semibold transition-all duration-300 ${active === "articles"
                                                    ? "bg-[#D71635] text-white shadow-md scale-105"
                                                    : "text-gray-600 hover:text-[#D71635] hover:bg-white"
                                                }`}
                                        >
                                            Articles
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {active === "blogs" ?
                                            blogs.map((blog, index) => (
                                                <Link href={`/blog-description/${blog.Slug}`}>
                                                    <article
                                                        key={index}
                                                        className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                                    >
                                                        <div className="flex flex-col md:flex-row">
                                                            {/* Image */}
                                                            <div className="md:w-[180px] flex-shrink-0 flex items-center justify-center bg-white">
                                                                <img
                                                                    src={`${constant.REACT_APP_URL}/api/uploads/${blog.image}`}
                                                                    alt={blog.blogTitle}
                                                                    className="w-full h-100 object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1 p-5 flex flex-col justify-center">
                                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                                    <span className="px-3 py-1 rounded-full bg-red-50 text-[#D71635] text-xs font-medium">
                                                                        {blog.category}
                                                                    </span>

                                                                    {blog.createdAt && (
                                                                        <span className="text-xm text-gray-400">
                                                                            {new Date(blog.createdAt).toLocaleDateString("en-IN")}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#D71635] transition-colors duration-300">
                                                                    {blog.blogTitle}
                                                                </h3>

                                                                <p className="mt-2 text-gray-600 leading-7 line-clamp-4">
                                                                    {blog?.descriptions}
                                                                </p>
                                                            </div>
                                                        </div>

                                                    </article>
                                                </Link>
                                            )) : active === "articles" ?
                                                article.map((article, index) => (
                                                    <Link href={`/article/${article.slug}`}>
                                                        <article
                                                            key={index}
                                                            className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                                        >
                                                            <div className="flex flex-col md:flex-row">
                                                                {/* Image */}
                                                                <div className="md:w-[180px] flex-shrink-0 flex items-center justify-center bg-white">
                                                                    <img
                                                                        src={`${getCoverImageUrl(article.coverImage)}`}
                                                                        alt={article.title}
                                                                        className="w-full h-100 object-cover group-hover:scale-105 transition-transform duration-500"
                                                                    />
                                                                </div>

                                                                {/* Content */}
                                                                <div className="flex-1 p-5 flex flex-col justify-center">
                                                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                                                        <span className="px-3 py-1 rounded-full bg-red-50 text-[#D71635] text-xs font-medium">
                                                                            {article.category.name}
                                                                        </span>

                                                                        {article.createdAt && (
                                                                            <span className="text-xm text-gray-400">
                                                                                {new Date(article.createdAt).toLocaleDateString("en-IN")}
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#D71635] transition-colors duration-300">
                                                                        {article.title}
                                                                    </h3>

                                                                    <p className="mt-2 text-gray-600 leading-7 line-clamp-4">
                                                                        {article?.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </article>
                                                    </Link>
                                                ))
                                                : null

                                        }

                                    </div>
                                </div>
                            </div>




                        </div>

                        {/* RIGHT SIDE */}
                        <div>
                            <div className="sticky top-6">
                                <ContactForm />


                                {/* Newsletter */}
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mt-6">
                                    <h3 className="font-bold text-xl">
                                        Newsletter
                                    </h3>

                                    <p className="text-gray-500 text-xm mt-2">
                                        Get latest blogs and study abroad
                                        updates directly in your inbox.
                                    </p>

                                    <input
                                        type="email"
                                        placeholder="Enter Email"
                                        className="w-full h-11 border border-gray-200 rounded-xl px-4 mt-4"
                                    />

                                    <button className="w-full h-11 rounded-xl bg-gray-900 text-white mt-3">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}