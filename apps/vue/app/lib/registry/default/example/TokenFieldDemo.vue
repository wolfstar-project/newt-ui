<script setup lang="ts">
import { Label } from "@/lib/registry/default/ui/form-fields"
import { TokenField } from "@/lib/registry/default/ui/token-field"
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-2">
    <Label for="newt-token-example">Bot token</Label>
    <TokenField
      id="newt-token-example"
      value="MTA4NzY1NDMyMTA5ODc2NTQzMjE.GxYzAb.c0d3-s3cr3t-t0k3n"
    />
  </div>
</template>
