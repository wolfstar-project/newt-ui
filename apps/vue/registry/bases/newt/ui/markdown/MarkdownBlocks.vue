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

const props = withDefaults(
  defineProps<{
    blocks: readonly MarkdownBlock[]
    /** How many lists hold these blocks; picks the bullet. */
    depth?: number
  }>(),
  { depth: 0 }
)

/* The client's bullets by depth: disc, then circle, then square. */
const BULLETS = ["list-disc", "list-[circle]", "list-[square]"] as const

function bullet(depth: number): string {
  return BULLETS[Math.min(depth, BULLETS.length - 1)] ?? "list-disc"
}

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
      :class="
        cn(
          'm-0 whitespace-pre-wrap',
          context?.jumbo && 'text-5xl leading-tight'
        )
      "
    >
      <MarkdownInline :nodes="block.children" />
    </p>
    <component
      :is="headingTag(block.level)"
      v-else-if="block.type === 'heading'"
      :class="
        cn(
          'mb-1 mt-2 whitespace-pre-wrap font-bold leading-[1.375] text-newt-text-primary first:mt-0',
          HEADING_SIZES[block.level]
        )
      "
    >
      <MarkdownInline :nodes="block.children" />
    </component>
    <p
      v-else-if="block.type === 'subtext'"
      class="m-0 whitespace-pre-wrap text-[13px] leading-[1.3] text-newt-text-muted"
    >
      <MarkdownInline :nodes="block.children" />
    </p>
    <blockquote
      v-else-if="block.type === 'quote'"
      class="my-0.5 border-0 border-s-4 border-solid border-newt-border ps-3"
    >
      <MarkdownBlocks :blocks="block.children" />
    </blockquote>
    <component
      :is="block.ordered ? 'ol' : 'ul'"
      v-else-if="block.type === 'list'"
      :start="block.ordered && block.start !== 1 ? block.start : undefined"
      :class="
        cn('mb-0 mt-1 ps-4', block.ordered ? 'list-decimal' : bullet(depth))
      "
    >
      <li
        v-for="(item, itemIndex) in block.items"
        :key="itemIndex"
        class="mb-1 whitespace-pre-wrap"
      >
        <MarkdownInline :nodes="item.children" />
        <MarkdownBlocks
          v-if="item.sublist"
          :blocks="[item.sublist]"
          :depth="depth + 1"
        />
      </li>
    </component>
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
