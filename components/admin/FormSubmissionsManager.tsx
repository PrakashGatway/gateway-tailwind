"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, ChevronLeft, ChevronRight, Download, ExternalLink, FileText, Image as ImageIcon, LoaderCircle, RefreshCw, Trash2, X } from "lucide-react";

type FormField = { key: string; value: unknown };
type FormSubmission = { id: string; fields: FormField[] };
type Attachment = {
  title: string;
  filename: string;
  url: string;
  mimeType: string;
  binary: boolean;
};
type FormResponse = {
  forms: FormSubmission[];
  types: string[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const field =
  "rounded-xl border border-[#dde2eb] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#263247] outline-none transition focus:border-[#dc3a55] focus:ring-4 focus:ring-[#d81635]/10";

function formatLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "[Value unavailable]";
  }
}

function isFileKey(value: string) {
  const normalized = value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/-/g, "_").toLowerCase();
  return /(^|_)(file|resume|cv|attachment|document|upload)(_|$)/.test(normalized);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function fileMetadata(value: unknown, names: string[]): string {
  const record = asRecord(value);
  if (!record) return "";
  for (const name of names) {
    if (typeof record[name] === "string" && (record[name] as string).trim()) {
      return (record[name] as string).trim();
    }
  }
  return "";
}

function fileReference(value: unknown): string {
  if (typeof value !== "string") return "";
  const raw = value.trim().replace(/\\/g, "/");
  if (!raw || raw === "[Binary attachment omitted]") return "";
  if (/^data:(application\/pdf|image\/(png|jpeg|gif|webp));base64,/i.test(raw)) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  const baseUrl = process.env.NEXT_PUBLIC_UPLOADS_BASE_URL || "https://api.gatewayabroadeducations.com/api/uploads/";
  if (raw.startsWith("/") && !raw.startsWith("//")) {
    try {
      return new URL(raw, new URL(baseUrl).origin).toString();
    } catch {
      return "";
    }
  }
  const uploadsBase = baseUrl.replace(/\/+$/, "") + "/";
  const relative = raw.replace(/^\/+/, "").replace(/^uploads\//i, "");
  try {
    return new URL(relative, uploadsBase).toString();
  } catch {
    return "";
  }
}

function attachmentFor(form: FormSubmission, item: FormField): Attachment | null {
  const record = asRecord(item.value);
  const binary = record?._fileBinary === true || item.value === "[Binary attachment omitted]";
  const objectHasFileMetadata = Boolean(
    record &&
      ["url", "downloadUrl", "href", "path", "filePath", "src", "filename", "fileName", "originalname"]
        .some((key) => typeof record[key] === "string" && (record[key] as string).trim()),
  );
  const isFile = isFileKey(item.key) || binary || objectHasFileMetadata;
  if (!isFile) return null;
  const reference = fileReference(
    typeof item.value === "string"
      ? item.value
      : fileMetadata(item.value, ["url", "downloadUrl", "href", "path", "filePath", "src", "filename", "fileName", "originalname", "name"]),
  );
  if (!binary && !reference) return null;

  let urlFilename = "";
  if (reference && !reference.startsWith("data:")) {
    const lastPart = reference.split("?")[0].split("/").pop() || "";
    try {
      urlFilename = decodeURIComponent(lastPart);
    } catch {
      urlFilename = lastPart;
    }
  }
  const filename =
    fileMetadata(item.value, ["originalname", "originalName", "fileName", "filename", "name"]) ||
    urlFilename ||
    formatLabel(item.key);
  const mimeType = fileMetadata(item.value, ["mimetype", "mimeType", "contentType", "type"]);
  const url = binary
    ? "/api/admin/forms/" + encodeURIComponent(form.id) + "/file?field=" + encodeURIComponent(item.key)
    : reference;
  return { title: formatLabel(item.key), filename, url, mimeType, binary };
}

function fileKind(attachment: Attachment) {
  const value = (attachment.mimeType + " " + attachment.filename + " " + attachment.url).toLowerCase();
  if (/image\/(png|jpe?g|gif|webp)|\.(png|jpe?g|gif|webp)(?:$|\?)/.test(value)) return "image";
  if (/application\/pdf|\.pdf(?:$|\?)/.test(value)) return "pdf";
  return "other";
}

function fieldValue(fields: FormField[], name: string) {
  return fields.find((item) => item.key.toLowerCase() === name.toLowerCase())?.value;
}

export default function FormSubmissionsManager() {
  const [forms, setForms] = useState<FormSubmission[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const loadForms = useCallback(async () => {
    setLoading(true);
    setError("");
    const query = new URLSearchParams({
      type,
      page: String(page),
      pageSize: String(pageSize),
    });
    try {
      const response = await fetch("/api/admin/forms?" + query.toString(), { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load submissions");
      const result = data as FormResponse;
      setForms(Array.isArray(result.forms) ? result.forms : []);
      setTypes(Array.isArray(result.types) ? result.types : []);
      setPage(result.page || 1);
      setPageSize(result.pageSize || 20);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load submissions");
    } finally {
      setLoading(false);
    }
  }, [type, page, pageSize]);

  useEffect(() => {
    void loadForms();
  }, [loadForms]);

  async function deleteForm(form: FormSubmission) {
    if (deleting) return;
    const name = fieldValue(form.fields, "name");
    const label = typeof name === "string" && name.trim() ? name : "this submission";
    if (!window.confirm("Delete " + label + " permanently?")) return;

    setDeleting(form.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/forms/" + encodeURIComponent(form.id), {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete submission");
      setNotice("Form submission deleted.");
      if (forms.length === 1 && page > 1) setPage(page - 1);
      else void loadForms();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete submission");
    } finally {
      setDeleting("");
    }
  }

  async function downloadAttachment() {
    if (!selectedAttachment || downloading) return;
    if (selectedAttachment.binary) {
      const link = document.createElement("a");
      link.href = selectedAttachment.url + "&download=1";
      link.download = selectedAttachment.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    setDownloading(true);
    try {
      const response = await fetch(selectedAttachment.url, { credentials: "include" });
      if (!response.ok) throw new Error("Download request failed");
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = selectedAttachment.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      window.open(selectedAttachment.url, "_blank", "noopener,noreferrer");
      setDownloadError("The file server blocked a direct download. Use Open in new tab to view or save it.");
    } finally {
      setDownloading(false);
    }
  }

  const firstItem = total ? (page - 1) * pageSize + 1 : 0;
  const lastItem = Math.min(page * pageSize, total);

  return (
    <main className="mx-auto max-w-[1400px] space-y-5 px-5 py-6 font-medium sm:px-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#d81635]">Inbox</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1b2538]">Form submissions</h1>
          <p className="mt-1 text-sm text-slate-500">Review contact requests, enquiries, and other submitted forms.</p>
        </div>
        <button
          type="button"
          onClick={() => void loadForms()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={"h-4 w-4" + (loading ? " animate-spin" : "")} />
          Refresh
        </button>
      </div>

      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p>}

      <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-7">
          <div>
            <h2 className="text-base font-bold text-[#1b2538]">Submissions</h2>
            <p className="mt-1 text-xs text-slate-500">
              Showing {firstItem}–{lastItem} of {total}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="form-type-filter" className="text-xs font-bold text-slate-500">Type</label>
            <select
              id="form-type-filter"
              value={type}
              onChange={(event) => { setType(event.target.value); setPage(1); setNotice(""); }}
              className={field}
            >
              <option value="all">All types</option>
              {types.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}
            </select>
            <label htmlFor="form-page-size" className="text-xs font-bold text-slate-500">Per page</label>
            <select
              id="form-page-size"
              value={pageSize}
              onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}
              className={field}
            >
              {[10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm font-semibold text-slate-500">
            <LoaderCircle className="h-5 w-5 animate-spin" /> Loading submissions…
          </div>
        ) : forms.length ? (
          <div className="divide-y divide-slate-100">
            {forms.map((form) => {
              const name = fieldValue(form.fields, "name");
              const email = fieldValue(form.fields, "email");
              const phone = fieldValue(form.fields, "mobileNo") ?? fieldValue(form.fields, "phone");
              const submissionType = fieldValue(form.fields, "type");
              return (
                <article key={form.id} className="px-5 py-5 sm:px-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[#263247]">
                          {typeof name === "string" && name.trim() ? name : "Form submission"}
                        </h3>
                        <span className="rounded-full bg-[#fff0f3] px-2.5 py-1 text-[10px] font-bold text-[#b9142e]">
                          {typeof submissionType === "string" && submissionType ? formatLabel(submissionType) : "Uncategorized"}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        {typeof email === "string" && <span className="break-all">{email}</span>}
                        {typeof phone === "string" && <span>{phone}</span>}
                      </div>
                      <p className="mt-1 truncate text-[10px] text-slate-400">ID: {form.id}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void deleteForm(form)}
                      disabled={Boolean(deleting)}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-200 px-3.5 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                    >
                      {deleting === form.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      Delete
                    </button>
                  </div>

                  <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {form.fields.map((item) => {
                      const attachment = attachmentFor(form, item);
                      return (
                        <div
                          key={item.key}
                          className={"min-w-0 rounded-xl bg-[#f8f9fc] px-3.5 py-3" + (item.key.toLowerCase() === "message" ? " sm:col-span-2 xl:col-span-3" : "")}
                        >
                          <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{formatLabel(item.key)}</dt>
                          {attachment ? (
                            <dd className="mt-2">
                              <button
                                type="button"
                                onClick={() => { setDownloadError(""); setSelectedAttachment(attachment); }}
                                className="inline-flex max-w-full items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 text-left text-xs font-bold text-[#b9142e] transition hover:bg-rose-50"
                              >
                                <FileText className="h-4 w-4 shrink-0" />
                                <span className="truncate">{attachment.filename}</span>
                                <span className="shrink-0">View</span>
                              </button>
                            </dd>
                          ) : (
                            <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                              {displayValue(item.value)}
                            </dd>
                          )}
                        </div>
                      );
                    })}
                  </dl>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <ClipboardList className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-600">No submissions found</p>
            <p className="mt-1 text-xs text-slate-400">Try another form type or check again later.</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-7">
          <p className="text-xs font-medium text-slate-500">Page {page} of {totalPages}</p>
          <nav aria-label="Form submission pages" className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </section>
      <AnimatePresence>
        {selectedAttachment && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#101b33]/65 p-2 backdrop-blur-sm sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedAttachment(null);
            }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label={"Attachment: " + selectedAttachment.filename}
              className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
            >
              <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d81635]">{selectedAttachment.title}</p>
                  <h2 className="truncate text-sm font-bold text-[#263247]">{selectedAttachment.filename}</h2>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void downloadAttachment()}
                    disabled={downloading}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#d81635] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#b9132d]"
                  >
                    {downloading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {downloading ? "Preparing…" : "Download"}
                  </button>
                  {!selectedAttachment.binary && (
                    <a
                      href={selectedAttachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open attachment in a new tab"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedAttachment(null)}
                    aria-label="Close attachment preview"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </header>
              {downloadError && (
                <p role="status" className="border-b border-amber-200 bg-amber-50 px-5 py-2 text-xs font-semibold text-amber-800">
                  {downloadError}
                </p>
              )}
              <div className="min-h-[45vh] flex-1 overflow-auto bg-[#eef1f6] p-3 sm:p-5">
                {fileKind(selectedAttachment) === "image" ? (
                  <div className="grid min-h-[45vh] place-items-center">
                    <img src={selectedAttachment.url} alt={selectedAttachment.filename} className="max-h-[75vh] max-w-full rounded-lg object-contain shadow" />
                  </div>
                ) : fileKind(selectedAttachment) === "pdf" ? (
                  <iframe title={selectedAttachment.filename} src={selectedAttachment.url} className="h-[72vh] w-full rounded-lg border border-slate-200 bg-white" />
                ) : (
                  <div className="grid min-h-[45vh] place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                    <div>
                      <ImageIcon className="mx-auto h-9 w-9 text-slate-300" />
                      <p className="mt-3 text-sm font-bold text-slate-700">Preview isn’t available for this file type.</p>
                      <p className="mt-1 text-xs text-slate-500">Download the file to open it on your device.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
