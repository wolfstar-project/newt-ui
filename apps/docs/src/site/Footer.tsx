import { SITE } from "../content/site"

export function Footer() {
  return (
    <footer className="page-footer">
      <div className="page-footer__row">
        <span>
          {SITE.license} · built by {SITE.author}
        </span>
        <span className="flex flex-wrap gap-6">
          <a href={SITE.github} target="_blank" rel="noreferrer">
            Source on GitHub
          </a>
          {/* Discord-inspired, and unaffiliated: the notice says so in full */}
          <a href={SITE.disclaimer} target="_blank" rel="noreferrer">
            Trademark notice
          </a>
        </span>
      </div>
      <p className="page-footer__disclaimer">
        {SITE.name} is an independent, community-built component library. It is
        not affiliated with, endorsed by, or sponsored by Discord Inc. Discord
        and the Discord logo are trademarks of Discord Inc. No Discord asset,
        logo or wordmark ships with this project: the components are original
        work that follows the visual language of the client, and the code you
        copy is yours to change.
      </p>
    </footer>
  )
}
