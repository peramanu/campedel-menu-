import { LoginForm } from "@/components/admin/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark hero-gradient diamond-tile flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">

        {/* Brand header */}
        <div className="text-center mb-8">

          {/* Gold-ring logo frame — matches guest menu hero */}
          <div className="flex justify-center mb-5">
            <div
              className="relative rounded-full flex items-center justify-center"
              style={{
                width: 92,
                height: 92,
                background: "linear-gradient(145deg, rgba(201,169,110,0.16) 0%, rgba(201,169,110,0.03) 100%)",
                boxShadow: "0 0 0 1px rgba(201,169,110,0.32), inset 0 0 0 1px rgba(201,169,110,0.1)",
              }}
            >
              <div className="absolute inset-0 rounded-full scale-[2] bg-gold/8 blur-3xl pointer-events-none" />
              <Image
                src="/logo/logo.png"
                alt="Campedèl"
                width={62}
                height={62}
                className="logo-img object-contain relative"
                priority
              />
            </div>
          </div>

          <h1 className="font-heading font-bold text-[27px] text-zinc-900 dark:text-zinc-100 leading-none mb-1.5">
            Campedèl
          </h1>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-0.5">
            Menüverwaltung
          </p>
          <p className="text-[11px] text-muted-light dark:text-muted-dark">
            Hof · Seiser Alm · 1.844 m
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-7">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-zinc-200/70 dark:to-zinc-700/50" />
          <span className="text-[11px] text-gold/50">◆</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-zinc-200/70 dark:to-zinc-700/50" />
        </div>

        <LoginForm />

        <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-600 mt-8">
          © {new Date().getFullYear()} Campedèl-Hof
        </p>
      </div>
    </div>
  );
}
