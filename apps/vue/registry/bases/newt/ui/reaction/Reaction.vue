<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue"
import { computed, ref, watch } from "vue"

import { cn } from "@/lib/utils"

import {
  defaultReactionLabel,
  reactionVariants,
  type ReactionLabelState,
} from "."

const props = withDefaults(
  defineProps<{
    class?: ButtonHTMLAttributes["class"]
    /** Emoji or short text rendered on the left. Optional with `emojiSrc`. */
    emoji?: string
    /** Image URL of a server (custom) emoji, rendered instead of `emoji`. */
    emojiSrc?: string
    /** Name of the emoji, for the accessible name: `:wolf:` or `wolf`. */
    emojiAlt?: string
    /** Number of users who reacted. */
    count: number
    /** Controlled active state (use with v-model:active). */
    active?: boolean
    /** Initial active state when uncontrolled. */
    defaultActive?: boolean
    /**
     * Show the count without a toggle: renders a `<span>` that is not
     * focusable and ignores clicks, for feeds that only display reactions.
     */
    readonly?: boolean
    /** Fixed accessible name. Wins over `formatLabel`. */
    ariaLabel?: string
    /** Builds the accessible name from the emoji, count and state. */
    formatLabel?: (state: ReactionLabelState) => string
  }>(),
  {
    active: undefined,
    defaultActive: false,
    readonly: false,
    formatLabel: defaultReactionLabel,
  }
)

const emit = defineEmits<{ (e: "update:active", value: boolean): void }>()

const internal = ref(props.active ?? props.defaultActive)
watch(
  () => props.active,
  (v) => {
    if (v !== undefined) internal.value = v
  }
)
const isActive = computed(() =>
  props.active !== undefined ? props.active : internal.value
)

function toggle() {
  const next = !isActive.value
  if (props.active === undefined) internal.value = next
  emit("update:active", next)
}

const label = computed(
  () =>
    props.ariaLabel ??
    props.formatLabel({
      emoji: props.emojiAlt ?? props.emoji ?? "Emoji",
      count: props.count,
      active: isActive.value,
    })
)
</script>

<template>
  <span
    v-if="props.readonly"
    role="img"
    :aria-label="label"
    :data-state="isActive ? 'active' : 'inactive'"
    :class="
      cn(
        reactionVariants({ active: isActive, interactive: false }),
        props.class
      )
    "
  >
    <img
      v-if="props.emojiSrc"
      :src="props.emojiSrc"
      alt=""
      aria-hidden="true"
      :draggable="false"
      class="h-4 w-4 object-contain"
    />
    <span v-else aria-hidden="true">{{ props.emoji }}</span>
    <span aria-hidden="true" class="text-xs font-semibold">{{
      props.count
    }}</span>
  </span>
  <button
    v-else
    type="button"
    :aria-pressed="isActive"
    :aria-label="label"
    :data-state="isActive ? 'active' : 'inactive'"
    :class="cn(reactionVariants({ active: isActive }), props.class)"
    @click="toggle"
  >
    <img
      v-if="props.emojiSrc"
      :src="props.emojiSrc"
      alt=""
      aria-hidden="true"
      :draggable="false"
      class="h-4 w-4 object-contain"
    />
    <span v-else aria-hidden="true">{{ props.emoji }}</span>
    <span aria-hidden="true" class="text-xs font-semibold">{{
      props.count
    }}</span>
  </button>
</template>
