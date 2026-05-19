"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ItemForm } from "@/components/admin/ItemForm";
import { formatPrice } from "@/lib/utils";
import { PlusCircle, Edit2, Trash2, X, Search, ToggleLeft, ToggleRight } from "lucide-react";
import type { Category, MenuItemWithAllergens } from "@/types";

export function ItemsClient({
  categories,
  initialItems,
}: {
  categories: Category[];
  initialItems: MenuItemWithAllergens[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [editItem, setEditItem] = useState<MenuItemWithAllergens | null>(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = items.filter((item) => {
    const matchSearch = item.name_de.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || item.category_id === catFilter;
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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-zinc-900 dark:text-zinc-100">Speisen</h1>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-gold text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-gold-dark transition"
        >
          <PlusCircle size={16} /> Neu
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suchen..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-surface-light dark:bg-surface-dark text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-surface-light dark:bg-surface-dark text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          <option value="all">Alle Kategorien</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name_de}</option>
          ))}
        </select>
      </div>

      {/* Items table */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card dark:shadow-card-dark overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-light dark:text-muted-dark text-sm">
            Keine Ergebnisse
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">{item.name_de}</p>
                  <p className="text-xs text-muted-light dark:text-muted-dark">{getCatName(item.category_id)}</p>
                </div>
                <div className="shrink-0 text-right">
                  {item.price != null && (
                    <p className="text-sm font-bold text-gold">{formatPrice(item.price)}</p>
                  )}
                  {item.allergens.length > 0 && (
                    <p className="text-xs text-muted-light dark:text-muted-dark">
                      {item.allergens.map((a) => a.code).join(" ")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleAvailable(item)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      item.is_available
                        ? "text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20"
                        : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                    title={item.is_available ? "Aktiv" : "Inaktiv"}
                  >
                    {item.is_available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                  <button
                    onClick={() => setEditItem(item)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-gold hover:bg-gold/10 transition-colors"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / New modal */}
      {(editItem || showNew) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-bg-light dark:bg-surface-dark rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="font-heading font-bold text-lg text-zinc-900 dark:text-zinc-100">
                {editItem ? "Gericht bearbeiten" : "Neues Gericht"}
              </h2>
              <button
                onClick={() => { setEditItem(null); setShowNew(false); }}
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                <X size={16} />
              </button>
            </div>
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
        </div>
      )}
    </div>
  );
}
