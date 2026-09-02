import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { flushSync } from "react-dom"

export const THEMES = ["dark", "light"] as const
export type Theme = (typeof THEMES)[number]

export const FRAMEWORKS = ["react", "vue"] as const
export type Framework = (typeof FRAMEWORKS)[number]

const THEME_KEY = "newt-ui:theme"
const FRAMEWORK_KEY = "newt-ui:framework"
const FRAMEWORK_PARAM = "framework"

/*
 * A stored or shared value is a raw string, and `find` over the const tuple is
 * both the validation and the narrowing: no assertion is involved.
 */
function toTheme(raw: string | null) {
  return THEMES.find((theme) => theme === raw)
}

function toFramework(raw: string | null) {
  return FRAMEWORKS.find((framework) => framework === raw)
}

/* a link carrying `?framework=vue` wins over what this browser last chose */
function initialFramework(): Framework {
  const search = new URLSearchParams(window.location.search)
  return (
    toFramework(search.get(FRAMEWORK_PARAM)) ??
    toFramework(window.localStorage.getItem(FRAMEWORK_KEY)) ??
    "react"
  )
}

function initialTheme(): Theme {
  return toTheme(window.localStorage.getItem(THEME_KEY)) ?? "dark"
}

interface Settings {
  readonly theme: Theme
  readonly framework: Framework
  readonly setTheme: (next: Theme) => void
  readonly setFramework: (next: Framework) => void
}

const SettingsContext = createContext<Settings>({
  theme: "dark",
  framework: "react",
  setTheme: () => {},
  setFramework: () => {},
})

export const useSettings = () => useContext(SettingsContext)

export function SettingsProvider({
  children,
}: {
  readonly children: ReactNode
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)
  const [framework, setFrameworkState] = useState<Framework>(initialFramework)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  /*
   * The framework lives in the URL so a page can be linked in either language,
   * and it replaces the entry rather than adding one: the back button belongs
   * to the pages a reader visited, not to a switch they flicked.
   */
  useEffect(() => {
    window.localStorage.setItem(FRAMEWORK_KEY, framework)
    const url = new URL(window.location.href)
    url.searchParams.set(FRAMEWORK_PARAM, framework)
    window.history.replaceState(window.history.state, "", url)
  }, [framework])

  /*
   * The cross fade needs the new palette inside its callback, so the state
   * update is flushed there. Reduced motion sets the duration to 0ms and takes
   * the plain path, which spares the snapshot. A browser with no view
   * transitions swaps.
   */
  const setTheme = useCallback((next: Theme) => {
    const overlay = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--dur-overlay"
      )
    )
    if (overlay === 0 || !("startViewTransition" in document)) {
      setThemeState(next)
      return
    }
    document.startViewTransition(() => {
      flushSync(() => setThemeState(next))
    })
  }, [])

  const value = useMemo(
    () => ({ theme, framework, setTheme, setFramework: setFrameworkState }),
    [theme, framework, setTheme]
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
