import DOMPurify from "isomorphic-dompurify";

const allowedTags = [
  "p", "h1", "h2", "h3", "h4", "h5", "h6",
  "div", "span", "br", "hr",
  "strong", "b", "em", "i", "u", "s", "del", "mark",
  "blockquote", "ul", "ol", "li", "a", "img",
  "figure", "figcaption", "table", "thead", "tbody",
  "tfoot", "tr", "th", "td", "caption", "pre", "code",
  "sup", "sub", "details", "summary",
];

const allowedAttributes = [
  "href", "src", "srcset", "sizes", "alt", "title", "id",
  "colspan", "rowspan", "start", "reversed", "open",
];

export type BlogHeading = {
  id: string;
  text: string;
  level: 2;
};

export function prepareBlogContent(html: unknown) {
  if (typeof html !== "string" || !html.trim()) {
    return { html: "", headings: [] as BlogHeading[] };
  }

  const body = DOMPurify.sanitize(html, {
    RETURN_DOM: true,
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: [...allowedAttributes, "style"],
  }) as HTMLElement;

  // Preserve editor styles only on images.
// Preserve editor styles only on images and figures.
body.querySelectorAll("[style]:not(img):not(figure)").forEach((element) => {
  element.removeAttribute("style");
});
  // Make tables horizontally scrollable.
  body.querySelectorAll("table").forEach((table) => {
    const wrapper = table.ownerDocument.createElement("div");
    wrapper.className = "blog-table-scroll";
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", "Scrollable table");
    wrapper.setAttribute("tabindex", "0");

    table.parentNode?.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  // Image defaults.
  body.querySelectorAll("img").forEach((img) => {
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");

    if (!img.getAttribute("alt")?.trim()) {
      img.setAttribute("alt", "Article illustration");
    }
  });

  // Secure external links.
  body.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href");

    if (href && /^https?:\/\//i.test(href)) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

  // Convert h1 to h2 and generate unique heading IDs.
  body.querySelectorAll("h1").forEach((heading) => {
    const h2 = body.ownerDocument.createElement("h2");
    h2.innerHTML = heading.innerHTML;

    for (const attr of Array.from(heading.attributes)) {
      if (attr.name !== "style") {
        h2.setAttribute(attr.name, attr.value);
      }
    }

    heading.replaceWith(h2);
  });

  const headings: BlogHeading[] = [];
  const usedIds = new Set<string>();

  body.querySelectorAll("h2").forEach((heading, index) => {
    const text = heading.textContent?.trim() ?? "";

    const base =
      text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-|-$/g, "") || `section-${index + 1}`;

    let id = base;
    let suffix = 2;

    while (usedIds.has(id)) {
      id = `${base}-${suffix++}`;
    }

    usedIds.add(id);
    heading.setAttribute("id", id);

    headings.push({
      id,
      text,
      level: 2,
    });
  });

  return {
    html: body.innerHTML,
    headings,
  };
}
