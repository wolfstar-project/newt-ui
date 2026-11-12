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
  DialogContentProps & { class?: HTMLAttributes["class"] }
>()
const emits = defineEmits<DialogContentEmits>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DialogPortal>
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
