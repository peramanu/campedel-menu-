"use client";
import Image from "next/image";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export function MenuHeader({ locale }: { locale: string }) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("hero");

  const themeIcons = [
    { value: "light" as const, icon: Sun },
    { value: "dark" as const, icon: Moon },
    { value: "system" as const, icon: Monitor },
  ];

  return (
    <header className="bg-bg-light dark:bg-bg-dark border-b border-zinc-200/60 dark:border-zinc-800/60 sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logo/logo.png"
            alt="Campedèl Logo"
            width={40}
            height={40}
            className="rounded-lg object-contain"
            priority
          />
          <div>
            <p className="font-heading font-bold text-base leading-tight text-zinc-900 dark:text-zinc-100">
              Campedèl
            </p>
            <p className="text-xs text-muted-light dark:text-muted-dark leading-tight">
              {t("tagline")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 gap-0.5">
            {themeIcons.map(({ value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`p-1.5 rounded-full transition-all ${
                  theme === value
                    ? "bg-gold text-white"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
                aria-label={`Theme: ${value}`}
              >
                <Icon size={13} />
              </button>
            ))}
          </div>
          <LanguageSwitcher current={locale} />
        </div>
      </div>
    </header>
  );
}
