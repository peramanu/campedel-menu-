"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import { Printer, Download, ChevronLeft, ChevronRight } from "lucide-react";

const BG_PHOTOS = [
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/Hof_22-1030x690.jpg",     label: "Campedèl-Hof" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/Alm_01.jpg",               label: "Seiser Alm" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/IMG_9800-1030x773.jpeg",   label: "Küche" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/Kuh_Hof_1-1030x685.jpg",  label: "Almvieh" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2020/11/IMG_4712-1030x773.jpeg",   label: "Stube" },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/IMG_4834-1030x773.jpeg",   label: "Spezialitäten" },
];

export function QRClient() {
  const [menuUrl, setMenuUrl] = useState("https://campedel-hof.it/menu");
  const [bgIndex, setBgIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuUrl(window.location.origin + "/menu");
  }, []);

  // Auto-cycle background every 6s
  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setBgIndex((i) => (i + 1) % BG_PHOTOS.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  function go(delta: number) {
    setDirection(delta);
    setBgIndex((i) => (i + delta + BG_PHOTOS.length) % BG_PHOTOS.length);
  }

  function handleDownload() {
    const svg = document.getElementById("campedel-qr") as SVGElement | null;
    if (!svg) return;
    const svgStr = new XMLSerializer().serializeToString(svg);
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#FFFEFB";
    ctx.fillRect(0, 0, size, size);
    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      const a = document.createElement("a");
      a.download = "campedel-qr.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
  }

  function handlePrint() {
    window.print();
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 40, scale: 1.04 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit:  (d: number) => ({ opacity: 0, x: d * -40, scale: 0.97 }),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-[26px] text-zinc-900 dark:text-zinc-100 leading-none mb-1">
            QR-Code
          </h1>
          <p className="text-[13px] text-muted-light dark:text-muted-dark">
            Tischkarte zum Ausdrucken & Teilen
          </p>
        </div>
        <div className="flex gap-2 no-print">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-[13px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            <Download size={14} strokeWidth={1.8} />
            QR laden
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gold text-white text-[13px] font-semibold hover:bg-gold-dark transition shadow-md shadow-gold/20"
          >
            <Printer size={14} strokeWidth={1.8} />
            Drucken
          </button>
        </div>
      </div>

      {/* Card preview — this is what gets printed */}
      <div className="flex justify-center">
        <div
          ref={cardRef}
          id="qr-print-card"
          className="relative w-[320px] rounded-3xl overflow-hidden shadow-2xl"
          style={{ height: 500 }}
        >
          {/* Background photo carousel */}
          <AnimatePresence custom={direction} mode="sync">
            <motion.div
              key={bgIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={BG_PHOTOS[bgIndex].src}
                alt={BG_PHOTOS[bgIndex].label}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dark vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/75 z-10" />

          {/* Diamond tile texture */}
          <div className="absolute inset-0 z-10 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 4 L44 24 L24 44 L4 24 Z' fill='none' stroke='%23C9A96E' stroke-width='0.8'/%3E%3C/svg%3E")`,
              backgroundSize: "48px 48px",
            }}
          />

          {/* Card content */}
          <div className="relative z-20 flex flex-col items-center justify-between h-full px-7 py-9">

            {/* Top: brand */}
            <div className="flex flex-col items-center text-center">
              {/* Logo ring */}
              <div
                className="relative rounded-full flex items-center justify-center mb-4"
                style={{
                  width: 72, height: 72,
                  background: "linear-gradient(145deg, rgba(201,169,110,0.22) 0%, rgba(201,169,110,0.06) 100%)",
                  boxShadow: "0 0 0 1px rgba(201,169,110,0.5), inset 0 0 0 1px rgba(201,169,110,0.15)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <div className="absolute inset-0 rounded-full scale-[2.2] bg-gold/10 blur-2xl pointer-events-none" />
                <Image
                  src="/logo/logo.png"
                  alt="Campedèl"
                  width={46}
                  height={46}
                  className="relative object-contain"
                  style={{ filter: "invert(1) brightness(1.2)" }}
                />
              </div>

              <h2 className="font-heading font-bold text-[30px] text-white leading-none tracking-[-0.01em] mb-1.5">
                Campedèl
              </h2>
              <p className="text-[9px] font-bold tracking-[0.35em] uppercase text-gold mb-1">
                Hof · Seiser Alm
              </p>
              <p className="text-[8px] tracking-[0.25em] text-white/50 uppercase font-medium">
                1.844 m ü.M. · Kastelruth
              </p>
            </div>

            {/* Middle: gold rule */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/60" />
              <div className="w-1.5 h-1.5 rotate-45 bg-gold/80 flex-shrink-0" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/60" />
            </div>

            {/* QR code */}
            <div
              className="rounded-2xl p-4 flex items-center justify-center"
              style={{
                background: "rgba(255,254,251,0.96)",
                boxShadow: "0 0 0 1.5px rgba(201,169,110,0.5), 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,1)",
                backdropFilter: "blur(4px)",
              }}
            >
              <QRCode
                id="campedel-qr"
                value={menuUrl}
                size={148}
                fgColor="#1a1612"
                bgColor="transparent"
                level="M"
              />
            </div>

            {/* Bottom: text */}
            <div className="text-center">
              <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-white mb-1.5">
                Speisekarte
              </p>
              <p className="text-[9px] tracking-[0.2em] text-white/60 mb-3">
                Menu · Menù · Menu
              </p>
              <p className="text-[8px] text-gold/70 tracking-[0.15em] font-medium">
                campedel-hof.it
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo selector */}
      <div className="no-print space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-light dark:text-muted-dark">
            Hintergrundbild
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => go(-1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <ChevronLeft size={14} strokeWidth={2} />
            </button>
            <button
              onClick={() => go(1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <ChevronRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {BG_PHOTOS.map((p, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > bgIndex ? 1 : -1); setBgIndex(i); }}
              className={`flex-shrink-0 w-[88px] h-[62px] rounded-xl overflow-hidden transition-all ${
                i === bgIndex
                  ? "ring-2 ring-gold ring-offset-2 ring-offset-bg-light dark:ring-offset-bg-dark opacity-100"
                  : "opacity-60 hover:opacity-85"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.label} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* URL display */}
      <div className="no-print card-surface rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
        <p className="text-[12px] text-muted-light dark:text-muted-dark flex-1 truncate font-mono">
          {menuUrl}
        </p>
      </div>
    </div>
  );
}
