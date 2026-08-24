"use client"

import Image from "next/image"
import Link from "next/link"

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export const sanitizedData = (data) => {
  return { __html: data }
}

export default function BlogNew({ blog = [], layout = "grid" }) {
  // date format


  // sanitize html


  // ✅ layout control
  const wrapperClass =
    layout === "slider"
      ? "flex gap-6"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

  return (
    <section className={`${wrapperClass} py-10 mt-20 px-10`}>
      {blog
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((item, index) => (
          <div
            key={index}
            className={`${layout === "slider"
              ? "min-w-[360px] max-w-[360px]"
              : ""
              } border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white`}
          >
            {/* Image */}
            <div className="relative h-52">
              <Image
                src={
                  item.image
                    ? `https://api.gatewayabroadeducations.com/api/uploads/${item.image}`
                    : "https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg"
                }
                alt={item.blogTitle}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Date */}
              <div className="flex items-center gap-2 text-xm text-gray-500 mb-2">
                <span>{formatDate(item.createdAt)}</span>
              </div>

              {/* Title */}
              <Link href={`/blog-description/${item.Slug}`}>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors">
                  {item.blogTitle}
                </h3>
              </Link>

              {/* Description */}
              <div
                className="text-gray-600 text-xm line-clamp-2"
                dangerouslySetInnerHTML={sanitizedData(item.blogDescription)}
              />
            </div>
          </div>
        ))}
    </section>
  )
}
