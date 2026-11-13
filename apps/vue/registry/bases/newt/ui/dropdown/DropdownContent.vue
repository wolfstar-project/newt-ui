<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  useForwardPropsEmits,
  type DropdownMenuContentEmits,
  type DropdownMenuContentProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<
    DropdownMenuContentProps & {
      class?: HTMLAttributes["class"]
      /**
       * The element it is portalled into. Defaults to `body`; pass the
       * enclosing native `<dialog>` or a themed wrapper to keep it there.
       */
      container?: string | HTMLElement
    }
  >(),
  { align: "start", sideOffset: 4 }
)
const emits = defineEmits<DropdownMenuContentEmits>()

const delegated = computed(() => {
  const { class: _class, container: _container, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DropdownMenuPortal :to="props.container">
    <DropdownMenuContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'z-[110] w-60 rounded-md border border-newt-border bg-newt-bg-floating p-1.5 text-newt-text-primary shadow-elevation-high outline-none',
          props.class
        )
      "
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
