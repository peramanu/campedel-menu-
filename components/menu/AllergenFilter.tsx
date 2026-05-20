"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Check } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem("allergenFilter");
      if (s) onChange(JSON.parse(s));
    } catch {}
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

  // Lock body scroll when sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const label = active.length > 0 ? `${active.length}` : "";

  return (
    <>
      {/* FAB — sits above bottom safe area */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 z-40 flex items-center gap-2 bg-pine dark:bg-pine-light text-white px-4 py-3 rounded-full shadow-xl shadow-pine/20 font-semibold text-sm hover:bg-pine-dark dark:hover:bg-pine active:scale-95 transition-all duration-200"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
        aria-label="Allergene filtern"
      >
        <SlidersHorizontal size={14} strokeWidth={2.5} />
        <span className="text-[13px]">Filter</span>
        {label && (
          <span className="bg-gold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
            {label}
          </span>
        )}
      </button>

      {/* Bottom sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm touch-none"
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-bg-light dark:bg-surface-dark rounded-t-3xl shadow-2xl max-h-[88vh] flex flex-col"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-2 pb-4 shrink-0">
                <div>
                  <h2 className="font-heading font-bold text-xl text-zinc-900 dark:text-zinc-100">
                    Allergene filtern
                  </h2>
                  <p className="text-[12px] text-muted-light dark:text-muted-dark mt-0.5">
                    Ausgewählte Allergene ausblenden
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {active.length > 0 && (
                    <button
                      onClick={reset}
                      className="text-[13px] text-gold font-semibold px-3 py-1.5 rounded-full hover:bg-gold/10 transition-colors"
                    >
                      Zurücksetzen
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

              {/* Allergen grid — scrollable */}
              <div className="overflow-y-auto overscroll-contain px-5 pb-4 flex-1">
                <div className="grid grid-cols-2 gap-2">
                  {ALLERGENS.map((a) => {
                    const name = (a[`name_${locale}` as keyof typeof a] as string) ?? a.name_de;
                    const checked = active.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggle(a.id)}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 text-left transition-all duration-150 active:scale-95 min-h-[56px] ${
                          checked
                            ? "border-pine bg-pine/10 dark:bg-pine/20"
                            : "border-zinc-200 dark:border-zinc-700 hover:border-gold/40"
                        }`}
                      >
                        <span className="text-xl leading-none shrink-0">{a.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 leading-tight">{a.code}</p>
                          <p className="text-[11px] text-muted-light dark:text-muted-dark leading-tight truncate">{name}</p>
                        </div>
                        {checked && (
                          <Check size={13} className="text-pine dark:text-pine-light shrink-0" strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="px-5 pb-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full bg-gold text-white font-bold py-3.5 rounded-2xl text-[15px] active:scale-[0.98] transition-transform shadow-md"
                >
                  {active.length > 0 ? `${active.length} Filter aktiv` : "Fertig"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
