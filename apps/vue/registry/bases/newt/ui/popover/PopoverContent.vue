<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { popoverKey } from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Which side of the trigger the panel opens on. */
    side?: "bottom" | "top"
    /** Which edge of the trigger the panel lines up with. */
    align?: "start" | "center" | "end"
  }>(),
  { side: "bottom", align: "start" }
)

const popover = inject(popoverKey)
if (popover === undefined) {
  throw new Error("<PopoverContent> must be used inside a <Popover>.")
}

const SIDE = {
  bottom: "top-[calc(100%+8px)]",
  top: "bottom-[calc(100%+8px)]",
} as const

const ALIGN = {
  start: "start-0",
  center: "start-1/2 translate-x-[calc(var(--newt-dir)*-50%)]",
  end: "end-0",
} as const
</script>

<template>
  <div
    v-if="popover.open.value"
    :id="`${popover.id}-content`"
    role="dialog"
    :data-side="props.side"
    :data-align="props.align"
    :class="
      cn(
        'absolute z-50 flex w-[280px] max-w-[90vw] flex-col items-start gap-2 rounded-md border border-newt-border bg-newt-bg-floating p-3 text-sm leading-5 text-newt-text-secondary shadow-elevation-high',
        SIDE[props.side],
        ALIGN[props.align],
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
