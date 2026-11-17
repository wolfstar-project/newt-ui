<script setup lang="ts">
import type { HTMLAttributes, VNode } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

import {
  defaultMessageComposerLabels,
  type MessageComposerInputAttributes,
  type MessageComposerInputProps,
  type MessageComposerLabels,
  type MessageComposerLayout,
  messageComposerButtonVariants,
  messageComposerFieldVariants,
  messageComposerVariants,
} from "."

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
    /** Turns off the input, the add button and the send button. */
    disabled?: boolean
    /** `"narrow"` is the phone layout: a pill field and round buttons. */
    layout?: MessageComposerLayout
    /** Shows the add button. */
    showAdd?: boolean
    /** Replaces the English names; omitted keys keep their default. */
    labels?: Partial<MessageComposerLabels>
  }>(),
  { autocomplete: false, disabled: false, layout: "default", showAdd: true }
)

const emit = defineEmits<{
  submit: [value: string]
  escape: []
  /** Arrow keys, for driving a suggestion list above the composer. */
  navigate: [direction: "up" | "down"]
  add: []
}>()

const slots = defineSlots<{
  /** Controls after the add button, before the field. */
  leading?: () => VNode[]
  /**
   * Replaces the built-in input with your own field. It receives the value,
   * a setter, the submit action and the attributes to bind on the field.
   */
  input?: (props: MessageComposerInputProps) => VNode[]
  /** Extra controls at the end of the field, before the send button. */
  actions?: () => VNode[]
  /** Shown in place of the send button while the field is empty. */
  trailing?: () => VNode[]
}>()

const value = defineModel<string>({ default: "" })

const text = computed(() => ({
  ...defaultMessageComposerLabels,
  ...props.labels,
}))

const label = computed(
  () => props.placeholder ?? text.value.placeholder(props.channelName)
)
const hasValue = computed(() => value.value.trim().length > 0)

/* The send control only lights up once there is something to send. */
const sendReady = {
  default: "text-newt-brand",
  narrow:
    "bg-newt-brand text-newt-on-accent hover:bg-newt-brand-hover hover:text-newt-on-accent",
}

function setValue(next: string) {
  value.value = next
}

function submit() {
  if (!hasValue.value || props.disabled) return
  emit("submit", value.value)
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

const inputProps = computed<MessageComposerInputAttributes>(() => ({
  placeholder: label.value,
  "aria-label": label.value,
  role: props.autocomplete ? "combobox" : undefined,
  autocomplete: props.autocomplete ? "off" : undefined,
  "aria-controls": props.autocomplete ? props.ariaControls : undefined,
  "aria-expanded": props.autocomplete ? props.ariaExpanded : undefined,
  "aria-activedescendant": props.autocomplete
    ? props.ariaActivedescendant
    : undefined,
  disabled: props.disabled,
  spellcheck: false,
  onKeydown,
}))
</script>

<template>
  <div
    role="group"
    :aria-label="text.group(props.channelName)"
    :class="cn(messageComposerVariants({ layout: props.layout }), props.class)"
  >
    <button
      v-if="props.showAdd"
      type="button"
      :aria-label="text.add"
      :disabled="props.disabled"
      :class="messageComposerButtonVariants({ layout: props.layout })"
      @click="emit('add')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5">
        <path
          fill="currentColor"
          d="M11 5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6z"
        />
      </svg>
    </button>
    <slot name="leading" />
    <div :class="messageComposerFieldVariants({ layout: props.layout })">
      <slot
        name="input"
        :value="value"
        :setValue="setValue"
        :submit="submit"
        :disabled="props.disabled"
        :inputProps="inputProps"
      >
        <input
          v-model="value"
          type="text"
          v-bind="inputProps"
          class="w-full min-w-0 border-0 bg-transparent font-[family-name:var(--newt-font-sans)] text-[15px] text-newt-text-primary outline-none placeholder:text-newt-text-muted disabled:cursor-not-allowed"
        />
      </slot>
      <slot name="actions" />
    </div>
    <slot v-if="slots.trailing && !hasValue" name="trailing" />
    <button
      v-else
      type="button"
      :aria-label="text.send"
      :disabled="props.disabled || !hasValue"
      :class="
        cn(
          messageComposerButtonVariants({ layout: props.layout }),
          hasValue && !props.disabled && sendReady[props.layout]
        )
      "
      @click="submit"
    >
      <!-- The send control only lights up once there is something to send. -->
      <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5">
        <path fill="currentColor" d="M3 20.5v-6l8-2.5-8-2.5v-6l19 8.5z" />
      </svg>
    </button>
  </div>
</template>
