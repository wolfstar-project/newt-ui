<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import type { CodeTokenSpec } from "."
import CodeToken from "./CodeToken.vue"

/*
 * `tokens` is the syntax most callers want: a flat list of runs, including
 * the line breaks as `{ text: "\n" }`. A highlighter (or a hand-written
 * token list) produces one array, with no whitespace-sensitive template
 * markup to get exactly right — the default slot still renders as-is for
 * anything composed by hand.
 */
const props = defineProps<{
  class?: HTMLAttributes["class"]
  tokens?: readonly CodeTokenSpec[]
}>()
</script>

<template>
  <pre
    :class="
      cn(
        'overflow-x-auto rounded-md border border-newt-border bg-[#111214] p-4 font-mono text-[13px] leading-[1.6] text-newt-text-secondary',
        props.class
      )
    "
  ><template v-if="props.tokens"><template v-for="(token, index) in props.tokens" :key="index"><CodeToken v-if="token.kind" :kind="token.kind">{{ token.text }}</CodeToken><template v-else>{{ token.text }}</template></template></template><slot v-else /></pre>
</template>
