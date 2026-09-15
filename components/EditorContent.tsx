


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
   .blog-html table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 24px 0;
  font-size: 15px;
  overflow: hidden;
  border: 1px solid #f1c4ca;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(214, 31, 62, 0.08);
}

.blog-html th,
.blog-html td {
  padding: 4px 10px;
  text-align: left;
  vertical-align: top;
  border-right: 1px solid #f4d9dd;
  border-bottom: 1px solid #f4d9dd;
}

.blog-html th {
  background: #fdecef;
  color: #a81730;
  font-weight: 600;
  border-bottom: 2px solid #f3c1c9;
}

.blog-html td {
  color: #374151;
  background: #ffffff;
}

.blog-html tr:nth-child(even) td {
  background: #fff8f9;
}

.blog-html tr:hover td {
  background: #fcecef;
}

/* Remove last borders */
.blog-html tr:last-child td {
  border-bottom: none;
}

.blog-html th:last-child,
.blog-html td:last-child {
  border-right: none;
}
      .blog-html * a {
    text-decoration: none;
    color : blue
}

    .blog-html th {
      background: #f3f4f6;
      font-weight: 600;
    }

    .blog-html tr:nth-child(even) {
      background-color: #fafafa;
    }

    .blog-html h2 span,
          .blog-html h2 strong,
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