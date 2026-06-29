import AuthorPage from "@/components/pages/author";
import ContactForm from "@/components/pages/UkForm";
import PageServices from "@/services/PageServices";

export default async function Page({slug}) {
  const params = await slug
const blogs = [
  {
    title: "Complete Guide to Studying in Germany",
    category: "Study Abroad",
    date: "May 28, 2026",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Top Scholarships for International Students",
    category: "Scholarships",
    date: "May 22, 2026",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Student Visa Process Explained",
    category: "Visa",
    date: "May 18, 2026",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop",
  },
];

 const initialData = await PageServices.getBlogData({
    page: Number(params?.page || 1),
    category: params?.category || 'All',
    search: params?.search || '',
    limit: 12
  }); 

  return (
  <AuthorPage initialData = {initialData} />
  );
}