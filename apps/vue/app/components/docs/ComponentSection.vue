<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    index: number
    name: string
    title: string
    rootClass?: string
    description?: string
  }>(),
  { rootClass: undefined, description: undefined }
)

const num = computed<string>(() => String(props.index).padStart(2, "0"))
</script>

<template>
  <section :id="props.name" class="component-section">
    <div class="component-section__head">
      <div class="component-section__num">{{ num }}</div>
      <div class="component-section__title">
        {{ props.title }}
        <span v-if="props.rootClass" class="component-section__class"
          >.{{ props.rootClass }}</span
        >
      </div>
      <p v-if="props.description" class="component-section__desc">
        {{ props.description }}
      </p>
    </div>
    <div class="component-section__body">
      <slot />
    </div>
  </section>
</template>
