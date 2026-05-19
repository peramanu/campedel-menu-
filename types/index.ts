export interface Category {
  id: string;
  slug: string;
  name_de: string;
  name_it: string;
  name_en: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Allergen {
  id: number;
  code: string;
  name_de: string;
  name_it: string;
  name_en: string;
  icon: string | null;
}

export interface MenuItem {
  id: string;
  category_id: string | null;
  name_de: string;
  name_it: string | null;
  name_en: string | null;
  description_de: string | null;
  description_it: string | null;
  description_en: string | null;
  price: number | null;
  price_glass: number | null;
  price_quarter: number | null;
  price_half: number | null;
  price_liter: number | null;
  image_url: string | null;
  is_available: boolean;
  is_daily_special: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  sort_order: number;
  wine_producer: string | null;
  wine_region: string | null;
  wine_doc: string | null;
  wine_style: string | null;
  wine_grapes: string[] | null;
  tasting_notes_de: string | null;
  tasting_notes_it: string | null;
  is_bio: boolean;
  created_at: string;
  updated_at: string;
  allergens?: Allergen[];
}

export interface MenuItemWithAllergens extends MenuItem {
  allergens: Allergen[];
}

export interface DailySpecial {
  id: string;
  item_id: string;
  special_date: string;
  special_price: number | null;
  note_de: string | null;
  note_it: string | null;
  note_en: string | null;
  item?: MenuItem;
}

export type Locale = "de" | "it" | "en";
