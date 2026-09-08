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
  }>(),
  { revealed: undefined, defaultRevealed: false }
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
    :aria-label="isRevealed ? undefined : 'Spoiler, click to reveal'"
    :aria-expanded="isRevealed"
    :data-state="isRevealed ? 'revealed' : 'hidden'"
    :class="
      cn(
        'rounded-sm px-1 transition-[background-color] duration-fast ease-newt',
        isRevealed
          ? 'cursor-text select-text bg-newt-bg-active text-newt-text-primary'
          : 'cursor-pointer select-none bg-[#1a1a1e] text-transparent hover:bg-[#232328]',
        props.class
      )
    "
    @click="toggle"
    @keydown="onKeydown"
  >
    <slot />
  </span>
</template>
