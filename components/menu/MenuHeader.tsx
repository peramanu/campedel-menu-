"use client";
import Image from "next/image";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

const CYCLE: Record<string, "dark" | "system" | "light"> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS: Record<string, string> = {
  light: "Hell",
  dark: "Dunkel",
  system: "System",
};

export function MenuHeader({ locale }: { locale: string }) {
  const { theme, setTheme } = useTheme();
  const Icon = ICONS[theme] ?? Monitor;
  const next = CYCLE[theme] ?? "light";

  return (
    <header className="sticky top-0 z-40 pt-safe">
      <div className="bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

          {/* Logo + name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src="/logo/logo.png"
                alt="Campedèl"
                fill
                className="logo-img object-contain"
                priority
              />
            </div>
            <div className="min-w-0 hidden xs:block">
              <p className="font-heading font-bold text-[15px] tracking-wide text-zinc-900 dark:text-zinc-100 leading-none">
                Campedèl
              </p>
              <p className="text-[10px] text-gold font-semibold tracking-[0.15em] uppercase leading-none mt-0.5">
                Hof · Seiser Alm
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme toggle — single cycling button */}
            <button
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setTheme(next, {
                  x: Math.round(r.left + r.width / 2),
                  y: Math.round(r.top + r.height / 2),
                });
              }}
              aria-label={`Anzeigemodus: ${LABELS[theme] ?? "System"} → ${LABELS[next]}`}
              title={`${LABELS[theme] ?? "System"} (klicken für ${LABELS[next]})`}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-100/90 dark:bg-zinc-800/90 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 transition-all duration-200 active:scale-90"
            >
              <Icon size={15} strokeWidth={1.8} />
            </button>

            {/* Language switcher */}
            <LanguageSwitcher current={locale} compact />
          </div>
        </div>
      </div>
      {/* Thin gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </header>
  );
}
