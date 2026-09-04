<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

import type { SlashCommandOption } from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Command name rendered after the leading slash. */
    name: string
    /** Subcommand segment, e.g. `/ban member`. */
    subcommand?: string
    /** Subcommand group segment, e.g. `/settings roles add`. */
    subcommandGroup?: string
    options?: readonly SlashCommandOption[]
  }>(),
  { options: () => [] }
)

/** `/name group sub` — the segments a caller can actually reach. */
const path = computed(() =>
  [props.name, props.subcommandGroup, props.subcommand]
    .filter(Boolean)
    .join(" ")
)

const label = computed(() => {
  const spoken = props.options
    .map(
      (option) =>
        `${option.name}: ${option.value ?? option.description ?? option.name}`
    )
    .join(" ")
  return `Slash command /${path.value}${spoken ? ` ${spoken}` : ""}`
})
</script>

<template>
  <span
    role="group"
    :aria-label="label"
    :class="
      cn(
        'inline-flex flex-wrap items-center gap-1 rounded-sm bg-[color-mix(in_srgb,var(--newt-brand)_15%,transparent)] py-[2px] pl-[6px] pr-2 font-mono text-[13px] text-newt-mention-text',
        props.class
      )
    "
  >
    <span class="opacity-80" aria-hidden="true">/</span>
    <span class="font-semibold">{{ props.name }}</span>
    <span v-if="props.subcommandGroup" class="font-semibold">
      {{ props.subcommandGroup }}
    </span>
    <span v-if="props.subcommand" class="font-semibold">
      {{ props.subcommand }}
    </span>
    <span
      v-for="option of props.options"
      :key="option.name"
      :class="
        cn(
          'inline-flex items-center gap-1',
          // The option the caret currently sits in.
          option.focused &&
            'rounded-sm bg-[color-mix(in_srgb,var(--newt-brand)_35%,transparent)] px-0.5'
        )
      "
    >
      <span class="text-newt-text-muted after:content-[':']">
        {{ option.name }}
      </span>
      <span v-if="option.value" class="font-medium text-newt-text-primary">
        {{ option.value }}
      </span>
      <!-- No value yet — the option's description stands in. -->
      <span v-else class="italic text-newt-text-muted">
        {{ option.description ?? option.name }}
      </span>
    </span>
  </span>
</template>
