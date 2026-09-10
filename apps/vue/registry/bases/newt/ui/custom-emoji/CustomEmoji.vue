<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { customEmojiVariants, type CustomEmojiVariants } from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    src: string
    /** The name between the colons, without them. */
    name: string
    size?: CustomEmojiVariants["size"]
  }>(),
  { size: "inline" }
)
</script>

<template>
  <!--
    `:name:` rather than the bare name: it is what the author typed, and it
    reads as an emoji rather than as a stray word in the sentence.
  -->
  <img
    :src="props.src"
    :alt="`:${props.name}:`"
    :title="`:${props.name}:`"
    :draggable="false"
    :class="cn(customEmojiVariants({ size: props.size }), props.class)"
  />
</template>
