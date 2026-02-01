/**
 * Golden Dawn Theme - Official Color Tokens
 * 
 * Premium theme exclusive to Initiates/Premium/Ascended tiers.
 * Features warm sunrise gradient aesthetic with high-contrast text.
 */

export const GoldenDawnTheme = {
  // PRIMARY COLORS
  primary: {
    gold: "#F5C86A",
    deepOrange: "#EFA045",
    coral: "#E2755B",
  },

  // SUPPORTING COLORS
  supporting: {
    lightGlow: "#FFE7B3",
    warmSand: "#F2D7B6",
    darkText: "#1B1A17",
  },

  // BACKGROUND GRADIENTS
  gradients: {
    linear: "linear-gradient(180deg, #FFE7B3 0%, #EFA045 40%, #E2755B 100%)",
    radial: "radial-gradient(circle, #F5C86A 0%, #E2755B 100%)",
    diagonal: "linear-gradient(135deg, #FFE7B3 0%, #EFA045 50%, #E2755B 100%)",
    // New card/surface gradient
    surface: "linear-gradient(135deg, #F7D49C 0%, #E7A55A 100%)",
    surfaceSolid: "#F4C98B",
  },

  // BUTTON STYLES - Updated with hover states
  buttons: {
    primary: {
      background: "linear-gradient(90deg, #F7D49C, #E7A55A)",
      textColor: "#4A2E0B",
      shadow: "0 4px 16px rgba(229, 167, 84, 0.35)",
      hoverBackground: "linear-gradient(90deg, #E3A968, #CF8745)",
      hoverShadow: "0 6px 20px rgba(229, 167, 84, 0.45)",
    },
    secondary: {
      border: "2px solid #E4A851",
      textColor: "#4A2E0B",
      background: "rgba(244, 201, 139, 0.3)",
      hoverBackground: "rgba(244, 201, 139, 0.5)",
    },
  },

  // ICONS & UI ELEMENTS - Updated tint colors
  icons: {
    active: "#E4A851",
    secondary: "#D98F43",
    indicator: "#E4A851",
    tint: "#D98F43",
  },

  // TEXT COLORS - HIGH CONTRAST for readability
  text: {
    primary: "#4A2E0B",      // Main text - dark brown for high contrast
    secondary: "#5C3B15",    // Secondary text - medium brown
    placeholder: "#7A5735", // Placeholder text - lighter brown
    header: "#4A2E0B",
    subheader: "#5C3B15",
    bodyLight: "#4A2E0B",
    bodyDark: "#FFFFFF",
    bodyGlow: "#FFE7B3",
    muted: "#6B4A23",
  },

  // BORDERS, DIVIDERS, OUTLINES
  borders: {
    primary: "#E4A851",
    gold: "rgba(229, 167, 84, 0.35)",
    opacity40: "rgba(245, 200, 106, 0.4)",
    opacity60: "rgba(245, 200, 106, 0.6)",
    divider: "rgba(229, 167, 84, 0.3)",
  },

  // CARD/SURFACE STYLING - Warm golden backgrounds
  cards: {
    background: "linear-gradient(135deg, #F7D49C 0%, #E7A55A 100%)",
    backgroundSolid: "#F4C98B",
    backgroundAlt: "#E7A55A",
    border: "rgba(229, 167, 84, 0.35)",
    borderGold: "rgba(229, 167, 84, 0.4)",
    shadow: "0 4px 20px rgba(229, 167, 84, 0.25)",
    shadowHover: "0 6px 24px rgba(229, 167, 84, 0.35)",
    innerGlow: "inset 0 1px 2px rgba(255, 255, 255, 0.25)",
  },
  
  // SURFACE TOKENS - For content cards on warm backgrounds
  surface: {
    background: "linear-gradient(135deg, #F7D49C 0%, #E7A55A 100%)",
    backgroundSolid: "#F4C98B",
    backgroundTranslucent: "linear-gradient(135deg, rgba(247, 212, 156, 0.95) 0%, rgba(231, 165, 90, 0.92) 100%)",
    foreground: "#4A2E0B",
    foregroundMuted: "#5C3B15",
    placeholder: "#7A5735",
    border: "rgba(229, 167, 84, 0.35)",
    borderSubtle: "rgba(229, 167, 84, 0.25)",
  },

  // INPUT/TEXTAREA STYLING
  inputs: {
    background: "linear-gradient(135deg, #F7D49C 0%, #E7A55A 100%)",
    backgroundSolid: "#F4C98B",
    border: "rgba(229, 167, 84, 0.4)",
    text: "#4A2E0B",
    placeholder: "#7A5735",
    focusBorder: "#D98F43",
    focusShadow: "0 0 0 2px rgba(217, 143, 67, 0.25)",
  },

  // CSS VARIABLE TOKENS (HSL format for Tailwind)
  cssVars: {
    background: "42 50% 91%",
    foreground: "28 80% 17%",  // #4A2E0B in HSL
    border: "36 70% 61% / 0.35",
    card: "38 75% 78%",
    cardForeground: "28 80% 17%",
    primary: "38 75% 78%",
    primaryForeground: "28 80% 17%",
    secondary: "32 65% 55%",
    secondaryForeground: "28 80% 17%",
    muted: "36 50% 65%",
    mutedForeground: "30 55% 28%",
    accent: "38 80% 62%",
    accentForeground: "28 80% 17%",
    ring: "36 70% 55%",
    input: "36 70% 61% / 0.4",
  },
} as const;

// Tailwind-compatible gradient stops for bg-gradient-to-* usage
export const GD_GRADIENT_STOPS = "from-[#FFE7B3] via-[#EFA045] to-[#E2755B]";
export const GD_SURFACE_STOPS = "from-[#F7D49C] to-[#E7A55A]";

// Helper function to get inline styles for Golden Dawn backgrounds
export function getGoldenDawnBackgroundStyle(type: "linear" | "radial" | "diagonal" | "surface" = "linear") {
  if (type === "surface") {
    return {
      background: GoldenDawnTheme.gradients.surface,
    };
  }
  return {
    background: GoldenDawnTheme.gradients[type],
  };
}

// Helper function to get Golden Dawn button styles
export function getGoldenDawnButtonStyle(variant: "primary" | "secondary" = "primary") {
  if (variant === "primary") {
    const styles = GoldenDawnTheme.buttons.primary;
    return {
      background: styles.background,
      color: styles.textColor,
      boxShadow: styles.shadow,
      border: "none",
    };
  }
  const styles = GoldenDawnTheme.buttons.secondary;
  return {
    background: styles.background,
    color: styles.textColor,
    border: styles.border,
  };
}

// Helper to check if Golden Dawn text should be light or dark
export function getGoldenDawnTextColor(onDarkBg: boolean = false) {
  return onDarkBg ? GoldenDawnTheme.text.bodyGlow : GoldenDawnTheme.text.primary;
}

// Helper for card styling
export function getGoldenDawnCardStyle() {
  return {
    background: GoldenDawnTheme.cards.background,
    borderColor: GoldenDawnTheme.cards.border,
    boxShadow: `${GoldenDawnTheme.cards.shadow}, ${GoldenDawnTheme.cards.innerGlow}`,
    backdropFilter: "blur(10px)",
  };
}

// Helper for input/textarea styling  
export function getGoldenDawnInputStyle() {
  return {
    background: GoldenDawnTheme.inputs.backgroundSolid,
    borderColor: GoldenDawnTheme.inputs.border,
    color: GoldenDawnTheme.inputs.text,
  };
}

// Helper for text colors on Golden Dawn surfaces
export function getGoldenDawnTextStyles() {
  return {
    primary: GoldenDawnTheme.text.primary,
    secondary: GoldenDawnTheme.text.secondary,
    placeholder: GoldenDawnTheme.text.placeholder,
    muted: GoldenDawnTheme.text.muted,
  };
}

// Helper for icon tinting
export function getGoldenDawnIconColor(variant: "active" | "secondary" | "tint" = "active") {
  return GoldenDawnTheme.icons[variant];
}

export default GoldenDawnTheme;
