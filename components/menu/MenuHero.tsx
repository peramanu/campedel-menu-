"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function MenuHero({
  locale,
  onScrollDown,
}: {
  locale: string;
  onScrollDown: () => void;
}) {
  const t = useTranslations("hero");

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.65 }}
      className="hero-gradient diamond-tile relative overflow-hidden select-none"
    >
      <div className="max-w-lg mx-auto px-6 pt-14 pb-12 flex flex-col items-center text-center">

        {/* Logo — gold-ring frame */}
        <motion.div
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7 relative"
        >
          {/* Outer atmospheric glow */}
          <div className="absolute inset-0 rounded-full scale-[2.5] bg-gold/10 dark:bg-gold/7 blur-3xl pointer-events-none" />
          {/* Thin gold orbit ring */}
          <div
            className="relative rounded-full flex items-center justify-center"
            style={{
              width: 108,
              height: 108,
              background: "linear-gradient(145deg, rgba(201,169,110,0.18) 0%, rgba(201,169,110,0.04) 100%)",
              boxShadow: "0 0 0 1px rgba(201,169,110,0.35), inset 0 0 0 1px rgba(201,169,110,0.12)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div className="relative w-[72px] h-[72px] sm:w-[80px] sm:h-[80px]">
              <Image
                src="/logo/logo.png"
                alt="Campedèl"
                fill
                className="logo-img object-contain"
                priority
              />
            </div>
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.48, delay: 0.14 }}
          className="font-heading font-bold text-[38px] sm:text-[44px] leading-none tracking-[-0.015em] text-zinc-900 dark:text-zinc-50 mb-2"
        >
          Campedèl
        </motion.h1>

        {/* Elevation + location — alpine identity */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.38, delay: 0.25 }}
          className="text-[10px] font-bold tracking-[0.32em] uppercase text-gold mb-5"
        >
          Hof · Seiser Alm · 1.844 m
        </motion.p>

        {/* Ornamental divider with rotated diamond */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.33 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="w-14 h-px bg-gradient-to-r from-transparent via-gold/40 to-gold/60" />
          <div className="w-1.5 h-1.5 rotate-45 bg-gold/70 flex-shrink-0" />
          <div className="w-14 h-px bg-gradient-to-l from-transparent via-gold/40 to-gold/60" />
        </motion.div>

        {/* Tagline — italic Playfair for character */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.38, delay: 0.4 }}
          className="text-[13px] sm:text-[14px] italic font-heading text-muted-light dark:text-muted-dark mb-8 leading-relaxed max-w-[280px]"
        >
          {t("tagline")}
        </motion.p>

        {/* Language switcher */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.48 }}
          className="mb-9"
        >
          <LanguageSwitcher current={locale} />
        </motion.div>

        {/* Scroll CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.32, delay: 0.62 }}
          onClick={onScrollDown}
          className="flex flex-col items-center gap-1.5 text-muted-light dark:text-muted-dark hover:text-gold dark:hover:text-gold transition-colors min-h-[44px] justify-center"
          aria-label="Zur Speisekarte scrollen"
        >
          <span className="text-[10px] tracking-[0.28em] uppercase font-semibold">Speisekarte</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={16} strokeWidth={1.5} />
          </motion.div>
        </motion.button>
      </div>

      {/* Soft bottom fade into page */}
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-bg-light dark:from-bg-dark to-transparent pointer-events-none" />
    </motion.section>
  );
}
