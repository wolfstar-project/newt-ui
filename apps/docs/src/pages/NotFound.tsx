import { Lede, PageTitle } from "../site/Prose"
import { Link } from "../site/router"

/* the same pair of controls the overview ends on, so the way back is familiar */
const CTA =
  "ctl inline-flex h-(--ctl-h) items-center px-(--cell-x) text-[13px] transition-colors duration-(--dur-instant) ease-(--ease-beat) hover:text-weft"

/*
 * A 404 that stays calm: it says what happened, offers the two pages worth
 * offering, and does not guess at what the reader meant. `ComponentPage`
 * renders this same page for a slug the registry does not carry.
 */
export function NotFound() {
  return (
    <article className="flex flex-col gap-6">
      <PageTitle>Page not found</PageTitle>
      <Lede>
        The address in the bar does not match a page on this site. A component
        may have been renamed since the link was written, or the path may have
        picked up a stray character on the way here.
      </Lede>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className={CTA}>
          Overview
        </Link>
        <Link href="/docs/installation" className={CTA}>
          Installation
        </Link>
      </div>
    </article>
  )
}
