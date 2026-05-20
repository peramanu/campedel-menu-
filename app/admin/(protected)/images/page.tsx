import { createSupabaseServerClient } from "@/lib/supabase-server";
import { BulkImageClient } from "@/components/admin/BulkImageClient";
import type { Category, MenuItem } from "@/types";

export default async function ImagesPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: items }, { data: categories }] = await Promise.all([
    supabase
      .from("menu_items")
      .select("id, name_de, category_id, image_url, sort_order")
      .order("sort_order"),
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  return (
    <BulkImageClient
      items={(items ?? []) as MenuItem[]}
      categories={(categories ?? []) as Category[]}
    />
  );
}
