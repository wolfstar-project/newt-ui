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
        "text-[36px] leading-[1.15] font-bold tracking-[-0.02em] text-newt-text-primary",
        className
      )}
    >
      {children}
    </h1>
  )
}

export function Lede({ children, className }: ProseProps) {
  return (
    <p
      className={cn("max-w-2xl text-prose text-newt-text-secondary", className)}
    >
      {children}
    </p>
  )
}

export interface ManifestEntry {
  readonly key: string
  readonly value: ReactNode
  /** the one figure worth colouring: the size of the registry */
  readonly brand?: boolean
}

interface PageHeadProps {
  /** the mono strip above the title; a middle dot is drawn between the parts */
  readonly eyebrow: readonly string[]
  /** the mono line the title opens on, naming what the page is */
  readonly overline?: string
  readonly title: ReactNode
  readonly lead: ReactNode
  readonly actions?: ReactNode
  /** the `package.json` column beside the title */
  readonly manifest?: readonly ManifestEntry[]
}

/*
 * The header the original specification opened on: a rule of metadata, a
 * title in two voices, and a lead held by a brand rule. The manifest column
 * beside it states the facts a reader would otherwise go looking for.
 */
export function PageHead({
  eyebrow,
  overline,
  title,
  lead,
  actions,
  manifest,
}: PageHeadProps) {
  return (
    <header className={cn("page-header", !manifest && "page-header--solo")}>
      <div className="page-header__main">
        <div className="page-header__eyebrow">
          {eyebrow.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <h1>
          {overline && <em>{overline}</em>}
          {title}
        </h1>
        <p className="lead">{lead}</p>
        {actions && <div className="page-header__cta">{actions}</div>}
      </div>

      {manifest && (
        <aside className="page-header__manifest">
          <div className="manifest__heading">package.json</div>
          {manifest.map((entry) => (
            <div key={entry.key} className="manifest__row">
              <span className="manifest__key">{entry.key}</span>
              <span
                className={cn(
                  "manifest__val",
                  entry.brand && "manifest__val--brand"
                )}
              >
                {entry.value}
              </span>
            </div>
          ))}
        </aside>
      )}
    </header>
  )
}

interface SectionProps extends ProseProps {
  /** the anchor the sidenav and the address bar both point at */
  readonly id: string
  readonly title: string
  /** the BEM root class, or any other one-line note under the title */
  readonly meta?: ReactNode
  readonly description?: ReactNode
}

/*
 * A numbered entry in the specification. The number is a CSS counter rather
 * than a prop, so a section that only one framework renders still leaves the
 * sequence unbroken.
 */
export function Section({
  id,
  title,
  meta,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section id={id} className={cn("spec-section", className)}>
      <div className="spec-section__head">
        <div className="spec-section__num" aria-hidden="true" />
        <h2 className="spec-section__title">
          {title}
          {meta && <span className="spec-section__class">{meta}</span>}
        </h2>
        {description && <p className="spec-section__desc">{description}</p>}
      </div>
      <div className="spec-section__body">{children}</div>
    </section>
  )
}

/** The `§` rule that opens a run of sections belonging to one category. */
export function CategoryHeading({ children, className }: ProseProps) {
  return <div className={cn("category-heading", className)}>{children}</div>
}

export function P({ children, className }: ProseProps) {
  return (
    <p
      className={cn("max-w-2xl text-prose text-newt-text-secondary", className)}
    >
      {children}
    </p>
  )
}

export function List({ children, className }: ProseProps) {
  return (
    <ul
      className={cn(
        "flex max-w-2xl list-disc flex-col gap-2 pl-5 text-prose text-newt-text-secondary marker:text-newt-text-muted",
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
        "bg-newt-bg-surface px-1 font-mono text-[12.5px] text-newt-text-primary",
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
        "max-w-2xl border-l-2 border-newt-brand bg-newt-bg-hover/50 px-4 py-3 text-prose text-newt-text-secondary",
        className
      )}
    >
      {children}
    </aside>
  )
}
