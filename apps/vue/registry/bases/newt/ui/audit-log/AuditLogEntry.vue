<script setup lang="ts">
import {
  Comment,
  computed,
  Fragment,
  useSlots,
  type HTMLAttributes,
  type VNode,
} from "vue"
import { Avatar } from "~~/registry/bases/newt/ui/avatar"

import { cn } from "@/lib/utils"

import type { AuditLogKind } from "."

/*
 * An entry with changes (anything in the default slot) is a native
 * `<details>`, so it opens with Enter or Space and needs no script; one
 * without is a plain row. An `avatar` slot replaces the initial avatar.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Who did it. The first letter is the avatar's fallback. */
    actor: string
    /** What they did, as the middle of a sentence: "updated the role". */
    action: string
    /** What they did it to. */
    target?: string
    kind?: AuditLogKind
    /** The time as the reader should see it. */
    time: string
    /** The same moment in machine form, for the `<time>` element. */
    dateTime?: string
    /** Read by a screen reader in place of the kind's shape. */
    kindLabel?: string
    /** Start with the changes showing. */
    defaultOpen?: boolean
  }>(),
  { kind: "update", defaultOpen: false }
)

/* One shape per kind, so three colours are never the only difference. */
const KIND = {
  create: {
    className: "text-newt-online",
    label: "Added",
    path: "M8 2a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H9v4a1 1 0 1 1-2 0V9H3a1 1 0 0 1 0-2h4V3a1 1 0 0 1 1-1Z",
  },
  update: {
    className: "text-newt-idle",
    label: "Updated",
    path: "M8 2.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5Zm0 2.5a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5Z",
  },
  delete: {
    className: "text-newt-danger",
    label: "Removed",
    path: "M3 7h10a1 1 0 1 1 0 2H3a1 1 0 0 1 0-2Z",
  },
} as const

const mark = computed(() => KIND[props.kind])

/*
 * Whether the default slot rendered anything. A slot that is passed but
 * empty, such as a `v-for` over no changes, is truthy as a function and
 * yields only comments or empty fragments, which must not make the entry
 * expandable.
 */
const slots = useSlots()

function rendersSomething(nodes: readonly VNode[]): boolean {
  return nodes.some((node) => {
    if (node.type === Comment) return false
    if (node.type === Fragment) {
      return Array.isArray(node.children) && node.children.length > 0
    }
    return true
  })
}

const expandable = computed(() => rendersSomething(slots.default?.() ?? []))

const summaryClassName =
  "flex list-none items-center gap-2.5 px-3 py-2.5 text-sm leading-5 text-newt-text-secondary [&::-webkit-details-marker]:hidden"
</script>

<template>
  <li
    :data-kind="props.kind"
    :class="
      cn(
        'overflow-hidden rounded-md border border-newt-border bg-newt-bg-surface',
        props.class
      )
    "
  >
    <component
      :is="expandable ? 'details' : 'div'"
      :open="expandable && props.defaultOpen ? true : undefined"
      class="group"
    >
      <component
        :is="expandable ? 'summary' : 'div'"
        :class="
          cn(
            summaryClassName,
            expandable &&
              'cursor-pointer hover:bg-newt-bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link'
          )
        "
      >
        <span :class="cn('inline-flex shrink-0', mark.className)">
          <svg viewBox="0 0 16 16" aria-hidden="true" class="h-4 w-4">
            <path fill="currentColor" fill-rule="evenodd" :d="mark.path" />
          </svg>
          <span class="sr-only">{{ props.kindLabel ?? mark.label }}</span>
        </span>
        <slot name="avatar">
          <Avatar size="sm">{{ props.actor.slice(0, 1).toUpperCase() }}</Avatar>
        </slot>
        <span class="min-w-0 flex-1">
          <strong class="font-semibold text-newt-text-primary">{{
            props.actor
          }}</strong>
          {{ " " }}{{ props.action }}
          <template v-if="props.target !== undefined">
            {{ " " }}
            <strong class="font-semibold text-newt-text-primary">{{
              props.target
            }}</strong>
          </template>
        </span>
        <time
          :datetime="props.dateTime"
          class="shrink-0 text-xs text-newt-text-muted"
        >
          {{ props.time }}
        </time>
        <svg
          v-if="expandable"
          viewBox="0 0 16 16"
          aria-hidden="true"
          class="h-3.5 w-3.5 shrink-0 text-newt-text-muted group-open:rotate-90 rtl:-scale-x-100 rtl:group-open:scale-x-100"
        >
          <path
            fill="currentColor"
            d="M5.3 3.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4L8.6 8 5.3 4.7a1 1 0 0 1 0-1.4Z"
          />
        </svg>
      </component>
      <ol
        v-if="expandable"
        class="m-0 flex flex-col gap-1 pb-3 pe-3 ps-12 pt-1 text-[13px] leading-[18px] text-newt-text-secondary [list-style:decimal-leading-zero_inside]"
      >
        <slot />
      </ol>
    </component>
  </li>
</template>
