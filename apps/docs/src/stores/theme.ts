import { atom, onMount } from "nanostores"

/*
 * The site chrome is built from the same `--newt-*` tokens the components
 * read, and the light palette is an opt-in override keyed by
 * `[data-newt-theme="light"]`, so flipping this attribute restyles the site
 * and every demo at once.
 */
export const THEMES = ["dark", "light"] as const

export type Theme = (typeof THEMES)[number]

export const THEME_STORAGE_KEY = "newt-ui:theme"

export function isTheme(value: string | null): value is Theme {
  return THEMES.some((candidate) => candidate === value)
}

export const $theme = atom<Theme>("dark")

export function toggleTheme(): void {
  $theme.set($theme.get() === "dark" ? "light" : "dark")
}

/*
 * The theme also owns `data-theme` and the key `lotus-theme`, which is what
 * its own chrome reads. Neither is the source of truth here — this store is —
 * but a stored `lotus-theme` from a previous visit is the best first guess
 * when the site's own key is missing, and both are written back in
 * `components/lotus/Assistant.astro` so the two never drift.
 */
onMount($theme, () => {
  const stored =
    localStorage.getItem(THEME_STORAGE_KEY) ?? localStorage.getItem("lotus-theme")
  if (isTheme(stored)) $theme.set(stored)

  return $theme.subscribe((value) => {
    localStorage.setItem(THEME_STORAGE_KEY, value)
    document.documentElement.dataset.newtTheme = value
    // Keeps form controls, scrollbars and the caret in step with the palette.
    document.documentElement.style.colorScheme = value
  })
})
