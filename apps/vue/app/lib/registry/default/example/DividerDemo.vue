<script setup lang="ts">
import { Divider } from "@/lib/registry/default/ui/divider"
</script>

<template>
  <div class="w-full max-w-sm">
    <Divider>SECTION LABEL</Divider>
    <Divider spacing="sm" />
    <Divider spacing="lg" :line="false">SPACING ONLY</Divider>
  </div>
</template>
