"use client"

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import PageServices from "@/services/PageServices";
import { constant } from "@/constant/index.constant";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "@/components/loader";

const BlogCardSkeleton = () => (
  <div className="col-md-6 col-lg-4">
    <div className="blog-card">
      <div
        className="blog-card-img-box"
        style={{
          backgroundColor: "#6c757d91",
          height: "200px",
          borderRadius: "8px",
        }}
      />
      <div className="blog-card-content mt-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="skeleton-line w-50 h-3 bg-secondary rounded" />
          <div className="skeleton-line w-25 h-3 bg-secondary rounded" />
        </div>
        <div className="skeleton-line w-75 h-4 mb-2 bg-secondary rounded" />
        <div className="skeleton-line w-100 h-3 mb-1 bg-secondary rounded" />
        <div className="skeleton-line w-90 h-3 bg-secondary rounded" />
      </div>
    </div>
  </div>
);

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

  // ✅ Scroll Button Visibility
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

  // ✅ Fetch Blogs
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

  // ✅ Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // ✅ Fetch Blogs Whenever URL Params Change
  useEffect(() => {
    setCurrentPage(pageParam);
    setSelectedCategory(categoryParam);
    fetchBlogs(pageParam, categoryParam, debouncedSearchQuery);
  }, [pageParam, categoryParam, debouncedSearchQuery, fetchBlogs]);

  // ✅ Event Handlers
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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  const sanitizedData = (content: string) => ({
    __html: content,
  });

  // ✅ Pagination Rendering
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
      <ul className="pagination justify-content-center flex-wrap">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link p-0"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &laquo;
          </button>
        </li>
        {pages.map((page, i) =>
          page === "..." ? (
            <li key={i} className="page-item disabled">
              <span className="page-link p-0">...</span>
            </li>
          ) : (
            <li
              key={i}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
              <button
                className="page-link p-0"
                onClick={() => handlePageChange(Number(page))}
              >
                {page}
              </button>
            </li>
          )
        )}
        <li
          className={`page-item ${currentPage === totalPages ? "disabled" : ""
            }`}
        >
          <button
            className="page-link p-0"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            &raquo;
          </button>
        </li>
      </ul>
    );
  };

  return (
    <>
      <section className="hero-gradient banner-sec">
        <div className="container">
          <div className="row align-items-center lg:pt-12 pt-28">
            <div className="col-md-6">
              <div className="banner-content-sec">
                <h1>
                  Study Abroad <span>Blogs</span>
                </h1>
                <p>Abroad Insights: News and Tips for Students</p>
                <div className="hero-search-field position-relative">
                  <span>
                    <i className="fa fa-search" />
                  </span>
                  <input
                    type="search"
                    className="form-control"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="What are you looking for?"
                  />
                  <button className="site-btn-2 site-btn">Search</button>
                </div>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <Image
                src="/img/blog-banner-img.svg"
                alt="blog banner"
                width={500}
                height={300}
                layout="responsive"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="blog-b-section py-4">
        <div className="container">
          <div className="relative mb-4">
            {showLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute bg-red-700 text-white left-0 top-5 -translate-y-1/2 z-10 p-2 shadow rounded-full"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <div
              ref={scrollRef}
              className="blog-tab-scroll blog-tab d-flex flex-nowrap gap-2 overflow-x-auto"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch"
              }}
            >
              {constant.COURSE_MENU.map((cat) => (
                <button
                  key={cat.name}
                  className={`nav-link btn btn-outline-secondary flex-shrink-0 ${selectedCategory === cat.value ? "active" : ""
                    }`}
                  onClick={(e) => handleCategoryChange(e, cat.value)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {showRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-5 -translate-y-1/2 z-10 p-2 bg-red-700 text-white shadow rounded-full"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>

          <div className="blog-section-inner row gy-4">
            {loading
              ? Array.from({ length: 9 }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))
              : blogs.map((blog) => (
                <div key={blog.Slug} className="col-md-6 col-lg-4">
                  <div
                    onClick={() =>
                      router.push(`/blog-description/${blog.Slug}`)
                    }
                    className="blog-card cursor-pointer"
                  >
                    <div className="blog-card-img-box max-h-[180px] mb-2">
                      <Image
                        src={`${constant.REACT_APP_URL}/uploads/${blog.image}`}
                        alt={blog.image}
                        className="object-cover"
                        width={400}
                        height={200}
                        layout="responsive"
                      />
                    </div>
                    <div className="blog-card-content mb-0 pb-0 px-2">
                      <ul className="list-unstyled d-flex justify-content-between align-items-center mb-2">
                        <li>
                          <span>
                            <Image
                              src="/img/date-icon.svg"
                              alt="calendar"
                              width={16}
                              height={16}
                            />
                          </span>
                          <span>{formatDate(blog.createdAt)}</span>
                        </li>
                      </ul>
                      <h5 className="text-lg">{blog.blogTitle}</h5>
                      <p
                        className="sub_text_blog"
                        dangerouslySetInnerHTML={sanitizedData(
                          blog.blogDescription
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {totalPages > 1 && <nav className="mt-4">{renderPagination()}</nav>}
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
