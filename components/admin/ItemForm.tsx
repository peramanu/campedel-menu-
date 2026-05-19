"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { AllergenSelector } from "./AllergenSelector";
import { X, Save, ImagePlus, Trash2, Loader2 } from "lucide-react";
import type { Category, MenuItem } from "@/types";

type Tab = "de" | "it" | "en";
const WINE_SLUGS = ["schaumwein", "weisswein", "rotwein"];

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
    // reset so same file can be re-selected
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

  const inputCls = "w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-bg-light dark:bg-bg-dark text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition";
  const labelCls = "block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Category */}
      <div>
        <label className={labelCls}>Kategorie</label>
        <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className={inputCls}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name_de}</option>
          ))}
        </select>
      </div>

      {/* Multilingual tabs */}
      <div>
        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 mb-3">
          {(["de", "it", "en"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === t ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        {(["de", "it", "en"] as Tab[]).map((t) => (
          <div key={t} className={`space-y-3 ${tab !== t ? "hidden" : ""}`}>
            <div>
              <label className={labelCls}>Name ({t.toUpperCase()})</label>
              <input value={form[`name_${t}` as keyof typeof form] as string} onChange={(e) => set(`name_${t}`, e.target.value)} className={inputCls} required={t === "de"} />
            </div>
            <div>
              <label className={labelCls}>Beschreibung ({t.toUpperCase()})</label>
              <textarea value={form[`description_${t}` as keyof typeof form] as string} onChange={(e) => set(`description_${t}`, e.target.value)} rows={3} className={inputCls} />
            </div>
          </div>
        ))}
      </div>

      {/* Prices */}
      <div>
        <p className={labelCls}>Preise (€)</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-light dark:text-muted-dark mb-1 block">Preis</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} placeholder="0.00" />
          </div>
          {isWine && (
            <>
              <div>
                <label className="text-xs text-muted-light dark:text-muted-dark mb-1 block">Glas</label>
                <input type="number" step="0.01" min="0" value={form.price_glass} onChange={(e) => set("price_glass", e.target.value)} className={inputCls} placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs text-muted-light dark:text-muted-dark mb-1 block">0,25 l</label>
                <input type="number" step="0.01" min="0" value={form.price_quarter} onChange={(e) => set("price_quarter", e.target.value)} className={inputCls} placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs text-muted-light dark:text-muted-dark mb-1 block">0,5 l</label>
                <input type="number" step="0.01" min="0" value={form.price_half} onChange={(e) => set("price_half", e.target.value)} className={inputCls} placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs text-muted-light dark:text-muted-dark mb-1 block">1,0 l</label>
                <input type="number" step="0.01" min="0" value={form.price_liter} onChange={(e) => set("price_liter", e.target.value)} className={inputCls} placeholder="0.00" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Image upload ────────────────────────────────────────── */}
      <div>
        <label className={labelCls}>Bild</label>

        {/* Preview or drop zone */}
        {form.image_url ? (
          <div className="relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 aspect-video mb-2">
            <Image
              src={form.image_url}
              alt="Vorschau"
              fill
              className="object-cover"
              sizes="480px"
            />
            {/* Overlay buttons */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 bg-white text-zinc-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow hover:bg-zinc-100 transition"
              >
                <ImagePlus size={13} /> Ersetzen
              </button>
              <button
                type="button"
                onClick={() => set("image_url", "")}
                className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow hover:bg-red-600 transition"
              >
                <Trash2 size={13} /> Entfernen
              </button>
            </div>
            {/* Always-visible remove button on mobile */}
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
            className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-colors aspect-video mb-2 ${
              dragOver
                ? "border-gold bg-gold/5"
                : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:border-gold/60 hover:bg-gold/5"
            }`}
          >
            {uploadState === "uploading" ? (
              <>
                <Loader2 size={28} className="text-gold animate-spin" />
                <p className="text-sm text-muted-light dark:text-muted-dark">Wird hochgeladen…</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <ImagePlus size={22} className="text-gold" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Foto hochladen
                  </p>
                  <p className="text-xs text-muted-light dark:text-muted-dark mt-0.5">
                    Tippen oder Bild hierher ziehen
                  </p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-1">
                    JPG, PNG, WebP · max. 5 MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {uploadError && (
          <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg mb-2">
            {uploadError}
          </p>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Optional: manual URL input */}
        <div>
          <label className="text-[11px] text-zinc-400 dark:text-zinc-600 mb-1 block">Oder URL direkt eingeben</label>
          <input
            value={form.image_url}
            onChange={(e) => { set("image_url", e.target.value); setUploadError(""); }}
            className={inputCls}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Flags */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "is_available", label: "Verfügbar" },
          { key: "is_vegetarian", label: "Vegetarisch" },
          { key: "is_vegan", label: "Vegan" },
          { key: "is_daily_special", label: "Tagesangebot" },
          { key: "is_bio", label: "BIO-zertifiziert" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2.5 cursor-pointer">
            <div
              onClick={() => set(key, !(form as any)[key])}
              className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
                (form as any)[key] ? "bg-gold" : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${(form as any)[key] ? "translate-x-5" : "translate-x-1"}`} />
            </div>
            <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
          </label>
        ))}
      </div>

      {/* Wine details */}
      {isWine && (
        <div className="space-y-3 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4">
          <p className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">🍷 Wein-Details</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "wine_producer", label: "Weingut / Kellerei" },
              { key: "wine_region", label: "Region" },
              { key: "wine_doc", label: "DOC / IGT" },
              { key: "wine_style", label: "Stil" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <input value={(form as any)[key]} onChange={(e) => set(key, e.target.value)} className={inputCls} />
              </div>
            ))}
          </div>
          <div>
            <label className={labelCls}>Traubensorten (kommagetrennt)</label>
            <input value={form.wine_grapes} onChange={(e) => set("wine_grapes", e.target.value)} className={inputCls} placeholder="Lagrein, Merlot" />
          </div>
          <div>
            <label className={labelCls}>Verkostungsnotiz (DE)</label>
            <textarea value={form.tasting_notes_de} onChange={(e) => set("tasting_notes_de", e.target.value)} rows={2} className={inputCls} />
          </div>
        </div>
      )}

      {/* Allergens */}
      <div>
        <p className={`${labelCls} mb-2`}>Allergene (EU-Verordnung 1169/2011)</p>
        <AllergenSelector selected={selectedAllergens} onChange={setSelectedAllergens} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
          <X size={16} /> Abbrechen
        </button>
        <button type="submit" disabled={loading || uploadState === "uploading"} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-white font-semibold hover:bg-gold-dark transition disabled:opacity-60">
          <Save size={16} /> {loading ? "Speichern..." : "Speichern"}
        </button>
      </div>
    </form>
  );
}
