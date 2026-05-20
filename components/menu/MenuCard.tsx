"use client";
import { useState } from "react";
import Image from "next/image";
import { Leaf, Sprout } from "lucide-react";
import { AllergenBadge } from "./AllergenBadge";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import type { MenuItemWithAllergens, Locale } from "@/types";

/* Warm, earthy, parchment-toned gradients — cohesive across all categories */
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
};
const FALLBACK: GradConfig = { lFrom:"#f5f1ea", lTo:"#e8e0d4", dFrom:"#201c15", dTo:"#29231b", icon:"🍽️" };

function GradientBg({ cfg, compact = false }: { cfg: GradConfig; compact?: boolean }) {
  return (
    <>
      <div className="absolute inset-0 dark:hidden"
        style={{ background: `linear-gradient(148deg, ${cfg.lFrom} 0%, ${cfg.lTo} 100%)` }} />
      <div className="absolute inset-0 hidden dark:block"
        style={{ background: `linear-gradient(148deg, ${cfg.dFrom} 0%, ${cfg.dTo} 100%)` }} />
      {/* Watermark emoji */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span style={{ fontSize: compact ? 48 : 68, lineHeight: 1, opacity: 0.1 }}>
          {cfg.icon}
        </span>
      </div>
    </>
  );
}

export function MenuCard({
  item,
  locale,
  categorySlug,
  specialPrice,
  compact = false,
}: {
  item: MenuItemWithAllergens;
  locale: Locale;
  categorySlug: string;
  specialPrice?: number | null;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const name = getLocalizedField(item, "name", locale);
  const desc = getLocalizedField(item, "description", locale);
  const cfg = CAT[categorySlug] ?? FALLBACK;
  const displayPrice = specialPrice ?? item.price;

  /* ── Compact 2-col tile ─────────────────────────────────── */
  if (compact) {
    return (
      <div className="card-surface rounded-2xl overflow-hidden h-full flex flex-col">
        {/* Image / gradient */}
        <div className="relative w-full flex-shrink-0" style={{ paddingTop: "72%" }}>
          {item.image_url ? (
            <Image src={item.image_url} alt={name} fill className="object-cover" sizes="220px" />
          ) : (
            <GradientBg cfg={cfg} compact />
          )}

          {/* Top-left badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {item.is_daily_special && (
              <span className="bg-gold text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                ✦ Heute
              </span>
            )}
            {item.is_bio && (
              <span className="bg-pine text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                🌱 Bio
              </span>
            )}
          </div>

          {/* Top-right diet icons */}
          <div className="absolute top-2 right-2 flex gap-0.5">
            {item.is_vegan && (
              <span className="bg-pine/90 text-white p-1 rounded-full shadow-sm" title="Vegan">
                <Sprout size={9} strokeWidth={2.5} />
              </span>
            )}
            {item.is_vegetarian && !item.is_vegan && (
              <span className="bg-emerald-600/90 text-white p-1 rounded-full shadow-sm" title="Vegetarisch">
                <Leaf size={9} strokeWidth={2.5} />
              </span>
            )}
          </div>

          {/* Bottom gradient fade for text readability */}
          {item.image_url && (
            <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-black/20 to-transparent" />
          )}
        </div>

        {/* Text body */}
        <div className="px-3 pt-3 pb-3.5 flex flex-col flex-1">
          <h3 className="font-heading font-semibold text-[13.5px] leading-snug text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-1.5">
            {name}
          </h3>
          {desc && (
            <p className="text-[11px] italic text-muted-light dark:text-muted-dark leading-relaxed line-clamp-1 mb-2">
              {desc}
            </p>
          )}

          <div className="mt-auto flex items-end justify-between gap-2">
            {/* Allergen codes — discreet */}
            <div className="flex flex-wrap gap-0.5 items-end">
              {item.allergens.slice(0, 4).map((a) => (
                <span
                  key={a.id}
                  title={a.name_de}
                  className="text-[8.5px] font-semibold text-zinc-400 dark:text-zinc-600 leading-none"
                >
                  {a.code}
                </span>
              ))}
              {item.allergens.length > 4 && (
                <span className="text-[8.5px] text-zinc-400 dark:text-zinc-600">+{item.allergens.length - 4}</span>
              )}
            </div>

            {/* Price — prominent, Playfair */}
            <div className="shrink-0 text-right">
              {specialPrice != null && item.price != null && (
                <p className="text-[9.5px] line-through text-muted-light dark:text-muted-dark leading-none mb-0.5">
                  {formatPrice(item.price)}
                </p>
              )}
              {displayPrice != null && (
                <p className="price-text text-[15px] leading-none">{formatPrice(displayPrice)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Full-width card ─────────────────────────────────────── */
  return (
    <div className="card-surface rounded-2xl overflow-hidden">
      <div className="relative w-full" style={{ paddingTop: "44%" }}>
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 672px) 100vw, 672px"
          />
        ) : (
          <GradientBg cfg={cfg} />
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {item.is_daily_special && (
            <span className="bg-gold text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md tracking-wider uppercase">
              ✦ Heute
            </span>
          )}
          {item.is_bio && (
            <span className="bg-pine text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wide">
              🌱 Bio
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex gap-1">
          {item.is_vegan && (
            <span className="bg-pine/90 backdrop-blur-sm text-white p-1.5 rounded-full shadow-md" title="Vegan">
              <Sprout size={10} strokeWidth={2.5} />
            </span>
          )}
          {item.is_vegetarian && !item.is_vegan && (
            <span className="bg-emerald-600/90 backdrop-blur-sm text-white p-1.5 rounded-full shadow-md" title="Vegetarisch">
              <Leaf size={10} strokeWidth={2.5} />
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pt-3.5 pb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading font-bold text-[17px] leading-snug text-zinc-900 dark:text-zinc-100 flex-1 min-w-0">
            {name}
          </h3>
          <div className="shrink-0 text-right ml-2">
            {specialPrice != null && item.price != null && (
              <p className="text-[11px] line-through text-muted-light dark:text-muted-dark leading-none mb-0.5">
                {formatPrice(item.price)}
              </p>
            )}
            {displayPrice != null && (
              <p className="price-text text-[17px] leading-none">{formatPrice(displayPrice)}</p>
            )}
          </div>
        </div>

        {desc && (
          <div className="mb-3">
            <p className={`text-[13px] italic text-muted-light dark:text-muted-dark leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}>
              {desc}
            </p>
            {desc.length > 80 && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="text-[12px] text-gold font-semibold hover:text-gold-dark transition-colors mt-0.5"
              >
                {expanded ? "Weniger" : "Mehr"}
              </button>
            )}
          </div>
        )}

        {item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.allergens.map((a) => (
              <AllergenBadge key={a.id} allergen={a} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
