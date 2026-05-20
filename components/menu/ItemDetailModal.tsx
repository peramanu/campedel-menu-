"use client";
import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wine, Leaf, Sprout } from "lucide-react";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import type { MenuItemWithAllergens, Locale } from "@/types";

/* Warm, earthy palette — matches MenuCard & WineCard */
type GradConfig = { lFrom: string; lTo: string; dFrom: string; dTo: string; icon: string };
const CAT: Record<string, GradConfig> = {
  "kalte-vorspeisen": { lFrom:"#edf5eb", lTo:"#dae8d5", dFrom:"#182118", dTo:"#1f2b1e", icon:"🥗" },
  "suppen":           { lFrom:"#fdf5e5", lTo:"#f4e4bf", dFrom:"#281d09", dTo:"#33250d", icon:"🍲" },
  "warme-vorspeisen": { lFrom:"#fdf1ee", lTo:"#f4dbd6", dFrom:"#271612", dTo:"#311c17", icon:"🍝" },
  "hauptspeisen":     { lFrom:"#f5f1ea", lTo:"#e8e0d4", dFrom:"#201c15", dTo:"#29231b", icon:"🍽️" },
  "kinder":           { lFrom:"#fdf8e5", lTo:"#f4eabb", dFrom:"#262009", dTo:"#2e270d", icon:"👶" },
  "dessert":          { lFrom:"#f8f0f4", lTo:"#eed7e6", dFrom:"#24131e", dTo:"#2c1924", icon:"🍮" },
  "warme-getraenke":  { lFrom:"#fdf3e9", lTo:"#f4ddc5", dFrom:"#28190d", dTo:"#342011", icon:"☕" },
  "getraenke":        { lFrom:"#edf2f8", lTo:"#d9e7f0", dFrom:"#111b23", dTo:"#17222b", icon:"🥤" },
  "bier":             { lFrom:"#fef8e3", lTo:"#f4e9b0", dFrom:"#231f0b", dTo:"#2b260e", icon:"🍺" },
  "aperitif":         { lFrom:"#faf0f4", lTo:"#eed6e3", dFrom:"#22131f", dTo:"#2b1927", icon:"🍸" },
  "digestif":         { lFrom:"#f9edec", lTo:"#eed5d4", dFrom:"#221313", dTo:"#2b1a1a", icon:"🥃" },
  "schaumwein":       { lFrom:"#fdf7e8", lTo:"#f4e4bc", dFrom:"#281e09", dTo:"#34250d", icon:"🥂" },
  "weisswein":        { lFrom:"#f8f4e5", lTo:"#ece6c3", dFrom:"#211d0d", dTo:"#2c2712", icon:"🍾" },
  "rotwein":          { lFrom:"#f8ecef", lTo:"#eed4d9", dFrom:"#2a1217", dTo:"#35181e", icon:"🍷" },
};
const FALLBACK: GradConfig = { lFrom:"#f5f1ea", lTo:"#e8e0d4", dFrom:"#201c15", dTo:"#29231b", icon:"🍽️" };

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
            <div className="relative w-full shrink-0" style={{ paddingTop: isWine ? "65%" : "52%" }}>
              {/* Gradient always visible as background */}
              <div className="absolute inset-0 dark:hidden" style={{ background: `linear-gradient(135deg, ${cfg.lFrom}, ${cfg.lTo})` }} />
              <div className="absolute inset-0 hidden dark:block" style={{ background: `linear-gradient(135deg, ${cfg.dFrom}, ${cfg.dTo})` }} />

              {item.image_url ? (
                /* object-contain so bottle is never cropped; gradient shows around it */
                <div className="absolute inset-0 p-4">
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image_url}
                      alt={name}
                      fill
                      className="object-contain drop-shadow-2xl"
                      sizes="500px"
                    />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[80px] leading-none opacity-[0.15] select-none">{cfg.icon}</span>
                </div>
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
                  <div className="rounded-2xl p-4 border border-gold/15 dark:border-gold/10"
                    style={{ background: "linear-gradient(145deg, rgba(201,169,110,0.05), rgba(201,169,110,0.02))" }}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2.5">Verkostung</p>
                    <p className="text-[13px] italic font-heading text-zinc-600 dark:text-zinc-400 leading-relaxed">{tasting}</p>
                  </div>
                )}

                {/* Wine: price grid */}
                {isWine && (
                  <div className="bg-zinc-50/80 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800/80">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-3">Preise</p>
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
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-2.5">Allergene</p>
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
