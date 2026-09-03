import type { ReactNode } from "react"

import { cn } from "../lib/utils"

interface DemoProps {
  readonly children: ReactNode
  readonly caption?: string
  readonly className?: string
}

/*
 * The frame belongs to the site and the contents belong to the library, so the
 * boundary between the two type systems is drawn here: `newt-root` hands the
 * Discord-inspired font and text colour to everything inside it, while
 * `display: contents` keeps the body's own flex row intact.
 */
export function Demo({ children, caption, className }: DemoProps) {
  return (
    <figure className={cn("demo-frame", className)}>
      <div className="demo-body">
        <div className="newt-root contents">{children}</div>
      </div>
      {caption && <figcaption className="demo-caption">{caption}</figcaption>}
    </figure>
  )
}
