"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Check, ChevronLeft, ChevronRight, Film, Image as ImageIcon, LoaderCircle, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";

type Gallery = { _id: string; id: string; title: string; mediaLink: string; catogary: string; Status: boolean };
type Draft = Omit<Gallery, "_id" | "id">;
type ResponseData = { galleries: Gallery[]; categories: string[]; page: number; pageSize: number; total: number; totalPages: number };
const blank: Draft = { title: "", mediaLink: "", catogary: "image", Status: true };
const field = "w-full rounded-xl border border-[#dde2eb] bg-white px-3.5 py-2.5 text-sm font-medium text-[#263247] outline-none focus:border-[#dc3a55] focus:ring-4 focus:ring-[#d81635]/10";
const label = "mb-1.5 block text-xs font-bold text-[#526079]";
const uploadsBase = (process.env.NEXT_PUBLIC_GALLERY_IMAGE_BASE_URL || "https://api.gatewayabroadeducations.com/api/uploads").replace(/\/+$/, "");

function imageUrl(link: string) {
  if (!link) return "";
  if (/^https?:\/\//i.test(link)) return link;
  return uploadsBase + "/" + link.replace(/^\/?(?:api\/)?uploads\//i, "").split("/").map(encodeURIComponent).join("/");
}
function videoId(link: string) {
  try { const url = new URL(link.includes("://") ? link : "https://" + link); return url.hostname.includes("youtu.be") ? url.pathname.slice(1) : url.searchParams.get("v") || url.pathname.match(/\/embed\/([^/?]+)/)?.[1] || ""; }
  catch { return /^[\w-]{11}$/.test(link) ? link : ""; }
}

export default function GalleriesManager() {
  const [items, setItems] = useState<Gallery[]>([]); const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("all"); const [status, setStatus] = useState("all"); const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(20); const [total, setTotal] = useState(0); const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [deleting, setDeleting] = useState("");
  const [editor, setEditor] = useState<"new" | Gallery | null>(null); const [draft, setDraft] = useState<Draft>(blank); const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null); const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!imageFile) { setImagePreview(""); return; }
    const url = URL.createObjectURL(imageFile); setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const params = new URLSearchParams({ category, status, search, page: String(page), pageSize: String(pageSize) });
    try {
      const response = await fetch("/api/admin/galleries?" + params, { cache: "no-store" }); const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load galleries");
      const result = data as ResponseData; setItems(result.galleries || []); setCategories(result.categories || []); setPage(result.page || 1); setPageSize(result.pageSize || 20); setTotal(result.total || 0); setTotalPages(result.totalPages || 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load galleries"); }
    finally { setLoading(false); }
  }, [category, status, search, page, pageSize]);
  useEffect(() => { const timer = window.setTimeout(() => void load(), search ? 250 : 0); return () => window.clearTimeout(timer); }, [load, search]);

  function openNew() { setImageFile(null); setDraft({ ...blank, catogary: "image" }); setEditor("new"); setError(""); setNotice(""); }
  function openEdit(item: Gallery) { setImageFile(null); setDraft({ title: item.title, mediaLink: item.mediaLink, catogary: item.catogary, Status: item.Status }); setEditor(item); setError(""); setNotice(""); }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!editor || saving) return; setSaving(true); setError(""); setNotice("");
    const editing = editor === "new" ? null : editor;
    if (draft.catogary === "image" && !imageFile && (!editing || editing.catogary !== "image")) { setError("Choose an image to upload"); setSaving(false); return; }
    if (draft.catogary === "video" && !draft.mediaLink.trim()) { setError("Enter a YouTube link or video ID"); setSaving(false); return; }
    if (imageFile && imageFile.size > 8 * 1024 * 1024) { setError("Image must be under 8 MB"); setSaving(false); return; }
    try {
      const body = new FormData(); body.set("gallery", JSON.stringify(draft)); if (imageFile) body.set("image", imageFile);
      const response = await fetch(editing ? "/api/admin/galleries/" + encodeURIComponent(editing.id) : "/api/admin/galleries", { method: editing ? "PATCH" : "POST", body });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not save gallery item");
      setEditor(null); setNotice(editing ? "Gallery item updated." : "Gallery item added."); void load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save gallery item"); }
    finally { setSaving(false); }
  }
  async function remove(item: Gallery) {
    if (deleting || !window.confirm("Delete “" + item.title + "” permanently?")) return;
    setDeleting(item.id); setError(""); setNotice("");
    try { const response = await fetch("/api/admin/galleries/" + encodeURIComponent(item.id), { method: "DELETE" }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not delete item"); setNotice("Gallery item deleted."); if (items.length === 1 && page > 1) setPage(page - 1); else void load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not delete item"); } finally { setDeleting(""); }
  }
  const first = total ? (page - 1) * pageSize + 1 : 0; const last = Math.min(page * pageSize, total);

  return <main className="mx-auto max-w-[1500px] space-y-5 px-5 py-7 sm:px-7 lg:px-9">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d81635]">Content management</p><h1 className="mt-1 text-3xl font-black tracking-tight text-[#172033]">Galleries</h1><p className="mt-1 text-sm text-[#788397]">Manage gallery photos and videos shown on the website.</p></div><button onClick={openNew} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#d81635] px-4 text-sm font-bold text-white shadow-sm hover:bg-[#bd112c]"><Plus className="h-4 w-4"/>Add gallery item</button></header>
    <section className="rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_8px_28px_-25px_rgba(31,41,55,.35)] sm:p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center"><div className="relative min-w-0 flex-1"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input aria-label="Search galleries" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Search title or media link" className={`${field} pl-10`}/></div><div className="grid grid-cols-2 gap-3 sm:flex"><select aria-label="Filter by category" value={category} onChange={e=>{setCategory(e.target.value);setPage(1)}} className={`${field} sm:w-40`}><option value="all">All categories</option>{Array.from(new Set(["image","video",...categories])).map(x=><option key={x} value={x}>{x[0]?.toUpperCase()+x.slice(1)}</option>)}</select><select aria-label="Filter by status" value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}} className={`${field} sm:w-36`}><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select><button onClick={()=>void load()} aria-label="Refresh galleries" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dde2eb] px-3 text-sm font-semibold text-[#526079] hover:bg-slate-50"><RefreshCw className={`h-4 w-4 ${loading?"animate-spin":""}`}/><span className="hidden sm:inline">Refresh</span></button></div></div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eef0f4] pt-4"><p className="text-sm text-[#788397]">Showing <span className="font-bold text-[#263247]">{first}–{last}</span> of <span className="font-bold text-[#263247]">{total}</span></p><div className="flex items-center gap-2"><label className="text-xs font-semibold text-[#788397]" htmlFor="gallery-page-size">Rows</label><select id="gallery-page-size" value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1)}} className="rounded-lg border border-[#dde2eb] bg-white px-2 py-1.5 text-sm"><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select><button disabled={page<=1||loading} onClick={()=>setPage(page-1)} aria-label="Previous page" className="grid h-9 w-9 place-items-center rounded-lg border border-[#dde2eb] disabled:opacity-40"><ChevronLeft className="h-4 w-4"/></button><span className="min-w-20 text-center text-sm font-semibold text-[#526079]">{page} / {totalPages}</span><button disabled={page>=totalPages||loading} onClick={()=>setPage(page+1)} aria-label="Next page" className="grid h-9 w-9 place-items-center rounded-lg border border-[#dde2eb] disabled:opacity-40"><ChevronRight className="h-4 w-4"/></button></div></div>
    </section>
    {error && !editor && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}{notice && !editor && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}</div>}
    <section className="overflow-hidden rounded-2xl border border-[#e8ebf1] bg-white shadow-[0_8px_28px_-25px_rgba(31,41,55,.35)]"><div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-[#eef0f4] px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#8a95a5] sm:grid-cols-[minmax(0,1fr)_130px_110px_100px]"><span>Gallery item</span><span className="hidden sm:block">Category</span><span className="hidden sm:block">Status</span><span className="text-right">Actions</span></div>
      {loading ? <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-[#788397]"><LoaderCircle className="h-5 w-5 animate-spin"/>Loading gallery items…</div> : items.length ? items.map(item=>{const vid=videoId(item.mediaLink);return <article key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-[#f0f1f5] px-4 py-4 last:border-0 sm:grid-cols-[minmax(0,1fr)_130px_110px_100px] sm:px-5"><div className="flex min-w-0 items-center gap-3"><div className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100">{item.catogary==="video"?(vid?<img className="h-full w-full object-cover" src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt="Video preview"/>:<Film className="h-6 w-6 text-slate-400"/>):item.mediaLink?<img className="h-full w-full object-cover" src={imageUrl(item.mediaLink)} alt=""/>:<ImageIcon className="h-6 w-6 text-slate-400"/>}</div><div className="min-w-0"><p className="truncate text-sm font-bold text-[#263247]">{item.title}</p><p className="mt-1 truncate text-xs text-[#8a95a5]">{item.mediaLink}</p><p className="mt-1 text-xs capitalize text-[#788397] sm:hidden">{item.catogary} · {item.Status?"Active":"Inactive"}</p></div></div><span className="hidden text-sm capitalize text-[#526079] sm:block">{item.catogary}</span><span className={`hidden w-fit rounded-full px-2.5 py-1 text-xs font-bold sm:inline-flex ${item.Status?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-600"}`}>{item.Status?"Active":"Inactive"}</span><div className="flex justify-end gap-1.5"><button onClick={()=>openEdit(item)} aria-label={`Edit ${item.title}`} className="grid h-9 w-9 place-items-center rounded-lg border border-[#e3e7ee] text-[#526079] hover:bg-slate-50"><Pencil className="h-4 w-4"/></button><button onClick={()=>void remove(item)} disabled={deleting===item.id} aria-label={`Delete ${item.title}`} className="grid h-9 w-9 place-items-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-50">{deleting===item.id?<LoaderCircle className="h-4 w-4 animate-spin"/>:<Trash2 className="h-4 w-4"/>}</button></div></article>}) : <div className="px-5 py-16 text-center"><ImageIcon className="mx-auto h-8 w-8 text-slate-300"/><p className="mt-3 font-bold text-[#263247]">No gallery items found</p><p className="mt-1 text-sm text-[#788397]">Change the filters or add a gallery item.</p></div>}
    </section>
    {editor && <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setEditor(null)}}><form onSubmit={save} className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-black text-[#172033]">{editor==="new"?"Add gallery item":"Edit gallery item"}</h2><p className="mt-1 text-sm text-[#788397]">Upload gallery photos to Cloudinary or add a YouTube video.</p></div><button type="button" onClick={()=>setEditor(null)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100"><X className="h-5 w-5"/></button></div>
      <div className="mt-6 space-y-4"><div><label className={label} htmlFor="gallery-title">Title</label><input id="gallery-title" required maxLength={180} value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} className={field}/></div><div className="grid gap-4 sm:grid-cols-2"><div><label className={label} htmlFor="gallery-category">Category</label><select id="gallery-category" value={draft.catogary} onChange={e=>{if(e.target.value==="video")setImageFile(null);setDraft({...draft,catogary:e.target.value,mediaLink:e.target.value==="image"?"":draft.mediaLink})}} className={field}><option value="image">Image</option><option value="video">Video</option></select></div><div><label className={label} htmlFor="gallery-status">Status</label><select id="gallery-status" value={String(draft.Status)} onChange={e=>setDraft({...draft,Status:e.target.value==="true"})} className={field}><option value="true">Active</option><option value="false">Inactive</option></select></div></div>
      {draft.catogary === "image" ? <div><label className={label} htmlFor="gallery-image">Upload image to Cloudinary{editor === "new" ? " (required)" : " (optional)"}</label><input id="gallery-image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>{setImageFile(e.target.files?.[0] || null);setError("")}} className={`${field} file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-bold`}/><p className="mt-1.5 text-xs text-[#8a95a5]">JPG, PNG, WebP, or AVIF · maximum 8 MB. Leave empty when editing to keep the current image.</p></div> : <div><label className={label} htmlFor="gallery-link">YouTube link or video ID</label><input id="gallery-link" required maxLength={2000} value={draft.mediaLink} onChange={e=>setDraft({...draft,mediaLink:e.target.value})} placeholder="YouTube URL or video ID" className={field}/></div>}
      {draft.catogary === "image" && (imagePreview || draft.mediaLink) && <div className="overflow-hidden rounded-xl border border-[#e8ebf1] bg-slate-50"><img className="max-h-56 w-full object-contain" src={imagePreview || imageUrl(draft.mediaLink)} alt="Gallery preview" onError={e=>{e.currentTarget.style.display="none"}}/></div>}
      {draft.catogary === "video" && draft.mediaLink && <div className="overflow-hidden rounded-xl border border-[#e8ebf1] bg-slate-50">{videoId(draft.mediaLink)?<iframe className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${videoId(draft.mediaLink)}`} title="Video preview" allowFullScreen/>:<div className="p-4 text-sm text-slate-500">Enter a YouTube URL or 11 character video ID to preview.</div>}</div>}
      {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}</div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={()=>setEditor(null)} className="h-10 rounded-xl border border-[#dde2eb] px-4 text-sm font-bold text-[#526079]">Cancel</button><button disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#d81635] px-4 text-sm font-bold text-white disabled:opacity-60">{saving?<LoaderCircle className="h-4 w-4 animate-spin"/>:<Check className="h-4 w-4"/>}{saving?"Saving…":editor==="new"?"Add item":"Save changes"}</button></div></form></div>}
  </main>;
}
