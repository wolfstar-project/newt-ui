<script setup lang="ts">
import { CodeBlock } from "~~/registry/bases/newt/ui/code-block"

const code = `// example
const greet = (name: string) => \`hello \${name}\`

greet("world")`
</script>

<template>
  <CodeBlock language="ts" :code="code" />
</template>
