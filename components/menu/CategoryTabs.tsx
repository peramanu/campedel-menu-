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
    const el = scrollRef.current?.querySelector(`[data-slug="${activeSlug}"]`) as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSlug]);

  return (
    <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
      {categories.map((cat) => {
        const name = cat[`name_${locale}` as keyof Category] as string;
        const isActive = cat.slug === activeSlug;
        return (
          <button
            key={cat.slug}
            data-slug={cat.slug}
            onClick={() => onSelect(cat.slug)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 ${
              isActive
                ? "bg-gold text-white shadow-md shadow-gold/25"
                : "bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {cat.icon && <span className="text-sm leading-none">{cat.icon}</span>}
            <span>{name}</span>
          </button>
        );
      })}
    </div>
  );
}
