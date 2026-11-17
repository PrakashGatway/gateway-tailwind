"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, ImagePlus, LoaderCircle, Pencil, Plus, RefreshCw, Search, Trash2, Users, X } from "lucide-react";

type Member = { id: string; image: string; name: string; content: string };
type Draft = Omit<Member, "id">;
type MembersResponse = {
  members: Member[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const emptyDraft: Draft = { image: "", name: "", content: "" };
const inputClass = "w-full rounded-xl border border-[#dde2eb] bg-white px-3.5 py-2.5 text-sm font-medium text-[#263247] outline-none transition focus:border-[#dc3a55] focus:ring-4 focus:ring-[#d81635]/10";
const labelClass = "mb-1.5 block text-xs font-bold text-[#526079]";
const uploadsBase = (process.env.NEXT_PUBLIC_MEMBER_IMAGE_BASE_URL || "https://api.gatewayabroadeducations.com/api/uploads").replace(/\/+$/, "");

function imageUrl(image: string) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/") && !image.startsWith("//")) {
    try {
      return new URL(image, "https://api.gatewayabroadeducations.com").toString();
    } catch {
      return "";
    }
  }
  const relative = image.replace(/^api\/uploads\//i, "").replace(/^uploads\//i, "");
  return uploadsBase + "/" + relative.split("/").map(encodeURIComponent).join("/");
}

export default function MembersManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState("");
  const [editor, setEditor] = useState<"new" | Member | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), search });
    try {
      const response = await fetch("/api/admin/members?" + params.toString(), { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load members");
      const result = data as MembersResponse;
      setMembers(Array.isArray(result.members) ? result.members : []);
      setPage(result.page || 1);
      setPageSize(result.pageSize || 20);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load members");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadMembers(), search ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [loadMembers, search]);

  function openNew() {
    setDraft(emptyDraft);
    setEditor("new");
    setError("");
    setNotice("");
  }

  function openEdit(member: Member) {
    setDraft({ image: member.image || "", name: member.name || "", content: member.content || "" });
    setEditor(member);
    setError("");
    setNotice("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    const editing = editor === "new" ? null : editor;
    try {
      const response = await fetch(
        editing ? "/api/admin/members/" + encodeURIComponent(editing.id) : "/api/admin/members",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save member");
      setEditor(null);
      setNotice(editing ? "Member updated." : "Member added.");
      if (editing) {
        void loadMembers();
      } else {
        const created = data.member as Member;
        setMembers((current) => [created, ...current].slice(0, pageSize));
        setTotal(total + 1);
        setTotalPages(Math.max(1, Math.ceil((total + 1) / pageSize)));
        setPage(1);
        setSearch("");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save member");
    } finally {
      setSaving(false);
    }
  }

  async function remove(member: Member) {
    if (deleting) return;
    if (!window.confirm("Delete " + member.name + " permanently?")) return;
    setDeleting(member.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/members/" + encodeURIComponent(member.id), { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete member");
      setNotice("Member deleted.");
      if (members.length === 1 && page > 1) setPage(page - 1);
      else void loadMembers();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete member");
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
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1b2538]">Members</h1>
          <p className="mt-1 text-sm text-slate-500">Manage the team member profiles used by your site.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void loadMembers()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">
            <RefreshCw className={"h-4 w-4" + (loading ? " animate-spin" : "")} /> Refresh
          </button>
          <button type="button" onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-[#d81635] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#b9132d]">
            <Plus className="h-4 w-4" /> Add member
          </button>
        </div>
      </div>

      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p>}

      <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
        <div className="grid gap-4 border-b border-slate-100 px-5 py-4 sm:px-7 lg:grid-cols-[minmax(220px,1fr)_auto] lg:items-center">
          <div>
            <h2 className="text-base font-bold text-[#1b2538]">Members collection</h2>
            <p className="mt-1 text-xs text-slate-500">Showing {firstItem}–{lastItem} of {total}</p>
          </div>
          <div className="flex flex-nowrap items-center justify-start gap-3 lg:justify-end">
            <label htmlFor="member-search" className="sr-only">Search members</label>
            <span className="relative min-w-0 flex-1 lg:flex-none">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input id="member-search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search members" className={inputClass + " w-full pl-9 sm:w-56"} />
            </span>
            <label htmlFor="member-page-size" className="shrink-0 text-xs font-bold text-slate-500">Per page</label>
            <select id="member-page-size" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className={inputClass + " w-[84px] shrink-0"}>
              {[10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm font-semibold text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin" /> Loading members…</div>
        ) : members.length ? (
          <div className="divide-y divide-slate-100">
            {members.map((member) => (
              <article key={member.id} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:px-7">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-slate-100">
                  {member.image ? <img src={imageUrl(member.image)} alt={member.name} className="h-full w-full object-cover" /> : <Users className="h-8 w-8 text-slate-300" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[#263247]">{member.name}</h3>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{member.content}</p>
                  <p className="mt-2 truncate text-[10px] text-slate-400">Image: {member.image}</p>
                  <p className="mt-1 truncate text-[10px] text-slate-400">ID: {member.id}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => openEdit(member)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-rose-200 hover:text-[#b9142e]">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button type="button" onClick={() => void remove(member)} disabled={Boolean(deleting)} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3.5 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50">
                    {deleting === member.id ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <Users className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-600">No members found</p>
            <p className="mt-1 text-xs text-slate-400">{search ? "Try another search." : "Add a member profile to get started."}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-7">
          <p className="text-xs font-medium text-slate-500">Page {page} of {totalPages}</p>
          <nav aria-label="Member pages" className="flex items-center gap-2">
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
              aria-label={editor === "new" ? "Add member" : "Edit member"}
              className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
              initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}
            >
              <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d81635]">Team member</p>
                  <h2 className="mt-1 text-lg font-bold text-[#263247]">{editor === "new" ? "Add member" : "Edit member"}</h2>
                </div>
                <button type="button" onClick={() => setEditor(null)} disabled={saving} aria-label="Close editor" className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <X className="h-4 w-4" />
                </button>
              </header>
              <form id="member-form" onSubmit={save} className="space-y-4 overflow-y-auto px-5 py-5 sm:px-7">
                <label className="block"><span className={labelClass}>Name *</span><input required maxLength={160} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className={inputClass} placeholder="Member name" /></label>
                <label className="block">
                  <span className={labelClass}>Image URL or uploaded filename *</span>
                  <input required maxLength={2000} value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} className={inputClass} placeholder="1755238167643-111728843.png or https://…" />
                  <span className="mt-1 block text-[11px] text-slate-500">Use a filename from the uploads folder or a complete image URL.</span>
                </label>
                {draft.image && (
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <img src={imageUrl(draft.image)} alt="Member preview" className="h-16 w-16 rounded-lg object-cover" />
                    <span className="min-w-0 truncate text-xs font-semibold text-slate-500">{draft.image}</span>
                    <ImagePlus className="ml-auto h-5 w-5 shrink-0 text-slate-400" />
                  </div>
                )}
                <label className="block">
                  <span className={labelClass}>Description *</span>
                  <textarea required maxLength={10000} rows={7} value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} className={inputClass + " resize-y"} placeholder="Write the member bio…" />
                  <span className="mt-1 block text-right text-[10px] text-slate-400">{draft.content.length}/10,000</span>
                </label>
                {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
              </form>
              <footer className="flex justify-end gap-2 border-t border-slate-100 bg-[#fafbfe] px-5 py-4 sm:px-7">
                <button type="button" onClick={() => setEditor(null)} disabled={saving} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" form="member-form" disabled={saving} className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-[#d81635] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60">
                  {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editor === "new" ? <Plus className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  {saving ? "Saving…" : editor === "new" ? "Add member" : "Save changes"}
                </button>
              </footer>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
