"use client";

import Link from "next/link";
import { constant } from "@/constant/index.constant";
import { redirect, usePathname, useRouter } from "next/navigation";
import ContactForm from "./UkForm";

import { useEffect, useState } from "react";
import PageServices from "@/services/PageServices";
import { Eye, ThumbsDown, ThumbsUp } from "lucide-react";
import { useGlobal } from "@/hooks/AppStateContext";
import BlogArticleContent from "@/components/blog/BlogArticleContent";
import { blogImageSource, cloudinaryCardImage } from "@/lib/blog-image";
import { useBannerCategory } from "@/components/BannerCategoryContext";

type BlogComment = {
  _id: string;
  author?: { name?: string };
  createdAt: string;
  content: string;
  nestedReplies?: BlogComment[];
};

export default function SingleBlogPage({
  blogData,
  similarBlogs,
  adjacentBlogs,
  sanitizedContent,
  tableOfContents = [],
  slug,
}: any) {
  const { prevBlog, nextBlog } = adjacentBlogs || {};
  const categoryName =
    typeof blogData?.category === "string"
      ? blogData.category
      : blogData?.category?.name;
  const heroSource = blogImageSource(blogData?.image);
  const heroImage = cloudinaryCardImage(heroSource, 1200) || heroSource;
  const pathname = usePathname() || "/";
  const { setCategoryForPath } = useBannerCategory();

  useEffect(() => {
    const name =
      typeof blogData?.category === "string"
        ? blogData.category
        : blogData?.category?.name;
    setCategoryForPath(pathname, name || null);
  }, [blogData?.category, pathname, setCategoryForPath]);

  const [viewCount, setviewCount] = useState<number | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToName, setReplyingToName] = useState("");
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});

  const { user, setDrawer } = useGlobal();

  const [commentForm, setCommentForm] = useState({
    content: "",
  });

  const fetchComments = async () => {
    if (!blogData?._id) return;

    try {
      setLoading(true);

      const response = await PageServices.getBlogComments(blogData._id);

      setComments(response?.data?.comments || []);
    } catch (error) {
      console.error("Get comments error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blogData?._id) {
      fetchComments();
    }
  }, [blogData?._id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setDrawer(true);
      return;
    }

    try {
      const body = {
        blogId: blogData._id,
        content: commentForm.content,
        name: user?.name,
        parentComment: replyingTo || null,
      };

      await PageServices.createBlogComment(body);

      setCommentForm({
        content: "",
      });

      setReplyingTo(null);
      setReplyingToName("");
      alert("Comment Submitted Successfully");

      // Get updated comments
      await fetchComments();
    } catch (error) {
      console.error("Comment submit error:", error);
    }
  };

  const handleReply = (commentId, authorName) => {
    setReplyingTo(commentId);
    setReplyingToName(authorName || "Anonymous");

    document.getElementById("comment-form")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyingToName("");

    setCommentForm({
      content: "",
    });
  };

  const toggleReplies = (commentId: string) => {
    setShowReplies((current) => ({
      ...current,
      [commentId]: !current[commentId],
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!blogData || !blogData.Slug) {
    return (
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center`}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Blog Post Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The requested blog post could not be found.
        </p>
        <Link
          href="/blog"
          className="bg-[#E12827] text-white px-6 py-3 rounded-md hover:bg-[#c82322] transition duration-200"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  useEffect(() => {
    if (!blogData?.Slug) return;

    // Show current view count immediately
    setviewCount(Number(blogData?.viewCount ?? 0));

    const timer = setTimeout(async () => {
      try {
        const response = await PageServices.incrementBlogView(blogData.Slug);

        // Updated view count from API
        setviewCount(Number(response?.data?.viewCount ?? 0));

        console.log("View updated:", response);
      } catch (error) {
        console.error("View count error:", error);
      }
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [blogData?.Slug]);

  return (
    <>
      <div>
        {/* Hero Section with New Design */}
        <section className="relative bg-pink-100 py-8">
          <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="relative z-10 mb-5 flex min-w-0 items-center gap-2 text-sm text-slate-500"
            >
              <Link href="/" className="hover:text-[#E12827] transition-colors">
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
              <span className="min-w-0 truncate font-medium text-slate-700">
                {blogData?.blogTitle}
              </span>
            </nav>

            {/* Blog Title */}
            <h1 className="mb-5 max-w-5xl text-2xl font-bold !leading-tight text-[#1e293b] sm:text-4xl ">
              {blogData?.blogTitle}
            </h1>

            {/* Blog Meta Information */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span>
                  {new Date(blogData?.createdAt).toLocaleDateString()}
                </span>
              </div>
              {categoryName && (
                <div className="flex items-center space-x-2">
                  <span className="bg-[#E12827] bg-opacity-10 text-[#E12827] px-3 py-1 rounded-full text-xs font-medium">
                    {categoryName}
                  </span>
                </div>
              )}

              {
                <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5">
                  <Eye className="h-4 w-4 text-[#E12827]" />

                  <span className="text-xs font-medium text-gray-600">
                    Views
                  </span>

                  <span className="text-sm font-bold text-[#E12827]">
                    {(
                      viewCount ?? Number(blogData?.viewCount ?? 0)
                    ).toLocaleString()}
                  </span>
                </div>
              }
              <Link
                href={"/author/sakshi-taneja"}
                className="text-[#E12827] px-3 py-1 rounded-full text-sm font-bold z-10"
              >
                Author - Sakshi Taneja
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Content Section */}
        <section className="bg-[#fbfcfe] px-4 py-8 ">
          <div className="mx-auto max-w-7xl">
            <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
              {/* Main Content */}
              <div className="min-w-0">
                <article className="min-w-0">
                  {/* Blog Image */}
                  <div className="mb-8 overflow-hidden">
                    <img
                      className=" w-full object-cover"
                      src={heroImage}
                      srcSet={
                        cloudinaryCardImage(heroSource, 800)
                          ? [800, 1200, 1600]
                              .map(
                                (width) =>
                                  `${cloudinaryCardImage(heroSource, width)} ${width}w`,
                              )
                              .join(", ")
                          : undefined
                      }
                      sizes="(min-width: 1024px) 850px, 100vw"
                      alt={blogData?.blogTitle || "Blog Image"}
                      loading="eager"
                      onError={(event) => {
                        const image = event.currentTarget;
                        if (image.dataset.fallback) return;
                        image.dataset.fallback = "true";
                        image.srcset = "";
                        image.src = "/img/blog-banner-img.svg";
                      }}
                    />
                  </div>

                  {tableOfContents.length > 1 && (
                    <details className="mb-8 rounded-2xl border border-[#f0dce1] bg-[#fff9fa] p-4 sm:p-5">
                      <summary className="cursor-pointer text-sm font-bold text-[#a91b36]">
                        In this article
                      </summary>
                      <nav
                        aria-label="Article sections"
                        className="mt-4 grid gap-2 border-t border-rose-100 pt-4 sm:grid-cols-2"
                      >
                        {tableOfContents.map((heading) => (
                          <a
                            key={heading.id}
                            href={`#${heading.id}`}
                            className={`text-sm leading-5 text-slate-600 transition-colors hover:text-[#c41430] ${heading.level === 3 ? "pl-4" : "font-semibold"}`}
                          >
                            {heading.text}
                          </a>
                        ))}
                      </nav>
                    </details>
                  )}

                  {/* Blog Content */}
                  <div className="min-w-0 pb-8">
                    <BlogArticleContent html={sanitizedContent} />
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-6 border-t border-gray-200">
                      {prevBlog ? (
                        <Link
                          href={`/blog-description/${prevBlog?.Slug}`}
                          className="flex items-center space-x-2 text-[#E12827] hover:text-[#c82322] transition duration-200 mb-4 sm:mb-0 font-medium"
                        >
                          <i className="fa fa-arrow-left"></i>
                          <span>Previous Post</span>
                        </Link>
                      ) : (
                        <div></div>
                      )}
                      {nextBlog ? (
                        <Link
                          href={`/blog-description/${nextBlog?.Slug}`}
                          className="flex items-center space-x-2 text-[#E12827] hover:text-[#c82322] transition duration-200 font-medium"
                        >
                          <span>Next Post</span>
                          <i className="fa fa-arrow-right"></i>
                        </Link>
                      ) : (
                        <div></div>
                      )}
                    </div>

                    {/* Share Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Share this post:
                      </h4>
                      <div className="flex space-x-3 justify-between">
                        <div className="flex space-x-3">
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`${constant.SOCIAL_MEDIA_LINK.FB}/?u=${encodeURIComponent(`${constant.BASE_URL}/blog-description/${blogData.Slug}`)}`}
                            className="w-10 h-10 bg-[#3b5998] text-white rounded-full flex items-center justify-center hover:bg-[#344e86] transition duration-200"
                          >
                            <i className="fa fa-facebook"></i>
                          </a>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`${constant.SOCIAL_MEDIA_LINK.TWITTER}/?url=${encodeURIComponent(`${constant.BASE_URL}/blog-description/${blogData.Slug}`)}`}
                            className="w-10 h-10 bg-[#1da1f2] text-white rounded-full flex items-center justify-center hover:bg-[#0d95e8] transition duration-200"
                          >
                            <i className="fa fa-twitter"></i>
                          </a>
                          <a
                            target="_blank"
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
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-[#fafbfe] p-5">
                      <Link href="/author/sakshi-taneja">
                        <div className="inline-flex items-center gap-3 rounded-xl transition-colors hover:text-[#c41430]">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d81635] text-lg font-bold text-white">
                            S
                          </div>

                          <div className="leading-tight">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                              Author
                            </p>
                            <h4 className="text-lg font-semibold text-gray-900">
                              Sakshi Taneja
                            </h4>
                          </div>
                        </div>
                      </Link>

                      <div className="">
                        <p className="text-base font-semibold text-[#E12827]">
                          Content Writer & International Education Specialist
                        </p>

                        <p className="mt-2 text-sm leading-7 text-gray-600">
                          Sakshi Taneja is a content writer specializing in
                          international education, study abroad opportunities,
                          university admissions, student visas, scholarships,
                          and career guidance. She creates accurate,
                          research-driven, and student-focused content to help
                          aspiring international students make informed
                          decisions about their global education journey.
                        </p>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Comment Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Comments ({comments.length})
                    </h3>
                    {/* Comment entry point depends on login and is temporarily disabled. */}
                    {false && comments.length > 0 && (
                      <button
                        onClick={() =>
                          document
                            .getElementById("comment-form")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="bg-[#E12827] text-white px-4 py-2 rounded-lg hover:bg-[#c82322] transition-colors text-sm font-medium"
                      >
                        Add Comment
                      </button>
                    )}
                  </div>

                  {/* Comment form depends on login and is temporarily disabled. */}
                  {false && (
                    <div
                      id="comment-form"
                      className="bg-white border border-gray-200 rounded-lg p-6 mb-8"
                    >
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {replyingTo ? "Reply to Comment" : "Leave a Comment"}
                      </h4>
                      {replyingTo && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm flex justify-between items-center">
                          <span className="font-medium">
                            Replying to: {replyingToName}
                          </span>
                          <button
                            onClick={handleCancelReply}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Cancel Reply
                          </button>
                        </div>
                      )}
                      <p className="text-gray-600 text-sm mb-4">
                        Your email address will not be published.
                      </p>
                      <form
                        data-track-form="Blog comment"
                        onSubmit={handleCommentSubmit}
                        className="space-y-4"
                      >
                        <textarea
                          placeholder="Your Comment *"
                          className="w-full h-[150px] bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-xl border-2 border-gray-300 focus:border-red-500 w-full py-4 px-4 text-gray-900 transition-colors resize-none"
                          value={commentForm.content}
                          onChange={(e) =>
                            setCommentForm({
                              ...commentForm,
                              content: e.target.value,
                            })
                          }
                          required
                        />
                        <button
                          type="submit"
                          className="bg-[#E12827] text-white px-8 py-3 rounded-lg hover:bg-[#c82322] transition duration-200 font-semibold hover:shadow-lg"
                        >
                          POST {replyingTo ? "REPLY" : "COMMENT"}
                        </button>
                      </form>
                    </div>
                  )}

                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">💬</span>
                          </div>
                          <p className="text-lg font-medium mb-2">
                            No comments yet
                          </p>
                          <p className="text-sm text-gray-600">
                            Comments are temporarily closed.
                          </p>
                        </div>
                      ) : (
                        comments.slice(0, 5).map((comment) => (
                          <div
                            key={comment._id}
                            className="rounded-xl p-4 bg-white border border-gray-100 hover:border-gray-200 transition-all mb-4 last:mb-0"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center shadow-sm">
                                  <span className="text-red-600 font-bold text-sm">
                                    {comment.author?.name
                                      ?.charAt(0)
                                      ?.toUpperCase() || "A"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                  <div>
                                    <span className="font-bold text-gray-900">
                                      {comment.author?.name || "Anonymous"}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">
                                      {formatDate(comment.createdAt)}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3 mt-1 sm:mt-0">
                                    {/* Reply depends on login and is temporarily disabled. */}
                                    {false && (
                                      <button
                                        onClick={() =>
                                          handleReply(
                                            comment._id,
                                            comment.author?.name,
                                          )
                                        }
                                        className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                                      >
                                        Reply
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-gray-700 mb-3">
                                  {comment.content}
                                </p>

                                {comment.nestedReplies &&
                                  comment.nestedReplies.length > 0 && (
                                    <div className="mt-4 space-y-3 border-l-2 border-gray-100 pl-4">
                                      {(showReplies[comment._id]
                                        ? comment.nestedReplies
                                        : comment.nestedReplies.slice(0, 2)
                                      ).map((reply) => (
                                        <div
                                          key={reply._id}
                                          className="flex items-start space-x-3"
                                        >
                                          <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                              <span className="text-purple-600 font-bold text-xs">
                                                {reply.author?.name
                                                  ?.charAt(0)
                                                  ?.toUpperCase() || "A"}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                                              <div>
                                                <span className="font-medium text-gray-900 text-sm">
                                                  {reply.author?.name ||
                                                    "Anonymous"}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                  {formatDate(reply.createdAt)}
                                                </span>
                                              </div>
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                              {reply.content}
                                            </p>
                                          </div>
                                        </div>
                                      ))}

                                      {comment.nestedReplies.length > 2 && (
                                        <button
                                          onClick={() =>
                                            toggleReplies(comment._id)
                                          }
                                          className="mt-2 text-sm text-red-600 hover:text-red-800 transition-colors flex items-center font-medium"
                                        >
                                          {showReplies[comment._id]
                                            ? "Hide replies"
                                            : `View ${comment.nestedReplies.length - 2} more replies`}
                                          <i
                                            className={`ml-1 ${showReplies[comment._id] ? "fa fa-chevron-up" : "fa fa-chevron-down"}`}
                                          ></i>
                                        </button>
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="w-full self-start  lg:sticky lg:top-24 lg:h-fit">
                <div className="space-y-6">
                  <div className="space-y-6 ">
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
                    <ContactForm type="article" />

                    {/* Similar Blogs */}
                    {similarBlogs && similarBlogs.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h5 className="text-lg font-bold text-gray-900 mb-4">
                          Similar Blogs
                        </h5>
                        <div className="space-y-3">
                          {similarBlogs.map((blog) => (
                            <Link
                              key={blog.Slug}
                              href={`/blog-description/${blog.Slug}`}
                              className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:border-[#E12827] hover:bg-red-50 transition-all duration-200 group"
                            >
                              <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                                <img
                                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                  src={
                                    cloudinaryCardImage(
                                      blogImageSource(blog.image),
                                      320,
                                    ) || blogImageSource(blog.image)
                                  }
                                  alt={blog?.blogTitle || "Similar Blog Image"}
                                  loading="lazy"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h6 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800 group-hover:text-[#c41430]">
                                  {blog.blogTitle}
                                </h6>
                                <p className="text-xs text-gray-500 font-normal">
                                  {new Date(
                                    blog.createdAt,
                                  ).toLocaleDateString()}
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
                      <h5 className="text-lg font-bold text-gray-900 mb-4">
                        Categories
                      </h5>
                      <div className="flex flex-wrap gap-4">
                        {[
                          "GMAT",
                          "TOEFL",
                          "IELTS",
                          "GRE",
                          "PTE",
                          "SAT",
                          "SPOKEN ENGLISH",
                        ].map((category) => (
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
                      <h5 className="text-base font-bold text-gray-900 mb-4">
                        Tags
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Study Abroad",
                          "Education",
                          "University",
                          "Scholarship",
                          "Visa",
                          "Career",
                          "Student Life",
                        ].map((tag) => (
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
              </aside>
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
                        Planning your study abroad journey?
                      </h2>
                      <p className="text-base sm:text-lg lg:text-[18px] mb-4 sm:mb-6 text-[#666276] font-normal">
                        Talk to our team about universities, applications,
                        visas, and the next step toward your goals.
                      </p>
                      <a
                        href="/contact"
                        className="inline-block bg-[#d71635] text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-3xl text-sm sm:text-base font-bold shadow-[0_0_8px_0_rgba(0,0,0,0.2)] hover:bg-[#b5122b] transition-all duration-300"
                      >
                        Get expert guidance
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
