export default function BlogArticleContent({ html }: { html: string }) {
  if (!html) return <p className="text-sm text-slate-500">This article has no content yet.</p>;
  return <div className="blog-article-content min-w-0" dangerouslySetInnerHTML={{ __html: html }} />;
}
