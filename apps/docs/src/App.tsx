import { ComponentPage } from "./pages/ComponentPage"
import { Home } from "./pages/Home"
import { Installation } from "./pages/Installation"
import { NotFound } from "./pages/NotFound"
import { usePath } from "./site/router"
import { SettingsProvider } from "./site/settings"
import { Shell } from "./site/Shell"

import "./styles/site.css"

const COMPONENT_PREFIX = "/docs/components/"

function Route() {
  const path = usePath()

  if (path === "/") {
    return (
      <Shell wide>
        <Home />
      </Shell>
    )
  }

  if (path === "/docs/installation") {
    return (
      <Shell>
        <Installation />
      </Shell>
    )
  }

  if (path.startsWith(COMPONENT_PREFIX)) {
    const name = path.slice(COMPONENT_PREFIX.length)
    if (name) {
      return (
        <Shell>
          {/* the key remounts the page, so a demo does not inherit the last one's state */}
          <ComponentPage key={name} name={name} />
        </Shell>
      )
    }
  }

  return (
    <Shell>
      <NotFound />
    </Shell>
  )
}

export function App() {
  return (
    <SettingsProvider>
      <Route />
    </SettingsProvider>
  )
}
