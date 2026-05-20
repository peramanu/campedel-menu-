"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import { Printer, Download, ChevronLeft, ChevronRight, Hash } from "lucide-react";

const BG_PHOTOS = [
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/Hof_22-1030x690.jpg",    label: "Campedèl-Hof"  },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/Alm_01.jpg",              label: "Seiser Alm"    },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/IMG_9800-1030x773.jpeg",  label: "Küche"         },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/Kuh_Hof_1-1030x685.jpg", label: "Almvieh"       },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2020/11/IMG_4712-1030x773.jpeg",  label: "Stube"         },
  { src: "https://www.campedel-hof.it/wp-content/uploads/2016/05/IMG_4834-1030x773.jpeg",  label: "Spezialitäten" },
];

export function QRClient() {
  const [menuUrl, setMenuUrl] = useState("https://campedel-hof.it/menu");
  const [tableNumber, setTableNumber] = useState("");
  const [bgIndex, setBgIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    setMenuUrl(window.location.origin + "/menu");
  }, []);

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
    const svg = document.getElementById("campedel-qr") as SVGElement | null;
    if (!svg) return;
    const svgStr = new XMLSerializer().serializeToString(svg);
    const qrDataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
    const photo = BG_PHOTOS[bgIndex];
    const logoUrl = window.location.origin + "/logo/logo.png";
    const tableLabel = tableNumber.trim() ? `<div class="table-badge">Tisch ${tableNumber.trim()}</div>` : "";

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Campedèl${tableNumber.trim() ? " – Tisch " + tableNumber.trim() : ""}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0ece4;font-family:Georgia,"Times New Roman",serif}
  @page{size:A4;margin:10mm}
  @media print{html,body{background:white}}
  .card{position:relative;width:320px;height:500px;border-radius:24px;overflow:hidden;flex-shrink:0}
  .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.62) 0%,rgba(0,0,0,.28) 45%,rgba(0,0,0,.75) 100%)}
  .diamonds{position:absolute;inset:0;opacity:.07;background-image:url("data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 4 L44 24 L24 44 L4 24 Z' fill='none' stroke='%23C9A96E' stroke-width='.8'/%3E%3C/svg%3E");background-size:48px 48px}
  .content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:space-between;height:100%;padding:36px 28px}
  .brand{text-align:center}
  .logo-ring{width:72px;height:72px;border-radius:50%;background:linear-gradient(145deg,rgba(201,169,110,.22) 0%,rgba(201,169,110,.06) 100%);box-shadow:0 0 0 1px rgba(201,169,110,.5),inset 0 0 0 1px rgba(201,169,110,.15);display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
  .logo-img{width:46px;height:46px;object-fit:contain;filter:invert(1) brightness(1.2)}
  .name{color:#fff;font-size:30px;font-weight:bold;letter-spacing:-.01em;margin-bottom:6px}
  .sub1{color:#C9A96E;font-size:9px;letter-spacing:.35em;text-transform:uppercase;font-weight:bold;font-family:sans-serif;margin-bottom:4px}
  .sub2{color:rgba(255,255,255,.5);font-size:8px;letter-spacing:.25em;text-transform:uppercase;font-family:sans-serif}
  .rule{display:flex;align-items:center;gap:12px;width:100%}
  .rl{flex:1;height:1px}
  .rl-l{background:linear-gradient(to right,transparent,rgba(201,169,110,.6))}
  .rl-r{background:linear-gradient(to left,transparent,rgba(201,169,110,.6))}
  .rd{width:6px;height:6px;background:rgba(201,169,110,.8);transform:rotate(45deg);flex-shrink:0}
  .qr-wrap{background:rgba(255,254,251,.96);border-radius:16px;padding:16px;box-shadow:0 0 0 1.5px rgba(201,169,110,.5),0 8px 32px rgba(0,0,0,.35),inset 0 1px 0 #fff}
  .qr-img{display:block;width:148px;height:148px}
  .bottom{text-align:center}
  .cta{color:#fff;font-size:11px;font-weight:bold;letter-spacing:.3em;text-transform:uppercase;font-family:sans-serif;margin-bottom:6px}
  .lang{color:rgba(255,255,255,.6);font-size:9px;letter-spacing:.2em;font-family:sans-serif;margin-bottom:8px}
  .url{color:rgba(201,169,110,.7);font-size:8px;letter-spacing:.15em;font-weight:500;font-family:sans-serif}
  .table-badge{display:inline-block;margin-top:10px;background:rgba(201,169,110,.18);border:1px solid rgba(201,169,110,.5);color:#C9A96E;font-family:sans-serif;font-size:10px;font-weight:bold;letter-spacing:.22em;padding:5px 14px;border-radius:9999px;text-transform:uppercase}
</style>
</head>
<body>
<div class="card">
  <img class="bg" src="${photo.src}" />
  <div class="overlay"></div>
  <div class="diamonds"></div>
  <div class="content">
    <div class="brand">
      <div class="logo-ring"><img class="logo-img" src="${logoUrl}" /></div>
      <div class="name">Campedèl</div>
      <div class="sub1">Hof · Seiser Alm</div>
      <div class="sub2">1.844 m ü.M. · Kastelruth</div>
    </div>
    <div class="rule">
      <div class="rl rl-l"></div><div class="rd"></div><div class="rl rl-r"></div>
    </div>
    <div class="qr-wrap"><img class="qr-img" src="${qrDataUrl}" /></div>
    <div class="bottom">
      <div class="cta">Speisekarte</div>
      <div class="lang">Menu · Menù · Menu</div>
      <div class="url">campedel-hof.it</div>
      ${tableLabel}
    </div>
  </div>
</div>
<script>
  (function(){
    var imgs=document.querySelectorAll('img'),n=imgs.length,done=0;
    function tryPrint(){if(++done>=n)setTimeout(function(){window.print();},150);}
    if(n===0){setTimeout(function(){window.print();},150);return;}
    imgs.forEach(function(img){
      if(img.complete)tryPrint();
      else{img.onload=tryPrint;img.onerror=tryPrint;}
    });
  })();
</script>
</body>
</html>`;

    const w = window.open("", "_blank", "width=520,height=720");
    if (w) { w.document.write(html); w.document.close(); }
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 40, scale: 1.04 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit:   (d: number) => ({ opacity: 0, x: d * -40, scale: 0.97 }),
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
            Tischkarte zum Ausdrucken &amp; Teilen
          </p>
        </div>
        <div className="flex gap-2">
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

      {/* Card preview */}
      <div className="flex justify-center">
        <div
          id="qr-print-card"
          className="relative w-[320px] rounded-3xl overflow-hidden shadow-2xl"
          style={{ height: 500 }}
        >
          {/* Animated background */}
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

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/[0.28] to-black/75 z-10" />

          {/* Diamond texture */}
          <div className="absolute inset-0 z-10 opacity-[0.07]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 4 L44 24 L24 44 L4 24 Z' fill='none' stroke='%23C9A96E' stroke-width='0.8'/%3E%3C/svg%3E")`,
            backgroundSize: "48px 48px",
          }} />

          {/* Content */}
          <div className="relative z-20 flex flex-col items-center justify-between h-full px-7 py-9">

            {/* Brand */}
            <div className="flex flex-col items-center text-center">
              <div
                className="relative rounded-full flex items-center justify-center mb-4"
                style={{
                  width: 72, height: 72,
                  background: "linear-gradient(145deg,rgba(201,169,110,0.22) 0%,rgba(201,169,110,0.06) 100%)",
                  boxShadow: "0 0 0 1px rgba(201,169,110,0.5),inset 0 0 0 1px rgba(201,169,110,0.15)",
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

            {/* Gold rule */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/60" />
              <div className="w-1.5 h-1.5 rotate-45 bg-gold/80 flex-shrink-0" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/60" />
            </div>

            {/* QR */}
            <div
              className="rounded-2xl p-4 flex items-center justify-center"
              style={{
                background: "rgba(255,254,251,0.96)",
                boxShadow: "0 0 0 1.5px rgba(201,169,110,0.5),0 8px 32px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,1)",
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

            {/* Bottom */}
            <div className="text-center">
              <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-white mb-1.5">
                Speisekarte
              </p>
              <p className="text-[9px] tracking-[0.2em] text-white/60 mb-2">
                Menu · Menù · Menu
              </p>
              <p className="text-[8px] text-gold/70 tracking-[0.15em] font-medium">
                campedel-hof.it
              </p>
              {tableNumber.trim() && (
                <div className="mt-2.5 inline-flex items-center bg-gold/15 border border-gold/40 rounded-full px-3 py-1.5">
                  <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-gold">
                    Tisch {tableNumber.trim()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table number input */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold uppercase tracking-[0.22em] text-muted-light dark:text-muted-dark">
          Tischnummer
        </label>
        <div className="relative">
          <Hash size={13} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 pointer-events-none" />
          <input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="z. B.  5"
            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-bg-light dark:bg-bg-dark text-zinc-900 dark:text-zinc-100 text-[14px] focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          />
        </div>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
          Erscheint auf der Tischkarte als goldenes Badge
        </p>
      </div>

      {/* Photo selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-light dark:text-muted-dark">
            Hintergrundbild — {BG_PHOTOS[bgIndex].label}
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
                  : "opacity-55 hover:opacity-80"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.label} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Menu URL */}
      <div className="card-surface rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
        <p className="text-[12px] text-muted-light dark:text-muted-dark flex-1 truncate font-mono">
          {menuUrl}
        </p>
      </div>

    </div>
  );
}
