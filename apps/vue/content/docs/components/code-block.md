---
title: Code Block
description: A monospace preformatted block with optional syntax-highlight tokens.
---

<ComponentPreview name="CodeBlockDemo" />

## Installation

```bash
npx newt-ui-vue@latest add code-block
```

## Usage

```vue
<script setup lang="ts">
import { CodeBlock, CodeToken } from "@/components/ui/code-block"
</script>

<template>
  <CodeBlock
    ><CodeToken kind="comment">// example</CodeToken>
    <CodeToken kind="keyword">const</CodeToken>
    <CodeToken kind="function">greet</CodeToken> = () =>
    <CodeToken kind="string">"hello"</CodeToken>;</CodeBlock
  >
</template>
```

`CodeToken` accepts `kind="keyword" | "string" | "comment" | "function"`.
