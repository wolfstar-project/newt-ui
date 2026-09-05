<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Channel the message goes to; drives the placeholder and the labels. */
    channelName: string
    placeholder?: string
    /** Wire the input up as a combobox for slash-command autocomplete. */
    autocomplete?: boolean
    ariaControls?: string
    ariaExpanded?: boolean
    ariaActivedescendant?: string
  }>(),
  { autocomplete: false }
)

const emit = defineEmits<{
  submit: [value: string]
  escape: []
  /** Arrow keys, for driving a suggestion list above the composer. */
  navigate: [direction: "up" | "down"]
  add: []
}>()

const text = defineModel<string>({ default: "" })

const label = computed(
  () => props.placeholder ?? `Message #${props.channelName}`
)
const hasValue = computed(() => text.value.trim().length > 0)

const composerButton =
  "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 text-inherit hover:bg-newt-bg-hover hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50"

function submit() {
  if (!hasValue.value) return
  emit("submit", text.value)
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "Enter":
      event.preventDefault()
      submit()
      return
    case "Escape":
      event.preventDefault()
      emit("escape")
      return
    case "ArrowUp":
    case "ArrowDown":
      event.preventDefault()
      emit("navigate", event.key === "ArrowUp" ? "up" : "down")
  }
}
</script>

<template>
  <div
    role="group"
    :aria-label="`Message composer for #${props.channelName}`"
    :class="
      cn(
        'flex min-h-11 min-w-0 items-center gap-2 rounded-md border border-newt-border bg-newt-bg-input-elevated px-4 text-newt-text-muted',
        props.class
      )
    "
  >
    <button
      type="button"
      aria-label="Add attachment"
      :class="composerButton"
      @click="emit('add')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5">
        <path
          fill="currentColor"
          d="M11 5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6z"
        />
      </svg>
    </button>
    <div class="flex min-w-0 flex-1 items-center gap-2">
      <input
        v-model="text"
        type="text"
        :placeholder="label"
        :aria-label="label"
        :spellcheck="false"
        :role="props.autocomplete ? 'combobox' : undefined"
        :autocomplete="props.autocomplete ? 'off' : undefined"
        :aria-controls="props.autocomplete ? props.ariaControls : undefined"
        :aria-expanded="props.autocomplete ? props.ariaExpanded : undefined"
        :aria-activedescendant="
          props.autocomplete ? props.ariaActivedescendant : undefined
        "
        class="w-full border-0 bg-transparent font-sans text-[15px] text-newt-text-primary outline-none placeholder:text-newt-text-muted"
        @keydown="onKeydown"
      />
    </div>
    <slot name="actions" />
    <button
      type="button"
      aria-label="Send message"
      :disabled="!hasValue"
      :class="cn(composerButton, hasValue && 'text-newt-brand')"
      @click="submit"
    >
      <!-- The send control only lights up once there is something to send. -->
      <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5">
        <path fill="currentColor" d="M3 20.5v-6l8-2.5-8-2.5v-6l19 8.5z" />
      </svg>
    </button>
  </div>
</template>
