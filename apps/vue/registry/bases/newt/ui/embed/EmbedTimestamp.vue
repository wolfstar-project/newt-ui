<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** The moment to render. Anything `new Date()` accepts. */
    date: Date | number | string
    /**
     * Locale of the text. Pass a fixed value, not the browser's language, so
     * the server and the browser write the same text.
     */
    locale?: string
    /**
     * Time zone of the text, such as `"Europe/Paris"`. Defaults to the zone of
     * the runtime. Set it when the server and the browser sit in other zones.
     */
    timeZone?: string
    /** Builds the text from the date. Wins over `locale` and `timeZone`. */
    formatter?: (date: Date) => string
  }>(),
  { locale: "en-US" }
)

/*
 * A fixed locale, not the visitor's: an embed rendered on the server and
 * hydrated in the browser has to produce the same string in both places.
 */
const format = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: props.timeZone,
    })
)

const value = computed(() =>
  props.date instanceof Date ? props.date : new Date(props.date)
)
const valid = computed(() => !Number.isNaN(value.value.getTime()))
const text = computed(() => {
  if (!valid.value) return ""
  return props.formatter?.(value.value) ?? format.value.format(value.value)
})
</script>

<template>
  <time
    :datetime="valid ? value.toISOString() : undefined"
    :class="cn(props.class)"
  >
    <slot>{{ text }}</slot>
  </time>
</template>
