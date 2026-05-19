import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getLocale } from "next-intl/server";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { MenuPageClient } from "@/components/menu/MenuPageClient";
import type { Category, MenuItemWithAllergens, DailySpecial, Locale } from "@/types";

export const revalidate = 60;

async function getData() {
  const supabase = await createSupabaseServerClient();

  const [categoriesRes, itemsRes, specialsRes] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("menu_items")
      .select(`*, allergens:item_allergens(allergen:allergens(*))`)
      .eq("is_available", true)
      .order("sort_order"),
    supabase
      .from("daily_specials")
      .select("*")
      .gte("special_date", new Date().toISOString().split("T")[0]),
  ]);

  const items: MenuItemWithAllergens[] = (itemsRes.data ?? []).map((item: any) => ({
    ...item,
    allergens: (item.allergens ?? []).map((ia: any) => ia.allergen).filter(Boolean),
  }));

  return {
    categories: (categoriesRes.data ?? []) as Category[],
    items,
    dailySpecials: (specialsRes.data ?? []) as DailySpecial[],
  };
}

export default async function MenuPage() {
  const locale = (await getLocale()) as Locale;
  const { categories, items, dailySpecials } = await getData();

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <MenuHeader locale={locale} />
      <MenuPageClient
        categories={categories}
        items={items}
        dailySpecials={dailySpecials}
        locale={locale}
      />
    </div>
  );
}
