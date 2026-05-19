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
        { rootMargin: "-38% 0px -58% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  function scrollToCategory(slug: string) {
    setActiveSlug(slug);
    sectionRefs.current[slug]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToMenu() {
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const todaysSpecials = dailySpecials.filter(
    (ds) => ds.special_date === new Date().toISOString().split("T")[0]
  );

  const activeCats = categories.filter((c) => c.is_active);

  return (
    <div className="relative">
      {/* Hero */}
      <MenuHero onScrollDown={scrollToMenu} />

      {/* Daily special banner */}
      <AnimatePresence>
        {todaysSpecials.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-light text-white">
              <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
                <span className="text-xl">✨</span>
                <div>
                  <p className="font-semibold text-[13px] uppercase tracking-wide opacity-90">
                    Tagesangebot
                  </p>
                  <p className="text-sm font-medium">
                    {todaysSpecials.map((ds) => {
                      const item = items.find((i) => i.id === ds.item_id);
                      return item ? (item[`name_${locale}` as keyof typeof item] as string ?? item.name_de) : "";
                    }).filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky category tabs */}
      <div
        ref={tabsRef}
        className="sticky top-14 z-30 bg-bg-light/92 dark:bg-bg-dark/92 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60"
      >
        <CategoryTabs
          categories={activeCats}
          activeSlug={activeSlug}
          locale={locale}
          onSelect={scrollToCategory}
        />
      </div>

      {/* Menu content */}
      <div className="max-w-2xl mx-auto px-4 pb-32">
        {activeCats.map((cat) => {
          const catItems = filteredItems(cat.slug);
          const isWine = WINE_SLUGS.includes(cat.slug);
          const name = cat[`name_${locale}` as keyof typeof cat] as string;

          return (
            <section
              key={cat.slug}
              id={`section-${cat.slug}`}
              ref={(el) => { sectionRefs.current[cat.slug] = el; }}
              className="menu-section pt-10"
            >
              {/* Section heading */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{cat.icon}</span>
                <h2 className="font-heading font-bold text-[22px] text-zinc-900 dark:text-zinc-100">
                  {name}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-zinc-200 dark:from-zinc-700 to-transparent" />
              </div>

              {catItems.length === 0 ? (
                <p className="text-muted-light dark:text-muted-dark text-sm py-10 text-center">
                  Derzeit nicht verfügbar
                </p>
              ) : (
                <div className="grid gap-3">
                  {catItems.map((item, i) => {
                    const special = specialMap.get(item.id);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, delay: i * 0.04 }}
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
        <div className="mt-14 pt-6 border-t border-zinc-200/70 dark:border-zinc-800/70">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <p className="text-xs text-muted-light dark:text-muted-dark leading-relaxed">
              Allergenkennzeichnung gemäß EU-Verordnung Nr. 1169/2011.
              Bei Fragen zu Allergenen und Unverträglichkeiten wenden Sie sich bitte an unser Personal.
            </p>
          </div>
        </div>
      </div>

      {/* Allergen FAB */}
      <AllergenFilter
        active={excludedAllergens}
        onChange={setExcludedAllergens}
        locale={locale}
      />
    </div>
  );
}
