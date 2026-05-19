"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export function MenuHero({ onScrollDown }: { onScrollDown: () => void }) {
  const t = useTranslations("hero");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="hero-gradient diamond-tile relative overflow-hidden"
    >
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-12 flex flex-col items-center text-center">

        {/* Logo mark — large */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Image
            src="/logo/logo.png"
            alt="Campedèl"
            width={120}
            height={120}
            className="logo-img object-contain"
            priority
          />
        </motion.div>

        {/* Wordmark + tagline */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="mb-8"
        >
          <h1 className="font-heading font-bold text-[32px] leading-none tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
            Campedèl
          </h1>
          <p className="text-sm font-medium tracking-[0.18em] uppercase text-gold">
            {t("tagline")}
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-8"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="text-sm text-muted-light dark:text-muted-dark max-w-xs leading-relaxed mb-10"
        >
          {t("subtitle")}
        </motion.p>

        {/* Scroll down CTA */}
        <motion.button
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          onClick={onScrollDown}
          className="flex flex-col items-center gap-1.5 text-muted-light dark:text-muted-dark hover:text-gold transition-colors group"
          aria-label="Zur Speisekarte"
        >
          <span className="text-xs tracking-widest uppercase">Speisekarte</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} className="group-hover:text-gold" />
          </motion.div>
        </motion.button>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bg-light dark:from-bg-dark to-transparent pointer-events-none" />
    </motion.div>
  );
}
