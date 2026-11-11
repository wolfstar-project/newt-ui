<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import type { UserPanelIcon } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  icon: UserPanelIcon
  /** The button's accessible name; it has no visible text. */
  label: string
}>()

/**
 * `v-model:pressed` makes the button a switch. On, the icon is struck through
 * as well as recoloured, so the state does not rest on colour. Without it the
 * button is a plain one and `click` is all it reports.
 */
const pressed = defineModel<boolean | undefined>("pressed", {
  default: undefined,
})

function onClick() {
  if (pressed.value !== undefined) pressed.value = !pressed.value
}
</script>

<template>
  <button
    type="button"
    :aria-label="props.label"
    :aria-pressed="pressed"
    :class="
      cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-sm text-newt-text-secondary transition-colors duration-fast ease-newt hover:bg-newt-bg-hover hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-newt-text-link aria-pressed:text-newt-danger',
        props.class
      )
    "
    @click="onClick"
  >
    <svg viewBox="0 0 16 16" aria-hidden="true" class="h-[18px] w-[18px]">
      <template v-if="props.icon === 'microphone'">
        <path
          fill="currentColor"
          d="M8 1.5a2 2 0 0 0-2 2v4a2 2 0 0 0 4 0v-4a2 2 0 0 0-2-2Z"
        />
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          d="M3.5 7.5a4.5 4.5 0 0 0 9 0M8 12v2.5"
        />
      </template>
      <template v-else-if="props.icon === 'headphones'">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          d="M2.75 9.5V8a5.25 5.25 0 0 1 10.5 0v1.5"
        />
        <rect x="2" y="9" width="3" height="5" rx="1" fill="currentColor" />
        <rect x="11" y="9" width="3" height="5" rx="1" fill="currentColor" />
      </template>
      <template v-else>
        <circle
          cx="8"
          cy="8"
          r="5.2"
          fill="none"
          stroke="currentColor"
          stroke-width="2.6"
          stroke-dasharray="2.2 1.88"
        />
        <circle
          cx="8"
          cy="8"
          r="2.4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        />
      </template>
      <path
        v-if="pressed === true"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        d="M2.5 2.5l11 11"
      />
    </svg>
  </button>
</template>
