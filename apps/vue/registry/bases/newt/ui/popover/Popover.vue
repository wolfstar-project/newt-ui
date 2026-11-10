<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  provide,
  useId,
  watch,
  type HTMLAttributes,
} from "vue"

import { cn } from "@/lib/utils"

import { popoverKey } from "."

/*
 * A small panel that hangs off the button that opened it. The root is the
 * positioning context, so the panel follows its trigger without any
 * measuring. Escape and a press anywhere outside close it, and closing with
 * the keyboard hands focus back to the trigger.
 */
const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

/** Use `v-model:open` to control it; without one the popover owns its state. */
const open = defineModel<boolean>("open", { default: false })

const id = useId()

function onPointerDown(event: PointerEvent) {
  const inside =
    event.target instanceof Element &&
    event.target.closest(`[data-popover="${id}"]`) !== null
  if (!inside) open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape" || !open.value) return
  event.stopPropagation()
  open.value = false
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget
      .querySelector<HTMLElement>("[data-popover-trigger]")
      ?.focus()
  }
}

// `onMounted` only runs in the browser, which keeps `document` client-only.
onMounted(() => {
  watch(
    open,
    (isOpen) => {
      if (isOpen) document.addEventListener("pointerdown", onPointerDown)
      else document.removeEventListener("pointerdown", onPointerDown)
    },
    { immediate: true }
  )
})

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onPointerDown)
})

provide(popoverKey, { open, id })
</script>

<template>
  <div
    :data-popover="id"
    :data-state="open ? 'open' : 'closed'"
    :class="cn('relative inline-flex', props.class)"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
