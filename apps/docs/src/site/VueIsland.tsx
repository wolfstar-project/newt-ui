import { useEffect, useRef, useState } from "react"
import type { App, Component } from "vue"

interface VueIslandProps {
  /* hold the loader at module scope: a new identity remounts the island */
  readonly load: () => Promise<{ readonly default: Component }>
}

/*
 * The site is a React application, so a Vue demo runs as its own application
 * inside one node of it. Both imports are dynamic, which keeps Vue and the
 * component it renders out of the bundle a reader on the React side downloads.
 */
export function VueIsland({ load }: VueIslandProps) {
  const host = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let app: App | undefined
    let live = true

    const mount = async () => {
      const [{ createApp }, module] = await Promise.all([import("vue"), load()])
      /* an effect that has already been cleaned up must not mount anything */
      if (!live || !host.current) return
      // SAFETY: `createApp` takes its root as the concrete component type it
      // was built with, which `Component` is the public union of; the module's
      // default export is that root and nothing else is accepted here.
      app = createApp(module.default as Parameters<typeof createApp>[0])
      app.mount(host.current)
    }

    void mount().catch(() => setFailed(true))

    return () => {
      live = false
      app?.unmount()
    }
  }, [load])

  if (failed) {
    return (
      <p className="font-data text-[13px] text-madder">
        The Vue demo did not load. Reload the page to try again.
      </p>
    )
  }

  /* the demo brings its own frame, so this node only holds the height */
  return <div ref={host} className="min-h-40" />
}
