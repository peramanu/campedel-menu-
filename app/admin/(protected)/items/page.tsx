import { createSupabaseServerClient } from "@/lib/supabase-server";
import { ItemsClient } from "./ItemsClient";
import type { Category, MenuItemWithAllergens } from "@/types";

export default async function ItemsPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: categories }, { data: rawItems }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase
      .from("menu_items")
      .select(`*, allergens:item_allergens(allergen:allergens(*))`)
      .order("category_id")
      .order("sort_order"),
  ]);

  const items: MenuItemWithAllergens[] = (rawItems ?? []).map((item: any) => ({
    ...item,
    allergens: (item.allergens ?? []).map((ia: any) => ia.allergen).filter(Boolean),
  }));

  return (
    <ItemsClient
      categories={(categories ?? []) as Category[]}
      initialItems={items}
    />
  );
}
