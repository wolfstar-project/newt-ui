<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from "vue"
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from "vue"

import { cn } from "@/lib/utils"

import {
  SELECT_MENU_MAX_OPTIONS,
  type SelectMenuOption,
  type SelectMenuVariant,
} from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    options: readonly SelectMenuOption[]
    variant?: SelectMenuVariant
    placeholder?: string
    disabled?: boolean
    /** Accessible name of the trigger and the listbox. */
    label?: string
  }>(),
  {
    variant: "settings",
    placeholder: "Make a selection",
    disabled: false,
    label: "Select an option",
  }
)

/*
 * The cap is applied here rather than left to the caller: everything below —
 * the keyboard, the active index, the ids — counts rows, and a row the
 * platform would reject should not be one of them.
 */
const options = computed(() =>
  props.variant === "message"
    ? props.options.slice(0, SELECT_MENU_MAX_OPTIONS)
    : props.options
)

const emit = defineEmits<{ select: [value: string] }>()

const selected = defineModel<string | undefined>({ default: undefined })

const id = useId()
const listboxId = `${id}-listbox`
const optionId = (index: number) => `${id}-option-${index}`

const triggerRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLDivElement | null>(null)

const open = ref(false)
const active = ref(-1)
const box = ref<CSSProperties | null>(null)

const selectedOption = computed(() =>
  options.value.find((option) => option.value === selected.value)
)

const selectable = (index: number) => {
  const option = options.value[index]
  return Boolean(option) && !option?.disabled
}

const firstSelectable = () => options.value.findIndex((o) => !o.disabled)

const lastSelectable = () => {
  for (let i = options.value.length - 1; i >= 0; i--) {
    if (!options.value[i]?.disabled) return i
  }
  return -1
}

const step = (from: number, direction: 1 | -1) => {
  const count = options.value.length
  for (let i = 1; i <= count; i++) {
    const index = (from + direction * i + count * i) % count
    if (selectable(index)) return index
  }
  return from
}

/*
 * The panel is teleported to the body so an `overflow: hidden` ancestor cannot
 * clip it, which means it is positioned from measured coordinates and flipped
 * above the trigger when the space below runs out.
 */
function measure() {
  const trigger = triggerRef.value
  if (!trigger) return
  const rect = trigger.getBoundingClientRect()
  const below = window.innerHeight - rect.bottom
  const height = panelRef.value?.offsetHeight ?? 0
  box.value =
    height > below && rect.top > below
      ? {
          position: "fixed",
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          bottom: `${window.innerHeight - rect.top + 4}px`,
          zIndex: 1002,
        }
      : {
          position: "fixed",
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          top: `${rect.bottom + 4}px`,
          zIndex: 1002,
        }
}

function scrollActiveIntoView() {
  void nextTick(() => {
    if (active.value < 0) return
    panelRef.value
      ?.querySelector(`#${CSS.escape(optionId(active.value))}`)
      ?.scrollIntoView({ block: "nearest" })
  })
}

function openMenu() {
  if (props.disabled || open.value) return
  open.value = true
  const current = options.value.findIndex(
    (option) => option.value === selected.value
  )
  active.value =
    current >= 0 && selectable(current) ? current : firstSelectable()
  void nextTick(() => {
    measure()
    scrollActiveIntoView()
  })
}

function closeMenu() {
  if (!open.value) return
  open.value = false
  active.value = -1
}

function select(index: number) {
  const option = options.value[index]
  if (!option || option.disabled) return
  selected.value = option.value
  emit("select", option.value)
  closeMenu()
  triggerRef.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowDown":
    case "ArrowUp": {
      event.preventDefault()
      if (!open.value) {
        openMenu()
        return
      }
      active.value = step(active.value, event.key === "ArrowDown" ? 1 : -1)
      scrollActiveIntoView()
      return
    }
    case "Home":
      if (!open.value) return
      event.preventDefault()
      active.value = firstSelectable()
      scrollActiveIntoView()
      return
    case "End":
      if (!open.value) return
      event.preventDefault()
      active.value = lastSelectable()
      scrollActiveIntoView()
      return
    case "Enter":
    case " ":
      event.preventDefault()
      if (open.value) select(active.value)
      else openMenu()
      return
    case "Escape":
      if (!open.value) return
      event.preventDefault()
      closeMenu()
  }
}

function onPointerDown(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Node)) return
  if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) {
    return
  }
  closeMenu()
}

/* Capture phase: a nested scroller never fires a window scroll event. */
function onScroll() {
  if (open.value) measure()
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("scroll", onScroll, {
      capture: true,
      passive: true,
    })
    window.addEventListener("resize", onScroll)
    return
  }
  document.removeEventListener("mousedown", onPointerDown)
  document.removeEventListener("scroll", onScroll, { capture: true })
  window.removeEventListener("resize", onScroll)
})

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onPointerDown)
  document.removeEventListener("scroll", onScroll, { capture: true })
  window.removeEventListener("resize", onScroll)
})
</script>

<template>
  <div :class="cn('relative w-full max-w-[400px]', props.class)">
    <button
      ref="triggerRef"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listboxId"
      :aria-activedescendant="
        open && active >= 0 ? optionId(active) : undefined
      "
      :aria-label="props.label"
      :disabled="props.disabled"
      class="flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-sm border border-newt-border bg-newt-bg-input px-2 font-sans text-sm font-medium text-newt-text-primary hover:border-newt-bg-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50"
      @click="open ? closeMenu() : openMenu()"
      @keydown="onKeydown"
    >
      <span class="flex min-w-0 flex-1 items-center gap-2">
        <span
          v-if="selectedOption?.icon"
          aria-hidden="true"
          class="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-newt-text-secondary"
        >
          <component :is="selectedOption.icon" />
        </span>
        <span
          :class="cn('truncate', !selectedOption && 'text-newt-text-muted')"
        >
          {{ selectedOption?.label ?? props.placeholder }}
        </span>
        <span
          v-if="selectedOption?.note"
          class="truncate font-normal text-newt-text-muted"
        >
          {{ selectedOption.note }}
        </span>
      </span>
      <!-- Points down when closed, flips when the listbox opens. -->
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        :class="cn('h-[18px] w-[18px] shrink-0', open && 'rotate-180')"
      >
        <path
          fill="currentColor"
          d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"
        />
      </svg>
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        ref="panelRef"
        :style="box ?? undefined"
        class="rounded-md border border-newt-border bg-newt-bg-floating p-1.5 shadow-elevation-high"
        @mousedown.prevent
      >
        <ul
          :id="listboxId"
          role="listbox"
          :aria-label="props.label"
          :class="
            cn(
              'm-0 list-none overflow-y-auto p-0',
              /*
               * A message select shows its scrollbar rather than hiding it
               * until the pointer moves: the list is capped, so the bar is
               * what says there is more of it below the fold.
               */
              props.variant === 'message'
                ? cn(
                    'max-h-[300px]',
                    '[scrollbar-width:thin] [scrollbar-color:var(--newt-bg-active)_transparent]',
                    '[&::-webkit-scrollbar]:w-2',
                    '[&::-webkit-scrollbar-track]:bg-transparent',
                    '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-newt-bg-active [&::-webkit-scrollbar-thumb]:bg-clip-padding',
                    '[&::-webkit-scrollbar-thumb:hover]:bg-newt-text-muted [&::-webkit-scrollbar-thumb:hover]:bg-clip-padding'
                  )
                : 'max-h-80'
            )
          "
        >
          <li
            v-for="(option, index) of options"
            :id="optionId(index)"
            :key="option.value"
            role="option"
            :aria-selected="option.value === selected"
            :aria-disabled="option.disabled || undefined"
            :class="
              cn(
                'flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm text-newt-text-secondary',
                index === active &&
                  !option.disabled &&
                  'bg-newt-brand text-white',
                option.value === selected && 'text-newt-text-primary',
                option.disabled &&
                  'cursor-not-allowed bg-transparent text-newt-text-muted opacity-50'
              )
            "
            @mouseenter="!option.disabled && (active = index)"
            @click="select(index)"
          >
            <span
              v-if="option.icon"
              aria-hidden="true"
              :class="
                cn(
                  'flex h-[18px] w-[18px] shrink-0 items-center justify-center text-newt-text-secondary',
                  index === active && !option.disabled && 'text-white'
                )
              "
            >
              <component :is="option.icon" />
            </span>
            <span class="flex min-w-0 flex-col">
              <span class="truncate">{{ option.label }}</span>
              <span
                v-if="option.description"
                :class="
                  cn(
                    'truncate text-xs text-newt-text-muted',
                    index === active && !option.disabled && 'text-white'
                  )
                "
              >
                {{ option.description }}
              </span>
            </span>
            <!--
              Only the settings menu ticks a row. In a message the choice is
              submitted rather than kept, so there is no standing selection for
              a tick to be about — `aria-selected` still carries it for
              anything that asks.
            -->
            <span
              v-if="option.value === selected && props.variant === 'settings'"
              aria-hidden="true"
              :class="
                cn(
                  'ms-auto flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full',
                  index === active && !option.disabled
                    ? 'bg-white text-newt-brand'
                    : 'bg-newt-brand text-white'
                )
              "
            >
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m6 12.5 4 4 8-9"
                />
              </svg>
            </span>
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>
