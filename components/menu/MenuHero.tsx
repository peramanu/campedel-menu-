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
      transition={{ duration: 0.5 }}
      className="hero-gradient diamond-tile relative overflow-hidden select-none"
    >
      <div className="max-w-lg mx-auto px-5 pt-12 pb-10 flex flex-col items-center text-center">

        {/* Logo with soft glow ring */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 relative"
        >
          {/* Glow halo */}
          <div className="absolute inset-0 rounded-full bg-gold/10 dark:bg-gold/8 blur-2xl scale-150 pointer-events-none" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28">
            <Image
              src="/logo/logo.png"
              alt="Campedèl"
              fill
              className="logo-img object-contain drop-shadow-sm"
              priority
            />
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="font-heading font-bold text-[32px] sm:text-[38px] leading-none tracking-tight text-zinc-900 dark:text-zinc-50 mb-2"
        >
          Campedèl
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.22 }}
          className="text-[10px] font-bold tracking-[0.22em] uppercase text-gold mb-1"
        >
          Hof · Seiser Alm
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="text-[12px] text-muted-light dark:text-muted-dark mb-6"
        >
          {t("tagline")}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.38 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/50" />
          <div className="w-1 h-1 rounded-full bg-gold/60" />
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/50" />
        </motion.div>

        {/* Language switcher */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.44 }}
          className="mb-8"
        >
          <LanguageSwitcher current={locale} />
        </motion.div>

        {/* Scroll CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.58 }}
          onClick={onScrollDown}
          className="flex flex-col items-center gap-1.5 text-muted-light dark:text-muted-dark hover:text-gold dark:hover:text-gold transition-colors group min-h-[44px] justify-center"
          aria-label="Zur Speisekarte scrollen"
        >
          <span className="text-[10px] tracking-[0.22em] uppercase font-semibold">Speisekarte</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={16} strokeWidth={1.8} />
          </motion.div>
        </motion.button>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-bg-light dark:from-bg-dark to-transparent pointer-events-none" />
    </motion.section>
  );
}
