import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campedèl Verwaltung",
  manifest: "/admin-manifest.json",
  appleWebApp: {
    capable: true,
    title: "Campedèl",
    statusBarStyle: "black-translucent",
  },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <AdminNav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-7 sm:py-8">{children}</main>
    </div>
  );
}
