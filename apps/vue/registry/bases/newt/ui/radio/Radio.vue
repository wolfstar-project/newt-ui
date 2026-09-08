<script setup lang="ts">
import { computed, onMounted, watch } from "vue"

import { cn } from "@/lib/utils"

import { useRadioGroup } from "./useRadioGroup"

const props = withDefaults(
  defineProps<{
    class?: string
    value: string
    /** A second line, when the choice needs a sentence to explain it. */
    description?: string
    disabled?: boolean
  }>(),
  { disabled: false }
)

const group = useRadioGroup()
const checked = computed(() => group.value.value === props.value)

onMounted(() => group.register(props.value, props.disabled))
watch(
  () => props.disabled,
  (disabled) => group.register(props.value, disabled)
)

function pick() {
  if (props.disabled) return
  group.select(props.value)
}
</script>

<template>
  <button
    type="button"
    role="radio"
    :aria-checked="checked"
    :aria-disabled="props.disabled || undefined"
    :tabindex="checked ? 0 : -1"
    :class="
      cn(
        'group flex cursor-pointer items-center gap-3 border-0 bg-transparent px-1 py-2 text-start font-sans text-[15px] leading-5 text-newt-text-secondary',
        'hover:text-newt-text-primary focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        checked && 'text-newt-text-primary',
        props.disabled && 'cursor-not-allowed opacity-50',
        props.class
      )
    "
    @click="pick"
  >
    <span
      aria-hidden="true"
      :data-checked="checked || undefined"
      :class="
        cn(
          'relative h-5 w-5 shrink-0 rounded-full border-2 border-newt-text-muted transition-colors duration-fast ease-newt',
          'after:absolute after:top-1/2 after:start-1/2 after:h-2 after:w-2 after:rounded-full after:bg-white after:content-[\'\']',
          'after:[transform:translate(calc(var(--newt-dir)*-50%),-50%)_scale(0)]',
          'data-[checked]:border-newt-brand data-[checked]:bg-newt-brand',
          'data-[checked]:after:[transform:translate(calc(var(--newt-dir)*-50%),-50%)_scale(1)]',
          !props.disabled && 'group-hover:border-newt-text-secondary'
        )
      "
    />
    <span v-if="props.description" class="flex min-w-0 flex-col gap-0.5">
      <span><slot /></span>
      <span class="text-[13px] leading-[17px] text-newt-text-muted">
        {{ props.description }}
      </span>
    </span>
    <slot v-else />
  </button>
</template>
