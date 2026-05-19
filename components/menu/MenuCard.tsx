"use client";
import { useState } from "react";
import Image from "next/image";
import { Leaf, Sprout } from "lucide-react";
import { AllergenBadge } from "./AllergenBadge";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import type { MenuItemWithAllergens, Locale } from "@/types";

const CAT_COLORS: Record<string, { from: string; to: string; icon: string }> = {
  "kalte-vorspeisen": { from: "#d1fae5", to: "#a7f3d0", icon: "🥗" },
  "suppen":           { from: "#fef3c7", to: "#fde68a", icon: "🍲" },
  "warme-vorspeisen": { from: "#fce7f3", to: "#fbcfe8", icon: "🍝" },
  "hauptspeisen":     { from: "#f1f5f9", to: "#e2e8f0", icon: "🍽️" },
  "kinder":           { from: "#fef9c3", to: "#fef08a", icon: "👶" },
  "dessert":          { from: "#f3e8ff", to: "#e9d5ff", icon: "🍮" },
  "warme-getraenke":  { from: "#fff7ed", to: "#fed7aa", icon: "☕" },
  "getraenke":        { from: "#eff6ff", to: "#bfdbfe", icon: "🥤" },
  "bier":             { from: "#fefce8", to: "#fef08a", icon: "🍺" },
  "aperitif":         { from: "#fdf4ff", to: "#f5d0fe", icon: "🍸" },
  "digestif":         { from: "#fdf2f8", to: "#fbcfe8", icon: "🥃" },
};
const CAT_DARK_COLORS: Record<string, { from: string; to: string }> = {
  "kalte-vorspeisen": { from: "#052e16", to: "#064e3b" },
  "suppen":           { from: "#431407", to: "#78350f" },
  "warme-vorspeisen": { from: "#4a044e", to: "#831843" },
  "hauptspeisen":     { from: "#1e293b", to: "#334155" },
  "kinder":           { from: "#422006", to: "#713f12" },
  "dessert":          { from: "#3b0764", to: "#581c87" },
  "warme-getraenke":  { from: "#431407", to: "#7c2d12" },
  "getraenke":        { from: "#1e3a5f", to: "#1e40af" },
  "bier":             { from: "#422006", to: "#78350f" },
  "aperitif":         { from: "#4a044e", to: "#6b21a8" },
  "digestif":         { from: "#4a044e", to: "#831843" },
};

export function MenuCard({
  item,
  locale,
  categorySlug,
  specialPrice,
}: {
  item: MenuItemWithAllergens;
  locale: Locale;
  categorySlug: string;
  specialPrice?: number | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const name = getLocalizedField(item, "name", locale);
  const desc = getLocalizedField(item, "description", locale);
  const catLight = CAT_COLORS[categorySlug] ?? CAT_COLORS["hauptspeisen"];
  const catDark  = CAT_DARK_COLORS[categorySlug] ?? CAT_DARK_COLORS["hauptspeisen"];
  const displayPrice = specialPrice ?? item.price;

  return (
    <div className="card-surface rounded-2xl overflow-hidden">
      {/* Image / gradient top */}
      <div className="relative" style={{ aspectRatio: "16/8" }}>
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 640px"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 block dark:hidden"
              style={{
                background: `linear-gradient(135deg, ${catLight.from}, ${catLight.to})`,
              }}
            />
            <div
              className="absolute inset-0 hidden dark:block"
              style={{
                background: `linear-gradient(135deg, ${catDark.from}, ${catDark.to})`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl opacity-20 select-none">{catLight.icon}</span>
            </div>
          </>
        )}

        {/* Status ribbons */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {item.is_daily_special && (
            <span className="bg-gold text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md tracking-wide">
              ✨ Tagesangebot
            </span>
          )}
          {item.is_bio && (
            <span className="bg-pine text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
              🌱 BIO
            </span>
          )}
        </div>

        {/* Diet icons */}
        <div className="absolute top-2.5 right-2.5 flex gap-1">
          {item.is_vegan && (
            <span className="bg-pine/90 text-white p-1.5 rounded-full shadow-md" title="Vegan">
              <Sprout size={11} />
            </span>
          )}
          {item.is_vegetarian && !item.is_vegan && (
            <span className="bg-emerald-600/90 text-white p-1.5 rounded-full shadow-md" title="Vegetarisch">
              <Leaf size={11} />
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-3.5 pb-4">
        {/* Name + price row */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-heading font-bold text-[17px] leading-snug text-zinc-900 dark:text-zinc-100 flex-1">
            {name}
          </h3>
          <div className="shrink-0 text-right">
            {specialPrice != null && item.price != null && (
              <p className="text-xs line-through text-muted-light dark:text-muted-dark leading-none mb-0.5">
                {formatPrice(item.price)}
              </p>
            )}
            {displayPrice != null && (
              <p className="price-text text-[17px] leading-none">
                {formatPrice(displayPrice)}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {desc && (
          <div className="mb-3">
            <p className={`text-[13px] italic text-muted-light dark:text-muted-dark leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}>
              {desc}
            </p>
            {desc.length > 90 && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="text-[12px] text-gold font-semibold mt-0.5 hover:text-gold-dark transition-colors"
              >
                {expanded ? "Weniger" : "Mehr lesen"}
              </button>
            )}
          </div>
        )}

        {/* Allergens */}
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
