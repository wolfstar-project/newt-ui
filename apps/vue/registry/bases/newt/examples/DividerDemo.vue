<script setup lang="ts">
import { Divider } from "~~/registry/bases/newt/ui/divider"
</script>

<template>
  <div class="w-full max-w-sm text-sm text-newt-text-secondary">
    <Divider>SECTION LABEL</Divider>
    <Divider spacing="sm" />
    <Divider spacing="lg" :line="false">SPACING ONLY</Divider>
    <p class="m-0">Above a small separator</p>
    <Divider spacing="small" />
    <p class="m-0">Between a small and a large separator</p>
    <Divider spacing="large" />
    <p class="m-0">Below a large separator</p>
  </div>
</template>
