<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useId,
  watch,
  type HTMLAttributes,
} from "vue"

import { cn } from "@/lib/utils"

import { MODAL_CONTEXT_KEY } from "."
import { containTab, tabbablesIn } from "./focus"

/*
 * While open the dialog takes focus (its first control, or itself when it has
 * none), keeps Tab and Shift+Tab inside, and on close returns focus to the
 * element that held it when it opened.
 */

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

/** Use `v-model:open` to control visibility. */
const open = defineModel<boolean>("open", { default: false })

const titleId = useId()
const dialog = ref<HTMLElement | null>(null)
/** The element focused when the modal opened, focused again on close. */
let returnTo: HTMLElement | null = null
/**
 * The element that held focus as `open` turned true, read before the dialog
 * mounts: once it has, a child that focuses itself would hide the opener.
 * A `sync` watcher never runs during SSR, since `open` does not change there.
 */
let opener: HTMLElement | null = null
watch(
  open,
  (isOpen) => {
    const active = isOpen ? document.activeElement : null
    opener = active instanceof HTMLElement ? active : null
  },
  { flush: "sync" }
)

function close() {
  open.value = false
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape") close()
  else if (e.key === "Tab" && dialog.value) containTab(e, dialog.value)
}

function takeFocus() {
  const element = dialog.value
  if (!element) return
  const active = document.activeElement
  const inside = active instanceof Node && element.contains(active)
  /* Mounted already open, there was no change to read; the element holding
   * focus now is the best guess. */
  returnTo =
    opener ?? (active instanceof HTMLElement && !inside ? active : null)
  opener = null
  /* A child that focused itself keeps focus. */
  if (!inside) {
    const target = tabbablesIn(element)[0] ?? element
    target.focus()
  }
}

function returnFocus() {
  const target = returnTo
  returnTo = null
  if (target?.isConnected) target.focus()
}

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) close()
}

// `onMounted` only ever runs in the browser (Vue skips it during SSR), so
// registering the watcher from inside it keeps `document` access client-only
// without probing for it at runtime.
onMounted(() => {
  watch(
    open,
    (isOpen) => {
      if (isOpen) {
        document.addEventListener("keydown", onKeyDown)
        takeFocus()
      } else {
        document.removeEventListener("keydown", onKeyDown)
        returnFocus()
      }
    },
    /* `post`, so the dialog is in the DOM before it takes focus. */
    { immediate: true, flush: "post" }
  )
})

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeyDown)
  returnFocus()
})

provide(MODAL_CONTEXT_KEY, { close, titleId })
</script>

<template>
  <div
    v-if="open"
    data-state="open"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-newt-overlay"
    @click="onOverlayClick"
  >
    <div
      ref="dialog"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      tabindex="-1"
      :class="
        cn(
          'w-[440px] max-w-[90vw] rounded-lg bg-newt-bg-elevated shadow-elevation-high outline-none',
          props.class
        )
      "
    >
      <slot />
    </div>
  </div>
</template>
