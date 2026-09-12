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
/*
 * Every rendered block carries `not-prose`. The theme's own Expressive Code
 * registration does this and is switched off here, so without it Tailwind
 * Typography restyles the `pre` and the `code` inside a frame that already
 * paints itself.
 */
const proseIsolation = {
  name: "prose isolation",
  hooks: {
    postprocessRenderedBlockGroup: ({ renderData }) => {
      const className = renderData.groupAst.properties.className ?? []
      renderData.groupAst.properties.className = [...className, "not-prose"]
    },
  },
}

export default defineEcConfig({
  themes: ["github-dark", "github-light"],
  plugins: [proseIsolation],
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
