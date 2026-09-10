import { useStore } from "@nanostores/react"
import {
  Component,
  Suspense,
  lazy,
  useMemo,
  type ComponentType,
  type ReactNode,
} from "react"

import { reactDemos } from "@/lib/registry-client"
import { $framework } from "@/stores/framework"

/*
 * A demo is a real component from the registry, not a screenshot, so a broken
 * one must not take the page down with it. The boundary shows what failed and
 * leaves the rest of the documentation readable.
 */
interface BoundaryState {
  readonly error?: Error
}

class DemoBoundary extends Component<
  { readonly children: ReactNode },
  BoundaryState
> {
  override state: BoundaryState = {}

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  override render() {
    const { error } = this.state
    if (error !== undefined) {
      return (
        <p className="demo-error">
          This demo failed to render: {error.message}
        </p>
      )
    }
    return this.props.children
  }
}

/**
 * Renders a React demo, but only while React is the selected framework. Both
 * islands are mounted on every preview; the store decides which one paints.
 */
export default function ReactDemo({ demo }: { readonly demo: string }) {
  const framework = useStore($framework)
  const Demo = useMemo<ComponentType | undefined>(() => {
    const load = reactDemos.get(demo)
    return load === undefined ? undefined : lazy(load)
  }, [demo])

  if (framework !== "react") return null
  if (Demo === undefined) {
    return <p className="demo-error">No React demo named {demo}.</p>
  }

  return (
    <DemoBoundary>
      <Suspense fallback={<div className="demo-loading" aria-hidden="true" />}>
        <Demo />
      </Suspense>
    </DemoBoundary>
  )
}
