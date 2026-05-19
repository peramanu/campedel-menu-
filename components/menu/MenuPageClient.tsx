"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryTabs } from "./CategoryTabs";
import { MenuCard } from "./MenuCard";
import { WineCard } from "./WineCard";
import { AllergenFilter } from "./AllergenFilter";
import { MenuHero } from "./MenuHero";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, X, LogIn } from "lucide-react";
import type { Category, MenuItemWithAllergens, DailySpecial, Locale } from "@/types";

const WINE_SLUGS = ["schaumwein", "weisswein", "rotwein"];

const ADMIN_EMAIL = "admin@campedel.com";

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
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");
  const [excludedAllergens, setExcludedAllergens] = useState<number[]>([]);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().split("T")[0];

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
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Tagesangebot</p>
                  <p className="text-sm font-semibold text-white truncate">
                    {todaysSpecials.map((ds) => {
                      const item = items.find((i) => i.id === ds.item_id);
                      return item ? ((item[`name_${locale}` as keyof typeof item] as string) ?? item.name_de) : "";
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
              ) : isWine ? (
                <div className="grid gap-3">
                  {catItems.map((item, i) => {
                    const special = specialMap.get(item.id);
                    return (
                      <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: Math.min(i * 0.05, 0.3) }}>
                        <WineCard item={item} locale={locale} />
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {catItems.map((item, i) => {
                    const special = specialMap.get(item.id);
                    return (
                      <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: Math.min(i * 0.05, 0.3) }} className="flex">
                        <div className="w-full">
                          <MenuCard
                            item={item}
                            locale={locale}
                            categorySlug={cat.slug}
                            specialPrice={special?.special_price}
                            compact
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}

        {/* Allergen notice */}
        <div className="mt-12 pt-5 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex gap-2.5">
            <span className="text-lg mt-0.5 shrink-0">⚠️</span>
            <p className="text-[11px] text-muted-light dark:text-muted-dark leading-relaxed">
              Allergenkennzeichnung gemäß EU-Verordnung Nr. 1169/2011.
              Bei Fragen zu Allergenen wenden Sie sich bitte an unser Personal.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 pb-4 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent mb-6" />
          <p className="text-[11px] text-muted-light dark:text-muted-dark mb-1">
            © {new Date().getFullYear()} Campedèl-Hof · Seiser Alm
          </p>
          <p className="text-[10px] text-zinc-300 dark:text-zinc-700 mb-3">
            Traditionelle Südtiroler Küche
          </p>
          <button
            onClick={() => setAdminOpen(true)}
            className="text-[10px] text-zinc-300 dark:text-zinc-700 hover:text-zinc-400 dark:hover:text-zinc-500 transition-colors px-3 py-1"
            aria-label="Admin"
          >
            Admin
          </button>
        </footer>
      </div>

      {/* ── Allergen FAB ──────────────────────────────────────── */}
      <AllergenFilter
        active={excludedAllergens}
        onChange={setExcludedAllergens}
        locale={locale}
      />

      {/* ── Admin Password Modal ───────────────────────────────── */}
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
                  <h2 className="font-heading font-bold text-[17px] text-zinc-900 dark:text-zinc-100">
                    Admin
                  </h2>
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
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-bg-light dark:bg-bg-dark text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition text-[16px]"
                  autoComplete="current-password"
                />
                {adminError && (
                  <p className="text-[13px] text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                    {adminError}
                  </p>
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
