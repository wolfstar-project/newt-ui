<script setup lang="ts">
import type { HTMLAttributes, VNode } from "vue"

import { cn } from "@/lib/utils"

/*
 * The row is a wrapper that holds the item's button and, beside it, the
 * `#trailing` content. A control in `#trailing` is then not nested in the
 * button. The button's `::after` covers the whole row, so a press anywhere
 * else on the row, a chevron included, presses the button. `class` styles
 * the row; the other attributes go to the button.
 */
defineOptions({ inheritAttrs: false })

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
  /**
   * Content after the text, such as a chevron or a visibility toggle. It sits
   * beside the item's button, so it can hold a control of its own.
   */
  trailing?: () => VNode[]
}>()
</script>

<template>
  <div
    :class="
      cn(
        'relative flex w-full items-center transition-colors duration-fast ease-newt',
        props.variant === 'tile'
          ? 'flex-col gap-2 rounded-[var(--newt-radius-md)] bg-newt-bg-elevated px-2 py-3'
          : 'gap-3 px-3 py-3',
        'hover:bg-newt-bg-hover',
        props.class
      )
    "
  >
    <button
      type="button"
      v-bind="$attrs"
      :class="
        cn(
          'flex min-w-0 cursor-pointer items-center border-0 bg-transparent p-0 outline-none',
          props.variant === 'tile'
            ? 'w-full flex-col gap-2 text-center after:rounded-[var(--newt-radius-md)]'
            : 'flex-1 gap-3 text-start',
          'after:absolute after:inset-0',
          'focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-newt-text-link'
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
    </button>
    <!-- A press passes through to the button, unless it lands on a control. -->
    <span
      v-if="$slots.trailing"
      class="pointer-events-none inline-flex shrink-0 items-center gap-1 text-newt-text-muted [&>svg]:h-5 [&>svg]:w-5 [&_:is(a,button,input,label,select,textarea)]:pointer-events-auto [&_:is(a,button,input,label,select,textarea)]:relative"
    >
      <slot name="trailing" />
    </span>
  </div>
</template>
