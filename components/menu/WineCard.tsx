"use client";
import { Wine, Leaf } from "lucide-react";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import type { MenuItemWithAllergens, Locale } from "@/types";

type GradConfig = { lFrom: string; lTo: string; dFrom: string; dTo: string };
const WINE_GRAD: Record<string, GradConfig> = {
  "schaumwein": { lFrom:"#fffbeb", lTo:"#fef3c7", dFrom:"#451a03", dTo:"#78350f" },
  "weisswein":  { lFrom:"#fefce8", lTo:"#fef9c3", dFrom:"#3d2c00", dTo:"#713f12" },
  "rotwein":    { lFrom:"#fdf2f8", lTo:"#ffe4e6", dFrom:"#4c0519", dTo:"#881337" },
};
const WINE_GRAD_FALLBACK: GradConfig = { lFrom:"#fdf4ff", lTo:"#f5d0fe", dFrom:"#4a044e", dTo:"#6b21a8" };

export function WineCard({
  item,
  locale,
  categorySlug,
  compact = false,
  onClick,
}: {
  item: MenuItemWithAllergens;
  locale: Locale;
  categorySlug?: string;
  compact?: boolean;
  onClick?: () => void;
}) {
  const name = getLocalizedField(item, "name", locale);
  const hasPriceGrid = item.price_glass || item.price_quarter || item.price_half || item.price_liter;
  const grad = (categorySlug ? WINE_GRAD[categorySlug] : null) ?? WINE_GRAD_FALLBACK;

  /* ── Compact 2-col tile ───────────────────────────────────── */
  if (compact) {
    const keyPrice = item.price_glass ?? item.price_quarter ?? item.price_half ?? item.price ?? null;
    const keyLabel = item.price_glass ? "Glas" : item.price_quarter ? "0,25 l" : item.price_half ? "0,5 l" : "Fl.";

    return (
      <button
        onClick={onClick}
        className="card-surface rounded-xl overflow-hidden h-full flex flex-col w-full text-left active:scale-[0.98] transition-transform"
      >
        {/* Gradient header */}
        <div className="relative w-full shrink-0" style={{ paddingTop: "62%" }}>
          <div className="absolute inset-0 dark:hidden" style={{ background: `linear-gradient(135deg, ${grad.lFrom}, ${grad.lTo})` }} />
          <div className="absolute inset-0 hidden dark:block" style={{ background: `linear-gradient(135deg, ${grad.dFrom}, ${grad.dTo})` }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Wine size={32} className="text-gold opacity-30" />
          </div>
          {item.is_bio && (
            <span className="absolute top-1.5 left-1.5 bg-pine text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">🌱</span>
          )}
          <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        {/* Text */}
        <div className="px-2.5 pt-2 pb-2.5 flex flex-col flex-1">
          <h3 className="font-heading font-bold text-[13px] leading-snug text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-0.5">
            {name}
          </h3>
          {item.wine_producer && (
            <p className="text-[11px] text-muted-light dark:text-muted-dark line-clamp-1 mb-1">{item.wine_producer}</p>
          )}
          {item.wine_doc && (
            <span className="self-start text-[10px] font-semibold bg-pine/10 text-pine dark:text-pine-light px-1.5 py-0.5 rounded-full border border-pine/15 mb-1">
              {item.wine_doc}
            </span>
          )}
          <div className="mt-auto pt-1 flex items-end justify-between gap-1">
            <span className="text-[10px] text-muted-light dark:text-muted-dark">{hasPriceGrid ? keyLabel : "Fl."}</span>
            {keyPrice != null && (
              <span className="price-text text-[14px] leading-none">{formatPrice(keyPrice)}</span>
            )}
          </div>
        </div>
      </button>
    );
  }

  /* ── Full card (single-column, original style) ─────────────── */
  return (
    <button
      onClick={onClick}
      className="card-surface rounded-2xl overflow-hidden w-full text-left active:scale-[0.99] transition-transform"
    >
      {/* Gold top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="p-4">
        <div className="flex gap-3">
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
                {item.wine_region && <span className="text-zinc-400 dark:text-zinc-600"> · {item.wine_region}</span>}
              </p>
            )}
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
            {item.wine_grapes && item.wine_grapes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {item.wine_grapes.map((g) => (
                  <span key={g} className="bg-gold/10 text-gold-dark dark:text-gold text-[11px] px-2 py-0.5 rounded-full font-medium border border-gold/20">
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
              <span className="text-[12px] text-muted-light dark:text-muted-dark">Flasche 0,75 l</span>
              {item.price != null && <span className="price-text text-[17px]">{formatPrice(item.price)}</span>}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {item.price_glass   != null && <PriceRow label="Glas"    price={item.price_glass} />}
              {item.price_quarter != null && <PriceRow label="0,25 l"  price={item.price_quarter} />}
              {item.price_half    != null && <PriceRow label="0,5 l"   price={item.price_half} />}
              {item.price_liter   != null && <PriceRow label="1,0 l"   price={item.price_liter} />}
              {item.price         != null && <PriceRow label="Flasche" price={item.price} accent />}
            </div>
          )}
        </div>
      </div>
    </button>
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
