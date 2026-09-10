<script setup lang="ts">
import { ref, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * The drop zone a modal asks for a file with. Two ways in, because a drop is
 * not available to everyone: dragging files onto it, and a `browse` control
 * that opens the same picker from the keyboard.
 *
 * The file input stays in the DOM rather than being replaced by a button —
 * it is the accessible name, the keyboard path and the picker all at once.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Accepted types, passed straight to the input. */
    accept?: string
    /** Whether more than one file can be chosen at a time. */
    multiple?: boolean
    disabled?: boolean
    /** The line under the prompt: how many, how large. */
    hint?: string
  }>(),
  { multiple: false, disabled: false }
)

const emit = defineEmits<{ (e: "files", value: readonly File[]): void }>()

const dragging = ref(false)

function take(list: FileList | null) {
  if (list === null || list.length === 0) return
  emit("files", Array.from(list))
}

function onDragOver(event: DragEvent) {
  if (props.disabled) return
  event.preventDefault()
  dragging.value = true
}

function onDrop(event: DragEvent) {
  if (props.disabled) return
  event.preventDefault()
  dragging.value = false
  take(event.dataTransfer?.files ?? null)
}

function onChange(event: Event) {
  // SAFETY: the handler is bound to the file input below, so the target is
  // that input and nothing else can raise this event.
  take((event.target as HTMLInputElement).files)
}
</script>

<template>
  <div
    :data-dragging="dragging ? true : undefined"
    :data-disabled="props.disabled ? true : undefined"
    :class="
      cn(
        'flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-newt-border bg-newt-bg-base px-4 py-6 text-center',
        'transition-colors duration-fast ease-newt',
        'data-[dragging]:border-newt-brand data-[dragging]:bg-newt-bg-surface',
        'focus-within:border-newt-brand',
        props.disabled && 'cursor-not-allowed opacity-50',
        props.class
      )
    "
    @dragover="onDragOver"
    @dragleave="dragging = false"
    @drop="onDrop"
  >
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      class="h-6 w-6 text-newt-text-muted"
    >
      <path
        fill="currentColor"
        d="M12 3a1 1 0 0 1 .7.3l4 4a1 1 0 1 1-1.4 1.4L13 6.42V15a1 1 0 1 1-2 0V6.41L8.71 8.71a1 1 0 0 1-1.42-1.42l4-4A1 1 0 0 1 12 3ZM5 15a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2a1 1 0 1 1 2 0v2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-2a1 1 0 0 1 1-1Z"
      />
    </svg>

    <p class="text-sm text-newt-text-secondary">
      Drop files here or
      <!--
        The label is the control: clicking the word opens the picker, and the
        input keeps the focus ring and the keyboard behaviour it was born with.
      -->
      <label
        class="cursor-pointer text-newt-text-link underline-offset-2 hover:underline"
      >
        browse
        <input
          type="file"
          :accept="props.accept"
          :multiple="props.multiple"
          :disabled="props.disabled"
          class="sr-only"
          @change="onChange"
        />
      </label>
    </p>

    <p v-if="props.hint" class="text-xs text-newt-text-muted">
      {{ props.hint }}
    </p>
  </div>
</template>
