"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { BriefcaseBusiness, LoaderCircle, MapPin, Plus, RefreshCw, Search, Trash2, Users, X } from "lucide-react";

type Job = {
  _id: string;
  jobTitle: string;
  jobShortDescription: string;
  jobDescription: string;
  vacancy: number;
  location: string;
  jobType: string;
  jobExp: number;
  jobLevel: string;
  Status: boolean;
};

type JobDraft = Omit<Job, "_id">;

const emptyDraft: JobDraft = {
  jobTitle: "",
  jobShortDescription: "",
  jobDescription: "",
  vacancy: 1,
  location: "",
  jobType: "Full-Time",
  jobExp: 0,
  jobLevel: "Mid",
  Status: true,
};

const field = "w-full rounded-xl border border-[#dde2eb] bg-white px-3.5 py-2.5 text-sm font-medium text-[#263247] outline-none transition focus:border-[#dc3a55] focus:ring-4 focus:ring-[#d81635]/10";
const label = "mb-1.5 block text-xs font-bold text-[#526079]";

function plainText(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function JobsManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [draft, setDraft] = useState<JobDraft>(emptyDraft);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/jobs", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load jobs");
      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return jobs;
    return jobs.filter((job) =>
      [job.jobTitle, job.location, job.jobType, job.jobLevel]
        .some((value) => (value || "").toLowerCase().includes(query)),
    );
  }, [jobs, search]);

  async function createJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create job");
      setJobs((current) => [data.job, ...current]);
      setDraft(emptyDraft);
      setShowForm(false);
      setNotice("Job created.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create job");
    } finally {
      setSaving(false);
    }
  }

  async function deleteJob(job: Job) {
    if (deleting) return;
    if (!window.confirm("Delete “" + job.jobTitle + "” permanently?")) return;
    setDeleting(job._id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/jobs/" + encodeURIComponent(job._id), {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete job");
      setJobs((current) => current.filter((item) => item._id !== job._id));
      setNotice("Job deleted.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete job");
    } finally {
      setDeleting("");
    }
  }

  return (
    <main className="mx-auto max-w-[1400px] space-y-5 px-5 py-6 font-medium sm:px-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#d81635]">Careers</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1b2538]">Job openings</h1>
          <p className="mt-1 text-sm text-slate-500">Manage the jobs stored in your MongoDB jobs collection.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadJobs()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={"h-4 w-4" + (loading ? " animate-spin" : "")} /> Refresh
          </button>
          <button
            type="button"
            onClick={() => { setShowForm((value) => !value); setError(""); }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#d81635] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#b9132d]"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Close form" : "Add job"}
          </button>
        </div>
      </div>

      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p>}

      {showForm && (
        <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-7">
            <h2 className="text-base font-bold text-[#1b2538]">Add a job opening</h2>
            <p className="mt-1 text-xs text-slate-500">Descriptions accept HTML, matching the format of your existing job records.</p>
          </div>
          <form onSubmit={createJob} className="space-y-4 px-5 py-5 sm:px-7">
            <div className="grid gap-4 md:grid-cols-2">
              <label><span className={label}>Job title *</span><input required maxLength={150} value={draft.jobTitle} onChange={(event) => setDraft({ ...draft, jobTitle: event.target.value })} className={field} /></label>
              <label><span className={label}>Location *</span><input required maxLength={200} value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} placeholder="Jaipur" className={field} /></label>
              <label><span className={label}>Job type *</span><input required maxLength={100} value={draft.jobType} onChange={(event) => setDraft({ ...draft, jobType: event.target.value })} placeholder="Full-Time" className={field} /></label>
              <label><span className={label}>Job level *</span><input required maxLength={100} value={draft.jobLevel} onChange={(event) => setDraft({ ...draft, jobLevel: event.target.value })} placeholder="Mid-Senior" className={field} /></label>
              <label><span className={label}>Vacancies *</span><input required type="number" min={0} max={100000} step={1} value={draft.vacancy} onChange={(event) => setDraft({ ...draft, vacancy: Number(event.target.value) })} className={field} /></label>
              <label><span className={label}>Experience (years) *</span><input required type="number" min={0} max={100} step={0.5} value={draft.jobExp} onChange={(event) => setDraft({ ...draft, jobExp: Number(event.target.value) })} className={field} /></label>
            </div>
            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700">
              <input type="checkbox" checked={draft.Status} onChange={(event) => setDraft({ ...draft, Status: event.target.checked })} className="h-4 w-4 accent-[#d81635]" />
              Active on careers list
            </label>
            <label className="block"><span className={label}>Short description</span><textarea maxLength={20000} rows={3} value={draft.jobShortDescription} onChange={(event) => setDraft({ ...draft, jobShortDescription: event.target.value })} placeholder="Short role summary (plain text or HTML)" className={field + " resize-y"} /></label>
            <label className="block"><span className={label}>Job description</span><textarea maxLength={50000} rows={7} value={draft.jobDescription} onChange={(event) => setDraft({ ...draft, jobDescription: event.target.value })} placeholder="Full role details (plain text or HTML)" className={field + " resize-y"} /></label>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setShowForm(false)} disabled={saving} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600">Cancel</button>
              <button type="submit" disabled={saving} className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-[#d81635] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60">
                {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {saving ? "Creating…" : "Create job"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-7">
          <div>
            <h2 className="text-base font-bold text-[#1b2538]">Jobs collection</h2>
            <p className="mt-1 text-xs text-slate-500">{jobs.length} jobs loaded</p>
          </div>
          <label className="relative block w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, location, type…" className={field + " pl-9"} />
          </label>
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm font-semibold text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin" /> Loading jobs…</div>
        ) : filteredJobs.length ? (
          <div className="divide-y divide-slate-100">
            {filteredJobs.map((job) => (
              <article key={job._id} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-[#263247]">{job.jobTitle}</h3>
                    <span className={"rounded-full px-2.5 py-1 text-[10px] font-bold " + (job.Status ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>{job.Status ? "Active" : "Inactive"}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                    <span>{job.jobType}</span><span>{job.jobExp} years experience</span><span>{job.jobLevel}</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{job.vacancy} {job.vacancy === 1 ? "vacancy" : "vacancies"}</span>
                  </div>
                  {job.jobShortDescription && <p className="mt-3 line-clamp-2 max-w-4xl text-sm leading-6 text-slate-600">{plainText(job.jobShortDescription)}</p>}
                  <p className="mt-2 truncate text-[10px] text-slate-400">ID: {job._id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void deleteJob(job)}
                  disabled={Boolean(deleting)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-rose-200 px-3.5 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                >
                  {deleting === job._id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Delete
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-600">{search ? "No jobs match that search" : "No jobs found"}</p>
            <p className="mt-1 text-xs text-slate-400">{search ? "Try a different title or location." : "Add an opening to start managing jobs here."}</p>
          </div>
        )}
      </section>
      <p className="text-[11px] text-slate-400">This screen lists up to 500 records from the jobs collection.</p>
    </main>
  );
}
