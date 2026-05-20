"use client";
import { useState } from "react";
import Image from "next/image";
import { Leaf, Sprout } from "lucide-react";
import { AllergenBadge } from "./AllergenBadge";
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
};
const FALLBACK: GradConfig = { lFrom:"#f1f5f9", lTo:"#e2e8f0", dFrom:"#1e293b", dTo:"#334155", icon:"🍽️" };

function GradientBg({ cfg }: { cfg: GradConfig }) {
  return (
    <>
      <div className="absolute inset-0 dark:hidden" style={{ background: `linear-gradient(135deg, ${cfg.lFrom}, ${cfg.lTo})` }} />
      <div className="absolute inset-0 hidden dark:block" style={{ background: `linear-gradient(135deg, ${cfg.dFrom}, ${cfg.dTo})` }} />
      <div className="absolute inset-0 flex items-center justify-end pr-4">
        <span className="text-[56px] leading-none opacity-[0.12] select-none pointer-events-none">{cfg.icon}</span>
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

  if (compact) {
    return (
      <div className="card-surface rounded-xl overflow-hidden h-full flex flex-col">
        {/* Image / gradient */}
        <div className="relative w-full flex-shrink-0" style={{ paddingTop: "68%" }}>
          {item.image_url ? (
            <Image src={item.image_url} alt={name} fill className="object-cover" sizes="200px" />
          ) : (
            <GradientBg cfg={cfg} />
          )}
          {/* Badges */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
            {item.is_daily_special && (
              <span className="bg-gold text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm uppercase">✨</span>
            )}
            {item.is_bio && (
              <span className="bg-pine text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">🌱</span>
            )}
          </div>
          <div className="absolute top-1.5 right-1.5 flex gap-0.5">
            {item.is_vegan && (
              <span className="bg-pine/90 text-white p-1 rounded-full shadow-sm">
                <Sprout size={9} strokeWidth={2.5} />
              </span>
            )}
            {item.is_vegetarian && !item.is_vegan && (
              <span className="bg-emerald-600/90 text-white p-1 rounded-full shadow-sm">
                <Leaf size={9} strokeWidth={2.5} />
              </span>
            )}
          </div>
        </div>

        {/* Text */}
        <div className="px-3 pt-2.5 pb-3 flex flex-col flex-1">
          <h3 className="font-heading font-bold text-[13px] leading-snug text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-1">
            {name}
          </h3>
          {desc && (
            <p className="text-[11px] italic text-muted-light dark:text-muted-dark leading-relaxed line-clamp-2 mb-1.5">
              {desc}
            </p>
          )}
          <div className="mt-auto flex items-end justify-between gap-1">
            <div className="flex flex-wrap gap-0.5">
              {item.allergens.slice(0, 4).map((a) => (
                <span
                  key={a.id}
                  title={a.name_de}
                  className="text-[9px] font-bold text-zinc-500 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-700/60 rounded px-1 py-px"
                >
                  {a.code}
                </span>
              ))}
              {item.allergens.length > 4 && (
                <span className="text-[9px] text-muted-light dark:text-muted-dark">+{item.allergens.length - 4}</span>
              )}
            </div>
            <div className="shrink-0 text-right">
              {specialPrice != null && item.price != null && (
                <p className="text-[10px] line-through text-muted-light dark:text-muted-dark leading-none">
                  {formatPrice(item.price)}
                </p>
              )}
              {displayPrice != null && (
                <p className="price-text text-[14px] leading-none">{formatPrice(displayPrice)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-surface rounded-2xl overflow-hidden">
      {/* Image / gradient */}
      <div className="relative w-full" style={{ paddingTop: "42%" }}>
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

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {item.is_daily_special && (
            <span className="bg-gold text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md tracking-wide uppercase">
              ✨ Heute
            </span>
          )}
          {item.is_bio && (
            <span className="bg-pine text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase">
              🌱 Bio
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5 flex gap-1">
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

      {/* Text content */}
      <div className="px-4 pt-3 pb-3.5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-heading font-bold text-[16px] sm:text-[17px] leading-snug text-zinc-900 dark:text-zinc-100 flex-1 min-w-0">
            {name}
          </h3>
          <div className="shrink-0 text-right ml-2">
            {specialPrice != null && item.price != null && (
              <p className="text-[11px] line-through text-muted-light dark:text-muted-dark leading-none mb-0.5">
                {formatPrice(item.price)}
              </p>
            )}
            {displayPrice != null && (
              <p className="price-text text-[16px] sm:text-[17px] leading-none">
                {formatPrice(displayPrice)}
              </p>
            )}
          </div>
        </div>

        {desc && (
          <div className="mb-2.5">
            <p
              className={`text-[13px] italic text-muted-light dark:text-muted-dark leading-relaxed ${
                !expanded ? "line-clamp-2" : ""
              }`}
            >
              {desc}
            </p>
            {desc.length > 80 && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="text-[12px] text-gold font-semibold hover:text-gold-dark transition-colors mt-0.5"
              >
                {expanded ? "Weniger" : "Mehr lesen"}
              </button>
            )}
          </div>
        )}

        {item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {item.allergens.map((a) => (
              <AllergenBadge key={a.id} allergen={a} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
