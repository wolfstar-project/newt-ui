<script setup lang="ts">
import {
  onBeforeUnmount,
  provide,
  useId,
  watch,
  type HTMLAttributes,
} from "vue"

import { cn } from "@/lib/utils"

import { MODAL_CONTEXT_KEY } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

/** Use `v-model:open` to control visibility. */
const open = defineModel<boolean>("open", { default: false })

const titleId = useId()

function close() {
  open.value = false
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape") close()
}

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) close()
}

watch(
  open,
  (isOpen) => {
    if (typeof document === "undefined") return
    if (isOpen) document.addEventListener("keydown", onKeyDown)
    else document.removeEventListener("keydown", onKeyDown)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (typeof document !== "undefined")
    document.removeEventListener("keydown", onKeyDown)
})

provide(MODAL_CONTEXT_KEY, { close, titleId })
</script>

<template>
  <div
    v-if="open"
    data-state="open"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
    @click="onOverlayClick"
  >
    <div
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :class="
        cn(
          'w-[440px] max-w-[90vw] rounded-lg bg-newt-bg-elevated shadow-elevation-high',
          props.class
        )
      "
    >
      <slot />
    </div>
  </div>
</template>
