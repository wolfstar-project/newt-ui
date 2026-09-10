<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue"
import { computed, ref, watch } from "vue"

import { cn } from "@/lib/utils"

import { reactionVariants } from "."

const props = withDefaults(
  defineProps<{
    class?: ButtonHTMLAttributes["class"]
    /** Emoji or short text rendered on the left. */
    emoji: string
    /** Number of users who reacted. */
    count: number
    /** Controlled active state (use with v-model:active). */
    active?: boolean
    /** Initial active state when uncontrolled. */
    defaultActive?: boolean
    ariaLabel?: string
  }>(),
  { active: undefined, defaultActive: false }
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
    `${props.emoji} reaction, ${props.count} ${props.count === 1 ? "person" : "people"}${
      isActive.value ? ", you reacted" : ""
    }`
)
</script>

<template>
  <button
    type="button"
    :aria-pressed="isActive"
    :aria-label="label"
    :data-state="isActive ? 'active' : 'inactive'"
    :class="cn(reactionVariants({ active: isActive }), props.class)"
    @click="toggle"
  >
    <span aria-hidden="true">{{ emoji }}</span>
    <span class="text-xs font-semibold">{{ count }}</span>
  </button>
</template>
