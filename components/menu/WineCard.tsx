"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wine, ChevronDown, Leaf } from "lucide-react";
import { AllergenBadge } from "./AllergenBadge";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import type { MenuItemWithAllergens, Locale } from "@/types";

export function WineCard({ item, locale }: { item: MenuItemWithAllergens; locale: Locale }) {
  const [tastingOpen, setTastingOpen] = useState(false);
  const name = getLocalizedField(item, "name", locale);
  const tasting = locale === "it" ? item.tasting_notes_it : item.tasting_notes_de;
  const hasPriceGrid = item.price_glass || item.price_quarter || item.price_half || item.price_liter;

  return (
    <div className="card-surface rounded-2xl overflow-hidden">
      {/* Gold top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="p-4">
        <div className="flex gap-3">
          {/* Wine icon */}
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-950/40 dark:to-rose-950/40 flex items-center justify-center border border-gold/20">
            <Wine size={18} className="text-gold" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 justify-between">
              <h3 className="font-heading font-bold text-[16px] leading-tight text-zinc-900 dark:text-zinc-100">
                {name}
              </h3>
              {item.is_bio && (
                <span className="flex items-center gap-1 bg-pine/10 text-pine dark:text-pine-light text-[11px] font-bold px-1.5 py-0.5 rounded-full shrink-0 border border-pine/20">
                  <Leaf size={9} /> BIO
                </span>
              )}
            </div>

            {item.wine_producer && (
              <p className="text-[12px] text-muted-light dark:text-muted-dark mt-0.5 leading-tight">
                {item.wine_producer}
                {item.wine_region && (
                  <span className="text-zinc-400 dark:text-zinc-600"> · {item.wine_region}</span>
                )}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {item.wine_doc && (
                <span className="bg-pine/10 text-pine dark:text-pine-light text-[11px] font-semibold px-2 py-0.5 rounded-full border border-pine/15">
                  {item.wine_doc}
                </span>
              )}
              {item.wine_style && (
                <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[11px] px-2 py-0.5 rounded-full">
                  {item.wine_style}
                </span>
              )}
            </div>

            {/* Grapes */}
            {item.wine_grapes && item.wine_grapes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {item.wine_grapes.map((g) => (
                  <span
                    key={g}
                    className="bg-gold/10 text-gold-dark dark:text-gold text-[11px] px-2 py-0.5 rounded-full font-medium border border-gold/20"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price grid */}
        <div className="mt-3.5 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80">
          {!hasPriceGrid ? (
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-muted-light dark:text-muted-dark">
                {item.price_glass ? "Flasche 0,75 l" : "0,75 l"}
              </span>
              {item.price != null && (
                <span className="price-text text-[17px]">{formatPrice(item.price)}</span>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {item.price_glass   != null && <PriceRow label="Glas"     price={item.price_glass} />}
              {item.price_quarter != null && <PriceRow label="0,25 l"   price={item.price_quarter} />}
              {item.price_half    != null && <PriceRow label="0,5 l"    price={item.price_half} />}
              {item.price_liter   != null && <PriceRow label="1,0 l"    price={item.price_liter} />}
              {item.price         != null && <PriceRow label="Flasche"  price={item.price} accent />}
            </div>
          )}
        </div>

        {/* Tasting notes */}
        {tasting && (
          <div className="mt-3">
            <button
              onClick={() => setTastingOpen((o) => !o)}
              className="flex items-center gap-1.5 text-[12px] text-muted-light dark:text-muted-dark font-medium hover:text-gold transition-colors"
            >
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${tastingOpen ? "rotate-180" : ""}`}
              />
              Verkostungsnotizen
            </button>
            <AnimatePresence>
              {tastingOpen && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden text-[12px] italic text-muted-light dark:text-muted-dark mt-1.5 leading-relaxed"
                >
                  {tasting}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Allergens */}
        {item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
            {item.allergens.map((a) => (
              <AllergenBadge key={a.id} allergen={a} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PriceRow({ label, price, accent }: { label: string; price: number; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[12px] text-muted-light dark:text-muted-dark">{label}</span>
      <span className={`text-[13px] font-bold ${accent ? "price-text" : "text-zinc-800 dark:text-zinc-200"}`}>
        {formatPrice(price)}
      </span>
    </div>
  );
}
