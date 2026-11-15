<script setup lang="ts">
import type { ButtonHTMLAttributes, Component, HTMLAttributes } from "vue"
import {
  Comment,
  computed,
  Fragment,
  isVNode,
  type VNode,
  type VNodeArrayChildren,
} from "vue"

import { cn } from "@/lib/utils"

import { type ButtonVariants, buttonVariants } from "."

const props = withDefaults(
  defineProps<{
    /**
     * The element or component to render. Defaults to `button`, or to `a`
     * when `href` is set; pass `NuxtLink` or `RouterLink` to keep client
     * navigation.
     */
    as?: string | Component
    /** Render a link to this URL. */
    href?: string
    variant?: ButtonVariants["variant"]
    size?: ButtonVariants["size"]
    type?: ButtonHTMLAttributes["type"]
    disabled?: boolean
    class?: HTMLAttributes["class"]
    /** Emoji image URL, rendered before the label. */
    emoji?: string
    /** Accessible name for `emoji`; empty (the default) hides it from readers. */
    emojiAlt?: string
    /** Link-out glyph after the label. Defaults on for `variant="link"`. */
    launchIcon?: boolean
  }>(),
  /*
   * `launchIcon` needs `undefined` to mean "let the variant decide" — but Vue
   * casts an absent prop typed `boolean` to `false` unless it has a `default`
   * key at all, present or not. Listing it here with the value `undefined` is
   * what keeps that cast from firing, so the `??` below ever sees anything
   * but `false`.
   */
  { type: "button", emojiAlt: "", launchIcon: undefined }
)

const slots = defineSlots<{
  /** The label. */
  default?: () => VNode[]
  /** Content before the label, such as an icon component or a unicode emoji. */
  leading?: () => VNode[]
  /** Content after the label, before the link-out glyph. */
  trailing?: () => VNode[]
}>()

/*
 * Whether a slot renders anything. A slot that is passed but empty, such as
 * `<template #leading><Icon v-if="cond" /></template>`, yields only a comment
 * or an empty fragment, and must not leave a box that takes a gap. Of the
 * other child values, these render nothing; any other text renders.
 */
const NOTHING = new Set<unknown>([null, undefined, true, false, ""])

function visible(nodes: VNodeArrayChildren): boolean {
  return nodes.some((node) => {
    if (Array.isArray(node)) return visible(node)
    if (!isVNode(node)) return !NOTHING.has(node)
    if (node.type === Comment) return false
    if (node.type === Fragment) {
      return Array.isArray(node.children) && visible(node.children)
    }
    return true
  })
}

function renders(slot: (() => VNode[]) | undefined): boolean {
  return slot !== undefined && visible(slot())
}

const showLaunch = computed(() => props.launchIcon ?? props.variant === "link")
const tag = computed(
  () => props.as ?? (props.href === undefined ? "button" : "a")
)
/*
 * A link has no `disabled`: it loses its `href` instead, which takes it out of
 * the tab order, and says so with `aria-disabled`.
 */
const isButton = computed(() => tag.value === "button")
</script>

<template>
  <component
    :is="tag"
    :type="isButton ? props.type : undefined"
    :href="props.disabled ? undefined : props.href"
    :disabled="isButton ? props.disabled : undefined"
    :aria-disabled="!isButton && props.disabled ? true : undefined"
    :class="
      cn(
        buttonVariants({ variant: props.variant, size: props.size }),
        props.class
      )
    "
  >
    <img
      v-if="props.emoji"
      :src="props.emoji"
      :alt="props.emojiAlt"
      :aria-hidden="props.emojiAlt === '' ? true : undefined"
      :draggable="false"
      class="h-[1.375em] w-[1.375em] shrink-0 object-contain align-bottom"
    />
    <!--
      Leading and trailing content sit in their own box, so the button's gap
      separates an icon component or a unicode emoji from the label. No label
      box without a label: an empty box would still take a gap.
    -->
    <span
      v-if="renders(slots.leading)"
      class="inline-flex shrink-0 items-center"
    >
      <slot name="leading" />
    </span>
    <span v-if="renders(slots.default)" class="truncate"><slot /></span>
    <span
      v-if="renders(slots.trailing)"
      class="inline-flex shrink-0 items-center"
    >
      <slot name="trailing" />
    </span>
    <!-- The "opens elsewhere" glyph Discord puts on link buttons. -->
    <svg
      v-if="showLaunch"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      class="h-4 w-4 shrink-0"
    >
      <path
        fill="currentColor"
        d="M10 5a1 1 0 0 0 0 2h6.59L4.3 19.3a1 1 0 1 0 1.4 1.4L18 8.42V15a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1h-9Z"
      />
    </svg>
  </component>
</template>
