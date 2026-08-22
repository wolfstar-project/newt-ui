"use client"

import { usePathname } from "next/navigation"
import * as React from "react"

import { Avatar } from "@/registry/default/ui/avatar"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/default/ui/status-indicator"
import { categories } from "@/registry/registry-categories"
import { ui } from "@/registry/registry-ui"

const GETTING_STARTED = [
  { href: "#overview", label: "Overview" },
  { href: "#installation", label: "Installation" },
  { href: "#cdn", label: "CDN (jsDelivr)" },
  { href: "#tokens", label: "Design tokens" },
]

function titleOf(name: string) {
  return ui.find((item) => item.name === name)?.title ?? name
}

export function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const isHome = pathname === "/"

  // Scroll-spy: highlight the link whose section is in view (ported from the
  // original single-page docs).
  React.useEffect(() => {
    if (!isHome) return
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[id]"))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: "-10% 0px -75% 0px" }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [isHome])

  const close = () => setOpen(false)
  const linkClass = (id: string) =>
    `sidenav__link${
      (isHome && activeId === id) || pathname === `/docs/components/${id}`
        ? " is-active"
        : ""
    }`
  const href = (name: string) =>
    isHome ? `#${name}` : `/docs/components/${name}`

  return (
    <>
      <button
        className="menu-toggle"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        ☰
      </button>
      <div
        className={`sidenav-overlay${open ? " is-open" : ""}`}
        onClick={close}
      />

      <nav className={`sidenav${open ? " is-open" : ""}`}>
        <div className="sidenav__brand">
          <span className="sidenav__brand-icon">newt</span>
          <span>/ui</span>
          <span className="sidenav__brand-ver">v0.2</span>
        </div>

        <div className="sidenav__scroll">
          <div className="sidenav__group">Getting started</div>
          {GETTING_STARTED.map((item) => (
            <a
              key={item.href}
              className={linkClass(item.href.slice(1))}
              href={isHome ? item.href : `/${item.href}`}
              onClick={close}
            >
              {item.label}
            </a>
          ))}

          {categories.map((category) => (
            <React.Fragment key={category.slug}>
              <div className="sidenav__group">{category.label}</div>
              {category.components.map((name) => (
                <a
                  key={name}
                  className={linkClass(name)}
                  href={href(name)}
                  onClick={close}
                >
                  <span className="h">#</span> {titleOf(name)}
                </a>
              ))}
            </React.Fragment>
          ))}

          <div className="sidenav__group">Ecosystem</div>
          <a
            className={linkClass("ecosystem")}
            href={isHome ? "#ecosystem" : "/#ecosystem"}
            onClick={close}
          >
            Ecosystem
          </a>
        </div>

        <div className="sidenav__footer">
          <StatusIndicator>
            <Avatar size="sm">N</Avatar>
            <StatusDot status="online" />
          </StatusIndicator>
          <div className="sidenav__footer-meta">
            <span className="sidenav__footer-name">wolfstar-project</span>
            <span className="sidenav__footer-sub">
              v0.2.0 · {ui.length} components
            </span>
          </div>
        </div>
      </nav>
    </>
  )
}
