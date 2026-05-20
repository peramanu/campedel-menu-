"use client";
import { useEffect, useState } from "react";

type WX = { temp: number; code: number };

const EMOJI: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌧️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "❄️", 75: "❄️", 77: "🌨️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  85: "🌨️", 86: "❄️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

function emoji(code: number) {
  // find nearest match
  return EMOJI[code] ?? EMOJI[Math.round(code / 10) * 10] ?? "🌡️";
}

export function WeatherWidget() {
  const [wx, setWx] = useState<WX | null>(null);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=46.538&longitude=11.558" +
      "&current=temperature_2m,weather_code" +
      "&timezone=Europe%2FRome"
    )
      .then((r) => r.json())
      .then((d) =>
        setWx({ temp: Math.round(d.current.temperature_2m), code: d.current.weather_code })
      )
      .catch(() => {});
  }, []);

  if (!wx) return null;

  return (
    <div className="flex items-center justify-center gap-2 text-[12px] text-muted-light dark:text-muted-dark">
      {/* Live pulse dot */}
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      <span className="text-base leading-none">{emoji(wx.code)}</span>
      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{wx.temp}°</span>
      <span className="text-zinc-400 dark:text-zinc-600">·</span>
      <span className="tracking-wide">Seis am Schlern</span>
    </div>
  );
}
