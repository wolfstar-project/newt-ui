<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { tokenizeCode, type CodeLanguage, type CodeTokenSpec } from "."
import CodeToken from "./CodeToken.vue"

/*
 * Three ways in, in the order most callers want them: `language` with the
 * source, which the built-in scanner colours; `tokens`, for runs a real
 * highlighter produced; and the default slot, for `CodeToken` children placed
 * by hand.
 */
const props = defineProps<{
  class?: HTMLAttributes["class"]
  language?: CodeLanguage
  code?: string
  tokens?: readonly CodeTokenSpec[]
}>()

const runs = computed<readonly CodeTokenSpec[] | undefined>(() =>
  props.language === undefined
    ? props.tokens
    : tokenizeCode(props.code ?? "", props.language)
)
</script>

<template>
  <pre
    :class="
      cn(
        'overflow-x-auto rounded-md border border-newt-border bg-[#111214] p-4 font-mono text-[13px] leading-[1.6] text-newt-text-secondary',
        props.class
      )
    "
  ><template v-if="runs"><template v-for="(run, index) in runs" :key="index"><CodeToken v-if="run.kind" :kind="run.kind">{{ run.text }}</CodeToken><template v-else>{{ run.text }}</template></template></template><slot v-else /></pre>
</template>
