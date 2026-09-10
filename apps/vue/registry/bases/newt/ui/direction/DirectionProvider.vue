<script setup lang="ts">
import { provide, toRef } from "vue"

import { DIRECTION_KEY, type Direction } from "./useDirection"

/*
 * Every component is written with logical properties, so a right-to-left tree
 * needs no per-component override — only a `dir` attribute somewhere above it.
 * This is that attribute, plus the injection a component reads when it has to
 * make a decision the CSS cannot.
 */
const props = defineProps<{ dir: Direction }>()

provide(DIRECTION_KEY, toRef(props, "dir"))
</script>

<template>
  <div :dir="props.dir">
    <slot />
  </div>
</template>
