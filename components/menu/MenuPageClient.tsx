"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryTabs } from "./CategoryTabs";
import { MenuCard } from "./MenuCard";
import { WineCard } from "./WineCard";
import { AllergenFilter } from "./AllergenFilter";
import { MenuHero } from "./MenuHero";
import type { Category, MenuItemWithAllergens, DailySpecial, Locale } from "@/types";

const WINE_SLUGS = ["schaumwein", "weisswein", "rotwein"];

export function MenuPageClient({
  categories,
  items,
  dailySpecials,
  locale,
}: {
  categories: Category[];
  items: MenuItemWithAllergens[];
  dailySpecials: DailySpecial[];
  locale: Locale;
}) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");
  const [excludedAllergens, setExcludedAllergens] = useState<number[]>([]);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().split("T")[0];

  const specialMap = new Map(dailySpecials.map((ds) => [ds.item_id, ds]));

  const filteredItems = useCallback(
    (catSlug: string) =>
      items
        .filter((i) => {
          const cat = categories.find((c) => c.id === i.category_id);
          if (cat?.slug !== catSlug) return false;
          if (!i.is_available) return false;
          if (!excludedAllergens.length) return true;
          return !excludedAllergens.some((id) => i.allergens.map((a) => a.id).includes(id));
        })
        .sort((a, b) => a.sort_order - b.sort_order),
    [items, categories, excludedAllergens]
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    categories.forEach((cat) => {
      const el = sectionRefs.current[cat.slug];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSlug(cat.slug); },
        { rootMargin: "-35% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  function scrollToCategory(slug: string) {
    setActiveSlug(slug);
    // small delay so the sticky tab bar doesn't interfere
    setTimeout(() => {
      sectionRefs.current[slug]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  const activeCats = categories.filter((c) => c.is_active);
  const todaysSpecials = dailySpecials.filter((ds) => ds.special_date === today);

  return (
    <div className="relative min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <MenuHero locale={locale} onScrollDown={() => tabsRef.current?.scrollIntoView({ behavior: "smooth" })} />

      {/* ── Daily specials banner ─────────────────────────────── */}
      <AnimatePresence>
        {todaysSpecials.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-light">
              <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
                <span className="text-xl shrink-0">✨</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                    Tagesangebot
                  </p>
                  <p className="text-sm font-semibold text-white truncate">
                    {todaysSpecials.map((ds) => {
                      const item = items.find((i) => i.id === ds.item_id);
                      return item
                        ? ((item[`name_${locale}` as keyof typeof item] as string) ?? item.name_de)
                        : "";
                    }).filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky category tabs ──────────────────────────────── */}
      <div
        ref={tabsRef}
        className="sticky top-14 z-30 bg-bg-light/95 dark:bg-bg-dark/95 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50"
      >
        <CategoryTabs
          categories={activeCats}
          activeSlug={activeSlug}
          locale={locale}
          onSelect={scrollToCategory}
        />
      </div>

      {/* ── Menu sections ─────────────────────────────────────── */}
      {/* extra pb for FAB + safe area */}
      <div className="max-w-2xl mx-auto px-3 sm:px-5 pb-36">
        {activeCats.map((cat) => {
          const catItems = filteredItems(cat.slug);
          const isWine = WINE_SLUGS.includes(cat.slug);
          const name = (cat[`name_${locale}` as keyof typeof cat] as string);

          return (
            <section
              key={cat.slug}
              id={`section-${cat.slug}`}
              ref={(el) => { sectionRefs.current[cat.slug] = el; }}
              className="menu-section pt-8 sm:pt-10"
            >
              {/* Section heading */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-xl leading-none">{cat.icon}</span>
                <h2 className="font-heading font-bold text-xl sm:text-[22px] text-zinc-900 dark:text-zinc-100 leading-tight">
                  {name}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-zinc-200/80 dark:from-zinc-700/60 to-transparent ml-1" />
              </div>

              {catItems.length === 0 ? (
                <p className="text-muted-light dark:text-muted-dark text-sm py-8 text-center italic">
                  Derzeit nicht verfügbar
                </p>
              ) : (
                <div className="grid gap-3">
                  {catItems.map((item, i) => {
                    const special = specialMap.get(item.id);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(i * 0.05, 0.3) }}
                      >
                        {isWine ? (
                          <WineCard item={item} locale={locale} />
                        ) : (
                          <MenuCard
                            item={item}
                            locale={locale}
                            categorySlug={cat.slug}
                            specialPrice={special?.special_price}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}

        {/* Legal allergen notice */}
        <div className="mt-12 pt-5 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex gap-2.5">
            <span className="text-lg mt-0.5 shrink-0">⚠️</span>
            <p className="text-[11px] text-muted-light dark:text-muted-dark leading-relaxed">
              Allergenkennzeichnung gemäß EU-Verordnung Nr. 1169/2011.
              Bei Fragen zu Allergenen wenden Sie sich bitte an unser Personal.
            </p>
          </div>
        </div>
      </div>

      {/* ── Allergen FAB ──────────────────────────────────────── */}
      <AllergenFilter
        active={excludedAllergens}
        onChange={setExcludedAllergens}
        locale={locale}
      />
    </div>
  );
}
