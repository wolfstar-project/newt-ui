<script setup lang="ts">
import type { ButtonHTMLAttributes, HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

import { type ButtonVariants, buttonVariants } from "."

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariants["variant"]
    size?: ButtonVariants["size"]
    type?: ButtonHTMLAttributes["type"]
    disabled?: boolean
    class?: HTMLAttributes["class"]
    /** Emoji image URL, rendered before the label. */
    emoji?: string
    /** Accessible name for `emoji`; empty (the default) hides it from readers. */
    emojiAlt?: string
    /** Link-out glyph after the label. Defaults on for `variant="link"`. */
    launchIcon?: boolean
  }>(),
  { type: "button", emojiAlt: "" }
)

const showLaunch = computed(() => props.launchIcon ?? props.variant === "link")
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="
      cn(
        buttonVariants({ variant: props.variant, size: props.size }),
        props.class
      )
    "
  >
    <img
      v-if="props.emoji"
      :src="props.emoji"
      :alt="props.emojiAlt"
      :aria-hidden="props.emojiAlt === '' ? true : undefined"
      :draggable="false"
      class="h-[1.375em] w-[1.375em] shrink-0 object-contain align-bottom"
    />
    <span class="truncate"><slot /></span>
    <!-- The "opens elsewhere" glyph Discord puts on link buttons. -->
    <svg
      v-if="showLaunch"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      class="h-4 w-4 shrink-0"
    >
      <path
        fill="currentColor"
        d="M10 5a1 1 0 0 0 0 2h6.59L4.3 19.3a1 1 0 1 0 1.4 1.4L18 8.42V15a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1h-9Z"
      />
    </svg>
  </button>
</template>
