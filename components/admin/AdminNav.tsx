"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Tags, LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

const NAV = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/items",     icon: UtensilsCrossed, label: "Speisen"   },
  { href: "/admin/categories",icon: Tags,            label: "Kategorien"},
];

export function AdminNav() {
  const pathname = usePathname();
  const router   = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <header className="sticky top-0 z-40 pt-safe">
      <div className="bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/menu"
              title="Zur Speisekarte"
              className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={15} strokeWidth={2} />
            </Link>
            <div className="hidden sm:block h-5 w-px bg-zinc-200 dark:bg-zinc-700/80" />
            <div className="hidden sm:block leading-none">
              <p className="font-heading font-bold text-[15px] text-zinc-900 dark:text-zinc-100">Campedèl</p>
              <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-gold mt-0.5">Verwaltung</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-0.5">
            {NAV.map(({ href, icon: Icon, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    active
                      ? "bg-gold/12 text-gold-dark dark:text-gold-light font-semibold"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon size={14} strokeWidth={active ? 2.2 : 1.8} />
                  <span className="hidden sm:block">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-zinc-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shrink-0"
          >
            <LogOut size={14} strokeWidth={1.8} />
            <span className="hidden sm:block">Abmelden</span>
          </button>
        </div>
      </div>
      {/* Gold accent line — mirrors the guest menu header */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </header>
  );
}
