<script setup lang="ts">
import { ref } from "vue"

const props = withDefaults(
  defineProps<{
    code?: string
    dark?: boolean
    column?: boolean
  }>(),
  { code: undefined, dark: false, column: false }
)

const contentRef = ref<HTMLDivElement | null>(null)
const { copied, copy } = useCopyToClipboard()

function formatMarkup(html: string): string {
  return html
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
}

async function copySource(): Promise<void> {
  const source =
    props.code ??
    (contentRef.value ? formatMarkup(contentRef.value.innerHTML) : "")
  await copy(source)
}
</script>

<template>
  <div
    class="preview"
    :class="{ 'preview--dark': props.dark, 'preview--col': props.column }"
  >
    <button
      class="preview__copy"
      :class="{ 'is-copied': copied }"
      type="button"
      @click="copySource"
    >
      {{ copied ? "Copied" : "Copy" }}
    </button>
    <div ref="contentRef" class="preview__content">
      <slot />
    </div>
  </div>
</template>
