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

const props = defineProps<
  DialogContentProps & {
    class?: HTMLAttributes["class"]
    /**
     * The element the overlay and panel are portalled into. Defaults to
     * `body`. A modal opened below a `DirectionProvider` or a themed wrapper
     * passes that element, so it keeps the direction and the palette.
     */
    container?: string | HTMLElement
  }
>()
const emits = defineEmits<DialogContentEmits>()

const delegated = computed(() => {
  const { class: _class, container: _container, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DialogPortal :to="props.container">
    <DialogOverlay class="fixed inset-0 z-[100] bg-newt-overlay" />
    <DialogContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'fixed start-1/2 top-1/2 z-[100] w-[440px] max-w-[90vw] -translate-y-1/2 translate-x-[calc(var(--newt-dir)*-50%)] rounded-lg bg-newt-bg-elevated shadow-elevation-high outline-none',
          props.class
        )
      "
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
