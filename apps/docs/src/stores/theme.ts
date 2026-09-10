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

onMount($theme, () => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (isTheme(stored)) $theme.set(stored)

  return $theme.subscribe((value) => {
    localStorage.setItem(THEME_STORAGE_KEY, value)
    document.documentElement.dataset.newtTheme = value
    // Keeps form controls, scrollbars and the caret in step with the palette.
    document.documentElement.style.colorScheme = value
  })
})
