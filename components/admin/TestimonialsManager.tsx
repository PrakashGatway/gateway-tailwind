"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, LoaderCircle, MessageSquare, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";

type Testimonial = {
  _id: string;
  id: string;
  name: string;
  content: string;
  status: boolean;
  type: string;
  univercity: string;
};

type Draft = Omit<Testimonial, "_id" | "id">;
type ResponseData = {
  testimonials: Testimonial[];
  types: string[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const emptyDraft: Draft = { name: "", content: "", status: true, type: "IELTS", univercity: "" };
const inputClass = "w-full rounded-xl border border-[#dde2eb] bg-white px-3.5 py-2.5 text-sm font-medium text-[#263247] outline-none transition focus:border-[#dc3a55] focus:ring-4 focus:ring-[#d81635]/10";
const labelClass = "mb-1.5 block text-xs font-bold text-[#526079]";

function formatType(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState("");
  const [editor, setEditor] = useState<"new" | Testimonial | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({
      type,
      status,
      search,
      page: String(page),
      pageSize: String(pageSize),
    });
    try {
      const response = await fetch("/api/admin/testimonials?" + params.toString(), { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load testimonials");
      const result = data as ResponseData;
      setItems(Array.isArray(result.testimonials) ? result.testimonials : []);
      setTypes(Array.isArray(result.types) ? result.types : []);
      setPage(result.page || 1);
      setPageSize(result.pageSize || 20);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load testimonials");
    } finally {
      setLoading(false);
    }
  }, [type, status, search, page, pageSize]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadItems(), search ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [loadItems, search]);

  function openNew() {
    setDraft({ ...emptyDraft, type: types[0] || "IELTS" });
    setEditor("new");
    setError("");
    setNotice("");
  }

  function openEdit(item: Testimonial) {
    setDraft({
      name: item.name || "",
      content: item.content || "",
      status: item.status === true,
      type: item.type || "",
      univercity: item.univercity || "",
    });
    setEditor(item);
    setError("");
    setNotice("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    const editingItem = editor === "new" ? null : editor;
    try {
      const response = await fetch(
        editingItem ? "/api/admin/testimonials/" + encodeURIComponent(editingItem.id) : "/api/admin/testimonials",
        {
          method: editingItem ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save testimonial");
      setEditor(null);
      setNotice(editingItem ? "Testimonial updated." : "Testimonial added.");
      if (!editingItem) {
        const created = data.testimonial as Testimonial;
        setItems((current) => [created, ...current].slice(0, pageSize));
        setTypes((current) => Array.from(new Set([...current, created.type])).sort((a, b) => a.localeCompare(b)));
        setTotal(total + 1);
        setTotalPages(Math.max(1, Math.ceil((total + 1) / pageSize)));
        setPage(1);
        setType("all");
        setStatus("all");
        setSearch("");
      } else {
        void loadItems();
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save testimonial");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Testimonial) {
    if (deleting) return;
    if (!window.confirm("Delete the testimonial from " + item.name + " permanently?")) return;
    setDeleting(item.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/testimonials/" + encodeURIComponent(item.id), { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete testimonial");
      setNotice("Testimonial deleted.");
      if (items.length === 1 && page > 1) setPage(page - 1);
      else void loadItems();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete testimonial");
    } finally {
      setDeleting("");
    }
  }

  const firstItem = total ? (page - 1) * pageSize + 1 : 0;
  const lastItem = Math.min(page * pageSize, total);

  return (
    <main className="mx-auto max-w-[1400px] space-y-5 px-5 py-6 font-medium sm:px-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#d81635]">Website content</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1b2538]">Testimonials</h1>
          <p className="mt-1 text-sm text-slate-500">Add, edit, and organize the testimonials shown across your site.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void loadItems()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">
            <RefreshCw className={"h-4 w-4" + (loading ? " animate-spin" : "")} /> Refresh
          </button>
          <button type="button" onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-[#d81635] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#b9132d]">
            <Plus className="h-4 w-4" /> Add testimonial
          </button>
        </div>
      </div>

      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p>}

      <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
       
<div className="grid grid-cols-1 gap-6 border-b border-slate-100 px-5 py-5 lg:grid-cols-[minmax(200px,0.8fr)_minmax(0,2fr)] lg:items-center sm:px-7">

  {/* Collection Information */}
  <div className="min-w-0">
    <h2 className="text-base font-bold text-[#1b2538]">
      Testimonials collection
    </h2>
    <p className="mt-1 text-sm text-slate-500">
      Showing {firstItem}–{lastItem} of {total}
    </p>
  </div>

  {/* Filters */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

    {/* Search */}
    <div className="min-w-0 xl:col-span-1">
      <label
        htmlFor="testimonial-search"
        className="mb-1.5 block text-xs font-semibold text-slate-500"
      >
        Search
      </label>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          id="testimonial-search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search name or content"
          className={inputClass + " w-full pl-9"}
        />
      </div>
    </div>

    {/* Type */}
    <div className="min-w-0">
      <label
        htmlFor="testimonial-type"
        className="mb-1.5 block text-xs font-semibold text-slate-500"
      >
        Type
      </label>

      <select
        id="testimonial-type"
        value={type}
        onChange={(event) => {
          setType(event.target.value);
          setPage(1);
        }}
        className={inputClass + " w-full"}
      >
        <option value="all">All types</option>
        {types.map((item) => (
          <option key={item} value={item}>
            {formatType(item)}
          </option>
        ))}
      </select>
    </div>

    {/* Status */}
    <div className="min-w-0">
      <label
        htmlFor="testimonial-status"
        className="mb-1.5 block text-xs font-semibold text-slate-500"
      >
        Status
      </label>

      <select
        id="testimonial-status"
        value={status}
        onChange={(event) => {
          setStatus(event.target.value);
          setPage(1);
        }}
        className={inputClass + " w-full"}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    {/* Per Page */}
    <div className="min-w-0">
      <label
        htmlFor="testimonial-page-size"
        className="mb-1.5 block text-xs font-semibold text-slate-500"
      >
        Per page
      </label>

      <select
        id="testimonial-page-size"
        value={pageSize}
        onChange={(event) => {
          setPageSize(Number(event.target.value));
          setPage(1);
        }}
        className={inputClass + " w-full"}
      >
        {[10, 20, 50].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>

  </div>
</div>


        {loading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm font-semibold text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin" /> Loading testimonials…</div>
        ) : items.length ? (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <article key={item.id} className="flex flex-col gap-4 px-5 py-5 sm:px-7 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-[#263247]">{item.name}</h3>
                    <span className={"rounded-full px-2.5 py-1 text-[10px] font-bold " + (item.status ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>{item.status ? "Active" : "Inactive"}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1">{formatType(item.type)}</span>
                    <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-[#b9142e]">{item.univercity}</span>
                  </div>
                  <blockquote className="mt-3 max-w-5xl whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{item.content}</blockquote>
                  <p className="mt-2 truncate text-[10px] text-slate-400">ID: {item.id}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => openEdit(item)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-rose-200 hover:text-[#b9142e]">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button type="button" onClick={() => void remove(item)} disabled={Boolean(deleting)} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3.5 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50">
                    {deleting === item.id ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-600">No testimonials found</p>
            <p className="mt-1 text-xs text-slate-400">Change your filters or add a testimonial.</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-7">
          <p className="text-xs font-medium text-slate-500">Page {page} of {totalPages}</p>
          <nav aria-label="Testimonial pages" className="flex items-center gap-2">
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1 || loading} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages || loading} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </section>

      <AnimatePresence>
        {editor && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#101b33]/60 p-2 sm:p-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setEditor(null); }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label={editor === "new" ? "Add testimonial" : "Edit testimonial"}
              className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
              initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}
            >
              <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d81635]">Testimonial</p>
                  <h2 className="mt-1 text-lg font-bold text-[#263247]">{editor === "new" ? "Add testimonial" : "Edit testimonial"}</h2>
                </div>
                <button type="button" onClick={() => setEditor(null)} disabled={saving} aria-label="Close editor" className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <X className="h-4 w-4" />
                </button>
              </header>
              <form id="testimonial-form" onSubmit={save} className="space-y-4 overflow-y-auto px-5 py-5 sm:px-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label><span className={labelClass}>Name *</span><input required maxLength={120} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className={inputClass} placeholder="Student name" /></label>
                  <label><span className={labelClass}>Type *</span><input required maxLength={60} list="testimonial-types" value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })} className={inputClass} placeholder="IELTS" /><datalist id="testimonial-types">{types.map((item) => <option key={item} value={item} />)}</datalist></label>
                  <label><span className={labelClass}>University / category *</span><input required maxLength={120} value={draft.univercity} onChange={(event) => setDraft({ ...draft, univercity: event.target.value })} className={inputClass} placeholder="TOEFL" /></label>
                  <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-slate-200 px-3.5 py-3 text-sm font-bold text-slate-700">
                    <input type="checkbox" checked={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.checked })} className="h-4 w-4 accent-[#d81635]" />
                    Active on the website
                  </label>
                </div>
                <label className="block">
                  <span className={labelClass}>Testimonial content *</span>
                  <textarea required maxLength={10000} rows={7} value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} className={inputClass + " resize-y"} placeholder="Write the student's testimonial…" />
                  <span className="mt-1 block text-right text-[10px] text-slate-400">{draft.content.length}/10,000</span>
                </label>
                {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
              </form>
              <footer className="flex justify-end gap-2 border-t border-slate-100 bg-[#fafbfe] px-5 py-4 sm:px-7">
                <button type="button" onClick={() => setEditor(null)} disabled={saving} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" form="testimonial-form" disabled={saving} className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-[#d81635] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60">
                  {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editor === "new" ? <Plus className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  {saving ? "Saving…" : editor === "new" ? "Add testimonial" : "Save changes"}
                </button>
              </footer>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
