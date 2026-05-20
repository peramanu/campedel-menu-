"use client";
import Image from "next/image";
import { Wine, Leaf } from "lucide-react";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import type { MenuItemWithAllergens, Locale } from "@/types";

/* Warm wine-appropriate gradients — parchment, straw, garnet */
type GradConfig = { lFrom: string; lTo: string; dFrom: string; dTo: string };
const WINE_GRAD: Record<string, GradConfig> = {
  "schaumwein": { lFrom:"#fdf7e8", lTo:"#f4e4bc", dFrom:"#281e09", dTo:"#34250d" },
  "weisswein":  { lFrom:"#f8f4e5", lTo:"#ece6c3", dFrom:"#211d0d", dTo:"#2c2712" },
  "rotwein":    { lFrom:"#f8ecef", lTo:"#eed4d9", dFrom:"#2a1217", dTo:"#35181e" },
};
const WINE_GRAD_FALLBACK: GradConfig = { lFrom:"#faf0f4", lTo:"#eed5e2", dFrom:"#23131f", dTo:"#2c1927" };

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

  /* ── Compact 2-col tile ─────────────────────────────────── */
  if (compact) {
    const keyPrice = item.price_glass ?? item.price_quarter ?? item.price_half ?? item.price ?? null;
    const keyLabel = item.price_glass ? "Glas" : item.price_quarter ? "0,25 l" : item.price_half ? "0,5 l" : "Fl.";

    return (
      <button
        onClick={onClick}
        className="card-surface rounded-2xl overflow-hidden h-full flex flex-col w-full text-left active:scale-[0.98] transition-transform"
      >
        {/* Bottle image / gradient header */}
        <div className="relative w-full shrink-0" style={{ paddingTop: "92%" }}>
          <div className="absolute inset-0 dark:hidden"
            style={{ background: `linear-gradient(148deg, ${grad.lFrom} 0%, ${grad.lTo} 100%)` }} />
          <div className="absolute inset-0 hidden dark:block"
            style={{ background: `linear-gradient(148deg, ${grad.dFrom} 0%, ${grad.dTo} 100%)` }} />

          {item.image_url ? (
            <div className="absolute inset-0 p-2.5">
              <div className="relative w-full h-full">
                <Image
                  src={item.image_url}
                  alt={name}
                  fill
                  className="object-contain drop-shadow-xl"
                  sizes="(max-width: 640px) 44vw, 200px"
                />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Wine size={30} className="text-gold opacity-25" />
            </div>
          )}

          {item.is_bio && (
            <span className="absolute top-2 left-2 bg-pine text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full z-10 uppercase tracking-wider">
              🌱 Bio
            </span>
          )}

          {/* Soft bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        {/* Text */}
        <div className="px-3 pt-2.5 pb-3 flex flex-col flex-1">
          <h3 className="font-heading font-semibold text-[13px] leading-snug text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-0.5">
            {name}
          </h3>
          {item.wine_producer && (
            <p className="text-[10.5px] text-muted-light dark:text-muted-dark line-clamp-1 mb-1 italic">
              {item.wine_producer}
            </p>
          )}
          {item.wine_doc && (
            <span className="self-start text-[9.5px] font-semibold bg-pine/8 dark:bg-pine/15 text-pine dark:text-pine-light px-1.5 py-0.5 rounded-full border border-pine/15 mb-1.5">
              {item.wine_doc}
            </span>
          )}
          <div className="mt-auto flex items-end justify-between gap-1">
            <span className="text-[10px] text-muted-light dark:text-muted-dark">{hasPriceGrid ? keyLabel : "Fl."}</span>
            {keyPrice != null && (
              <span className="price-text text-[15px] leading-none">{formatPrice(keyPrice)}</span>
            )}
          </div>
        </div>
      </button>
    );
  }

  /* ── Full card (single-column) ──────────────────────────── */
  return (
    <button
      onClick={onClick}
      className="card-surface rounded-2xl overflow-hidden w-full text-left active:scale-[0.99] transition-transform"
    >
      {/* Gold top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="p-4">
        <div className="flex gap-3.5">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden relative border border-gold/20"
            style={{ background: `linear-gradient(148deg, ${grad.lFrom}, ${grad.lTo})` }}>
            <div className="dark:block hidden absolute inset-0"
              style={{ background: `linear-gradient(148deg, ${grad.dFrom}, ${grad.dTo})` }} />
            {item.image_url ? (
              <div className="absolute inset-1">
                <div className="relative w-full h-full">
                  <Image src={item.image_url} alt={name} fill className="object-contain" sizes="56px" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Wine size={18} className="text-gold opacity-60" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 justify-between">
              <h3 className="font-heading font-bold text-[16px] leading-tight text-zinc-900 dark:text-zinc-100">
                {name}
              </h3>
              {item.is_bio && (
                <span className="flex items-center gap-1 bg-pine/10 text-pine dark:text-pine-light text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 border border-pine/20">
                  <Leaf size={8} /> BIO
                </span>
              )}
            </div>
            {item.wine_producer && (
              <p className="text-[12px] italic text-muted-light dark:text-muted-dark mt-0.5 leading-tight">
                {item.wine_producer}
                {item.wine_region && (
                  <span className="not-italic text-zinc-400 dark:text-zinc-600"> · {item.wine_region}</span>
                )}
              </p>
            )}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {item.wine_doc && (
                <span className="bg-pine/10 text-pine dark:text-pine-light text-[10.5px] font-semibold px-2 py-0.5 rounded-full border border-pine/15">
                  {item.wine_doc}
                </span>
              )}
              {item.wine_style && (
                <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10.5px] px-2 py-0.5 rounded-full">
                  {item.wine_style}
                </span>
              )}
            </div>
            {item.wine_grapes && item.wine_grapes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {item.wine_grapes.map((g) => (
                  <span key={g} className="bg-gold/10 text-gold-dark dark:text-gold text-[10.5px] px-2 py-0.5 rounded-full font-medium border border-gold/20">
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
