import Image from "next/image";
import { constant } from "@/constant/index.constant";

const BlogCard = ({ blog, onClick, loading = false, showDescription = true }) => {
  // If loading, return skeleton
  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Image Skeleton */}
        <div className="bg-gray-300 h-48"></div>
        
        {/* Content Skeleton */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-20 mt-3"></div>
        </div>
      </div>
    );
  }

  // If not loading, return actual blog card
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  const sanitizedData = (content) => ({
    __html: content,
  });

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md cursor-pointer  transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative h-[236px] ">
        <Image
          src={`${constant.REACT_APP_URL}/uploads/${blog.image}`}
          alt={blog.blogTitle}
          fill
          className="object-fill rounded-2xl"
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Date */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors">
          {blog.blogTitle}
        </h3>

        {/* Description - Conditionally rendered */}
        {showDescription && (
          <div
            className="text-gray-600 text-sm line-clamp-3"
            dangerouslySetInnerHTML={sanitizedData(blog.blogDescription)}
          />
        )}

        {/* Read More Link */}
        <div className={`${showDescription ? 'pt-3 border-t border-gray-100' : 'pt-2'}`}>
          <span className="text-red-600 text-sm font-medium hover:text-red-700 transition-colors">
            Read More →
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;