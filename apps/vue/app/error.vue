<script setup lang="ts">
import type { NuxtError } from "#app"
import ComponentSection from "@/components/docs/ComponentSection.vue"
import Preview from "@/components/docs/Preview.vue"
import { Button } from "@/lib/registry/default/ui/button"

const props = defineProps<{ error: NuxtError }>()

const message = computed<string>(
  () => props.error.statusMessage ?? props.error.message ?? "Unknown error"
)

useHead({ title: `${props.error.statusCode} — newt/ui` })

async function goHome(): Promise<void> {
  await clearError({ redirect: "/" })
}
</script>

<template>
  <NuxtLayout>
    <div class="content">
      <ComponentSection
        :index="props.error.statusCode ?? 500"
        name="error"
        :title="`${props.error.statusCode} — ${message}`"
        description="That page is not part of the component spec. Pick a component from the sidebar, or head back to the overview."
      >
        <Preview>
          <Button variant="primary" @click="goHome">Back to overview</Button>
        </Preview>
      </ComponentSection>
    </div>
  </NuxtLayout>
</template>
