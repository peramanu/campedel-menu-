"use client";
import Image from "next/image";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function MenuHeader({ locale }: { locale: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 pt-safe bg-bg-light/85 dark:bg-bg-dark/85 backdrop-blur-xl border-b border-zinc-200/40 dark:border-zinc-800/40">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

        {/* Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Image
            src="/logo/logo.png"
            alt="Campedèl"
            width={32}
            height={32}
            className="logo-img object-contain flex-shrink-0"
            priority
          />
          <span className="font-heading font-bold text-[14px] tracking-wide text-zinc-900 dark:text-zinc-100 leading-none truncate hidden xs:block">
            Campedèl
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Theme toggle — compact on mobile */}
          <div className="flex items-center bg-zinc-100/80 dark:bg-zinc-800/80 rounded-full p-0.5">
            {(["light", "dark", "system"] as const).map((v) => {
              const Icon = v === "light" ? Sun : v === "dark" ? Moon : Monitor;
              return (
                <button
                  key={v}
                  onClick={() => setTheme(v)}
                  aria-label={v}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                    theme === v
                      ? "bg-gold text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  }`}
                >
                  <Icon size={12} />
                </button>
              );
            })}
          </div>
          {/* Language — compact in header, full in hero */}
          <LanguageSwitcher current={locale} compact />
        </div>
      </div>
    </header>
  );
}
