import { getLocale } from "next-intl/server";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { InfoSection } from "@/components/menu/InfoSection";
import type { Locale } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Info & Kontakt – Campedèl-Hof",
  description: "Öffnungszeiten, Kontakt und Anfahrt zum Campedèl-Hof auf der Seiser Alm",
};

export default async function InfoPage() {
  const locale = (await getLocale()) as Locale;

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <MenuHeader locale={locale} />
      <InfoSection locale={locale} />
    </div>
  );
}
