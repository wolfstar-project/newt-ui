<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!-- Card that stacks `<AppLauncherItem>` rows behind one rounded surface. -->
  <div
    :class="
      cn(
        'flex flex-col overflow-hidden rounded-md bg-newt-bg-elevated',
        '[&>*+*]:border-t [&>*+*]:border-newt-border',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
