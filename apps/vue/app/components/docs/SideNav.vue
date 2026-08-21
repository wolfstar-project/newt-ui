<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue"
import { useRoute } from "vue-router"

import type { DocsNavLink } from "@/composables/useDocsNav"
import { Avatar, AvatarFallback } from "@/lib/registry/default/ui/avatar"
import {
  StatusDot,
  StatusIndicator,
} from "@/lib/registry/default/ui/status-indicator"

const { site } = useAppConfig()
const { groups, componentCount } = useDocsNav()

const route = useRoute()
const isHome = computed<boolean>(() => route.path === "/")

const open = ref(false)

const { activeId, refresh } = useScrollSpy({
  selector: ".main [id]",
  initial: "overview",
  enabled: () => isHome.value,
})

const routeActiveId = computed<string>(() => {
  const name = route.params.name
  return typeof name === "string" ? name : ""
})

function href(link: DocsNavLink): string {
  return isHome.value ? `#${link.id}` : `/#${link.id}`
}

function isActive(link: DocsNavLink): boolean {
  return isHome.value
    ? activeId.value === link.id
    : routeActiveId.value === link.id
}

function closeNav(): void {
  open.value = false
}

function toggleNav(): void {
  open.value = !open.value
}

watch(
  () => route.fullPath,
  async () => {
    closeNav()
    await nextTick()
    refresh()
  }
)
</script>

<template>
  <button
    class="menu-toggle"
    type="button"
    aria-label="Toggle navigation"
    @click="toggleNav"
  >
    ☰
  </button>
  <div class="sidenav-overlay" :class="{ 'is-open': open }" @click="closeNav" />

  <nav class="sidenav" :class="{ 'is-open': open }">
    <div class="sidenav__brand">
      <span class="sidenav__brand-icon">newt</span><span>/ui</span>
      <span class="sidenav__brand-ver">v{{ site.version.slice(0, 3) }}</span>
    </div>
    <div class="sidenav__scroll">
      <template v-for="group in groups" :key="group.label">
        <div class="sidenav__group">{{ group.label }}</div>
        <a
          v-for="link in group.links"
          :key="link.id"
          class="sidenav__link"
          :class="{ 'is-active': isActive(link) }"
          :href="href(link)"
          @click="closeNav"
        >
          <span v-if="link.anchor" class="h">#</span>
          {{ link.label }}
        </a>
      </template>
    </div>
    <div class="sidenav__footer">
      <StatusIndicator>
        <Avatar size="sm">
          <AvatarFallback>N</AvatarFallback>
        </Avatar>
        <StatusDot status="online" />
      </StatusIndicator>
      <div class="sidenav__footer-meta">
        <span class="sidenav__footer-name">wolfstar-project</span>
        <span class="sidenav__footer-sub"
          >v{{ site.version }} · {{ componentCount }} components</span
        >
      </div>
    </div>
  </nav>
</template>
