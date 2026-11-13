<script setup lang="ts">
import {
  SwitchRoot,
  SwitchThumb,
  useForwardPropsEmits,
  type SwitchRootEmits,
  type SwitchRootProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * Reka owns the behaviour: the role, the checked state, the space bar and the
 * hidden input a form reads when the switch carries a `name`.
 */
const props = defineProps<
  SwitchRootProps & { class?: HTMLAttributes["class"] }
>()
const emits = defineEmits<SwitchRootEmits>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    :class="
      cn(
        'relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border border-newt-border bg-newt-bg-elevated transition-colors duration-base ease-newt disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:border-newt-online data-[state=checked]:bg-newt-online',
        props.class
      )
    "
  >
    <SwitchThumb
      class="absolute start-0.5 top-0.5 h-[18px] w-[18px] rounded-full bg-newt-text-muted transition-[transform,background-color] duration-base ease-newt data-[state=checked]:translate-x-[calc(var(--newt-dir)*1rem)] data-[state=checked]:bg-newt-on-accent"
    />
  </SwitchRoot>
</template>
