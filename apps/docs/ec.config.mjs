import { defineEcConfig } from "astro-expressive-code"

/*
 * Expressive Code is configured here rather than in `astro.config.ts` because
 * the `<Code>` component needs the options to be loadable on their own — the
 * `themeCssSelector` function below is not serialisable into the Astro config.
 *
 * Both themes ship, selected by the same `data-newt-theme` attribute the site
 * palette uses, so code blocks follow the theme toggle rather than the
 * operating system.
 */
export default defineEcConfig({
  themes: ["github-dark", "github-light"],
  themeCssSelector: (theme) =>
    theme.type === "dark"
      ? "html:not([data-newt-theme='light'])"
      : "html[data-newt-theme='light']",
  useDarkModeMediaQuery: false,
  styleOverrides: {
    borderRadius: "0.5rem",
    codeFontFamily: "var(--newt-font-mono)",
    uiFontFamily: "var(--newt-font-sans)",
  },
})
