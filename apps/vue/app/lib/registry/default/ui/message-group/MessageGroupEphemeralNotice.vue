<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<!--
  The "only you can see this" footer Discord shows under an ephemeral reply.
  Slot content replaces the copy; the dismiss control is the caller's.
-->
<template>
  <div
    role="status"
    :class="
      cn(
        'mt-1.5 flex items-center gap-1 text-[13px] text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
