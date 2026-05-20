"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryTabs } from "./CategoryTabs";
import { MenuCard } from "./MenuCard";
import { WineCard } from "./WineCard";
import { AllergenFilter } from "./AllergenFilter";
import { MenuHero } from "./MenuHero";
import { ItemDetailModal } from "./ItemDetailModal";
import { PhotoStrip } from "./PhotoStrip";
import { supabase } from "@/lib/supabase";
import { getLocalizedField } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Lock, X, LogIn, Search, ChevronUp } from "lucide-react";
import type { Category, MenuItemWithAllergens, DailySpecial, Locale } from "@/types";

const WINE_SLUGS = ["schaumwein", "weisswein", "rotwein"];
const ADMIN_EMAIL = "admin@campedel.com";

type SelectedItem = { item: MenuItemWithAllergens; categorySlug: string; specialPrice?: number | null } | null;

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
  const router = useRouter();
  const t = useTranslations("menu");
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");
  const [excludedAllergens, setExcludedAllergens] = useState<number[]>([]);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Detail modal
  const [selected, setSelected] = useState<SelectedItem>(null);

  // Back to top
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Admin modal
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPw, setAdminPw] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const pwInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adminOpen) {
      setAdminPw("");
      setAdminError("");
      setTimeout(() => pwInputRef.current?.focus(), 80);
    }
  }, [adminOpen]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 80);
    else setSearch("");
  }, [searchOpen]);

  useEffect(() => {
    function onScroll() { setShowBackToTop(window.scrollY > 500); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleAdminLogin(e?: React.FormEvent) {
    e?.preventDefault();
    if (!adminPw) return;
    setAdminLoading(true);
    setAdminError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: adminPw,
    });
    if (error) {
      setAdminError("Falsches Passwort.");
      setAdminLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  }

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

  const searchResults = useCallback(() => {
    const term = search.trim().toLowerCase();
    if (!term) return [];
    return items
      .filter((i) => {
        if (!i.is_available) return false;
        if (excludedAllergens.length && excludedAllergens.some((id) => i.allergens.map((a) => a.id).includes(id))) return false;
        const name = getLocalizedField(i, "name", locale).toLowerCase();
        const desc = getLocalizedField(i, "description", locale).toLowerCase();
        return name.includes(term) || desc.includes(term);
      })
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [search, items, excludedAllergens, locale]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    if (searchOpen) return;
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
  }, [categories, searchOpen]);

  function scrollToCategory(slug: string) {
    setActiveSlug(slug);
    setSearchOpen(false);
    setTimeout(() => {
      sectionRefs.current[slug]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  const activeCats = categories.filter((c) => c.is_active);
  const todaysSpecials = dailySpecials.filter((ds) => ds.special_date === today);
  const results = searchResults();
  const isSearching = searchOpen && search.trim().length > 0;

  function renderItemCard(item: MenuItemWithAllergens, catSlug: string) {
    const cat = categories.find((c) => c.id === item.category_id);
    const slug = cat?.slug ?? catSlug;
    const isWine = WINE_SLUGS.includes(slug);
    const special = specialMap.get(item.id);
    return isWine ? (
      <WineCard
        item={item}
        locale={locale}
        categorySlug={slug}
        compact
        onClick={() => setSelected({ item, categorySlug: slug, specialPrice: special?.special_price })}
      />
    ) : (
      <div
        className="cursor-pointer active:scale-[0.98] transition-transform w-full"
        onClick={() => setSelected({ item, categorySlug: slug, specialPrice: special?.special_price })}
      >
        <MenuCard
          item={item}
          locale={locale}
          categorySlug={slug}
          specialPrice={special?.special_price}
          compact
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">

      <MenuHero locale={locale} onScrollDown={() => tabsRef.current?.scrollIntoView({ behavior: "smooth" })} />

      {/* Daily specials banner */}
      <AnimatePresence>
        {todaysSpecials.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-light">
              <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-center gap-3">
                <span className="text-sm shrink-0 leading-none text-white/70">✦</span>
                <div className="text-center min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/70 mb-0.5">Tagesangebot</p>
                  <p className="text-[13px] font-semibold text-white font-heading truncate">
                    {todaysSpecials.map((ds) => {
                      const item = items.find((i) => i.id === ds.item_id);
                      return item ? ((item[`name_${locale}` as keyof typeof item] as string) ?? item.name_de) : "";
                    }).filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className="text-sm shrink-0 leading-none text-white/70">✦</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky: category tabs + search */}
      <div
        ref={tabsRef}
        className="sticky top-[65px] z-30 bg-bg-light/95 dark:bg-bg-dark/95 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50"
      >
        <AnimatePresence mode="wait" initial={false}>
          {searchOpen ? (
            <motion.div
              key="searchbar"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 px-4 py-2.5"
            >
              <Search size={15} className="text-gold shrink-0" strokeWidth={2} />
              <input
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="flex-1 bg-transparent text-[14px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Suche schließen"
              >
                <X size={14} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="tabs"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-1 pr-2"
            >
              <div className="flex-1 min-w-0">
                <CategoryTabs
                  categories={activeCats}
                  activeSlug={activeSlug}
                  locale={locale}
                  onSelect={scrollToCategory}
                />
              </div>
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 hover:text-gold dark:hover:text-gold hover:bg-gold/8 transition-colors shrink-0"
                aria-label="Suche öffnen"
              >
                <Search size={15} strokeWidth={2} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menu sections or search results */}
      <div className="max-w-2xl mx-auto px-3 sm:px-5 pb-36">

        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="search-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.22 }}
              className="pt-6"
            >
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <span className="text-4xl opacity-30">🔍</span>
                  <p className="text-[14px] text-muted-light dark:text-muted-dark text-center">
                    {t("noResults")} „{search}"
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-light dark:text-muted-dark mb-4">
                    {results.length} {results.length === 1 ? "Ergebnis" : "Ergebnisse"}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {results.map((item) => {
                      const cat = categories.find((c) => c.id === item.category_id);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.28 }}
                          className="flex flex-col"
                        >
                          {cat && (
                            <span className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-gold mb-1.5 px-0.5">
                              {cat.icon} {cat[`name_${locale}` as keyof typeof cat] as string}
                            </span>
                          )}
                          {renderItemCard(item, cat?.slug ?? "")}
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="sections"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
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
                    <motion.div
                      className="flex items-center gap-3 mb-6"
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <span className="text-[22px] leading-none opacity-90">{cat.icon}</span>
                      <h2 className="font-heading font-bold text-[22px] sm:text-[24px] text-zinc-900 dark:text-zinc-100 leading-none tracking-tight">
                        {name}
                      </h2>
                      <div className="section-rule" />
                    </motion.div>

                    {catItems.length === 0 ? (
                      <p className="text-muted-light dark:text-muted-dark text-sm py-8 text-center italic">
                        {t("noItems")}
                      </p>
                    ) : (
                      <motion.div
                        className="grid grid-cols-2 gap-3"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                      >
                        {catItems.map((item) => {
                          const special = specialMap.get(item.id);
                          return (
                            <motion.div
                              key={item.id}
                              variants={{
                                hidden: { opacity: 0, y: 26 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.44, ease: [0.25, 0.1, 0.25, 1] } },
                              }}
                              className="flex"
                            >
                              <div className="w-full">
                                {isWine ? (
                                  <WineCard
                                    item={item}
                                    locale={locale}
                                    categorySlug={cat.slug}
                                    compact
                                    onClick={() => setSelected({ item, categorySlug: cat.slug, specialPrice: special?.special_price })}
                                  />
                                ) : (
                                  <div
                                    className="cursor-pointer active:scale-[0.98] transition-transform"
                                    onClick={() => setSelected({ item, categorySlug: cat.slug, specialPrice: special?.special_price })}
                                  >
                                    <MenuCard
                                      item={item}
                                      locale={locale}
                                      categorySlug={cat.slug}
                                      specialPrice={special?.special_price}
                                      compact
                                    />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </section>
                );
              })}

              <PhotoStrip />

              <div className="mt-14 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
                <div className="flex gap-3 items-start">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-800/30 flex items-center justify-center mt-0.5">
                    <span className="text-sm leading-none">⚠️</span>
                  </div>
                  <p className="text-[11.5px] text-muted-light dark:text-muted-dark leading-relaxed pt-0.5">
                    Allergenkennzeichnung gemäß EU-Verordnung Nr. 1169/2011.
                    Bei Fragen zu Allergenen wenden Sie sich bitte an unser Personal.
                  </p>
                </div>
              </div>

              <footer className="mt-14 pb-6 text-center">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-zinc-200/70 dark:to-zinc-800/70" />
                  <span className="text-[11px] text-gold/45 leading-none">◆</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-zinc-200/70 dark:to-zinc-800/70" />
                </div>
                <p className="text-[13px] font-heading font-semibold text-zinc-700 dark:text-zinc-300 mb-0.5">
                  Campedèl-Hof
                </p>
                <p className="text-[11px] text-muted-light dark:text-muted-dark mb-1">Seiser Alm · 1.844 m ü.M.</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mb-5">
                  © {new Date().getFullYear()} · Traditionelle Südtiroler Küche
                </p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <a
                    href="/info"
                    className="text-[11px] text-gold/70 hover:text-gold transition-colors font-medium"
                  >
                    Info & Kontakt
                  </a>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                  <button
                    onClick={() => setAdminOpen(true)}
                    className="text-[11px] text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 dark:hover:text-zinc-500 transition-colors"
                  >
                    Admin
                  </button>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Allergen FAB */}
      <AllergenFilter active={excludedAllergens} onChange={setExcludedAllergens} locale={locale} />

      {/* Back to top FAB */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed left-4 z-40 w-11 h-11 rounded-full bg-surface-light dark:bg-surface-dark border border-zinc-200/80 dark:border-zinc-700/60 shadow-lg flex items-center justify-center text-gold hover:bg-gold hover:text-white hover:border-gold transition-colors"
            style={{ bottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
            aria-label="Zurück nach oben"
          >
            <ChevronUp size={18} strokeWidth={2.2} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Item detail modal */}
      <ItemDetailModal
        item={selected?.item ?? null}
        locale={locale}
        categorySlug={selected?.categorySlug ?? ""}
        specialPrice={selected?.specialPrice}
        onClose={() => setSelected(null)}
      />

      {/* Admin password modal */}
      <AnimatePresence>
        {adminOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setAdminOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xs bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                    <Lock size={14} className="text-gold" />
                  </div>
                  <h2 className="font-heading font-bold text-[17px] text-zinc-900 dark:text-zinc-100">Admin</h2>
                </div>
                <button
                  onClick={() => setAdminOpen(false)}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleAdminLogin} className="px-5 pb-5 space-y-3">
                <input
                  ref={pwInputRef}
                  type="password"
                  value={adminPw}
                  onChange={(e) => { setAdminPw(e.target.value); setAdminError(""); }}
                  placeholder="Passwort"
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-bg-light dark:bg-bg-dark text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition text-base"
                  autoComplete="current-password"
                />
                {adminError && (
                  <p className="text-[13px] text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">{adminError}</p>
                )}
                <button
                  type="submit"
                  disabled={adminLoading || !adminPw}
                  className="w-full flex items-center justify-center gap-2 bg-gold text-white font-semibold py-2.5 rounded-xl hover:bg-gold-dark transition-colors disabled:opacity-50 text-[15px]"
                >
                  <LogIn size={15} />
                  {adminLoading ? "Bitte warten..." : "Anmelden"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
