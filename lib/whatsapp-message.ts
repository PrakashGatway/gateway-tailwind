const ACRONYMS = new Set([
  "usa",
  "uk",
  "uae",
  "ielts",
  "pte",
  "toefl",
  "gmat",
  "gre",
  "sat",
]);

function pageName(slug: string): string {
  let decoded = slug;

  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // Keep the route segment readable even if it contains invalid encoding.
  }

  return decoded
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) =>
      ACRONYMS.has(word.toLowerCase())
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(" ");
}

export function getWhatsAppMessage(pathname: string): string {
  const [section, slug] = pathname.split("/").filter(Boolean);
  const name = slug ? pageName(slug) : "";
  const destination = ["USA", "UK", "UAE"].includes(name) ? `the ${name}` : name;
  const greeting = "Hi Gateway Abroad,";

  switch (section?.toLowerCase()) {
    case undefined:
      return `${greeting} I'm interested in studying abroad. Could you help me get started?`;
    case "study-in":
      return name
        ? `${greeting} I'm interested in studying abroad in ${destination}. Could you guide me on universities, admissions and visas?`
        : `${greeting} I'd like guidance on studying abroad. Which destination would suit me?`;
    case "study-abroad":
      return name
        ? `${greeting} I'm looking for study abroad guidance in ${name}. Could I speak with a counsellor?`
        : `${greeting} I'm planning to study abroad. Could you help me choose a country and university?`;
    case "course":
    case "new":
      return name
        ? `${greeting} I'm interested in ${name} preparation. Could you share the course details and available batches?`
        : `${greeting} I'd like to know more about your test preparation courses.`;
    case "blog":
    case "article":
    case "blog-description":
      return name
        ? `${greeting} I read your article about ${name} and would like advice on my study abroad plans.`
        : `${greeting} I've been reading your study abroad articles and would like some guidance.`;
    case "author":
      return `${greeting} I've been reading your study abroad content and would like to speak with a counsellor.`;
    case "about":
      return `${greeting} I'd like to learn more about Gateway Abroad's counselling services.`;
    case "contact":
    case "enquiry":
      return `${greeting} I'd like to get in touch with a study abroad counsellor.`;
    case "career":
      return `${greeting} I'm interested in career opportunities at Gateway Abroad. Could you share more information?`;
    case "gallery":
      return `${greeting} I saw your student gallery and would like to learn about study abroad opportunities.`;
    case "registration":
      return `${greeting} I have a question about the student registration form.`;
    case "onboarding":
      return `${greeting} I'm planning my study abroad journey and need help with the next steps.`;
    case "testprepform":
      return `${greeting} I'd like help choosing a test preparation course.`;
    case "spoken-english":
      return `${greeting} I'd like to learn more about your spoken English classes.`;
    case "thank-you":
      return `${greeting} I recently sent an enquiry and would like to follow up.`;
    case "privacy-policy":
    case "terms":
    case "data-deletion":
      return `${greeting} I have a question about your website policies or my information.`;
    default:
      return `${greeting} I have a question about your study abroad services.`;
  }
}

export function getWhatsAppTeaser(pathname: string): string {
  const [section, slug] = pathname.split("/").filter(Boolean);
  const name = slug ? pageName(slug) : "";

  switch (section?.toLowerCase()) {
    case "study-in":
      return name ? `Planning to study in ${["USA", "UK", "UAE"].includes(name) ? `the ${name}` : name}?` : "Planning to study abroad?";
    case "study-abroad":
      return name ? `Looking for guidance in ${name}?` : "Planning to study abroad?";
    case "course":
    case "new":
      return name ? `Questions about ${name} prep?` : "Need help with test preparation?";
    case "career":
      return "Interested in joining our team?";
    case "contact":
    case "enquiry":
      return "Our counsellors are here to help.";
    default:
      return "Let's talk about your study plans.";
  }
}
