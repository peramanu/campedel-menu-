"use client";
import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wine, Leaf, Sprout } from "lucide-react";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import type { MenuItemWithAllergens, Locale } from "@/types";

type GradConfig = { lFrom: string; lTo: string; dFrom: string; dTo: string; icon: string };
const CAT: Record<string, GradConfig> = {
  "kalte-vorspeisen": { lFrom:"#dcfce7", lTo:"#bbf7d0", dFrom:"#052e16", dTo:"#064e3b", icon:"🥗" },
  "suppen":           { lFrom:"#fef9c3", lTo:"#fde68a", dFrom:"#422006", dTo:"#78350f", icon:"🍲" },
  "warme-vorspeisen": { lFrom:"#fce7f3", lTo:"#fbcfe8", dFrom:"#4a044e", dTo:"#831843", icon:"🍝" },
  "hauptspeisen":     { lFrom:"#f1f5f9", lTo:"#e2e8f0", dFrom:"#1e293b", dTo:"#334155", icon:"🍽️" },
  "kinder":           { lFrom:"#fef9c3", lTo:"#fef08a", dFrom:"#422006", dTo:"#713f12", icon:"👶" },
  "dessert":          { lFrom:"#f3e8ff", lTo:"#e9d5ff", dFrom:"#3b0764", dTo:"#581c87", icon:"🍮" },
  "warme-getraenke":  { lFrom:"#fff7ed", lTo:"#fed7aa", dFrom:"#431407", dTo:"#7c2d12", icon:"☕" },
  "getraenke":        { lFrom:"#eff6ff", lTo:"#dbeafe", dFrom:"#172554", dTo:"#1e3a8a", icon:"🥤" },
  "bier":             { lFrom:"#fefce8", lTo:"#fef08a", dFrom:"#422006", dTo:"#78350f", icon:"🍺" },
  "aperitif":         { lFrom:"#fdf4ff", lTo:"#f5d0fe", dFrom:"#4a044e", dTo:"#6b21a8", icon:"🍸" },
  "digestif":         { lFrom:"#fdf2f8", lTo:"#fce7f3", dFrom:"#4a044e", dTo:"#831843", icon:"🥃" },
  "schaumwein":       { lFrom:"#fffbeb", lTo:"#fef3c7", dFrom:"#451a03", dTo:"#78350f", icon:"🥂" },
  "weisswein":        { lFrom:"#fefce8", lTo:"#fef9c3", dFrom:"#422006", dTo:"#713f12", icon:"🍾" },
  "rotwein":          { lFrom:"#fdf2f8", lTo:"#fce7f3", dFrom:"#4c0519", dTo:"#881337", icon:"🍷" },
};
const FALLBACK: GradConfig = { lFrom:"#f1f5f9", lTo:"#e2e8f0", dFrom:"#1e293b", dTo:"#334155", icon:"🍽️" };

const WINE_SLUGS = ["schaumwein", "weisswein", "rotwein"];

export function ItemDetailModal({
  item,
  locale,
  categorySlug,
  specialPrice,
  onClose,
}: {
  item: MenuItemWithAllergens | null;
  locale: Locale;
  categorySlug: string;
  specialPrice?: number | null;
  onClose: () => void;
}) {
  const isWine = WINE_SLUGS.includes(categorySlug);

  // Lock body scroll while open
  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!item) return null;

  const name = getLocalizedField(item, "name", locale);
  const desc = getLocalizedField(item, "description", locale);
  const cfg = CAT[categorySlug] ?? FALLBACK;
  const displayPrice = specialPrice ?? item.price;
  const tasting = locale === "it" ? item.tasting_notes_it : item.tasting_notes_de;
  const hasPriceGrid = item.price_glass || item.price_quarter || item.price_half || item.price_liter;

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet — slides up from bottom */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed bottom-0 inset-x-0 z-50 max-h-[92dvh] flex flex-col sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-h-[85dvh] sm:w-full sm:max-w-md sm:rounded-3xl overflow-hidden bg-surface-light dark:bg-surface-dark shadow-2xl"
          >
            {/* Drag handle (mobile) */}
            <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
              <div className="w-9 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>

            {/* Hero image / gradient */}
            <div className="relative w-full shrink-0" style={{ paddingTop: isWine ? "40%" : "52%" }}>
              {item.image_url ? (
                <Image src={item.image_url} alt={name} fill className="object-cover" sizes="500px" />
              ) : (
                <>
                  <div className="absolute inset-0 dark:hidden" style={{ background: `linear-gradient(135deg, ${cfg.lFrom}, ${cfg.lTo})` }} />
                  <div className="absolute inset-0 hidden dark:block" style={{ background: `linear-gradient(135deg, ${cfg.dFrom}, ${cfg.dTo})` }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[80px] leading-none opacity-[0.15] select-none">{cfg.icon}</span>
                  </div>
                </>
              )}

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <X size={15} />
              </button>

              {/* Badges overlay */}
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                {item.is_daily_special && (
                  <span className="bg-gold text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow tracking-wide uppercase">✨ Heute</span>
                )}
                {item.is_bio && (
                  <span className="bg-pine text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow uppercase">🌱 Bio</span>
                )}
              </div>
              <div className="absolute bottom-3 right-3 flex gap-1">
                {item.is_vegan && (
                  <span className="bg-pine/90 backdrop-blur-sm text-white p-1.5 rounded-full shadow" title="Vegan">
                    <Sprout size={11} strokeWidth={2.5} />
                  </span>
                )}
                {item.is_vegetarian && !item.is_vegan && (
                  <span className="bg-emerald-600/90 backdrop-blur-sm text-white p-1.5 rounded-full shadow" title="Vegetarisch">
                    <Leaf size={11} strokeWidth={2.5} />
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="px-5 pt-4 pb-8 space-y-4">

                {/* Name + price */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {isWine && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <Wine size={13} className="text-gold" />
                        <span className="text-[11px] font-semibold text-gold uppercase tracking-wider">
                          {item.wine_style ?? "Wein"}
                        </span>
                      </div>
                    )}
                    <h2 className="font-heading font-bold text-[22px] leading-snug text-zinc-900 dark:text-zinc-100">
                      {name}
                    </h2>
                    {isWine && item.wine_producer && (
                      <p className="text-[13px] text-muted-light dark:text-muted-dark mt-0.5">
                        {item.wine_producer}
                        {item.wine_region && <span className="text-zinc-400 dark:text-zinc-600"> · {item.wine_region}</span>}
                      </p>
                    )}
                  </div>
                  {!isWine && displayPrice != null && (
                    <div className="shrink-0 text-right">
                      {specialPrice != null && item.price != null && (
                        <p className="text-[12px] line-through text-muted-light dark:text-muted-dark">
                          {formatPrice(item.price)}
                        </p>
                      )}
                      <p className="price-text text-[22px]">{formatPrice(displayPrice)}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {desc && (
                  <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                    {desc}
                  </p>
                )}

                {/* Wine: tags */}
                {isWine && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.wine_doc && (
                      <span className="bg-pine/10 text-pine dark:text-pine-light text-[12px] font-semibold px-2.5 py-1 rounded-full border border-pine/15">
                        {item.wine_doc}
                      </span>
                    )}
                    {item.wine_grapes?.map((g) => (
                      <span key={g} className="bg-gold/10 text-gold-dark dark:text-gold text-[12px] px-2.5 py-1 rounded-full font-medium border border-gold/20">
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {/* Wine: tasting notes */}
                {isWine && tasting && (
                  <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark mb-2">Verkostung</p>
                    <p className="text-[13px] italic text-zinc-600 dark:text-zinc-400 leading-relaxed">{tasting}</p>
                  </div>
                )}

                {/* Wine: price grid */}
                {isWine && (
                  <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark mb-3">Preise</p>
                    {!hasPriceGrid ? (
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-muted-light dark:text-muted-dark">Flasche 0,75 l</span>
                        {item.price != null && <span className="price-text text-[18px]">{formatPrice(item.price)}</span>}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {item.price_glass   != null && <WinePriceRow label="Glas"      price={item.price_glass} />}
                        {item.price_quarter != null && <WinePriceRow label="0,25 l"    price={item.price_quarter} />}
                        {item.price_half    != null && <WinePriceRow label="0,5 l"     price={item.price_half} />}
                        {item.price_liter   != null && <WinePriceRow label="1,0 l"     price={item.price_liter} />}
                        {item.price         != null && <WinePriceRow label="Flasche"   price={item.price} accent />}
                      </div>
                    )}
                  </div>
                )}

                {/* Allergens */}
                {item.allergens.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark mb-2.5">Allergene</p>
                    <div className="flex flex-wrap gap-2">
                      {item.allergens.map((a) => {
                        const aName = (a[`name_${locale}` as keyof typeof a] as string) ?? a.name_de;
                        return (
                          <span
                            key={a.id}
                            className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[12px] px-2.5 py-1 rounded-full"
                          >
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">{a.code}</span>
                            {aName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Legal note */}
                <p className="text-[10px] text-muted-light dark:text-muted-dark">
                  Allergenkennzeichnung gemäß EU-VO 1169/2011
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function WinePriceRow({ label, price, accent }: { label: string; price: number; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[13px] text-muted-light dark:text-muted-dark">{label}</span>
      <span className={`text-[15px] font-bold ${accent ? "price-text" : "text-zinc-800 dark:text-zinc-200"}`}>
        {formatPrice(price)}
      </span>
    </div>
  );
}
