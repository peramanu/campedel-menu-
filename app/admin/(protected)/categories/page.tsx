import { createSupabaseServerClient } from "@/lib/supabase-server";
import { CategoriesClient } from "./CategoriesClient";
import type { Category } from "@/types";

export default async function CategoriesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return <CategoriesClient initialCategories={(data ?? []) as Category[]} />;
}
