"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { AllergenSelector } from "./AllergenSelector";
import { X, Save, ImagePlus, Trash2, Loader2 } from "lucide-react";
import type { Category, MenuItem } from "@/types";

type Tab = "de" | "it" | "en";
const WINE_SLUGS = ["schaumwein", "weisswein", "rotwein"];

const LANG_LABELS: Record<Tab, { flag: string; label: string }> = {
  de: { flag: "🇩🇪", label: "Deutsch" },
  it: { flag: "🇮🇹", label: "Italiano" },
  en: { flag: "🇬🇧", label: "English" },
};

export function ItemForm({
  item,
  categories,
  allergenIds,
  onSave,
  onCancel,
}: {
  item?: MenuItem;
  categories: Category[];
  allergenIds?: number[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const [tab, setTab] = useState<Tab>("de");
  const [loading, setLoading] = useState(false);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "error">("idle");
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    category_id: item?.category_id ?? categories[0]?.id ?? "",
    name_de: item?.name_de ?? "",
    name_it: item?.name_it ?? "",
    name_en: item?.name_en ?? "",
    description_de: item?.description_de ?? "",
    description_it: item?.description_it ?? "",
    description_en: item?.description_en ?? "",
    price: item?.price?.toString() ?? "",
    price_glass: item?.price_glass?.toString() ?? "",
    price_quarter: item?.price_quarter?.toString() ?? "",
    price_half: item?.price_half?.toString() ?? "",
    price_liter: item?.price_liter?.toString() ?? "",
    image_url: item?.image_url ?? "",
    is_available: item?.is_available ?? true,
    is_vegetarian: item?.is_vegetarian ?? false,
    is_vegan: item?.is_vegan ?? false,
    is_daily_special: item?.is_daily_special ?? false,
    is_bio: item?.is_bio ?? false,
    wine_producer: item?.wine_producer ?? "",
    wine_region: item?.wine_region ?? "",
    wine_doc: item?.wine_doc ?? "",
    wine_style: item?.wine_style ?? "",
    wine_grapes: item?.wine_grapes?.join(", ") ?? "",
    tasting_notes_de: item?.tasting_notes_de ?? "",
    tasting_notes_it: item?.tasting_notes_it ?? "",
  });

  const [selectedAllergens, setSelectedAllergens] = useState<number[]>(allergenIds ?? []);

  const selectedCat = categories.find((c) => c.id === form.category_id);
  const isWine = selectedCat ? WINE_SLUGS.includes(selectedCat.slug) : false;

  function set(key: string, val: string | boolean) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function uploadFile(file: File) {
    setUploadState("uploading");
    setUploadError("");
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: data });
    const json = await res.json();
    if (!res.ok) {
      setUploadState("error");
      setUploadError(json.error ?? "Upload fehlgeschlagen");
      return;
    }
    set("image_url", json.url);
    setUploadState("idle");
  }

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) uploadFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      category_id: form.category_id || null,
      name_de: form.name_de,
      name_it: form.name_it || null,
      name_en: form.name_en || null,
      description_de: form.description_de || null,
      description_it: form.description_it || null,
      description_en: form.description_en || null,
      price: form.price ? parseFloat(form.price) : null,
      price_glass: form.price_glass ? parseFloat(form.price_glass) : null,
      price_quarter: form.price_quarter ? parseFloat(form.price_quarter) : null,
      price_half: form.price_half ? parseFloat(form.price_half) : null,
      price_liter: form.price_liter ? parseFloat(form.price_liter) : null,
      image_url: form.image_url || null,
      is_available: form.is_available,
      is_vegetarian: form.is_vegetarian,
      is_vegan: form.is_vegan,
      is_daily_special: form.is_daily_special,
      is_bio: form.is_bio,
      wine_producer: form.wine_producer || null,
      wine_region: form.wine_region || null,
      wine_doc: form.wine_doc || null,
      wine_style: form.wine_style || null,
      wine_grapes: form.wine_grapes ? form.wine_grapes.split(",").map((s) => s.trim()).filter(Boolean) : null,
      tasting_notes_de: form.tasting_notes_de || null,
      tasting_notes_it: form.tasting_notes_it || null,
    };
    let itemId = item?.id;
    if (item) {
      await supabase.from("menu_items").update(payload).eq("id", item.id);
    } else {
      const { data } = await supabase.from("menu_items").insert(payload).select("id").single();
      itemId = data?.id;
    }
    if (itemId) {
      await supabase.from("item_allergens").delete().eq("item_id", itemId);
      if (selectedAllergens.length > 0) {
        await supabase.from("item_allergens").insert(
          selectedAllergens.map((aid) => ({ item_id: itemId, allergen_id: aid }))
        );
      }
    }
    setLoading(false);
    onSave();
  }

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-surface-light dark:bg-surface-dark text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition";
  const sectionLabel =
    "text-[10px] font-bold uppercase tracking-[0.22em] text-muted-light dark:text-muted-dark mb-3 block";
  const fieldLabel =
    "text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Category */}
      <div>
        <span className={sectionLabel}>Kategorie</span>
        <select
          value={form.category_id}
          onChange={(e) => set("category_id", e.target.value)}
          className={inputCls}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name_de}</option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

      {/* Multilingual content */}
      <div>
        <span className={sectionLabel}>Bezeichnung & Beschreibung</span>

        {/* Language tabs */}
        <div className="flex gap-1 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-xl p-1 mb-4">
          {(["de", "it", "en"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-medium transition-all ${
                tab === t
                  ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              <span className="text-sm leading-none">{LANG_LABELS[t].flag}</span>
              <span>{t.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {(["de", "it", "en"] as Tab[]).map((t) => (
          <div key={t} className={`space-y-3 ${tab !== t ? "hidden" : ""}`}>
            <div>
              <label className={fieldLabel}>
                Name {LANG_LABELS[t].flag}
                {t === "de" && <span className="text-red-400 ml-0.5">*</span>}
              </label>
              <input
                value={form[`name_${t}` as keyof typeof form] as string}
                onChange={(e) => set(`name_${t}`, e.target.value)}
                className={inputCls}
                required={t === "de"}
                placeholder={t === "de" ? "Pflichtfeld" : "Optional"}
              />
            </div>
            <div>
              <label className={fieldLabel}>Beschreibung {LANG_LABELS[t].flag}</label>
              <textarea
                value={form[`description_${t}` as keyof typeof form] as string}
                onChange={(e) => set(`description_${t}`, e.target.value)}
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="Optional"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

      {/* Prices */}
      <div>
        <span className={sectionLabel}>Preise</span>
        <div className={`grid gap-3 ${isWine ? "grid-cols-2" : "grid-cols-1 max-w-[160px]"}`}>
          <div>
            <label className={fieldLabel}>Preis (€)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-zinc-400 pointer-events-none">€</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={`${inputCls} pl-7`}
                placeholder="0.00"
              />
            </div>
          </div>
          {isWine && (
            <>
              {[
                { key: "price_glass", label: "Glas" },
                { key: "price_quarter", label: "0,25 l" },
                { key: "price_half", label: "0,5 l" },
                { key: "price_liter", label: "1,0 l" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className={fieldLabel}>{label} (€)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-zinc-400 pointer-events-none">€</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={(form as any)[key]}
                      onChange={(e) => set(key, e.target.value)}
                      className={`${inputCls} pl-7`}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

      {/* Image */}
      <div>
        <span className={sectionLabel}>Foto</span>

        {form.image_url ? (
          <div className="relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 aspect-video mb-3">
            <Image src={form.image_url} alt="Vorschau" fill className="object-cover" sizes="480px" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/35 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 bg-white text-zinc-800 text-[12px] font-semibold px-3 py-1.5 rounded-full shadow hover:bg-zinc-50 transition"
              >
                <ImagePlus size={13} /> Ersetzen
              </button>
              <button
                type="button"
                onClick={() => set("image_url", "")}
                className="flex items-center gap-1.5 bg-red-500 text-white text-[12px] font-semibold px-3 py-1.5 rounded-full shadow hover:bg-red-600 transition"
              >
                <Trash2 size={13} /> Entfernen
              </button>
            </div>
            <button
              type="button"
              onClick={() => set("image_url", "")}
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white sm:hidden"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all aspect-video mb-3 ${
              dragOver
                ? "border-gold bg-gold/8"
                : "border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/40 hover:border-gold/50 hover:bg-gold/4"
            }`}
          >
            {uploadState === "uploading" ? (
              <>
                <Loader2 size={26} className="text-gold animate-spin" />
                <p className="text-[12px] text-muted-light dark:text-muted-dark">Wird hochgeladen…</p>
              </>
            ) : (
              <>
                <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center">
                  <ImagePlus size={20} className="text-gold" strokeWidth={1.8} />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">Foto hochladen</p>
                  <p className="text-[11.5px] text-muted-light dark:text-muted-dark mt-0.5">Tippen oder hierher ziehen</p>
                  <p className="text-[10.5px] text-zinc-400 dark:text-zinc-600 mt-1">JPG, PNG, WebP · max. 5 MB</p>
                </div>
              </>
            )}
          </div>
        )}

        {uploadError && (
          <p className="text-[12px] text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-800/40 px-3.5 py-2 rounded-xl mb-3">
            {uploadError}
          </p>
        )}

        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleFileChange} />

        <div>
          <label className="text-[10.5px] text-zinc-400 dark:text-zinc-500 mb-1.5 block">Oder Bild-URL direkt eingeben</label>
          <input
            value={form.image_url}
            onChange={(e) => { set("image_url", e.target.value); setUploadError(""); }}
            className={inputCls}
            placeholder="https://…"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

      {/* Flags / toggles */}
      <div>
        <span className={sectionLabel}>Eigenschaften</span>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { key: "is_available",    label: "Verfügbar",      color: "bg-emerald-500" },
            { key: "is_vegetarian",   label: "Vegetarisch",    color: "bg-pine" },
            { key: "is_vegan",        label: "Vegan",          color: "bg-pine" },
            { key: "is_daily_special",label: "Tagesangebot",   color: "bg-gold" },
            { key: "is_bio",          label: "BIO-zertifiziert", color: "bg-pine" },
          ].map(({ key, label, color }) => {
            const active = (form as any)[key] as boolean;
            return (
              <button
                key={key}
                type="button"
                onClick={() => set(key, !active)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all text-left ${
                  active
                    ? "border-gold/40 bg-gold/7 dark:bg-gold/10"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                <div className={`relative w-8 h-5 rounded-full flex-shrink-0 transition-colors ${active ? color : "bg-zinc-200 dark:bg-zinc-600"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${active ? "translate-x-3.5" : "translate-x-0.5"}`} />
                </div>
                <span className={`text-[12px] font-medium ${active ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-500 dark:text-zinc-400"}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wine details */}
      {isWine && (
        <>
          <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
          <div>
            <span className={sectionLabel}>🍷 Wein-Details</span>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "wine_producer", label: "Weingut / Kellerei" },
                  { key: "wine_region",   label: "Region" },
                  { key: "wine_doc",      label: "DOC / IGT" },
                  { key: "wine_style",    label: "Stil" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className={fieldLabel}>{label}</label>
                    <input
                      value={(form as any)[key]}
                      onChange={(e) => set(key, e.target.value)}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className={fieldLabel}>Traubensorten <span className="text-zinc-400 font-normal">(kommagetrennt)</span></label>
                <input
                  value={form.wine_grapes}
                  onChange={(e) => set("wine_grapes", e.target.value)}
                  className={inputCls}
                  placeholder="Lagrein, Merlot"
                />
              </div>
              <div>
                <label className={fieldLabel}>Verkostungsnotiz 🇩🇪</label>
                <textarea
                  value={form.tasting_notes_de}
                  onChange={(e) => set("tasting_notes_de", e.target.value)}
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className={fieldLabel}>Verkostungsnotiz 🇮🇹</label>
                <textarea
                  value={form.tasting_notes_it}
                  onChange={(e) => set("tasting_notes_it", e.target.value)}
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Divider */}
      <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

      {/* Allergens */}
      <div>
        <span className={sectionLabel}>Allergene <span className="normal-case tracking-normal font-normal text-zinc-400">(EU-VO 1169/2011)</span></span>
        <AllergenSelector selected={selectedAllergens} onChange={setSelectedAllergens} />
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-[13px] text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
        >
          <X size={14} />
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={loading || uploadState === "uploading"}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-white text-[13px] font-semibold hover:bg-gold-dark transition shadow-md shadow-gold/20 disabled:opacity-55"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {loading ? "Speichern…" : "Speichern"}
        </button>
      </div>
    </form>
  );
}
