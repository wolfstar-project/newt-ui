<script setup lang="ts">
import { computed, provide, ref, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import {
  STAGE_BANNER_INJECTION_KEY,
  stageBannerVariants,
  type StageBannerVariants,
} from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    variant?: StageBannerVariants["variant"]
    open?: boolean
  }>(),
  { variant: "brand", open: undefined }
)

const emit = defineEmits<{ (e: "update:open", value: boolean): void }>()

const internalOpen = ref(true)
const isControlled = computed(() => props.open !== undefined)
const isOpen = computed(() =>
  isControlled.value ? props.open : internalOpen.value
)

function close() {
  if (!isControlled.value) internalOpen.value = false
  emit("update:open", false)
}

provide(STAGE_BANNER_INJECTION_KEY, { close })
</script>

<template>
  <div
    v-if="isOpen"
    :data-variant="props.variant"
    :class="cn(stageBannerVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </div>
</template>
