<script setup lang="ts">
import { Progress, ProgressLabel } from "@/lib/registry/default/ui/progress"
</script>

<template>
  <div class="w-full max-w-sm">
    <ProgressLabel>
      <span>Label</span>
      <span>50%</span>
    </ProgressLabel>
    <Progress :value="50" />
  </div>
</template>
