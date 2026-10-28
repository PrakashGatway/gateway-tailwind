"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  ImagePlus,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type {
  BannerAction,
  BannerPopup,
  BannerTarget,
} from "@/lib/banner-popups";
import { getBannerImageUrl } from "@/lib/banner-popups";

type Banner = BannerPopup & { createdAt: string; updatedAt: string };
type Draft = Omit<BannerPopup, "id" | "imageUrl">;
const emptyDraft: Draft = {
  title: "",
  imageAlt: "",
  enabled: true,
  layout: "full",
  priority: 0,
  targets: [{ path: "/", match: "exact" }],
  buttonAction: { type: "contact" },
  closeAction: { type: "none" },
};
const field =
  "w-full rounded-xl border border-[#dde2eb] bg-white px-3.5 py-2.5 text-sm font-medium text-[#263247] outline-none transition focus:border-[#dc3a55] focus:ring-4 focus:ring-[#d81635]/10";
const label = "mb-1.5 block text-xs font-bold text-[#526079]";

function ActionEditor({
  title,
  value,
  onChange,
}: {
  title: string;
  value: BannerAction;
  onChange: (value: BannerAction) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#e8eaf1] bg-[#fafbfe] p-4">
      <span className={label}>{title}</span>
      <div className="relative">
        <select
          value={value.type}
          onChange={(event) => {
            const type = event.target.value;
            onChange(
              type === "route"
                ? { type: "route", href: "/" }
                : type === "whatsapp"
                  ? { type: "whatsapp" }
                  : type === "contact"
                    ? { type: "contact" }
                    : { type: "none" },
            );
          }}
          className={`${field} appearance-none pr-9`}
        >
          <option value="contact">Open Get in Touch</option>
          <option value="route">Go to a route</option>
          <option value="whatsapp">Open WhatsApp</option>
          <option value="none">Close only</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
      </div>
      {value.type === "route" && (
        <input
          aria-label={`${title} destination route`}
          value={value.href}
          onChange={(event) =>
            onChange({ type: "route", href: event.target.value })
          }
          placeholder="/study-in-uk"
          className={`${field} mt-2`}
        />
      )}
      {value.type === "whatsapp" && (
        <input
          aria-label={`${title} WhatsApp message`}
          value={value.message || ""}
          onChange={(event) =>
            onChange({ type: "whatsapp", message: event.target.value })
          }
          placeholder="Optional message; blank uses page-specific text"
          className={`${field} mt-2`}
        />
      )}
    </div>
  );
}

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Banner | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/banners", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load banners");
      setBanners(data.banners || []);
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load banners",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => {
    if (!editing) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) setEditing(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, busy]);

  const filtered = useMemo(
    () =>
      banners.filter((banner) =>
        `${banner.title} ${banner.targets.map((target) => target.path).join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [banners, query],
  );
  const activeCount = banners.filter((banner) => banner.enabled).length;
  const openEditor = (banner: Banner | "new") => {
    setEditing(banner);
    setDraft(
      banner === "new"
        ? emptyDraft
        : {
            title: banner.title,
            imageAlt: banner.imageAlt,
            layout: banner.layout,
            enabled: banner.enabled,
            priority: banner.priority,
            targets: banner.targets.map((target) => ({ ...target })),
            buttonAction: { ...banner.buttonAction },
            closeAction: { ...banner.closeAction },
          },
    );
    setFile(null);
    setError("");
    setDeleteConfirm(false);
  };
  const updateTarget = (index: number, next: BannerTarget) =>
    setDraft((current) => ({
      ...current,
      targets: current.targets.map((target, i) =>
        i === index ? next : target,
      ),
    }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (editing === "new" && !file) {
      setError("Choose an image for this banner");
      return;
    }
    if (file && file.size > 8 * 1024 * 1024) {
      setError("Image must be under 8 MB");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const body = new FormData();
      body.set("banner", JSON.stringify(draft));
      if (file) body.set("image", file);
      const response = await fetch(
        editing === "new"
          ? "/api/admin/banners"
          : `/api/admin/banners/${(editing as Banner).id}`,
        { method: editing === "new" ? "POST" : "PATCH", body },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save banner");
      setEditing(null);
      setNotice(
        data.cleanupPending
          ? "Banner saved. The previous image will be removed on the next admin refresh."
          : editing === "new"
            ? "Banner created and ready for its routes."
            : "Banner changes saved.",
      );
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save banner",
      );
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!editing || editing === "new" || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/banners/${editing.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Could not delete banner");
      setEditing(null);
      setNotice(
        data.cleanupPending
          ? "Banner deleted. Its image removal will retry on admin refresh."
          : "Banner and its Cloudinary image deleted.",
      );
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not delete banner",
      );
    } finally {
      setBusy(false);
    }
  };
  const toggle = async (banner: Banner) => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          banner: { ...banner, enabled: !banner.enabled },
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Could not change status");
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not change status",
      );
    } finally {
      setBusy(false);
    }
  };
  const image =
    preview ||
    (editing && editing !== "new"
      ? getBannerImageUrl(
          { ...editing, layout: draft.layout },
          draft.layout === "full" ? 980 : 780,
        )
      : null);

  return (
    <main className="mx-auto max-w-[1500px] px-5 py-7 sm:px-7 lg:px-9">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d81635]">
            Campaigns
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#202b3f]">
            Popup banners
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Show image-only offers on the routes you choose.
          </p>
        </div>
        <button
          onClick={() => openEditor("new")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#d81635] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_25px_-12px_rgba(216,22,53,.7)] transition hover:bg-[#b9142e]"
        >
          <Plus className="h-4 w-4" /> Create banner
        </button>
      </header>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Total banners", banners.length],
          ["Live now", activeCount],
          ["Paused", banners.length - activeCount],
        ].map(([name, value]) => (
          <div
            key={name}
            className="rounded-2xl border border-[#e9eaf1] bg-white px-5 py-4 shadow-[0_6px_24px_-20px_rgba(25,38,65,.3)]"
          >
            <p className="text-xs font-semibold text-slate-500">{name}</p>
            <p className="mt-1 text-2xl font-bold text-[#263247]">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-[22px] border border-[#e9eaf1] bg-white shadow-[0_14px_35px_-28px_rgba(25,38,65,.25)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f5] p-5">
          <div>
            <h2 className="font-bold text-[#263247]">All banners</h2>
            <p className="text-xs text-slate-500">
              Higher priority wins when several banners match a route.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title or route"
              aria-label="Search banners"
              className={`${field} pl-9`}
            />
          </div>
        </div>
        {notice && (
          <p
            role="status"
            className="mx-5 mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
          >
            {notice}
          </p>
        )}
        {error && !editing && (
          <p
            role="alert"
            className="mx-5 mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
          >
            {error}
          </p>
        )}
        {loading ? (
          <div className="flex justify-center p-16">
            <LoaderCircle className="h-6 w-6 animate-spin text-[#d81635]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <ImagePlus className="mx-auto h-8 w-8 text-rose-300" />
            <p className="mt-3 font-semibold text-[#263247]">
              {query ? "No matching banners" : "No banners yet"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {query
                ? "Try another title or route."
                : "Create your first campaign to show an offer."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#edf0f5]">
            {filtered.map((banner) => (
              <article
                key={banner.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-[#fcfcfe] md:flex-row md:items-center"
              >
                <div className="grid h-28 w-full shrink-0 place-items-center overflow-hidden rounded-xl bg-[#f5f6fa] md:w-44">
                  <img
                    src={getBannerImageUrl(banner, 390)}
                    alt={banner.imageAlt}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-[#263247]">{banner.title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${banner.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {banner.enabled ? "Live" : "Paused"}
                    </span>
                    <span className="rounded-full bg-[#fff0f3] px-2.5 py-1 text-[10px] font-bold text-[#b9142e]">
                      {banner.layout === "full" ? "Full popup" : "Sidebar"}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {banner.targets.map((target, index) => (
                      <span
                        key={`${target.path}:${index}`}
                        className="rounded-md border border-[#e8eaf1] bg-white px-2 py-1 text-[11px] font-semibold text-[#627087]"
                      >
                        {target.path}
                        {target.match === "prefix" ? "/*" : ""}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Priority {banner.priority} · Updated{" "}
                    {new Date(banner.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    disabled={busy}
                    onClick={() => toggle(banner)}
                    aria-label={`${banner.enabled ? "Pause" : "Activate"} ${banner.title}`}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${banner.enabled ? "border-slate-200 text-slate-600 hover:bg-slate-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
                  >
                    {banner.enabled ? "Pause" : "Activate"}
                  </button>
                  <button
                    onClick={() => openEditor(banner)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#e4e7ef] px-3 py-2 text-xs font-bold text-[#263247] transition hover:border-rose-200 hover:text-[#c41430]"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <AnimatePresence>
        {editing && (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101b33]/60 p-2 sm:p-5"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !busy)
                setEditing(null);
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={
                editing === "new" ? "Create banner" : `Edit ${editing.title}`
              }
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ type: "spring", damping: 29, stiffness: 310 }}
              className="flex max-h-[92vh] w-full max-w-[970px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_100px_rgba(10,21,45,.36)]"
            >
              <div className="flex items-center justify-between border-b border-[#e9eaf1] px-5 py-4 sm:px-7">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#d81635]">
                    Banner campaign
                  </p>
                  <h2 className="text-lg font-bold text-[#263247]">
                    {editing === "new"
                      ? "Create a popup banner"
                      : "Edit popup banner"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  disabled={busy}
                  aria-label="Close editor"
                  className="grid h-9 w-9 place-items-center rounded-full bg-[#f3f5f8] text-slate-600 transition hover:bg-[#fff0f3] hover:text-[#c41430]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form
                id="banner-form"
                onSubmit={submit}
                className="space-y-6 overflow-y-auto px-5 py-5 sm:px-7"
              >
                <div className="grid gap-5 md:grid-cols-[1.2fr_.8fr]">
                  <div>
                    <label htmlFor="banner-title" className={label}>
                      Internal title *
                    </label>
                    <input
                      id="banner-title"
                      required
                      maxLength={100}
                      value={draft.title}
                      onChange={(event) =>
                        setDraft({ ...draft, title: event.target.value })
                      }
                      placeholder="UK application offer"
                      className={field}
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      The title organizes your banners in admin. The public
                      popup displays only the image.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="banner-alt" className={label}>
                      Image description
                    </label>
                    <input
                      id="banner-alt"
                      maxLength={180}
                      value={draft.imageAlt}
                      onChange={(event) =>
                        setDraft({ ...draft, imageAlt: event.target.value })
                      }
                      placeholder="Describe the offer for accessibility"
                      className={field}
                    />
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
                  <div>
                    <span className={label}>Popup size</span>
                    <div className="grid grid-cols-2 gap-2">
                      {(["full", "sidebar"] as const).map((layout) => (
                        <button
                          key={layout}
                          type="button"
                          onClick={() => setDraft({ ...draft, layout })}
                          className={`rounded-xl border px-3 py-3 text-left text-sm font-bold transition ${draft.layout === layout ? "border-[#d81635] bg-[#fff1f4] text-[#bd1530]" : "border-[#e3e7ee] text-slate-600 hover:border-rose-200"}`}
                        >
                          {layout === "full" ? "Full popup" : "Sidebar card"}
                          <small className="mt-1 block text-[11px] font-medium">
                            {layout === "full"
                              ? "Max height 80vh"
                              : "Max height 150px"}
                          </small>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="banner-priority" className={label}>
                        Priority
                      </label>
                      <input
                        id="banner-priority"
                        type="number"
                        min={-100}
                        max={100}
                        value={draft.priority}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            priority: Number(event.target.value),
                          })
                        }
                        className={field}
                      />
                      <p className="mt-1 text-[11px] text-slate-500">
                        Higher shows first
                      </p>
                    </div>
                    <div>
                       <label htmlFor="banner-status" className={label}>
                        Priority
                      </label>
                    <label className="flex cursor-pointer items-center gap-3 self-start rounded-xl border border-[#e3e7ee] p-3.5 text-sm font-bold text-[#526079]">
                      
                      <input
                        type="checkbox"
                        checked={draft.enabled}
                        onChange={(event) =>
                          setDraft({ ...draft, enabled: event.target.checked })
                        }
                        className="h-4 w-4 accent-[#d81635]"
                      />{" "}
                      Live
                    </label>

                    </div>
                  </div>
                </div>
                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#263247]">
                        Display routes
                      </h3>
                      <p className="text-xs text-slate-500">
                        Exact shows on one page. Prefix includes its child
                        pages.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={draft.targets.length >= 15}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          targets: [
                            ...draft.targets,
                            { path: "/", match: "exact" },
                          ],
                        })
                      }
                      className="flex items-center gap-1 text-xs font-bold text-[#c41430] disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add route
                    </button>
                  </div>
                  <div className="space-y-2">
                    {draft.targets.map((target, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          aria-label={`Route ${index + 1}`}
                          required
                          value={target.path}
                          onChange={(event) =>
                            updateTarget(index, {
                              ...target,
                              path: event.target.value,
                            })
                          }
                          placeholder="/study-in-uk"
                          className={`${field} min-w-[50%]`}
                        />
                        <select
                          aria-label={`Route ${index + 1} match`}
                          value={target.match}
                          onChange={(event) =>
                            updateTarget(index, {
                              ...target,
                              match: event.target
                                .value as BannerTarget["match"],
                            })
                          }
                          className={`${field} w-28`}
                        >
                          <option value="exact">Exact</option>
                          <option value="prefix">Prefix</option>
                        </select>
                        <button
                          type="button"
                          disabled={draft.targets.length <= 1}
                          onClick={() =>
                            setDraft({
                              ...draft,
                              targets: draft.targets.filter(
                                (_, i) => i !== index,
                              ),
                            })
                          }
                          aria-label={`Remove route ${index + 1}`}
                          className="grid w-10 shrink-0 place-items-center rounded-xl border border-[#e3e7ee] text-slate-400 transition hover:text-rose-600 disabled:opacity-30"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#263247]">
                        Banner image *
                      </h3>
                      <p className="text-xs text-slate-500">
                        JPG, PNG, WebP or AVIF · up to 8 MB · uploaded to
                        Cloudinary /popupbanner
                      </p>
                    </div>
                  </div>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e2e5ed] bg-[#fafbfe] px-4 py-5 text-center transition hover:border-[#e999aa] hover:bg-[#fff9fa]">
                    <ImagePlus className="h-6 w-6 text-[#d81635]" />
                    <span className="mt-2 text-sm font-bold text-[#263247]">
                      {file
                        ? file.name
                        : editing === "new"
                          ? "Choose an image"
                          : "Replace image"}
                    </span>
                    <span className="mt-1 text-[11px] text-slate-500">
                      {draft.layout === "full"
                        ? "Suggested: wide 1200 × 700 px"
                        : "Suggested: wide 780 × 300 px"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="sr-only"
                      onChange={(event) =>
                        setFile(event.target.files?.[0] || null)
                      }
                    />
                  </label>
                  {image && (
                    <div className="mt-3 rounded-2xl bg-[#222b3c] p-3 text-center">
                      <img
                        src={image}
                        alt="Banner preview"
                        className={`${draft.layout === "full" ? "max-h-[300px]" : "max-h-[150px] max-w-[390px]"} mx-auto w-auto max-w-full rounded-lg object-contain`}
                      />
                      <p className="mt-2 text-[11px] font-semibold text-white/75">
                        {draft.layout === "full"
                          ? "Full popup preview"
                          : "Sidebar preview"}
                      </p>
                    </div>
                  )}
                  {editing !== "new" && file && (
                    <p className="mt-2 text-xs text-amber-700">
                      Saving replaces this image and removes the previous
                      Cloudinary file.
                    </p>
                  )}
                </section>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ActionEditor
                    title="When image is clicked"
                    value={draft.buttonAction}
                    onChange={(buttonAction) =>
                      setDraft((current) => ({ ...current, buttonAction }))
                    }
                  />
                  <ActionEditor
                    title="When popup is closed"
                    value={draft.closeAction}
                    onChange={(closeAction) =>
                      setDraft((current) => ({ ...current, closeAction }))
                    }
                  />
                </div>
                {error && (
                  <p
                    role="alert"
                    className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
                  >
                    {error}
                  </p>
                )}
                {editing !== "new" && (
                  <div className="border-t border-[#edf0f5] pt-4">
                    {deleteConfirm ? (
                      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-rose-50 p-3">
                        <span className="flex-1 text-xs font-bold text-rose-700">
                          Delete this banner and its image?
                        </span>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(false)}
                          className="rounded-lg px-3 py-2 text-xs font-bold text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={remove}
                          disabled={busy}
                          className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white"
                        >
                          Delete permanently
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(true)}
                        className="flex items-center gap-1.5 text-xs font-bold text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete banner
                      </button>
                    )}
                  </div>
                )}
              </form>
              <div className="flex items-center justify-between gap-3 border-t border-[#e9eaf1] bg-[#fafbfe] px-5 py-4 sm:px-7">
                <p className="hidden text-xs text-slate-500 sm:block">
                  {draft.layout === "full"
                    ? "Image scales within 80vh."
                    : "Image scales within 150px."}
                </p>
                <div className="ml-auto flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setEditing(null)}
                    className="rounded-xl border border-[#e3e7ee] bg-white px-4 py-2.5 text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="banner-form"
                    disabled={busy}
                    className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-[#d81635] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#b9142e] disabled:opacity-60"
                  >
                    {busy ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {busy ? "Saving…" : "Save banner"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
