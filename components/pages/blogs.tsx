"use client"

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import PageServices from "@/services/PageServices";
import { constant } from "@/constant/index.constant";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "@/components/loader";
import BlogCard from "./usable components/BlogCard";

const Blog = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") || "All";
  const pageParam = Number(searchParams.get("page") || 1);

  const blogsPerPage = 12;

  const [blogs, setBlogs] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateUrlParams = (page: number, category: string) => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (page > 1) params.set("page", page.toString());
    router.push(`/blog?${params.toString()}`);
  };

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    return () => container.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  const fetchBlogs = useCallback(
    async (page: number, category: string, search: string) => {
      try {
        setLoading(true);
        const res = await PageServices.getBlogData({
          page,
          limit: blogsPerPage,
          category,
          search,
        });

        setBlogs(res.data.blog || []);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    },
    [blogsPerPage]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(pageParam);
    setSelectedCategory(categoryParam);
    fetchBlogs(pageParam, categoryParam, debouncedSearchQuery);
  }, [pageParam, categoryParam, debouncedSearchQuery, fetchBlogs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    setSelectedCategory(category);
    setCurrentPage(1);
    updateUrlParams(1, category);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams(page, selectedCategory);
  };

  const renderPagination = () => {
    const pages: (number | string)[] = [];
    const visibleRange = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - visibleRange && i <= currentPage + visibleRange)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - visibleRange - 1 ||
        i === currentPage + visibleRange + 1
      ) {
        pages.push("...");
      }
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-[1.25rem] border ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50 border-gray-300'}`}
        >
          &laquo;
        </button>
        
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={i} className="px-3 py-1">...</span>
          ) : (
            <button
              key={i}
              onClick={() => handlePageChange(Number(page))}
              className={`px-3 py-1 rounded-[1.25rem] border ${currentPage === page ? 'bg-red-600 text-white border-red-600' : 'bg-white hover:bg-gray-50 border-gray-300'}`}
            >
              {page}
            </button>
          )
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-[1.25rem] border ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50 border-gray-300'}`}
        >
          &raquo;
        </button>
      </div>
    );
  };

  return (
    <>
     {/* Hero Section */}
<section className="hero-gradient py-12 md:py-20">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
      <div className="lg:w-1/2 text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Study Abroad <span className="text-gradient">Blogs</span>
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Abroad Insights: News and Tips for Students
        </p>
        <div className="relative max-w-md mx-auto lg:mx-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="search"
            className="block w-full h-[68px] bg-white border border-[#666276] rounded-[35px] pl-12 pr-36 text-black focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="What are you looking for?"
          />
          <button className="absolute top-[9px] right-[9px] bg-red-600 hover:bg-red-700 text-white text-base px-8 py-[14px] rounded-[30px] font-medium transition-colors border-none">
            Search
          </button>
        </div>
      </div>
      <div className="lg:w-1/2 flex justify-center">
        <Image
          src="/img/blog-banner-img.svg"
          alt="blog banner"
          width={500}
          height={300}
          className="w-full max-w-md lg:max-w-full"
        />
      </div>
    </div>
  </div>
</section>
      {/* Blog Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Category Tabs */}
          <div className="relative mb-8">
            {showLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            )}

          <div className="relative">
  {/* Left Arrow */}
  {showLeft && (
    <button
      onClick={() => scroll("left")}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
    >
      <ChevronLeft size={20} />
    </button>
  )}

  {/* Scrollable Container - Hidden Scrollbar */}
  <div
    ref={scrollRef}
    className="flex space-x-2 overflow-x-hidden py-2 mx-10" // Added mx-10 for arrow spacing
    style={{ scrollBehavior: "smooth" }}
  >
    {constant.COURSE_MENU.map((cat) => (
      <button
        key={cat.name}
        onClick={(e) => handleCategoryChange(e, cat.value)}
        className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${selectedCategory === cat.value
          ? 'bg-red-600 text-white border-red-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
      >
        {cat.name}
      </button>
    ))}
  </div>

  {/* Right Arrow */}
  {showRight && (
    <button
      onClick={() => scroll("right")}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
    >
      <ChevronRight size={20} />
    </button>
  )}
</div>

            {showRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          {/* Blog Grid using single component */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                <BlogCard key={index} loading={true} />
              ))
              : blogs.map((blog) => (
                <BlogCard
                  key={blog.Slug}
                  blog={blog}
                  onClick={() => router.push(`/blog-description/${blog.Slug}`)}
                />
              ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && renderPagination()}
        </div>
      </section>
    </>
  );
};

export default function AllBlogs() {
  return (
    <Suspense fallback={<Loader />}>
      <Blog />
    </Suspense>
  );
}