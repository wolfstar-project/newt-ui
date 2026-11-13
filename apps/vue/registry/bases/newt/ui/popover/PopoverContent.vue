<script setup lang="ts">
import {
  PopoverContent,
  PopoverPortal,
  useForwardPropsEmits,
  type PopoverContentEmits,
  type PopoverContentProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<
    PopoverContentProps & {
      class?: HTMLAttributes["class"]
      /**
       * The element it is portalled into. Defaults to `body`; pass the
       * enclosing native `<dialog>` or a themed wrapper to keep it there.
       */
      container?: string | HTMLElement
    }
  >(),
  { align: "start", sideOffset: 8 }
)
const emits = defineEmits<PopoverContentEmits>()

const delegated = computed(() => {
  const { class: _class, container: _container, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <PopoverPortal :to="props.container">
    <PopoverContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'z-[110] flex w-[280px] max-w-[90vw] flex-col items-start gap-2 rounded-md border border-newt-border bg-newt-bg-floating p-3 text-sm leading-5 text-newt-text-secondary shadow-elevation-high outline-none',
          props.class
        )
      "
    >
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>
