import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { blogImageSource, cloudinaryCardImage } from "@/lib/blog-image";

type Blog = {
  Slug?: string;
  image?: string;
  blogTitle?: string;
  blogDescription?: string;
  descriptions?: string;
  createdAt?: string;
  category?: string | { name?: string };
};

type BlogCardProps = {
  blog?: Blog;
  loading?: boolean;
  showDescription?: boolean;
  href?: string;
};

function excerpt(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

export default function BlogCard({
  blog,
  loading = false,
  showDescription = true,
  href,
}: BlogCardProps) {
  if (loading || !blog) {
    return (
      <div
        aria-hidden="true"
        className="overflow-hidden rounded-[22px] border border-slate-100 bg-white shadow-sm"
      >
        <div className="aspect-[16/8] animate-pulse bg-slate-100" />
        <div className="space-y-3 p-5">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
          <div className="h-5 w-11/12 animate-pulse rounded bg-slate-100" />
          <div className="h-5 w-8/12 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  const source = blogImageSource(blog.image);
  const cloudinary = cloudinaryCardImage(source, 480);
  const srcSet = cloudinary
    ? [320, 480, 800]
        .map((width) => `${cloudinaryCardImage(source, width)} ${width}w`)
        .join(", ")
    : undefined;
  const category =
    typeof blog.category === "string" ? blog.category : blog.category?.name;
  const date = blog.createdAt ? new Date(blog.createdAt) : null;
  const published =
    date && Number.isFinite(date.getTime())
      ? new Intl.DateTimeFormat("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(date)
      : null;
  const summary = excerpt(blog.descriptions || blog.blogDescription || "");

  return (
    <Link
      href={href || `/blog-description/${blog.Slug || ""}`}
      className="group border flex h-full min-w-0 flex-col overflow-hidden rounded-[22px] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/8] overflow-hidden bg-[#f8e6e9]">
        <img
          src={cloudinary || source}
          srcSet={srcSet}
          sizes="(min-width: 1280px) 390px, (min-width: 768px) 46vw, calc(100vw - 32px)"
          alt={blog.blogTitle || "Study abroad article"}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500"
          onError={(event) => {
            const image = event.currentTarget;
            if (image.dataset.fallback) return;
            image.dataset.fallback = "true";
            image.srcset = "";
            image.src = "/img/blog-banner-img.svg";
          }}
        />
        {category && (
          <span className="absolute bottom-3 left-3 max-w-[calc(100%-24px)] truncate rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#bd1b3a] shadow-sm backdrop-blur">
            {category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className=" line-clamp-2 text-lg font-semibold leading-snug text-[#1e293b] transition-colors group-hover:text-[#c41430] sm:text-lg">
          {blog.blogTitle}
        </h2>
        {showDescription && summary && (
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#64748b]">
            {summary}
          </p>
        )}
        <div className="mt-auto flex justify-between items-center">
          <span className=" inline-flex items-center gap-1.5 pt-3 text-sm font-bold text-[#d81635]">
            Read article{" "}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
          {published && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <CalendarDays className="h-3.5 w-3.5" />
              {published}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
