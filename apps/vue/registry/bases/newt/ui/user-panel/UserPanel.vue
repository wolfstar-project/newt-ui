<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * The strip at the foot of a sidebar: who you are signed in as, and the two
 * or three controls that follow you everywhere. Put the avatar first, then
 * `UserPanelInfo`, then `UserPanelActions`. An `aria-label` passed to it
 * replaces the default name of the region.
 */
const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <section
    aria-label="User controls"
    :class="
      cn(
        'flex w-full items-center gap-2 rounded-md bg-newt-bg-base p-2',
        props.class
      )
    "
  >
    <slot />
  </section>
</template>
