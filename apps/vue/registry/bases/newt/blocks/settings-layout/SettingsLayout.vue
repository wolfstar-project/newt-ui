<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue"
import {
  Breadcrumb,
  BreadcrumbItem,
} from "~~/registry/bases/newt/ui/breadcrumb"
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
} from "~~/registry/bases/newt/ui/side-nav"

import { cn } from "@/lib/utils"

import type { SettingsGroup } from "./types"

/*
 * A settings screen: the list of sections down the side, and the chosen
 * section's heading, breadcrumb and content beside it. The content is the
 * default slot, so each section stays an ordinary component of yours. Below
 * 40rem the navigation moves above the content.
 */
const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** What is being configured; the first crumb and the nav's name. */
  title: string
  groups: readonly SettingsGroup[]
}>()

/** The id of the section being shown. */
const section = defineModel<string>("section", { required: true })

const current = computed(() =>
  props.groups
    .flatMap((group) => group.sections)
    .find((each) => each.id === section.value)
)
</script>

<template>
  <div
    :class="
      cn('flex w-full flex-col bg-newt-bg-elevated sm:flex-row', props.class)
    "
  >
    <SideNav
      :aria-label="props.title"
      class="shrink-0 bg-newt-bg-surface px-2 sm:w-56"
    >
      <SideNavGroup
        v-for="(group, index) in props.groups"
        :key="group.label ?? index"
        :label="group.label"
      >
        <SideNavItem
          v-for="each in group.sections"
          :key="each.id"
          :badge="each.badge"
          :variant="each.danger ? 'danger' : 'default'"
          :current="each.id === section"
          @click="section = each.id"
        >
          {{ each.label }}
        </SideNavItem>
      </SideNavGroup>
    </SideNav>
    <main class="flex min-w-0 flex-1 flex-col gap-4 p-6">
      <Breadcrumb>
        <BreadcrumbItem>{{ props.title }}</BreadcrumbItem>
        <BreadcrumbItem current>{{ current?.label ?? section }}</BreadcrumbItem>
      </Breadcrumb>
      <h2 class="m-0 text-xl font-semibold leading-6 text-newt-text-primary">
        {{ current?.label ?? section }}
      </h2>
      <slot />
    </main>
  </div>
</template>
