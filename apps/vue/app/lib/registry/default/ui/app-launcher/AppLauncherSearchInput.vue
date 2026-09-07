<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <input
    type="search"
    autocomplete="off"
    spellcheck="false"
    :class="
      cn(
        'h-11 w-full appearance-none rounded-md border-2 border-transparent bg-newt-bg-input py-0 ps-11 pe-3 text-base text-newt-text-primary outline-none',
        'placeholder:text-newt-text-muted focus:border-newt-brand',
        props.class
      )
    "
  />
</template>
