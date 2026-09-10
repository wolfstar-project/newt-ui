<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * Discord groups members under each hoisted role, then Online, then Offline.
 * `offline` dims the whole group rather than every row on its own.
 */
const props = defineProps<{
  class?: HTMLAttributes["class"]
  offline?: boolean
}>()
</script>

<template>
  <section
    :data-offline="props.offline || undefined"
    :class="
      cn(
        '[&:not(:first-child)]:mt-3',
        props.offline &&
          '[&_[role=listitem]]:opacity-45 [&_[data-slot=member-name]]:text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </section>
</template>
