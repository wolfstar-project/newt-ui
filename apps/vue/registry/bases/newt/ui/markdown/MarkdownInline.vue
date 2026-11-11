<script setup lang="ts">
import { computed, inject } from "vue"
import { CustomEmoji } from "~~/registry/bases/newt/ui/custom-emoji"
import { InlineCode } from "~~/registry/bases/newt/ui/inline-code"
import { Mention } from "~~/registry/bases/newt/ui/mention"
import { Spoiler } from "~~/registry/bases/newt/ui/spoiler"
import { Timestamp } from "~~/registry/bases/newt/ui/timestamp"

import { MARKDOWN_CONTEXT_KEY, MENTION_PREFIX, mentionTarget } from "."
import type { MarkdownInline as MarkdownInlineNode } from "./markdown-syntax"

const props = defineProps<{ nodes: readonly MarkdownInlineNode[] }>()

const useContext = inject(MARKDOWN_CONTEXT_KEY)
const context = computed(() => useContext?.())

function onLinkClick(event: MouseEvent, url: string, masked: boolean) {
  if (context.value?.interceptLink(url, masked)) event.preventDefault()
}

function emojiSrc(node: MarkdownInlineNode): string | undefined {
  return node.type === "emoji" ? context.value?.resolveEmoji?.(node) : undefined
}
</script>

<template>
  <template v-for="(node, index) in props.nodes" :key="index">
    <template v-if="node.type === 'text'">{{ node.content }}</template>
    <br v-else-if="node.type === 'br'" />
    <strong v-else-if="node.type === 'strong'" class="font-bold">
      <MarkdownInline :nodes="node.children" />
    </strong>
    <em v-else-if="node.type === 'em'"
      ><MarkdownInline :nodes="node.children"
    /></em>
    <span v-else-if="node.type === 'underline'" class="underline">
      <MarkdownInline :nodes="node.children" />
    </span>
    <s v-else-if="node.type === 'strike'"
      ><MarkdownInline :nodes="node.children"
    /></s>
    <Spoiler v-else-if="node.type === 'spoiler'">
      <MarkdownInline :nodes="node.children" />
    </Spoiler>
    <InlineCode v-else-if="node.type === 'code'">{{ node.content }}</InlineCode>
    <a
      v-else-if="node.type === 'link'"
      :href="node.url"
      target="_blank"
      rel="noopener noreferrer"
      :title="node.masked ? node.url : undefined"
      class="text-newt-text-link no-underline hover:underline"
      @click="onLinkClick($event, node.url, node.masked)"
    >
      <MarkdownInline :nodes="node.children" />
    </a>
    <Mention
      v-else-if="node.type === 'mention' && context"
      :as="context.mentionsInteractive ? 'button' : 'span'"
      :variant="node.kind"
      :color="
        node.kind === 'role'
          ? mentionTarget(context, node.kind, node.id).color
          : undefined
      "
      :avatar="
        node.kind === 'user'
          ? mentionTarget(context, node.kind, node.id).avatar
          : undefined
      "
      @click="
        context.mentionsInteractive &&
        context.onMentionClick({ kind: node.kind, id: node.id })
      "
      >{{ MENTION_PREFIX[node.kind]
      }}{{ mentionTarget(context, node.kind, node.id).name }}</Mention
    >
    <Mention v-else-if="node.type === 'everyone'" as="span" variant="user"
      >@{{ node.name }}</Mention
    >
    <Mention v-else-if="node.type === 'command'" as="span" variant="app"
      >/{{ node.name }}</Mention
    >
    <template v-else-if="node.type === 'emoji'">
      <CustomEmoji
        v-if="emojiSrc(node)"
        :name="node.name"
        :src="emojiSrc(node) ?? ''"
        :size="context?.jumbo ? 'jumbo' : 'inline'"
      />
      <template v-else>:{{ node.name }}:</template>
    </template>
    <Timestamp
      v-else-if="node.type === 'timestamp'"
      :value="node.value"
      :format="node.format"
      :locale="context?.locale"
    />
  </template>
</template>
