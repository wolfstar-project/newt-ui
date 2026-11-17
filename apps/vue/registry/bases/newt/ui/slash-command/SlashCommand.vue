<script setup lang="ts">
import type { HTMLAttributes, VNode } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

import {
  defaultSlashCommandLabel,
  type SlashCommandLabelState,
  type SlashCommandOption,
} from "."

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
    /** Builds the accessible name; `aria-label` still wins when both are set. */
    formatLabel?: (state: SlashCommandLabelState) => string
  }>(),
  { options: () => [], formatLabel: defaultSlashCommandLabel }
)

defineSlots<{
  /** Content that follows the command inside the chip, after a space. */
  default?: () => VNode[]
}>()

/** `/name group sub` — the segments a caller can actually reach. */
const path = computed(() =>
  [props.name, props.subcommandGroup, props.subcommand]
    .filter(Boolean)
    .join(" ")
)

const label = computed(() =>
  props.formatLabel({ path: path.value, options: props.options })
)
</script>

<!--
  The separators are real text: a space between two parts and a colon after an
  option name, so a copy, a search and a test read `/ban member user:@username`.
  The chip is inline content, because a flex row drops the space between two
  items. `word-spacing` draws each space 4px wide (a space is 1ch in a
  monospace font), and every child resets it, so only the spaces between the
  parts are narrowed. Each part is its own run of text, so a right-to-left chip
  orders its parts from the right, as a flex row did.

  Each space is written as an interpolation. The compiler removes a line break
  between two elements, so a space typed in the template would not survive.
-->
<template>
  <span
    role="group"
    :aria-label="label"
    :class="
      cn(
        'inline-block rounded-[var(--newt-radius-sm)] bg-[color-mix(in_srgb,var(--newt-brand)_15%,transparent)] py-[2px] ps-[6px] pe-2 font-[family-name:var(--newt-font-mono)] text-[13px] text-newt-mention-text [word-spacing:calc(4px_-_1ch)] [&>*]:[word-spacing:normal] [&>*]:[unicode-bidi:isolate]',
        props.class
      )
    "
  >
    <!-- No space follows the slash, so the text reads `/ban`. -->
    <span class="me-1 opacity-80" aria-hidden="true">/</span>
    <span class="font-semibold">{{ props.name }}</span>
    <template v-if="props.subcommandGroup"
      >{{ " "
      }}<span class="font-semibold">{{ props.subcommandGroup }}</span></template
    >
    <template v-if="props.subcommand"
      >{{ " "
      }}<span class="font-semibold">{{ props.subcommand }}</span></template
    >
    <template v-for="option of props.options" :key="option.name"
      >{{ " "
      }}<span
        :class="
          cn(
            'inline-block [&>*]:[unicode-bidi:isolate]',
            // The option the caret currently sits in.
            option.focused &&
              'rounded-[var(--newt-radius-sm)] bg-[color-mix(in_srgb,var(--newt-brand)_35%,transparent)] px-0.5'
          )
        "
      >
        <span class="text-newt-text-muted">{{ `${option.name}:` }}</span>
        <span
          v-if="option.value"
          class="ms-1 font-medium text-newt-text-primary"
        >
          {{ option.value }}
        </span>
        <!-- No value yet — the option's description stands in. -->
        <span v-else class="ms-1 italic text-newt-text-muted">
          {{ option.description ?? option.name }}
        </span>
      </span></template
    >
    <template v-if="$slots.default"
      >{{ " " }}<span><slot /></span
    ></template>
  </span>
</template>
