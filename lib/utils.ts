import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale, MenuItem } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return price.toLocaleString("de-AT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " €";
}

export function getLocalizedField(
  item: MenuItem,
  field: "name" | "description" | "tasting_notes",
  locale: Locale
): string {
  const key = `${field}_${locale}` as keyof MenuItem;
  const fallback = `${field}_de` as keyof MenuItem;
  return (item[key] as string) || (item[fallback] as string) || "";
}
