"use client";
import { useRef, useEffect } from "react";
import type { Category, Locale } from "@/types";

export function CategoryTabs({
  categories,
  activeSlug,
  locale,
  onSelect,
}: {
  categories: Category[];
  activeSlug: string;
  locale: Locale;
  onSelect: (slug: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current?.querySelector(`[data-slug="${activeSlug}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSlug]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2"
    >
      {categories.map((cat) => {
        const name = cat[`name_${locale}`];
        const isActive = cat.slug === activeSlug;
        return (
          <button
            key={cat.slug}
            data-slug={cat.slug}
            onClick={() => onSelect(cat.slug)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              isActive
                ? "bg-gold text-white border-gold shadow-sm"
                : "bg-transparent border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-gold/50 hover:text-gold"
            }`}
          >
            {cat.icon && <span className="text-base leading-none">{cat.icon}</span>}
            <span>{name}</span>
          </button>
        );
      })}
    </div>
  );
}
