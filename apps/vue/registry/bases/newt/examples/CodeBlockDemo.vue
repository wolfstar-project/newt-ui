<script setup lang="ts">
import { CodeBlock, CodeToken } from "~~/registry/bases/newt/ui/code-block"
</script>

<template>
  <CodeBlock
    ><CodeToken kind="comment">// example</CodeToken>{{ "\n"
    }}<CodeToken kind="keyword">const</CodeToken>{{ " "
    }}<CodeToken kind="function">greet</CodeToken>{{ " = () => "
    }}<CodeToken kind="string">"hello"</CodeToken>;</CodeBlock
  >
</template>
