import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Element } from "@shared/schema";
import { getCurrentElement, saveCurrentElement, getUserProfile } from "./storage";
import { elementMapping } from "@shared/schema";

type ElementTheme = {
  element: Element | null;
  setElement: (element: Element) => void;
  colors: {
    gradient: string;
    accent: string;
    accentForeground: string;
    overlay: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    cardBg: string;
    cardBorder: string;
    isDark: boolean;
    // Golden Dawn specific tokens (optional)
    accentPrimary?: string;
    accentSecondary?: string;
    accentGlow?: string;
    backgroundPrimary?: string;
    backgroundSecondary?: string;
    success?: string;
    warning?: string;
    error?: string;
  };
};

const elementColors: Record<Element, ElementTheme["colors"]> = {
  fire: {
    gradient: "from-orange-50 via-red-50 to-amber-50",
    accent: "bg-gradient-to-br from-orange-400 to-red-500",
    accentForeground: "text-white",
    overlay: "bg-orange-500/5",
    textPrimary: "#292524",
    textSecondary: "#57534e",
    textMuted: "#78716c",
    cardBg: "rgba(255, 255, 255, 0.8)",
    cardBorder: "rgba(214, 211, 209, 0.5)",
    isDark: false,
  },
  water: {
    gradient: "from-cyan-50 via-blue-50 to-teal-50",
    accent: "bg-gradient-to-br from-cyan-400 to-blue-500",
    accentForeground: "text-white",
    overlay: "bg-blue-500/5",
    textPrimary: "#292524",
    textSecondary: "#57534e",
    textMuted: "#78716c",
    cardBg: "rgba(255, 255, 255, 0.8)",
    cardBorder: "rgba(214, 211, 209, 0.5)",
    isDark: false,
  },
  air: {
    gradient: "from-purple-50 via-indigo-50 to-sky-50",
    accent: "bg-gradient-to-br from-purple-400 to-indigo-500",
    accentForeground: "text-white",
    overlay: "bg-purple-500/5",
    textPrimary: "#292524",
    textSecondary: "#57534e",
    textMuted: "#78716c",
    cardBg: "rgba(255, 255, 255, 0.8)",
    cardBorder: "rgba(214, 211, 209, 0.5)",
    isDark: false,
  },
  earth: {
    gradient: "from-amber-50 via-stone-50 to-green-50",
    accent: "bg-gradient-to-br from-amber-500 to-green-600",
    accentForeground: "text-white",
    overlay: "bg-green-500/5",
    textPrimary: "#292524",
    textSecondary: "#57534e",
    textMuted: "#78716c",
    cardBg: "rgba(255, 255, 255, 0.8)",
    cardBorder: "rgba(214, 211, 209, 0.5)",
    isDark: false,
  },
  cosmic: {
    gradient: "from-slate-950 via-indigo-950 to-violet-950",
    accent: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
    accentForeground: "text-white",
    overlay: "bg-violet-500/10",
    textPrimary: "#ffffff",
    textSecondary: "#ddd6fe",
    textMuted: "rgba(196, 181, 253, 0.7)",
    cardBg: "rgba(255, 255, 255, 0.05)",
    cardBorder: "rgba(255, 255, 255, 0.1)",
    isDark: true,
  },
  golden_dawn: {
    // Golden Dawn premium theme - Initiate/Ascended only
    // Uses warm sunrise gradient with gold accents (Tailwind-compatible stops)
    // Official tokens: GD_PRIMARY_GOLD=#F5C86A, GD_DEEP_ORANGE=#EFA045, GD_CORAL=#E2755B
    gradient: "from-[#FFE7B3] via-[#EFA045] to-[#E2755B]",
    accent: "gd-button-primary",
    accentForeground: "text-[#1B1A17]",
    overlay: "bg-[#F5C86A]/10",
    textPrimary: "#1B1A17",
    textSecondary: "#3D3A34",
    textMuted: "#5C5850",
    cardBg: "rgba(255, 255, 255, 0.15)",
    cardBorder: "rgba(245, 200, 106, 0.4)",
    isDark: false,
    // Golden Dawn specific tokens
    accentPrimary: "#F5C86A",
    accentSecondary: "#EFA045",
    accentGlow: "rgba(245, 200, 106, 0.4)",
    backgroundPrimary: "#FFE7B3",
    backgroundSecondary: "#E2755B",
    success: "#4CAF50",
    warning: "#EFA045",
    error: "#E2755B",
  },
};

const defaultColors: ElementTheme["colors"] = {
  gradient: "from-amber-50/50 via-stone-50 to-amber-50/30",
  accent: "bg-gradient-to-br from-amber-500 to-amber-600",
  accentForeground: "text-white",
  overlay: "bg-amber-500/3",
  textPrimary: "#292524",
  textSecondary: "#57534e",
  textMuted: "#78716c",
  cardBg: "rgba(255, 255, 255, 0.8)",
  cardBorder: "rgba(214, 211, 209, 0.5)",
  isDark: false,
};

const ElementThemeContext = createContext<ElementTheme | null>(null);

// Default theme is always Cosmic for new users and fallback
const DEFAULT_THEME: Element = "cosmic";

export function ElementThemeProvider({ children }: { children: ReactNode }) {
  const [element, setElementState] = useState<Element | null>(() => {
    // Check for explicitly saved theme preference first
    const stored = getCurrentElement();
    if (stored) return stored;
    
    // For new users without a saved preference, default to Cosmic
    return DEFAULT_THEME;
  });

  useEffect(() => {
    const stored = getCurrentElement();
    if (stored) {
      setElementState(stored);
    }
    // If no stored preference, keep the default (Cosmic) - don't auto-set based on sun sign
  }, []);

  // Apply golden-dawn class to document root when theme is active
  useEffect(() => {
    const root = document.documentElement;
    if (element === "golden_dawn") {
      root.classList.add("golden-dawn");
      root.classList.remove("dark");
    } else {
      root.classList.remove("golden-dawn");
      // Apply dark class for dark themes
      const colors = element ? elementColors[element] : defaultColors;
      if (colors.isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [element]);

  const setElement = (newElement: Element) => {
    setElementState(newElement);
    saveCurrentElement(newElement);
  };

  const colors = element ? elementColors[element] : defaultColors;

  return (
    <ElementThemeContext.Provider value={{ element, setElement, colors }}>
      {children}
    </ElementThemeContext.Provider>
  );
}

export function useElementTheme() {
  const context = useContext(ElementThemeContext);
  if (!context) {
    throw new Error("useElementTheme must be used within ElementThemeProvider");
  }
  return context;
}
