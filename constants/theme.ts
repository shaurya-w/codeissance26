import { Platform } from "react-native";

/**
 * constants/theme.ts
 * -------------------
 * Single source of truth for the entire application's visual theme and design system.
 *
 * RULE: NEVER hardcode colors inside individual components.
 * All colors, typography styles, shadows, and radii MUST be imported from here.
 */

export const theme = {
  colors: {
    // Core Colors
    pageBg: "#f4f7ef",
    ink: "#173b2b",
    tankDark: "#102f23",
    brandGreen: "#5b9a6f",
    waterGreen: "#62bd8b",
    waterGreenLight: "#8bd8a8",

    // Surfaces & Panels
    surface: "#ffffff",
    surfaceElevated: "#ffffff",
    surfaceSubtle: "#edf2e8",
    surfaceDark: "#102f23",

    // Backward-compatible & Semantic Text Aliases
    text: "#173b2b",
    textMuted: "#6f8075",
    textSubtle: "#8a9b90",
    textTertiary: "#96a39a",
    textInverse: "#ffffff",

    // Muted Sage Text Scale
    mutedSage: {
      muted1: "#6f8075", // subtitles, descriptions
      muted2: "#829087", // secondary labels
      muted3: "#8a9b90", // metadata
      muted4: "#91a097", // subtle annotations
      muted5: "#96a39a", // supporting copy
    },

    // Borders
    border: "#d9e3d7",
    borderLight: "#dce5d9",
    borderMuted: "#d6e1d4",
    borderSubtle: "#e0e7de",

    // Water Intensity Badges
    waterIntensity: {
      low: {
        background: "#e8f4e9",
        text: "#3f7650",
      },
      medium: {
        background: "#fff4d9",
        text: "#92703b",
      },
      high: {
        background: "#f8e4dc",
        text: "#985743",
      },
    },

    // Comparison / Average Indicators
    indiaAverage: "#f3d78e",
    aboveAverage: {
      background: "#5d472a",
      text: "#ffd998",
    },
    belowAverage: {
      background: "#24563d",
      text: "#9be1b5",
    },

    // Food Card Swatches (17 pastel background colors)
    foodSwatches: [
      "#dcefdc", // 0: soft mint sage
      "#f4e8c1", // 1: warm oat
      "#fff0b8", // 2: buttery cream
      "#e3ede3", // 3: pale leaf
      "#fbead2", // 4: pastel apricot
      "#e5f2e8", // 5: honeydew
      "#fef3c7", // 6: light maize
      "#e8e5d8", // 7: linen sage
      "#fee2e2", // 8: soft coral blush
      "#ecfdf5", // 9: delicate aqua
      "#f3f4f6", // 10: pale slate sage
      "#ede9fe", // 11: soft lavender mist
      "#fef9c3", // 12: sunny wheat
      "#dcfce7", // 13: fresh pistachio
      "#f1f5f9", // 14: chalk gray
      "#fae8ff", // 15: soft orchid
      "#ffedd5", // 16: pale cantaloupe
    ] as const,

    // Tints and Overlays
    shadowTint: "rgba(30, 65, 43, 0.07)",
    overlayDark: "rgba(16, 47, 35, 0.6)",
    overlayLight: "rgba(244, 247, 239, 0.8)",

    // Backward-compatibility Aliases
    background: "#f4f7ef",
    primary: "#5b9a6f",
    secondary: "#62bd8b",
    success: "#3f7650",
    danger: "#985743",
    warning: "#92703b",
  },

  typography: {
    fontWeights: {
      regular: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
      black: "900" as const,
    },
    fontMono: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
    eyebrow: {
      fontSize: 10,
      fontWeight: "900" as const,
      letterSpacing: 2,
      textTransform: "uppercase" as const,
      color: "#6f8075",
    },
    displayHeadline: {
      fontSize: 44,
      fontWeight: "900" as const,
      letterSpacing: -1.5,
      lineHeight: 46,
      color: "#173b2b",
    },
  },

  fontSize: {
    micro: 9,
    xs: 10,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 24,
    xxl: 32,
    display: 44,
  },

  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  radius: {
    sm: 12,
    md: 20,
    card: 28,
    cardHero: 38,
    full: 9999,
  },

  shadows: {
    card: {
      shadowColor: "#1e412b",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.07,
      shadowRadius: 24,
      elevation: 4,
    },
    soft: {
      shadowColor: "#1e412b",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 2,
    },
  },
} as const;

export type Theme = typeof theme;
