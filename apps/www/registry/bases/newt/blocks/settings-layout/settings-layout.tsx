import * as React from "react"

import { cn } from "@/lib/utils"
import { Breadcrumb, BreadcrumbItem } from "@/registry/bases/newt/ui/breadcrumb"
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
} from "@/registry/bases/newt/ui/side-nav"

/*
 * The shape the layout reads. A block does not know your router; map your
 * sections onto this at the edge of it.
 */
export interface SettingsSection {
  id: string
  label: string
  /** A count shown beside the entry. */
  badge?: number
  /** For an entry that destroys something. It is never the current section. */
  danger?: boolean
}

export interface SettingsGroup {
  /** The small heading over the group. */
  label?: string
  sections: readonly SettingsSection[]
}

export interface SettingsLayoutProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  /** What is being configured; the first crumb and the nav's name. */
  title: string
  groups: readonly SettingsGroup[]
  /** The id of the section being shown. */
  section: string
  onSectionChange?: (section: string) => void
}

/*
 * A settings screen: the list of sections down the side, and the chosen
 * section's heading, breadcrumb and content beside it. The content is the
 * children, so each section stays an ordinary component of yours. Below
 * 40rem the navigation moves above the content.
 */
export function SettingsLayout({
  title,
  groups,
  section,
  onSectionChange,
  className,
  children,
  ...props
}: SettingsLayoutProps) {
  const current = groups
    .flatMap((group) => group.sections)
    .find((each) => each.id === section)

  return (
    <div
      className={cn(
        "flex w-full flex-col bg-newt-bg-elevated sm:flex-row",
        className
      )}
      {...props}
    >
      <SideNav
        aria-label={title}
        className="shrink-0 bg-newt-bg-surface px-2 sm:w-56"
      >
        {groups.map((group, index) => (
          <SideNavGroup key={group.label ?? index} label={group.label}>
            {group.sections.map((each) => (
              <SideNavItem
                key={each.id}
                badge={each.badge}
                variant={each.danger ? "danger" : "default"}
                current={each.id === section}
                onClick={() => onSectionChange?.(each.id)}
              >
                {each.label}
              </SideNavItem>
            ))}
          </SideNavGroup>
        ))}
      </SideNav>
      <main className="flex min-w-0 flex-1 flex-col gap-4 p-6">
        <Breadcrumb>
          <BreadcrumbItem>{title}</BreadcrumbItem>
          <BreadcrumbItem current>{current?.label ?? section}</BreadcrumbItem>
        </Breadcrumb>
        <h2 className="m-0 text-xl font-semibold leading-6 text-newt-text-primary">
          {current?.label ?? section}
        </h2>
        {children}
      </main>
    </div>
  )
}
