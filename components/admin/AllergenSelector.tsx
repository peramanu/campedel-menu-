"use client";
import { ALLERGENS } from "@/lib/allergens";

export function AllergenSelector({
  selected,
  onChange,
}: {
  selected: number[];
  onChange: (ids: number[]) => void;
}) {
  function toggle(id: number) {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {ALLERGENS.map((a) => {
        const checked = selected.includes(a.id);
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => toggle(a.id)}
            className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left transition-all ${
              checked
                ? "border-pine bg-pine/10 dark:bg-pine/20"
                : "border-zinc-200 dark:border-zinc-700 hover:border-gold/40"
            }`}
          >
            <span className="text-lg leading-none">{a.icon}</span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{a.code}</p>
              <p className="text-xs text-muted-light dark:text-muted-dark truncate">{a.name_de}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
