<script setup lang="ts">
import { computed, shallowRef, useId, useTemplateRef, watch } from "vue"

import {
  expressionsPickerVariants,
  type ExpressionItem,
  type ExpressionKind,
} from "."
import ExpressionResults from "./ExpressionResults.vue"

const props = withDefaults(
  defineProps<{
    items?: readonly ExpressionItem[]
    label?: string
    disabled?: boolean
  }>(),
  { items: () => [], label: "Choose an expression", disabled: false }
)
const emit = defineEmits<{ select: [item: ExpressionItem] }>()
const id = useId()
const dialog = useTemplateRef<HTMLDialogElement>("dialog")
const trigger = useTemplateRef<HTMLButtonElement>("trigger")
const search = useTemplateRef<HTMLInputElement>("search")
const open = shallowRef(false)
const kind = shallowRef<ExpressionKind>("emoji")
const query = shallowRef("")
const kinds: { kind: ExpressionKind; label: string }[] = [
  { kind: "emoji", label: "Emoji" },
  { kind: "sticker", label: "Stickers" },
  { kind: "gif", label: "GIFs" },
]
const visible = computed(() =>
  props.items.filter(
    (item) =>
      item.kind === kind.value &&
      [item.label, ...(item.keywords ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(query.value.trim().toLowerCase())
  )
)
function close() {
  dialog.value?.close()
}
function show() {
  if (props.disabled) return
  query.value = ""
  dialog.value?.showModal()
  open.value = true
  search.value?.focus()
}
function closed() {
  open.value = false
  trigger.value?.focus()
}
function select(item: ExpressionItem) {
  close()
  emit("select", item)
}
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) close()
  }
)
function trapFocus(event: KeyboardEvent) {
  if (event.key !== "Tab" || !dialog.value) return
  const controls = [
    ...dialog.value.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), [tabindex="0"]'
    ),
  ].filter(
    (element) => element.tabIndex >= 0 && element.getClientRects().length > 0
  )
  const first = controls[0]
  const last = controls[controls.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

function tabKey(event: KeyboardEvent, index: number) {
  if (!(event.currentTarget instanceof HTMLElement)) return
  const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
  const step =
    event.key === "ArrowRight"
      ? rtl
        ? -1
        : 1
      : event.key === "ArrowLeft"
        ? rtl
          ? 1
          : -1
        : 0
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? 2
        : step
          ? (index + step + 3) % 3
          : -1
  const nextTab = kinds[next]
  if (!nextTab) return
  event.preventDefault()
  kind.value = nextTab.kind
  dialog.value
    ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    .item(next)
    ?.focus()
}
</script>
<template>
  <div class="inline-block">
    <button
      ref="trigger"
      type="button"
      :disabled="disabled"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-controls="id"
      :class="expressionsPickerVariants()"
      @click="show"
    >
      {{ label }}
    </button>
    <dialog
      :id="id"
      ref="dialog"
      :aria-label="label"
      class="m-auto box-border w-[var(--newt-expressions-width)] max-w-[calc(100%-2*var(--newt-space-3))] max-h-[calc(100dvh-2*var(--newt-space-3))] overflow-y-auto rounded-lg border border-newt-border bg-newt-bg-floating p-[var(--newt-space-3)] font-sans text-[length:var(--newt-font-size-sm)] leading-[var(--newt-line-height-normal)] text-newt-text-primary shadow-elevation-high backdrop:bg-newt-bg-base/80"
      @close="closed"
      @keydown="trapFocus"
    >
      <div class="grid gap-[var(--newt-space-3)]">
        <div
          class="flex items-center justify-between gap-[var(--newt-space-2)]"
        >
          <strong>{{ label }}</strong>
          <button
            type="button"
            aria-label="Close expressions picker"
            :class="expressionsPickerVariants()"
            @click="close"
          >
            ×
          </button>
        </div>
        <div
          role="tablist"
          aria-label="Expression type"
          class="flex items-center justify-between gap-[var(--newt-space-2)]"
        >
          <button
            v-for="(tab, index) in kinds"
            :id="`${id}-${tab.kind}`"
            :key="tab.kind"
            type="button"
            role="tab"
            :aria-selected="kind === tab.kind"
            :aria-controls="`${id}-results`"
            :tabindex="kind === tab.kind ? 0 : -1"
            :class="expressionsPickerVariants({ selected: kind === tab.kind })"
            @click="kind = tab.kind"
            @keydown="tabKey($event, index)"
          >
            {{ tab.label }}
          </button>
        </div>
        <label class="grid gap-[var(--newt-space-3)]"
          >Search expressions
          <input
            ref="search"
            v-model="query"
            type="search"
            placeholder="Search by name or keyword"
            class="box-border min-h-[var(--newt-expressions-target-size)] w-full rounded-sm border border-newt-border bg-newt-bg-input p-[var(--newt-space-2)] font-sans text-[length:var(--newt-font-size-sm)] leading-[var(--newt-line-height-normal)] text-newt-text-primary placeholder:text-newt-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"
          />
        </label>
        <div
          :id="`${id}-results`"
          role="tabpanel"
          :aria-labelledby="`${id}-${kind}`"
          tabindex="0"
          class="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"
        >
          <ExpressionResults
            :items="visible"
            :disabled="disabled"
            @select="select"
          />
        </div>
        <p role="status" class="m-0 text-newt-text-secondary">
          {{
            visible.length
              ? `${visible.length} expressions`
              : "No expressions found. Try another search or type."
          }}
        </p>
      </div>
    </dialog>
  </div>
</template>
