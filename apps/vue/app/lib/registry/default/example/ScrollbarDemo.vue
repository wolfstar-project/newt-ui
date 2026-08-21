<script setup lang="ts">
import { ScrollArea } from "@/lib/registry/default/ui/scrollbar"

const messages = Array.from({ length: 24 }, (_, i) => `Message line ${i + 1}`)
</script>

<template>
  <ScrollArea
    class="max-h-[240px] w-full max-w-sm overflow-y-auto rounded-md bg-newt-bg-elevated p-3"
  >
    <ul class="flex flex-col gap-2 text-[14px] text-newt-text-secondary">
      <li v-for="m in messages" :key="m">{{ m }}</li>
    </ul>
  </ScrollArea>
</template>
