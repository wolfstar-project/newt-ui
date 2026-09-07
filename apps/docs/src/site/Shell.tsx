import { useEffect, useState, type ReactNode } from "react"

import { neighbours } from "../content/nav"
import { cn } from "../lib/utils"
import { Footer } from "./Footer"
import { Link, usePath } from "./router"
import { Sidenav } from "./Sidenav"

const EYEBROW =
  "font-mono text-[11px] tracking-[0.13em] text-newt-text-muted uppercase"
const PAGER_LABEL =
  "text-newt-text-secondary transition-colors duration-(--dur-instant) ease-(--ease-beat) group-hover:text-newt-text-primary"

/** The two pages either side of this one, in the order the sidenav lists them. */
export function Pager() {
  const path = usePath()
  const { previous, next } = neighbours(path)
  if (!previous && !next) return null

  return (
    <nav
      aria-label="Pages"
      className="mt-12 flex items-stretch justify-between gap-4 border-t border-newt-border pt-6"
    >
      {previous ? (
        <Link href={previous.href} className="group flex flex-col gap-1">
          <span className={EYEBROW}>Back</span>
          <span className={PAGER_LABEL}>{previous.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={next.href} className="group flex flex-col gap-1 text-right">
          <span className={EYEBROW}>Next</span>
          <span className={PAGER_LABEL}>{next.label}</span>
        </Link>
      )}
    </nav>
  )
}

/*
 * The reading column under the header. It is the page rather than the shell
 * that opens it, because the header above it runs edge to edge and only the
 * page knows what belongs in it.
 */
export function Content({ children }: { readonly children: ReactNode }) {
  return (
    <div className="content">
      {children}
      <Pager />
    </div>
  )
}

interface ShellProps {
  readonly children: ReactNode
}

export function Shell({ children }: ShellProps) {
  const [navOpen, setNavOpen] = useState(false)
  const path = usePath()

  /* the drawer belongs to the page it was opened on, and closes with it */
  useEffect(() => setNavOpen(false), [path])

  useEffect(() => {
    if (!navOpen) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [navOpen])

  return (
    <>
      <button
        type="button"
        className="menu-toggle"
        aria-label="Toggle navigation"
        aria-expanded={navOpen}
        onClick={() => setNavOpen((open) => !open)}
      >
        ☰
      </button>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className={cn("sidenav-overlay", navOpen && "is-open")}
        onClick={() => setNavOpen(false)}
      />

      <div className="layout">
        <Sidenav
          className={cn(navOpen && "is-open")}
          onNavigate={() => setNavOpen(false)}
        />

        <div className="main">
          <main>{children}</main>
          <Footer />
        </div>
      </div>
    </>
  )
}
