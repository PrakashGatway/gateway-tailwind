import DOMPurify from "isomorphic-dompurify";

const allowedTags = [
  "p", "h1", "h2", "h3", "h4", "h5", "h6", "div", "span", "br", "hr",
  "strong", "b", "em", "i", "u", "s", "del", "mark", "blockquote",
  "ul", "ol", "li", "a", "img", "figure", "figcaption", "table",
  "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "pre",
  "code", "sup", "sub", "details", "summary",
];

const allowedAttributes = [
  "href", "src", "srcset", "sizes", "alt", "title", "id", "colspan",
  "rowspan", "start", "reversed", "open",
];

export type BlogHeading = { id: string; text: string; level: 2 | 3 };

export function prepareBlogContent(html: unknown) {
  if (typeof html !== "string" || !html.trim()) {
    return { html: "", headings: [] as BlogHeading[] };
  }

  // API typography and layout attributes are intentionally excluded. The
  // article stylesheet defines the appearance of the sanitized markup.
  const body = DOMPurify.sanitize(html, {
    RETURN_DOM: true,
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
  }) as HTMLElement;

  body.querySelectorAll("table").forEach((table) => {
    const wrapper = body.ownerDocument.createElement("div");
    wrapper.className = "blog-table-scroll";
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", "Scrollable article table");
    wrapper.tabIndex = 0;
    table.parentNode?.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  body.querySelectorAll("img").forEach((image) => {
    image.setAttribute("loading", "lazy");
    image.setAttribute("decoding", "async");
    if (!image.hasAttribute("alt")) image.setAttribute("alt", "Article illustration");
  });

  body.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (/^https?:\/\//i.test(href)) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

  body.querySelectorAll("h1").forEach((heading) => {
    const sectionHeading = body.ownerDocument.createElement("h2");
    sectionHeading.innerHTML = heading.innerHTML;
    heading.replaceWith(sectionHeading);
  });

  const usedIds = new Set<string>();
  const headings: BlogHeading[] = [];
  body.querySelectorAll("h2, h3").forEach((heading, index) => {
    const text = heading.textContent?.replace(/\s+/g, " ").trim() || "";
    if (!text) return;
    const base = text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || `section-${index + 1}`;
    let id = base;
    let suffix = 2;
    while (usedIds.has(id)) id = `${base}-${suffix++}`;
    usedIds.add(id);
    heading.id = id;
    headings.push({ id, text, level: heading.tagName === "H2" ? 2 : 3 });
  });

  return { html: body.innerHTML, headings };
}
