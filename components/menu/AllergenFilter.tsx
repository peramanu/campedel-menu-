"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { ALLERGENS } from "@/lib/allergens";
import type { Locale } from "@/types";

export function AllergenFilter({
  active,
  onChange,
  locale,
}: {
  active: number[];
  onChange: (ids: number[]) => void;
  locale: Locale;
}) {
  const t = useTranslations("menu");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem("allergenFilter");
      if (s) onChange(JSON.parse(s));
    } catch {}
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(id: number) {
    const next = active.includes(id) ? active.filter((x) => x !== id) : [...active, id];
    onChange(next);
    sessionStorage.setItem("allergenFilter", JSON.stringify(next));
  }

  function reset() {
    onChange([]);
    sessionStorage.removeItem("allergenFilter");
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const hasActive = active.length > 0;

  return (
    <>
      {/* FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setOpen(true)}
        className={`fixed right-4 z-40 flex items-center gap-2 text-white px-4 py-3 rounded-full font-semibold shadow-xl transition-all duration-200 active:scale-95 ${
          hasActive
            ? "bg-gold shadow-gold/30"
            : "bg-pine shadow-pine/25"
        }`}
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
        aria-label={t("filterAllergens")}
      >
        {/* Pulse ring — only on first load with no active filters to draw attention */}
        {mounted && !hasActive && (
          <span
            className="absolute inset-0 rounded-full fab-ring"
            aria-hidden="true"
          />
        )}
        <SlidersHorizontal size={14} strokeWidth={2.5} />
        <span className="text-[13px]">
          {hasActive ? `${active.length} Filter` : t("allergens")}
        </span>
      </motion.button>

      {/* Bottom sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm touch-none"
            />

            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-bg-light dark:bg-surface-dark rounded-t-3xl shadow-2xl max-h-[88dvh] flex flex-col"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-0.5 shrink-0">
                <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-3 pb-4 shrink-0">
                <div>
                  <h2 className="font-heading font-bold text-[20px] text-zinc-900 dark:text-zinc-100 leading-tight">
                    {t("filterAllergens")}
                  </h2>
                  <p className="text-[12px] text-muted-light dark:text-muted-dark mt-0.5">
                    {t("filterSubtitle")}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {hasActive && (
                    <button
                      onClick={reset}
                      className="text-[13px] text-gold font-semibold px-3 py-1.5 rounded-full hover:bg-gold/10 transition-colors"
                    >
                      {t("resetFilters")}
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Allergen grid */}
              <div className="overflow-y-auto overscroll-contain px-5 pb-4 flex-1">
                <motion.div
                  className="grid grid-cols-2 gap-2"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } } }}
                >
                  {ALLERGENS.map((a) => {
                    const aName = (a[`name_${locale}` as keyof typeof a] as string) ?? a.name_de;
                    const checked = active.includes(a.id);
                    return (
                      <motion.button
                        key={a.id}
                        onClick={() => toggle(a.id)}
                        variants={{
                          hidden: { opacity: 0, y: 8 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] } },
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 text-left transition-all duration-150 min-h-[58px] ${
                          checked
                            ? "border-pine bg-pine/10 dark:bg-pine/20"
                            : "border-zinc-200/80 dark:border-zinc-700/60 hover:border-gold/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        <span className="text-xl leading-none shrink-0">{a.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 leading-tight">{a.code}</p>
                          <p className="text-[11px] text-muted-light dark:text-muted-dark leading-tight truncate">{aName}</p>
                        </div>
                        {checked && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          >
                            <Check size={13} className="text-pine dark:text-pine-light shrink-0" strokeWidth={3} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 shrink-0">
                <motion.button
                  onClick={() => setOpen(false)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gold text-white font-bold py-3.5 rounded-2xl text-[15px] shadow-lg shadow-gold/20"
                >
                  {hasActive ? `${active.length} × ${t("done")}` : t("done")}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
