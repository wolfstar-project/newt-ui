<script setup lang="ts">
import { onBeforeUnmount, ref, type HTMLAttributes } from "vue"

import { Button } from "@/lib/registry/default/ui/button"
import { Input } from "@/lib/registry/default/ui/form-fields"
import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    /** The secret value. Masked until revealed. */
    value: string
    /** Id forwarded to the input so a label can target it. */
    id?: string
    name?: string
    revealLabel?: string
    hideLabel?: string
    copyLabel?: string
    copiedLabel?: string
    /** How long (ms) the copied label is shown. */
    copiedDuration?: number
    class?: HTMLAttributes["class"]
  }>(),
  {
    revealLabel: "Reveal",
    hideLabel: "Hide",
    copyLabel: "Copy",
    copiedLabel: "Copied!",
    copiedDuration: 1500,
  }
)

const emit = defineEmits<{
  (e: "copy"): void
}>()

const revealed = ref(false)
const copied = ref(false)
let timeout: ReturnType<typeof setTimeout> | null = null

async function copy() {
  await navigator.clipboard.writeText(props.value)
  emit("copy")
  copied.value = true
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => (copied.value = false), props.copiedDuration)
}

onBeforeUnmount(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<template>
  <div :class="cn('flex gap-2', props.class)">
    <Input
      :id="props.id"
      :name="props.name"
      :type="revealed ? 'text' : 'password'"
      :value="props.value"
      readonly
      class="font-mono tracking-[0.05em]"
    />
    <Button
      type="button"
      variant="secondary"
      :aria-pressed="revealed"
      @click="revealed = !revealed"
    >
      {{ revealed ? props.hideLabel : props.revealLabel }}
    </Button>
    <Button type="button" variant="secondary" aria-live="polite" @click="copy">
      {{ copied ? props.copiedLabel : props.copyLabel }}
    </Button>
  </div>
</template>
