import type { Config } from "tailwindcss"

/**
 * newt/ui Tailwind preset.
 * Every color/radius/font/shadow maps to a `--newt-*` CSS variable defined in
 * the app's global stylesheet (source of truth:
 * packages/newtui/registry/html/tokens.css).
 */
export const newtPreset: Omit<Config, "content"> = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        newt: {
          "bg-base": "var(--newt-bg-base)",
          "bg-surface": "var(--newt-bg-surface)",
          "bg-elevated": "var(--newt-bg-elevated)",
          "bg-floating": "var(--newt-bg-floating)",
          "bg-input": "var(--newt-bg-input)",
          "bg-input-elevated": "var(--newt-bg-input-elevated)",
          "bg-hover": "var(--newt-bg-hover)",
          "bg-active": "var(--newt-bg-active)",
          border: "var(--newt-border)",
          "text-primary": "var(--newt-text-primary)",
          "text-secondary": "var(--newt-text-secondary)",
          "text-muted": "var(--newt-text-muted)",
          "text-link": "var(--newt-text-link)",
          brand: "var(--newt-brand)",
          "brand-hover": "var(--newt-brand-hover)",
          "brand-active": "var(--newt-brand-active)",
          online: "var(--newt-online)",
          idle: "var(--newt-idle)",
          dnd: "var(--newt-dnd)",
          offline: "var(--newt-offline)",
          danger: "var(--newt-danger)",
          "danger-hover": "var(--newt-danger-hover)",
          "mention-text": "var(--newt-mention-text)",
          "mention-role": "var(--newt-mention-role)",
        },
      },
      fontFamily: {
        sans: "var(--newt-font-sans)",
        mono: "var(--newt-font-mono)",
        display: "var(--newt-font-display)",
      },
      borderRadius: {
        sm: "var(--newt-radius-sm)",
        md: "var(--newt-radius-md)",
        lg: "var(--newt-radius-lg)",
        full: "var(--newt-radius-full)",
      },
      boxShadow: {
        "elevation-low": "var(--newt-shadow-elevation-low)",
        "elevation-high": "var(--newt-shadow-elevation-high)",
      },
      transitionTimingFunction: { newt: "var(--newt-ease)" },
      transitionDuration: { fast: "100ms", base: "150ms" },
    },
  },
}

const config: Config = {
  presets: [newtPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./registry/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  plugins: [require("tailwindcss-animate")],
}
export default config
