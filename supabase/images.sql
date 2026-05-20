-- ============================================================
-- Campedèl Image URLs — Run once in Supabase SQL editor
-- All food photos: Unsplash (free commercial use, no attribution required)
-- ============================================================

-- ── Kalte Vorspeisen ─────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-qMAToTaK2Wk?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Gemischter Salat';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-K7FxfxYPPHQ?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Bretteljause mit Speck und Käse';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-YQnb0s2j1ZY?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Avokado-Tomatentatar mit Burrata und Wildkräutersalat';

-- ── Suppen ───────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-jxDPwLbiwY0?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Speckknödelsuppe';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-d7EswvJ7js0?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Spargelcremesuppe mit Brotcroutons';

-- ── Warme Vorspeisen ─────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-aSBdwZc0HC0?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Hausgemachte Schlutzkrapfen mit Butter und Reibkäse';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-4xja8zTvAB0?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Knödeltris mit Butter und Reibkäse';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-v2z6Yhp_6Gc?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Hausgemachte Tortelloni mit Ricottafüllung, Bärlauch und Spargelragout';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-VE7Qp7tknHk?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Brennnessel-Risotto mit frischem Spargel';

-- ── Hauptspeisen ─────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-UASX1DbM-ss?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Entrecote vom Rind mit Kartoffelspalten, gemischtem Salat und Kräuterbutter';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-4CPWFcEo8-A?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Campedèl-Burger mit Fleisch vom eigenen Grauvieh';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-e8x72csOKD8?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Pfeffersteak "Campedèl" medium gebraten mit Röstkartoffeln und gemischtem Salat';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-W41iZoThBCc?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Hofeigenes Rindsgulasch mit zwei Speckknödeln';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-MzVxrOWYmQQ?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Wienerschnitzel vom Hofkalb mit Pommes frites und Preiselbeermarmelade';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-uRtUISU_ir4?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Frische Stangenspargel mit Hausschinken, Naturkartoffeln und Bozner Sauce';

-- ── Kinder ───────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-NPX7l_C3-f8?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Wienerschnitzel vom Hofkalb mit Pommes frites'
  AND category_id = (SELECT id FROM categories WHERE slug = 'kinder');

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-6Qc4anXK_4A?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Spaghetti mit Tomatensauce oder Ragù';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-l72SozTFaVg?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Grillwurst mit Pommes';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-BkWowglS_Uk?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Pommes frites';

-- ── Dessert ──────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-bDeZFhF7OTw?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Buchteln mit Vanillesauce';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-D6gb_uB_ngw?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Vanilleeis mit heißen Himbeeren';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-_StTrvaLKiM?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Zitronensorbet mit Limoncello';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-TWuRUNsaQSw?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Apfelstrudel mit Vanillesauce';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-urrihe-POZo?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Crème brûlée mit frischen Erdbeeren';

-- ── Schaumwein ───────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-GB5JFfdbn9U?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Arunda Brut';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-OEwzdvNbzQA?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Zemmer Millesimato';

-- ── Weißwein ─────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-epHhP3H71sw?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Michelstrunk Weiss';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-LeKzNXMPOoQ?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'T Cuvée Weiss';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-H3QLXBmmgtA?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Gewürztraminer';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-PLbmUz6Bcv0?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Schulthaus Weissburgunder Pinot Bianco';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-VCP9cpXbQzw?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Sylvaner';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-epHhP3H71sw?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Kerner';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-LeKzNXMPOoQ?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Sauvignon';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-H3QLXBmmgtA?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Sanct Valentin Sauvignon';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-PLbmUz6Bcv0?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Riesling';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-VCP9cpXbQzw?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Fellis Chardonnay Riserva';

-- ── Rotwein ──────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-TlVSHQ824WA?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Michelstrunk Rot';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-hvtZ0nP3ZEU?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Zeder';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-4uH892ru0cM?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Soma';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-AsWtRAOf6v8?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Cabernet Riserva';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-3LOLTrIOmiA?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'St. Magdalener';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-TlVSHQ824WA?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Roan Zweigelt';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-hvtZ0nP3ZEU?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Pinot Noir';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-4uH892ru0cM?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Marith Blauburgunder';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-AsWtRAOf6v8?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Glen Blauburgunder Riserva';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-3LOLTrIOmiA?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Lagrein';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-TlVSHQ824WA?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Karl Lagrein Riserva';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-hvtZ0nP3ZEU?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Huberfeld Merlot';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-4uH892ru0cM?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Terre di San Leonardo';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-AsWtRAOf6v8?w=600&h=900&fit=crop&auto=format&q=80'
  WHERE name_de = 'Amarone della Valpolicella DOCG';

-- ── Warme Getränke ───────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-8blVdQB0hoI?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Espresso';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-jn-HaGWe4yw?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Macchiato';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-YhvnrNOn5mA?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Doppelter Espresso';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-rje7IsHtrDM?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Cappuccino';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-zUNs99PGDg0?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Latte Macchiato';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-7tMcFanKXes?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Heiße Schokolade';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-NtmNhrdfs-o?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Tee';

-- ── Getränke ─────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-gzReh-lileQ?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Mineralwasser (sprudelnd)';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-dpk17SKcGkc?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Mineralwasser (still)';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-LFQNBLNr7_o?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Apfelsaft';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-27gLXMCvPz4?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Skiwasser';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-pxTe1qZjcvI?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Hausgemachter Himbeerensaft';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-0EioTNwCnHs?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Hausgemachter Holundersaft';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-soeQXvqJL8g?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Hausgemachter Melissensaft';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-HxhzyTmp5w0?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Hausgemachte Cola';

-- ── Bier ─────────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-emxnsiKpqAE?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Kronen Forst Bier';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-dVExcKdtj8A?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Radler';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-KFiREr-2q5c?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Hefeweizen';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-BRYE_0pkLJ0?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Alkoholfreies Bier';

-- ── Aperitif ─────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-kp_fOHufXS4?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Aperitif Campedeller';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-JjGLEN7T8xI?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Hugo';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-NrKLy6hF4ho?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Veneziano (Aperolspritz)';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-Yh2eTJQwsTg?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Prosecco';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-YCj4q9AArtk?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Sanbitter Weiß';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-DmAddqLiNqk?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Gin Tonic Hendrick''s';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-KlY0qsu8ElM?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Gin Tonic Illusionist';

-- ── Digestif ─────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-Kz9NrJGrCV4?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Hausschnaps';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-orVT-sK83yY?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Latschen';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-c4B0NyGj3EE?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Nusseler';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-xQcGdP_A6Rs?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Zirmschnaps';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-TeuzA_e3QaI?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Limoncello';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-Kz9NrJGrCV4?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Williams';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-orVT-sK83yY?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Enzian';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-c4B0NyGj3EE?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Treber';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-xQcGdP_A6Rs?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Heuschnaps';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-TeuzA_e3QaI?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Branca Menta';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-Kz9NrJGrCV4?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Fernet Branca';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-orVT-sK83yY?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Cynar';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-c4B0NyGj3EE?w=800&h=600&fit=crop&auto=format&q=80'
  WHERE name_de = 'Montenegro';
