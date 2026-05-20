"use client";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSlug]);

  return (
    <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto scrollbar-hide px-4 py-3">
      {categories.map((cat) => {
        const name = cat[`name_${locale}` as keyof Category] as string;
        const isActive = cat.slug === activeSlug;

        return (
          <button
            key={cat.slug}
            data-slug={cat.slug}
            onClick={() => onSelect(cat.slug)}
            className={`
              relative flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full
              text-[13px] font-semibold whitespace-nowrap transition-colors duration-150
              ${isActive
                ? "text-white"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80"
              }
            `}
          >
            {/* Sliding active pill — shared layout animation */}
            {isActive && (
              <motion.div
                layoutId="cat-active-pill"
                className="absolute inset-0 rounded-full bg-gold shadow-md shadow-gold/30"
                transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.9 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {cat.icon && (
                <span className="text-sm leading-none">{cat.icon}</span>
              )}
              <span>{name}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
