<script setup lang="ts">
import { onMounted, provide, ref, useId, watch, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { drawerKey } from "."

/*
 * A panel that comes in from the edge and keeps the page behind it in view.
 * It is a native `<dialog>` opened with `showModal()`: it sits in the top
 * layer, holds focus inside itself, makes the page behind it inert and
 * answers Escape, with no focus-trap code of its own.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** The edge it sits against. `end` is the right in left-to-right text. */
    side?: "end" | "start" | "bottom"
  }>(),
  { side: "end" }
)

/** Use `v-model:open` to control visibility. */
const open = defineModel<boolean>("open", { default: false })

const dialog = ref<HTMLDialogElement | null>(null)
const titleId = useId()

const SIDE = {
  end: "inset-y-0 end-0 start-auto h-full w-[380px] max-w-[90vw] border-s",
  start: "inset-y-0 start-0 end-auto h-full w-[380px] max-w-[90vw] border-e",
  bottom:
    "inset-x-0 bottom-0 top-auto h-auto max-h-[85vh] w-full max-w-none border-t",
} as const

function close() {
  open.value = false
}

/* The dialog's own box, outside its content, is the backdrop. */
function onClick(event: MouseEvent) {
  if (event.target === event.currentTarget) close()
}

// `showModal` needs the element, so the watcher starts once it is mounted.
onMounted(() => {
  watch(
    open,
    (isOpen) => {
      const element = dialog.value
      if (element === null) return
      if (isOpen && !element.open) element.showModal()
      else if (!isOpen && element.open) element.close()
    },
    { immediate: true }
  )
})

provide(drawerKey, { close, titleId })
</script>

<template>
  <dialog
    ref="dialog"
    :aria-labelledby="titleId"
    :data-side="props.side"
    :class="
      cn(
        'fixed m-0 max-h-none flex-col border-newt-border bg-newt-bg-elevated p-0 text-newt-text-primary shadow-elevation-high backdrop:bg-newt-overlay open:flex',
        SIDE[props.side],
        props.class
      )
    "
    @click="onClick"
    @cancel.prevent="close"
    @close="close"
  >
    <slot />
  </dialog>
</template>
