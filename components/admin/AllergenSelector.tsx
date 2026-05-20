"use client";
import { Check } from "lucide-react";
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
    <div className="grid grid-cols-3 gap-1.5">
      {ALLERGENS.map((a) => {
        const checked = selected.includes(a.id);
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => toggle(a.id)}
            className={`relative flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-center transition-all ${
              checked
                ? "border-gold/60 bg-gold/8 dark:bg-gold/12"
                : "border-zinc-200 dark:border-zinc-700/80 hover:border-gold/30 hover:bg-gold/4"
            }`}
          >
            {checked && (
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-gold flex items-center justify-center">
                <Check size={8} className="text-white" strokeWidth={3} />
              </span>
            )}
            <span className="text-base leading-none">{a.icon}</span>
            <p className={`text-[11px] font-bold leading-none ${checked ? "text-gold-dark dark:text-gold" : "text-zinc-700 dark:text-zinc-300"}`}>
              {a.code}
            </p>
            <p className="text-[9.5px] text-zinc-400 dark:text-zinc-500 leading-tight line-clamp-1">{a.name_de}</p>
          </button>
        );
      })}
    </div>
  );
}
