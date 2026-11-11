"use client"

import * as React from "react"

import {
  SettingsLayout,
  type SettingsGroup,
} from "@/registry/bases/newt/blocks/settings-layout/settings-layout"
import { Alert, AlertTitle } from "@/registry/bases/newt/ui/alert"
import { Button } from "@/registry/bases/newt/ui/button"
import {
  Field,
  FieldHelp,
  Input,
  Label,
  Switch,
} from "@/registry/bases/newt/ui/form-fields"

const GROUPS: readonly SettingsGroup[] = [
  {
    label: "Server",
    sections: [
      { id: "overview", label: "Overview" },
      { id: "roles", label: "Roles" },
    ],
  },
  {
    label: "Moderation",
    sections: [{ id: "audit-log", label: "Audit log", badge: 12 }],
  },
  { sections: [{ id: "delete", label: "Delete server", danger: true }] },
]

export default function SettingsLayoutDemo() {
  const [section, setSection] = React.useState("overview")
  const [saved, setSaved] = React.useState(false)

  return (
    <SettingsLayout
      title="Server settings"
      groups={GROUPS}
      section={section}
      onSectionChange={(next) => {
        setSection(next)
        setSaved(false)
      }}
    >
      {section === "overview" ? (
        <div className="flex max-w-sm flex-col gap-5">
          <Field>
            <Label htmlFor="settings-layout-name">Server name</Label>
            <Input id="settings-layout-name" defaultValue="Build Club" />
            <FieldHelp>Shown at the top of the channel list.</FieldHelp>
          </Field>
          <div className="flex items-center justify-between gap-4 text-sm text-newt-text-primary">
            <span id="settings-layout-welcome">Send a welcome message</span>
            <Switch aria-labelledby="settings-layout-welcome" defaultChecked />
          </div>
          {saved ? (
            <Alert variant="success">
              <AlertTitle>Changes saved</AlertTitle>
            </Alert>
          ) : null}
          <div>
            <Button onClick={() => setSaved(true)}>Save changes</Button>
          </div>
        </div>
      ) : (
        <p className="m-0 text-sm text-newt-text-secondary">
          This section is yours to fill in.
        </p>
      )}
    </SettingsLayout>
  )
}
