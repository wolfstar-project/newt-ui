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
 * measuring. Escape and a press anywhere outside close it; if focus was inside
 * when Escape closed it, focus goes back to the trigger.
 */
const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

/** Use `v-model:open` to control it; without one the popover owns its state. */
const open = defineModel<boolean>("open", { default: false })

const id = useId()

function root(): Element | null {
  return document.querySelector(`[data-popover="${id}"]`)
}

function onPointerDown(event: PointerEvent) {
  const inside = event.target instanceof Node && root()?.contains(event.target)
  if (!inside) open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape" || event.defaultPrevented) return
  /* Handled here, so an enclosing dialog does not close as well. */
  event.preventDefault()
  const focusInside = root()?.contains(document.activeElement)
  open.value = false
  /* Focus goes back to the trigger only if it would otherwise be lost. */
  if (focusInside) {
    root()?.querySelector<HTMLElement>("[data-popover-trigger]")?.focus()
  }
}

/*
 * Both listeners sit on the document while the popover is open. Escape has to
 * work wherever focus is: some browsers do not focus a button on click, and a
 * click on the panel's text leaves focus on the body.
 */
function listen(on: boolean) {
  const change = on ? "addEventListener" : "removeEventListener"
  document[change]("pointerdown", onPointerDown)
  document[change]("keydown", onKeydown)
}

// `onMounted` only runs in the browser, which keeps `document` client-only.
onMounted(() => {
  watch(open, (isOpen) => listen(isOpen), { immediate: true })
})

onBeforeUnmount(() => listen(false))

provide(popoverKey, { open, id })
</script>

<template>
  <div
    :data-popover="id"
    :data-state="open ? 'open' : 'closed'"
    :class="cn('relative inline-flex', props.class)"
  >
    <slot />
  </div>
</template>
