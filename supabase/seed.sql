-- ============================================================
-- Campedèl Digital Menu — Seed Data
-- ============================================================

-- ── Allergens (EU Reg. 1169/2011 — all 14) ───────────────────
INSERT INTO allergens (id, code, name_de, name_it, name_en, icon) VALUES
  (1,  'A', 'Gluten (Weizen, Roggen, Gerste...)', 'Glutine', 'Gluten', '🌾'),
  (2,  'B', 'Krebstiere', 'Crostacei', 'Crustaceans', '🦐'),
  (3,  'C', 'Eier', 'Uova', 'Eggs', '🥚'),
  (4,  'D', 'Fisch', 'Pesce', 'Fish', '🐟'),
  (5,  'E', 'Erdnüsse', 'Arachidi', 'Peanuts', '🥜'),
  (6,  'F', 'Soja', 'Soia', 'Soy', '🫘'),
  (7,  'G', 'Milch/Laktose', 'Latte/Lattosio', 'Milk/Lactose', '🥛'),
  (8,  'H', 'Schalenfrüchte (Nüsse)', 'Frutta a guscio', 'Tree nuts', '🌰'),
  (9,  'L', 'Sellerie', 'Sedano', 'Celery', '🥬'),
  (10, 'M', 'Senf', 'Senape', 'Mustard', '🟡'),
  (11, 'N', 'Sesam', 'Sesamo', 'Sesame', '⚪'),
  (12, 'O', 'Schwefeldioxid/Sulfite', 'Anidride solforosa', 'Sulphur dioxide', '🍷'),
  (13, 'P', 'Lupinen', 'Lupini', 'Lupin', '🌿'),
  (14, 'R', 'Weichtiere', 'Molluschi', 'Molluscs', '🦑');

-- ── Categories ───────────────────────────────────────────────
INSERT INTO categories (slug, name_de, name_it, name_en, icon, sort_order) VALUES
  ('kalte-vorspeisen',  'Kalte Vorspeisen',  'Antipasti',         'Starters',        '🥗', 1),
  ('suppen',            'Suppen',            'Zuppe',             'Soups',           '🍲', 2),
  ('warme-vorspeisen',  'Warme Vorspeisen',  'Primi piatti',      'First Courses',   '🍝', 3),
  ('hauptspeisen',      'Hauptspeisen',      'Piatti principali', 'Main Courses',    '🍽️', 4),
  ('kinder',            'Für Kinder',        'Per i bambini',     'For Kids',        '👶', 5),
  ('dessert',           'Dessert',           'Dolci',             'Desserts',        '🍮', 6),
  ('schaumwein',        'Schaumwein',        'Bollicine',         'Sparkling Wine',  '🥂', 7),
  ('weisswein',         'Weißwein',          'Vino bianco',       'White Wine',      '🍾', 8),
  ('rotwein',           'Rotwein',           'Vino rosso',        'Red Wine',        '🍷', 9),
  ('warme-getraenke',   'Warme Getränke',    'Bevande calde',     'Hot Drinks',      '☕', 10),
  ('getraenke',         'Getränke',          'Bibite',            'Drinks',          '🥤', 11),
  ('bier',              'Bier',              'Birra',             'Beer',            '🍺', 12),
  ('aperitif',          'Aperitif',          'Aperitivi',         'Aperitifs',       '🍸', 13),
  ('digestif',          'Digestif',          'Digestivi',         'Digestifs',       '🥃', 14);

-- ── Helper: get category id by slug ──────────────────────────
-- We use a subselect pattern throughout

-- ── Kalte Vorspeisen ─────────────────────────────────────────
WITH ins AS (
  INSERT INTO menu_items (category_id, name_de, name_it, name_en, description_de, description_it, description_en, price, sort_order, is_vegetarian)
  VALUES
    ((SELECT id FROM categories WHERE slug='kalte-vorspeisen'), 'Gemischter Salat', 'Insalata mista', 'Mixed salad',
     'Frische Blattsalate der Saison', 'Insalata di stagione fresca', 'Fresh seasonal leaf salad', 6.00, 1, true),
    ((SELECT id FROM categories WHERE slug='kalte-vorspeisen'), 'Bretteljause mit Speck und Käse', 'Tagliere con speck e formaggio', 'Cold cuts board with speck and cheese',
     'Südtiroler Speck, Bergkäse, hausgemachtes Brot', 'Speck altoatesino, formaggio di montagna, pane fatto in casa', 'South Tyrolean speck, mountain cheese, homemade bread', 15.90, 2, false),
    ((SELECT id FROM categories WHERE slug='kalte-vorspeisen'), 'Avokado-Tomatentatar mit Burrata und Wildkräutersalat', 'Tartare di avocado e pomodoro con burrata e insalata di erbe selvatiche', 'Avocado-tomato tartare with burrata and wild herb salad',
     'Avokado, reife Tomaten, Burrata, aromatische Wildkräuter', 'Avocado, pomodori maturi, burrata, erbe selvatiche aromatiche', 'Avocado, ripe tomatoes, burrata, aromatic wild herbs', 16.90, 3, true)
  RETURNING id, name_de
)
INSERT INTO item_allergens (item_id, allergen_id)
SELECT i.id, a.allergen_id FROM ins i
JOIN (VALUES
  ('Gemischter Salat', 9),
  ('Bretteljause mit Speck und Käse', 7),
  ('Bretteljause mit Speck und Käse', 1),
  ('Avokado-Tomatentatar mit Burrata und Wildkräutersalat', 7),
  ('Avokado-Tomatentatar mit Burrata und Wildkräutersalat', 9)
) AS a(name_de, allergen_id) ON i.name_de = a.name_de;

-- ── Suppen ───────────────────────────────────────────────────
WITH ins AS (
  INSERT INTO menu_items (category_id, name_de, name_it, name_en, description_de, description_it, description_en, price, sort_order)
  VALUES
    ((SELECT id FROM categories WHERE slug='suppen'), 'Speckknödelsuppe', 'Brodo con canederli allo speck', 'Speck dumpling soup',
     'Hausgemachter Speckknödel in klarer Rindsbrühe', 'Canederlo allo speck fatto in casa in brodo di manzo chiaro', 'Homemade speck dumpling in clear beef broth', 12.90, 1),
    ((SELECT id FROM categories WHERE slug='suppen'), 'Spargelcremesuppe mit Brotcroutons', 'Crema di asparagi con crostini di pane', 'Cream of asparagus soup with croutons',
     'Saisonale Spargelcremesuppe, knusprige Croutons', 'Crema di asparagi di stagione, crostini croccanti', 'Seasonal cream of asparagus, crispy croutons', 9.90, 2)
  RETURNING id, name_de
)
INSERT INTO item_allergens (item_id, allergen_id)
SELECT i.id, a.allergen_id FROM ins i
JOIN (VALUES
  ('Speckknödelsuppe', 1),
  ('Speckknödelsuppe', 3),
  ('Speckknödelsuppe', 7),
  ('Spargelcremesuppe mit Brotcroutons', 1),
  ('Spargelcremesuppe mit Brotcroutons', 7),
  ('Spargelcremesuppe mit Brotcroutons', 9)
) AS a(name_de, allergen_id) ON i.name_de = a.name_de;

-- ── Warme Vorspeisen ─────────────────────────────────────────
WITH ins AS (
  INSERT INTO menu_items (category_id, name_de, name_it, name_en, description_de, description_it, description_en, price, sort_order, is_vegetarian)
  VALUES
    ((SELECT id FROM categories WHERE slug='warme-vorspeisen'), 'Hausgemachte Schlutzkrapfen mit Butter und Reibkäse', 'Mezzelune fatte in casa con burro e formaggio grattugiato', 'Homemade Schlutzkrapfen with butter and grated cheese',
     'Hausgemachte Teigtaschen gefüllt mit Spinat-Ricotta, braune Butter, Reibkäse', 'Pasta fatta in casa ripiena di spinaci e ricotta, burro nocciola, formaggio grattugiato', 'Homemade pasta filled with spinach-ricotta, brown butter, grated cheese', 15.50, 1, true),
    ((SELECT id FROM categories WHERE slug='warme-vorspeisen'), 'Knödeltris mit Butter und Reibkäse', 'Tris di canederli con burro e formaggio grattugiato', 'Dumpling trio with butter and grated cheese',
     'Drei verschiedene Knödel: Speck, Spinat, Käse', 'Tre canederli diversi: speck, spinaci, formaggio', 'Three different dumplings: speck, spinach, cheese', 16.50, 2, false),
    ((SELECT id FROM categories WHERE slug='warme-vorspeisen'), 'Hausgemachte Tortelloni mit Ricottafüllung, Bärlauch und Spargelragout', 'Tortelloni fatti in casa con ricotta, aglio orsino e ragù di asparagi', 'Homemade tortelloni with ricotta filling, wild garlic and asparagus ragout',
     'Großzügige Tortelloni, aromatischer Bärlauch, saisonales Spargelragout', 'Grandi tortelloni, aglio orsino aromatico, ragù di asparagi di stagione', 'Generous tortelloni, aromatic wild garlic, seasonal asparagus ragout', 16.50, 3, true),
    ((SELECT id FROM categories WHERE slug='warme-vorspeisen'), 'Brennnessel-Risotto mit frischem Spargel', 'Risotto di ortica con asparagi freschi', 'Nettle risotto with fresh asparagus',
     'Cremiges Risotto mit jungen Brennnesseln und knackigem Frühlingsgemüse', 'Risotto cremoso con ortiche giovani e verdure primaverili croccanti', 'Creamy risotto with young nettles and crisp spring vegetables', 16.90, 4, true)
  RETURNING id, name_de
)
INSERT INTO item_allergens (item_id, allergen_id)
SELECT i.id, a.allergen_id FROM ins i
JOIN (VALUES
  ('Hausgemachte Schlutzkrapfen mit Butter und Reibkäse', 1),
  ('Hausgemachte Schlutzkrapfen mit Butter und Reibkäse', 3),
  ('Hausgemachte Schlutzkrapfen mit Butter und Reibkäse', 7),
  ('Knödeltris mit Butter und Reibkäse', 1),
  ('Knödeltris mit Butter und Reibkäse', 3),
  ('Knödeltris mit Butter und Reibkäse', 7),
  ('Hausgemachte Tortelloni mit Ricottafüllung, Bärlauch und Spargelragout', 1),
  ('Hausgemachte Tortelloni mit Ricottafüllung, Bärlauch und Spargelragout', 3),
  ('Hausgemachte Tortelloni mit Ricottafüllung, Bärlauch und Spargelragout', 7),
  ('Hausgemachte Tortelloni mit Ricottafüllung, Bärlauch und Spargelragout', 9),
  ('Brennnessel-Risotto mit frischem Spargel', 7),
  ('Brennnessel-Risotto mit frischem Spargel', 9)
) AS a(name_de, allergen_id) ON i.name_de = a.name_de;

-- ── Hauptspeisen ─────────────────────────────────────────────
WITH ins AS (
  INSERT INTO menu_items (category_id, name_de, name_it, name_en, description_de, description_it, description_en, price, sort_order)
  VALUES
    ((SELECT id FROM categories WHERE slug='hauptspeisen'), 'Entrecote vom Rind mit Kartoffelspalten, gemischtem Salat und Kräuterbutter', 'Entrecôte di manzo con patate a spicchi, insalata mista e burro alle erbe', 'Beef entrecôte with potato wedges, mixed salad and herb butter',
     'Saftiges Entrecote vom Südtiroler Rind, Kräuterbutter, Kartoffelspalten', 'Succosa entrecôte di manzo altoatesino, burro alle erbe, patate a spicchi', 'Juicy South Tyrolean beef entrecôte, herb butter, potato wedges', 28.50, 1),
    ((SELECT id FROM categories WHERE slug='hauptspeisen'), 'Campedèl-Burger mit Fleisch vom eigenen Grauvieh', 'Burger Campedèl con carne del proprio bestiame grigio', 'Campedèl burger with our own grey cattle meat',
     'Hofeigenes Grauvieh-Patty, Brioche-Bun, hausgemachte Saucen', 'Patty di bestiame grigio di fattoria, brioche, salse fatte in casa', 'Our own grey cattle patty, brioche bun, homemade sauces', 18.90, 2),
    ((SELECT id FROM categories WHERE slug='hauptspeisen'), 'Pfeffersteak "Campedèl" medium gebraten mit Röstkartoffeln und gemischtem Salat', 'Bistecca al pepe "Campedèl" media cottura con patate arrosto e insalata mista', 'Pepper steak "Campedèl" medium with roasted potatoes and mixed salad',
     'Premium Rindfleisch mit Pfefferkruste, cremige Pfeffersauce', 'Manzo premium con crosta di pepe, salsa al pepe cremosa', 'Premium beef with pepper crust, creamy pepper sauce', 34.00, 3),
    ((SELECT id FROM categories WHERE slug='hauptspeisen'), 'Hofeigenes Rindsgulasch mit zwei Speckknödeln', 'Gulasch di manzo di fattoria con due canederli allo speck', 'Our own beef goulash with two speck dumplings',
     'Langsam geschmortes Rindsgulasch, hausgemachte Speckknödel', 'Gulasch di manzo brasato lentamente, canederli allo speck fatti in casa', 'Slowly braised beef goulash, homemade speck dumplings', 19.50, 4),
    ((SELECT id FROM categories WHERE slug='hauptspeisen'), 'Wienerschnitzel vom Hofkalb mit Pommes frites und Preiselbeermarmelade', 'Cotoletta alla viennese di vitello di fattoria con patate fritte e marmellata di mirtilli rossi', 'Wiener schnitzel from our own veal with french fries and cranberry jam',
     'Zartes Kalbsschnitzel, goldbraun paniert, Preiselbeeren', 'Tenera cotoletta di vitello, impanata dorata, mirtilli rossi', 'Tender veal schnitzel, golden breaded, cranberries', 22.90, 5),
    ((SELECT id FROM categories WHERE slug='hauptspeisen'), 'Frische Stangenspargel mit Hausschinken, Naturkartoffeln und Bozner Sauce', 'Asparagi freschi con prosciutto cotto, patate naturali e salsa bolzanina', 'Fresh asparagus with cooked ham, natural potatoes and Bolzano sauce',
     'Saisonaler weißer/grüner Spargel, Bozner Sauce, Naturkartoffeln', 'Asparagi stagionali bianchi/verdi, salsa bolzanina, patate naturali', 'Seasonal white/green asparagus, Bolzano sauce, natural potatoes', 23.90, 6)
  RETURNING id, name_de
)
INSERT INTO item_allergens (item_id, allergen_id)
SELECT i.id, a.allergen_id FROM ins i
JOIN (VALUES
  ('Entrecote vom Rind mit Kartoffelspalten, gemischtem Salat und Kräuterbutter', 7),
  ('Entrecote vom Rind mit Kartoffelspalten, gemischtem Salat und Kräuterbutter', 10),
  ('Entrecote vom Rind mit Kartoffelspalten, gemischtem Salat und Kräuterbutter', 9),
  ('Campedèl-Burger mit Fleisch vom eigenen Grauvieh', 1),
  ('Campedèl-Burger mit Fleisch vom eigenen Grauvieh', 3),
  ('Campedèl-Burger mit Fleisch vom eigenen Grauvieh', 7),
  ('Campedèl-Burger mit Fleisch vom eigenen Grauvieh', 10),
  ('Pfeffersteak "Campedèl" medium gebraten mit Röstkartoffeln und gemischtem Salat', 7),
  ('Pfeffersteak "Campedèl" medium gebraten mit Röstkartoffeln und gemischtem Salat', 9),
  ('Hofeigenes Rindsgulasch mit zwei Speckknödeln', 1),
  ('Hofeigenes Rindsgulasch mit zwei Speckknödeln', 3),
  ('Hofeigenes Rindsgulasch mit zwei Speckknödeln', 7),
  ('Hofeigenes Rindsgulasch mit zwei Speckknödeln', 9),
  ('Wienerschnitzel vom Hofkalb mit Pommes frites und Preiselbeermarmelade', 1),
  ('Wienerschnitzel vom Hofkalb mit Pommes frites und Preiselbeermarmelade', 3),
  ('Wienerschnitzel vom Hofkalb mit Pommes frites und Preiselbeermarmelade', 7),
  ('Frische Stangenspargel mit Hausschinken, Naturkartoffeln und Bozner Sauce', 3),
  ('Frische Stangenspargel mit Hausschinken, Naturkartoffeln und Bozner Sauce', 7),
  ('Frische Stangenspargel mit Hausschinken, Naturkartoffeln und Bozner Sauce', 10)
) AS a(name_de, allergen_id) ON i.name_de = a.name_de;

-- ── Kinder ───────────────────────────────────────────────────
WITH ins AS (
  INSERT INTO menu_items (category_id, name_de, name_it, name_en, description_de, description_it, description_en, price, sort_order)
  VALUES
    ((SELECT id FROM categories WHERE slug='kinder'), 'Wienerschnitzel vom Hofkalb mit Pommes frites', 'Cotoletta alla viennese di vitello con patate fritte', 'Wiener schnitzel with french fries',
     'Kleines Kalbsschnitzel, knusprige Pommes', 'Piccola cotoletta di vitello, patatine croccanti', 'Small veal schnitzel, crispy fries', 15.00, 1),
    ((SELECT id FROM categories WHERE slug='kinder'), 'Spaghetti mit Tomatensauce oder Ragù', 'Spaghetti al pomodoro o al ragù', 'Spaghetti with tomato sauce or ragù',
     'Hausgemachte Tomatensauce oder klassisches Fleischragù', 'Salsa di pomodoro fatta in casa o classico ragù di carne', 'Homemade tomato sauce or classic meat ragù', 9.50, 2),
    ((SELECT id FROM categories WHERE slug='kinder'), 'Grillwurst mit Pommes', 'Salsiccia alla griglia con patatine', 'Grilled sausage with fries',
     'Saftige Grillwurst vom Grill, goldene Pommes', 'Salsiccia succosa alla griglia, patatine dorate', 'Juicy grilled sausage, golden fries', 9.50, 3),
    ((SELECT id FROM categories WHERE slug='kinder'), 'Pommes frites', 'Patatine fritte', 'French fries',
     'Knusprig goldene Pommes frites', 'Patatine fritte croccanti dorate', 'Crispy golden french fries', 6.00, 4)
  RETURNING id, name_de
)
INSERT INTO item_allergens (item_id, allergen_id)
SELECT i.id, a.allergen_id FROM ins i
JOIN (VALUES
  ('Wienerschnitzel vom Hofkalb mit Pommes frites', 1),
  ('Wienerschnitzel vom Hofkalb mit Pommes frites', 3),
  ('Wienerschnitzel vom Hofkalb mit Pommes frites', 7),
  ('Spaghetti mit Tomatensauce oder Ragù', 1),
  ('Grillwurst mit Pommes', 1),
  ('Grillwurst mit Pommes', 10)
) AS a(name_de, allergen_id) ON i.name_de = a.name_de;

-- ── Dessert ──────────────────────────────────────────────────
WITH ins AS (
  INSERT INTO menu_items (category_id, name_de, name_it, name_en, description_de, description_it, description_en, price, sort_order, is_vegetarian)
  VALUES
    ((SELECT id FROM categories WHERE slug='dessert'), 'Buchteln mit Vanillesauce', 'Buchteln con salsa alla vaniglia', 'Buchteln with vanilla sauce',
     'Fluffige Germknödel aus dem Ofen mit Vanillecreme', 'Soffici canederli lievitati al forno con crema alla vaniglia', 'Fluffy baked yeast dumplings with vanilla cream', 9.50, 1, true),
    ((SELECT id FROM categories WHERE slug='dessert'), 'Vanilleeis mit heißen Himbeeren', 'Gelato alla vaniglia con lamponi caldi', 'Vanilla ice cream with hot raspberries',
     'Cremiges Vanilleeis, warme Himbeeren, hausgemachte Sauce', 'Gelato alla vaniglia cremoso, lamponi caldi, salsa fatta in casa', 'Creamy vanilla ice cream, warm raspberries, homemade sauce', 8.50, 2, true),
    ((SELECT id FROM categories WHERE slug='dessert'), 'Zitronensorbet mit Limoncello', 'Sorbetto al limone con limoncello', 'Lemon sorbet with Limoncello',
     'Erfrischendes Zitronensorbet, Schuss Limoncello', 'Sorbetto al limone rinfrescante, goccio di limoncello', 'Refreshing lemon sorbet, splash of Limoncello', 7.90, 3, true),
    ((SELECT id FROM categories WHERE slug='dessert'), 'Apfelstrudel mit Vanillesauce', 'Strudel di mele con salsa alla vaniglia', 'Apple strudel with vanilla sauce',
     'Knuspriger Apfelstrudel nach Hausrezept, warme Vanillecreme', 'Strudel di mele croccante secondo ricetta di casa, crema alla vaniglia calda', 'Crispy apple strudel from our family recipe, warm vanilla cream', 5.90, 4, true),
    ((SELECT id FROM categories WHERE slug='dessert'), 'Crème brûlée mit frischen Erdbeeren', 'Crème brûlée con fragole fresche', 'Crème brûlée with fresh strawberries',
     'Klassische gebrannte Creme, karamellisierte Kruste, frische Erdbeeren', 'Crema bruciata classica, crosta caramellata, fragole fresche', 'Classic burnt cream, caramelised crust, fresh strawberries', 7.90, 5, true)
  RETURNING id, name_de
)
INSERT INTO item_allergens (item_id, allergen_id)
SELECT i.id, a.allergen_id FROM ins i
JOIN (VALUES
  ('Buchteln mit Vanillesauce', 1),
  ('Buchteln mit Vanillesauce', 3),
  ('Buchteln mit Vanillesauce', 7),
  ('Vanilleeis mit heißen Himbeeren', 7),
  ('Vanilleeis mit heißen Himbeeren', 3),
  ('Zitronensorbet mit Limoncello', 12),
  ('Apfelstrudel mit Vanillesauce', 1),
  ('Apfelstrudel mit Vanillesauce', 3),
  ('Apfelstrudel mit Vanillesauce', 7),
  ('Apfelstrudel mit Vanillesauce', 8),
  ('Crème brûlée mit frischen Erdbeeren', 7),
  ('Crème brûlée mit frischen Erdbeeren', 3)
) AS a(name_de, allergen_id) ON i.name_de = a.name_de;

-- ── Schaumweine ──────────────────────────────────────────────
WITH ins AS (
  INSERT INTO menu_items (category_id, name_de, name_it, name_en, price, price_glass, sort_order, wine_producer, wine_region, wine_doc, wine_style)
  VALUES
    ((SELECT id FROM categories WHERE slug='schaumwein'), 'Arunda Brut', 'Arunda Brut', 'Arunda Brut', 39.00, NULL, 1,
     'Sektkellerei Arunda', 'Südtirol', 'Südtirol DOC', 'brut'),
    ((SELECT id FROM categories WHERE slug='schaumwein'), 'Zemmer Millesimato', 'Zemmer Millesimato', 'Zemmer Millesimato', 29.00, 5.00, 2,
     'Weingut Peter Zemmer', 'Trentino-Südtirol', 'Vino Spumante', 'brut')
  RETURNING id, name_de
)
INSERT INTO item_allergens (item_id, allergen_id)
SELECT i.id, 12 FROM ins i;

-- ── Weißweine ────────────────────────────────────────────────
WITH ins AS (
  INSERT INTO menu_items (category_id, name_de, name_it, name_en, price, price_glass, price_quarter, price_half, price_liter, sort_order, wine_producer, wine_region, wine_doc, wine_style)
  VALUES
    ((SELECT id FROM categories WHERE slug='weisswein'), 'Michelstrunk Weiss', 'Michelstrunk Bianco', 'Michelstrunk White', NULL, 2.70, 5.50, 10.00, 18.00, 1,
     'Kellerei St. Michael-Eppan', 'Südtirol', 'Vino Bianco d''Italia', 'trocken'),
    ((SELECT id FROM categories WHERE slug='weisswein'), 'T Cuvée Weiss', 'T Cuvée Bianco', 'T Cuvée White', 26.00, 5.00, NULL, NULL, NULL, 2,
     'Kellerei Tramin', 'Südtirol', 'Weinberge Dolomiten IGT', 'trocken'),
    ((SELECT id FROM categories WHERE slug='weisswein'), 'Gewürztraminer', 'Gewürztraminer', 'Gewürztraminer', 29.00, NULL, NULL, NULL, NULL, 3,
     'Kellerei St. Michael-Eppan', 'Südtirol', 'Südtirol DOC', 'trocken'),
    ((SELECT id FROM categories WHERE slug='weisswein'), 'Schulthaus Weissburgunder Pinot Bianco', 'Schulthaus Pinot Bianco', 'Schulthaus Pinot Blanc', 30.00, 5.00, NULL, NULL, NULL, 4,
     'Kellerei St. Michael-Eppan', 'Südtirol', 'Südtirol DOC', 'trocken'),
    ((SELECT id FROM categories WHERE slug='weisswein'), 'Sylvaner', 'Sylvaner', 'Sylvaner', 32.00, NULL, NULL, NULL, NULL, 5,
     'Weingut Taschlerhof', 'Eisacktal', 'Südtirol Eisacktaler DOC', 'trocken'),
    ((SELECT id FROM categories WHERE slug='weisswein'), 'Kerner', 'Kerner', 'Kerner', 34.00, 5.50, NULL, NULL, NULL, 6,
     'Zu Tschötsch', 'Südtirol', 'Weinberge Dolomiten IGT', 'halbtrocken'),
    ((SELECT id FROM categories WHERE slug='weisswein'), 'Sauvignon', 'Sauvignon', 'Sauvignon', 30.00, 5.00, NULL, NULL, NULL, 7,
     'Weingut Putzenhof', 'Südtirol', 'Südtirol DOC', 'trocken'),
    ((SELECT id FROM categories WHERE slug='weisswein'), 'Sanct Valentin Sauvignon', 'Sanct Valentin Sauvignon', 'Sanct Valentin Sauvignon', 41.00, NULL, NULL, NULL, NULL, 8,
     'Kellerei St. Michael-Eppan', 'Südtirol', 'Südtirol DOC', 'trocken'),
    ((SELECT id FROM categories WHERE slug='weisswein'), 'Riesling', 'Riesling', 'Riesling', 33.00, NULL, NULL, NULL, NULL, 9,
     'Weingut Strasserhof', 'Eisacktal', 'Südtirol Eisacktaler DOC', 'trocken'),
    ((SELECT id FROM categories WHERE slug='weisswein'), 'Fellis Chardonnay Riserva', 'Fellis Chardonnay Riserva', 'Fellis Chardonnay Riserva', 33.00, NULL, NULL, NULL, NULL, 10,
     'Weingut Bessererhof', 'Südtirol', 'Südtirol DOC', 'trocken')
  RETURNING id, name_de
)
INSERT INTO item_allergens (item_id, allergen_id)
SELECT i.id, 12 FROM ins i;

-- ── Rotweine ─────────────────────────────────────────────────
WITH ins AS (
  INSERT INTO menu_items (category_id, name_de, name_it, name_en, price, price_glass, price_quarter, price_half, price_liter, sort_order, wine_producer, wine_region, wine_doc, wine_style, wine_grapes, is_bio)
  VALUES
    ((SELECT id FROM categories WHERE slug='rotwein'), 'Michelstrunk Rot', 'Michelstrunk Rosso', 'Michelstrunk Red', NULL, 2.70, 5.50, 10.00, 18.00, 1,
     'Kellerei St. Michael-Eppan', 'Südtirol', 'Vino Rosso d''Italia', 'trocken', NULL, false),
    ((SELECT id FROM categories WHERE slug='rotwein'), 'Zeder', 'Zeder', 'Zeder', 30.00, 5.00, NULL, NULL, NULL, 2,
     'Weingut Kornell', 'Südtirol', 'Südtirol DOC', 'trocken', ARRAY['Merlot','Cabernet Sauvignon','Lagrein'], false),
    ((SELECT id FROM categories WHERE slug='rotwein'), 'Soma', 'Soma', 'Soma', 40.00, NULL, NULL, NULL, NULL, 3,
     'Kellerei Kurtatsch', 'Südtirol', 'Südtirol DOC', 'trocken', ARRAY['Merlot','Cabernet Franc','Cabernet Sauvignon'], false),
    ((SELECT id FROM categories WHERE slug='rotwein'), 'Cabernet Riserva', 'Cabernet Riserva', 'Cabernet Riserva', 44.00, NULL, NULL, NULL, NULL, 4,
     'Weingut Wassererhof', 'Südtirol', 'Südtirol DOC', 'trocken', ARRAY['Cabernet Sauvignon','Cabernet Franc'], false),
    ((SELECT id FROM categories WHERE slug='rotwein'), 'St. Magdalener', 'St. Magdalener', 'St. Magdalener', 27.00, 5.00, NULL, NULL, NULL, 5,
     'Kellerei St. Michael-Eppan', 'Südtirol', 'Südtirol DOC', 'trocken', ARRAY['Vernatsch','Lagrein'], false),
    ((SELECT id FROM categories WHERE slug='rotwein'), 'Roan Zweigelt', 'Roan Zweigelt', 'Roan Zweigelt', 33.00, NULL, NULL, NULL, NULL, 6,
     'Weingut Bessererhof', 'Südtirol', 'Weinberge Dolomiten IGT', 'trocken', NULL, false),
    ((SELECT id FROM categories WHERE slug='rotwein'), 'Pinot Noir', 'Pinot Nero', 'Pinot Noir', 30.00, 5.00, NULL, NULL, NULL, 7,
     'Kellerei St. Michael-Eppan', 'Südtirol', 'Südtirol DOC', 'trocken', NULL, false),
    ((SELECT id FROM categories WHERE slug='rotwein'), 'Marith Blauburgunder', 'Marith Blauburgunder', 'Marith Pinot Noir', 34.00, NULL, NULL, NULL, NULL, 8,
     'Weingut Kornell', 'Südtirol', 'Südtirol DOC', 'trocken', NULL, false),
    ((SELECT id FROM categories WHERE slug='rotwein'), 'Glen Blauburgunder Riserva', 'Glen Blauburgunder Riserva', 'Glen Pinot Noir Riserva', 39.00, NULL, NULL, NULL, NULL, 9,
     'Kellerei Kurtatsch', 'Südtirol', 'Südtirol DOC', 'trocken', NULL, false),
    ((SELECT id FROM categories WHERE slug='rotwein'), 'Lagrein', 'Lagrein', 'Lagrein', 29.00, 5.00, NULL, NULL, NULL, 10,
     'Kellerei St. Michael-Eppan', 'Südtirol', 'Südtirol DOC', 'trocken', NULL, false),
    ((SELECT id FROM categories WHERE slug='rotwein'), 'Karl Lagrein Riserva', 'Karl Lagrein Riserva', 'Karl Lagrein Riserva', 42.00, NULL, NULL, NULL, NULL, 11,
     'Weingut Bergmannhof', 'Südtirol', 'Südtirol DOC', 'trocken', NULL, false),
    ((SELECT id FROM categories WHERE slug='rotwein'), 'Huberfeld Merlot', 'Huberfeld Merlot', 'Huberfeld Merlot', 31.00, NULL, NULL, NULL, NULL, 12,
     'Kellerei St. Pauls', 'Südtirol', 'Südtirol DOC', 'trocken', NULL, false),
    ((SELECT id FROM categories WHERE slug='rotwein'), 'Terre di San Leonardo', 'Terre di San Leonardo', 'Terre di San Leonardo', 31.00, NULL, NULL, NULL, NULL, 13,
     'Tenuta San Leonardo', 'Trentino', 'Weinberge Dolomiten IGT', 'trocken', ARRAY['Cabernet Sauvignon','Merlot','Carménère'], true),
    ((SELECT id FROM categories WHERE slug='rotwein'), 'Amarone della Valpolicella DOCG', 'Amarone della Valpolicella DOCG', 'Amarone della Valpolicella DOCG', 40.00, NULL, NULL, NULL, NULL, 14,
     'Casa Vinicola Bennati', 'Venetien', 'Amarone della Valpolicella DOCG', 'trocken', ARRAY['Corvina','Rondinella','Molinara'], false)
  RETURNING id, name_de
)
INSERT INTO item_allergens (item_id, allergen_id)
SELECT i.id, 12 FROM ins i;

-- ── Warme Getränke ───────────────────────────────────────────
INSERT INTO menu_items (category_id, name_de, name_it, name_en, price, sort_order, is_vegetarian, is_vegan)
VALUES
  ((SELECT id FROM categories WHERE slug='warme-getraenke'), 'Espresso', 'Espresso', 'Espresso', 1.80, 1, true, true),
  ((SELECT id FROM categories WHERE slug='warme-getraenke'), 'Macchiato', 'Macchiato', 'Macchiato', 1.80, 2, true, false),
  ((SELECT id FROM categories WHERE slug='warme-getraenke'), 'Doppelter Espresso', 'Doppio Espresso', 'Double Espresso', 3.60, 3, true, true),
  ((SELECT id FROM categories WHERE slug='warme-getraenke'), 'Cappuccino', 'Cappuccino', 'Cappuccino', 3.00, 4, true, false),
  ((SELECT id FROM categories WHERE slug='warme-getraenke'), 'Latte Macchiato', 'Latte Macchiato', 'Latte Macchiato', 3.00, 5, true, false),
  ((SELECT id FROM categories WHERE slug='warme-getraenke'), 'Heiße Schokolade', 'Cioccolata calda', 'Hot chocolate', 4.00, 6, true, false),
  ((SELECT id FROM categories WHERE slug='warme-getraenke'), 'Tee', 'Tè', 'Tea', 3.00, 7, true, true);

-- Add milk allergen to milk-based drinks
INSERT INTO item_allergens (item_id, allergen_id)
SELECT id, 7 FROM menu_items
WHERE name_de IN ('Macchiato', 'Cappuccino', 'Latte Macchiato', 'Heiße Schokolade')
AND category_id = (SELECT id FROM categories WHERE slug='warme-getraenke');

-- ── Getränke ─────────────────────────────────────────────────
INSERT INTO menu_items (category_id, name_de, name_it, name_en, price, price_quarter, price_half, price_liter, sort_order, is_vegetarian, is_vegan)
VALUES
  ((SELECT id FROM categories WHERE slug='getraenke'), 'Mineralwasser (sprudelnd)', 'Acqua minerale frizzante', 'Sparkling mineral water', NULL, 2.00, 2.50, 5.00, 1, true, true),
  ((SELECT id FROM categories WHERE slug='getraenke'), 'Mineralwasser (still)', 'Acqua minerale naturale', 'Still mineral water', NULL, 2.00, 2.50, 5.00, 2, true, true),
  ((SELECT id FROM categories WHERE slug='getraenke'), 'Apfelsaft', 'Succo di mela', 'Apple juice', NULL, 3.00, 5.00, 9.00, 3, true, true),
  ((SELECT id FROM categories WHERE slug='getraenke'), 'Skiwasser', 'Skiwasser', 'Skiwasser', NULL, 3.50, 6.00, 12.00, 4, true, true),
  ((SELECT id FROM categories WHERE slug='getraenke'), 'Hausgemachter Himbeerensaft', 'Succo di lamponi fatto in casa', 'Homemade raspberry juice', NULL, 3.00, 5.00, 10.00, 5, true, true),
  ((SELECT id FROM categories WHERE slug='getraenke'), 'Hausgemachter Holundersaft', 'Succo di sambuco fatto in casa', 'Homemade elderflower juice', NULL, 3.00, 5.00, 10.00, 6, true, true),
  ((SELECT id FROM categories WHERE slug='getraenke'), 'Hausgemachter Melissensaft', 'Succo di melissa fatto in casa', 'Homemade melissa juice', NULL, 3.00, 5.00, 10.00, 7, true, true),
  ((SELECT id FROM categories WHERE slug='getraenke'), 'Hausgemachte Cola', 'Cola fatto in casa', 'Homemade cola', NULL, 3.00, 5.00, 10.00, 8, true, true);

-- ── Bier ─────────────────────────────────────────────────────
INSERT INTO menu_items (category_id, name_de, name_it, name_en, price, price_quarter, sort_order, is_vegetarian, is_vegan)
VALUES
  ((SELECT id FROM categories WHERE slug='bier'), 'Kronen Forst Bier', 'Birra Forst Kronen', 'Forst Kronen Beer', 6.00, 3.80, 1, true, true),
  ((SELECT id FROM categories WHERE slug='bier'), 'Radler', 'Radler', 'Shandy', 6.00, 3.80, 2, true, true),
  ((SELECT id FROM categories WHERE slug='bier'), 'Hefeweizen', 'Weizen', 'Wheat beer', 6.00, 3.80, 3, true, true),
  ((SELECT id FROM categories WHERE slug='bier'), 'Alkoholfreies Bier', 'Birra analcolica', 'Alcohol-free beer', 6.00, 3.50, 4, true, true);

-- ── Aperitif ─────────────────────────────────────────────────
WITH ins AS (
  INSERT INTO menu_items (category_id, name_de, name_it, name_en, price, sort_order)
  VALUES
    ((SELECT id FROM categories WHERE slug='aperitif'), 'Aperitif Campedeller', 'Aperitivo Campedeller', 'Campedeller aperitif', 5.00, 1),
    ((SELECT id FROM categories WHERE slug='aperitif'), 'Hugo', 'Hugo', 'Hugo', 5.00, 2),
    ((SELECT id FROM categories WHERE slug='aperitif'), 'Veneziano (Aperolspritz)', 'Veneziano (Aperolspritz)', 'Veneziano (Aperol spritz)', 5.00, 3),
    ((SELECT id FROM categories WHERE slug='aperitif'), 'Prosecco', 'Prosecco', 'Prosecco', 4.00, 4),
    ((SELECT id FROM categories WHERE slug='aperitif'), 'Sanbitter Weiß', 'Sanbitter Bianco', 'Sanbitter White', 4.00, 5),
    ((SELECT id FROM categories WHERE slug='aperitif'), 'Gin Tonic Hendrick''s', 'Gin Tonic Hendrick''s', 'Gin Tonic Hendrick''s', 10.00, 6),
    ((SELECT id FROM categories WHERE slug='aperitif'), 'Gin Tonic Illusionist', 'Gin Tonic Illusionist', 'Gin Tonic Illusionist', 14.00, 7)
  RETURNING id, name_de
)
INSERT INTO item_allergens (item_id, allergen_id)
SELECT i.id, 12 FROM ins i
WHERE i.name_de IN ('Hugo', 'Veneziano (Aperolspritz)', 'Prosecco');

-- ── Digestif ─────────────────────────────────────────────────
INSERT INTO menu_items (category_id, name_de, name_it, name_en, price, sort_order)
VALUES
  ((SELECT id FROM categories WHERE slug='digestif'), 'Hausschnaps', 'Grappa di casa', 'House schnapps', 3.50, 1),
  ((SELECT id FROM categories WHERE slug='digestif'), 'Latschen', 'Grappa di pino mugo', 'Mountain pine schnapps', 3.50, 2),
  ((SELECT id FROM categories WHERE slug='digestif'), 'Nusseler', 'Nocino', 'Walnut schnapps', 3.50, 3),
  ((SELECT id FROM categories WHERE slug='digestif'), 'Zirmschnaps', 'Grappa di cirmolo', 'Swiss pine schnapps', 3.50, 4),
  ((SELECT id FROM categories WHERE slug='digestif'), 'Limoncello', 'Limoncello', 'Limoncello', 3.50, 5),
  ((SELECT id FROM categories WHERE slug='digestif'), 'Williams', 'Williams', 'Williams pear schnapps', 3.50, 6),
  ((SELECT id FROM categories WHERE slug='digestif'), 'Enzian', 'Genziana', 'Gentian schnapps', 3.50, 7),
  ((SELECT id FROM categories WHERE slug='digestif'), 'Treber', 'Grappa', 'Grappa', 3.50, 8),
  ((SELECT id FROM categories WHERE slug='digestif'), 'Heuschnaps', 'Grappa al fieno', 'Hay schnapps', 3.50, 9),
  ((SELECT id FROM categories WHERE slug='digestif'), 'Branca Menta', 'Branca Menta', 'Branca Menta', 4.00, 10),
  ((SELECT id FROM categories WHERE slug='digestif'), 'Fernet Branca', 'Fernet Branca', 'Fernet Branca', 4.00, 11),
  ((SELECT id FROM categories WHERE slug='digestif'), 'Cynar', 'Cynar', 'Cynar', 4.00, 12),
  ((SELECT id FROM categories WHERE slug='digestif'), 'Montenegro', 'Montenegro', 'Montenegro', 4.00, 13);
