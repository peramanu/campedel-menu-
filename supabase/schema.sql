-- ============================================================
-- Campedèl Digital Menu — Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Categories ───────────────────────────────────────────────
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_de TEXT NOT NULL,
  name_it TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Menu Items ───────────────────────────────────────────────
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name_de TEXT NOT NULL,
  name_it TEXT,
  name_en TEXT,
  description_de TEXT,
  description_it TEXT,
  description_en TEXT,
  price DECIMAL(8,2),
  price_glass DECIMAL(8,2),
  price_quarter DECIMAL(8,2),
  price_half DECIMAL(8,2),
  price_liter DECIMAL(8,2),
  image_url TEXT,
  is_available BOOL DEFAULT true,
  is_daily_special BOOL DEFAULT false,
  is_vegetarian BOOL DEFAULT false,
  is_vegan BOOL DEFAULT false,
  sort_order INT DEFAULT 0,
  -- Wine-specific
  wine_producer TEXT,
  wine_region TEXT,
  wine_doc TEXT,
  wine_style TEXT,
  wine_grapes TEXT[],
  tasting_notes_de TEXT,
  tasting_notes_it TEXT,
  is_bio BOOL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Allergens (EU Regulation 1169/2011) ──────────────────────
CREATE TABLE allergens (
  id INT PRIMARY KEY,
  code TEXT NOT NULL,
  name_de TEXT NOT NULL,
  name_it TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT
);

-- ── Item ↔ Allergen ──────────────────────────────────────────
CREATE TABLE item_allergens (
  item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  allergen_id INT REFERENCES allergens(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, allergen_id)
);

-- ── Daily Specials ───────────────────────────────────────────
CREATE TABLE daily_specials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  special_date DATE NOT NULL,
  special_price DECIMAL(8,2),
  note_de TEXT,
  note_it TEXT,
  note_en TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Auto-update trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_specials ENABLE ROW LEVEL SECURITY;

-- Public read access (guests)
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read allergens" ON allergens FOR SELECT USING (true);
CREATE POLICY "Public read item_allergens" ON item_allergens FOR SELECT USING (true);
CREATE POLICY "Public read daily_specials" ON daily_specials FOR SELECT USING (true);

-- Authenticated write access (admin)
CREATE POLICY "Auth insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update categories" ON categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete categories" ON categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert menu_items" ON menu_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update menu_items" ON menu_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete menu_items" ON menu_items FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert item_allergens" ON item_allergens FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth delete item_allergens" ON item_allergens FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert daily_specials" ON daily_specials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update daily_specials" ON daily_specials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete daily_specials" ON daily_specials FOR DELETE TO authenticated USING (true);
