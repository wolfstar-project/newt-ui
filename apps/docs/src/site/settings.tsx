import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export const FRAMEWORKS = ["react", "vue"] as const
export type Framework = (typeof FRAMEWORKS)[number]

const FRAMEWORK_KEY = "newt-ui:framework"
const FRAMEWORK_PARAM = "framework"

/*
 * A stored or shared value is a raw string, and `find` over the const tuple is
 * both the validation and the narrowing: no assertion is involved.
 */
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

interface Settings {
  readonly framework: Framework
  readonly setFramework: (next: Framework) => void
}

const SettingsContext = createContext<Settings>({
  framework: "react",
  setFramework: () => {},
})

export const useSettings = () => useContext(SettingsContext)

export function SettingsProvider({
  children,
}: {
  readonly children: ReactNode
}) {
  const [framework, setFramework] = useState<Framework>(initialFramework)

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

  const value = useMemo(() => ({ framework, setFramework }), [framework])

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
