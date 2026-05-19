"use client";
import { useState } from "react";
import type { Allergen } from "@/types";
import type { Locale } from "@/types";

export function AllergenBadge({
  allergen,
  locale,
}: {
  allergen: Allergen;
  locale: Locale;
}) {
  const [show, setShow] = useState(false);
  const name = allergen[`name_${locale}`] ?? allergen.name_de;

  return (
    <div className="relative inline-flex">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onClick={() => setShow((s) => !s)}
        className="flex items-center justify-center w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-gold/20 hover:text-gold transition-colors"
        aria-label={name}
      >
        {allergen.icon || allergen.code}
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none shadow-lg">
          <span className="font-semibold">{allergen.code}</span> – {name}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
        </div>
      )}
    </div>
  );
}
