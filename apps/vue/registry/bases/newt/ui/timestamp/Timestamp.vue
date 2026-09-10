<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  ref,
  watchEffect,
  type HTMLAttributes,
} from "vue"

import { cn } from "@/lib/utils"

import { relativeTime, timestampFormats, type TimestampStyle } from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** The instant. A number is read as seconds, the way the syntax writes it. */
    value: Date | number
    /** Which of the styles to render. */
    format?: TimestampStyle
    /** Overrides the reader's locale, which is otherwise the browser's. */
    locale?: string
    /**
     * How often a relative timestamp redraws, in milliseconds. Zero freezes
     * it, which is what a server render wants.
     */
    tick?: number
  }>(),
  { format: "shortDateTime", tick: 60_000 }
)

/*
 * A bare number is seconds, not milliseconds: that is what the message syntax
 * carries, and converting here means callers never have to remember which one
 * this component wanted.
 */
const date = computed(() =>
  props.value instanceof Date ? props.value : new Date(props.value * 1000)
)

const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | undefined

watchEffect((onCleanup) => {
  if (props.format !== "relative" || props.tick <= 0) return
  timer = setInterval(() => {
    now.value = new Date()
  }, props.tick)
  onCleanup(() => clearInterval(timer))
})

onBeforeUnmount(() => clearInterval(timer))

const text = computed(() =>
  props.format === "relative"
    ? relativeTime(date.value, now.value, props.locale)
    : new Intl.DateTimeFormat(
        props.locale,
        timestampFormats[props.format]
      ).format(date.value)
)

/*
 * The full instant lives in the tooltip and in `datetime`, so a relative label
 * never hides the thing it is a label for.
 */
const exact = computed(() =>
  new Intl.DateTimeFormat(props.locale, timestampFormats.longDateTime).format(
    date.value
  )
)
</script>

<template>
  <time
    :datetime="date.toISOString()"
    :title="exact"
    :class="
      cn(
        'rounded-sm bg-newt-bg-elevated px-1 text-newt-text-primary',
        props.class
      )
    "
  >
    {{ text }}
  </time>
</template>
