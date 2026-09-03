import { NAV } from "../content/nav"
import { cn } from "../lib/utils"
import { ReactMark, VueMark } from "./FrameworkMark"
import { Link, usePath } from "./router"
import { Segmented } from "./Segmented"
import { FRAMEWORKS, useSettings } from "./settings"

const FRAMEWORK_ICONS = { react: <ReactMark />, vue: <VueMark /> } as const

const EYEBROW =
  "text-[11px] font-bold tracking-[0.04em] text-weft-faint uppercase"

/*
 * The active page is marked the way the client marks a selected channel: a
 * brand rule down the leading edge and the hover surface left switched on, so
 * the mark survives on a row whose label is long enough to wrap.
 */
const LINK_BASE =
  "flex items-center gap-2 border-l-2 py-[5px] pr-3 pl-3 text-[13px] font-medium transition-colors duration-(--dur-instant) ease-(--ease-beat)"

interface SidebarProps {
  readonly className?: string
  readonly onNavigate?: () => void
}

/*
 * The contract of the whole site in one control: every code block and every
 * live demo reads this choice, so a reader picks their framework once and the
 * documentation is written in it from then on.
 */
function FrameworkChoice() {
  const { framework, setFramework } = useSettings()

  return (
    <div className="flex flex-col gap-1.5 pl-3">
      <p className={EYEBROW}>Framework</p>
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

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const path = usePath()

  return (
    <nav
      aria-label="Documentation"
      className={cn("flex flex-col gap-6", className)}
    >
      <FrameworkChoice />

      {NAV.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className={cn(EYEBROW, "pb-1 pl-3")}>{group.label}</p>
          <ul className="flex flex-col">
            {group.items.map((item) => {
              const current = item.href === path
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      LINK_BASE,
                      current
                        ? "border-indigo bg-shed text-weft"
                        : "border-transparent text-weft-dim hover:text-weft"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
