import { Component, type ErrorInfo, type ReactNode } from "react"

interface DemoBoundaryProps {
  readonly children: ReactNode
}

interface DemoBoundaryState {
  readonly failed: boolean
}

/*
 * A React demo arrives as its own chunk, so a fetch that never resolves throws
 * during render and would otherwise take the whole page with it. `VueIsland`
 * catches the equivalent failure on the Vue side; this is the React half of
 * that pair, and the message is deliberately the same one.
 *
 * Give it a `key` that changes with the demo: an error state belongs to the
 * chunk that failed, not to the position it was rendered in.
 */
export class DemoBoundary extends Component<
  DemoBoundaryProps,
  DemoBoundaryState
> {
  state: DemoBoundaryState = { failed: false }

  static getDerivedStateFromError(): DemoBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("The demo failed to render.", error, info.componentStack)
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="font-data text-[13px] text-madder">
          The demo did not load. Reload the page to try again.
        </p>
      )
    }

    return this.props.children
  }
}
