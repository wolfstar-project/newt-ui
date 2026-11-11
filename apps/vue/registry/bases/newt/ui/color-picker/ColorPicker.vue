<script setup lang="ts">
import { computed, useId, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { defaultSwatches, type ColorSwatch } from "."

/*
 * A short palette and one way out of it. The swatches are a real radio set,
 * so the arrow keys move between them and a form posts the chosen value; the
 * larger tile is the browser's own colour dialog for anything the palette
 * does not hold, and it wears the colour whenever the value is not a swatch.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    swatches?: readonly ColorSwatch[]
    /** Show the tile that opens the browser's own colour dialog. */
    allowCustom?: boolean
    /** Accessible name for the group. */
    label?: string
    /** Accessible name for the custom tile. */
    customLabel?: string
    /** Shared `name` for the radios. One is generated when it is not given. */
    name?: string
    disabled?: boolean
  }>(),
  {
    swatches: () => defaultSwatches,
    allowCustom: true,
    label: "Colour",
    customLabel: "Custom colour",
    disabled: false,
  }
)

const model = defineModel<string>()

const HEX = /^#[0-9a-f]{6}$/i
const generated = useId()

const current = computed(() =>
  (model.value ?? props.swatches[0]?.value ?? "").toLowerCase()
)
const isCustom = computed(
  () =>
    !props.swatches.some(
      (swatch) => swatch.value.toLowerCase() === current.value
    )
)

function onCustom(event: Event) {
  if (event.target instanceof HTMLInputElement) model.value = event.target.value
}
</script>

<template>
  <div
    role="group"
    :aria-label="props.label"
    :class="
      cn(
        'inline-flex items-stretch gap-2.5',
        props.disabled && 'pointer-events-none opacity-50',
        props.class
      )
    "
  >
    <label
      v-if="props.allowCustom"
      :data-active="isCustom ? true : undefined"
      class="relative flex min-h-[54px] w-[66px] cursor-pointer items-start justify-end rounded-sm border border-newt-border bg-newt-bg-input p-1 text-newt-on-accent focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-newt-text-link data-[active]:border-newt-text-primary data-[active]:ring-1 data-[active]:ring-newt-text-primary"
      :style="isCustom ? { backgroundColor: current } : undefined"
    >
      <input
        type="color"
        :aria-label="props.customLabel"
        :disabled="props.disabled"
        :value="HEX.test(current) ? current : '#000000'"
        class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        @input="onCustom"
      />
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        class="h-3.5 w-3.5 drop-shadow-[0_0_1px_rgb(0_0_0/0.7)]"
      >
        <path
          fill="currentColor"
          d="M13.4 2.6a2 2 0 0 0-2.8 0L9 4.2l-.3-.3a1 1 0 0 0-1.4 1.4l.3.3-4.3 4.3a1 1 0 0 0-.3.7V13h2.4a1 1 0 0 0 .7-.3l4.3-4.3.3.3a1 1 0 0 0 1.4-1.4l-.3-.3 1.6-1.6a2 2 0 0 0 0-2.8ZM5 11.6H4.4V11L8.6 6.8l.6.6L5 11.6Z"
        />
      </svg>
    </label>
    <div class="grid grid-cols-[repeat(5,1.5rem)] content-center gap-1.5">
      <label
        v-for="swatch in props.swatches"
        :key="swatch.value"
        class="group relative block cursor-pointer"
      >
        <input
          type="radio"
          class="peer sr-only"
          :name="props.name ?? generated"
          :value="swatch.value"
          :disabled="props.disabled"
          :checked="swatch.value.toLowerCase() === current"
          @change="model = swatch.value"
        />
        <span
          aria-hidden="true"
          class="flex h-6 w-6 items-center justify-center rounded-sm text-newt-on-accent transition-transform duration-fast ease-newt group-hover:scale-110 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-newt-text-link"
          :style="{ backgroundColor: swatch.value }"
        >
          <svg
            viewBox="0 0 16 16"
            class="h-4 w-4 scale-0 drop-shadow-[0_0_1px_rgb(0_0_0/0.7)] transition-transform duration-fast ease-newt group-has-[:checked]:scale-100"
          >
            <path
              fill="currentColor"
              d="M6.2 11.6 3.1 8.5a1 1 0 0 1 1.4-1.4l1.7 1.7 4.3-4.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0Z"
            />
          </svg>
        </span>
        <span class="sr-only">{{ swatch.label }}</span>
      </label>
    </div>
  </div>
</template>
