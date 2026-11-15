"use client"

import * as React from "react"

import {
  AppLauncher,
  AppLauncherBody,
  AppLauncherHandle,
  AppLauncherItem,
  AppLauncherItemIcon,
  AppLauncherList,
  AppLauncherSearch,
  AppLauncherSearchInput,
  AppLauncherSection,
  AppLauncherSectionHeader,
  AppLauncherSectionTitle,
} from "@/registry/bases/newt/ui/app-launcher"
import { Button } from "@/registry/bases/newt/ui/button"

const APPS = [
  {
    name: "Moderation",
    description: "Bans, timeouts and audit logs.",
    path: "M12 2 4 5v7c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3Z",
  },
  {
    name: "Poll Night",
    description: "Run a quick poll in any channel.",
    path: "M4 4h16v12H8l-4 4V4Z",
  },
  {
    name: "Reminders",
    description: "Schedule a message for later.",
    path: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm1 4v5l4 2-1 1.7-5-2.7V7h2Z",
  },
]

export default function AppLauncherSheetDemo() {
  const [open, setOpen] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const matches = APPS.filter((app) =>
    app.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="relative flex h-[480px] w-full max-w-sm items-center justify-center overflow-hidden rounded-md bg-newt-bg-elevated">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open Apps
      </Button>

      {open ? (
        <AppLauncher
          variant="sheet"
          modal
          label="Apps"
          onClose={() => setOpen(false)}
          className={
            expanded
              ? "absolute inset-x-0 bottom-0 [--newt-app-launcher-sheet-height:100%]"
              : "absolute inset-x-0 bottom-0 [--newt-app-launcher-sheet-height:62%]"
          }
        >
          <AppLauncherHandle
            label="Expand the sheet"
            expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          />

          <AppLauncherSearch>
            <AppLauncherSearchInput
              placeholder="Search Apps & Commands"
              aria-label="Search apps and commands"
              value={query}
              onValueChange={setQuery}
            />
          </AppLauncherSearch>

          <AppLauncherBody>
            <AppLauncherSection aria-label="Apps in this server">
              <AppLauncherSectionHeader>
                <AppLauncherSectionTitle>
                  Apps in this Server
                </AppLauncherSectionTitle>
              </AppLauncherSectionHeader>
              {matches.length > 0 ? (
                <AppLauncherList>
                  {matches.map((app) => (
                    <AppLauncherItem
                      key={app.name}
                      name={app.name}
                      description={app.description}
                      icon={
                        <AppLauncherItemIcon>
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d={app.path} />
                          </svg>
                        </AppLauncherItemIcon>
                      }
                    />
                  ))}
                </AppLauncherList>
              ) : (
                <p className="m-0 px-0.5 text-sm text-newt-text-muted">
                  No apps match.
                </p>
              )}
            </AppLauncherSection>
          </AppLauncherBody>
        </AppLauncher>
      ) : null}
    </div>
  )
}
