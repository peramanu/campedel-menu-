"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ItemForm } from "@/components/admin/ItemForm";
import { formatPrice } from "@/lib/utils";
import { PlusCircle, Edit2, Trash2, X, Search, ToggleLeft, ToggleRight, UtensilsCrossed } from "lucide-react";
import type { Category, MenuItemWithAllergens } from "@/types";

export function ItemsClient({
  categories,
  initialItems,
}: {
  categories: Category[];
  initialItems: MenuItemWithAllergens[];
}) {
  const router = useRouter();
  const [items, setItems]       = useState(initialItems);
  const [search, setSearch]     = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [editItem, setEditItem] = useState<MenuItemWithAllergens | null>(null);
  const [showNew, setShowNew]   = useState(false);

  const filtered = items.filter((item) => {
    const matchSearch = item.name_de.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === "all" || item.category_id === catFilter;
    return matchSearch && matchCat;
  });

  async function toggleAvailable(item: MenuItemWithAllergens) {
    await supabase.from("menu_items").update({ is_available: !item.is_available }).eq("id", item.id);
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_available: !i.is_available } : i));
  }

  async function deleteItem(id: string) {
    if (!confirm("Gericht wirklich löschen?")) return;
    await supabase.from("menu_items").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function refresh() {
    setEditItem(null);
    setShowNew(false);
    router.refresh();
  }

  const getCatName = (catId: string | null) =>
    categories.find((c) => c.id === catId)?.name_de ?? "";

  const modalOpen = editItem !== null || showNew;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-[26px] text-zinc-900 dark:text-zinc-100 leading-none mb-1">
            Speisen
          </h1>
          <p className="text-[13px] text-muted-light dark:text-muted-dark">
            {items.length} Einträge · {items.filter(i => i.is_available).length} aktiv
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-gold text-white px-4 py-2.5 rounded-xl font-semibold text-[13px] hover:bg-gold-dark transition-colors shadow-md shadow-gold/20"
        >
          <PlusCircle size={15} strokeWidth={2} />
          Neu
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" strokeWidth={2} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Gericht suchen…"
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-surface-light dark:bg-surface-dark text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-surface-light dark:bg-surface-dark text-[13px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition"
        >
          <option value="all">Alle Kategorien</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name_de}</option>
          ))}
        </select>
      </div>

      {/* Items list */}
      <div className="card-surface rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <UtensilsCrossed size={20} className="text-zinc-400" strokeWidth={1.5} />
            </div>
            <p className="text-[13px] text-muted-light dark:text-muted-dark font-heading italic">
              {search || catFilter !== "all" ? "Keine Treffer für diese Suche" : "Noch keine Gerichte angelegt"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100/80 dark:divide-zinc-800/60">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
              >
                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 truncate leading-snug">
                    {item.name_de}
                  </p>
                  <p className="text-[11.5px] text-muted-light dark:text-muted-dark mt-0.5">
                    {getCatName(item.category_id)}
                  </p>
                </div>

                {/* Price + allergens */}
                <div className="shrink-0 text-right hidden sm:block">
                  {item.price != null && (
                    <p className="text-[13px] font-bold text-gold-dark dark:text-gold font-heading">
                      {formatPrice(item.price)}
                    </p>
                  )}
                  {item.allergens.length > 0 && (
                    <p className="text-[10.5px] text-zinc-400 dark:text-zinc-600 mt-0.5 tracking-wide">
                      {item.allergens.slice(0, 6).map((a) => a.code).join(" ")}
                      {item.allergens.length > 6 && " …"}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleAvailable(item)}
                    title={item.is_available ? "Aktiv – klicken zum Deaktivieren" : "Inaktiv – klicken zum Aktivieren"}
                    className={`p-2 rounded-lg transition-colors ${
                      item.is_available
                        ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                        : "text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {item.is_available
                      ? <ToggleRight size={18} strokeWidth={1.8} />
                      : <ToggleLeft size={18} strokeWidth={1.8} />}
                  </button>
                  <button
                    onClick={() => setEditItem(item)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-gold hover:bg-gold/10 transition-colors"
                    title="Bearbeiten"
                  >
                    <Edit2 size={14} strokeWidth={1.8} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    title="Löschen"
                  >
                    <Trash2 size={14} strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / New modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm p-0 sm:p-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setEditItem(null); setShowNew(false); }}}
          >
            <motion.div
              key="modal"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full sm:max-w-lg bg-bg-light dark:bg-surface-dark sm:rounded-3xl shadow-2xl max-h-[92dvh] sm:max-h-[88dvh] overflow-hidden flex flex-col"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200/70 dark:border-zinc-800/70 shrink-0">
                <div>
                  <h2 className="font-heading font-bold text-[18px] text-zinc-900 dark:text-zinc-100">
                    {editItem ? "Gericht bearbeiten" : "Neues Gericht"}
                  </h2>
                  {editItem && (
                    <p className="text-[12px] text-muted-light dark:text-muted-dark mt-0.5 italic">
                      {editItem.name_de}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => { setEditItem(null); setShowNew(false); }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              {/* Gold accent line */}
              <div className="h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent shrink-0" />

              {/* Modal body */}
              <div className="overflow-y-auto overscroll-contain flex-1">
                <div className="p-5">
                  <ItemForm
                    item={editItem ?? undefined}
                    categories={categories}
                    allergenIds={editItem?.allergens.map((a) => a.id)}
                    onSave={refresh}
                    onCancel={() => { setEditItem(null); setShowNew(false); }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
