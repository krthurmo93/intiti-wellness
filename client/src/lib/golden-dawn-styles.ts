import type { CSSProperties } from "react";
import { canAccessGoldenDawn } from "./storage";
import { GoldenDawnTheme } from "./golden-dawn-theme";

export function isGoldenDawnActive(element: string | null): boolean {
  return element === "golden_dawn" && canAccessGoldenDawn();
}

interface ElementColors {
  cardBg: string;
  cardBorder: string;
  isDark: boolean;
  accentGlow?: string;
  accentPrimary?: string;
  accentSecondary?: string;
  textPrimary?: string;
  textSecondary?: string;
  textMuted?: string;
}

// CARD STYLING - Updated with user-specified colors
export function getGoldenDawnCardStyle(colors: ElementColors, element: string | null): CSSProperties {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn) {
    return {
      background: GoldenDawnTheme.cards.background,
      borderColor: GoldenDawnTheme.cards.border,
      boxShadow: `${GoldenDawnTheme.cards.shadow}, ${GoldenDawnTheme.cards.innerGlow}`,
      backdropFilter: "blur(8px)",
    };
  }
  return {
    background: colors.isDark 
      ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.9) 40%, rgba(49, 46, 129, 0.8) 100%)'
      : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 40%, #f8f5ff 100%)'
  };
}

// INPUT/TEXTAREA STYLING - High contrast text
export function getGoldenDawnInputStyle(element: string | null): CSSProperties {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn) {
    return {
      background: GoldenDawnTheme.inputs.backgroundSolid,
      borderColor: GoldenDawnTheme.inputs.border,
      color: GoldenDawnTheme.inputs.text,
    };
  }
  return {};
}

// BUTTON STYLING - Golden Dawn variant
export function getGoldenDawnButtonStyle(element: string | null, variant: "primary" | "secondary" = "primary"): CSSProperties {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn) {
    if (variant === "primary") {
      return {
        background: GoldenDawnTheme.buttons.primary.background,
        color: GoldenDawnTheme.buttons.primary.textColor,
        boxShadow: GoldenDawnTheme.buttons.primary.shadow,
        border: "none",
      };
    }
    return {
      background: GoldenDawnTheme.buttons.secondary.background,
      color: GoldenDawnTheme.buttons.secondary.textColor,
      border: GoldenDawnTheme.buttons.secondary.border,
    };
  }
  return {};
}

// TEXT COLORS - High contrast brown for Golden Dawn
export function getGoldenDawnTextColors(element: string | null): { primary: string; secondary: string; muted: string; placeholder: string } | null {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn) {
    return {
      primary: GoldenDawnTheme.text.primary,
      secondary: GoldenDawnTheme.text.secondary,
      muted: GoldenDawnTheme.text.muted,
      placeholder: GoldenDawnTheme.text.placeholder,
    };
  }
  return null;
}

// ICON COLOR
export function getGoldenDawnIconColor(element: string | null): string | null {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn) {
    return GoldenDawnTheme.icons.tint;
  }
  return null;
}

// Hover variant for Golden Dawn surface cards
export function getGoldenDawnCardHoverStyle(element: string | null): CSSProperties {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn) {
    return {
      boxShadow: "0 6px 24px rgba(229, 156, 69, 0.25)",
      transform: "translateY(-1px)",
    };
  }
  return {};
}

export function getGoldenDawnIconStyle(colors: ElementColors, element: string | null): CSSProperties {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn) {
    return {
      background: `linear-gradient(135deg, ${colors.accentPrimary || "#F5C86A"}, ${colors.accentSecondary || "#EFA045"})`,
    };
  }
  return {
    background: colors.isDark
      ? 'radial-gradient(circle at 30% 20%, #c084fc 0%, #a855f7 60%, #581c87 100%)'
      : 'radial-gradient(circle at 30% 20%, #fcd34d 0%, #f59e0b 60%, #92400e 100%)'
  };
}

export function getGoldenDawnAccentColor(colors: ElementColors, element: string | null): string {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn) {
    return colors.accentPrimary || "#F5C86A";
  }
  return colors.isDark ? '#a78bfa' : '#f59e0b';
}

// Get background classes for the main app wrapper
export function getGoldenDawnBackgroundClasses(element: string | null): string {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn) {
    return "gd-gradient-bg";
  }
  return "";
}

// Get classes for cards with glow animation and warm surface
export function getGoldenDawnCardClasses(element: string | null): string {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn) {
    return "gd-surface-card gd-card-glow gd-press-effect gd-hover-lift";
  }
  return "";
}

// Get classes for primary CTA buttons with breathing glow
export function getGoldenDawnButtonClasses(element: string | null, isPrimary: boolean = false): string {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn) {
    if (isPrimary) {
      return "gd-glow gd-press-effect";
    }
    return "gd-press-effect gd-hover-lift";
  }
  return "";
}

// Get classes for floating icons/badges
export function getGoldenDawnFloatClasses(element: string | null): string {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn) {
    return "gd-float";
  }
  return "";
}

// Get background style for the main app container
export function getGoldenDawnContainerStyle(colors: ElementColors, element: string | null): CSSProperties {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn) {
    return {
      background: `linear-gradient(to bottom, #FFE7B3, #EFA045, #E2755B)`,
    };
  }
  return {};
}

// Get navigation icon accent styling
export function getGoldenDawnNavAccentStyle(element: string | null, isActive: boolean): CSSProperties {
  const isGoldenDawn = isGoldenDawnActive(element);
  if (isGoldenDawn && isActive) {
    return {
      color: "#F5C86A",
      filter: "drop-shadow(0 0 6px rgba(245, 200, 106, 0.6))",
    };
  }
  return {};
}
