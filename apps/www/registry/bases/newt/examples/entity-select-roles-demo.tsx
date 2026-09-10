"use client"

import * as React from "react"

import { EntitySelect } from "@/registry/bases/newt/ui/entity-select"

/*
 * More than one may be chosen, so the choices leave the list and sit in the
 * control as chips — and each row grows a box instead of a tick.
 */
export default function EntitySelectRolesDemo() {
  const [roles, setRoles] = React.useState<readonly string[]>(["mod"])

  return (
    <EntitySelect
      kind="role"
      max={3}
      label="Which roles?"
      placeholder="Which roles?"
      value={roles}
      onValueChange={setRoles}
      options={[
        { value: "mod", label: "Moderator", color: "#f0b232", count: 4 },
        { value: "dev", label: "Contributor", color: "#3ba55d", count: 12 },
        { value: "player", label: "Player", color: "#5865f2", count: 128 },
        { value: "muted", label: "Muted", color: "#949ba4", count: 0 },
      ]}
    />
  )
}
