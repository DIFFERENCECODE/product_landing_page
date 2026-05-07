// Vendor Theme Definitions
// Defines theme tokens for Meterbolic and Eos vendors

export type Vendor = 'meterbolic' | 'eos';
export type Mode = 'patient' | 'practitioner';
export type ColorMode = 'light' | 'dark';

export interface ThemeColors {
  // Primary brand colors
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  
  // Background colors
  background: string;
  backgroundGradientStart: string;
  backgroundGradientMid: string;
  backgroundGradientEnd: string;
  
  // Surface/Card colors
  card: string;
  cardHover: string;
  cardBorder: string;
  
  // Text colors
  foreground: string;
  muted: string;
  
  // Accent colors
  accent: string;
  accentHover: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  
  // Chart colors
  chartPrimary: string;
  chartSecondary: string;
  chartTertiary: string;
}

export interface VendorTheme {
  id: Vendor;
  name: string;
  header: string;
  tagline: string;
  colors: ThemeColors;
  darkColors: ThemeColors;
  // CSS custom property overrides  
  cssVariables: Record<string, string>;
}

// Meterbolic Theme — aligned to the master C palette in
// src/lib/design-tokens.ts so the chatbot UI inherits the same
// brand colors as the marketing pages. Light + dark modes are
// intentionally identical here: the master design has one mode,
// dark, and the chatbot now follows suit when the Meterbolic
// vendor is selected. Other vendor themes (Eos, etc.) keep their
// independent palettes for white-label deployments.
const _MASTER = {
  primary: '#a4d65e',
  primaryHover: '#8bc34a',
  primaryForeground: '#0f2a1f',

  background: '#1c4a40',
  backgroundGradientStart: '#143730',
  backgroundGradientMid: '#1c4a40',
  backgroundGradientEnd: '#1c4a40',

  card: 'rgba(30, 70, 60, 0.85)',
  cardHover: 'rgba(38, 80, 68, 0.95)',
  cardBorder: 'rgba(255, 255, 255, 0.14)',

  foreground: '#f0ede6',
  muted: '#c4bfb8',

  accent: 'rgba(164, 214, 94, 0.18)',
  accentHover: 'rgba(164, 214, 94, 0.28)',

  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',

  chartPrimary: '#a4d65e',
  chartSecondary: '#f59e0b',
  chartTertiary: '#cdf08a',
} as const;

export const meterbolicTheme: VendorTheme = {
  id: 'meterbolic',
  name: 'Meterbolic',
  header: 'MeO',
  tagline: 'Your Metabolic Health AI Assistant',
  colors: { ..._MASTER },
  darkColors: { ..._MASTER },
  cssVariables: {
    '--vendor-primary': _MASTER.primary,
    '--vendor-primary-hover': _MASTER.primaryHover,
    '--vendor-primary-foreground': _MASTER.primaryForeground,
    '--vendor-background': _MASTER.background,
    '--vendor-background-gradient': `linear-gradient(180deg, ${_MASTER.backgroundGradientStart} 0%, ${_MASTER.backgroundGradientMid} 50%, ${_MASTER.backgroundGradientEnd} 100%)`,
    '--vendor-card': _MASTER.card,
    '--vendor-card-border': _MASTER.cardBorder,
    '--vendor-foreground': _MASTER.foreground,
    '--vendor-muted': _MASTER.muted,
    '--vendor-accent': _MASTER.accent,
  },
};

// Eos Theme - Dr. Arup Sen clinic — warm gold/navy medical branding
export const eosTheme: VendorTheme = {
  id: 'eos',
  name: 'Eos',
  header: 'MeO for Eos',
  tagline: 'Prevention over cure.',
  // Light mode - Warm navy/gold
  colors: {
    primary: '#d4a853',
    primaryHover: '#c49a42',
    primaryForeground: '#1a1a2e',

    background: '#1a1a2e',
    backgroundGradientStart: '#1a1a2e',
    backgroundGradientMid: '#232345',
    backgroundGradientEnd: '#2a2a55',

    card: 'rgba(35, 35, 65, 0.85)',
    cardHover: 'rgba(45, 45, 80, 0.9)',
    cardBorder: 'rgba(212, 168, 83, 0.15)',

    foreground: '#f0ece4',
    muted: 'rgba(240, 236, 228, 0.55)',

    accent: 'rgba(212, 168, 83, 0.12)',
    accentHover: 'rgba(212, 168, 83, 0.22)',

    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',

    chartPrimary: '#6366f1',
    chartSecondary: '#d4a853',
    chartTertiary: '#22c55e',
  },
  // Dark mode - Deep charcoal with gold accents
  darkColors: {
    primary: '#d4a853',
    primaryHover: '#c49a42',
    primaryForeground: '#1a1a1a',

    background: '#121212',
    backgroundGradientStart: '#121212',
    backgroundGradientMid: '#121212',
    backgroundGradientEnd: '#121212',

    card: '#1e1e2e',
    cardHover: '#2a2a3e',
    cardBorder: 'rgba(212, 168, 83, 0.15)',

    foreground: '#e8e4dc',
    muted: 'rgba(232, 228, 220, 0.5)',

    accent: 'rgba(212, 168, 83, 0.12)',
    accentHover: 'rgba(212, 168, 83, 0.22)',

    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',

    chartPrimary: '#6366f1',
    chartSecondary: '#d4a853',
    chartTertiary: '#22c55e',
  },
  cssVariables: {
    '--vendor-primary': '#d4a853',
    '--vendor-primary-hover': '#c49a42',
    '--vendor-primary-foreground': '#1a1a2e',
    '--vendor-background': '#1a1a2e',
    '--vendor-background-gradient': 'linear-gradient(180deg, #2a2a55 0%, #232345 40%, #1a1a2e 100%)',
    '--vendor-card': 'rgba(35, 35, 65, 0.85)',
    '--vendor-card-border': 'rgba(212, 168, 83, 0.15)',
    '--vendor-foreground': '#f0ece4',
    '--vendor-muted': 'rgba(240, 236, 228, 0.55)',
    '--vendor-accent': 'rgba(212, 168, 83, 0.12)',
  },
};

// Theme lookup
export const vendorThemes: Record<Vendor, VendorTheme> = {
  meterbolic: meterbolicTheme,
  eos: eosTheme,
};

// Get theme by vendor
export function getVendorTheme(vendor: Vendor): VendorTheme {
  return vendorThemes[vendor] || meterbolicTheme;
}

// Get the active colors based on colorMode
export function getThemeColors(theme: VendorTheme, colorMode: ColorMode): ThemeColors {
  return colorMode === 'dark' ? theme.darkColors : theme.colors;
}

// Generate CSS custom properties from theme
export function getThemeCssVariables(theme: VendorTheme): Record<string, string> {
  return {
    ...theme.cssVariables,
    '--vendor-success': theme.colors.success,
    '--vendor-warning': theme.colors.warning,
    '--vendor-error': theme.colors.error,
    '--vendor-chart-primary': theme.colors.chartPrimary,
    '--vendor-chart-secondary': theme.colors.chartSecondary,
    '--vendor-chart-tertiary': theme.colors.chartTertiary,
  };
}
