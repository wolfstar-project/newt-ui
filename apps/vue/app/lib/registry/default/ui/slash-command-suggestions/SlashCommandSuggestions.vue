<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!--
    The picker that opens above the composer once a message starts with `/`.
    Focus stays in the composer: wire `aria-activedescendant` on the input to
    the id of the active option rather than moving focus into the list.
  -->
  <div
    :class="
      cn(
        'flex max-h-80 w-full max-w-[640px] overflow-hidden rounded-lg bg-newt-bg-floating text-newt-text-primary shadow-elevation-high',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
