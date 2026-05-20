"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const LANGS = [
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "it", label: "IT", flag: "🇮🇹" },
  { code: "en", label: "EN", flag: "🇬🇧" },
] as const;

const SPRING = { type: "spring" as const, stiffness: 360, damping: 30, mass: 1 };

export function LanguageSwitcher({ current, compact = false }: { current: string; compact?: boolean }) {
  const router = useRouter();

  function setLocale(code: string) {
    document.cookie = `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="flex bg-black/[0.055] dark:bg-white/[0.06] rounded-full p-[3px] border border-zinc-200/40 dark:border-zinc-700/30">
      {LANGS.map((l) => {
        const isActive = current === l.code;
        return (
          <motion.button
            key={l.code}
            onClick={() => setLocale(l.code)}
            whileTap={{ scale: 0.85 }}
            transition={SPRING}
            className={`relative flex items-center justify-center gap-1 rounded-full font-semibold select-none transition-colors duration-200
              ${compact ? "min-h-[30px] min-w-[30px] px-1.5 text-[11px]" : "min-h-[32px] px-3 text-[13px]"}
              ${isActive
                ? "text-gold-dark dark:text-gold-light"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
          >
            {/* Sliding glass pill — shared layout between buttons */}
            {isActive && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "var(--lang-pill-bg)",
                  border: "1px solid var(--lang-pill-border)",
                  boxShadow: "var(--lang-pill-shadow)",
                }}
                transition={SPRING}
              />
            )}
            <span className="relative z-10 leading-none">{l.flag}</span>
            {!compact && <span className="relative z-10">{l.label}</span>}
          </motion.button>
        );
      })}
    </div>
  );
}
