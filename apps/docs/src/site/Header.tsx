import { SITE } from "../content/site"
import { cn } from "../lib/utils"
import { Link, usePath } from "./router"
import { Segmented } from "./Segmented"
import { THEMES, useSettings } from "./settings"
import { Wordmark } from "./Wordmark"

/* `match` is a prefix, so every page under a section lights its own link */
const SECTIONS = [
  { href: "/docs/installation", label: "Docs", match: "/docs/installation" },
  {
    href: "/docs/components/button",
    label: "Components",
    match: "/docs/components/",
  },
] as const

const LINK =
  "transition-colors duration-(--dur-instant) ease-(--ease-beat) hover:text-weft"

interface HeaderProps {
  readonly onOpenNav: () => void
}

export function Header({ onOpenNav }: HeaderProps) {
  const { theme, setTheme } = useSettings()
  const path = usePath()

  return (
    <header className="reed-edge sticky top-0 z-(--z-sticky) bg-ground/85 backdrop-blur-md">
      <div className="mx-auto flex h-15 max-w-360 items-center gap-5 px-4 sm:px-6">
        {/* the 19px lockup sits low against the 14px nav baseline once centred */}
        <Link
          href="/"
          aria-label={`${SITE.name}, home`}
          className="flex -translate-y-[1.5px] items-center"
        >
          <Wordmark />
        </Link>

        <nav
          aria-label="Sections"
          className="hidden items-center gap-4 md:flex"
        >
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={cn(
                LINK,
                path.startsWith(section.match) ? "text-weft" : "text-weft-dim"
              )}
            >
              {section.label}
            </Link>
          ))}
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className={cn(LINK, "text-weft-dim")}
          >
            GitHub
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Segmented
            legend="Appearance"
            options={THEMES}
            value={theme}
            onSelect={setTheme}
          />
          <button
            type="button"
            onClick={onOpenNav}
            className="ctl h-(--ctl-h) cursor-pointer font-data text-[12px] text-weft-dim transition-colors duration-(--dur-instant) ease-(--ease-beat) hover:text-weft lg:hidden"
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  )
}
