<script setup lang="ts">
import {
  TooltipContent,
  TooltipPortal,
  useForwardPropsEmits,
  type TooltipContentEmits,
  type TooltipContentProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<
    TooltipContentProps & {
      class?: HTMLAttributes["class"]
      /**
       * The element it is portalled into. Defaults to `body`; pass the
       * enclosing native `<dialog>` or a themed wrapper to keep it there.
       */
      container?: string | HTMLElement
    }
  >(),
  { sideOffset: 8 }
)
const emits = defineEmits<TooltipContentEmits>()

const delegated = computed(() => {
  const { class: _class, container: _container, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <TooltipPortal :to="props.container">
    <TooltipContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'z-[120] whitespace-nowrap rounded-sm bg-[#111214] px-2.5 py-1.5 text-xs font-medium text-newt-text-primary shadow-elevation-high',
          props.class
        )
      "
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
