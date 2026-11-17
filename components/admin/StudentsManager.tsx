"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, GraduationCap, ImagePlus, LoaderCircle, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";

type Student = {
  _id: string;
  id: string;
  image: string;
  name: string;
  content: string;
  rank: number;
  courseName: string;
  univercity: string;
  type: string;
};

type Draft = Omit<Student, "_id" | "id">;
type StudentsResponse = {
  students: Student[];
  types: string[];
  courses: string[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const emptyDraft: Draft = {
  image: "",
  name: "",
  content: "",
  rank: 0,
  courseName: "",
  univercity: "",
  type: "home",
};
const inputClass = "w-full rounded-xl border border-[#dde2eb] bg-white px-3.5 py-2.5 text-sm font-medium text-[#263247] outline-none transition focus:border-[#dc3a55] focus:ring-4 focus:ring-[#d81635]/10";
const labelClass = "mb-1.5 block text-xs font-bold text-[#526079]";
const uploadsBase = (process.env.NEXT_PUBLIC_STUDENT_IMAGE_BASE_URL || "https://api.gatewayabroadeducations.com/api/uploads").replace(/\/+$/, "");

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

function formatType(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function StudentsManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [type, setType] = useState("all");
  const [courseName, setCourseName] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState("");
  const [editor, setEditor] = useState<"new" | Student | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({
      type,
      courseName,
      search,
      page: String(page),
      pageSize: String(pageSize),
    });
    try {
      const response = await fetch("/api/admin/students?" + params.toString(), { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load students");
      const result = data as StudentsResponse;
      setStudents(Array.isArray(result.students) ? result.students : []);
      setTypes(Array.isArray(result.types) ? result.types : []);
      setCourses(Array.isArray(result.courses) ? result.courses : []);
      setPage(result.page || 1);
      setPageSize(result.pageSize || 20);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load students");
    } finally {
      setLoading(false);
    }
  }, [type, courseName, search, page, pageSize]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadStudents(), search ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [loadStudents, search]);

  function openNew() {
    setDraft({ ...emptyDraft, type: types[0] || "home", courseName: courses[0] || "" });
    setEditor("new");
    setError("");
    setNotice("");
  }

  function openEdit(student: Student) {
    setDraft({
      image: student.image || "",
      name: student.name || "",
      content: student.content || "",
      rank: student.rank || 0,
      courseName: student.courseName || "",
      univercity: student.univercity || "",
      type: student.type || "",
    });
    setEditor(student);
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
        editing ? "/api/admin/students/" + encodeURIComponent(editing.id) : "/api/admin/students",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save student");
      setEditor(null);
      setNotice(editing ? "Student updated." : "Student added.");
      if (editing) {
        void loadStudents();
      } else {
        const created = data.student as Student;
        setStudents((current) => [created, ...current].slice(0, pageSize));
        setTypes((current) => Array.from(new Set([...current, created.type])).sort());
        setCourses((current) => Array.from(new Set([...current, created.courseName])).sort());
        setTotal(total + 1);
        setTotalPages(Math.max(1, Math.ceil((total + 1) / pageSize)));
        setPage(1);
        setType("all");
        setCourseName("all");
        setSearch("");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save student");
    } finally {
      setSaving(false);
    }
  }

  async function remove(student: Student) {
    if (deleting) return;
    if (!window.confirm("Delete " + student.name + " permanently?")) return;
    setDeleting(student.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/students/" + encodeURIComponent(student.id), { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete student");
      setNotice("Student deleted.");
      if (students.length === 1 && page > 1) setPage(page - 1);
      else void loadStudents();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete student");
    } finally {
      setDeleting("");
    }
  }

  const firstItem = total ? (page - 1) * pageSize + 1 : 0;
  const lastItem = Math.min(page * pageSize, total);

  return (
    <main className="mx-auto max-w-[1500px] space-y-5 px-5 py-6 font-medium sm:px-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#d81635]">Website content</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1b2538]">Students</h1>
          <p className="mt-1 text-sm text-slate-500">Manage student profiles, course details, and rank records.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void loadStudents()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">
            <RefreshCw className={"h-4 w-4" + (loading ? " animate-spin" : "")} /> Refresh
          </button>
          <button type="button" onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-[#d81635] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#b9132d]">
            <Plus className="h-4 w-4" /> Add student
          </button>
        </div>
      </div>

      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p>}

      <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
       
<div className="grid grid-cols-1 gap-5 border-b border-slate-100 px-5 py-5 lg:grid-cols-[minmax(190px,0.8fr)_minmax(0,2fr)] lg:items-center sm:px-7">

  {/* Collection Information */}
  <div className="min-w-0">
    <h2 className="text-base font-bold text-[#1b2538]">
      Students collection
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
        htmlFor="student-search"
        className="mb-1.5 block text-xs font-semibold text-slate-500"
      >
        Search
      </label>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          id="student-search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search students"
          className={inputClass + " w-full pl-9"}
        />
      </div>
    </div>

    {/* Type */}
    <div className="min-w-0">
      <label
        htmlFor="student-type-filter"
        className="mb-1.5 block text-xs font-semibold text-slate-500"
      >
        Type
      </label>

      <select
        id="student-type-filter"
        value={type}
        onChange={(event) => {
          setType(event.target.value);
          setPage(1);
        }}
        className={inputClass + " w-full"}
      >
        <option value="all">All</option>
        {types.map((item) => (
          <option key={item} value={item}>
            {formatType(item)}
          </option>
        ))}
      </select>
    </div>

    {/* Course */}
    <div className="min-w-0">
      <label
        htmlFor="student-course-filter"
        className="mb-1.5 block text-xs font-semibold text-slate-500"
      >
        Course
      </label>

      <select
        id="student-course-filter"
        value={courseName}
        onChange={(event) => {
          setCourseName(event.target.value);
          setPage(1);
        }}
        className={inputClass + " w-full"}
      >
        <option value="all">All</option>
        {courses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>

    {/* Per Page */}
    <div className="min-w-0">
      <label
        htmlFor="student-page-size"
        className="mb-1.5 block text-xs font-semibold text-slate-500"
      >
        Per page
      </label>

      <select
        id="student-page-size"
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
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm font-semibold text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin" /> Loading students…</div>
        ) : students.length ? (
          <div className="divide-y divide-slate-100">
            {students.map((student) => (
              <article key={student.id} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:px-7">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-slate-100">
                  {student.image ? <img src={imageUrl(student.image)} alt={student.name} className="h-full w-full object-cover" /> : <GraduationCap className="h-8 w-8 text-slate-300" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-[#263247]">{student.name}</h3>
                    <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-[#b9142e]">{formatType(student.type)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1">{student.courseName}</span>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1">Rank {student.rank}</span>
                    {student.univercity && <span className="rounded-lg bg-slate-100 px-2.5 py-1">{student.univercity}</span>}
                  </div>
                  {student.content && <p className="mt-3 max-w-5xl whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{student.content}</p>}
                  <p className="mt-2 truncate text-[10px] text-slate-400">Image: {student.image}</p>
                  <p className="mt-1 truncate text-[10px] text-slate-400">ID: {student.id}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => openEdit(student)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-rose-200 hover:text-[#b9142e]">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button type="button" onClick={() => void remove(student)} disabled={Boolean(deleting)} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3.5 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50">
                    {deleting === student.id ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <GraduationCap className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-600">No students found</p>
            <p className="mt-1 text-xs text-slate-400">Change your filters or add a student profile.</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-7">
          <p className="text-xs font-medium text-slate-500">Page {page} of {totalPages}</p>
          <nav aria-label="Student pages" className="flex items-center gap-2">
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
              aria-label={editor === "new" ? "Add student" : "Edit student"}
              className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
              initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}
            >
              <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d81635]">Student record</p>
                  <h2 className="mt-1 text-lg font-bold text-[#263247]">{editor === "new" ? "Add student" : "Edit student"}</h2>
                </div>
                <button type="button" onClick={() => setEditor(null)} disabled={saving} aria-label="Close editor" className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <X className="h-4 w-4" />
                </button>
              </header>
              <form id="student-form" onSubmit={save} className="space-y-4 overflow-y-auto px-5 py-5 sm:px-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2"><span className={labelClass}>Name *</span><input required maxLength={160} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className={inputClass} placeholder="Student name" /></label>
                  <label className="sm:col-span-2">
                    <span className={labelClass}>Image filename or URL *</span>
                    <input required maxLength={2000} value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} className={inputClass} placeholder="1712850438008-Ananya (10).png or https://…" />
                    <span className="mt-1 block text-[11px] text-slate-500">Use an existing uploaded filename or a complete image URL.</span>
                  </label>
                  {draft.image && <div className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><img src={imageUrl(draft.image)} alt="Student preview" className="h-16 w-16 rounded-lg object-cover" /><span className="min-w-0 truncate text-xs font-semibold text-slate-500">{draft.image}</span><ImagePlus className="ml-auto h-5 w-5 shrink-0 text-slate-400" /></div>}
                  <label><span className={labelClass}>Course name *</span><input required maxLength={80} list="student-courses" value={draft.courseName} onChange={(event) => setDraft({ ...draft, courseName: event.target.value })} className={inputClass} placeholder="SAT" /><datalist id="student-courses">{courses.map((item) => <option key={item} value={item} />)}</datalist></label>
                  <label><span className={labelClass}>Rank *</span><input required type="number" min={0} max={100000} step={1} value={draft.rank} onChange={(event) => setDraft({ ...draft, rank: Number(event.target.value) })} className={inputClass} /></label>
                  <label><span className={labelClass}>University</span><input maxLength={160} value={draft.univercity} onChange={(event) => setDraft({ ...draft, univercity: event.target.value })} className={inputClass} placeholder="University name (optional)" /></label>
                  <label><span className={labelClass}>Type *</span><input required maxLength={60} list="student-types" value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })} className={inputClass} placeholder="home or slider" /><datalist id="student-types">{Array.from(new Set(["home", "slider", ...types])).map((item) => <option key={item} value={item} />)}</datalist></label>
                </div>
                <label className="block">
                  <span className={labelClass}>Content</span>
                  <textarea maxLength={10000} rows={5} value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} className={inputClass + " resize-y"} placeholder="Student story or description (optional)" />
                  <span className="mt-1 block text-right text-[10px] text-slate-400">{draft.content.length}/10,000</span>
                </label>
                {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
              </form>
              <footer className="flex justify-end gap-2 border-t border-slate-100 bg-[#fafbfe] px-5 py-4 sm:px-7">
                <button type="button" onClick={() => setEditor(null)} disabled={saving} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" form="student-form" disabled={saving} className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-[#d81635] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60">
                  {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editor === "new" ? <Plus className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  {saving ? "Saving…" : editor === "new" ? "Add student" : "Save changes"}
                </button>
              </footer>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
