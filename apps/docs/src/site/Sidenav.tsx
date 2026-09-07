import { COMPONENTS } from "../content/components"
import { NAV } from "../content/nav"
import { SITE } from "../content/site"
import { cn } from "../lib/utils"
import { ReactMark, VueMark } from "./FrameworkMark"
import { Link, usePath } from "./router"
import { Segmented } from "./Segmented"
import { FRAMEWORKS, useSettings } from "./settings"
import { NewtMark } from "./Wordmark"

const FRAMEWORK_ICONS = { react: <ReactMark />, vue: <VueMark /> } as const

/* the groups the registry itself declares, so a component link carries the hash */
const COMPONENT_GROUPS = new Set(
  NAV.filter((group) => group.label !== "Start").map((group) => group.label)
)

interface SidenavProps {
  readonly className?: string
  readonly onNavigate?: () => void
}

/*
 * The framework switch is the contract of the whole site in one control: every
 * code block and every live demo reads this choice, so a reader picks their
 * framework once and the documentation is written in it from then on.
 */
function FrameworkChoice() {
  const { framework, setFramework } = useSettings()

  return (
    <div className="flex flex-col gap-1.5 px-5 pt-4">
      <p className="text-[11px] font-bold tracking-[0.04em] text-newt-text-muted uppercase">
        Framework
      </p>
      <Segmented
        legend="Framework"
        options={FRAMEWORKS}
        value={framework}
        onSelect={setFramework}
        icons={FRAMEWORK_ICONS}
        className="self-start"
      />
    </div>
  )
}

export function Sidenav({ className, onNavigate }: SidenavProps) {
  const path = usePath()

  return (
    <nav aria-label="Documentation" className={cn("sidenav", className)}>
      <div className="sidenav__brand">
        <NewtMark className="size-4.5 text-newt-brand" />
        {/* the mark is drawn, the name is typed: the mono face says it is a package */}
        <span className="font-mono text-[15px] leading-none font-bold">
          newt<span className="text-newt-text-muted">/ui</span>
        </span>
        <span className="sidenav__brand-ver">v{SITE.version}</span>
      </div>

      <div className="sidenav__scroll">
        <FrameworkChoice />

        {NAV.map((group) => (
          <div key={group.label}>
            <div className="sidenav__group">{group.label}</div>
            {group.items.map((item) => {
              const current = item.href === path
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={current ? "page" : undefined}
                  className="sidenav__link"
                >
                  {COMPONENT_GROUPS.has(group.label) && (
                    <span aria-hidden="true" className="sidenav__hash">
                      #
                    </span>
                  )}
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      <div className="sidenav__footer">
        <span
          aria-hidden="true"
          className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-newt-brand font-mono text-[13px] font-bold text-white"
        >
          N
          <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-newt-bg-surface bg-newt-online" />
        </span>
        <span className="sidenav__footer-meta">
          <span className="sidenav__footer-name">wolfstar-project</span>
          <span className="sidenav__footer-sub">
            v{SITE.version} · {COMPONENTS.length} components
          </span>
        </span>
      </div>
    </nav>
  )
}
