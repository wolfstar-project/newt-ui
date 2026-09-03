import { Fragment } from "react"

import { Link } from "./router"

interface Crumb {
  readonly label: string
  readonly href?: string
}

interface BreadcrumbProps {
  /** the last crumb is the page itself, so it carries no href */
  readonly trail: readonly Crumb[]
}

export function Breadcrumb({ trail }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-weft-dim">
        {trail.map((crumb, index) => (
          <Fragment key={crumb.label}>
            {index > 0 && (
              <li aria-hidden="true" className="text-weft-faint">
                /
              </li>
            )}
            <li>
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="transition-colors duration-(--dur-instant) ease-(--ease-beat) hover:text-weft"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-weft">{crumb.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
