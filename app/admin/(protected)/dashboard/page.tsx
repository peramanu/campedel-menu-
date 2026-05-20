import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { UtensilsCrossed, Star, PlusCircle, Tags, ChevronRight } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const today    = new Date().toISOString().split("T")[0];

  const [{ count: totalItems }, { count: activeSpecials }, { data: recentItems }] =
    await Promise.all([
      supabase.from("menu_items").select("*", { count: "exact", head: true }),
      supabase.from("daily_specials").select("*", { count: "exact", head: true }).eq("special_date", today),
      supabase.from("menu_items").select("id, name_de, updated_at, is_available")
        .order("updated_at", { ascending: false }).limit(6),
    ]);

  const dateLabel = new Date().toLocaleDateString("de-AT", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div>
        <h1 className="font-heading font-bold text-[26px] text-zinc-900 dark:text-zinc-100 leading-none mb-1">
          Dashboard
        </h1>
        <p className="text-[13px] text-muted-light dark:text-muted-dark capitalize">{dateLabel}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">

        <div className="card-surface rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center">
              <UtensilsCrossed size={16} className="text-gold" strokeWidth={1.8} />
            </div>
          </div>
          <p className="font-heading font-bold text-[38px] leading-none text-zinc-900 dark:text-zinc-100 mb-1">
            {totalItems ?? 0}
          </p>
          <p className="text-[12px] text-muted-light dark:text-muted-dark font-medium">Gerichte gesamt</p>
        </div>

        <div className="card-surface rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-pine/10 flex items-center justify-center">
              <Star size={16} className="text-pine dark:text-pine-light" strokeWidth={1.8} />
            </div>
          </div>
          <p className="font-heading font-bold text-[38px] leading-none text-zinc-900 dark:text-zinc-100 mb-1">
            {activeSpecials ?? 0}
          </p>
          <p className="text-[12px] text-muted-light dark:text-muted-dark font-medium">Tagesangebote heute</p>
        </div>

      </div>

      {/* Quick actions */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-light dark:text-muted-dark mb-3">
          Schnellzugriff
        </p>
        <div className="grid gap-2.5">
          <Link
            href="/admin/items?new=1"
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gold text-white font-semibold text-[14px] hover:bg-gold-dark transition-colors shadow-md shadow-gold/20 group"
          >
            <PlusCircle size={17} strokeWidth={2} />
            <span>Neues Gericht anlegen</span>
            <ChevronRight size={15} className="ml-auto opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-pine/10 dark:bg-pine/15 text-pine dark:text-pine-light font-semibold text-[14px] hover:bg-pine/15 dark:hover:bg-pine/20 transition-colors group border border-pine/15 dark:border-pine/20"
          >
            <Tags size={17} strokeWidth={1.8} />
            <span>Kategorien verwalten</span>
            <ChevronRight size={15} className="ml-auto opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Recent changes */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-light dark:text-muted-dark mb-3">
          Zuletzt geändert
        </p>
        <div className="card-surface rounded-2xl overflow-hidden">
          {(recentItems ?? []).length === 0 ? (
            <p className="text-center py-10 text-[13px] text-muted-light dark:text-muted-dark italic font-heading">
              Noch keine Einträge
            </p>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {(recentItems ?? []).map((item: any) => (
                <Link
                  key={item.id}
                  href={`/admin/items?edit=${item.id}`}
                  className="flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 truncate group-hover:text-gold-dark dark:group-hover:text-gold transition-colors">
                      {item.name_de}
                    </p>
                    <p className="text-[11.5px] text-muted-light dark:text-muted-dark mt-0.5">
                      {new Date(item.updated_at).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0 ml-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      item.is_available
                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/40"
                    }`}>
                      {item.is_available ? "Aktiv" : "Inaktiv"}
                    </span>
                    <ChevronRight size={13} className="text-zinc-300 dark:text-zinc-600 group-hover:text-gold transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
