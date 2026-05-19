import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { UtensilsCrossed, Star, PlusCircle, Tags } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0];

  const [{ count: totalItems }, { count: activeSpecials }, { data: recentItems }] =
    await Promise.all([
      supabase.from("menu_items").select("*", { count: "exact", head: true }),
      supabase
        .from("daily_specials")
        .select("*", { count: "exact", head: true })
        .eq("special_date", today),
      supabase
        .from("menu_items")
        .select("id, name_de, updated_at, is_available")
        .order("updated_at", { ascending: false })
        .limit(5),
    ]);

  const stats = [
    { label: "Gerichte gesamt", value: totalItems ?? 0, icon: UtensilsCrossed, color: "text-gold" },
    { label: "Tagesangebote heute", value: activeSpecials ?? 0, icon: Star, color: "text-pine" },
  ];

  const quickActions = [
    { href: "/admin/items?new=1", icon: PlusCircle, label: "Neues Gericht anlegen", color: "bg-gold text-white" },
    { href: "/admin/categories", icon: Tags, label: "Kategorien verwalten", color: "bg-pine/10 text-pine dark:text-pine-light" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-zinc-900 dark:text-zinc-100">Dashboard</h1>
        <p className="text-sm text-muted-light dark:text-muted-dark mt-1">
          {new Date().toLocaleDateString("de-AT", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-card dark:shadow-card-dark">
            <Icon size={22} className={`${color} mb-3`} />
            <p className="font-heading font-bold text-3xl text-zinc-900 dark:text-zinc-100">{value}</p>
            <p className="text-sm text-muted-light dark:text-muted-dark mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold text-sm text-muted-light dark:text-muted-dark uppercase tracking-wide mb-3">
          Schnellzugriff
        </h2>
        <div className="grid gap-3">
          {quickActions.map(({ href, icon: Icon, label, color }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${color} font-medium transition-opacity hover:opacity-90`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent changes */}
      <div>
        <h2 className="font-semibold text-sm text-muted-light dark:text-muted-dark uppercase tracking-wide mb-3">
          Zuletzt geändert
        </h2>
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card dark:shadow-card-dark divide-y divide-zinc-100 dark:divide-zinc-800">
          {(recentItems ?? []).map((item: any) => (
            <Link
              key={item.id}
              href={`/admin/items?edit=${item.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.name_de}</p>
                <p className="text-xs text-muted-light dark:text-muted-dark">
                  {new Date(item.updated_at).toLocaleDateString("de-AT")}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                item.is_available
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {item.is_available ? "Aktiv" : "Inaktiv"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
