<script setup lang="ts">
import { ref } from "vue"
import { FileUpload } from "~~/registry/bases/newt/ui/file-upload"

const chosen = ref<readonly string[]>([])

function onFiles(files: readonly File[]) {
  chosen.value = files.map((file) => file.name)
}
</script>

<template>
  <div class="flex w-full max-w-[420px] flex-col gap-2">
    <FileUpload multiple hint="Up to 10 files under 500 MB." @files="onFiles" />
    <p v-if="chosen.length" class="text-xs text-newt-text-muted">
      {{ chosen.join(", ") }}
    </p>
  </div>
</template>
