<script setup lang="ts">
import { DialogDescription, type DialogDescriptionProps } from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * Reka links it to the dialog with `aria-describedby`. A drawer without one
 * passes `:aria-describedby="undefined"` to `DrawerContent` to say so.
 */
const props = defineProps<
  DialogDescriptionProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
</script>

<template>
  <DialogDescription
    v-bind="delegated"
    :class="cn('m-0 text-sm leading-5 text-newt-text-secondary', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
