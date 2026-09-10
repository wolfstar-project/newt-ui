<script setup lang="ts">
import {
  ThreadPreview,
  ThreadPreviewCount,
  ThreadPreviewLast,
  ThreadPreviewName,
  ThreadPreviewSpine,
} from "~~/registry/bases/newt/ui/thread-preview"
</script>

<template>
  <ThreadPreview href="#thread">
    <ThreadPreviewSpine />
    <ThreadPreviewName>release-notes</ThreadPreviewName>
    <ThreadPreviewCount :count="14" />
    <ThreadPreviewLast>someone: shipping it tonight</ThreadPreviewLast>
  </ThreadPreview>
</template>
