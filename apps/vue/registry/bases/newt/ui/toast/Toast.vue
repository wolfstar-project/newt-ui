<script setup lang="ts">
import {
  ToastRoot,
  useForwardPropsEmits,
  type ToastRootEmits,
  type ToastRootProps,
} from "reka-ui"
import { computed, provide, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { TOAST_INJECTION_KEY, toastVariants, type ToastVariants } from "."

/*
 * Use `v-model:open` to control it. `duration` is the time in ms before it
 * dismisses itself: it defaults to the provider's `duration`, which is 5000,
 * and 0 disables it. `background` announces politely; `foreground` interrupts.
 */
const props = withDefaults(
  defineProps<
    ToastRootProps & {
      class?: HTMLAttributes["class"]
      variant?: ToastVariants["variant"]
    }
  >(),
  { variant: "success", type: "background" }
)
const emits = defineEmits<ToastRootEmits>()

const delegated = computed(() => {
  const { class: _class, variant: _variant, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)

provide(TOAST_INJECTION_KEY, {
  variant: computed(() => props.variant ?? "success"),
})
</script>

<template>
  <ToastRoot
    v-bind="forwarded"
    :data-variant="props.variant ?? 'success'"
    :class="cn(toastVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </ToastRoot>
</template>
