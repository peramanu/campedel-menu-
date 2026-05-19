"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X } from "lucide-react";
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
      const stored = sessionStorage.getItem("allergenFilter");
      if (stored) onChange(JSON.parse(stored));
    } catch {}
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

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(72px+env(safe-area-inset-bottom))] right-4 z-40 flex items-center gap-2 bg-pine text-white px-4 py-3 rounded-full shadow-lg font-medium text-sm hover:bg-pine-dark transition-colors"
      >
        <Filter size={16} />
        {active.length > 0 && (
          <span className="bg-gold text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {active.length}
          </span>
        )}
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-bg-light dark:bg-surface-dark rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading font-bold text-xl text-zinc-900 dark:text-zinc-100">
                    Allergene filtern
                  </h2>
                  <div className="flex gap-2">
                    {active.length > 0 && (
                      <button
                        onClick={reset}
                        className="text-sm text-gold font-medium hover:text-gold-dark"
                      >
                        Zurücksetzen
                      </button>
                    )}
                    <button
                      onClick={() => setOpen(false)}
                      className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-muted-light dark:text-muted-dark mb-4">
                  Gerichte mit diesen Allergenen ausblenden:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {ALLERGENS.map((a) => {
                    const name = a[`name_${locale}`] ?? a.name_de;
                    const checked = active.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggle(a.id)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all ${
                          checked
                            ? "border-pine bg-pine/10 dark:bg-pine/20"
                            : "border-zinc-200 dark:border-zinc-700 hover:border-gold/50"
                        }`}
                      >
                        <span className="text-xl">{a.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                            {a.code}
                          </p>
                          <p className="text-xs text-muted-light dark:text-muted-dark leading-tight">
                            {name}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="w-full mt-5 bg-gold text-white font-semibold py-3 rounded-xl hover:bg-gold-dark transition-colors"
                >
                  Filtern anwenden
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
