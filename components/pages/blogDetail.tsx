"use client"

import Link from 'next/link';
import { constant } from '@/constant/index.constant';
import { redirect, usePathname, useRouter } from 'next/navigation';
import ContactForm from './UkForm';

import { useEffect } from 'react';

export default function SingleBlogPage({
  blogData,
  similarBlogs,
  adjacentBlogs,
  sanitizedContent,
  slug
}: any) {

  const { prevBlog, nextBlog } = adjacentBlogs || {};

  if (!blogData || !blogData.Slug) {
    return (
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center`}>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-6">The requested blog post could not be found.</p>
        <Link
          href="/blog"
          className="bg-[#E12827] text-white px-6 py-3 rounded-md hover:bg-[#c82322] transition duration-200"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

 const pathname = usePathname();


 

  return (
    <>
      <div>
        {/* Hero Section with New Design */}
       <section className="hero-gradient py-8 relative z-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4 relative z-10">
              <Link
                href="/"
                className="hover:text-[#E12827] transition-colors"
              >
                Home
              </Link>
              <span>›</span>
              <Link
                href="/blog"
                className="hover:text-[#E12827] transition-colors"
              >
                Blog
              </Link>
              <span>›</span>
              <span className="text-gray-900 font-medium truncate">{blogData?.blogTitle}</span>
            </nav>

            {/* Blog Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blogData?.blogTitle}
            </h1>

            {/* Blog Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span>{new Date(blogData?.createdAt).toLocaleDateString()}</span>
              </div>
              {blogData?.category && (
                <div className="flex items-center space-x-2">
                  <span className="bg-[#E12827] bg-opacity-10 text-[#E12827] px-3 py-1 rounded-full text-xs font-medium">
                    {blogData.category}
                  </span>
                </div>
              )}
              <div>
                <span className='text-[#E12827] px-3 py-1 rounded-full text-sm font-bold'>Author - Admin</span>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Content Section */}
        <section className={`py-12 bg-gray-50 `}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="lg:w-8/12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Blog Image */}
                  <div className="mb-6">
                    <img
                      className="w-full h-auto"
                      src={`${constant.REACT_APP_URL}/api/uploads/${blogData.image}`}
                      alt={blogData?.blogTitle || 'Blog Image'}
                      loading="lazy"
                    />
                  </div>

                  {/* Blog Content */}
                  <div className="px-6 pb-8">
                    <div>
                      <style>{`
    .blog-html table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 15px;
    }

    .blog-html th,
    .blog-html td {
      border: 1px solid #e5e7eb;
      padding: 12px 14px;
      text-align: left;
      vertical-align: top;
    }
      .blog-html * a {
    text-decoration: underline;
    color : blue
}

    .blog-html th {
      background: #f3f4f6;
      font-weight: 600;
    }

    .blog-html tr:nth-child(even) {
      background-color: #fafafa;
    }

    .blog-html h2 {
      font-size: 26px;
      margin: 28px 0 12px;
      font-weight: 700;
    }

    .blog-html h3 {
      font-size: 20px;
      margin: 22px 0 10px;
      font-weight: 600;
    }

    .blog-html h4 {
      font-size: 18px;
      margin: 18px 0 8px;
      font-weight: 600;
    }

    .blog-html p {
      margin: 12px 0;
      line-height: 1.8;
    }

    .blog-html ul {
      margin-left: 22px;
      list-style: disc;
    }

    .blog-html ol {
      margin-left: 22px;
      list-style: decimal;
    }

    .blog-html li {
      margin: 6px 0;
    }

    .blog-html figure.table {
      overflow-x: auto;
      margin: 20px 0;
    }

    .blog-html strong {
      font-weight: 600;
    }
      html {
      scroll-behavior: smooth;
    }
  `}</style>

                      <div
                        className="prose prose-lg max-w-none blog-html"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                      />

                    </div>


                    {/* Blog Navigation */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-6 border-t border-gray-200">
                      {prevBlog ? (
                        <Link
                          href={`/blog-description/${prevBlog?.Slug}`}
                          className="flex items-center space-x-2 text-[#E12827] hover:text-[#c82322] transition duration-200 mb-4 sm:mb-0 font-medium"
                        >
                          <i className="fa fa-arrow-left"></i>
                          <span>Previous Post</span>
                        </Link>
                      ) : <div></div>}
                      {nextBlog ? (
                        <Link
                          href={`/blog-description/${nextBlog?.Slug}`}
                          className="flex items-center space-x-2 text-[#E12827] hover:text-[#c82322] transition duration-200 font-medium"
                        >
                          <span>Next Post</span>
                          <i className="fa fa-arrow-right"></i>
                        </Link>
                      ) : <div></div>}
                    </div>

                    {/* Share Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Share this post:</h4>
                      <div className="flex space-x-3 justify-between">
                        <div className='flex space-x-3'>
                          <a
                            target='_blank'
                            rel="noopener noreferrer"
                            href={`${constant.SOCIAL_MEDIA_LINK.FB}/?u=${encodeURIComponent(`${constant.BASE_URL}/blog-description/${blogData.Slug}`)}`}
                            className="w-10 h-10 bg-[#3b5998] text-white rounded-full flex items-center justify-center hover:bg-[#344e86] transition duration-200"
                          >
                            <i className="fa fa-facebook"></i>
                          </a>
                          <a
                            target='_blank'
                            rel="noopener noreferrer"
                            href={`${constant.SOCIAL_MEDIA_LINK.TWITTER}/?url=${encodeURIComponent(`${constant.BASE_URL}/blog-description/${blogData.Slug}`)}`}
                            className="w-10 h-10 bg-[#1da1f2] text-white rounded-full flex items-center justify-center hover:bg-[#0d95e8] transition duration-200"
                          >
                            <i className="fa fa-twitter"></i>
                          </a>
                          <a
                            target='_blank'
                            rel="noopener noreferrer"
                            href={`${constant.SOCIAL_MEDIA_LINK.LINKEDIN}${encodeURIComponent(`${constant.BASE_URL}/blog-description/${blogData.Slug}`)}`}
                            className="w-10 h-10 bg-[#0077b5] text-white rounded-full flex items-center justify-center hover:bg-[#00669c] transition duration-200"
                          >
                            <i className="fa fa-linkedin"></i>
                          </a>
                          <a
                            href={`mailto:?subject=${encodeURIComponent(blogData?.blogTitle)}&body=${encodeURIComponent(`${constant.BASE_URL}/blog-description/${blogData.Slug}`)}`}
                            className="w-10 h-10 bg-[#EA4335] text-white rounded-full flex items-center justify-center hover:bg-[#d33426] transition duration-200"
                          >
                            <i className="fa fa-envelope"></i>
                          </a>
                        </div>

                        <div>
                          <span className='text-[#E12827] px-3 py-1 rounded-full text-sm font-bold'>~ By Admin</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8 p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Leave a Reply</h4>
                  <p className="text-gray-600 mb-6">Your email address will not be published.</p>
                  <form className="space-y-4">
                    <div>
                      <textarea
                        placeholder="Your Comment *"
                        className="w-full flex h-[200px] bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full py-[17px] px-4 text-gray-900 transition-colors"
                        rows={5}
                        required
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="bg-[#E12827] text-white px-8 py-3 rounded-md hover:bg-[#c82322] transition duration-200 font-semibold"
                      >
                        POST COMMENT
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-4/12">
                <div className="space-y-6 sticky top-24">
                  {/* Search Box */}
                  {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h5 className="text-lg font-bold text-gray-900 mb-4">Search</h5>
                    <div className="relative">
                      <input
                        type="search"
                        name="search"
                        placeholder="Search..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-md pr-12 focus:ring-2 focus:ring-[#E12827] focus:border-transparent transition duration-200 font-normal"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#E12827] transition duration-200">
                        <i className="fa fa-search" />
                      </button>
                    </div>
                  </div> */}

                  <ContactForm type="article"/>

                  {/* Similar Blogs */}
                  {similarBlogs && similarBlogs.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h5 className="text-lg font-bold text-gray-900 mb-4">Similar Blogs</h5>
                      <div className="space-y-3">
                        {similarBlogs.map((blog) => (
                          <Link
                            key={blog.Slug}
                            href={`/blog-description/${blog.Slug}`}
                            className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:border-[#E12827] hover:bg-red-50 transition-all duration-200 group"
                          >
                            <div className="flex-shrink-0 w-[7rem] h-[4rem] bg-gray-200 rounded-lg overflow-hidden">
                              <img
                                className="w-full h-full object-fill transition duration-300"
                                src={`${constant.REACT_APP_URL}/api/uploads/${blog.image}`}
                                alt={blog?.blogTitle || 'Similar Blog Image'}
                                loading="lazy"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h6 className="">
                                {blog.blogTitle}
                              </h6>
                              <p className="text-xs text-gray-500 font-normal">
                                {new Date(blog.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Latest Posts */}
                  {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h5 className="text-lg font-bold text-gray-900 mb-4">Latest Post</h5>
                    <div className="space-y-3">
                      {similarBlogs && similarBlogs.slice(0, 4).map((blog) => (
                        <Link
                          key={blog.Slug}
                          href={`/blog-description/${blog.Slug}`}
                          className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:border-[#E12827] hover:bg-red-50 transition-all duration-200 group"
                        >
                          <div className="flex-shrink-0 w-[7rem] h-[4rem] bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              className="w-full h-full object-fill transition duration-300"
                              src={`${constant.REACT_APP_URL}/api/uploads/${blog.image}`}
                              alt={blog?.blogTitle || 'Latest Post Image'}
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h6 className="font-semibold text-sm text-gray-900 group-hover:text-[#E12827] transition duration-200 leading-tight line-clamp-2 mb-1">
                              {blog.blogTitle}
                            </h6>
                            <p className="text-xs text-gray-500 font-normal">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div> */}

                  {/* Categories */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h5 className="text-lg font-bold text-gray-900 mb-4">Categories</h5>
                    <div className="flex flex-wrap gap-4">
                      {['GMAT', 'TOEFL', 'IELTS', 'GRE', 'PTE', 'SAT', 'SPOKEN ENGLISH'].map((category) => (
                        <Link
                          key={category}
                          href={`/blog?category=${category}`}
                          className="flex items-center bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-[#E12827] hover:text-white transition duration-200 text-base font-normal"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Tags Cloud */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h5 className="text-base font-bold text-gray-900 mb-4">Tags</h5>
                    <div className="flex flex-wrap gap-2">
                      {['Study Abroad', 'Education', 'University', 'Scholarship', 'Visa', 'Career', 'Student Life'].map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${tag.toLowerCase()}`}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-[#E12827] hover:text-white transition duration-200 font-normal"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====== CTA Section ====== */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="bg-[#fbe7ea] rounded-2xl sm:rounded-[24px] shadow-lg mx-auto w-full max-w-[1127px]">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                  <div className="w-full lg:w-[48%]">
                    <div className="text-center lg:text-left pl-[17px]">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[36px] font-bold mb-4 text-[#D71635] lg:leading-[37px]">
                        Have a question about GMAT?
                      </h2>
                      <p className="text-base sm:text-lg lg:text-[18px] mb-4 sm:mb-6 text-[#666276] font-normal">
                        Want some help figuring out what kind of prep service is right for you?
                      </p>
                      <a
                        href="/contact"
                        className="inline-block bg-[#d71635] text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-3xl text-sm sm:text-base font-bold shadow-[0_0_8px_0_rgba(0,0,0,0.2)] hover:bg-[#b5122b] transition-all duration-300"
                      >
                        Help and Support
                      </a>
                    </div>
                  </div>
                  <div className="w-full lg:w-[38%]">
                    <div className="flex justify-center">
                      <img
                        src="/img/help-support-img.svg"
                        alt="Study Abroad Help"
                        className="w-full max-w-xs sm:max-w-sm lg:max-w-[25rem]"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}