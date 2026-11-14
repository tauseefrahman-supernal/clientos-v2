import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // baked-alpha — plain var(), NO hsl() wrap
        border: "var(--color-border-default)",
        "border-subtle": "var(--color-border-subtle)",
        "border-strong": "var(--color-border-strong)",
        input: "var(--color-border-input)",
        // raw-channel bridges
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          hover: "hsl(var(--secondary-hover))",
          active: "hsl(var(--secondary-active))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        // action semantic utilities (bg-action-default, text-action-text, ...)
        action: {
          default: "hsl(var(--color-action-default))",
          hover: "hsl(var(--color-action-hover))",
          active: "hsl(var(--color-action-active))",
          foreground: "hsl(var(--color-action-foreground))",
          text: "hsl(var(--color-action-text))",
          "subtle-bg": "hsl(var(--color-action-subtle-bg))",
          "subtle-fg": "hsl(var(--color-action-subtle-fg))",
        },
        // status intent utilities (text-success etc. per color-system.md)
        success: "hsl(var(--color-status-success-text))",
        danger: "hsl(var(--color-status-error-text))",
        warning: "hsl(var(--color-status-warning-text))",
        info: "hsl(var(--color-status-info-text))",
        // viz palette (bg-viz-1, bg-viz-1-bg, ...)
        viz: {
          single: "hsl(var(--color-viz-single))",
          "single-bg": "hsl(var(--color-viz-single-bg))",
          1: "hsl(var(--color-viz-1))", "1-bg": "hsl(var(--color-viz-1-bg))",
          2: "hsl(var(--color-viz-2))", "2-bg": "hsl(var(--color-viz-2-bg))",
          3: "hsl(var(--color-viz-3))", "3-bg": "hsl(var(--color-viz-3-bg))",
          4: "hsl(var(--color-viz-4))", "4-bg": "hsl(var(--color-viz-4-bg))",
          5: "hsl(var(--color-viz-5))", "5-bg": "hsl(var(--color-viz-5-bg))",
          6: "hsl(var(--color-viz-6))", "6-bg": "hsl(var(--color-viz-6-bg))",
          7: "hsl(var(--color-viz-7))", "7-bg": "hsl(var(--color-viz-7-bg))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "var(--sidebar-border)",            // baked alpha
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          "active-bg": "hsl(var(--sidebar-active-bg))",
          "active-fg": "hsl(var(--sidebar-active-fg))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-lora)", "Lora", "serif"],   // Playfair → Lora
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "2xs": ["11px", { lineHeight: "1.3" }],
        "3xs": ["10px", { lineHeight: "1.3" }],
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-default)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
      },
      maxWidth: { content: "1440px", "form-default": "560px", "form-wide": "720px" },
      spacing: {
        "space-1": "4px",
        "space-2": "8px",
        "space-3": "12px",
        "space-4": "16px",
        "space-5": "24px",
        "space-6": "32px",
        "space-7": "48px",
        "space-8": "64px",
        "space-9": "96px",
        "space-10": "128px",
      },
      zIndex: {
        base: "0",
        dropdown: "50",
        sticky: "100",
        fixed: "200",
        overlay: "300",
        modal: "400",
        popover: "500",
        tooltip: "600",
        toast: "700",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      transitionDuration: { instant: "100ms", fast: "150ms", standard: "200ms", expressive: "300ms" },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
