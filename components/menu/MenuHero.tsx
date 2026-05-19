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
      <div className="max-w-lg mx-auto px-5 pt-10 pb-9 flex flex-col items-center text-center">

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5"
        >
          <Image
            src="/logo/logo.png"
            alt="Campedèl"
            width={96}
            height={96}
            className="logo-img object-contain"
            priority
          />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="font-heading font-bold text-[28px] sm:text-[34px] leading-none tracking-tight text-zinc-900 dark:text-zinc-50 mb-1.5"
        >
          Campedèl
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold mb-6"
        >
          {t("tagline")}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.35, delay: 0.35 }}
          className="w-10 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-6"
        />

        {/* Language switcher — prominent here */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.42 }}
          className="mb-7"
        >
          <LanguageSwitcher current={locale} />
        </motion.div>

        {/* Scroll CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.55 }}
          onClick={onScrollDown}
          className="flex flex-col items-center gap-1 text-muted-light dark:text-muted-dark hover:text-gold dark:hover:text-gold transition-colors group min-h-[44px] justify-center"
          aria-label="Zur Speisekarte scrollen"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Speisekarte</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-bg-light dark:from-bg-dark to-transparent pointer-events-none" />
    </motion.section>
  );
}
