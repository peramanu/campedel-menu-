"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Phone, Mail, MapPin, Clock, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/types";

const HOURS: { key: string; open: string | null; close: string | null }[] = [
  { key: "mon", open: null, close: null },
  { key: "tue", open: null, close: null },
  { key: "wed", open: null, close: null },
  { key: "thu", open: null, close: null },
  { key: "fri", open: "18:00", close: "22:00" },
  { key: "sat", open: "11:30", close: "22:00" },
  { key: "sun", open: "11:30", close: "20:00" },
];

const CONTACT = {
  phone: "+39 0471 706 812",
  mobile: "+39 331 318 6084",
  email: "campedelhof@gmail.com",
  address: "St. Vigil 13, 39040 Seis am Schlern",
  elevation: "1.844 m ü.M.",
  mapUrl: "https://maps.google.com/?q=46.538,11.558",
};

function fadeUp(i: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };
}

const TODAY_IDX = new Date().getDay(); // 0=Sun, 1=Mon...
// Remap: our array is Mon=0..Sun=6
const ACTIVE_IDX = TODAY_IDX === 0 ? 6 : TODAY_IDX - 1;

export function InfoSection({ locale }: { locale: Locale }) {
  const t = useTranslations("info");

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">

      {/* Atmospheric top gradient */}
      <div
        className="absolute top-0 inset-x-0 h-[340px] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% -10%, rgba(201,169,110,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 10% 80%, rgba(45,80,22,0.06) 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative max-w-lg mx-auto px-5 pt-6 pb-24">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-[12px] font-semibold text-muted-light dark:text-muted-dark hover:text-gold dark:hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft size={13} strokeWidth={2.2} />
            Speisekarte
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
            <motion.div
              animate={{ rotate: [45, 225, 45] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-gold/70 flex-shrink-0"
            />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
          </div>
          <h1 className="font-heading font-bold text-[34px] sm:text-[40px] leading-none tracking-[-0.015em] text-zinc-900 dark:text-zinc-100 mb-2">
            Campedèl-Hof
          </h1>
          <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-gold/70">
            Hof · Seiser Alm · {CONTACT.elevation}
          </p>
        </motion.div>

        {/* About */}
        <motion.div {...fadeUp(0)} className="mb-6">
          <div className="rounded-3xl p-6 border border-zinc-200/60 dark:border-zinc-800/60 bg-surface-light dark:bg-surface-dark">
            <p className="text-[13.5px] text-zinc-600 dark:text-zinc-400 leading-relaxed italic font-heading">
              {t("description")}
            </p>
          </div>
        </motion.div>

        {/* Opening hours */}
        <motion.div {...fadeUp(1)} className="mb-6">
          <SectionHeader icon={<Clock size={14} strokeWidth={2} />} title={t("openingHours")} />
          <div className="rounded-3xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 bg-surface-light dark:bg-surface-dark">
            {HOURS.map(({ key, open, close }, idx) => {
              const isToday = idx === ACTIVE_IDX;
              const isOpen = open !== null;
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between px-5 py-3.5 ${
                    idx < HOURS.length - 1 ? "border-b border-zinc-100 dark:border-zinc-800/80" : ""
                  } ${isToday ? "bg-gold/5 dark:bg-gold/8" : ""}`}
                >
                  <div className="flex items-center gap-2.5">
                    {isToday && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                    )}
                    <span className={`text-[13px] ${
                      isToday
                        ? "font-bold text-zinc-900 dark:text-zinc-100"
                        : "font-medium text-zinc-600 dark:text-zinc-400"
                    }`}>
                      {(t as any)(key)}
                    </span>
                  </div>
                  {isOpen ? (
                    <span className={`text-[13px] font-semibold tabular-nums ${
                      isToday ? "text-gold-dark dark:text-gold" : "text-zinc-700 dark:text-zinc-300"
                    }`}>
                      {open} – {close}
                    </span>
                  ) : (
                    <span className="text-[12px] text-muted-light dark:text-muted-dark italic">
                      {t("closed")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Seasonal note */}
          <p className="mt-3 text-[11px] text-muted-light dark:text-muted-dark leading-relaxed px-1">
            🌿 {t("seasonalNote")}
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div {...fadeUp(2)} className="mb-6">
          <SectionHeader icon={<Phone size={14} strokeWidth={2} />} title={t("contact")} />
          <div className="rounded-3xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 bg-surface-light dark:bg-surface-dark divide-y divide-zinc-100 dark:divide-zinc-800/80">

            <ContactRow
              icon="📞"
              label="Telefon"
              value={CONTACT.phone}
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
            />
            <ContactRow
              icon="📱"
              label="Mobil"
              value={CONTACT.mobile}
              href={`tel:${CONTACT.mobile.replace(/\s/g, "")}`}
            />
            <ContactRow
              icon="✉️"
              label="E-Mail"
              value={CONTACT.email}
              href={`mailto:${CONTACT.email}`}
            />
          </div>
        </motion.div>

        {/* Location */}
        <motion.div {...fadeUp(3)} className="mb-6">
          <SectionHeader icon={<MapPin size={14} strokeWidth={2} />} title={t("location")} />
          <div className="rounded-3xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 bg-surface-light dark:bg-surface-dark">
            <div className="px-5 py-4">
              <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-0.5">
                {CONTACT.address}
              </p>
              <p className="text-[12px] text-muted-light dark:text-muted-dark mb-4">
                Seis am Schlern · Siusi allo Sciliar · South Tyrol / Italy
              </p>

              {/* Map preview block */}
              <div className="relative rounded-2xl overflow-hidden h-40 bg-zinc-100 dark:bg-zinc-800 mb-3 group">
                {/* Topographic-style decorative map placeholder */}
                <svg
                  viewBox="0 0 320 160"
                  className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10"
                  preserveAspectRatio="xMidYMid slice"
                >
                  {[20, 35, 50, 65, 80, 95].map((r, i) => (
                    <ellipse key={i} cx="160" cy="80" rx={r * 2} ry={r} fill="none" stroke="#C9A96E" strokeWidth="0.8" />
                  ))}
                  <circle cx="160" cy="80" r="4" fill="#C9A96E" opacity="0.7" />
                  <text x="170" y="76" fill="#C9A96E" fontSize="9" fontFamily="serif" opacity="0.6">Campedèl</text>
                  <text x="170" y="86" fill="#C9A96E" fontSize="7" fontFamily="sans-serif" opacity="0.5">1.844 m</text>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                    <MapPin size={18} className="text-gold" strokeWidth={1.8} />
                  </div>
                  <span className="text-[11px] text-muted-light dark:text-muted-dark">Seiser Alm · 46.538°N 11.558°E</span>
                </div>

                <a
                  href={CONTACT.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm"
                >
                  <span className="flex items-center gap-1.5 bg-white text-zinc-800 text-[12px] font-semibold px-4 py-2 rounded-full shadow-lg">
                    <ExternalLink size={12} strokeWidth={2.5} />
                    {t("viewOnMap")}
                  </span>
                </a>
              </div>

              <a
                href={CONTACT.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gold/30 text-gold text-[13px] font-semibold hover:bg-gold/5 transition-colors"
              >
                <ExternalLink size={13} strokeWidth={2} />
                {t("viewOnMap")}
              </a>
            </div>
          </div>
        </motion.div>

        {/* Back to menu */}
        <motion.div {...fadeUp(4)} className="text-center pt-4">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gold text-white text-[13px] font-semibold hover:bg-gold-dark transition-colors shadow-md shadow-gold/25"
          >
            Zur Speisekarte →
          </Link>
        </motion.div>

        {/* Footer ornament */}
        <div className="mt-14 text-center">
          <div className="flex items-center gap-4 justify-center mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-zinc-200/60 dark:to-zinc-800/60" />
            <span className="text-[11px] text-gold/35 leading-none">◆</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-zinc-200/60 dark:to-zinc-800/60" />
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} Campedèl-Hof · Traditionelle Südtiroler Küche
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 px-1">
      <span className="text-gold">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark">
        {title}
      </span>
    </div>
  );
}

function ContactRow({
  icon, label, value, href,
}: {
  icon: string; label: string; value: string; href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <span className="text-base leading-none">{icon}</span>
        <span className="text-[12px] text-muted-light dark:text-muted-dark">{label}</span>
      </div>
      <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-gold dark:group-hover:text-gold transition-colors">
        {value}
      </span>
    </a>
  );
}
