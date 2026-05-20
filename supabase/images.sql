-- ============================================================
-- Campedèl Image URLs — Run once in Supabase SQL editor
-- Photos: Pexels (free commercial use, no attribution required)
-- Food/drinks: 800×600 landscape  |  Wine bottles: 600×900 portrait
-- ============================================================

-- ── Kalte Vorspeisen ─────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/13690575/pexels-photo-13690575.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Gemischter Salat';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/18545156/pexels-photo-18545156.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Bretteljause mit Speck und Käse';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/7936662/pexels-photo-7936662.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Avokado-Tomatentatar mit Burrata und Wildkräutersalat';

-- ── Suppen ───────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/8054777/pexels-photo-8054777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Speckknödelsuppe';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/36285400/pexels-photo-36285400.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Spargelcremesuppe mit Brotcroutons';

-- ── Warme Vorspeisen ─────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/546945/pexels-photo-546945.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Hausgemachte Schlutzkrapfen mit Butter und Reibkäse';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/13995947/pexels-photo-13995947.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Knödeltris mit Butter und Reibkäse';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Hausgemachte Tortelloni mit Ricottafüllung, Bärlauch und Spargelragout';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/28559486/pexels-photo-28559486.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Brennnessel-Risotto mit frischem Spargel';

-- ── Hauptspeisen ─────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/27305335/pexels-photo-27305335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Entrecote vom Rind mit Kartoffelspalten, gemischtem Salat und Kräuterbutter';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/33502810/pexels-photo-33502810.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Campedèl-Burger mit Fleisch vom eigenen Grauvieh';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/9478368/pexels-photo-9478368.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Pfeffersteak "Campedèl" medium gebraten mit Röstkartoffeln und gemischtem Salat';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/12931072/pexels-photo-12931072.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Hofeigenes Rindsgulasch mit zwei Speckknödeln';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/1352270/pexels-photo-1352270.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Wienerschnitzel vom Hofkalb mit Pommes frites und Preiselbeermarmelade';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/4033037/pexels-photo-4033037.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Frische Stangenspargel mit Hausschinken, Naturkartoffeln und Bozner Sauce';

-- ── Kinder ───────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/33865568/pexels-photo-33865568.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Wienerschnitzel vom Hofkalb mit Pommes frites'
  AND category_id = (SELECT id FROM categories WHERE slug = 'kinder');

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/31637791/pexels-photo-31637791.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Spaghetti mit Tomatensauce oder Ragù';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/34329857/pexels-photo-34329857.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Grillwurst mit Pommes';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/15656541/pexels-photo-15656541.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Pommes frites';

-- ── Dessert ──────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/9589795/pexels-photo-9589795.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Buchteln mit Vanillesauce';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/14608732/pexels-photo-14608732.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Vanilleeis mit heißen Himbeeren';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/17770765/pexels-photo-17770765.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Zitronensorbet mit Limoncello';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/14093961/pexels-photo-14093961.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Apfelstrudel mit Vanillesauce';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/17628620/pexels-photo-17628620.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Crème brûlée mit frischen Erdbeeren';

-- ── Schaumwein ───────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/5157388/pexels-photo-5157388.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Arunda Brut';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/3642295/pexels-photo-3642295.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Zemmer Millesimato';

-- ── Weißwein ─────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/774455/pexels-photo-774455.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Michelstrunk Weiss';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/36560883/pexels-photo-36560883.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'T Cuvée Weiss';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/2909085/pexels-photo-2909085.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Gewürztraminer';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/5004027/pexels-photo-5004027.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Schulthaus Weissburgunder Pinot Bianco';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/33993981/pexels-photo-33993981.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Sylvaner';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/13257037/pexels-photo-13257037.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Kerner';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/295267/pexels-photo-295267.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Sauvignon';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/28989792/pexels-photo-28989792.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Sanct Valentin Sauvignon';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/774455/pexels-photo-774455.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Riesling';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/36560883/pexels-photo-36560883.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Fellis Chardonnay Riserva';

-- ── Rotwein ──────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/2909085/pexels-photo-2909085.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Michelstrunk Rot';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/5004027/pexels-photo-5004027.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Zeder';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/33993981/pexels-photo-33993981.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Soma';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/13257037/pexels-photo-13257037.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Cabernet Riserva';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/295267/pexels-photo-295267.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'St. Magdalener';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/28989792/pexels-photo-28989792.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Roan Zweigelt';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/774455/pexels-photo-774455.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Pinot Noir';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/36560883/pexels-photo-36560883.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Marith Blauburgunder';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/2909085/pexels-photo-2909085.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Glen Blauburgunder Riserva';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/5004027/pexels-photo-5004027.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Lagrein';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/33993981/pexels-photo-33993981.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Karl Lagrein Riserva';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/13257037/pexels-photo-13257037.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Huberfeld Merlot';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/295267/pexels-photo-295267.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Terre di San Leonardo';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/28989792/pexels-photo-28989792.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop'
  WHERE name_de = 'Amarone della Valpolicella DOCG';

-- ── Warme Getränke ───────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/11160148/pexels-photo-11160148.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Espresso';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/25409661/pexels-photo-25409661.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Macchiato';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/19873648/pexels-photo-19873648.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Doppelter Espresso';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Cappuccino';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/22221952/pexels-photo-22221952.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Latte Macchiato';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/35210027/pexels-photo-35210027.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Heiße Schokolade';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/5264675/pexels-photo-5264675.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Tee';

-- ── Getränke ─────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/8679349/pexels-photo-8679349.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Mineralwasser (sprudelnd)';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/10153721/pexels-photo-10153721.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Mineralwasser (still)';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/8679336/pexels-photo-8679336.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Apfelsaft';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/32767692/pexels-photo-32767692.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Skiwasser';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/8882541/pexels-photo-8882541.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Hausgemachter Himbeerensaft';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/8679349/pexels-photo-8679349.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Hausgemachter Holundersaft';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/10153721/pexels-photo-10153721.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Hausgemachter Melissensaft';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/32767692/pexels-photo-32767692.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Hausgemachte Cola';

-- ── Bier ─────────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/5858219/pexels-photo-5858219.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Kronen Forst Bier';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/1267681/pexels-photo-1267681.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Radler';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/33287155/pexels-photo-33287155.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Hefeweizen';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/27623973/pexels-photo-27623973.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Alkoholfreies Bier';

-- ── Aperitif ─────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/34621094/pexels-photo-34621094.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Aperitif Campedeller';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/20094378/pexels-photo-20094378.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Hugo';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/33228848/pexels-photo-33228848.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Veneziano (Aperolspritz)';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/5157388/pexels-photo-5157388.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Prosecco';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/36631083/pexels-photo-36631083.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Sanbitter Weiß';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/25396223/pexels-photo-25396223.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Gin Tonic Hendrick''s';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/25396220/pexels-photo-25396220.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Gin Tonic Illusionist';

-- ── Digestif ─────────────────────────────────────────────────
UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/6341420/pexels-photo-6341420.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Hausschnaps';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/51365/pexels-photo-51365.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Latschen';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/7254142/pexels-photo-7254142.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Nusseler';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/19539063/pexels-photo-19539063.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Zirmschnaps';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/16806670/pexels-photo-16806670.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Limoncello';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/6341420/pexels-photo-6341420.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Williams';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/51365/pexels-photo-51365.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Enzian';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/7254142/pexels-photo-7254142.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Treber';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/19539063/pexels-photo-19539063.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Heuschnaps';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/16806670/pexels-photo-16806670.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Branca Menta';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/6341420/pexels-photo-6341420.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Fernet Branca';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/51365/pexels-photo-51365.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Cynar';

UPDATE menu_items SET image_url = 'https://images.pexels.com/photos/7254142/pexels-photo-7254142.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
  WHERE name_de = 'Montenegro';
