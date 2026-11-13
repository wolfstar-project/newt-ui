<script setup lang="ts">
import {
  AvatarImage,
  useForwardPropsEmits,
  type AvatarImageEmits,
  type AvatarImageProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<
    AvatarImageProps & {
      class?: HTMLAttributes["class"]
      /** Accessible name of the image. Leave it empty beside a visible name. */
      alt?: string
    }
  >(),
  { alt: "" }
)
const emits = defineEmits<AvatarImageEmits>()

const delegated = computed(() => {
  const { class: _class, alt: _alt, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <!--
    Reka puts `role="img"` on the image. An image with no name is decoration,
    so it takes `presentation` and a screen reader skips it.
  -->
  <AvatarImage
    v-bind="forwarded"
    :alt="props.alt"
    :role="props.alt ? 'img' : 'presentation'"
    :class="cn('h-full w-full object-cover', props.class)"
  />
</template>
