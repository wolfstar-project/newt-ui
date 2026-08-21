<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  provide,
  ref,
  watch,
  type HTMLAttributes,
} from "vue"

import { cn } from "@/lib/utils"

import { TOAST_INJECTION_KEY, toastVariants, type ToastVariants } from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    variant?: ToastVariants["variant"]
    /** Auto-dismiss after this many ms. 0 disables. */
    duration?: number
    open?: boolean
  }>(),
  { variant: "success", duration: 5000, open: undefined }
)

const emit = defineEmits<{ (e: "update:open", value: boolean): void }>()

const internalOpen = ref(true)
const isControlled = computed(() => props.open !== undefined)
const isOpen = computed(() =>
  isControlled.value ? props.open : internalOpen.value
)

function close() {
  if (!isControlled.value) internalOpen.value = false
  emit("update:open", false)
}

let timer: ReturnType<typeof setTimeout> | undefined
function arm() {
  if (timer) clearTimeout(timer)
  timer = undefined
  if (isOpen.value && props.duration > 0)
    timer = setTimeout(close, props.duration)
}
watch([isOpen, () => props.duration], arm, { immediate: true })
onBeforeUnmount(() => timer && clearTimeout(timer))

provide(TOAST_INJECTION_KEY, {
  variant: computed(() => props.variant ?? "success"),
  close,
})
</script>

<template>
  <div
    v-if="isOpen"
    role="status"
    aria-live="polite"
    :data-variant="props.variant"
    :class="cn(toastVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </div>
</template>
