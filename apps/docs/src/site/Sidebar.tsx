import { NAV } from "../content/nav"
import { cn } from "../lib/utils"
import { Link, usePath } from "./router"
import { Segmented } from "./Segmented"
import { FRAMEWORKS, useSettings } from "./settings"

const EYEBROW =
  "font-data text-[11px] tracking-[0.13em] text-weft-faint uppercase"

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
    <div className="flex flex-col gap-1.5">
      <p className={EYEBROW}>Framework</p>
      <Segmented
        legend="Framework"
        options={FRAMEWORKS}
        value={framework}
        onSelect={setFramework}
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
      className={cn("flex flex-col gap-7", className)}
    >
      <FrameworkChoice />

      {NAV.map((group) => (
        <div key={group.label} className="flex flex-col gap-1.5">
          <p className={EYEBROW}>{group.label}</p>
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
                      "selvedge flex h-(--ctl-h) items-center pl-3 text-[13px] transition-colors duration-(--dur-instant) ease-(--ease-beat)",
                      current
                        ? "selvedge-on bg-indigo-wash text-weft"
                        : "text-weft-dim hover:bg-shed hover:text-weft"
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
