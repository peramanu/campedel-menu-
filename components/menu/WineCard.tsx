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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card dark:shadow-card-dark overflow-hidden"
    >
      <div className="p-4">
        <div className="flex gap-3">
          {/* Wine icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 flex items-center justify-center">
            <Wine size={18} className="text-gold" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-heading font-bold text-[17px] leading-snug text-zinc-900 dark:text-zinc-100">
                {name}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                {item.is_bio && (
                  <span className="flex items-center gap-0.5 bg-pine/10 text-pine dark:text-pine-light text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    <Leaf size={10} /> BIO
                  </span>
                )}
              </div>
            </div>

            {/* Producer + region */}
            {item.wine_producer && (
              <p className="text-xs text-muted-light dark:text-muted-dark mt-0.5">
                {item.wine_producer}
              </p>
            )}

            {/* Badges row */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {item.wine_doc && (
                <span className="bg-pine/10 text-pine dark:text-pine-light text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.wine_doc}
                </span>
              )}
              {item.wine_style && (
                <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs px-2 py-0.5 rounded-full">
                  {item.wine_style}
                </span>
              )}
            </div>

            {/* Grape varieties */}
            {item.wine_grapes && item.wine_grapes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.wine_grapes.map((g) => (
                  <span
                    key={g}
                    className="bg-gold/10 text-gold-dark dark:text-gold text-xs px-2 py-0.5 rounded-full font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price grid */}
        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          {item.price && !hasPriceGrid ? (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-light dark:text-muted-dark">0,75 l</span>
              <span className="font-bold text-gold text-lg">{formatPrice(item.price)}</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {item.price_glass != null && (
                <PriceRow label="Glas" price={item.price_glass} />
              )}
              {item.price_quarter != null && (
                <PriceRow label="0,25 l" price={item.price_quarter} />
              )}
              {item.price_half != null && (
                <PriceRow label="0,5 l" price={item.price_half} />
              )}
              {item.price_liter != null && (
                <PriceRow label="1,0 l" price={item.price_liter} />
              )}
              {item.price != null && (
                <PriceRow label="Flasche" price={item.price} accent />
              )}
            </div>
          )}
        </div>

        {/* Tasting notes */}
        {tasting && (
          <div className="mt-3">
            <button
              onClick={() => setTastingOpen((o) => !o)}
              className="flex items-center gap-1.5 text-xs text-muted-light dark:text-muted-dark font-medium hover:text-gold transition-colors"
            >
              <ChevronDown
                size={13}
                className={`transition-transform ${tastingOpen ? "rotate-180" : ""}`}
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
                  className="overflow-hidden text-xs italic text-muted-light dark:text-muted-dark mt-1 leading-relaxed"
                >
                  {tasting}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Allergens */}
        {item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            {item.allergens.map((a) => (
              <AllergenBadge key={a.id} allergen={a} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PriceRow({ label, price, accent }: { label: string; price: number; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-muted-light dark:text-muted-dark">{label}</span>
      <span className={`text-sm font-bold ${accent ? "text-gold" : "text-zinc-800 dark:text-zinc-200"}`}>
        {formatPrice(price)}
      </span>
    </div>
  );
}
