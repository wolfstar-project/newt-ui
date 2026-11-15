<script setup lang="ts">
import type { HTMLAttributes, VNode } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    name: string
    description?: string
    /** Marks a paid placement, as the client does for promoted apps. */
    promoted?: boolean
    /** Text of the `promoted` badge, also part of the button's name. */
    promotedLabel?: string
    /**
     * `row` puts the icon beside the text. `tile` puts it above, for a
     * `variant="grid"` list.
     */
    variant?: "row" | "tile"
  }>(),
  { promoted: false, promotedLabel: "Promoted", variant: "row" }
)

defineSlots<{
  /** Icon for the app; pair with `<AppLauncherItemIcon>`. */
  icon?: () => VNode[]
  /** Content after the text, such as a chevron or a visibility toggle. */
  trailing?: () => VNode[]
}>()
</script>

<template>
  <button
    type="button"
    :class="
      cn(
        'flex w-full cursor-pointer items-center border-0 transition-colors duration-fast ease-newt',
        props.variant === 'tile'
          ? 'flex-col gap-2 rounded-[var(--newt-radius-md)] bg-newt-bg-elevated px-2 py-3 text-center'
          : 'gap-3 bg-transparent px-3 py-3 text-start',
        'hover:bg-newt-bg-hover',
        'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <slot name="icon" />
    <span
      :class="
        cn(
          'flex min-w-0 flex-col gap-0.5',
          props.variant === 'tile' ? 'w-full' : 'flex-1'
        )
      "
    >
      <span
        :class="
          cn(
            'flex min-w-0 items-center gap-1.5',
            props.variant === 'tile' && 'justify-center'
          )
        "
      >
        <span
          class="truncate text-base font-medium leading-tight text-newt-text-primary"
        >
          {{ props.name }}
        </span>
        <span
          v-if="props.promoted"
          class="shrink-0 rounded-full bg-newt-text-primary px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide text-newt-bg-surface"
        >
          {{ props.promotedLabel }}
        </span>
      </span>
      <span
        v-if="props.description"
        class="truncate text-sm leading-snug text-newt-text-muted"
      >
        {{ props.description }}
      </span>
    </span>
    <span
      v-if="$slots.trailing"
      class="inline-flex shrink-0 items-center gap-1 text-newt-text-muted [&>svg]:h-5 [&>svg]:w-5"
    >
      <slot name="trailing" />
    </span>
  </button>
</template>
