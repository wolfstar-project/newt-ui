import { describe, expect, it } from "vitest"

import {
  allThemeNames,
  appendThemeNames,
  missingThemeNames,
  renderThemeNames,
  themeCatalogue,
  themeNameList,
  themeNamesUsed,
} from "./theme-names.js"

/* A cut-down `theme-newt` item: one entry per namespace the CLI reads. */
const theme = themeCatalogue({
  cssVars: {
    theme: {
      "--color-newt-brand": "var(--newt-brand)",
      "--color-newt-brand-hover": "var(--newt-brand-hover)",
      "--font-display": "var(--newt-font-display)",
      "--shadow-elevation-high": "var(--newt-shadow-elevation-high)",
      "--ease-newt": "var(--newt-ease)",
      "--transition-duration-fast": "var(--newt-duration-fast)",
    },
    dark: {
      "newt-brand": "#5865f2",
      "newt-brand-hover": "#4752c4",
      "newt-font-display": '"Inter", sans-serif',
      "newt-shadow-elevation-high": "0 8px 16px rgba(0,0,0,0.24)",
      "newt-ease": "cubic-bezier(0.3, 0.7, 0.4, 1)",
      "newt-duration-fast": "100ms",
      "newt-radius-md": "8px",
    },
    light: {
      "newt-shadow-elevation-high": "0 8px 16px rgba(6,6,7,0.16)",
    },
  },
  tailwind: {
    config: {
      theme: {
        extend: {
          colors: {
            newt: {
              brand: "var(--newt-brand)",
              "brand-hover": "var(--newt-brand-hover)",
            },
          },
          fontFamily: { display: "var(--newt-font-display)" },
          boxShadow: {
            "elevation-high": "var(--newt-shadow-elevation-high)",
          },
          transitionTimingFunction: { newt: "var(--newt-ease)" },
          transitionDuration: { fast: "var(--newt-duration-fast)" },
        },
      },
    },
  },
})

/** What a project that ran an older `init` holds: colours, no motion. */
const olderInit = `@import "tailwindcss";

@theme {
  --color-newt-brand: var(--newt-brand);
  --color-newt-brand-hover: var(--newt-brand-hover);
  /* --shadow-elevation-high: var(--newt-shadow-elevation-high); */
}

:root {
  --newt-brand: #5865f2;
  --newt-brand-hover: #4752c4;
}
`

describe("themeNamesUsed", () => {
  it("finds the theme names a component's classes and styles reach", () => {
    const used = themeNamesUsed(theme, [
      `<div class="hover:bg-newt-brand shadow-elevation-high duration-fast ease-newt">`,
      `const style = { borderRadius: "var(--newt-radius-md)" }`,
    ])

    expect(themeNameList(used)).toEqual([
      "--color-newt-brand",
      "--shadow-elevation-high",
      "--ease-newt",
      "--transition-duration-fast",
      "--newt-brand",
      "--newt-shadow-elevation-high",
      "--newt-ease",
      "--newt-duration-fast",
      "--newt-radius-md",
    ])
  })

  it("tells a colour apart from a longer colour that starts with its name", () => {
    const used = themeNamesUsed(theme, [`className="text-newt-brand-hover/50"`])

    expect(themeNameList(used)).toEqual([
      "--color-newt-brand-hover",
      "--newt-brand-hover",
    ])
  })

  it("counts a direct var() reference to a theme property", () => {
    const used = themeNamesUsed(theme, [
      "box-shadow: var(--shadow-elevation-high);",
    ])

    expect(themeNameList(used)).toEqual([
      "--shadow-elevation-high",
      "--newt-shadow-elevation-high",
    ])
  })

  it("finds nothing in a component that uses no theme name", () => {
    const used = themeNamesUsed(theme, [
      `<div class="rounded-md bg-primary text-sm">`,
    ])

    expect(themeNameList(used)).toEqual([])
  })
})

describe("missingThemeNames", () => {
  const used = themeNamesUsed(theme, [
    `class="bg-newt-brand shadow-elevation-high duration-fast"`,
  ])

  it("reports the @theme entries and variables a v4 stylesheet lacks", () => {
    const missing = missingThemeNames(used, {
      major: 4,
      css: olderInit,
      config: null,
    })

    expect(themeNameList(missing)).toEqual([
      "--shadow-elevation-high",
      "--transition-duration-fast",
      "--newt-shadow-elevation-high",
      "--newt-duration-fast",
    ])
  })

  it("reads v3 entries from tailwind.config and variables from the stylesheet", () => {
    const missing = missingThemeNames(used, {
      major: 3,
      css: olderInit,
      config: `export default { theme: { extend: { colors: { newt: { brand: "var(--newt-brand)" } } } } }`,
    })

    expect(themeNameList(missing)).toEqual([
      "--shadow-elevation-high",
      "--transition-duration-fast",
      "--newt-shadow-elevation-high",
      "--newt-duration-fast",
    ])
  })

  it("treats every v3 entry as missing when there is no tailwind.config", () => {
    const missing = missingThemeNames(
      themeNamesUsed(theme, ["bg-newt-brand"]),
      {
        major: 3,
        css: olderInit,
        config: null,
      }
    )

    expect(themeNameList(missing)).toEqual(["--color-newt-brand"])
  })

  it("reports nothing once the stylesheet declares every name", () => {
    const missing = missingThemeNames(allThemeNames(theme), {
      major: 4,
      css: appendThemeNames(
        olderInit,
        renderThemeNames(
          missingThemeNames(allThemeNames(theme), {
            major: 4,
            css: olderInit,
            config: null,
          }),
          theme,
          4
        ).css
      ),
      config: null,
    })

    expect(themeNameList(missing)).toEqual([])
  })
})

describe("renderThemeNames", () => {
  const missing = missingThemeNames(
    themeNamesUsed(theme, ["shadow-elevation-high duration-fast"]),
    { major: 4, css: olderInit, config: null }
  )

  it("renders a v4 @theme block and the variables for both surfaces", () => {
    expect(renderThemeNames(missing, theme, 4)).toEqual({
      css: `@theme {
  --shadow-elevation-high: var(--newt-shadow-elevation-high);
  --transition-duration-fast: var(--newt-duration-fast);
}

:root {
  --newt-shadow-elevation-high: 0 8px 16px rgba(6,6,7,0.16);
  --newt-duration-fast: 100ms;
}

.dark {
  --newt-shadow-elevation-high: 0 8px 16px rgba(0,0,0,0.24);
}
`,
      config: undefined,
    })
  })

  it("renders v3 config entries in their theme.extend shape and no @theme", () => {
    const rendered = renderThemeNames(missing, theme, 3, "data-theme")

    expect(rendered.css).not.toContain("@theme")
    expect(rendered.css).toContain('[data-theme="dark"] {')
    expect(rendered.config).toBe(`{
  "boxShadow": {
    "elevation-high": "var(--newt-shadow-elevation-high)"
  },
  "transitionDuration": {
    "fast": "var(--newt-duration-fast)"
  }
}`)
  })

  it("nests a v3 colour under the key the preset uses", () => {
    const rendered = renderThemeNames(
      themeNamesUsed(theme, ["bg-newt-brand-hover"]),
      theme,
      3
    )

    expect(rendered.config).toBe(`{
  "colors": {
    "newt": {
      "brand-hover": "var(--newt-brand-hover)"
    }
  }
}`)
  })
})

describe("appendThemeNames", () => {
  it("adds the block after the existing rules under one comment", () => {
    expect(appendThemeNames("a { color: red; }\n\n\n", ":root {}\n")).toBe(
      "a { color: red; }\n\n/* newt/ui — theme names */\n:root {}\n"
    )
  })

  it("leaves the stylesheet unchanged when there is nothing to add", () => {
    expect(appendThemeNames("a { color: red; }\n", "")).toBe(
      "a { color: red; }\n"
    )
  })
})
