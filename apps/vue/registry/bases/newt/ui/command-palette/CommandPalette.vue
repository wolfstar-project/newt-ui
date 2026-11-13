<script setup lang="ts">
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "reka-ui"
import { computed, nextTick, ref, useId, watch, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import type { CommandGroup, CommandItem, CommandPaletteHints } from "."

defineOptions({ inheritAttrs: false })

/*
 * A search box over a list of places to go and things to do. The shell is a
 * Reka Dialog, which owns the focus trap, Escape and outside press, scroll
 * lock, and hiding the page from screen readers. Focus never leaves the
 * input: the arrow keys move a highlight through the list, and
 * `aria-activedescendant` tells a screen reader which row that is.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /**
     * The element the overlay and panel are portalled into. Defaults to
     * `body`. A palette opened below a `DirectionProvider` or a themed
     * wrapper passes that element, so it keeps the direction and the palette.
     */
    container?: string | HTMLElement
    groups: readonly CommandGroup[]
    /** Accessible name of the dialog. */
    label?: string
    placeholder?: string
    /** Shown when the query matches nothing. */
    emptyText?: string
    /** The footer's wording. Pass `false` to leave the footer out. */
    hints?: CommandPaletteHints | false
  }>(),
  {
    label: "Command palette",
    placeholder: "Where would you like to go?",
    emptyText: "Nothing matches that.",
    hints: () => ({ move: "to move", select: "to select", close: "to close" }),
  }
)

const emit = defineEmits<{
  /** Fired with the chosen row; the palette then closes itself. */
  (e: "select", item: CommandItem): void
}>()

/** Use `v-model:open` to control visibility. */
const open = defineModel<boolean>("open", { default: false })

/* The element that had focus before the palette opened. */
let previousFocus: Element | null = null
const id = useId()
const query = ref("")
const active = ref(0)

const kbdClassName =
  "inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-newt-border bg-newt-bg-base px-1.5 font-mono text-[11px] font-semibold text-newt-text-secondary"

function matches(item: CommandItem, needle: string): boolean {
  if (needle === "") return true
  return [item.label, item.description ?? "", ...(item.keywords ?? [])].some(
    (text) => text.toLowerCase().includes(needle)
  )
}

const shown = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return props.groups
    .map((group) => ({
      label: group.label,
      items: group.items.filter((item) => matches(item, needle)),
    }))
    .filter((group) => group.items.length > 0)
})
const flat = computed(() => shown.value.flatMap((group) => group.items))
const current = computed(
  () => flat.value[Math.min(active.value, flat.value.length - 1)]
)

function optionId(item: CommandItem): string {
  return `${id}-${item.id}`
}

function close() {
  open.value = false
}

function choose(item: CommandItem) {
  emit("select", item)
  close()
}

/*
 * The highlighted row is scrolled into view only when the keyboard moved it.
 * The pointer moves the highlight too, and scrolling then would slide the
 * list under the pointer and make it jitter.
 */
async function move(direction: 1 | -1) {
  const count = flat.value.length
  if (count === 0) return
  const from =
    current.value === undefined ? 0 : flat.value.indexOf(current.value)
  active.value = (from + direction + count) % count
  await nextTick()
  if (current.value !== undefined) {
    document
      .getElementById(optionId(current.value))
      ?.scrollIntoView({ block: "nearest" })
  }
}

function onKeydown(event: KeyboardEvent) {
  /* While an input method is composing, Enter confirms a candidate. */
  if (event.isComposing) return
  if (event.key === "Enter") {
    event.preventDefault()
    if (current.value !== undefined) choose(current.value)
  } else if (event.key === "ArrowDown") {
    event.preventDefault()
    void move(1)
  } else if (event.key === "ArrowUp") {
    event.preventDefault()
    void move(-1)
  }
}

function onInput() {
  active.value = 0
}

function onOpenAutoFocus() {
  previousFocus = document.activeElement
}

/*
 * The palette has no trigger for Reka to give focus back to, so it returns to
 * the element that had it.
 */
function onCloseAutoFocus(event: Event) {
  if (event.defaultPrevented) return
  event.preventDefault()
  if (previousFocus instanceof HTMLElement) previousFocus.focus()
}

/* While an input method composes, Escape cancels its candidate. */
function onEscapeKeyDown(event: KeyboardEvent) {
  if (event.isComposing) event.preventDefault()
}

/* Every opening starts from an empty query. */
watch(open, (isOpen) => {
  if (!isOpen) return
  query.value = ""
  active.value = 0
})
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal :to="props.container">
      <DialogOverlay class="fixed inset-0 z-[100] bg-newt-overlay" />
      <DialogContent
        :aria-describedby="undefined"
        v-bind="$attrs"
        :class="
          cn(
            'fixed inset-x-0 top-[15vh] z-[100] mx-auto flex max-h-[70vh] w-[560px] max-w-[92vw] flex-col overflow-hidden rounded-lg border border-newt-border bg-newt-bg-elevated text-newt-text-primary shadow-elevation-high outline-none',
            props.class
          )
        "
        @open-auto-focus="onOpenAutoFocus"
        @close-auto-focus="onCloseAutoFocus"
        @escape-key-down="onEscapeKeyDown"
      >
        <DialogTitle class="sr-only">{{ props.label }}</DialogTitle>
        <input
          v-model="query"
          type="text"
          role="combobox"
          aria-expanded="true"
          :aria-controls="`${id}-list`"
          :aria-activedescendant="
            current === undefined ? undefined : optionId(current)
          "
          aria-autocomplete="list"
          :aria-label="props.placeholder"
          :placeholder="props.placeholder"
          autocomplete="off"
          spellcheck="false"
          class="mx-3 mt-3 rounded-sm border border-newt-border bg-newt-bg-input px-3.5 py-3 font-sans text-base text-newt-text-primary placeholder:text-newt-text-muted focus:border-newt-brand focus:outline-none"
          @input="onInput"
          @keydown="onKeydown"
        />
        <div
          :id="`${id}-list`"
          role="listbox"
          :aria-label="props.label"
          class="flex-1 overflow-y-auto px-3 pb-3 pt-2"
        >
          <div
            v-for="group in shown"
            :key="group.label"
            role="group"
            :aria-label="group.label"
          >
            <div
              aria-hidden="true"
              class="px-2 pb-1 pt-2.5 text-xs font-bold uppercase tracking-[0.02em] text-newt-text-muted"
            >
              {{ group.label }}
            </div>
            <!--
              Options are driven from the input through aria-activedescendant;
              Enter there selects the highlighted one.
            -->
            <div
              v-for="item in group.items"
              :id="optionId(item)"
              :key="item.id"
              role="option"
              tabindex="-1"
              :aria-selected="item === current"
              :class="
                cn(
                  'flex cursor-pointer items-center gap-2 rounded-sm p-2 text-[15px] leading-5',
                  item === current
                    ? 'bg-newt-bg-active text-newt-text-primary'
                    : 'text-newt-text-secondary'
                )
              "
              @click="choose(item)"
              @pointermove="active = flat.indexOf(item)"
            >
              <span
                aria-hidden="true"
                class="w-5 shrink-0 text-center font-semibold text-newt-text-muted"
              >
                {{ item.prefix }}
              </span>
              <span class="truncate font-medium">{{ item.label }}</span>
              <span
                v-if="item.description !== undefined"
                class="truncate text-[13px] text-newt-text-muted"
              >
                {{ item.description }}
              </span>
              <kbd
                v-if="item.shortcut !== undefined"
                :class="cn(kbdClassName, 'ms-auto shrink-0')"
              >
                {{ item.shortcut }}
              </kbd>
            </div>
          </div>
          <p
            v-if="flat.length === 0"
            class="m-0 px-2 py-6 text-center text-sm text-newt-text-muted"
          >
            {{ props.emptyText }}
          </p>
        </div>
        <footer
          v-if="props.hints !== false"
          aria-hidden="true"
          class="flex flex-wrap gap-x-4 gap-y-1 border-t border-newt-border bg-newt-bg-surface px-4 py-2.5 text-xs text-newt-text-muted"
        >
          <span class="inline-flex items-center gap-1">
            <kbd :class="kbdClassName">↑</kbd>
            <kbd :class="kbdClassName">↓</kbd>
            {{ props.hints.move }}
          </span>
          <span class="inline-flex items-center gap-1">
            <kbd :class="kbdClassName">Enter</kbd>
            {{ props.hints.select }}
          </span>
          <span class="inline-flex items-center gap-1">
            <kbd :class="kbdClassName">Esc</kbd>
            {{ props.hints.close }}
          </span>
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
