"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { GripVertical, ToggleLeft, ToggleRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types";

function SortableRow({ cat, onToggle }: { cat: Category; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: cat.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${isDragging ? "opacity-50 bg-zinc-100 dark:bg-zinc-800 rounded-xl z-50" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>
      <span className="text-xl w-7">{cat.icon}</span>
      <div className="flex-1">
        <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{cat.name_de}</p>
        <p className="text-xs text-muted-light dark:text-muted-dark">{cat.name_it} · {cat.name_en}</p>
      </div>
      <button
        onClick={onToggle}
        className={`transition-colors ${cat.is_active ? "text-green-500 hover:text-red-400" : "text-zinc-400 hover:text-green-500"}`}
        title={cat.is_active ? "Aktiv – klicken zum Deaktivieren" : "Inaktiv – klicken zum Aktivieren"}
      >
        {cat.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
      </button>
    </div>
  );
}

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-zinc-900 dark:text-zinc-100">Kategorien</h1>
        {saving && <span className="text-xs text-muted-light dark:text-muted-dark">Speichern...</span>}
      </div>
      <p className="text-sm text-muted-light dark:text-muted-dark">
        Reihenfolge per Drag & Drop ändern · Toggle zum Aktivieren/Deaktivieren
      </p>

      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card dark:shadow-card-dark overflow-hidden">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={cats.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
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
