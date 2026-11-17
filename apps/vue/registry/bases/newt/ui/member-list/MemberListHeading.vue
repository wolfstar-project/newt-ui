<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { memberListSectionKey } from "."

/*
 * Inside a section the heading takes the id the section generated, so the
 * list beside it is named by it. If you pass an `id` of your own, pass the
 * same id as `aria-labelledby` on the `MemberList`.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** The heading level. Pick the one that fits the outline of the page. */
    as?: "h2" | "h3" | "h4" | "h5" | "h6"
    id?: string
  }>(),
  { as: "h3" }
)

const headingId = inject(memberListSectionKey, undefined)
</script>

<template>
  <component
    :is="props.as"
    :id="props.id ?? headingId"
    :class="
      cn(
        'm-0 px-2 pb-0.5 text-[12px] font-semibold uppercase leading-4 tracking-[0.02em] text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </component>
</template>
