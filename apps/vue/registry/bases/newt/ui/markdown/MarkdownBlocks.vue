<script setup lang="ts">
import { computed, inject } from "vue"
import {
  CodeBlock,
  type CodeLanguage,
} from "~~/registry/bases/newt/ui/code-block"

import { cn } from "@/lib/utils"

import { HEADING_SIZES, HIGHLIGHTED_LANGUAGES, MARKDOWN_CONTEXT_KEY } from "."
import type { MarkdownBlock } from "./markdown-syntax"
import MarkdownInline from "./MarkdownInline.vue"

const props = defineProps<{ blocks: readonly MarkdownBlock[] }>()

const useContext = inject(MARKDOWN_CONTEXT_KEY)
const context = computed(() => useContext?.())

function headingTag(level: 1 | 2 | 3): string {
  return `h${Math.min(6, level + (context.value?.headingOffset ?? 2))}`
}

function language(value: string | undefined): CodeLanguage | undefined {
  // SAFETY: membership in `HIGHLIGHTED_LANGUAGES` is exactly `CodeLanguage`.
  return value !== undefined && HIGHLIGHTED_LANGUAGES.has(value)
    ? (value as CodeLanguage)
    : undefined
}
</script>

<template>
  <template v-for="(block, index) in props.blocks" :key="index">
    <p
      v-if="block.type === 'paragraph'"
      :class="cn('m-0', context?.jumbo && 'text-5xl leading-tight')"
    >
      <MarkdownInline :nodes="block.children" />
    </p>
    <component
      :is="headingTag(block.level)"
      v-else-if="block.type === 'heading'"
      :class="
        cn(
          'mb-1 mt-2 font-bold leading-[1.375] text-newt-text-primary first:mt-0',
          HEADING_SIZES[block.level]
        )
      "
    >
      <MarkdownInline :nodes="block.children" />
    </component>
    <p
      v-else-if="block.type === 'subtext'"
      class="m-0 text-[13px] leading-[1.3] text-newt-text-muted"
    >
      <MarkdownInline :nodes="block.children" />
    </p>
    <blockquote
      v-else-if="block.type === 'quote'"
      class="my-0.5 border-0 border-s-4 border-solid border-newt-border ps-3"
    >
      <MarkdownBlocks :blocks="block.children" />
    </blockquote>
    <ol
      v-else-if="block.type === 'list' && block.ordered"
      :start="block.start === 1 ? undefined : block.start"
      class="my-1 list-decimal ps-6 marker:text-newt-text-muted"
    >
      <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
        <MarkdownInline :nodes="item.children" />
      </li>
    </ol>
    <ul
      v-else-if="block.type === 'list'"
      class="my-1 list-disc ps-6 marker:text-newt-text-muted"
    >
      <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
        <MarkdownInline :nodes="item.children" />
      </li>
    </ul>
    <template v-else-if="block.type === 'codeBlock'">
      <CodeBlock
        v-if="language(block.language)"
        class="my-1.5"
        :language="language(block.language)"
        :code="block.content"
      />
      <CodeBlock v-else class="my-1.5">{{ block.content }}</CodeBlock>
    </template>
  </template>
</template>
