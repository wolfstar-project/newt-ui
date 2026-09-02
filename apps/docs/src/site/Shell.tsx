import { useEffect, useState, type ReactNode } from "react"

import { neighbours } from "../content/nav"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { Link, usePath } from "./router"
import { Sidebar } from "./Sidebar"

const EYEBROW =
  "font-data text-[11px] tracking-[0.13em] text-weft-faint uppercase"
const PAGER_LABEL =
  "text-weft-dim transition-colors duration-(--dur-instant) ease-(--ease-beat) group-hover:text-weft"

/** The two pages either side of this one, in the order the sidebar lists them. */
export function Pager() {
  const path = usePath()
  const { previous, next } = neighbours(path)
  if (!previous && !next) return null

  return (
    <nav
      aria-label="Pages"
      className="mt-16 flex items-stretch justify-between gap-4 border-t border-reed pt-6"
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

interface NavDrawerProps {
  readonly open: boolean
  readonly onClose: () => void
}

/*
 * The narrow width has no room for a column, so the same sidebar arrives over
 * the page instead. Escape closes it, and so does the ground behind it.
 */
function NavDrawer({ open, onClose }: NavDrawerProps) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Documentation navigation"
      className="fixed inset-0 z-(--z-panel) lg:hidden"
    >
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ground/80"
      />
      <div className="relative h-full w-72 overflow-y-auto border-r border-reed bg-raised">
        <Sidebar className="p-4" onNavigate={onClose} />
      </div>
    </div>
  )
}

interface ShellProps {
  readonly children: ReactNode
  /** the home page runs the full width; a docs page keeps a reading column */
  readonly wide?: boolean
}

export function Shell({ children, wide = false }: ShellProps) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="min-h-dvh">
      <Header onOpenNav={() => setNavOpen(true)} />

      {wide ? (
        <main>{children}</main>
      ) : (
        <div className="mx-auto flex max-w-360 gap-12 px-4 sm:px-6">
          <div className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-15">
              <div className="max-h-[calc(100dvh-3.75rem)] overflow-y-auto">
                <Sidebar className="py-10 pr-2" />
              </div>
            </div>
          </div>
          <main className="min-w-0 flex-1 py-12">
            {children}
            <Pager />
          </main>
        </div>
      )}

      <Footer />

      <NavDrawer open={navOpen} onClose={() => setNavOpen(false)} />
    </div>
  )
}
