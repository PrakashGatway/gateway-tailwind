
"use client";
import Link from "next/link";
import { constant } from "@/constant/index.constant";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import ContactForm from "./UkForm";
import { useGlobal } from "@/hooks/AppStateContext";
import EditorContent from "../EditorContent";
// import { useEffect, useState } from 'react';
// import axiosInstance from '@/services/axiosInstance';
// import { useGlobal } from '@/hooks/AppStateContext';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCoverImageUrl = (coverImage) => {
  if (!coverImage) return "/img/placeholder-blog.jpg";
  if (coverImage.startsWith("http")) return coverImage;
  return `https://uat.gatewayabroadeducations.com/uploads/${coverImage}`;
};

// Server-side Table of Contents component
function TableOfContents({ headings = [] }) {
  if (!headings || headings.length === 0) {
    return null;
  }

  return (
    <div className="toc-wrapper bg-[#edf6ff] rounded-xl shadow-sm border border-gray-200 p-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              Table of Contents
            </h3>
          </div>
        </div>
      </div>

      <div className="toc-content overflow-y-auto overflow-x-hidden max-h-[400px]">
        <div className="space-y-1 w-full">
          {(() => {
            let h2Count = 0;
            return headings.map((heading) => {
              if (heading.level === 2) {
                h2Count++;
              }

              const parentH2 = headings.find(
                (h) =>
                  h.level === 2 &&
                  h.children.some((child) => child.id === heading.id),
              );

              return (
                <div key={heading.id} className="toc-item w-full">
                  {heading.level === 2 ? (
                    <>
                      <div className="w-full">
                        <a
                          href={`#${heading.id}`}
                          className="w-full text-left p-0.5 rounded-lg transition-all duration-200 flex items-start justify-between group hover:bg-gray-50 text-gray-700"
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-8 h-6 rounded flex items-center justify-center text-sm flex-shrink-0 mt-0.5 bg-gray-100 text-gray-600">
                              {h2Count}.
                            </div>
                            <span className="font-medium text-left break-words whitespace-normal text-gray-800">
                              {heading.text}
                            </span>
                          </div>
                        </a>
                      </div>
                    </>
                  ) : (
                    // Independent H3
                    !parentH2 && (
                      <div className="w-full">
                        <a
                          href={`#${heading.id}`}
                          className="w-full text-left p-0.5 rounded-lg transition-all duration-200 flex items-start gap-3 group hover:bg-gray-50 text-gray-700"
                        >
                          <div className="w-6 h-6 rounded flex items-center justify-center text-sm flex-shrink-0 mt-0.5 bg-gray-100 text-gray-600">
                            H3
                          </div>
                          <span className="font-medium text-left break-words whitespace-normal flex-1">
                            {heading.text}
                          </span>
                        </a>
                      </div>
                    )
                  )}
                </div>
              );
            });
          })()}
        </div>
      </div>
      {/* <style jsx>{`
        :global(h2[id], h3[id]) {
          scroll-margin-top: 140px;
        }
        :global(.toc-link.active) {
          background-color: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }
      `}</style> */}
    </div>
  );
}

export default function ArticleClient({
  article,
  decodedContent,
  processedContent,
  tableOfContents,
  latestArticles = [],
  comments: commentsProp = [],
  slug,
}: any) {
  const [category, setCategories] = useState([]);

  console.log("article", article);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axiosInstance("/web/cat?limit=100");
      if (res.status !== 200) throw new Error("Failed to fetch categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const [views, setViews] = useState(null);

  useEffect(() => {
    if (!article?._id) return;

    setViews(Number(article.viewCount ?? 0));

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://uat.gatewayabroadeducations.com/api/v1/web/blog/log/${article._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to update blog view");
        }

        const data = await res.json();

        setViews(Number(data?.data?.viewCount ?? 0));
      } catch (error) {
        console.error("View count error:", error);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [article?._id]);

  const [comments, setComments] = useState(commentsProp);
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    content: "",
    parentCommentId: null,
  });
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const [loading, setLoading] = useState(false);

  const { user, setDrawer } = useGlobal();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/web/comments/${article._id}`);

      if (response.data.success) {
        setComments(response.data.data.comments || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (article?._id) {
      fetchComments();
    }
  }, [article?._id]);

  // Handle comment submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setDrawer(true);
      return;
    }

    try {
      const response = await axiosInstance.post("/web/comments/create", {
        articleId: article._id,
        content: commentForm.content,
        parentCommentId: commentForm.parentCommentId,
      });

      if (response) {
        setCommentForm({
          name: "",
          email: "",
          content: "",
          parentCommentId: null,
        });
        setReplyingTo(null);
        fetchComments();
        alert(
          "Comment posted successfully! It will appear after admin approval.",
        );
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Error posting comment");
    }
  };

  const handleReply = (commentId, authorName) => {
    setReplyingTo(commentId);
    setCommentForm((prev) => ({
      ...prev,
      content: `@${authorName} `,
      parentCommentId: commentId,
    }));
    document
      .getElementById("comment-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentForm((prev) => ({
      ...prev,
      content: "",
      parentCommentId: null,
    }));
  };

  const handleLike = async (commentId) => {
    try {
      await axiosInstance.post(`/web/${commentId}/like`);
      fetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      await axiosInstance.post(`/web/${commentId}/dislike`);
      fetchComments();
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (!article || !article.slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Article Not Found
          </h1>
          <Link
            href="/article"
            className="inline-flex items-center bg-[#E12827] text-white px-6 py-3 rounded-lg hover:bg-[#c82322] transition-colors font-medium"
          >
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#f3e8ff] py-8 ">
        <div className="max-w-7xl relative mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-[#E12827] transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link
              href="/article"
              className="hover:text-[#E12827] transition-colors"
            >
              Articles
            </Link>
            <span>›</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {article.title}
            </span>
          </nav>

          {/* Article Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>📅</span>
              <span>{formatDate(article.createdAt)}</span>
            </div>
            {article.category && (
              <div className="flex items-center space-x-2">
                <span className="bg-[#E12827] bg-opacity-10 text-[#E12827] px-3 py-1 rounded-full text-xs font-medium">
                  {article.category.name}
                </span>
              </div>
            )}
            <div>
              <span className="text-[#E12827] px-3 py-1 rounded-full text-sm font-bold">
                View - {(1000 + (views ?? Number(views ?? 0))).toLocaleString()}
              </span>
            </div>
            {/* <div>
                            <span className='text-[#E12827] px-3 py-1 rounded-full text-sm font-bold'>Read Time - {Math.ceil(article.readTime / 60)} min</span>
                        </div> */}
            <Link
              href={"/author/sakshi-taneja"}
              className="text-[#E12827] px-3 py-1 rounded-full text-sm font-bold z-10"
            >
              Author - Sakshi Taneja
            </Link>
          </div>
        </div>
      </section>

      {/* Article Content Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-8/12">
              <div className="overflow-hidden">
                {/* Article Image */}
                <div className="mb-6">
                  <img
                    className="w-full h-auto max-h-[500px] object-cover"
                    src={getCoverImageUrl(article.coverImage)}
                    alt={article.title || "Article Image"}
                    loading="lazy"
                  />
                </div>

                {tableOfContents.length > 0 && (
                  <div className="pb-3 border-b border-gray-100">
                    <TableOfContents
                      headings={tableOfContents}
                      className="shadow-lg"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="pb-8 pt-6">
                  <EditorContent
                    content_data={processedContent || decodedContent}
                  />

                  {/* Share Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Share this article:
                    </h4>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-3">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`${constant.SOCIAL_MEDIA_LINK.FB}/?u=${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
                          className="w-10 h-10 bg-[#3b5998] text-white rounded-full flex items-center justify-center hover:bg-[#344e86] transition duration-200 hover:scale-110"
                        >
                          <i className="fa fa-facebook"></i>
                        </Link>
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`${constant.SOCIAL_MEDIA_LINK.TWITTER}/?url=${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
                          className="w-10 h-10 bg-[#1da1f2] text-white rounded-full flex items-center justify-center hover:bg-[#0d95e8] transition duration-200 hover:scale-110"
                        >
                          <i className="fa fa-twitter"></i>
                        </Link>
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`${constant.SOCIAL_MEDIA_LINK.LINKEDIN}${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
                          className="w-10 h-10 bg-[#0077b5] text-white rounded-full flex items-center justify-center hover:bg-[#00669c] transition duration-200 hover:scale-110"
                        >
                          <i className="fa fa-linkedin"></i>
                        </Link>
                        <Link
                          href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
                          className="w-10 h-10 bg-[#EA4335] text-white rounded-full flex items-center justify-center hover:bg-[#d33426] transition duration-200 hover:scale-110"
                        >
                          <i className="fa fa-envelope"></i>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4 border border-gray-200 p-4">
                    <Link href="/author/sakshi-taneja">
                      <div className="inline-flex items-center gap-3 px-4 py-3  rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                        <div className="w-20 h-20 rounded-full bg-[#E12827] text-white flex items-center justify-center text-sm font-bold">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcxSIkbDpRi11M201gRDRamK_4nK4D1rGbeGT3LUJM3g&s=10"
                            alt=""
                            loading="lazy"
                          />
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
                        university admissions, student visas, scholarships, and
                        career guidance. She creates accurate, research-driven,
                        and student-focused content to help aspiring
                        international students make informed decisions about
                        their global education journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Comments ({comments.length})
                  </h3>
                  {comments.length > 0 && (
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
                        Replying to: {commentForm.content.split(" ")[0]}
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
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
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
                          Be the first to share your thoughts!
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
                                  <button
                                    onClick={() => handleLike(comment._id)}
                                    className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
                                  >
                                    <i className="fa fa-thumbs-up text-sm"></i>
                                    <span className="text-sm">
                                      {comment.likes?.length || 0}
                                    </span>
                                  </button>
                                  <button
                                    onClick={() => handleDislike(comment._id)}
                                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                                  >
                                    <i className="fa fa-thumbs-down text-sm"></i>
                                    <span className="text-sm">
                                      {comment.dislikes?.length || 0}
                                    </span>
                                  </button>
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
                                            <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                                              <button
                                                onClick={() =>
                                                  handleLike(reply._id)
                                                }
                                                className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
                                              >
                                                <i className="fa fa-thumbs-up text-xs"></i>
                                                <span className="text-xs">
                                                  {reply.likes?.length || 0}
                                                </span>
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleDislike(reply._id)
                                                }
                                                className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                                              >
                                                <i className="fa fa-thumbs-down text-xs"></i>
                                                <span className="text-xs">
                                                  {reply.dislikes?.length || 0}
                                                </span>
                                              </button>
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

                    {comments.length > 5 && (
                      <div className="text-center pt-4 border-t border-gray-200">
                        <button
                          className="text-red-600 hover:text-red-800 font-medium text-sm py-2 px-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                          onClick={() =>
                            alert(
                              "Showing all comments would require backend pagination implementation",
                            )
                          }
                        >
                          Load more comments ({comments.length - 5} more)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-4/12">
              <div className="space-y-6 sticky top-24">
                {/* Search Box */}
                {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span className="text-red-600">🔍</span>
                                        Search
                                    </h5>
                                    <div className="relative">
                                        <input
                                            type="search"
                                            name="search"
                                            placeholder="Search articles..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 font-normal"
                                        />
                                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition duration-200">
                                            <i className="fa fa-search" />
                                        </button>
                                    </div>
                                </div> */}
                <div>
                  <ContactForm type="article" />
                </div>

                {/* Latest Articles */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Latest Articles
                  </h5>
                  <div className="space-y-3">
                    {latestArticles.length > 0 ? (
                      latestArticles.map((articleItem) => (
                        <Link
                          key={articleItem.slug}
                          href={`/article/${articleItem.slug}`}
                          className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
                        >
                          <div className="flex-shrink-0 w-[7rem] h-[4rem] bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                              src={getCoverImageUrl(articleItem.coverImage)}
                              alt={articleItem?.title || "Latest Article Image"}
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h6 className="font-semibold text-sm text-gray-900 group-hover:text-red-700 transition duration-200 leading-tight line-clamp-2 mb-1">
                              {articleItem.title}
                            </h6>
                            <p className="text-xs text-gray-500 font-normal">
                              {formatDate(articleItem.createdAt)}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-2">
                          No other articles available
                        </p>
                        <Link
                          href="/article"
                          className="text-red-600 text-sm hover:underline font-medium"
                        >
                          Browse all articles
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Categories
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {category &&
                      category?.map((category, i) => (
                        <Link
                          key={i}
                          href={`/article?category=${category?._id}`}
                          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white transition duration-200 text-sm font-medium"
                        >
                          {category?.name}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl sm:rounded-[24px] shadow-lg mx-auto w-full max-w-[1127px]">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                <div className="w-full lg:w-[48%]">
                  <div className="text-center lg:text-left pl-[17px]">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[36px] font-bold mb-4 text-[#D71635] lg:leading-[37px]">
                      Have a question about Articles?
                    </h2>
                    <p className="text-base sm:text-lg lg:text-[18px] mb-4 sm:mb-6 text-[#666276] font-normal">
                      Want some help figuring out what kind of information you
                      need?
                    </p>
                    <a
                      href="/contact"
                      className="inline-block bg-[#d71635] text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-3xl text-sm sm:text-base font-bold shadow-[0_0_8px_0_rgba(0,0,0,0.2)] hover:bg-[#b5122b] transition-all duration-300 hover:shadow-xl"
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
  );
}
