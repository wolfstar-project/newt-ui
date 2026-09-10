<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from "vue"
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from "vue"

import { cn } from "@/lib/utils"

import {
  ENTITY_SELECT_MAX,
  entitySelectEmpty,
  type EntityKind,
  type EntityOption,
} from "."

/*
 * The picker for things the server already knows about: its members, its
 * roles, its channels, or all of them at once.
 *
 * It is a separate control from the string select rather than a mode of it,
 * because the rows are not strings. A member arrives with a face, a role with
 * a colour and a headcount, a channel with the glyph that says what kind of
 * channel it is — and when more than one can be chosen, the choices come back
 * out of the list and sit in the control as chips, which a string select
 * never does.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    options: readonly EntityOption[]
    /** Which of the four this is. Only the empty-list wording depends on it. */
    kind?: EntityKind
    /** How many may be chosen. More than one turns the control into chips. */
    max?: number
    placeholder?: string
    disabled?: boolean
    /** Accessible name of the trigger and the listbox. */
    label?: string
  }>(),
  {
    kind: "user",
    max: 1,
    placeholder: "Make a selection",
    disabled: false,
    label: "Select an option",
  }
)

const selected = defineModel<readonly string[]>({ default: () => [] })

/* The cap is applied here: the keyboard and the option ids count rows, and a
 * row the platform would reject should not be one of them. */
const options = computed(() => props.options.slice(0, ENTITY_SELECT_MAX))
const limit = computed(() => Math.min(props.max, ENTITY_SELECT_MAX))
const multiple = computed(() => limit.value > 1)

const id = useId()
const listboxId = `${id}-listbox`
const optionId = (index: number) => `${id}-option-${index}`

const triggerRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLDivElement | null>(null)

const open = ref(false)
const active = ref(-1)
const box = ref<CSSProperties | null>(null)

const chosen = computed(() =>
  options.value.filter((option) => selected.value.includes(option.value))
)

const selectable = (index: number) => {
  const option = options.value[index]
  return Boolean(option) && !option?.disabled
}

const firstSelectable = () =>
  options.value.findIndex((option) => !option.disabled)

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
 * above the control when the space below runs out.
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
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          bottom: `${window.innerHeight - rect.top + 4}px`,
        }
      : {
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          top: `${rect.bottom + 4}px`,
        }
}

/*
 * `fixed` from the first frame, before there is anything to be fixed at: a
 * panel that started in the document flow would sit at the end of the body,
 * and scrolling its first row into view would drag the whole page down to it.
 * Hidden until measured, so that frame is never seen.
 */
const panelStyle = computed<CSSProperties>(() => ({
  position: "fixed",
  zIndex: 1002,
  visibility: box.value === null ? "hidden" : undefined,
  ...box.value,
}))

function onPointerDown(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Node)) return
  if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) {
    return
  }
  open.value = false
}

const update = () => measure()

watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    measure()
    /* Capture phase: a nested scroller never fires a window scroll event. */
    document.addEventListener("scroll", update, {
      capture: true,
      passive: true,
    })
    window.addEventListener("resize", update)
    document.addEventListener("mousedown", onPointerDown)
    return
  }
  document.removeEventListener("scroll", update, { capture: true })
  window.removeEventListener("resize", update)
  document.removeEventListener("mousedown", onPointerDown)
})

watch(active, async (index) => {
  if (index < 0) return
  await nextTick()
  panelRef.value
    ?.querySelector(`#${CSS.escape(optionId(index))}`)
    ?.scrollIntoView({ block: "nearest" })
})

onBeforeUnmount(() => {
  document.removeEventListener("scroll", update, { capture: true })
  window.removeEventListener("resize", update)
  document.removeEventListener("mousedown", onPointerDown)
})

function openMenu() {
  if (props.disabled || open.value) return
  open.value = true
  const current = options.value.findIndex((option) =>
    selected.value.includes(option.value)
  )
  active.value =
    current >= 0 && selectable(current) ? current : firstSelectable()
}

function closeMenu() {
  open.value = false
  active.value = -1
}

function toggle(index: number) {
  const option = options.value[index]
  if (!option || option.disabled) return
  if (!multiple.value) {
    selected.value = [option.value]
    closeMenu()
    triggerRef.value?.focus()
    return
  }
  /*
   * At the limit the list stays open and stops taking more, rather than
   * silently dropping the oldest choice: the reader picked those, and a
   * control that quietly un-picks one is a control that lies.
   */
  const already = selected.value.includes(option.value)
  if (!already && selected.value.length >= limit.value) return
  selected.value = already
    ? selected.value.filter((each) => each !== option.value)
    : [...selected.value, option.value]
}

function remove(entity: string) {
  selected.value = selected.value.filter((each) => each !== entity)
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
      return
    }
    case "Home":
      if (!open.value) return
      event.preventDefault()
      active.value = firstSelectable()
      return
    case "End":
      if (!open.value) return
      event.preventDefault()
      active.value = lastSelectable()
      return
    case "Enter":
    case " ": {
      event.preventDefault()
      if (!open.value) {
        openMenu()
        return
      }
      if (active.value >= 0) toggle(active.value)
      return
    }
    case "Escape":
      if (!open.value) return
      event.preventDefault()
      closeMenu()
      triggerRef.value?.focus()
      return
    case "Backspace": {
      /* The chip nearest the caret goes first, which is the last one. */
      if (!multiple.value || open.value || chosen.value.length === 0) return
      event.preventDefault()
      const last = chosen.value[chosen.value.length - 1]
      if (last) remove(last.value)
      return
    }
    default:
  }
}

function onChipMouseDown(event: MouseEvent, entity: string) {
  event.preventDefault()
  event.stopPropagation()
  remove(entity)
}
</script>

<template>
  <div :class="cn('w-full max-w-[420px]', props.class)">
    <button
      ref="triggerRef"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="open ? listboxId : undefined"
      :aria-activedescendant="
        open && active >= 0 ? optionId(active) : undefined
      "
      :aria-label="props.label"
      :disabled="props.disabled"
      :class="
        cn(
          'flex w-full items-center gap-2 rounded-md border border-newt-border bg-newt-bg-base px-3 py-2 text-start text-sm text-newt-text-secondary',
          'transition-colors duration-fast ease-newt hover:border-newt-text-muted',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
          open && 'border-newt-text-link',
          props.disabled && 'cursor-not-allowed opacity-50'
        )
      "
      @click="open ? closeMenu() : openMenu()"
      @keydown="onKeydown"
    >
      <span class="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
        <span v-if="chosen.length === 0" class="text-newt-text-muted">
          {{ props.placeholder }}
        </span>

        <!--
          A chip is not a button: it sits inside one, and nesting two would be
          markup a keyboard cannot untangle. Its cross is decorative, and
          Backspace is the way in from the keyboard.
        -->
        <template v-else-if="multiple">
          <span
            v-for="option of chosen"
            :key="option.value"
            class="flex items-center gap-1.5 rounded-sm bg-newt-bg-elevated px-1.5 py-1 text-xs text-newt-text-primary"
            @mousedown="onChipMouseDown($event, option.value)"
          >
            <span
              v-if="option.icon"
              aria-hidden="true"
              class="flex h-4 w-4 shrink-0"
            >
              <component :is="option.icon" />
            </span>
            <span :style="option.color ? { color: option.color } : undefined">
              {{ option.label }}
            </span>
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-3 w-3">
              <path
                fill="currentColor"
                d="M7.05 5.64a1 1 0 0 1 1.41 0L12 9.17l3.54-3.53a1 1 0 1 1 1.41 1.41L13.41 10.6l3.54 3.53a1 1 0 0 1-1.41 1.42L12 12.01l-3.54 3.54a1 1 0 0 1-1.41-1.42l3.53-3.53-3.53-3.54a1 1 0 0 1 0-1.42Z"
              />
            </svg>
          </span>
        </template>

        <span v-else class="flex min-w-0 items-center gap-2">
          <span
            v-if="chosen[0]?.icon"
            aria-hidden="true"
            class="flex h-5 w-5 shrink-0"
          >
            <component :is="chosen[0].icon" />
          </span>
          <span
            class="truncate text-newt-text-primary"
            :style="chosen[0]?.color ? { color: chosen[0].color } : undefined"
          >
            {{ chosen[0]?.label }}
          </span>
        </span>
      </span>

      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
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
        :style="panelStyle"
        class="rounded-md border border-newt-border bg-newt-bg-floating p-1.5 shadow-elevation-high"
        @mousedown.prevent
      >
        <!--
          The scrollbar shows rather than hiding until the pointer moves: the
          list is capped at 25, so the bar is what says there is more of it
          below the fold.
        -->
        <ul
          :id="listboxId"
          role="listbox"
          :aria-label="props.label"
          :aria-multiselectable="multiple || undefined"
          :class="
            cn(
              'm-0 max-h-[300px] list-none overflow-y-auto p-0',
              '[scrollbar-width:thin] [scrollbar-color:var(--newt-bg-active)_transparent]',
              '[&::-webkit-scrollbar]:w-2',
              '[&::-webkit-scrollbar-track]:bg-transparent',
              '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-newt-bg-active [&::-webkit-scrollbar-thumb]:bg-clip-padding',
              '[&::-webkit-scrollbar-thumb:hover]:bg-newt-text-muted [&::-webkit-scrollbar-thumb:hover]:bg-clip-padding'
            )
          "
        >
          <li
            v-if="options.length === 0"
            class="px-2.5 py-2 text-sm text-newt-text-muted"
          >
            {{ entitySelectEmpty[props.kind] }}
          </li>

          <li
            v-for="(option, index) of options"
            v-else
            :id="optionId(index)"
            :key="option.value"
            role="option"
            :aria-selected="selected.includes(option.value)"
            :aria-disabled="option.disabled || undefined"
            :class="
              cn(
                'flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm text-newt-text-secondary',
                index === active && !option.disabled && 'bg-newt-bg-elevated',
                selected.includes(option.value) && 'text-newt-text-primary',
                option.disabled &&
                  'cursor-not-allowed bg-transparent text-newt-text-muted opacity-50'
              )
            "
            @mouseenter="option.disabled ? undefined : (active = index)"
            @click="toggle(index)"
          >
            <span
              v-if="option.icon"
              aria-hidden="true"
              class="flex h-6 w-6 shrink-0 items-center justify-center"
            >
              <component :is="option.icon" />
            </span>

            <span
              class="min-w-0 flex-1 truncate font-medium"
              :style="option.color ? { color: option.color } : undefined"
            >
              {{ option.label }}
            </span>

            <!-- The headcount beside a role: a number and the glyph for people. -->
            <span
              v-if="option.count !== undefined"
              class="flex shrink-0 items-center gap-1 text-xs tabular-nums text-newt-text-muted"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" class="h-3.5 w-3.5">
                <path
                  fill="currentColor"
                  d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.9 0-7 2-7 4.5V20h14v-1.5c0-2.5-3.1-4.5-7-4.5Z"
                />
              </svg>
              {{ option.count }}
            </span>

            <span
              v-if="option.badge"
              class="shrink-0 rounded-sm bg-newt-brand px-1 py-0.5 text-[10px] font-bold uppercase leading-none text-white"
            >
              {{ option.badge }}
            </span>

            <!--
              A box rather than a tick, and only when more than one may be
              chosen: the shape says whether picking this one un-picks the last.
            -->
            <span
              v-if="multiple"
              aria-hidden="true"
              :data-checked="selected.includes(option.value) ? true : undefined"
              :class="
                cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-newt-text-muted',
                  'data-[checked]:border-newt-brand data-[checked]:bg-newt-brand'
                )
              "
            >
              <svg
                v-if="selected.includes(option.value)"
                viewBox="0 0 16 16"
                class="h-3.5 w-3.5"
              >
                <path
                  fill="#fff"
                  d="M6.2 11.6 3.1 8.5a1 1 0 0 1 1.4-1.4l1.7 1.7 4.3-4.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0Z"
                />
              </svg>
            </span>
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>
