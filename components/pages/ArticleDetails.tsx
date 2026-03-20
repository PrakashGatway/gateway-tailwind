// 'use client';

// import { useState, useEffect, useRef, useCallback } from 'react';
// import Link from 'next/link';
// import { constant } from '@/constant/index.constant';
// import DOMPurify from 'dompurify';
// import { Noto_Sans } from 'next/font/google';
// import axiosInstance from '@/services/axiosInstance';
// import { useGlobal } from '@/hooks/AppStateContext';

// // Configure Noto Sans font
// const notoSans = Noto_Sans({
//     weight: ['400', '500', '700'],
//     style: ['normal'],
//     subsets: ['latin'],
//     display: 'swap',
// });

// const sanitizeContent = (content) => {
//     if (!content) return { __html: '' };

//     try {
//         return { __html: content };
//     } catch (error) {
//         console.error('Error sanitizing content:', error);
//         return { __html: '' };
//     }
// };

// const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//     });
// };

// const getCoverImageUrl = (coverImage) => {
//     if (!coverImage) return "/img/placeholder-blog.jpg";
//     if (coverImage.startsWith("http")) return coverImage;
//     return `https://uat.gatewayabroadeducations.com/uploads/${coverImage}`;
// };



// // TOC component within same file
// const TableOfContents = ({ content, className = "" }) => {
//     const [headings, setHeadings] = useState([]);
//     const [activeId, setActiveId] = useState('');
//     const [expandedSections, setExpandedSections] = useState({});
//     const observerRef = useRef(null);
//     const contentProcessedRef = useRef(false);




//     useEffect(() => {
//         if (!content || contentProcessedRef.current) return;

//         const tempDiv = document.createElement('div');
//         tempDiv.innerHTML = content;

//         // Get all h2 and h3 elements
//         const h2Elements = Array.from(tempDiv.querySelectorAll('h2'));
//         const h3Elements = Array.from(tempDiv.querySelectorAll('h3'));

//         if (h2Elements.length === 0 && h3Elements.length === 0) {
//             setHeadings([]);
//             contentProcessedRef.current = true;
//             return;
//         }

//         const tocItems = [];
//         let currentH2 = null;

//         // Process h2 elements
//         h2Elements.forEach((h2, h2Index) => {
//             const h2Id = `h2-${h2Index}-${Date.now()}`;
//             h2.id = h2Id;

//             const h2Item = {
//                 id: h2Id,
//                 text: h2.textContent || `Section ${h2Index + 1}`,
//                 level: 2,
//                 children: []
//             };

//             tocItems.push(h2Item);
//             currentH2 = h2Item;
//         });


//         h3Elements.forEach((h3, h3Index) => {
//             const h3Id = `h3-${h3Index}-${Date.now()}`;
//             h3.id = h3Id;


//             let parentH2 = null;
//             let element = h3.previousElementSibling;

//             while (element) {
//                 if (element.tagName === 'H2') {
//                     parentH2 = tocItems.find(item =>
//                         item.text === element.textContent && item.level === 2
//                     );
//                     break;
//                 }
//                 element = element.previousElementSibling;
//             }

//             // If no parent h2 found, use last h2 or create independent entry
//             if (!parentH2 && tocItems.length > 0) {
//                 parentH2 = tocItems[tocItems.length - 1];
//             }

//             if (parentH2) {
//                 parentH2.children.push({
//                     id: h3Id,
//                     text: h3.textContent || `Subsection ${h3Index + 1}`,
//                     level: 3
//                 });
//             } else {
//                 // Independent h3
//                 tocItems.push({
//                     id: h3Id,
//                     text: h3.textContent || `Section ${h3Index + 1}`,
//                     level: 3,
//                     children: [],
//                     isIndependent: true
//                 });
//             }
//         });

//         setHeadings(tocItems);


//         const initialExpanded = {};


//         setExpandedSections(initialExpanded);

//         contentProcessedRef.current = true;

//         return () => tempDiv.remove();
//     }, [content]);


//     useEffect(() => {
//         if (headings.length === 0) return;

//         // Wait for DOM to be fully rendered
//         const timeoutId = setTimeout(() => {
//             // Ensure all headings have IDs in the actual DOM
//             headings.forEach((heading, index) => {
//                 // Find heading in actual DOM by text content
//                 const headingElements = Array.from(document.querySelectorAll('h2, h3'));
//                 const matchingElement = headingElements.find(el =>
//                     el.textContent.trim() === heading.text.trim()
//                 );

//                 if (matchingElement && !matchingElement.id) {
//                     matchingElement.id = heading.id;
//                 }
//             });
//         }, 500); // Small delay to ensure content is rendered

//         return () => clearTimeout(timeoutId);
//     }, [headings]);

//     // Intersection Observer for active heading
//     useEffect(() => {
//         if (headings.length === 0) return;

//         const handleIntersection = (entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     setActiveId(entry.target.id);
//                 }
//             });
//         };

//         observerRef.current = new IntersectionObserver(handleIntersection, {
//             root: null,
//             rootMargin: '-100px 0px -50% 0px',
//             threshold: 0.1
//         });


//         headings.forEach(heading => {
//             const element = document.getElementById(heading.id);
//             if (element) {
//                 observerRef.current.observe(element);
//             }


//             heading.children?.forEach(child => {
//                 const childElement = document.getElementById(child.id);
//                 if (childElement) {
//                     observerRef.current.observe(childElement);
//                 }
//             });
//         });

//         return () => {
//             if (observerRef.current) {
//                 observerRef.current.disconnect();
//             }
//         };
//     }, [headings]);

//     const scrollToHeading = useCallback((id, text) => {

//         let element = document.getElementById(id);


//         if (!element) {
//             const headingElements = Array.from(document.querySelectorAll('h2, h3'));
//             element = headingElements.find(el =>
//                 el.textContent.trim() === text.trim()
//             );


//             if (element && !element.id) {
//                 element.id = id;
//             }
//         }

//         if (element) {
//             const offset = 120;
//             const elementTop = element.getBoundingClientRect().top + window.pageYOffset;

//             window.scrollTo({
//                 top: elementTop - offset,
//                 behavior: 'smooth'
//             });


//             setTimeout(() => {
//                 setActiveId(element.id);
//             }, 100);
//         } else {

//             setTimeout(() => {
//                 const fallbackElement = document.getElementById(id) ||
//                     Array.from(document.querySelectorAll('h2, h3')).find(el =>
//                         el.textContent.trim() === text.trim()
//                     );

//                 if (fallbackElement) {
//                     const offset = 120;
//                     const elementTop = fallbackElement.getBoundingClientRect().top + window.pageYOffset;

//                     window.scrollTo({
//                         top: elementTop - offset,
//                         behavior: 'smooth'
//                     });

//                     if (!fallbackElement.id) {
//                         fallbackElement.id = id;
//                     }
//                     setActiveId(fallbackElement.id);
//                 }
//             }, 300);
//         }
//     }, []);

//     const toggleSection = (id) => {
//         setExpandedSections(prev => {

//             if (prev[id]) {
//                 const newState = { ...prev };
//                 delete newState[id];
//                 return newState;
//             }

//             else {
//                 return { [id]: true };
//             }
//         });
//     };


//     useEffect(() => {
//         if (activeId) {

//             const activeHeading = headings.find(h => h.id === activeId);
//             if (activeHeading) {

//                 if (activeHeading.level === 3) {
//                     const parentH2 = headings.find(h =>
//                         h.level === 2 && h.children.some(child => child.id === activeId)
//                     );
//                     if (parentH2 && !expandedSections[parentH2.id]) {
//                         setExpandedSections(prev => ({
//                             ...prev,
//                             [parentH2.id]: true
//                         }));
//                     }
//                 }

//                 else if (activeHeading.level === 2 && !expandedSections[activeId]) {
//                     setExpandedSections(prev => ({
//                         ...prev,
//                         [activeId]: true
//                     }));
//                 }
//             }
//         }
//     }, [activeId, headings]);

//     return (
//         <div className={`toc-wrapper bg-[#edf6ff] rounded-xl shadow-sm border border-gray-200 p-2 ${className}`}>
//             <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-2">

//                     <div className="min-w-0 flex-1">
//                         <h3 className="text-lg font-bold text-gray-900">Table of Contents</h3>

//                     </div>
//                 </div>

//             </div>

//             {/* 🔥 FIXED: No button inside button */}
//             <div className="toc-content overflow-y-auto overflow-x-hidden max-h-[400px]">
//                 <div className="space-y-1 w-full">
//                     {(() => {
//                         let h2Count = 0;

//                         return headings.map((heading) => {
//                             // Reset H2 counter
//                             if (heading.level === 2) {
//                                 h2Count++;
//                             }

//                             // Independent H3 के लिए parent खोजें
//                             const parentH2 = headings.find(h =>
//                                 h.level === 2 && h.children.some(child => child.id === heading.id)
//                             );
//                             const parentH2Index = parentH2
//                                 ? headings.filter(h => h.level === 2).findIndex(h => h.id === parentH2.id) + 1
//                                 : null;

//                             return (
//                                 <div key={heading.id} className="toc-item w-full">
//                                     {heading.level === 2 ? (
//                                         <>
//                                             <div className="w-full">
//                                                 <button
//                                                     onClick={() => scrollToHeading(heading.id, heading.text)}
//                                                     className={`w-full text-left p\ rounded-lg transition-all duration-200 flex items-start justify-between group ${activeId === heading.id
//                                                         ? 'bg-red-50 border border-red-100 text-red-700'
//                                                         : 'hover:bg-gray-50 text-gray-700'
//                                                         }`}
//                                                     style={{ maxWidth: '100%' }}
//                                                 >
//                                                     <div className="flex items-start gap-3 flex-1 min-w-0">
//                                                         <div className={`w-8 h-6 rounded flex items-center justify-center text-sm flex-shrink-0 mt-0.5 ${activeId === heading.id
//                                                             ? 'bg-red-600 text-white'
//                                                             : 'bg-gray-100 text-gray-600'
//                                                             }`}>
//                                                             {h2Count}
//                                                         </div>
//                                                         <span className={`font-medium text-left break-words whitespace-normal ${activeId === heading.id ? 'text-red-800' : 'text-gray-800'
//                                                             }`}>
//                                                             {heading.text}
//                                                         </span>
//                                                     </div>


//                                                     {heading.children.length > 0 && (
//                                                         <span
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 toggleSection(heading.id);
//                                                             }}
//                                                             className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0 ml-2 mt-0.5 cursor-pointer"
//                                                             role="button"
//                                                             tabIndex={0}
//                                                             onKeyDown={(e) => {
//                                                                 if (e.key === 'Enter' || e.key === ' ') {
//                                                                     e.preventDefault();
//                                                                     toggleSection(heading.id);
//                                                                 }
//                                                             }}
//                                                             aria-label={expandedSections[heading.id] ? 'Collapse section' : 'Expand section'}
//                                                         >
//                                                             <svg
//                                                                 className={`w-4 h-4 text-gray-500 transform transition-transform ${expandedSections[heading.id] ? 'rotate-180' : ''
//                                                                     }`}
//                                                                 fill="none"
//                                                                 stroke="currentColor"
//                                                                 viewBox="0 0 24 24"
//                                                             >
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                                                             </svg>
//                                                         </span>
//                                                     )}
//                                                 </button>
//                                             </div>

//                                             {/* H3 Children - ONLY SHOWN WHEN EXPANDED */}
//                                             {heading.children.length > 0 && expandedSections[heading.id] && (
//                                                 <div className="ml-10 mt-1 space-y-1 border-l border-gray-200 pl-4">
//                                                     {heading.children.map((child, childIndex) => (
//                                                         <div key={child.id} className="w-full">
//                                                             <button
//                                                                 onClick={() => scrollToHeading(child.id, child.text)}
//                                                                 className={`w-full text-left  rounded-lg transition-all duration-200 flex items-start gap-3 group ${activeId === child.id
//                                                                     ? 'bg-red-50 text-red-700'
//                                                                     : 'hover:bg-gray-50 text-gray-600'
//                                                                     }`}
//                                                                 style={{ maxWidth: '100%' }}
//                                                             >
//                                                                 <div className={`w-8 h-5 rounded flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${activeId === child.id
//                                                                     ? 'bg-red-200 text-red-700'
//                                                                     : 'bg-gray-100 text-gray-500'
//                                                                     }`}>
//                                                                     {h2Count}.{childIndex + 1}
//                                                                 </div>
//                                                                 <span className="text-sm text-left break-words whitespace-normal flex-1">
//                                                                     {child.text}
//                                                                 </span>
//                                                             </button>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             )}
//                                         </>
//                                     ) : (
//                                         // Independent H3 (जो किसी H2 के child नहीं हैं)
//                                         !parentH2 && (
//                                             <div className="w-full">
//                                                 <button
//                                                     onClick={() => scrollToHeading(heading.id, heading.text)}
//                                                     className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-start gap-3 group ${activeId === heading.id
//                                                         ? 'bg-red-50 border border-red-100 text-red-700'
//                                                         : 'hover:bg-gray-50 text-gray-700'
//                                                         }`}
//                                                     style={{ maxWidth: '100%' }}
//                                                 >
//                                                     <div className={`w-6 h-6 rounded flex items-center justify-center text-sm flex-shrink-0 mt-0.5 ${activeId === heading.id
//                                                         ? 'bg-red-600 text-white'
//                                                         : 'bg-gray-100 text-gray-600'
//                                                         }`}>
//                                                         H3
//                                                     </div>
//                                                     <span className="font-medium text-left break-words whitespace-normal flex-1">
//                                                         {heading.text}
//                                                     </span>
//                                                 </button>
//                                             </div>
//                                         )
//                                     )}
//                                 </div>
//                             );
//                         });
//                     })()}
//                 </div>
//             </div>



//             {/* 🔥 Keep the CSS for no horizontal scroll */}
//             <style jsx>{`
//                 .toc-content {
//                     width: 100% !important;
//                     max-width: 100% !important;
//                     overflow-x: hidden !important;
//                 }

//                 .toc-item {
//                     width: 100% !important;
//                     max-width: 100% !important;
//                 }

//                 .toc-content button {
//                     width: 100% !important;
//                     max-width: 100% !important;
//                 }

//                 .toc-content span {
//                     word-break: break-word !important;
//                     overflow-wrap: break-word !important;
//                     word-wrap: break-word !important;
//                     hyphens: auto !important;
//                 }

//                 /* Hide horizontal scrollbar completely */
//                 .toc-content::-webkit-scrollbar {
//                     width: 8px;
//                 }

//                 .toc-content::-webkit-scrollbar-track {
//                     background: #f1f1f1;
//                 }

//                 .toc-content::-webkit-scrollbar-thumb {
//                     background: #d1d5db;
//                     border-radius: 4px;
//                 }

//                 /* For Firefox */
//                 .toc-content {
//                     scrollbar-width: thin;
//                     scrollbar-color: #d1d5db #f1f1f1;
//                 }
//             `}</style>
//         </div>
//     );
// };

// // MODIFIED: Add this function to process content with IDs
// const processContentWithIds = (htmlContent) => {
//     if (!htmlContent) return htmlContent;

//     const tempDiv = document.createElement('div');
//     tempDiv.innerHTML = htmlContent;

//     // Add IDs to h2 elements
//     const h2Elements = tempDiv.querySelectorAll('h2');
//     h2Elements.forEach((h2, index) => {
//         if (!h2.id) {
//             h2.id = `h2-${index}-${Date.now()}`;
//         }
//     });

//     // Add IDs to h3 elements
//     const h3Elements = tempDiv.querySelectorAll('h3');
//     h3Elements.forEach((h3, index) => {
//         if (!h3.id) {
//             h3.id = `h3-${index}-${Date.now()}`;
//         }
//     });

//     return tempDiv.innerHTML;
// };

// export default function ArticleClient({ article }) {
//     const [isSticky, setIsSticky] = useState(false);
//     const [latestArticles, setLatestArticles] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [decodedContent, setDecodedContent] = useState('');
//     const [processedContent, setProcessedContent] = useState('');

//     // Comment related states
//     const [comments, setComments] = useState([]);
//     const [commentForm, setCommentForm] = useState({
//         name: '',
//         email: '',
//         content: '',
//         parentCommentId: null
//     });
//     const [replyingTo, setReplyingTo] = useState(null);
//     const [showReplies, setShowReplies] = useState({});

//     const { user, drawer, setDrawer } = useGlobal();
//     const viewCountUpdatedRef = useRef(false);

//     useEffect(() => {
//         if (!article?._id) return;

//         const startTime = Date.now();
//         console.log("⏱️ Article mounted, timer started");

//         return () => {
//             const endTime = Date.now();
//             const readDuration = Math.floor((endTime - startTime) / 1000); // seconds

//             if (readDuration > 0) {
//                 console.log("📤 Sending final read duration:", readDuration);

//                 axiosInstance.post(`/web/blog/log/${article._id}`, {
//                     readDuration,
//                 }).catch((error) => {
//                     console.error("❌ Failed to send read duration:", error);
//                 });
//             }
//         };
//     }, [article?._id]);


//     // Decode and process content with IDs
//     useEffect(() => {
//         if (article?.content) {
//             try {
//                 const decoded = article?.content
//                 setDecodedContent(decoded);

//                 // Process content to add IDs to headings
//                 const processed = processContentWithIds(decoded);
//                 setProcessedContent(processed);
//             } catch (error) {
//                 console.error('Error decoding content:', error);
//                 setDecodedContent('');
//                 setProcessedContent('');
//             }
//         }
//     }, [article?.content]);

//     // Also add IDs to headings in the actual DOM after render
//     useEffect(() => {
//         if (!processedContent) return;

//         // Use a small timeout to ensure DOM is rendered
//         const timeoutId = setTimeout(() => {
//             // Add IDs to any headings that don't have them
//             const h2Elements = document.querySelectorAll('.blogs h2');
//             h2Elements.forEach((h2, index) => {
//                 if (!h2.id) {
//                     h2.id = `h2-dom-${index}-${Date.now()}`;
//                 }
//             });

//             const h3Elements = document.querySelectorAll('.blogs h3');
//             h3Elements.forEach((h3, index) => {
//                 if (!h3.id) {
//                     h3.id = `h3-dom-${index}-${Date.now()}`;
//                 }
//             });
//         }, 1000);

//         return () => clearTimeout(timeoutId);
//     }, [processedContent]);

//     useEffect(() => {
//         const handleScroll = () => {
//             setIsSticky(window.scrollY > 200);
//         };
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     // Track reading time
//     // useEffect(() => {
//     //     if (!article?._id) return;

//     //     let startTime = Date.now();
//     //     let isVisible = true;
//     //     const handleVisibilityChange = () => {
//     //         if (document.hidden) {
//     //             isVisible = false;
//     //         } else {
//     //             isVisible = true;
//     //             startTime = Date.now() - totalPausedTime;
//     //         }
//     //     };

//     //     document.addEventListener('visibilitychange', handleVisibilityChange);

//     //     let totalPausedTime = 0;
//     //     let lastPauseTime = null;

//     //     const interval = setInterval(() => {
//     //         if (isVisible) {
//     //             const currentDuration = Math.floor((Date.now() - startTime - totalPausedTime) / 1000);
//     //             if (currentDuration > 0) {
//     //                 axiosInstance.post(`/web/blog/log/${article._id}`, {
//     //                     readDuration: currentDuration,
//     //                 }).catch(console.error);
//     //             }
//     //         }
//     //     }, 30000);

//     //     return () => {
//     //         document.removeEventListener('visibilitychange', handleVisibilityChange);
//     //         clearInterval(interval);
//     //     };
//     // }, [article?._id]);

//     useEffect(() => {
//         const fetchLatestArticles = async () => {
//             try {
//                 setLoading(true);
//                 const res = await axiosInstance('/web/blog?page=1&limit=5');

//                 if (res.data?.data) {
//                     const filteredArticles = res.data.data.filter(
//                         articleItem => articleItem.slug !== article?.slug
//                     ).slice(0, 4);

//                     setLatestArticles(filteredArticles);
//                 }
//             } catch (err) {
//                 console.error("Error fetching latest articles:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (article?.slug) {
//             fetchLatestArticles();
//         }
//     }, [article?.slug]);

//     // Fetch comments
//     const fetchComments = async () => {
//         try {
//             setLoading(true);
//             const response = await axiosInstance.get(`/web/comments/${article._id}`);

//             if (response.data.success) {
//                 setComments(response.data.data.comments || []);
//             }
//         } catch (error) {
//             console.error('Error fetching comments:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (article?._id) {
//             fetchComments();
//         }
//     }, [article?._id]);

//     // Handle comment submit
//     const handleCommentSubmit = async (e) => {
//         e.preventDefault();
//         if (!user) {
//             setDrawer(true);
//             return;
//         }

//         try {
//             const response = await axiosInstance.post('/web/comments/create', {
//                 articleId: article._id,
//                 content: commentForm.content,
//                 parentCommentId: commentForm.parentCommentId
//             });

//             if (response) {
//                 setCommentForm({
//                     name: '',
//                     email: '',
//                     content: '',
//                     parentCommentId: null
//                 });
//                 setReplyingTo(null);
//                 fetchComments();
//                 alert('Comment posted successfully! It will appear after admin approval.');
//             }
//         } catch (error) {
//             console.error('Error posting comment:', error);
//             alert('Error posting comment');
//         }
//     };

//     const handleReply = (commentId, authorName) => {
//         setReplyingTo(commentId);
//         setCommentForm(prev => ({
//             ...prev,
//             content: `@${authorName} `,
//             parentCommentId: commentId
//         }));
//         document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
//     };

//     const handleCancelReply = () => {
//         setReplyingTo(null);
//         setCommentForm(prev => ({
//             ...prev,
//             content: '',
//             parentCommentId: null
//         }));
//     };

//     const handleLike = async (commentId) => {
//         try {
//             await axiosInstance.post(`/web/${commentId}/like`);
//             fetchComments();
//         } catch (error) {
//             console.error('Error liking comment:', error);
//         }
//     };

//     const handleDislike = async (commentId) => {
//         try {
//             await axiosInstance.post(`/web/${commentId}/dislike`);
//             fetchComments();
//         } catch (error) {
//             console.error('Error disliking comment:', error);
//         }
//     };

//     const toggleReplies = (commentId) => {
//         setShowReplies(prev => ({
//             ...prev,
//             [commentId]: !prev[commentId]
//         }));
//     };

//     if (!article || !article.slug) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//                 <div className="text-center max-w-sm">
//                     <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <span className="text-2xl">📄</span>
//                     </div>
//                     <h1 className="text-2xl font-bold text-gray-900 mb-3">Article Not Found</h1>
//                     <Link
//                         href="/article"
//                         className="inline-flex items-center bg-[#E12827] text-white px-6 py-3 rounded-lg hover:bg-[#c82322] transition-colors font-medium"
//                     >
//                         Back to Articles
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className={notoSans.className}>
//             {/* Hero Section */}
//             <section className="hero-gradient py-8">
//                 <div className="max-w-7xl relative mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
//                     {/* Breadcrumb */}
//                     <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
//                         <Link
//                             href="/"
//                             style={{
//                                 pointerEvents: 'auto',
//                                 cursor: 'pointer',
//                                 position: 'relative',
//                                 zIndex: 9999
//                             }}
//                             className="hover:text-[#E12827] transition-colors"
//                         >
//                             Home
//                         </Link>
//                         <span>›</span>
//                         <Link
//                             href="/article"
//                             style={{
//                                 pointerEvents: 'auto',
//                                 cursor: 'pointer',
//                                 position: 'relative',
//                                 zIndex: 9999
//                             }}
//                             className="hover:text-[#E12827] transition-colors"
//                         >
//                             Articles
//                         </Link>
//                         <span>›</span>
//                         <span className="text-gray-900 font-medium truncate max-w-xs">{article.title}</span>
//                     </nav>

//                     {/* Article Title */}
//                     <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
//                         {article.title}
//                     </h1>

//                     {/* Article Meta */}
//                     <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
//                         <div className="flex items-center space-x-2">
//                             <span>📅</span>
//                             <span>{formatDate(article.createdAt)}</span>
//                         </div>
//                         {article.category && (
//                             <div className="flex items-center space-x-2">
//                                 <span className="bg-[#E12827] bg-opacity-10 text-[#E12827] px-3 py-1 rounded-full text-xs font-medium">
//                                     {article.category.name}
//                                 </span>
//                             </div>
//                         )}
//                         <div>
//                             <span className='text-[#E12827] px-3 py-1 rounded-full text-sm font-bold'>View - {article.viewCount}</span>
//                         </div>
//                         <div>
//                             <span className='text-[#E12827] px-3 py-1 rounded-full text-sm font-bold'>Read Time - {Math.ceil(article.readTime / 60)} min</span>
//                         </div>
//                         <div className='ml-auto'>
//                             <span className='
//   bg-gradient-to-r from-[#E12827] to-[#FF6B6B]
//   text-white
//   px-5 py-2
//   rounded-full
//   text-sm font-bold
//   shadow-lg
//   hover:shadow-xl
//   hover:from-[#FF6B6B]
//   hover:to-[#E12827]
//   transition-all duration-300
//   transform hover:-translate-y-0.5
//   tracking-wide
// '>
//                                 Author • Admin
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Article Content Section */}
//             <section className="py-12 bg-gray-50">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex flex-col lg:flex-row gap-8">
//                         {/* Main Content */}
//                         <div className="lg:w-8/12">
//                             <div className="sm:bg-white rounded-lg sm:shadow-sm sm:border sm:border-gray-200 overflow-hidden">
//                                 {/* Article Image */}
//                                 <div className="mb-6">
//                                     <img
//                                         className="w-full h-auto max-h-[500px] object-cover"
//                                         src={getCoverImageUrl(article.coverImage)}
//                                         alt={article.title || 'Article Image'}
//                                     />
//                                 </div>

//                                 {/* Table of Contents */}
//                                 {decodedContent && (
//                                     <div className="px-6 pb-6 border-b border-gray-100">
//                                         <TableOfContents
//                                             content={decodedContent}
//                                             className="shadow-lg"
//                                         />
//                                     </div>
//                                 )}

//                                 {/* Article Content - USE processedContent with IDs */}
//                                 <div className="sm:px-6 pb-8 pt-6">
//                                     <div className="html-reset">
//                                         <div
//                                             dangerouslySetInnerHTML={sanitizeContent(processedContent || decodedContent)}
//                                         />
//                                     </div>


//                                     {/* Share Section */}
//                                     <div className="mt-8 pt-6 border-t border-gray-200">
//                                         <h4 className="text-lg font-semibold text-gray-900 mb-4">Share this article:</h4>
//                                         <div className="flex justify-between items-center">
//                                             <div className='flex space-x-3'>
//                                                 <Link
//                                                     target='_blank'
//                                                     href={`${constant.SOCIAL_MEDIA_LINK.FB}/?u=${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
//                                                     className="w-10 h-10 bg-[#3b5998] text-white rounded-full flex items-center justify-center hover:bg-[#344e86] transition duration-200 hover:scale-110"
//                                                 >
//                                                     <i className="fa fa-facebook"></i>
//                                                 </Link>
//                                                 <Link
//                                                     target='_blank'
//                                                     href={`${constant.SOCIAL_MEDIA_LINK.TWITTER}/?url=${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
//                                                     className="w-10 h-10 bg-[#1da1f2] text-white rounded-full flex items-center justify-center hover:bg-[#0d95e8] transition duration-200 hover:scale-110"
//                                                 >
//                                                     <i className="fa fa-twitter"></i>
//                                                 </Link>
//                                                 <Link
//                                                     target='_blank'
//                                                     href={`${constant.SOCIAL_MEDIA_LINK.LINKEDIN}${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
//                                                     className="w-10 h-10 bg-[#0077b5] text-white rounded-full flex items-center justify-center hover:bg-[#00669c] transition duration-200 hover:scale-110"
//                                                 >
//                                                     <i className="fa fa-linkedin"></i>
//                                                 </Link>
//                                                 <Link
//                                                     target='_blank'
//                                                     href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
//                                                     className="w-10 h-10 bg-[#EA4335] text-white rounded-full flex items-center justify-center hover:bg-[#d33426] transition duration-200 hover:scale-110"
//                                                 >
//                                                     <i className="fa fa-envelope"></i>
//                                                 </Link>
//                                             </div>
//                                             <div>
//                                                 <span className='text-[#E12827] px-3 py-1 rounded-full text-sm font-bold'>~ By Admin</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Comment Section */}
//                             <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8 p-6">
//                                 <div className="flex items-center justify-between mb-6">
//                                     <h3 className="text-2xl font-bold text-gray-900">
//                                         Comments ({comments.length})
//                                     </h3>
//                                     {comments.length > 0 && (
//                                         <button
//                                             onClick={() => document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' })}
//                                             className="bg-[#E12827] text-white px-4 py-2 rounded-lg hover:bg-[#c82322] transition-colors text-sm font-medium"
//                                         >
//                                             Add Comment
//                                         </button>
//                                     )}
//                                 </div>

//                                 {/* Comment Form */}
//                                 <div id="comment-form" className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
//                                     <h4 className="text-lg font-bold text-gray-900 mb-2">
//                                         {replyingTo ? 'Reply to Comment' : 'Leave a Comment'}
//                                     </h4>
//                                     {replyingTo && (
//                                         <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm flex justify-between items-center">
//                                             <span className="font-medium">Replying to: {commentForm.content.split(' ')[0]}</span>
//                                             <button
//                                                 onClick={handleCancelReply}
//                                                 className="text-red-600 hover:text-red-800 text-sm font-medium"
//                                             >
//                                                 Cancel Reply
//                                             </button>
//                                         </div>
//                                     )}
//                                     <p className="text-gray-600 text-sm mb-4">Your email address will not be published.</p>
//                                     <form onSubmit={handleCommentSubmit} className="space-y-4">
//                                         <textarea
//                                             placeholder="Your Comment *"
//                                             className="w-full h-[150px] bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-xl border-2 border-gray-300 focus:border-red-500 w-full py-4 px-4 text-gray-900 transition-colors resize-none"
//                                             value={commentForm.content}
//                                             onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
//                                             required
//                                         />
//                                         <button
//                                             type="submit"
//                                             className="bg-[#E12827] text-white px-8 py-3 rounded-lg hover:bg-[#c82322] transition duration-200 font-semibold hover:shadow-lg"
//                                         >
//                                             POST {replyingTo ? 'REPLY' : 'COMMENT'}
//                                         </button>
//                                     </form>
//                                 </div>

//                                 {/* Comments List */}
//                                 {loading ? (
//                                     <div className="flex justify-center py-8">
//                                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
//                                     </div>
//                                 ) : (
//                                     <div className="space-y-4">
//                                         {comments.length === 0 ? (
//                                             <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
//                                                 <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//                                                     <span className="text-2xl">💬</span>
//                                                 </div>
//                                                 <p className="text-lg font-medium mb-2">No comments yet</p>
//                                                 <p className="text-sm text-gray-600">Be the first to share your thoughts!</p>
//                                             </div>
//                                         ) : (
//                                             comments.slice(0, 5).map((comment) => (
//                                                 <div key={comment._id} className="rounded-xl p-4 bg-white border border-gray-100 hover:border-gray-200 transition-all mb-4 last:mb-0">
//                                                     <div className="flex items-start space-x-3">
//                                                         <div className="flex-shrink-0">
//                                                             <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center shadow-sm">
//                                                                 <span className="text-red-600 font-bold text-sm">
//                                                                     {comment.author?.name?.charAt(0)?.toUpperCase() || 'A'}
//                                                                 </span>
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex-1 min-w-0">
//                                                             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
//                                                                 <div>
//                                                                     <span className="font-bold text-gray-900">
//                                                                         {comment.author?.name || 'Anonymous'}
//                                                                     </span>
//                                                                     <span className="text-xs text-gray-500 ml-2">
//                                                                         {formatDate(comment.createdAt)}
//                                                                     </span>
//                                                                 </div>
//                                                                 <div className="flex items-center space-x-3 mt-1 sm:mt-0">
//                                                                     <button
//                                                                         onClick={() => handleLike(comment._id)}
//                                                                         className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
//                                                                     >
//                                                                         <i className="fa fa-thumbs-up text-sm"></i>
//                                                                         <span className="text-sm">{comment.likes?.length || 0}</span>
//                                                                     </button>
//                                                                     <button
//                                                                         onClick={() => handleDislike(comment._id)}
//                                                                         className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
//                                                                     >
//                                                                         <i className="fa fa-thumbs-down text-sm"></i>
//                                                                         <span className="text-sm">{comment.dislikes?.length || 0}</span>
//                                                                     </button>
//                                                                     <button
//                                                                         onClick={() => handleReply(comment._id, comment.author?.name)}
//                                                                         className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
//                                                                     >
//                                                                         Reply
//                                                                     </button>
//                                                                 </div>
//                                                             </div>
//                                                             <p className="text-gray-700 mb-3">{comment.content}</p>

//                                                             {/* Replies Section */}
//                                                             {comment.nestedReplies && comment.nestedReplies.length > 0 && (
//                                                                 <div className="mt-4 space-y-3 border-l-2 border-gray-100 pl-4">
//                                                                     {(showReplies[comment._id]
//                                                                         ? comment.nestedReplies
//                                                                         : comment.nestedReplies.slice(0, 2)
//                                                                     ).map((reply) => (
//                                                                         <div key={reply._id} className="flex items-start space-x-3">
//                                                                             <div className="flex-shrink-0">
//                                                                                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
//                                                                                     <span className="text-purple-600 font-bold text-xs">
//                                                                                         {reply.author?.name?.charAt(0)?.toUpperCase() || 'A'}
//                                                                                     </span>
//                                                                                 </div>
//                                                                             </div>
//                                                                             <div className="flex-1">
//                                                                                 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
//                                                                                     <div>
//                                                                                         <span className="font-medium text-gray-900 text-sm">
//                                                                                             {reply.author?.name || 'Anonymous'}
//                                                                                         </span>
//                                                                                         <span className="text-xs text-gray-500 ml-2">
//                                                                                             {formatDate(reply.createdAt)}
//                                                                                         </span>
//                                                                                     </div>
//                                                                                     <div className="flex items-center space-x-2 mt-1 sm:mt-0">
//                                                                                         <button
//                                                                                             onClick={() => handleLike(reply._id)}
//                                                                                             className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
//                                                                                         >
//                                                                                             <i className="fa fa-thumbs-up text-xs"></i>
//                                                                                             <span className="text-xs">{reply.likes?.length || 0}</span>
//                                                                                         </button>
//                                                                                         <button
//                                                                                             onClick={() => handleDislike(reply._id)}
//                                                                                             className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
//                                                                                         >
//                                                                                             <i className="fa fa-thumbs-down text-xs"></i>
//                                                                                             <span className="text-xs">{reply.dislikes?.length || 0}</span>
//                                                                                         </button>
//                                                                                     </div>
//                                                                                 </div>
//                                                                                 <p className="text-gray-600 text-sm">{reply.content}</p>
//                                                                             </div>
//                                                                         </div>
//                                                                     ))}

//                                                                     {/* Toggle Replies Button */}
//                                                                     {comment.nestedReplies.length > 2 && (
//                                                                         <button
//                                                                             onClick={() => toggleReplies(comment._id)}
//                                                                             className="mt-2 text-sm text-red-600 hover:text-red-800 transition-colors flex items-center font-medium"
//                                                                         >
//                                                                             {showReplies[comment._id]
//                                                                                 ? 'Hide replies'
//                                                                                 : `View ${comment.nestedReplies.length - 2} more replies`}
//                                                                             <i className={`ml-1 ${showReplies[comment._id] ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
//                                                                         </button>
//                                                                     )}
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))
//                                         )}

//                                         {comments.length > 5 && (
//                                             <div className="text-center pt-4 border-t border-gray-200">
//                                                 <button
//                                                     className="text-red-600 hover:text-red-800 font-medium text-sm py-2 px-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
//                                                     onClick={() => alert('Showing all comments would require backend pagination implementation')}
//                                                 >
//                                                     Load more comments ({comments.length - 5} more)
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Sidebar */}
//                         <div className={`lg:w-4/12 ${isSticky ? 'lg:sticky lg:top-4' : ''}`}>
//                             <div className="space-y-6">
//                                 {/* Search Box */}
//                                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                                     <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//                                         <span className="text-red-600">🔍</span>
//                                         Search
//                                     </h5>
//                                     <div className="relative">
//                                         <input
//                                             type="search"
//                                             name="search"
//                                             placeholder="Search articles..."
//                                             className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 font-normal"
//                                         />
//                                         <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition duration-200">
//                                             <i className="fa fa-search" />
//                                         </button>
//                                     </div>
//                                 </div>

//                                 {/* Latest Articles */}
//                                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                                     <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">

//                                         Latest Articles
//                                     </h5>
//                                     <div className="space-y-3">
//                                         {loading ? (
//                                             Array.from({ length: 4 }).map((_, index) => (
//                                                 <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100">
//                                                     <div className="flex-shrink-0 w-[7rem] h-[4rem] bg-gray-200 animate-pulse rounded-lg"></div>
//                                                     <div className="flex-1 min-w-0">
//                                                         <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
//                                                         <div className="w-1/2 h-3 bg-gray-200 animate-pulse rounded"></div>
//                                                     </div>
//                                                 </div>
//                                             ))
//                                         ) : latestArticles.length > 0 ? (
//                                             latestArticles.map((articleItem) => (
//                                                 <Link
//                                                     key={articleItem.slug}
//                                                     href={`/article/${articleItem.slug}`}
//                                                     className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
//                                                 >
//                                                     <div className="flex-shrink-0 w-[7rem] h-[4rem] bg-gray-200 rounded-lg overflow-hidden">
//                                                         <img
//                                                             className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
//                                                             src={getCoverImageUrl(articleItem.coverImage)}
//                                                             alt={articleItem?.title || 'Latest Article Image'}
//                                                             loading="lazy"
//                                                         />
//                                                     </div>
//                                                     <div className="flex-1 min-w-0">
//                                                         <h6 className="font-semibold text-sm text-gray-900 group-hover:text-red-700 transition duration-200 leading-tight line-clamp-2 mb-1">
//                                                             {articleItem.title}
//                                                         </h6>
//                                                         <p className="text-xs text-gray-500 font-normal">
//                                                             {formatDate(articleItem.createdAt)}
//                                                         </p>
//                                                     </div>
//                                                 </Link>
//                                             ))
//                                         ) : (
//                                             <div className="text-center py-4">
//                                                 <p className="text-sm text-gray-500 mb-2">No other articles available</p>
//                                                 <Link
//                                                     href="/article"
//                                                     className="text-red-600 text-sm hover:underline font-medium"
//                                                 >
//                                                     Browse all articles
//                                                 </Link>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Categories */}
//                                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                                     <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">

//                                         Categories
//                                     </h5>
//                                     <div className="flex flex-wrap gap-2">
//                                         {['Study Abroad', 'Education', 'University', 'Scholarship', 'Visa', 'Career', 'Student Life'].map((category) => (
//                                             <Link
//                                                 key={category}
//                                                 href={`/article?category=${category}`}
//                                                 className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white transition duration-200 text-sm font-medium"
//                                             >
//                                                 {category}
//                                             </Link>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Tags Cloud */}
//                                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                                     <h5 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">

//                                         Tags
//                                     </h5>
//                                     <div className="flex flex-wrap gap-2">
//                                         {['Study Abroad', 'Education', 'University', 'Scholarship', 'Visa', 'Career', 'Student Life'].map((tag) => (
//                                             <Link
//                                                 key={tag}
//                                                 href={`/article?tag=${tag.toLowerCase()}`}
//                                                 className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm hover:bg-red-600 hover:text-white transition duration-200 font-medium"
//                                             >
//                                                 {tag}
//                                             </Link>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* CTA Section */}
//             <section className="py-12 md:py-16 bg-white">
//                 <div className="container mx-auto px-4 max-w-7xl">
//                     <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl sm:rounded-[24px] shadow-lg mx-auto w-full max-w-[1127px]">
//                         <div className="px-4 sm:px-6 lg:px-8">
//                             <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
//                                 <div className="w-full lg:w-[48%]">
//                                     <div className="text-center lg:text-left pl-[17px]">
//                                         <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[36px] font-bold mb-4 text-[#D71635] lg:leading-[37px]">
//                                             Have a question about Articles?
//                                         </h2>
//                                         <p className="text-base sm:text-lg lg:text-[18px] mb-4 sm:mb-6 text-[#666276] font-normal">
//                                             Want some help figuring out what kind of information you need?
//                                         </p>
//                                         <a
//                                             href="/contact"
//                                             className="inline-block bg-[#d71635] text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-3xl text-sm sm:text-base font-bold shadow-[0_0_8px_0_rgba(0,0,0,0.2)] hover:bg-[#b5122b] transition-all duration-300 hover:shadow-xl"
//                                         >
//                                             Help and Support
//                                         </a>
//                                     </div>
//                                 </div>
//                                 <div className="w-full lg:w-[38%]">
//                                     <div className="flex justify-center">
//                                         <img
//                                             src="/img/help-support-img.svg"
//                                             alt="Study Abroad Help"
//                                             className="w-full max-w-xs sm:max-w-sm lg:max-w-[25rem]"
//                                             loading="lazy"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }

"use client";
import Link from 'next/link';
import { constant } from '@/constant/index.constant';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
// import { useEffect, useState } from 'react';
// import axiosInstance from '@/services/axiosInstance';
// import { useGlobal } from '@/hooks/AppStateContext';


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
                        <h3 className="text-lg font-bold text-gray-900">Table of Contents</h3>
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

                            const parentH2 = headings.find(h =>
                                h.level === 2 && h.children.some(child => child.id === heading.id)
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
    slug
}: any) {

    
const [category,setCategories] = useState([])


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

 

      const [views, setViews] = useState(article.viewCount);

  useEffect(() => {
    const updateView = async () => {
      const res = await fetch(
        `https://uat.gatewayabroadeducations.com/api/v1/web/blog/${slug}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();
     

      // assuming API returns updated viewCount
      setViews(data?.data?.viewCount);
    };

    updateView();
  }, [slug]);

  
   
    // const [comments, setComments] = useState(commentsProp);
    // const [commentForm, setCommentForm] = useState({
    //     name: '',
    //     email: '',
    //     content: '',
    //     parentCommentId: null
    // });
    // const [replyingTo, setReplyingTo] = useState(null);
    // const [showReplies, setShowReplies] = useState({});
    // const [loading, setLoading] = useState(false);

    // const {user, setDrawer} = useGlobal();

    // const fetchComments = async () => {
    // try {
    //     setLoading(true);
    //     const response = await axiosInstance.get(`/web/comments/${article._id}`);

    //     if (response.data.success) {
    //         setComments(response.data.data.comments || []);
    //     }
    // } catch (error) {
    //     console.error('Error fetching comments:', error);
    // } finally {
    //     setLoading(false);
    // }
    // };

    // useEffect(() => {
    //     if (article?._id) {
    //         fetchComments();
    //     }
    // }, [article?._id]);

    // Handle comment submit
    // const handleCommentSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!user) {
    //         setDrawer(true);
    //         return;
    //     }

    //     try {
    //         const response = await axiosInstance.post('/web/comments/create', {
    //             articleId: article._id,
    //             content: commentForm.content,
    //             parentCommentId: commentForm.parentCommentId
    //         });

    //         if (response) {
    //             setCommentForm({
    //                 name: '',
    //                 email: '',
    //                 content: '',
    //                 parentCommentId: null
    //             });
    //             setReplyingTo(null);
    //             fetchComments();
    //             alert('Comment posted successfully! It will appear after admin approval.');
    //         }
    //     } catch (error) {
    //         console.error('Error posting comment:', error);
    //         alert('Error posting comment');
    //     }
    // };

    // const handleReply = (commentId, authorName) => {
    //     setReplyingTo(commentId);
    //     setCommentForm(prev => ({
    //         ...prev,
    //         content: `@${authorName} `,
    //         parentCommentId: commentId
    //     }));
    //     document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
    // };

    // const handleCancelReply = () => {
    //     setReplyingTo(null);
    //     setCommentForm(prev => ({
    //         ...prev,
    //         content: '',
    //         parentCommentId: null
    //     }));
    // };

    // const handleLike = async (commentId) => {
    //     try {
    //         await axiosInstance.post(`/web/${commentId}/like`);
    //         fetchComments();
    //     } catch (error) {
    //         console.error('Error liking comment:', error);
    //     }
    // };

    // const handleDislike = async (commentId) => {
    //     try {
    //         await axiosInstance.post(`/web/${commentId}/dislike`);
    //         fetchComments();
    //     } catch (error) {
    //         console.error('Error disliking comment:', error);
    //     }
    // };

    // const toggleReplies = (commentId) => {
    //     setShowReplies(prev => ({
    //         ...prev,
    //         [commentId]: !prev[commentId]
    //     }));
    // };


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
        <div>
            {/* Hero Section */}
            <section className="hero-gradient py-8 ">
                <div className="max-w-7xl relative mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                        <Link
                            href="/"
                            className="hover:text-[#E12827] transition-colors"
                        >
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
                        <span className="text-gray-900 font-medium truncate max-w-xs">{article.title}</span>
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
                            <span className='text-[#E12827] px-3 py-1 rounded-full text-sm font-bold'>View - {views}</span>
                        </div>
                        {/* <div>
                            <span className='text-[#E12827] px-3 py-1 rounded-full text-sm font-bold'>Read Time - {Math.ceil(article.readTime / 60)} min</span>
                        </div> */}
                        <div className='ml-auto'>
                            <span className='
                                bg-gradient-to-r from-[#E12827] to-[#FF6B6B]
                                text-white
                                px-5 py-2
                                rounded-full
                                text-sm font-bold
                                shadow-lg
                                hover:shadow-xl
                                hover:from-[#FF6B6B]
                                hover:to-[#E12827]
                                transition-all duration-300
                                transform hover:-translate-y-0.5
                                tracking-wide
                            '>
                                Author • Admin
                            </span>
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
                                        className="w-full h-auto max-h-[500px] object-cover"
                                        src={getCoverImageUrl(article.coverImage)}
                                        alt={article.title || 'Article Image'}
                                        loading="lazy"
                                    />
                                </div>

                                {/* Table of Contents */}
                                {tableOfContents.length > 0 && (
                                    <div className="pb-3 border-b border-gray-100">
                                        <TableOfContents
                                            headings={tableOfContents}
                                            className="shadow-lg"
                                        />
                                    </div>
                                )}

                                {/* Article Content */}
                                <div className="sm:px-6 pb-8 pt-6">

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
      
    .blog-html * a {
    text-decoration: underline;
    color : blue
}
    

    .blog-html strong {
      font-weight: 600;
    }
      html {
      scroll-behavior: smooth;
    }
  `}</style>
                                    <div
                                        className="article-content blog-html"
                                        dangerouslySetInnerHTML={{
                                            __html: processedContent || decodedContent,
                                        }}
                                    />

                                    <style>{`
  .article-content img {
    max-width: 100%;
    height: auto;
  }
`}</style>


                                    {/* Share Section */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Share this article:</h4>
                                        <div className="flex justify-between items-center">
                                            <div className='flex space-x-3'>
                                                <Link
                                                    target='_blank'
                                                    rel="noopener noreferrer"
                                                    href={`${constant.SOCIAL_MEDIA_LINK.FB}/?u=${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
                                                    className="w-10 h-10 bg-[#3b5998] text-white rounded-full flex items-center justify-center hover:bg-[#344e86] transition duration-200 hover:scale-110"
                                                >
                                                    <i className="fa fa-facebook"></i>
                                                </Link>
                                                <Link
                                                    target='_blank'
                                                    rel="noopener noreferrer"
                                                    href={`${constant.SOCIAL_MEDIA_LINK.TWITTER}/?url=${encodeURIComponent(`${constant.BASE_URL}/article/${article.slug}`)}`}
                                                    className="w-10 h-10 bg-[#1da1f2] text-white rounded-full flex items-center justify-center hover:bg-[#0d95e8] transition duration-200 hover:scale-110"
                                                >
                                                    <i className="fa fa-twitter"></i>
                                                </Link>
                                                <Link
                                                    target='_blank'
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
                                            <div>
                                                <span className='text-[#E12827] px-3 py-1 rounded-full text-sm font-bold'>~ By Admin</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Comments ({comments.length})
                                    </h3>
                                    {comments.length > 0 && (
                                        <button
                                            onClick={() => document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="bg-[#E12827] text-white px-4 py-2 rounded-lg hover:bg-[#c82322] transition-colors text-sm font-medium"
                                        >
                                            Add Comment
                                        </button>
                                    )}
                                </div>

                                <div id="comment-form" className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                                        {replyingTo ? 'Reply to Comment' : 'Leave a Comment'}
                                    </h4>
                                    {replyingTo && (
                                        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm flex justify-between items-center">
                                            <span className="font-medium">Replying to: {commentForm.content.split(' ')[0]}</span>
                                            <button
                                                onClick={handleCancelReply}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Cancel Reply
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-gray-600 text-sm mb-4">Your email address will not be published.</p>
                                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                                        <textarea
                                            placeholder="Your Comment *"
                                            className="w-full h-[150px] bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-xl border-2 border-gray-300 focus:border-red-500 w-full py-4 px-4 text-gray-900 transition-colors resize-none"
                                            value={commentForm.content}
                                            onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="bg-[#E12827] text-white px-8 py-3 rounded-lg hover:bg-[#c82322] transition duration-200 font-semibold hover:shadow-lg"
                                        >
                                            POST {replyingTo ? 'REPLY' : 'COMMENT'}
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
                                                <p className="text-lg font-medium mb-2">No comments yet</p>
                                                <p className="text-sm text-gray-600">Be the first to share your thoughts!</p>
                                            </div>
                                        ) : (
                                            comments.slice(0, 5).map((comment) => (
                                                <div key={comment._id} className="rounded-xl p-4 bg-white border border-gray-100 hover:border-gray-200 transition-all mb-4 last:mb-0">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center shadow-sm">
                                                                <span className="text-red-600 font-bold text-sm">
                                                                    {comment.author?.name?.charAt(0)?.toUpperCase() || 'A'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                                                <div>
                                                                    <span className="font-bold text-gray-900">
                                                                        {comment.author?.name || 'Anonymous'}
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
                                                                        <span className="text-sm">{comment.likes?.length || 0}</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDislike(comment._id)}
                                                                        className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                                                                    >
                                                                        <i className="fa fa-thumbs-down text-sm"></i>
                                                                        <span className="text-sm">{comment.dislikes?.length || 0}</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReply(comment._id, comment.author?.name)}
                                                                        className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                                                                    >
                                                                        Reply
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-700 mb-3">{comment.content}</p>

                                                            {comment.nestedReplies && comment.nestedReplies.length > 0 && (
                                                                <div className="mt-4 space-y-3 border-l-2 border-gray-100 pl-4">
                                                                    {(showReplies[comment._id]
                                                                        ? comment.nestedReplies
                                                                        : comment.nestedReplies.slice(0, 2)
                                                                    ).map((reply) => (
                                                                        <div key={reply._id} className="flex items-start space-x-3">
                                                                            <div className="flex-shrink-0">
                                                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                                                    <span className="text-purple-600 font-bold text-xs">
                                                                                        {reply.author?.name?.charAt(0)?.toUpperCase() || 'A'}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                                                                                    <div>
                                                                                        <span className="font-medium text-gray-900 text-sm">
                                                                                            {reply.author?.name || 'Anonymous'}
                                                                                        </span>
                                                                                        <span className="text-xs text-gray-500 ml-2">
                                                                                            {formatDate(reply.createdAt)}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                                                                                        <button
                                                                                            onClick={() => handleLike(reply._id)}
                                                                                            className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
                                                                                        >
                                                                                            <i className="fa fa-thumbs-up text-xs"></i>
                                                                                            <span className="text-xs">{reply.likes?.length || 0}</span>
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => handleDislike(reply._id)}
                                                                                            className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                                                                                        >
                                                                                            <i className="fa fa-thumbs-down text-xs"></i>
                                                                                            <span className="text-xs">{reply.dislikes?.length || 0}</span>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                                <p className="text-gray-600 text-sm">{reply.content}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                    {comment.nestedReplies.length > 2 && (
                                                                        <button
                                                                            onClick={() => toggleReplies(comment._id)}
                                                                            className="mt-2 text-sm text-red-600 hover:text-red-800 transition-colors flex items-center font-medium"
                                                                        >
                                                                            {showReplies[comment._id]
                                                                                ? 'Hide replies'
                                                                                : `View ${comment.nestedReplies.length - 2} more replies`}
                                                                            <i className={`ml-1 ${showReplies[comment._id] ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
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
                                                    onClick={() => alert('Showing all comments would require backend pagination implementation')}
                                                >
                                                    Load more comments ({comments.length - 5} more)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div> */}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-4/12">
                            <div className="space-y-6">
                                {/* Search Box */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                                                            alt={articleItem?.title || 'Latest Article Image'}
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
                                                <p className="text-sm text-gray-500 mb-2">No other articles available</p>
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
                                        {category && category?.map((category,i) => (
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
                                            Want some help figuring out what kind of information you need?
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