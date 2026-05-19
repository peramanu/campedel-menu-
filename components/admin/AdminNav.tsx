"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Tags, LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

const NAV = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/items", icon: UtensilsCrossed, label: "Speisen" },
  { href: "/admin/categories", icon: Tags, label: "Kategorien" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <nav className="bg-surface-light dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">

        {/* Left: back to menu + title */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/menu"
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
            title="Zur Speisekarte"
          >
            <ArrowLeft size={16} />
          </Link>
          <span className="font-heading font-bold text-[15px] text-zinc-900 dark:text-zinc-100 hidden sm:block truncate">
            Campedèl Admin
          </span>
        </div>

        {/* Center: nav links */}
        <div className="flex items-center gap-0.5 flex-1 justify-center sm:justify-start sm:ml-2">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                pathname.startsWith(href)
                  ? "bg-gold/10 text-gold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:block">{label}</span>
            </Link>
          ))}
        </div>

        {/* Right: logout */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shrink-0"
          title="Abmelden"
        >
          <LogOut size={15} />
          <span className="hidden sm:block">Abmelden</span>
        </button>
      </div>
    </nav>
  );
}
