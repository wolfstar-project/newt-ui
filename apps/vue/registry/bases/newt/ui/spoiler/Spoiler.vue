<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { computed, ref, watch } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Controlled revealed state (use with v-model:revealed). */
    revealed?: boolean
    /** Initial revealed state when uncontrolled. */
    defaultRevealed?: boolean
    /**
     * Accessible name while hidden, read in place of the content it hides.
     * Defaults to `"Spoiler, click to reveal"`; pass a translated string.
     */
    label?: string
  }>(),
  {
    revealed: undefined,
    defaultRevealed: false,
    label: "Spoiler, click to reveal",
  }
)

const emit = defineEmits<{ (e: "update:revealed", value: boolean): void }>()

const internal = ref(props.revealed ?? props.defaultRevealed)
watch(
  () => props.revealed,
  (v) => {
    if (v !== undefined) internal.value = v
  }
)
const isRevealed = computed(() =>
  props.revealed !== undefined ? props.revealed : internal.value
)

function toggle() {
  const next = !isRevealed.value
  if (props.revealed === undefined) internal.value = next
  emit("update:revealed", next)
}

function onKeydown(event: KeyboardEvent) {
  if (isRevealed.value) return
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    toggle()
  }
}
</script>

<template>
  <span
    :role="isRevealed ? undefined : 'button'"
    :tabindex="isRevealed ? undefined : 0"
    :aria-label="isRevealed ? undefined : props.label"
    :aria-expanded="isRevealed"
    :data-state="isRevealed ? 'revealed' : 'hidden'"
    :class="
      cn(
        'rounded-sm px-1 transition-[background-color] duration-fast ease-newt',
        isRevealed
          ? 'cursor-text select-text bg-newt-bg-active text-newt-text-primary'
          : 'cursor-pointer select-none bg-newt-spoiler hover:bg-newt-spoiler-hover',
        props.class
      )
    "
    @click="toggle"
    @keydown="onKeydown"
  >
    <!--
      Hidden, the content is invisible and inert rather than painted in the
      background colour: a link, an image or a child with its own colour would
      otherwise show through, and a link could still be clicked or tabbed to.
      Both keep its box, so the chip keeps the size of what it hides.
    -->
    <span :inert="!isRevealed" :class="isRevealed ? undefined : 'invisible'"
      ><slot
    /></span>
  </span>
</template>
