<script setup lang="ts">
import type { Component } from "vue"
import { computed } from "vue"

import { Index } from "@/__registry__"
import ComponentSection from "@/components/docs/ComponentSection.vue"
import Preview from "@/components/docs/Preview.vue"
import { categories } from "@/lib/registry/registry-categories"
import { rootClasses } from "@/lib/registry/registry-root-classes"
import { ui } from "@/lib/registry/registry-ui"

/** Number of hand-written sections on the home page (`installation`, `tokens`). */
const STATIC_SECTIONS = 2

const order: string[] = categories.flatMap((category) => category.components)

function pascalCase(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

const route = useRoute()
const name = computed<string>(() => String(route.params.name))
const item = computed(() =>
  ui.find((registryItem) => registryItem.name === name.value)
)
const index = computed<number>(
  () => order.indexOf(name.value) + 1 + STATIC_SECTIONS
)
const demo = computed<Component | undefined>(() => {
  const entry = Index.default[`${pascalCase(name.value)}Demo`]
  return entry?.component
})

useHead(() => ({ title: `${item.value?.title ?? name.value} — newt/ui` }))
</script>

<template>
  <div class="content">
    <ComponentSection
      v-if="item"
      :index="index"
      :name="item.name"
      :title="item.title ?? item.name"
      :root-class="rootClasses[item.name]"
      :description="item.description"
    >
      <Preview>
        <component :is="demo" v-if="demo" />
        <p v-else class="component-section__desc">No demo available.</p>
      </Preview>
    </ComponentSection>
    <ComponentSection
      v-else
      :index="0"
      name="not-found"
      title="Component not found"
      :description="`No registry entry matches “${name}”.`"
    >
      <Preview>
        <p class="component-section__desc">
          Check the sidebar for the full component list.
        </p>
      </Preview>
    </ComponentSection>
  </div>
</template>
