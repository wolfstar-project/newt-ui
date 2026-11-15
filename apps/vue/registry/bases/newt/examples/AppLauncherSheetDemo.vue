<script setup lang="ts">
import { computed, ref } from "vue"
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
} from "~~/registry/bases/newt/ui/app-launcher"
import { Button } from "~~/registry/bases/newt/ui/button"

const apps = [
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

const open = ref(false)
const expanded = ref(false)
const query = ref("")

const matches = computed(() =>
  apps.filter((app) =>
    app.name.toLowerCase().includes(query.value.trim().toLowerCase())
  )
)
</script>

<template>
  <div
    class="relative flex h-[480px] w-full max-w-sm items-center justify-center overflow-hidden rounded-md bg-newt-bg-elevated"
  >
    <Button variant="secondary" @click="open = true">Open Apps</Button>

    <AppLauncher
      v-if="open"
      variant="sheet"
      modal
      label="Apps"
      :class="
        expanded
          ? 'absolute inset-x-0 bottom-0 [--newt-app-launcher-sheet-height:100%]'
          : 'absolute inset-x-0 bottom-0 [--newt-app-launcher-sheet-height:62%]'
      "
      @close="open = false"
    >
      <AppLauncherHandle
        label="Expand the sheet"
        :expanded="expanded"
        @click="expanded = !expanded"
      />

      <AppLauncherSearch>
        <AppLauncherSearchInput
          v-model="query"
          placeholder="Search Apps & Commands"
          aria-label="Search apps and commands"
        />
      </AppLauncherSearch>

      <AppLauncherBody>
        <AppLauncherSection aria-label="Apps in this server">
          <AppLauncherSectionHeader>
            <AppLauncherSectionTitle
              >Apps in this Server</AppLauncherSectionTitle
            >
          </AppLauncherSectionHeader>
          <AppLauncherList v-if="matches.length > 0">
            <AppLauncherItem
              v-for="app in matches"
              :key="app.name"
              :name="app.name"
              :description="app.description"
            >
              <template #icon>
                <AppLauncherItemIcon>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path :d="app.path" />
                  </svg>
                </AppLauncherItemIcon>
              </template>
            </AppLauncherItem>
          </AppLauncherList>
          <p v-else class="m-0 px-0.5 text-sm text-newt-text-muted">
            No apps match.
          </p>
        </AppLauncherSection>
      </AppLauncherBody>
    </AppLauncher>
  </div>
</template>
