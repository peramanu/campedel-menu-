"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { ImagePlus, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import type { Category, MenuItem } from "@/types";

type UploadState = "idle" | "uploading" | "done" | "error";

type ItemState = {
  imageUrl: string | null;
  uploadState: UploadState;
  error: string;
};

export function BulkImageClient({
  items,
  categories,
}: {
  items: MenuItem[];
  categories: Category[];
}) {
  const [states, setStates] = useState<Record<string, ItemState>>(() =>
    Object.fromEntries(
      items.map((i) => [i.id, { imageUrl: i.image_url, uploadState: "idle", error: "" }])
    )
  );
  const [filter, setFilter] = useState<"all" | "missing" | "done">("all");
  const [search, setSearch] = useState("");
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);

  function setItemState(id: string, patch: Partial<ItemState>) {
    setStates((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  const upload = useCallback(async (itemId: string, file: File) => {
    if (!file.type.startsWith("image/")) return;
    setItemState(itemId, { uploadState: "uploading", error: "" });
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: data });
    const json = await res.json();
    if (!res.ok) {
      setItemState(itemId, { uploadState: "error", error: json.error ?? "Upload fehlgeschlagen" });
      return;
    }
    const url: string = json.url;
    await supabase.from("menu_items").update({ image_url: url }).eq("id", itemId);
    setItemState(itemId, { imageUrl: url, uploadState: "done", error: "" });
  }, []);

  async function removeImage(itemId: string) {
    await supabase.from("menu_items").update({ image_url: null }).eq("id", itemId);
    setItemState(itemId, { imageUrl: null, uploadState: "idle", error: "" });
  }

  const getCatName = (catId: string | null) =>
    categories.find((c) => c.id === catId)?.name_de ?? "—";

  const filtered = items.filter((item) => {
    const st = states[item.id];
    const hasImage = !!st?.imageUrl;
    if (filter === "missing" && hasImage) return false;
    if (filter === "done" && !hasImage) return false;
    if (search && !item.name_de.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalWithImage = items.filter((i) => !!states[i.id]?.imageUrl).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-[26px] text-zinc-900 dark:text-zinc-100 leading-none mb-1">
          Fotos verwalten
        </h1>
        <p className="text-[13px] text-muted-light dark:text-muted-dark">
          {totalWithImage} von {items.length} Gerichten haben ein Foto
        </p>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl bg-surface-light dark:bg-surface-dark border border-zinc-100 dark:border-zinc-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark">Fortschritt</span>
          <span className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
            {Math.round((totalWithImage / items.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full transition-all duration-500"
            style={{ width: `${(totalWithImage / items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex bg-zinc-100/80 dark:bg-zinc-800/80 rounded-xl p-1 gap-0.5">
          {(["all", "missing", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                filter === f
                  ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {f === "all" ? "Alle" : f === "missing" ? "Ohne Foto" : "Mit Foto"}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[180px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suchen…"
            className="w-full pl-3.5 pr-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-surface-light dark:bg-surface-dark text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((item) => {
          const st = states[item.id];
          const hasImage = !!st.imageUrl;
          const isUploading = st.uploadState === "uploading";
          const isDone = st.uploadState === "done";
          const isError = st.uploadState === "error";
          const isOvered = dragOver === item.id;

          return (
            <div key={item.id} className="flex flex-col gap-2">
              {/* Image drop zone */}
              <div
                className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all ${
                  isOvered
                    ? "border-gold bg-gold/8 scale-[1.02]"
                    : hasImage
                    ? "border-transparent"
                    : "border-dashed border-zinc-200 dark:border-zinc-700 hover:border-gold/50 bg-zinc-50 dark:bg-zinc-800/40"
                } ${!isUploading ? "cursor-pointer" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(item.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(null);
                  const file = e.dataTransfer.files[0];
                  if (file) upload(item.id, file);
                }}
                onClick={() => !isUploading && fileRefs.current[item.id]?.click()}
              >
                {hasImage ? (
                  <>
                    <Image
                      src={st.imageUrl!}
                      alt={item.name_de}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-1.5 opacity-0 hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); fileRefs.current[item.id]?.click(); }}
                        className="bg-white text-zinc-800 text-[11px] font-semibold px-2.5 py-1.5 rounded-full shadow hover:bg-zinc-50 transition flex items-center gap-1"
                      >
                        <ImagePlus size={11} /> Ersetzen
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(item.id); }}
                        className="bg-red-500 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-full shadow hover:bg-red-600 transition flex items-center gap-1"
                      >
                        <X size={11} /> Löschen
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
                    {isUploading ? (
                      <>
                        <Loader2 size={22} className="text-gold animate-spin" />
                        <p className="text-[10px] text-muted-light dark:text-muted-dark">Hochladen…</p>
                      </>
                    ) : (
                      <>
                        <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center">
                          <ImagePlus size={17} className="text-gold" strokeWidth={1.8} />
                        </div>
                        <p className="text-[10px] text-center text-muted-light dark:text-muted-dark leading-snug">
                          Tippen oder<br />hierher ziehen
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* Status badges */}
                {isDone && !hasImage && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </div>
                )}
                {isDone && hasImage && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                )}
                {isError && (
                  <div className="absolute inset-0 bg-red-50/90 dark:bg-red-950/50 flex flex-col items-center justify-center gap-1 p-2">
                    <AlertCircle size={18} className="text-red-500" />
                    <p className="text-[10px] text-red-600 dark:text-red-400 text-center leading-snug">{st.error}</p>
                  </div>
                )}

                <input
                  ref={(el) => { fileRefs.current[item.id] = el; }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) upload(item.id, file);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* Item info */}
              <div className="px-0.5">
                <p className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200 truncate leading-tight">
                  {item.name_de}
                </p>
                <p className="text-[10.5px] text-muted-light dark:text-muted-dark truncate">
                  {getCatName(item.category_id)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[14px] text-muted-light dark:text-muted-dark italic font-heading">
            Keine Einträge gefunden
          </p>
        </div>
      )}
    </div>
  );
}
