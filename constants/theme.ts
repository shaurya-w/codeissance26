/**
 * constants/theme.ts
 * -------------------
 * React Native mirror of the design tokens defined in `globals.css`.
 *
 * `globals.css` is the source of truth for VALUES (it's easy to read and
 * easy to hand to a designer). This file is the source of truth for CODE
 * (React Native components import `theme` from here, since RN can't read
 * .css files directly).
 *
 * Keep the two in sync: if you change a value in globals.css, change it
 * here too.
 */

export const theme = {
  colors: {
    background: "#F8F9FB",
    surface: "#FFFFFF",
    primary: "#4F46E5",
    secondary: "#14B8A6",
    text: "#111827",
    textMuted: "#6B7280",
    border: "#E5E7EB",
    success: "#16A34A",
    danger: "#DC2626",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 6,
    md: 12,
    lg: 20,
  },
} as const;

export type Theme = typeof theme;
