


interface EditorContentProps {
  content_data?: string | null;
}

const EditorContent = ({ content_data }: EditorContentProps) => {
  const sanitizeContent = (html: string): string => {
    if (!html) return "";

    if (typeof window === "undefined" || typeof DOMParser === "undefined") {
      return html;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove dangerous / unwanted tags
    doc
      .querySelectorAll(" style, meta, object, class")
      .forEach((el) => el.remove());

    // Allowlist of safe attributes
    const allowedAttributes = new Set([
      "href",
      "link",
      "embed",
      "src",
      "alt",
      "script",
      "title",
      "target",
      "rel",
      "id",
      "iframe",
      "width",
      "height",
      "colspan",
      "rowspan",
      "align",
      "valign",
    ]);

    doc.querySelectorAll("*").forEach((el) => {
      [...el.attributes].forEach((attr) => {
        // Keep data-* and aria-* attributes
        if (
          attr.name.startsWith("data-") ||
          attr.name.startsWith("aria-")
        ) {
          return;
        }

        if (!allowedAttributes.has(attr.name.toLowerCase())) {
          el.removeAttribute(attr.name);
        }
      });

      // Force safe link behavior
      if (el.tagName === "A") {
        el.setAttribute("rel", "noopener noreferrer");
        if (!el.getAttribute("target")) {
          el.setAttribute("target", "_blank");
        }
      }
    });

    return doc.body.innerHTML;
  };

  return (
    <>
      <style>{`
        .blog-html {
          line-height: 1.7;
        }

        .blog-html table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 15px;
          table-layout: fixed;
        }

        .blog-html figure.table {
          overflow-x: auto;
          margin: 20px 0;
        }

        
        .blog-html td {
          padding: 12px;
          border: 1px solid #e5e7eb;
          word-break: break-word;
          vertical-align: top;
        }

        .blog-html thead th {
          background: #d61536;
          color: white;
          font-weight: 600;
          text-align: center;
        }

        .blog-html tr:nth-child(even) {
          background-color: #f3ebeb;
        }

        .blog-html h2 {
          font-size: 26px;
          margin: 28px 0 12px;
          font-weight: 700;
          color: #00306a;
        }

        .blog-html h3 {
          font-size: 20px;
          margin: 22px 0 10px;
          font-weight: 600;
          color: #00306a;
        }

        .blog-html h4 {
          font-size: 18px;
          margin: 18px 0 8px;
          font-weight: 600;
        }

        .blog-html a {
          color: #240dbd;
        }

        .blog-html p {
          line-height: 1.8;
          margin-bottom: 1rem;
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

        .blog-html strong {
          font-weight: 600;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {content_data && (
        <div
          className="
            blog-html
            prose
            prose-lg
            dark:prose-invert
            max-w-none
            
            [&_h1]:text-4xl
            [&_h1]:font-bold
            [&_h1]:text-[#1a1a1a]
            [&_h1]:mb-6

            [&_h2]:text-3xl
            [&_h2]:font-semibold
            [&_h2]:text-[#1a1a1a]
            [&_h2]:mt-8
            [&_h2]:mb-4
          
            [&_h3]:text-2xl
            [&_h3]:font-semibold
            [&_h3]:mt-6
          
            [&_p]:text-justify
            [&_p]:leading-8
            [&_p]:text-gray-700
            [&_p]:mb-4

            [&_div]:my-4


            
            [&_ul]:list-disc
            [&_ul]:pl-6
            [&_ul]:space-y-2

            [&_ol]:list-decimal
            [&_ol]:pl-6
            [&_ol]:space-y-2

            [&_li]:text-gray-700
            [&_li]:leading-7
            [&_li]:text-justify

            [&_a]:text-[#f26e46]
            [&_a]:font-semibold
            [&_a]:underline
            [&_a:hover]:text-[#d9532f]

            [&_strong]:font-bold
            [&_strong]:text-black

            [&_img]:rounded-xl
            [&_img]:my-6
          "
          dangerouslySetInnerHTML={{
            __html: sanitizeContent(content_data),
          }}
        />
      )}
    </>
  );
};

export default EditorContent;