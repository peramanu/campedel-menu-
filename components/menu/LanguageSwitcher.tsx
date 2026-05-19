"use client";
import { useRouter } from "next/navigation";

const LANGS = [
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "it", label: "IT", flag: "🇮🇹" },
  { code: "en", label: "EN", flag: "🇬🇧" },
] as const;

export function LanguageSwitcher({ current, compact = false }: { current: string; compact?: boolean }) {
  const router = useRouter();

  function setLocale(code: string) {
    document.cookie = `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="flex gap-1 bg-zinc-100/90 dark:bg-zinc-800/90 rounded-full p-1">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`flex items-center gap-1 rounded-full font-semibold transition-all duration-200 min-h-[36px] min-w-[36px] justify-center
            ${compact ? "px-2 text-[11px]" : "px-3 text-[13px]"}
            ${current === l.code
              ? "bg-gold text-white shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
        >
          <span>{l.flag}</span>
          {!compact && <span>{l.label}</span>}
        </button>
      ))}
    </div>
  );
}
