"use client";
import { useState } from "react";
import type { Allergen, Locale } from "@/types";

export function AllergenBadge({ allergen, locale }: { allergen: Allergen; locale: Locale }) {
  const [show, setShow] = useState(false);
  const name = (allergen[`name_${locale}` as keyof Allergen] as string) ?? allergen.name_de;

  return (
    <div className="relative inline-flex">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onClick={() => setShow((s) => !s)}
        className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[12px] font-bold text-zinc-500 dark:text-zinc-400 hover:bg-gold/15 hover:text-gold transition-all duration-150 select-none flex items-center justify-center"
        aria-label={name}
      >
        {allergen.icon ?? allergen.code}
      </button>

      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] rounded-xl whitespace-nowrap z-50 pointer-events-none shadow-xl">
          <span className="font-bold">{allergen.code}</span>
          <span className="mx-1 opacity-40">·</span>
          {name}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
        </div>
      )}
    </div>
  );
}
