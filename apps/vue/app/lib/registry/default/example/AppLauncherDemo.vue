<script setup lang="ts">
import {
  AppLauncher,
  AppLauncherBody,
  AppLauncherHandle,
  AppLauncherItem,
  AppLauncherItemIcon,
  AppLauncherList,
  AppLauncherRecent,
  AppLauncherRecents,
  AppLauncherSearch,
  AppLauncherSearchInput,
  AppLauncherSection,
  AppLauncherSectionHeader,
  AppLauncherSectionTitle,
  AppLauncherViewMore,
} from "@/lib/registry/default/ui/app-launcher"

const shieldPath = "M12 2 4 5v7c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3Z"
const boardPath = "M4 4h16v12H8l-4 4V4Z"
</script>

<template>
  <AppLauncher aria-label="Apps" class="h-[420px]">
    <AppLauncherHandle />

    <AppLauncherSearch>
      <AppLauncherSearchInput
        placeholder="Search Apps & Commands"
        aria-label="Search apps and commands"
      />
    </AppLauncherSearch>

    <AppLauncherBody>
      <AppLauncherSection aria-label="Recents">
        <AppLauncherSectionHeader>
          <AppLauncherSectionTitle>Recents</AppLauncherSectionTitle>
          <AppLauncherViewMore>View More</AppLauncherViewMore>
        </AppLauncherSectionHeader>
        <AppLauncherRecents>
          <AppLauncherRecent aria-label="Moderation">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path :d="shieldPath" />
            </svg>
          </AppLauncherRecent>
          <AppLauncherRecent aria-label="Poll Night">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path :d="boardPath" />
            </svg>
          </AppLauncherRecent>
        </AppLauncherRecents>
      </AppLauncherSection>

      <AppLauncherSection aria-label="Apps in this server">
        <AppLauncherSectionHeader>
          <AppLauncherSectionTitle>Apps in this Server</AppLauncherSectionTitle>
          <AppLauncherViewMore>View More</AppLauncherViewMore>
        </AppLauncherSectionHeader>
        <AppLauncherList>
          <AppLauncherItem
            name="Moderation"
            description="Bans, timeouts and audit logs."
          >
            <template #icon>
              <AppLauncherItemIcon round>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path :d="shieldPath" />
                </svg>
              </AppLauncherItemIcon>
            </template>
          </AppLauncherItem>
          <AppLauncherItem
            promoted
            name="Poll Night"
            description="Run a quick poll in any channel."
          >
            <template #icon>
              <AppLauncherItemIcon>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path :d="boardPath" />
                </svg>
              </AppLauncherItemIcon>
            </template>
          </AppLauncherItem>
        </AppLauncherList>
      </AppLauncherSection>
    </AppLauncherBody>
  </AppLauncher>
</template>
