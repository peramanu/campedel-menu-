export const ALLERGENS = [
  { id: 1,  code: "A", name_de: "Gluten", name_it: "Glutine", name_en: "Gluten", icon: "🌾" },
  { id: 2,  code: "B", name_de: "Krebstiere", name_it: "Crostacei", name_en: "Crustaceans", icon: "🦐" },
  { id: 3,  code: "C", name_de: "Eier", name_it: "Uova", name_en: "Eggs", icon: "🥚" },
  { id: 4,  code: "D", name_de: "Fisch", name_it: "Pesce", name_en: "Fish", icon: "🐟" },
  { id: 5,  code: "E", name_de: "Erdnüsse", name_it: "Arachidi", name_en: "Peanuts", icon: "🥜" },
  { id: 6,  code: "F", name_de: "Soja", name_it: "Soia", name_en: "Soy", icon: "🫘" },
  { id: 7,  code: "G", name_de: "Milch/Laktose", name_it: "Latte/Lattosio", name_en: "Milk/Lactose", icon: "🥛" },
  { id: 8,  code: "H", name_de: "Schalenfrüchte", name_it: "Frutta a guscio", name_en: "Tree nuts", icon: "🌰" },
  { id: 9,  code: "L", name_de: "Sellerie", name_it: "Sedano", name_en: "Celery", icon: "🥬" },
  { id: 10, code: "M", name_de: "Senf", name_it: "Senape", name_en: "Mustard", icon: "🟡" },
  { id: 11, code: "N", name_de: "Sesam", name_it: "Sesamo", name_en: "Sesame", icon: "⚪" },
  { id: 12, code: "O", name_de: "Sulfite", name_it: "Anidride solforosa", name_en: "Sulphur dioxide", icon: "🍷" },
  { id: 13, code: "P", name_de: "Lupinen", name_it: "Lupini", name_en: "Lupin", icon: "🌿" },
  { id: 14, code: "R", name_de: "Weichtiere", name_it: "Molluschi", name_en: "Molluscs", icon: "🦑" },
] as const;

export type AllergenId = (typeof ALLERGENS)[number]["id"];
