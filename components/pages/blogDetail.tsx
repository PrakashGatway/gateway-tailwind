'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import PageServices from '@/services/PageServices';
import { constant } from '@/constant/index.constant';
import DOMPurify from 'dompurify';
import Loader from '../loader';
import { Noto_Sans } from 'next/font/google';

// Configure Noto Sans font
const notoSans = Noto_Sans({
  weight: ['400', '500', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

const sanitizeContent = (content) => {
  return { __html: DOMPurify.sanitize(content) };
};

export default function SingleBlogPage({ data }) {
  const router = useRouter();
  const params = useParams();
  const { slug: id } = params;

  const [blogData, setBlogData] = useState([]);
  const [singleBlogData, setSingleBlogData] = useState({});
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAdjacentBlogs = () => {
    const allBlogs = [...(Array.isArray(blogData) ? blogData : []), singleBlogData]
      .filter(blog => blog && blog.Slug)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const currentIndex = allBlogs.findIndex(blog => blog.Slug === id);
    return {
      prevBlog: allBlogs[currentIndex + 1] || null,
      nextBlog: allBlogs[currentIndex - 1] || null
    };
  };
  const { prevBlog, nextBlog } = getAdjacentBlogs();

  useEffect(() => {
    setSingleBlogData(data);
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [allBlogsResponse] = await Promise.all([
        PageServices.getBlogData({ page: 1, category: 'All' }),
      ]);

      if (allBlogsResponse?.status === 'success') {
        const currentBlog = data;
        const allBlogs = allBlogsResponse?.data?.blog || [];
        const filteredBlogs = allBlogs.filter(x => x.Slug !== currentBlog?.Slug);
        setBlogData(filteredBlogs);

        const currentCategory = currentBlog?.category;
        const similar = filteredBlogs
          .filter(blog => blog.category === currentCategory)
          .slice(0, 3);
        setSimilarBlogs(similar);
      } else {
        console.error("Failed to fetch current blog data");
        router.push('/blog');
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!singleBlogData || !singleBlogData.Slug) {
    return (
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center ${notoSans.className}`}>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-6">The requested blog post could not be found.</p>
        <Link href="/blog" className="bg-[#E12827] text-white px-6 py-3 rounded-md hover:bg-[#c82322] transition duration-200">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={notoSans.className}>
        {/* Hero Section with New Design */}
        <section className="hero-gradient py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <Link href="/" className="hover:text-[#E12827] transition-colors">Home</Link>
              <span>›</span>
              <Link href="/blog" className="hover:text-[#E12827] transition-colors">Blog</Link>
              <span>›</span>
              <span className="text-gray-900 font-medium truncate">{singleBlogData?.blogTitle}</span>
            </nav>

            {/* Blog Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {singleBlogData?.blogTitle}
            </h1>

            {/* Blog Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span>{new Date(singleBlogData?.createdAt).toLocaleDateString()}</span>
              </div>
              {singleBlogData?.category && (
                <div className="flex items-center space-x-2">
                  <span className="bg-[#E12827] bg-opacity-10 text-[#E12827] px-3 py-1 rounded-full text-xs font-medium">
                    {singleBlogData.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Blog Content Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="lg:w-8/12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Blog Image */}
                  <div className="mb-6">
                    <img
                      className="w-full h-auto"
                      src={`${constant.REACT_APP_URL}/uploads/${singleBlogData.image}`}
                      alt={singleBlogData?.blogTitle || 'Blog Image'}
                    />
                  </div>

                  {/* Blog Content */}
                  <div className="px-6 pb-8">
                    <div
                      className={`prose prose-lg max-w-none ${notoSans.className}`}
                      dangerouslySetInnerHTML={sanitizeContent(singleBlogData?.blogDescription || '')}
                    />

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
                      <div className="flex space-x-3">
                        <Link
                          target='_blank'
                          href={`${constant.SOCIAL_MEDIA_LINK.FB}/?u=${encodeURIComponent(`${constant.REACT_APP_URL}/blog-description/${singleBlogData.Slug}`)}`}
                          className="w-10 h-10 bg-[#3b5998] text-white rounded-full flex items-center justify-center hover:bg-[#344e86] transition duration-200"
                        >
                          <i className="fa fa-facebook"></i>
                        </Link>
                        <Link
                          target='_blank'
                          href={`${constant.SOCIAL_MEDIA_LINK.TWITTER}/?url=${encodeURIComponent(`${constant.REACT_APP_URL}/blog-description/${singleBlogData.Slug}`)}`}
                          className="w-10 h-10 bg-[#1da1f2] text-white rounded-full flex items-center justify-center hover:bg-[#0d95e8] transition duration-200"
                        >
                          <i className="fa fa-twitter"></i>
                        </Link>
                        <Link
                          target='_blank'
                          href={`${constant.SOCIAL_MEDIA_LINK.LINKEDIN}${encodeURIComponent(`${constant.REACT_APP_URL}/blog-description/${singleBlogData.Slug}`)}`}
                          className="w-10 h-10 bg-[#0077b5] text-white rounded-full flex items-center justify-center hover:bg-[#00669c] transition duration-200"
                        >
                          <i className="fa fa-linkedin"></i>
                        </Link>
                        <Link
                          target='_blank'
                          href={`mailto:?subject=${encodeURIComponent(singleBlogData?.blogTitle)}&body=${encodeURIComponent(`${constant.REACT_APP_URL}/blog-description/${singleBlogData.Slug}`)}`}
                          className="w-10 h-10 bg-[#EA4335] text-white rounded-full flex items-center justify-center hover:bg-[#d33426] transition duration-200"
                        >
                          <i className="fa fa-envelope"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8 p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Leave a Reply</h4>
                  <p className="text-gray-600 mb-6">Your email address will not be published.</p>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="name"
                          placeholder="Your Name *"
                          className="w-full flex h-10 bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full py-[17px] px-4 text-gray-900 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Your Email *"
                          className="w-full flex h-10 bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full py-[17px] px-4 text-gray-900 transition-colors"
                          required
                        />
                      </div>
                    </div>
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
                <div className="space-y-6">
                  {/* Search Box */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                  </div>

                  {/* Similar Blogs */}
                  {similarBlogs.length > 0 && (
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
                                className="w-full h-full object-fill  transition duration-300"
                                src={`${constant.REACT_APP_URL}/uploads/${blog.image}`}
                                alt={blog?.blogTitle || 'Similar Blog Image'}
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
                    </div>
                  )}

                  {/* Latest Posts */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h5 className="text-lg font-bold text-gray-900 mb-4">Latest Post</h5>
                    <div className="space-y-3">
                      {Array.isArray(blogData) && blogData.slice(0, 4).map((blog) => (
                        <Link
                          key={blog.Slug}
                          href={`/blog-description/${blog.Slug}`}
                          className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:border-[#E12827] hover:bg-red-50 transition-all duration-200 group"
                        >
                          <div className="flex-shrink-0 w-[7rem] h-[4rem] bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              className="w-full h-full object-fill  transition duration-300"
                              src={`${constant.REACT_APP_URL}/uploads/${blog.image}`}
                              alt={blog?.blogTitle || 'Latest Post Image'}
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
                  </div>

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
              {/* Content container with specific padding */}
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