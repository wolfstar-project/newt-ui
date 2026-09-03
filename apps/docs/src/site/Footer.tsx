import { SITE } from "../content/site"

const LINK =
  "transition-colors duration-(--dur-instant) ease-(--ease-beat) hover:text-weft"

export function Footer() {
  return (
    <footer className="mt-24 border-t border-reed">
      <div className="mx-auto flex max-w-320 flex-wrap items-center justify-between gap-4 px-4 py-8 text-weft-dim sm:px-6">
        <p>
          Apache-2.0 licensed, built by WolfStar. The components are yours to
          change once they are copied into your project.
        </p>
        <div className="flex items-center gap-6">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className={LINK}
          >
            Source on GitHub
          </a>
          {/* Discord-inspired, and unaffiliated: the notice says so in full */}
          <a
            href={SITE.disclaimer}
            target="_blank"
            rel="noreferrer"
            className={LINK}
          >
            Trademark notice
          </a>
        </div>
      </div>
    </footer>
  )
}
