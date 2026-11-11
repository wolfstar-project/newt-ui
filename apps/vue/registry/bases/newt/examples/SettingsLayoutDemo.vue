<script setup lang="ts">
import { ref, watch } from "vue"
import {
  SettingsLayout,
  type SettingsGroup,
} from "~~/registry/bases/newt/blocks/settings-layout"
import { Alert, AlertTitle } from "~~/registry/bases/newt/ui/alert"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Field,
  FieldHelp,
  Input,
  Label,
  Switch,
} from "~~/registry/bases/newt/ui/form-fields"

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

const section = ref("overview")
const name = ref("Build Club")
const welcome = ref(true)
const saved = ref(false)

watch(section, () => {
  saved.value = false
})
</script>

<template>
  <SettingsLayout
    v-model:section="section"
    title="Server settings"
    :groups="GROUPS"
  >
    <div v-if="section === 'overview'" class="flex max-w-sm flex-col gap-5">
      <Field>
        <Label for="settings-layout-name">Server name</Label>
        <Input id="settings-layout-name" v-model="name" />
        <FieldHelp>Shown at the top of the channel list.</FieldHelp>
      </Field>
      <div
        class="flex items-center justify-between gap-4 text-sm text-newt-text-primary"
      >
        <span id="settings-layout-welcome">Send a welcome message</span>
        <Switch v-model="welcome" aria-labelledby="settings-layout-welcome" />
      </div>
      <Alert v-if="saved" variant="success">
        <AlertTitle>Changes saved</AlertTitle>
      </Alert>
      <div>
        <Button @click="saved = true">Save changes</Button>
      </div>
    </div>
    <p v-else class="m-0 text-sm text-newt-text-secondary">
      This section is yours to fill in.
    </p>
  </SettingsLayout>
</template>
