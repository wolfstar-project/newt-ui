<script setup lang="ts">
import { ref } from "vue"
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
} from "~~/registry/bases/newt/ui/side-nav"

const SECTIONS = ["Overview", "Roles", "Emoji"]

const section = ref("Overview")
</script>

<template>
  <SideNav
    aria-label="Server settings"
    class="w-56 rounded-md bg-newt-bg-surface px-2"
  >
    <SideNavGroup label="Server">
      <SideNavItem
        v-for="name in SECTIONS"
        :key="name"
        :current="section === name"
        @click="section = name"
      >
        {{ name }}
      </SideNavItem>
    </SideNavGroup>
    <SideNavGroup label="Moderation">
      <SideNavItem
        :badge="12"
        :current="section === 'Audit log'"
        @click="section = 'Audit log'"
      >
        Audit log
      </SideNavItem>
    </SideNavGroup>
    <SideNavGroup>
      <SideNavItem variant="danger">Delete server</SideNavItem>
    </SideNavGroup>
  </SideNav>
</template>
