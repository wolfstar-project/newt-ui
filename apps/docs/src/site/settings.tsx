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

/*
 * A stored value is a raw string, and `find` over the const tuple is both the
 * validation and the narrowing: no assertion is involved.
 */
function toFramework(raw: string | null) {
  return FRAMEWORKS.find((framework) => framework === raw)
}

function initialFramework(): Framework {
  return toFramework(window.localStorage.getItem(FRAMEWORK_KEY)) ?? "react"
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

  /* the choice is a preference, not part of the address: it outlives a page but never appears in a link */
  useEffect(() => {
    window.localStorage.setItem(FRAMEWORK_KEY, framework)
  }, [framework])

  const value = useMemo(() => ({ framework, setFramework }), [framework])

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
