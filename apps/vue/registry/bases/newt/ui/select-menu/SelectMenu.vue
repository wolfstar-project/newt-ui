<script setup lang="ts">
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectViewport,
} from "reka-ui"
import type { HTMLAttributes } from "vue"
import { computed, ref, useId } from "vue"

import { cn } from "@/lib/utils"

import {
  SELECT_MENU_MAX_OPTIONS,
  type SelectMenuOption,
  type SelectMenuVariant,
} from "."

/*
 * Reka Select owns the behaviour: open state, Escape and outside press, focus
 * moving through the rows and back to the trigger, typeahead, and
 * collision-aware placement. Only the look, the option model and the cap are
 * newt/ui's.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    options: readonly SelectMenuOption[]
    variant?: SelectMenuVariant
    /** The value selected on first render, when no `v-model` is bound. */
    defaultValue?: string
    placeholder?: string
    disabled?: boolean
    /** Accessible name of the trigger and the listbox. */
    label?: string
    /**
     * The element the panel is portalled into. Defaults to `body`; pass the
     * enclosing native `<dialog>` or a themed wrapper to keep it there.
     */
    container?: string | HTMLElement
  }>(),
  {
    variant: "settings",
    placeholder: "Make a selection",
    disabled: false,
    label: "Select an option",
  }
)

/*
 * The cap is applied here rather than left to the caller: a row the platform
 * would reject should not be one the keyboard can reach.
 */
const options = computed(() =>
  props.variant === "message"
    ? props.options.slice(0, SELECT_MENU_MAX_OPTIONS)
    : props.options
)

const id = useId()

const emit = defineEmits<{ select: [value: string] }>()

/*
 * The selection is mirrored here because the trigger draws more than the
 * label of the chosen row: its icon and its note come from the option.
 */
const model = defineModel<string | undefined>({ default: undefined })
/*
 * Without a bound v-model, defineModel keeps the pick locally. defaultValue
 * shows only until the first pick, so a parent that clears its model clears
 * the trigger too.
 */
const picked = ref(false)
const selected = computed(
  () => model.value ?? (picked.value ? undefined : props.defaultValue)
)

const selectedOption = computed(() =>
  options.value.find((option) => option.value === selected.value)
)

function onValueChange(next: string) {
  picked.value = true
  model.value = next
  emit("select", next)
}
</script>

<template>
  <SelectRoot
    :model-value="selected"
    :disabled="props.disabled"
    @update:model-value="onValueChange"
  >
    <div
      v-bind="$attrs"
      :class="cn('relative w-full max-w-[400px]', props.class)"
    >
      <SelectTrigger
        :aria-label="props.label"
        class="group flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-sm border border-newt-border bg-newt-bg-input px-2 font-sans text-sm font-medium text-newt-text-primary hover:border-newt-bg-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50"
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
          class="h-[18px] w-[18px] shrink-0 group-data-[state=open]:rotate-180"
        >
          <path
            fill="currentColor"
            d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"
          />
        </svg>
      </SelectTrigger>
    </div>

    <SelectPortal :to="props.container">
      <SelectContent
        position="popper"
        align="start"
        :side-offset="4"
        :aria-label="props.label"
        class="z-[110] w-[var(--reka-select-trigger-width)] rounded-md border border-newt-border bg-newt-bg-floating p-1.5 shadow-elevation-high"
      >
        <!--
          A message select shows its scrollbar: the list is capped, so the bar
          is what says there is more of it below the fold. Reka hides the
          viewport's scrollbar with an attribute selector, so the two rules
          that bring it back repeat that attribute to outrank it.
        -->
        <SelectViewport
          :class="
            props.variant === 'message'
              ? cn(
                  'max-h-[300px]',
                  '[&[data-reka-select-viewport]]:[scrollbar-width:thin] [scrollbar-color:var(--newt-bg-active)_transparent]',
                  '[&[data-reka-select-viewport]::-webkit-scrollbar]:block [&::-webkit-scrollbar]:w-2',
                  '[&::-webkit-scrollbar-track]:bg-transparent',
                  '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-newt-bg-active [&::-webkit-scrollbar-thumb]:bg-clip-padding',
                  '[&::-webkit-scrollbar-thumb:hover]:bg-newt-text-muted [&::-webkit-scrollbar-thumb:hover]:bg-clip-padding'
                )
              : 'max-h-80'
          "
        >
          <!-- Typeahead matches the label, not the description. -->
          <SelectItem
            v-for="(option, index) of options"
            :key="option.value"
            :value="option.value"
            :disabled="option.disabled"
            :text-value="option.label"
            :aria-describedby="
              option.description ? `${id}-description-${index}` : undefined
            "
            :class="
              cn(
                'group/item flex cursor-pointer select-none items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm text-newt-text-secondary outline-none',
                'data-[state=checked]:text-newt-text-primary',
                'data-[highlighted]:bg-newt-brand data-[highlighted]:data-[state=unchecked]:text-newt-on-accent',
                'data-[disabled]:cursor-not-allowed data-[disabled]:text-newt-text-muted data-[disabled]:opacity-50'
              )
            "
          >
            <span
              v-if="option.icon"
              aria-hidden="true"
              class="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-newt-text-secondary group-data-[highlighted]/item:text-newt-on-accent"
            >
              <component :is="option.icon" />
            </span>
            <span class="flex min-w-0 flex-col">
              <SelectItemText class="truncate">
                {{ option.label }}
              </SelectItemText>
              <span
                v-if="option.description"
                :id="`${id}-description-${index}`"
                class="truncate text-xs text-newt-text-muted group-data-[highlighted]/item:text-newt-on-accent"
              >
                {{ option.description }}
              </span>
            </span>
            <!--
              Only the settings menu ticks a row. In a message the choice is
              submitted rather than kept, so there is no standing selection for
              a tick to be about. On the highlighted row the disc would
              dissolve into the background, so it swaps with the tick.
            -->
            <SelectItemIndicator
              v-if="props.variant === 'settings'"
              class="ms-auto flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-newt-brand text-newt-on-accent group-data-[highlighted]/item:bg-newt-on-accent group-data-[highlighted]/item:text-newt-brand"
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
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
