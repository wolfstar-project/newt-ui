<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** Accent colour of the left bar; defaults to the surface border. */
  accentColor?: string
}>()

const style = computed(
  () =>
    // SAFETY: Vue forwards unknown `--*` keys to the DOM verbatim, so a custom
    // property is a valid style entry even though the type omits it.
    ({
      "--newt-v2-accent": props.accentColor ?? "var(--newt-border)",
    }) as CSSProperties
)
</script>

<template>
  <!--
    The Components V2 container: an accent-barred block that groups text,
    separators and action rows inside a single message.
  -->
  <div
    :style="style"
    :class="
      cn(
        'mt-1 flex max-w-[520px] flex-col gap-2 rounded-sm border-l-4 border-[var(--newt-v2-accent)] bg-newt-bg-surface p-3 text-sm leading-relaxed text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
