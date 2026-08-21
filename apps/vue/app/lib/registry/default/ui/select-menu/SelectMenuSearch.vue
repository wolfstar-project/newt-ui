<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: HTMLAttributes["class"]
  wrapperClass?: HTMLAttributes["class"]
  placeholder?: string
}>()

const model = defineModel<string>({ default: "" })
</script>

<template>
  <div
    :class="
      cn(
        'mb-1 flex items-center gap-2 rounded-sm bg-newt-bg-base px-2.5 py-1.5',
        props.wrapperClass
      )
    "
  >
    <input
      v-model="model"
      type="text"
      :placeholder="props.placeholder"
      v-bind="$attrs"
      :class="
        cn(
          'w-full border-0 bg-transparent font-sans text-sm text-newt-text-primary outline-none placeholder:text-newt-text-muted',
          props.class
        )
      "
    />
  </div>
</template>
