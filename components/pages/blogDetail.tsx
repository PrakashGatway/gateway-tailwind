'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; // Import Next.js router hooks
import PageServices from '@/services/PageServices'; // Adjust path as needed
import { constant } from '@/constant/index.constant'; // Adjust path as needed
import DOMPurify from 'dompurify';
import Loader from '../loader';

const sanitizeContent = (content) => {
  return { __html: DOMPurify.sanitize(content) };
};

export default function SingleBlogPage({ data }) {
  const router = useRouter(); // Use useRouter for navigation
  const params = useParams(); // Get params using useParams
  const { slug: id } = params; // Extract 'slug' param (assuming dynamic route is [slug])

  const [blogData, setBlogData] = useState([]);
  const [singleBlogData, setSingleBlogData] = useState({});
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAdjacentBlogs = () => {
    const allBlogs = [...(Array.isArray(blogData) ? blogData : []), singleBlogData]
      .filter(blog => blog && blog.Slug) // Filter out invalid blog objects
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
    if (!id) return; // Guard clause

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
        router.push('/blog'); // Redirect on failure to fetch specific blog
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
      router.push('/blog'); // Redirect on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  if (!singleBlogData || !singleBlogData.Slug) {
    return (
      <div className="container py-5 text-center">
        <h1>Blog Post Not Found</h1>
        <p>The requested blog post could not be found.</p>
        <Link href="/blog" className="site-btn">Back to Blog</Link>
      </div>
    );
  }

  return (
    <>

      <div>
        <section>
          <div style={{ marginTop: "6rem" }} className="banner-sec new-banner-sec single-blog-banner">
            <div className="container">
              <div className="banner-content text-left">
                <h1 className="banner-heading">{singleBlogData?.blogTitle}</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="blog-content-section py-60">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <div className="col-12 mb-3">
                  {/* Add width/height if known for better layout shift */}
                  <img
                    width="100%"
                    src={`${constant.REACT_APP_URL}/uploads/${singleBlogData.image}`}
                    alt={singleBlogData?.blogTitle || 'Blog Image'}
                  />
                </div>
                <div className="blog-content-section-left">
                  <div className='blog_inside text-justify' dangerouslySetInnerHTML={sanitizeContent(singleBlogData?.blogDescription || '')}></div>

                  <div className="blog-navigation mb-4 d-flex justify-content-between">
                    {prevBlog ? (
                      <Link
                        href={`/blog-description/${prevBlog?.Slug}`} // Adjust path if needed
                        className="site-btn px-3"
                      >
                        Previous
                      </Link>
                    ) : <div></div>}
                    {nextBlog ? (
                      <Link
                        href={`/blog-description/${nextBlog?.Slug}`} // Adjust path if needed
                        className="site-btn px-3"
                      >
                        Next
                      </Link>
                    ) : <div></div>}
                  </div>

                  <div className="share-blog-section">
                    <ul className="list-unstyled">
                      <li>
                        <Link
                          target='_blank'
                          href={`${constant.SOCIAL_MEDIA_LINK.FB}/?u=${encodeURIComponent(`${constant.REACT_APP_URL}/blog-description/${singleBlogData.Slug}`)}`} // Encode URL
                          className="share-fb"
                        >
                          <span><i className="fa fa-facebook" /></span>Facebook
                        </Link>
                      </li>
                      <li>
                        <Link
                          target='_blank'
                          href={`${constant.SOCIAL_MEDIA_LINK.TWITTER}/?url=${encodeURIComponent(`${constant.REACT_APP_URL}/blog-description/${singleBlogData.Slug}`)}`} // Encode URL
                          className="share-twi"
                        >
                          <span><i className="fa fa-twitter" /></span>Twitter
                        </Link>
                      </li>
                      <li>
                        <Link
                          target='_blank'
                          href={`${constant.SOCIAL_MEDIA_LINK.LINKEDIN}${encodeURIComponent(`${constant.REACT_APP_URL}/blog-description/${singleBlogData.Slug}`)}`} // Encode URL
                          className="share-link"
                        >
                          <span><i className="fa fa-linkedin" /></span>Linkedin
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="post-comment-section">
                    <h4>Leave a Reply</h4>
                    <p>Your email address will not be published.</p>
                    <form className="post-comment-form">
                      <div className="row gy-3">
                        <div className="col-md-6">
                          <div className="input-field">
                            <input type="text" name="name" placeholder="Name" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-field">
                            <input type="email" name="email" placeholder="Email" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="input-field">
                            <textarea placeholder="Comment" className="form-control" rows={3} defaultValue={""} />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="input-field">
                            <button type="submit" className="post-cmnt-btn site-btn">Post Comment </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="blog-content-section-right ps-4">
                  <div className="blog-search-box mb-50">
                    <h5>Search</h5>
                    <div className="blog-search-box-inner">
                      <input type="search" name="search" className="form-control" />
                      <button><i className="fa fa-search" /></button>
                    </div>
                  </div>

                  <div className="latest-post-section mb-50">
                    <h5>Latest Post</h5>
                    <div className="latest-post-section-inner">
                      {/* Ensure blogData is an array before mapping */}
                      {Array.isArray(blogData) && blogData.slice(0, 2).map((blog) => (
                        <div key={blog.Slug} className="latest-post-card">
                          <div className="latest-post-card-img">
                            <img
                              src={`${constant.REACT_APP_URL}/uploads/${blog.image}`}
                              alt={blog?.blogTitle || 'Latest Post Image'}
                            />
                          </div>
                          <div className="latest-post-card-body">
                            <h6>
                              <Link href={`/blog-description/${blog.Slug}`}>{blog.blogTitle}</Link>
                            </h6>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-50 categories-sec">
                    <h5>Categories</h5>
                    <div className="categories-sec-inner">
                      <ul className="list-unstyled">
                        {/* Consider making these dynamic or linking to category pages if they exist */}
                        <li><Link href={`/blog?category=GMAT`}>GMAT</Link></li>
                        <li><Link href={`/blog?category=TOEFL`}>TOEFL</Link></li>
                        <li><Link href={`/blog?category=IELTS`}>IELTS</Link></li>
                        <li><Link href={`/blog?category=GRE`}>GRE</Link></li>
                        <li><Link href={`/blog?category=PTE`}>PTE</Link></li>
                        <li><Link href={`/blog?category=SAT`}>SAT</Link></li>
                        <li><Link href={`/blog?category=SPOKEN ENGLISH`}>SPOKEN ENGLISH</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======== become partner section start ===== */}
        <section className="app-banner-section">
          <div className="container">
            <div className="app-banner-section-inner app-banner-section-inner-2">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="app-banner-content-left">
                    <h2 className="mb-3">Have a question about GMAT?</h2>
                    <p className="mb-4">Want some help figuring out what kind of prep service is right for you?</p>
                    <Link className="site-btn" href="/contact">Help &amp; Support</Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="app-banner-content-right text-center mx-auto">
                    <img className='mx-auto' src="/img/help-support-img.svg" alt="Help & Support" /> {/* Use relative path if local */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ======== become partner section end ===== */}
      </div>
    </>
  );
}
