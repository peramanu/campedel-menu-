"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, LogIn } from "lucide-react";

const ADMIN_EMAIL = "admin@campedel.com";

export function LoginForm() {
  const router   = useRouter();
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
    if (error) {
      setError("Falsches Passwort. Bitte erneut versuchen.");
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Password field */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-muted-light dark:text-muted-dark mb-2">
          Passwort
        </label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full px-4 py-3 pr-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-surface-light dark:bg-surface-dark text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all text-base placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1"
            tabIndex={-1}
          >
            {showPw ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-800/40">
          <span className="text-red-500 text-sm">⚠</span>
          <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !password}
        className="w-full flex items-center justify-center gap-2.5 bg-gold text-white font-semibold py-3.5 rounded-xl hover:bg-gold-dark transition-all duration-200 disabled:opacity-55 shadow-md shadow-gold/20 text-[15px]"
      >
        <LogIn size={15} strokeWidth={2} />
        {loading ? "Bitte warten…" : "Anmelden"}
      </button>
    </form>
  );
}
