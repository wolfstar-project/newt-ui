<script setup lang="ts">
import {
  ContextMenuContent,
  ContextMenuPortal,
  useForwardPropsEmits,
  type ContextMenuContentEmits,
  type ContextMenuContentProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

defineOptions({ inheritAttrs: false })

const props = defineProps<
  ContextMenuContentProps & {
    class?: HTMLAttributes["class"]
    /**
     * The element it is portalled into. Defaults to `body`; pass the
     * enclosing native `<dialog>` or a themed wrapper to keep it there.
     */
    container?: string | HTMLElement
  }
>()
const emits = defineEmits<ContextMenuContentEmits>()

const delegated = computed(() => {
  const { class: _class, container: _container, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <ContextMenuPortal :to="props.container">
    <ContextMenuContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'z-[110] w-[188px] rounded-md border border-newt-border bg-newt-bg-floating p-1.5 shadow-elevation-high outline-none',
          props.class
        )
      "
    >
      <slot />
    </ContextMenuContent>
  </ContextMenuPortal>
</template>
