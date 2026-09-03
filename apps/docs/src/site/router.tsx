import {
  useSyncExternalStore,
  type AnchorHTMLAttributes,
  type MouseEvent,
} from "react"

/*
 * `pushState` fires nothing, so a navigation announces itself. `popstate`
 * covers the back and forward buttons; the two together are the whole store.
 */
const NAVIGATE_EVENT = "newt-ui:navigate"

function subscribe(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange)
  window.addEventListener(NAVIGATE_EVENT, onStoreChange)
  return () => {
    window.removeEventListener("popstate", onStoreChange)
    window.removeEventListener(NAVIGATE_EVENT, onStoreChange)
  }
}

function readPath() {
  return window.location.pathname
}

/** The current pathname, re-read on every history change. */
export function usePath() {
  return useSyncExternalStore(subscribe, readPath, () => "/")
}

/**
 * Push a same-origin href and take the reader to the top, or to the anchor the
 * href names once it is in the document.
 */
export function navigate(href: string) {
  const hashAt = href.indexOf("#")
  const target = hashAt === -1 ? href : href.slice(0, hashAt)
  const hash = hashAt === -1 ? "" : href.slice(hashAt + 1)

  if (target !== window.location.pathname) {
    window.history.pushState(null, "", href)
    window.dispatchEvent(new Event(NAVIGATE_EVENT))
  }

  if (!hash) {
    window.scrollTo({ top: 0 })
    return
  }

  /* the section has to be in the document before it can be scrolled to */
  requestAnimationFrame(() => {
    document.getElementById(hash)?.scrollIntoView()
  })
}

/*
 * A plain click with no modifier is the only one this takes. A middle click, a
 * cmd click and a target all belong to the browser.
 */
function isPlainClick(event: MouseEvent<HTMLAnchorElement>) {
  if (event.defaultPrevented || event.button !== 0) return false
  return !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  readonly href: string
}

export function Link({ href, onClick, children, ...rest }: LinkProps) {
  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event)
        if (!href.startsWith("/") || !isPlainClick(event)) return
        event.preventDefault()
        navigate(href)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
