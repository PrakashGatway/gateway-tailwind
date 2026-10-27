import { connectAdminDb } from "@/lib/admin/db";

export type RecentContent = {
  id: string;
  title: string;
  type: "Blog" | "Article";
  href: string;
  createdAt: string | null;
};

export async function getAdminDashboard() {
  const connection = await connectAdminDb();
  const db = connection.connection.db;
  if (!db) throw new Error("MongoDB connection is unavailable");

  const [forms, blogs, articles, students, latestBlogs, latestArticles] =
    await Promise.all([
      db.collection("forms").countDocuments(),
      db.collection("blogs").countDocuments(),
      db.collection("articles").countDocuments(),
      db.collection("students").countDocuments(),
      db.collection("blogs")
        .find({}, { projection: { blogTitle: 1, Slug: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
      db.collection("articles")
        .find({}, { projection: { title: 1, slug: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ]);

  const recent: RecentContent[] = [
    ...latestBlogs.map((item) => ({
      id: String(item._id),
      title: String(item.blogTitle || "Untitled blog"),
      type: "Blog" as const,
      href: "/blog-description/" + encodeURIComponent(String(item.Slug || "")),
      createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : null,
    })),
    ...latestArticles.map((item) => ({
      id: String(item._id),
      title: String(item.title || "Untitled article"),
      type: "Article" as const,
      href: "/article/" + encodeURIComponent(String(item.slug || "")),
      createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : null,
    })),
  ]
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, 5);

  return { forms, blogs, articles, students, recent };
}
