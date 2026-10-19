// Mock API response. Replace fetchBannerPopups with a backend request when ready;
// the banner component and route/action matching can stay unchanged.
export type BannerAction =
  | { type: "contact" }
  | { type: "route"; href: string }
  | { type: "whatsapp"; message?: string }
  | { type: "none" };

export type BannerTarget = {
  path: string;
  match: "exact" | "prefix";
};

export type BannerPopup = {
  id: string;
  enabled: boolean;
  layout: "full" | "sidebar";
  targets: BannerTarget[];
  eyebrow: string;
  title: string;
  description: string;
  highlight: string;
  buttonLabel: string;
  buttonAction: BannerAction;
  closeAction: BannerAction;
  // A backend image URL takes precedence over the generated mock artwork.
  imageUrl?: string;
  imageAlt?: string;
};

const mockBanners: BannerPopup[] = [
  {
    id: "uk-study-guide",
    enabled: true,
    layout: "full",
    targets: [
      { path: "/study-in-uk", match: "exact" },
      { path: "/study-in/uk", match: "exact" },
    ],
    eyebrow: "YOUR UK JOURNEY STARTS HERE",
    title: "Make the UK your next big move.",
    description: "Expert help with universities, applications and visas.",
    highlight: "Personal guidance. Global possibilities.",
    buttonLabel: "Plan my UK journey",
    buttonAction: { type: "contact" },
    closeAction: { type: "contact" },
  },
  {
    id: "usa-study-guide",
    enabled: true,
    layout: "sidebar",
    targets: [
      { path: "/study-in-usa", match: "exact" },
      { path: "/study-in/usa", match: "exact" },
    ],
    eyebrow: "STUDY IN THE USA",
    title: "Your US university plan starts here.",
    description: "Get a personalised shortlist and next steps.",
    highlight: "Free expert guidance",
    buttonLabel: "Let's talk",
    buttonAction: { type: "contact" },
    closeAction: { type: "route", href: "/contact" },
  },
  {
    id: "all-destinations",
    enabled: true,
    layout: "sidebar",
    targets: [
      { path: "/study-in-", match: "prefix" },
      { path: "/study-in/", match: "prefix" },
    ],
    eyebrow: "YOUR NEXT DESTINATION",
    title: "Ready to study abroad?",
    description: "Let us help you find your best-fit university.",
    highlight: "Explore your options",
    buttonLabel: "Get guidance",
    buttonAction: { type: "contact" },
    closeAction: { type: "none" },
  },
  {
    id: "study-abroad",
    enabled: true,
    layout: "full",
    targets: [{ path: "/study-abroad", match: "prefix" }],
    eyebrow: "DREAM BEYOND BORDERS",
    title: "Your study abroad story starts now.",
    description: "Find the right country, course and university with expert guidance.",
    highlight: "One journey. Every step supported.",
    buttonLabel: "Explore my options",
    buttonAction: { type: "contact" },
    closeAction: { type: "none" },
  },
  {
    id: "test-preparation",
    enabled: true,
    layout: "sidebar",
    targets: [
      { path: "/course", match: "prefix" },
      { path: "/spoken-english", match: "exact" },
    ],
    eyebrow: "TEST PREPARATION",
    title: "Get ready for your best score.",
    description: "Ask about coaching, batches and study plans.",
    highlight: "Learn with confidence",
    buttonLabel: "Find my course",
    buttonAction: { type: "contact" },
    closeAction: { type: "whatsapp" },
  },
  {
    id: "articles",
    enabled: true,
    layout: "sidebar",
    targets: [{ path: "/article", match: "prefix" }],
    eyebrow: "ARTICLES",
    title: "Turn insights into your next step.",
    description: "Expert advice for your next step.",
    highlight: "Expert guidance is here",
    buttonLabel: "Ask an expert",
    buttonAction: { type: "contact" },
    closeAction: { type: "none" },
  },
  {
    id: "blogs",
    enabled: true,
    layout: "sidebar",
    targets: [
      { path: "/blog-description", match: "prefix" },
      { path: "/blog", match: "prefix" },
    ],
    eyebrow: "BLOGS",
    title: "Found something inspiring?",
    description: "Plan your study abroad journey with us.",
    highlight: "Talk to a counsellor",
    buttonLabel: "Get in touch",
    buttonAction: { type: "contact" },
    closeAction: { type: "none" },
  },
];

export async function fetchBannerPopups(): Promise<BannerPopup[]> {
  return mockBanners;
}

export function findBannerForPath(pathname: string, banners: BannerPopup[]): BannerPopup | null {
  const normalizedPath = pathname.replace(/\/+$/, "").toLowerCase() || "/";

  return banners.find((banner) =>
    banner.enabled && banner.targets.some((target) => {
      const targetPath = target.path.toLowerCase();
      return target.match === "exact"
        ? normalizedPath === targetPath
        : targetPath.endsWith("/") || targetPath.endsWith("-")
          ? normalizedPath.startsWith(targetPath)
          : normalizedPath === targetPath || normalizedPath.startsWith(`${targetPath}/`);
    }),
  ) || null;
}

function escapeSvg(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[character] || character);
}

function wrapWords(value: string, maxLength: number, maxLines: number): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;
  const visible = lines.slice(0, maxLines);
  visible[maxLines - 1] = `${visible[maxLines - 1].replace(/[\s.]+$/, "")}…`;
  return visible;
}

function svgLines(lines: string[], x: number, y: number, spacing: number): string {
  return lines.map((line, index) =>
    `<tspan x="${x}" y="${y + index * spacing}">${escapeSvg(line)}</tspan>`,
  ).join("");
}

// The mock API does not provide uploaded artwork yet. Generate an SVG *image*
// so each route still has a real image-only offer, including article categories.
export function getBannerImageUrl(banner: BannerPopup, categoryName?: string | null): string {
  if (banner.imageUrl) return banner.imageUrl;

  const isFull = banner.layout === "full";
  const width = isFull ? 1200 : 900;
  const height = isFull ? 620 : 330;
  const eyebrow = categoryName && (banner.id === "articles" || banner.id === "blogs")
    ? `${banner.eyebrow} · ${categoryName}`
    : banner.eyebrow;
  const description = categoryName && (banner.id === "articles" || banner.id === "blogs")
    ? `Get guidance in ${categoryName}.`
    : banner.description;
  const titleLines = wrapWords(banner.title, isFull ? 22 : 31, 2);
  const descriptionLines = wrapWords(description, isFull ? 47 : 49, isFull ? 2 : 1);
  const eyebrowText = escapeSvg(eyebrow.length > (isFull ? 55 : 38)
    ? `${eyebrow.slice(0, isFull ? 52 : 35).trimEnd()}…`
    : eyebrow);

  const artwork = isFull ? `
    <text x="72" y="75" fill="#fff" font-size="25" font-weight="800" letter-spacing="2">GATEWAY ABROAD</text>
    <rect x="72" y="115" width="${Math.min(650, 42 + eyebrow.length * 14)}" height="46" rx="23" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".36"/>
    <text x="94" y="145" fill="#fff" font-size="19" font-weight="750" letter-spacing="1.5">${eyebrowText}</text>
    <text fill="#fff" font-size="61" font-weight="800" letter-spacing="-1.5">${svgLines(titleLines, 72, 232, 72)}</text>
    <text fill="#ffe7ec" font-size="25" font-weight="500">${svgLines(descriptionLines, 74, 400, 34)}</text>
    <rect x="72" y="506" width="360" height="65" rx="20" fill="#fff"/>
    <text x="100" y="548" fill="#aa1534" font-size="25" font-weight="800">${escapeSvg(banner.buttonLabel)}</text>
    <path d="M391 539h16m-7-8 8 8-8 8" fill="none" stroke="#aa1534" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="990" cy="322" r="196" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-opacity=".23" stroke-width="3"/>
    <circle cx="990" cy="322" r="151" fill="none" stroke="#fff" stroke-opacity=".36" stroke-width="3" stroke-dasharray="10 15"/>
    <path d="M872 345c35-57 134-74 229-47M940 184c-32 111-21 216 44 290M1045 183c39 109 35 205-10 289" fill="none" stroke="#fff" stroke-opacity=".34" stroke-width="3"/>
    <path d="m1014 231 113-45-43 112-25-37-48 28 24-48z" fill="#fff"/>
    <path d="m1059 261 68-75-92 55" fill="none" stroke="#a91836" stroke-width="4"/>
    <circle cx="847" cy="217" r="10" fill="#ffd66b"/><circle cx="1116" cy="409" r="8" fill="#ffd66b"/>
  ` : `
    <text x="40" y="42" fill="#fff" font-size="21" font-weight="800" letter-spacing="1.6">GATEWAY ABROAD</text>
    <text x="42" y="82" fill="#ffe4eb" font-size="18" font-weight="750" letter-spacing="1">${eyebrowText}</text>
    <text fill="#fff" font-size="40" font-weight="800" letter-spacing="-.5">${svgLines(titleLines, 40, 134, 43)}</text>
    <text fill="#ffe4eb" font-size="19" font-weight="500">${svgLines(descriptionLines, 42, 218, 24)}</text>
    <rect x="40" y="245" width="285" height="54" rx="16" fill="#fff"/>
    <text x="61" y="279" fill="#a91534" font-size="22" font-weight="800">${escapeSvg(banner.buttonLabel)}</text>
    <circle cx="757" cy="170" r="148" fill="#fff" fill-opacity=".1" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
    <circle cx="757" cy="170" r="107" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2" stroke-dasharray="8 12"/>
    <path d="m736 120 89-36-35 89-20-29-39 23 18-40z" fill="#fff"/>
    <path d="m770 144 55-60-76 43" fill="none" stroke="#b8203d" stroke-width="3"/>
    <circle cx="665" cy="97" r="7" fill="#ffd66b"/>
  `;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" font-family="Arial, Helvetica, sans-serif">
    <defs>
      <linearGradient id="offer" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#731029"/><stop offset=".56" stop-color="#ba1a40"/><stop offset="1" stop-color="#e35567"/></linearGradient>
      <radialGradient id="glow"><stop stop-color="#ffb0bd" stop-opacity=".55"/><stop offset="1" stop-color="#ffb0bd" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#offer)"/>
    <circle cx="${width * .87}" cy="${height * .18}" r="${isFull ? 360 : 230}" fill="url(#glow)"/>
    <path d="M0 ${height * .84} Q${width * .45} ${height * .54} ${width} ${height * .95} L${width} ${height} H0Z" fill="#fff" fill-opacity=".05"/>
    ${artwork}
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
