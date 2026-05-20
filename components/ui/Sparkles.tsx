"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Particle = { id: string; x: number; y: number; scale: number; duration: number };

function makeParticle(): Particle {
  return {
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    x: Math.random() * 110 - 5,
    y: Math.random() * 110 - 5,
    scale: 0.35 + Math.random() * 0.75,
    duration: 1.0 + Math.random() * 0.9,
  };
}

export function Sparkles({
  children,
  count = 7,
  className = "",
}: {
  children?: React.ReactNode;
  count?: number;
  className?: string;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: count }, makeParticle));
    let idx = 0;
    const t = setInterval(() => {
      idx = (idx + 1) % count;
      setParticles((prev) => {
        const next = [...prev];
        next[idx] = makeParticle();
        return next;
      });
    }, 420);
    return () => clearInterval(t);
  }, [count]);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {particles.map((p) => (
          <motion.svg
            key={p.id}
            className="pointer-events-none absolute z-10"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: 11 * p.scale, height: 11 * p.scale }}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: -26 * p.scale }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.duration, ease: [0.4, 0, 0.6, 1] }}
            viewBox="0 0 12 12"
            aria-hidden
          >
            <path
              d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z"
              fill="#C9A96E"
              fillOpacity="0.9"
            />
          </motion.svg>
        ))}
      </AnimatePresence>
      {children}
    </div>
  );
}
