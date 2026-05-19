"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, Sprout, Star, Award } from "lucide-react";
import { AllergenBadge } from "./AllergenBadge";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import type { MenuItemWithAllergens } from "@/types";
import type { Locale } from "@/types";

const CATEGORY_GRADIENTS: Record<string, string> = {
  "kalte-vorspeisen": "from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20",
  "suppen": "from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20",
  "warme-vorspeisen": "from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20",
  "hauptspeisen": "from-stone-100 to-zinc-100 dark:from-stone-900/20 dark:to-zinc-900/20",
  "kinder": "from-yellow-100 to-lime-100 dark:from-yellow-900/20 dark:to-lime-900/20",
  "dessert": "from-purple-100 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20",
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
  const gradient = CATEGORY_GRADIENTS[categorySlug] || CATEGORY_GRADIENTS["hauptspeisen"];
  const displayPrice = specialPrice ?? item.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card dark:shadow-card-dark overflow-hidden"
    >
      {/* Image / Gradient */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 640px"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-4xl opacity-40">{getCategoryEmoji(categorySlug)}</span>
          </div>
        )}
        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {item.is_daily_special && (
            <span className="bg-gold text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              ✨ Heute
            </span>
          )}
          {item.is_bio && (
            <span className="bg-pine text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              🌱 BIO
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          {item.is_vegan && (
            <span className="bg-pine/90 text-white p-1 rounded-full shadow" title="Vegan">
              <Sprout size={12} />
            </span>
          )}
          {item.is_vegetarian && !item.is_vegan && (
            <span className="bg-emerald-600/90 text-white p-1 rounded-full shadow" title="Vegetarisch">
              <Leaf size={12} />
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-heading font-bold text-[18px] leading-snug text-zinc-900 dark:text-zinc-100 flex-1">
            {name}
          </h3>
          <div className="text-right shrink-0">
            {specialPrice != null && (
              <p className="text-xs line-through text-muted-light dark:text-muted-dark">
                {formatPrice(item.price!)}
              </p>
            )}
            <p className="font-bold text-gold text-lg">
              {displayPrice != null ? formatPrice(displayPrice) : ""}
            </p>
          </div>
        </div>

        {desc && (
          <div className="mb-3">
            <p className={`text-sm italic text-muted-light dark:text-muted-dark leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}>
              {desc}
            </p>
            {desc.length > 80 && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="text-xs text-gold mt-0.5 font-medium"
              >
                {expanded ? "Weniger" : "Mehr lesen"}
              </button>
            )}
          </div>
        )}

        {item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.allergens.map((a) => (
              <AllergenBadge key={a.id} allergen={a} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function getCategoryEmoji(slug: string): string {
  const map: Record<string, string> = {
    "kalte-vorspeisen": "🥗", "suppen": "🍲", "warme-vorspeisen": "🍝",
    "hauptspeisen": "🍽️", "kinder": "👶", "dessert": "🍮",
    "schaumwein": "🥂", "weisswein": "🍾", "rotwein": "🍷",
    "warme-getraenke": "☕", "getraenke": "🥤", "bier": "🍺",
    "aperitif": "🍸", "digestif": "🥃",
  };
  return map[slug] || "🍽️";
}
