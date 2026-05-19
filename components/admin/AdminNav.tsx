"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Tags, Star, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

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
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo/logo.png" alt="Campedèl" width={32} height={32} className="rounded-lg object-contain" />
          <span className="font-heading font-bold text-base text-zinc-900 dark:text-zinc-100 hidden sm:block">
            Campedèl Admin
          </span>
        </div>
        <div className="flex items-center gap-1">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? "bg-gold/10 text-gold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:block">{label}</span>
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors ml-2"
          >
            <LogOut size={15} />
            <span className="hidden sm:block">Abmelden</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
