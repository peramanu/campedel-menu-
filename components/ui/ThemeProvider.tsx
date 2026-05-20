"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ClickPos = { x: number; y: number };

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme, clickPos?: ClickPos) => void;
}>({ theme: "system", setTheme: () => {} });

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") {
    root.classList.add("dark");
  } else if (t === "light") {
    root.classList.remove("dark");
  } else {
    root.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme | null) ?? "system";
    setThemeState(stored);
    applyTheme(stored);
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      document.documentElement.classList.toggle("dark", e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  function setTheme(t: Theme, clickPos?: ClickPos) {
    const doApply = () => {
      setThemeState(t);
      localStorage.setItem("theme", t);
      applyTheme(t);
    };

    const supportsVT =
      typeof document !== "undefined" && "startViewTransition" in document;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!supportsVT || !clickPos || reducedMotion) {
      doApply();
      return;
    }

    const goingDark =
      t === "dark" ||
      (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const root = document.documentElement;
    root.style.setProperty("--vt-x", `${clickPos.x}px`);
    root.style.setProperty("--vt-y", `${clickPos.y}px`);
    root.dataset.vt = goingDark ? "dark" : "light";

    const vt = (document as Document & { startViewTransition: (cb: () => void) => { finished: Promise<void> } })
      .startViewTransition(doApply);

    vt.finished.then(() => {
      delete root.dataset.vt;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
