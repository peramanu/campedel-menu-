"use client";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types";

function SortableRow({ cat, onToggle }: { cat: Category; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: cat.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${
        isDragging
          ? "opacity-50 bg-gold/5 dark:bg-gold/8 z-50"
          : "hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30"
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-zinc-300 dark:text-zinc-600 hover:text-zinc-400 dark:hover:text-zinc-500 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
        tabIndex={-1}
      >
        <GripVertical size={16} strokeWidth={1.8} />
      </button>

      {/* Icon */}
      <span className="text-[22px] leading-none w-7 flex-shrink-0">{cat.icon}</span>

      {/* Names */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug truncate">
          {cat.name_de}
        </p>
        <p className="text-[11.5px] text-muted-light dark:text-muted-dark mt-0.5 truncate">
          {[cat.name_it, cat.name_en].filter(Boolean).join(" · ")}
        </p>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        title={cat.is_active ? "Aktiv – klicken zum Deaktivieren" : "Inaktiv – klicken zum Aktivieren"}
        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
          cat.is_active
            ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
            : "text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        }`}
      >
        {cat.is_active
          ? <ToggleRight size={20} strokeWidth={1.8} />
          : <ToggleLeft size={20} strokeWidth={1.8} />}
      </button>
    </div>
  );
}

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [cats, setCats] = useState(initialCategories);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cats.findIndex((c) => c.id === active.id);
    const newIndex = cats.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(cats, oldIndex, newIndex).map((c, i) => ({
      ...c,
      sort_order: i + 1,
    }));
    setCats(reordered);

    setSaving(true);
    await Promise.all(
      reordered.map((c) =>
        supabase.from("categories").update({ sort_order: c.sort_order }).eq("id", c.id)
      )
    );
    setSaving(false);
  }

  async function toggleActive(id: string) {
    const cat = cats.find((c) => c.id === id)!;
    await supabase.from("categories").update({ is_active: !cat.is_active }).eq("id", id);
    setCats((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !c.is_active } : c));
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-[26px] text-zinc-900 dark:text-zinc-100 leading-none mb-1">
            Kategorien
          </h1>
          <p className="text-[13px] text-muted-light dark:text-muted-dark">
            {cats.length} Kategorien · {cats.filter(c => c.is_active).length} aktiv
          </p>
        </div>
        {saving && (
          <div className="flex items-center gap-1.5 text-[12px] text-muted-light dark:text-muted-dark">
            <Loader2 size={13} className="animate-spin text-gold" />
            Speichern…
          </div>
        )}
      </div>

      {/* Hint */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/40">
        <GripVertical size={13} className="text-zinc-400 flex-shrink-0" strokeWidth={1.8} />
        <p className="text-[12px] text-muted-light dark:text-muted-dark">
          Reihenfolge per Drag & Drop anpassen · Toggle zum Aktivieren oder Deaktivieren
        </p>
      </div>

      {/* Category list */}
      <div className="card-surface rounded-2xl overflow-hidden">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={cats.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="divide-y divide-zinc-100/80 dark:divide-zinc-800/60">
              {cats.map((cat) => (
                <SortableRow key={cat.id} cat={cat} onToggle={() => toggleActive(cat.id)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

    </div>
  );
}
