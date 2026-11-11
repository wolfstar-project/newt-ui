"use client"

import * as React from "react"

import {
  SideNav,
  SideNavGroup,
  SideNavItem,
} from "@/registry/bases/newt/ui/side-nav"

const SECTIONS = ["Overview", "Roles", "Emoji"]

export default function SideNavDemo() {
  const [section, setSection] = React.useState("Overview")

  return (
    <SideNav
      aria-label="Server settings"
      className="w-56 rounded-md bg-newt-bg-surface px-2"
    >
      <SideNavGroup label="Server">
        {SECTIONS.map((name) => (
          <SideNavItem
            key={name}
            current={section === name}
            onClick={() => setSection(name)}
          >
            {name}
          </SideNavItem>
        ))}
      </SideNavGroup>
      <SideNavGroup label="Moderation">
        <SideNavItem
          badge={12}
          current={section === "Audit log"}
          onClick={() => setSection("Audit log")}
        >
          Audit log
        </SideNavItem>
      </SideNavGroup>
      <SideNavGroup>
        <SideNavItem variant="danger">Delete server</SideNavItem>
      </SideNavGroup>
    </SideNav>
  )
}
