"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, LogIn } from "lucide-react";

const ADMIN_EMAIL = "admin@campedel.com";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });
    if (error) {
      setError("Falsches Passwort. Bitte erneut versuchen.");
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card dark:shadow-card-dark p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Passwort
        </label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="w-full px-3 py-2.5 pr-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-bg-light dark:bg-bg-dark text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition text-base"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !password}
        className="w-full flex items-center justify-center gap-2 bg-gold text-white font-semibold py-3 rounded-xl hover:bg-gold-dark transition-colors disabled:opacity-60"
      >
        <LogIn size={16} />
        {loading ? "Bitte warten..." : "Anmelden"}
      </button>
    </form>
  );
}
