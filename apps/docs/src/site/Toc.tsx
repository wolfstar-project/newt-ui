import { useEffect, useState } from "react"

import { cn } from "../lib/utils"
import { usePath } from "./router"
import { useSettings } from "./settings"

interface Entry {
  readonly id: string
  readonly label: string
}

/*
 * The list is read off the document rather than declared beside each page,
 * because a page's sections are not fixed: the installation page shows the
 * Nuxt section to a Vue reader and the Next one to a React reader. Whatever is
 * on screen is what the index lists.
 */
function readEntries(): readonly Entry[] {
  const sections = document.querySelectorAll("main section[id]")
  const entries: Entry[] = []
  for (const section of sections) {
    const heading = section.querySelector("h2")
    const label = heading?.textContent?.trim()
    if (label) entries.push({ id: section.id, label })
  }
  return entries
}

export function Toc() {
  const path = usePath()
  const { framework } = useSettings()
  const [entries, setEntries] = useState<readonly Entry[]>([])
  const [active, setActive] = useState<string | undefined>(undefined)

  /* the sections belong to the page and the framework that rendered it */
  useEffect(() => {
    setEntries(readEntries())
  }, [path, framework])

  /*
   * The heading nearest the top of the viewport is the one being read. A
   * section scrolled past leaves the band, so the mark moves down with the
   * reader and back up again when they return.
   */
  useEffect(() => {
    if (entries.length === 0) return undefined

    const observer = new IntersectionObserver(
      (records) => {
        const topmost = records
          .filter((record) => record.isIntersecting)
          .reduce<IntersectionObserverEntry | undefined>(
            (closest, record) =>
              !closest ||
              record.boundingClientRect.top < closest.boundingClientRect.top
                ? record
                : closest,
            undefined
          )
        if (topmost) setActive(topmost.target.id)
      },
      { rootMargin: "-80px 0px -70% 0px" }
    )

    for (const entry of entries) {
      const node = document.getElementById(entry.id)
      if (node) observer.observe(node)
    }
    return () => observer.disconnect()
  }, [entries])

  if (entries.length === 0) return null

  return (
    <nav aria-label="On this page" className="flex flex-col gap-3">
      <p className="text-[13px] font-semibold text-weft">On this page</p>
      <ul className="flex flex-col gap-2 border-l border-reed">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={entry.id === active ? "location" : undefined}
              className={cn(
                "-ml-px block border-l pl-3 text-[13px] transition-colors duration-(--dur-instant) ease-(--ease-beat)",
                entry.id === active
                  ? "border-indigo text-weft"
                  : "border-transparent text-weft-dim hover:text-weft"
              )}
            >
              {entry.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
