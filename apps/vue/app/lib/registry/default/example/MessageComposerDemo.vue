<script setup lang="ts">
import { ref } from "vue"

import { MessageComposer } from "@/lib/registry/default/ui/message-composer"

const value = ref("")
</script>

<template>
  <MessageComposer
    v-model="value"
    channel-name="general"
    class="w-full max-w-md"
    @submit="value = ''"
  />
</template>
