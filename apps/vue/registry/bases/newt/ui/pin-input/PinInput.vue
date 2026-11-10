<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * A short code, one character to a box. Each box is its own `<input>`, so a
 * screen reader can say which one it is on; the first carries
 * `one-time-code`, so a code from a text message fills all of them. The value
 * is one string with no gaps: a character typed past the end lands in the
 * first empty box.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** How many characters the code has. */
    length?: number
    /** `numeric` accepts digits only; `alphanumeric` also takes letters. */
    type?: "numeric" | "alphanumeric"
    /** Draw every character as a dot, for a code that is a secret. */
    mask?: boolean
    /** A separator after every this-many boxes. `0` draws none. */
    groupSize?: number
    disabled?: boolean
    invalid?: boolean
    /** Accessible name for the group of boxes. */
    label?: string
    /** Posts the code with a form, through a hidden input. */
    name?: string
  }>(),
  {
    length: 6,
    type: "numeric",
    mask: false,
    groupSize: 0,
    disabled: false,
    invalid: false,
    label: "Verification code",
  }
)

const emit = defineEmits<{
  /** Fired once, with the code, when the last box is filled. */
  (e: "complete", value: string): void
}>()

const model = defineModel<string>({ default: "" })

/* Global, so `match` returns every accepted character and drops the rest. */
const ACCEPT = {
  numeric: /\d/g,
  alphanumeric: /[a-z0-9]/gi,
} as const

/** Where a navigation key sends focus, or `undefined` for any other key. */
function moveFor(
  key: string,
  index: number,
  forward: number
): number | undefined {
  switch (key) {
    case "ArrowLeft":
      return index - forward
    case "ArrowRight":
      return index + forward
    case "Home":
      return 0
    case "End":
      return props.length - 1
    default:
      return undefined
  }
}

const code = computed(() => model.value.slice(0, props.length))
const cells = ref<HTMLInputElement[]>([])

function focus(index: number) {
  const cell = cells.value[Math.max(0, Math.min(props.length - 1, index))]
  cell?.focus()
  cell?.select()
}

function commit(next: string) {
  const previous = code.value
  model.value = next
  if (next.length === props.length && next !== previous) emit("complete", next)
}

function onInput(index: number, event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return
  const raw = event.target.value
  const existing = code.value[index] ?? ""
  /* With the box's own character still in it, only the rest is new. */
  const typed =
    existing !== "" && raw.length > 1 && raw.startsWith(existing)
      ? raw.slice(existing.length)
      : raw
  const chars = typed.match(ACCEPT[props.type]) ?? []
  if (chars.length === 0) {
    if (raw === "") {
      commit(code.value.slice(0, index) + code.value.slice(index + 1))
    } else {
      /* Rejected input: put the box back to what the value says. */
      event.target.value = existing
    }
    return
  }
  const at = Math.min(index, code.value.length)
  const next = (
    code.value.slice(0, at) +
    chars.join("") +
    code.value.slice(at + chars.length)
  ).slice(0, props.length)
  commit(next)
  event.target.value = next[index] ?? ""
  focus(at + chars.length)
}

/*
 * A paste is handled on its own event. Read from the input's value it cannot
 * be told apart from typing, and a pasted code that begins with the box's
 * current character would lose that character.
 */
function onPaste(index: number, event: ClipboardEvent) {
  event.preventDefault()
  const chars =
    event.clipboardData?.getData("text").match(ACCEPT[props.type]) ?? []
  if (chars.length === 0) return
  const at = Math.min(index, code.value.length)
  commit(
    (
      code.value.slice(0, at) +
      chars.join("") +
      code.value.slice(at + chars.length)
    ).slice(0, props.length)
  )
  focus(at + chars.length)
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (!(event.target instanceof HTMLInputElement)) return
  const forward = getComputedStyle(event.target).direction === "rtl" ? -1 : 1
  const move = moveFor(event.key, index, forward)
  if (move !== undefined) {
    event.preventDefault()
    focus(move)
    return
  }
  if (
    event.key === "Backspace" &&
    (code.value[index] ?? "") === "" &&
    index > 0
  ) {
    event.preventDefault()
    commit(code.value.slice(0, index - 1) + code.value.slice(index))
    focus(index - 1)
  }
}

function onFocus(event: FocusEvent) {
  if (event.target instanceof HTMLInputElement) event.target.select()
}
</script>

<template>
  <div
    role="group"
    :aria-label="props.label"
    :data-invalid="props.invalid ? true : undefined"
    :class="cn('group/pin inline-flex items-center gap-2', props.class)"
  >
    <template v-for="index in props.length" :key="index">
      <span
        v-if="
          props.groupSize > 0 &&
          index > 1 &&
          (index - 1) % props.groupSize === 0
        "
        aria-hidden="true"
        class="h-0.5 w-2 rounded-full bg-newt-text-muted"
      />
      <input
        ref="cells"
        :type="props.mask ? 'password' : 'text'"
        :inputmode="props.type === 'numeric' ? 'numeric' : 'text'"
        :autocomplete="index === 1 ? 'one-time-code' : 'off'"
        :aria-label="`${props.type === 'numeric' ? 'Digit' : 'Character'} ${index} of ${props.length}`"
        :aria-invalid="props.invalid ? true : undefined"
        :disabled="props.disabled"
        :value="code[index - 1] ?? ''"
        class="h-[52px] w-11 rounded-sm border border-newt-border bg-newt-bg-input p-0 text-center font-mono text-xl font-semibold text-newt-text-primary caret-newt-brand transition-colors duration-fast ease-newt focus:border-newt-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 group-data-[invalid]/pin:border-newt-danger"
        @input="onInput(index - 1, $event)"
        @keydown="onKeydown(index - 1, $event)"
        @paste="onPaste(index - 1, $event)"
        @focus="onFocus"
      />
    </template>
    <input
      v-if="props.name !== undefined"
      type="hidden"
      :name="props.name"
      :value="code"
    />
  </div>
</template>
