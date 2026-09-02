import type { ReactNode } from "react"

import { cn } from "../lib/utils"

interface ProseProps {
  readonly children: ReactNode
  readonly className?: string
}

export function PageTitle({ children, className }: ProseProps) {
  return (
    <h1
      className={cn(
        "font-ui text-[36px] leading-[1.15] font-bold tracking-[-0.025em] text-weft",
        className
      )}
    >
      {children}
    </h1>
  )
}

export function Lede({ children, className }: ProseProps) {
  return (
    <p className={cn("max-w-2xl text-prose text-weft-dim", className)}>
      {children}
    </p>
  )
}

interface SectionProps extends ProseProps {
  readonly id: string
  readonly title: string
}

/* the id is the anchor the sidebar and the address bar both point at */
export function Section({ id, title, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("flex scroll-mt-28 flex-col gap-4", className)}
    >
      <h2 className="font-ui text-[20px] font-bold tracking-[-0.02em] text-weft">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function P({ children, className }: ProseProps) {
  return (
    <p className={cn("max-w-2xl text-prose text-weft-dim", className)}>
      {children}
    </p>
  )
}

export function List({ children, className }: ProseProps) {
  return (
    <ul
      className={cn(
        "flex max-w-2xl list-disc flex-col gap-2 pl-5 text-prose text-weft-dim marker:text-weft-faint",
        className
      )}
    >
      {children}
    </ul>
  )
}

/* named for what it is not: this is a run of code inside a sentence */
export function InlineCode({ children, className }: ProseProps) {
  return (
    <code
      className={cn(
        "bg-sunken px-1 font-data text-[12.5px] text-weft",
        className
      )}
    >
      {children}
    </code>
  )
}

/* the one aside on the site: a brand rule, a wash of the hover surface */
export function Note({ children, className }: ProseProps) {
  return (
    <aside
      className={cn(
        "selvedge selvedge-on max-w-2xl bg-shed/50 py-3 pr-4 pl-4 text-prose text-weft-dim",
        className
      )}
    >
      {children}
    </aside>
  )
}
