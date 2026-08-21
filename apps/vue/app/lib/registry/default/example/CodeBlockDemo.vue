<script setup lang="ts">
import { CodeBlock, CodeToken } from "@/lib/registry/default/ui/code-block"
</script>

<template>
  <CodeBlock
    ><CodeToken kind="comment">// example</CodeToken>
    <CodeToken kind="keyword">const</CodeToken>
    <CodeToken kind="function">greet</CodeToken> = () =>
    <CodeToken kind="string">"hello"</CodeToken>;</CodeBlock
  >
</template>
