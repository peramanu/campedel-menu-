"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryTabs } from "./CategoryTabs";
import { MenuCard } from "./MenuCard";
import { WineCard } from "./WineCard";
import { AllergenFilter } from "./AllergenFilter";
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

  const specialMap = new Map(dailySpecials.map((ds) => [ds.item_id, ds]));

  const filteredItems = useCallback(
    (catSlug: string) => {
      return items
        .filter((i) => {
          const cat = categories.find((c) => c.id === i.category_id);
          if (cat?.slug !== catSlug) return false;
          if (!i.is_available) return false;
          if (excludedAllergens.length === 0) return true;
          const allergenIds = i.allergens.map((a) => a.id);
          return !excludedAllergens.some((id) => allergenIds.includes(id));
        })
        .sort((a, b) => a.sort_order - b.sort_order);
    },
    [items, categories, excludedAllergens]
  );

  // IntersectionObserver: update active tab on scroll
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    categories.forEach((cat) => {
      const el = sectionRefs.current[cat.slug];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSlug(cat.slug); },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
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

  const todaysSpecials = dailySpecials.filter(
    (ds) => ds.special_date === new Date().toISOString().split("T")[0]
  );

  return (
    <div className="relative">
      {/* Daily specials banner */}
      <AnimatePresence>
        {todaysSpecials.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-gold to-gold-dark text-white overflow-hidden"
          >
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
              <span className="text-lg">✨</span>
              <div>
                <p className="font-bold text-sm">Tagesangebote</p>
                <p className="text-xs opacity-90">
                  {todaysSpecials.map((ds) => {
                    const item = items.find((i) => i.id === ds.item_id);
                    return item ? (item[`name_${locale}`] ?? item.name_de) : "";
                  }).filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky category tabs */}
      <div className="sticky top-[57px] z-30 bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-md border-b border-zinc-200/60 dark:border-zinc-800/60">
        <CategoryTabs
          categories={categories.filter((c) => c.is_active)}
          activeSlug={activeSlug}
          locale={locale}
          onSelect={scrollToCategory}
        />
      </div>

      {/* Menu sections */}
      <div className="max-w-2xl mx-auto px-4 pb-32">
        {categories.filter((c) => c.is_active).map((cat) => {
          const catItems = filteredItems(cat.slug);
          const isWine = WINE_SLUGS.includes(cat.slug);
          const name = cat[`name_${locale}`];

          return (
            <section
              key={cat.slug}
              id={`section-${cat.slug}`}
              ref={(el) => { sectionRefs.current[cat.slug] = el; }}
              className="menu-section pt-8"
            >
              <h2 className="font-heading font-bold text-2xl text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                {cat.icon && <span>{cat.icon}</span>}
                {name}
              </h2>

              {catItems.length === 0 ? (
                <p className="text-muted-light dark:text-muted-dark text-sm py-8 text-center">
                  Keine Gerichte verfügbar
                </p>
              ) : (
                <div className="grid gap-4">
                  {catItems.map((item) => {
                    const special = specialMap.get(item.id);
                    return isWine ? (
                      <WineCard key={item.id} item={item} locale={locale} />
                    ) : (
                      <MenuCard
                        key={item.id}
                        item={item}
                        locale={locale}
                        categorySlug={cat.slug}
                        specialPrice={special?.special_price}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}

        {/* Allergen legal notice */}
        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-muted-light dark:text-muted-dark text-center leading-relaxed">
            Allergenkennzeichnung gemäß EU-Verordnung Nr. 1169/2011.
            Bei Fragen zu Allergenen und Unverträglichkeiten wenden Sie sich bitte an unser Personal.
          </p>
        </div>
      </div>

      {/* Allergen filter FAB */}
      <AllergenFilter
        active={excludedAllergens}
        onChange={setExcludedAllergens}
        locale={locale}
      />
    </div>
  );
}
