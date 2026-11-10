<script setup lang="ts">
import { ref, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * A text field that keeps what was typed as chips. Enter or a comma commits
 * the text, Backspace in an empty field takes the last chip back, and a
 * pasted list is split on commas and new lines. A duplicate is dropped
 * rather than added twice. Attributes other than `class` land on the input.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Stop accepting tags once the list is this long. */
    max?: number
    invalid?: boolean
    disabled?: boolean
    /** The accessible name of a tag's remove button. */
    removeLabel?: (tag: string) => string
  }>(),
  {
    invalid: false,
    disabled: false,
    removeLabel: (tag: string) => `Remove ${tag}`,
  }
)

const tags = defineModel<readonly string[]>({ default: () => [] })

const text = ref("")
const inner = ref<HTMLInputElement | null>(null)

function add(candidates: readonly string[]) {
  const next = [...tags.value]
  for (const candidate of candidates) {
    const tag = candidate.trim()
    if (tag === "" || next.includes(tag)) continue
    if (props.max !== undefined && next.length >= props.max) break
    next.push(tag)
  }
  if (next.length !== tags.value.length) tags.value = next
}

function remove(tag: string) {
  tags.value = tags.value.filter((each) => each !== tag)
  inner.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" || event.key === ",") {
    event.preventDefault()
    add([text.value])
    text.value = ""
  } else if (
    event.key === "Backspace" &&
    text.value === "" &&
    tags.value.length > 0
  ) {
    tags.value = tags.value.slice(0, -1)
  }
}

function onPaste(event: ClipboardEvent) {
  const pasted = event.clipboardData?.getData("text") ?? ""
  if (!/[,\n]/.test(pasted)) return
  event.preventDefault()
  add(pasted.split(/[,\n]/))
}

function onWrapperClick(event: MouseEvent) {
  if (event.target === event.currentTarget) inner.value?.focus()
}
</script>

<template>
  <!--
    The wrapper is drawn as the field; a click anywhere in it is a click on
    the input, which is the only thing in it a keyboard reaches first.
  -->
  <div
    :data-invalid="props.invalid ? true : undefined"
    :class="
      cn(
        'flex min-h-[42px] w-full cursor-text flex-wrap items-center gap-1.5 rounded-sm border border-newt-border bg-newt-bg-input px-2 py-1.5 transition-colors duration-fast ease-newt focus-within:border-newt-brand data-[invalid]:border-newt-danger group-data-[invalid]/field:border-newt-danger',
        props.disabled && 'cursor-not-allowed opacity-50',
        props.class
      )
    "
    @click="onWrapperClick"
  >
    <span
      v-for="tag in tags"
      :key="tag"
      class="inline-flex max-w-full items-center gap-1 rounded-sm bg-newt-bg-active py-[3px] pe-1 ps-2 text-[13px] font-medium leading-[18px] text-newt-text-primary"
    >
      <span class="truncate">{{ tag }}</span>
      <button
        type="button"
        :disabled="props.disabled"
        :aria-label="props.removeLabel(tag)"
        class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-newt-text-muted hover:bg-newt-danger hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-newt-text-link"
        @click="remove(tag)"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" class="h-3 w-3">
          <path
            fill="currentColor"
            d="M4.3 4.3a1 1 0 0 1 1.4 0L8 6.6l2.3-2.3a1 1 0 1 1 1.4 1.4L9.4 8l2.3 2.3a1 1 0 0 1-1.4 1.4L8 9.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L6.6 8 4.3 5.7a1 1 0 0 1 0-1.4Z"
          />
        </svg>
      </button>
    </span>
    <input
      v-bind="$attrs"
      ref="inner"
      v-model="text"
      type="text"
      :disabled="props.disabled"
      :aria-invalid="props.invalid ? true : undefined"
      class="min-w-20 flex-1 border-0 bg-transparent px-1 py-[3px] font-sans text-sm leading-[18px] text-newt-text-primary placeholder:text-newt-text-muted focus:outline-none disabled:cursor-not-allowed"
      @keydown="onKeydown"
      @paste="onPaste"
    />
  </div>
</template>
