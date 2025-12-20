'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { constant } from '@/constant/index.constant';
import DOMPurify from 'dompurify';
import { Noto_Sans } from 'next/font/google';
import axiosInstance from '@/services/axiosInstance';
import { useGlobal } from '@/hooks/AppStateContext';

// Configure Noto Sans font
const notoSans = Noto_Sans({
    weight: ['400', '500', '700'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap',
});

const sanitizeContent = (content) => {
    if (!content) return { __html: '' };
    
    try {
        return { __html: content };
    } catch (error) {
        console.error('Error sanitizing content:', error);
        return { __html: '' };
    }
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const getCoverImageUrl = (coverImage) => {
    if (!coverImage) return "/img/placeholder-blog.jpg";
    if (coverImage.startsWith("http")) return coverImage;
    return `https://uat.gatewayabroadeducations.com/uploads/${coverImage}`;
};

export default function ArticleClient({ article }) {
    const [isSticky, setIsSticky] = useState(false);
    const [latestArticles, setLatestArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // ✅ Comment related states (from first component)
    const [comments, setComments] = useState([]);
    const [commentForm, setCommentForm] = useState({
        name: '',
        email: '',
        content: '',
        parentCommentId: null
    });
    const [replyingTo, setReplyingTo] = useState(null);
    const [showReplies, setShowReplies] = useState({});
    
    const { user, drawer, setDrawer } = useGlobal();

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 200);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ✅ Track reading time functionality (from first component)
    useEffect(() => {
        if (!article?._id) return;

        let startTime = Date.now();
        let isVisible = true;
        const handleVisibilityChange = () => {
            if (document.hidden) {
                isVisible = false;
            } else {
                isVisible = true;
                startTime = Date.now() - totalPausedTime;
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        let totalPausedTime = 0;
        let lastPauseTime = null;

        const reportReadTime = async () => {
            const endTime = Date.now();
            let activeDuration = Math.floor((endTime - startTime - totalPausedTime) / 1000); // seconds

            if (activeDuration > 0) {
                try {
                    await axiosInstance.post(`/web/blog/log/${article._id}`, {
                        readDuration: activeDuration,
                    });
                } catch (error) {
                    console.warn('Failed to log read time', error);
                }
            }
        };

        const interval = setInterval(() => {
            if (isVisible) {
                const currentDuration = Math.floor((Date.now() - startTime - totalPausedTime) / 1000);
                if (currentDuration > 0) {
                    axiosInstance.post(`/web/blog/log/${article._id}`, {
                        readDuration: currentDuration,
                    }).catch(console.error);
                    totalPausedTime = 0;
                    lastPauseTime = Date.now();
                }
            }
        }, 30000);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(interval);
            reportReadTime();
        };
    }, [article?._id]);

    // ✅ Fetch latest articles
    useEffect(() => {
        const fetchLatestArticles = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance('/web/blog?page=1&limit=5'); // Fetch 5 to have 4 after filtering

                if (res.data?.data) {
                    // Filter out the current article from latest articles
                    const filteredArticles = res.data.data.filter(
                        articleItem => articleItem.slug !== article?.slug
                    ).slice(0, 4); // Take first 4 after filtering

                    setLatestArticles(filteredArticles);
                }
            } catch (err) {
                console.error("Error fetching latest articles:", err);
            } finally {
                setLoading(false);
            }
        };

        if (article?.slug) {
            fetchLatestArticles();
        }
    }, [article?.slug]);

    // ✅ Fetch comments functionality (from first component)
    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/web/comments/${article._id}`);

            if (response.data.success) {
                setComments(response.data.data.comments || []);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (article?._id) {
            fetchComments();
        }
    }, [article?._id]);

    // ✅ Handle comment submit (from first component)
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setDrawer(true);
            return;
        }

        try {
            const response = await axiosInstance.post('/web/comments/create', {
                articleId: article._id,
                content: commentForm.content,
                parentCommentId: commentForm.parentCommentId
            });
            if (response) {
                setCommentForm({
                    name: '',
                    email: '',
                    content: '',
                    parentCommentId: null
                });
                setReplyingTo(null);
                const response = await axiosInstance.get(`/web/comments/${article._id}`);
                if (response) {
                    setComments(response.data.data.comments || []);
                }
                alert('Comment posted successfully! It will appear after admin approval.');
            } else {
                alert(response.data.message || 'Error posting comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Error posting comment');
        }
    };

    // ✅ Handle reply (from first component)
    const handleReply = (commentId, authorName) => {
        setReplyingTo(commentId);
        setCommentForm(prev => ({
            ...prev,
            content: `@${authorName} `,
            parentCommentId: commentId
        }));
        // Scroll to comment form
        document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setCommentForm(prev => ({
            ...prev,
            content: '',
            parentCommentId: null
        }));
    };

    // ✅ Handle like/dislike (from first component)
    const handleLike = async (commentId) => {
        try {
            const response = await axiosInstance.post(`/web/${commentId}/like`);

            if (response.data.success) {
                fetchComments();
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const handleDislike = async (commentId) => {
        try {
            const response = await axiosInstance.post(`/web/${commentId}/dislike`);

            if (response.data.success) {
                fetchComments();
            }
        } catch (error) {
            console.error('Error disliking comment:', error);
        }
    };

    // ✅ Toggle replies (from first component)
    const toggleReplies = (commentId) => {
        setShowReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    if (!article || !article.slug) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📄</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Article Not Found</h1>
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
        <div className={notoSans.className}>
            {/* Hero Section with Blog Detail Design */}
            <section className="hero-gradient py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                    {/* Breadcrumb Navigation */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                        <Link 
                            href="/" 
                            style={{ 
                                pointerEvents: 'auto', 
                                cursor: 'pointer',
                                position: 'relative',
                                zIndex: 9999 
                            }}
                            className="hover:text-[#E12827] transition-colors"
                        >
                            Home
                        </Link>
                        <span>›</span>
                        <Link 
                            href="/article"
                            style={{ 
                                pointerEvents: 'auto', 
                                cursor: 'pointer',
                                position: 'relative',
                                zIndex: 9999 
                            }}
                            className="hover:text-[#E12827] transition-colors"
                        >
                            Articles
                        </Link>
                        <span>›</span>
                        <span className="text-gray-900 font-medium truncate">{article.title}</span>
                    </nav>

                    {/* Article Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {article.title}
                    </h1>

                    {/* Article Meta Information */}
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
                            <span className=' text-[#E12827] px-3 py-1 rounded-full text-sm font-bold'>Author - Admin</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content */}
                        <div className="lg:w-8/12">
                            <div className="sm:bg-white rounded-lg sm:shadow-sm sm:border sm:border-gray-200 overflow-hidden">
                                {/* Article Image */}
                                <div className="mb-6">
                                    <img
                                        className="w-full h-auto"
                                        src={getCoverImageUrl(article.coverImage)}
                                        alt={article.title || 'Article Image'}
                                    />
                                </div>

                                {/* Article Content */}
                                <div className="sm:px-6 pb-8">
                                    <div 
                                        className="prose prose-lg max-w-none blogs"
                                        dangerouslySetInnerHTML={sanitizeContent(decodeURIComponent(escape(atob(article.content))))}
                                    />

                                    {/* Share Section */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Share this article:</h4>
                                        <div className="flex space-x-3 justify-between">

                                            <div className='flex space-x-3'>
                                                 <Link
                                                target='_blank'
                                                href={`${constant.SOCIAL_MEDIA_LINK.FB}/?u=${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
                                                className="w-10 h-10 bg-[#3b5998] text-white rounded-full flex items-center justify-center hover:bg-[#344e86] transition duration-200"
                                            >
                                                <i className="fa fa-facebook"></i>
                                            </Link>
                                            <Link
                                                target='_blank'
                                                href={`${constant.SOCIAL_MEDIA_LINK.TWITTER}/?url=${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
                                                className="w-10 h-10 bg-[#1da1f2] text-white rounded-full flex items-center justify-center hover:bg-[#0d95e8] transition duration-200"
                                            >
                                                <i className="fa fa-twitter"></i>
                                            </Link>
                                            <Link
                                                target='_blank'
                                                href={`${constant.SOCIAL_MEDIA_LINK.LINKEDIN}${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
                                                className="w-10 h-10 bg-[#0077b5] text-white rounded-full flex items-center justify-center hover:bg-[#00669c] transition duration-200"
                                            >
                                                <i className="fa fa-linkedin"></i>
                                            </Link>
                                            <Link
                                                target='_blank'
                                                href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
                                                className="w-10 h-10 bg-[#EA4335] text-white rounded-full flex items-center justify-center hover:bg-[#d33426] transition duration-200"
                                            >
                                                <i className="fa fa-envelope"></i>
                                            </Link>
                                            </div>
                                           

                                            <div>
                            <span className=' text-[#E12827] px-3 py-1 rounded-full text-sm font-bold '>~ By Admin</span>
                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ✅ Comment Section (from first component) */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Comments ({comments.length})
                                    </h3>
                                    {comments.length > 0 && (
                                        <button
                                            onClick={() => document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="bg-[#E12827] text-white px-4 py-2 rounded-lg hover:bg-[#c82322] transition-colors text-sm"
                                        >
                                            Add Comment
                                        </button>
                                    )}
                                </div>

                                {/* Comment Form */}
                                <div id="comment-form" className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                                        {replyingTo ? 'Reply to Comment' : 'Leave a Comment'}
                                    </h4>
                                    {replyingTo && (
                                        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                                            <span className="font-medium">Replying to:</span> {commentForm.content.split(' ')[0]}
                                            <button
                                                onClick={handleCancelReply}
                                                className="ml-2 text-red-600 hover:text-red-800 text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-gray-600 text-sm mb-4">Your email address will not be published.</p>
                                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                                      
                                        <textarea
                                            placeholder="Your Comment *"
                                            className="w-full flex h-[200px] bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-[10px] border-2 border-gray-400 focus:border-red-500 w-full py-[17px] px-4 text-gray-900 transition-colors"
                                            rows={5}
                                            value={commentForm.content}
                                            onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="bg-[#E12827] text-white px-8 py-3 rounded-md hover:bg-[#c82322] transition duration-200 font-semibold"
                                        >
                                            POST {replyingTo ? 'REPLY' : 'COMMENT'}
                                        </button>
                                    </form>
                                </div>

                                {/* Comments List */}
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : (
                                    <div className="border border-gray-200 rounded-lg p-2">
                                        {comments.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                <p>No comments yet. Be the first to share your thoughts!</p>
                                            </div>
                                        ) : (
                                            comments.slice(0, 5).map((comment) => (
                                                <div key={comment._id} className="rounded-xl p-2 bg-white hover:shadow-sm transition-shadow mb-4 last:mb-0">
                                                    <div className="flex items-start space-x-2">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <span className="text-blue-600 font-medium">
                                                                    {comment.author?.name?.charAt(0)?.toUpperCase() || 'A'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <div>
                                                                    <span className="font-medium text-gray-900 text-sm">
                                                                        {comment.author?.name || 'Anonymous'}
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs text-gray-500">
                                                                    {formatDate(comment.createdAt)}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                                                            <div className="flex items-center space-x-3 text-xs">
                                                                <button
                                                                    onClick={() => handleLike(comment._id)}
                                                                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                                                                >
                                                                    <i className="fa fa-thumbs-up"></i>
                                                                    <span>{comment.likes?.length || 0}</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDislike(comment._id)}
                                                                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                                                                >
                                                                    <i className="fa fa-thumbs-down"></i>
                                                                    <span>{comment.dislikes?.length || 0}</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReply(comment._id, comment.author?.name)}
                                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                                >
                                                                    Reply
                                                                </button>
                                                            </div>

                                                            {/* Replies Section */}
                                                            {comment.nestedReplies && comment.nestedReplies.length > 0 && (
                                                                <div className="mt-3 space-y-3">
                                                                    {/* Show all replies if toggled, otherwise show first 2 */}
                                                                    {(showReplies[comment._id]
                                                                        ? comment.nestedReplies
                                                                        : comment.nestedReplies.slice(0, 2)
                                                                    ).map((reply) => (
                                                                        <div key={reply._id} className="flex items-start space-x-2 ml-2">
                                                                            <div className="flex-shrink-0">
                                                                                <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                                                                                    <span className="text-purple-600 font-medium text-xs">
                                                                                        {reply.author?.name?.charAt(0)?.toUpperCase() || 'A'}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center justify-between mb-1">
                                                                                    <div>
                                                                                        <span className="font-medium text-gray-900 text-xs">
                                                                                            {reply.author?.name || 'Anonymous'}
                                                                                        </span>
                                                                                    </div>
                                                                                    <span className="text-xs text-gray-500">
                                                                                        {formatDate(reply.createdAt)}
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-gray-700 text-xs">{reply.content}</p>
                                                                                <div className="flex items-center space-x-3 text-xs mt-1">
                                                                                    <button
                                                                                        onClick={() => handleLike(reply._id)}
                                                                                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                                                                                    >
                                                                                        <i className="fa fa-thumbs-up"></i>
                                                                                        <span>{reply.likes?.length || 0}</span>
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => handleDislike(reply._id)}
                                                                                        className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                                                                                    >
                                                                                        <i className="fa fa-thumbs-down"></i>
                                                                                        <span>{reply.dislikes?.length || 0}</span>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                    {/* Toggle Replies Button */}
                                                                    {comment.nestedReplies.length > 2 && (
                                                                        <button
                                                                            onClick={() => toggleReplies(comment._id)}
                                                                            className="mt-2 text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                                                                        >
                                                                            {showReplies[comment._id]
                                                                                ? 'Hide replies'
                                                                                : `View ${comment.nestedReplies.length - 2} more replies`}
                                                                            <i className={`ml-1 text-xs ${showReplies[comment._id] ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        {/* Show more comments button if there are more than 5 */}
                                        {comments.length > 5 && (
                                            <div className="text-center pt-4">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                    onClick={() => alert('Showing all comments would require backend pagination implementation')}
                                                >
                                                    Load more comments
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className={`lg:w-4/12 ${isSticky ? 'lg:sticky lg:top-4' : ''}`}>
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

                                {/* Latest Articles - Excluding current article */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h5 className="text-lg font-bold text-gray-900 mb-4">Latest Articles</h5>
                                    <div className="space-y-3">
                                        {loading ? (
                                            // Loading skeleton
                                            Array.from({ length: 4 }).map((_, index) => (
                                                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100">
                                                    <div className="flex-shrink-0 w-[7rem] h-[4rem] bg-gray-200 animate-pulse rounded-lg"></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                                                        <div className="w-1/2 h-3 bg-gray-200 animate-pulse rounded"></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : latestArticles.length > 0 ? (
                                            latestArticles.map((articleItem) => (
                                                <Link
                                                    key={articleItem.slug}
                                                    href={`/article/${articleItem.slug}`}
                                                    className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:border-[#E12827] hover:bg-red-50 transition-all duration-200 group"
                                                >
                                                    <div className="flex-shrink-0 w-[7rem] h-[4rem] bg-gray-200 rounded-lg overflow-hidden">
                                                        <img
                                                            className="w-full h-full object-cover transition duration-300"
                                                            src={getCoverImageUrl(articleItem.coverImage)}
                                                            alt={articleItem?.title || 'Latest Article Image'}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h6 className="font-semibold text-sm text-gray-900 group-hover:text-[#E12827] transition duration-200 leading-tight line-clamp-2 mb-1">
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
                                                <p className="text-sm text-gray-500 mb-2">No other articles available</p>
                                                <Link
                                                    href="/article"
                                                    className="text-[#E12827] text-sm hover:underline"
                                                >
                                                    Browse all articles
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h5 className="text-lg font-bold text-gray-900 mb-4">Categories</h5>
                                    <div className="flex flex-wrap gap-4">
                                        {['Study Abroad', 'Education', 'University', 'Scholarship', 'Visa', 'Career', 'Student Life'].map((category) => (
                                            <Link
                                                key={category}
                                                href={`/article?category=${category}`}
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
                                                href={`/article?tag=${tag.toLowerCase()}`}
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

            {/* CTA Section */}
            <section className="py-12 md:py-16 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="bg-[#fbe7ea] rounded-2xl sm:rounded-[24px] shadow-lg mx-auto w-full max-w-[1127px]">
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                                <div className="w-full lg:w-[48%]">
                                    <div className="text-center lg:text-left pl-[17px]">
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[36px] font-bold mb-4 text-[#D71635] lg:leading-[37px]">
                                            Have a question about Articles?
                                        </h2>
                                        <p className="text-base sm:text-lg lg:text-[18px] mb-4 sm:mb-6 text-[#666276] font-normal">
                                            Want some help figuring out what kind of information you need?
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
    );
}