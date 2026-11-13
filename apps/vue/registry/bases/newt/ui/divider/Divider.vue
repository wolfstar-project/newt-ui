<script setup lang="ts">
import { Separator, type SeparatorProps } from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { dividerVariants, type DividerVariants } from "."

/*
 * Reka owns the semantics: `role="separator"`, `aria-orientation` when it is
 * vertical, and no role at all when it is `decorative`. Only the look is
 * newt/ui's.
 */
const props = withDefaults(
  defineProps<
    SeparatorProps & {
      class?: HTMLAttributes["class"]
      spacing?: DividerVariants["spacing"]
      line?: boolean
    }
  >(),
  { line: true }
)

const delegated = computed(() => {
  const { class: _class, spacing: _spacing, line: _line, ...rest } = props
  return rest
})
</script>

<template>
  <Separator
    v-bind="delegated"
    :class="
      cn(
        dividerVariants({ spacing: props.spacing, line: props.line }),
        props.class
      )
    "
  >
    <slot />
  </Separator>
</template>
