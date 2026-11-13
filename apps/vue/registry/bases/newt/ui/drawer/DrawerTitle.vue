<script setup lang="ts">
import { DialogTitle, type DialogTitleProps } from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/* The dialog's accessible name. Give it real text. */
const props = defineProps<
  DialogTitleProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
</script>

<template>
  <DialogTitle
    v-bind="delegated"
    :class="cn('m-0 text-base font-semibold leading-5', props.class)"
  >
    <slot />
  </DialogTitle>
</template>
