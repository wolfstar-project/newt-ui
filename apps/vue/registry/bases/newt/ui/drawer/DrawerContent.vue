<script setup lang="ts">
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
  type DialogContentEmits,
  type DialogContentProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<
    DialogContentProps & {
      class?: HTMLAttributes["class"]
      /** The edge it sits against. `end` is the right in left-to-right text. */
      side?: "end" | "start" | "bottom"
      /**
       * The element the overlay and panel are portalled into. Defaults to
       * `body`. A drawer opened below a `DirectionProvider` or a themed
       * wrapper passes that element, so it keeps the direction and the palette.
       */
      container?: string | HTMLElement
    }
  >(),
  { side: "end" }
)
const emits = defineEmits<DialogContentEmits>()

const SIDE = {
  end: "inset-y-0 end-0 start-auto h-full w-[380px] max-w-[90vw] border-s",
  start: "inset-y-0 start-0 end-auto h-full w-[380px] max-w-[90vw] border-e",
  bottom:
    "inset-x-0 bottom-0 top-auto h-auto max-h-[85vh] w-full max-w-none border-t",
} as const

const delegated = computed(() => {
  const { class: _class, side: _side, container: _container, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DialogPortal :to="props.container">
    <DialogOverlay class="fixed inset-0 z-[100] bg-newt-overlay" />
    <DialogContent
      v-bind="{ ...forwarded, ...$attrs }"
      :data-side="props.side"
      :class="
        cn(
          'fixed z-[100] flex flex-col border-newt-border bg-newt-bg-elevated text-newt-text-primary shadow-elevation-high outline-none',
          SIDE[props.side],
          props.class
        )
      "
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
