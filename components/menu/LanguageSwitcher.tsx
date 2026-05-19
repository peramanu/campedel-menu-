"use client";
import { useRouter } from "next/navigation";

const LANGS = [
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "it", label: "IT", flag: "🇮🇹" },
  { code: "en", label: "EN", flag: "🇬🇧" },
] as const;

export function LanguageSwitcher({ current }: { current: string }) {
  const router = useRouter();

  function setLocale(code: string) {
    document.cookie = `locale=${code}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-full p-1">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            current === l.code
              ? "bg-gold text-white shadow-sm"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          <span>{l.flag}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  );
}
