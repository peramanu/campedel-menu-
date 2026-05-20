"use client";

/**
 * Animated rotating border — the beam travels around the card edge.
 * Uses CSS @property for smooth hue rotation; gracefully static in
 * browsers that don't support @property.
 */
export function BorderBeam({
  duration = 5,
  colorFrom = "rgba(201,169,110,0.0)",
  colorTo = "rgba(201,169,110,0.85)",
  width = 1.5,
  delay = 0,
}: {
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  width?: number;
  delay?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      aria-hidden
      style={{
        border: `${width}px solid transparent`,
        background: `
          linear-gradient(var(--surface, #FFFEFB), var(--surface, #FFFEFB)) padding-box,
          linear-gradient(var(--beam-angle, 0deg), ${colorFrom}, ${colorTo}, ${colorFrom}) border-box
        `,
        animation: `border-beam ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}
