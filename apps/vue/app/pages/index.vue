<script setup lang="ts">
import type { Component } from "vue"

import { Index } from "@/__registry__"
import ComponentSection from "@/components/docs/ComponentSection.vue"
import PageHeader from "@/components/docs/PageHeader.vue"
import Preview from "@/components/docs/Preview.vue"
import { Badge } from "@/lib/registry/default/ui/badge"
import { CodeBlock, CodeToken } from "@/lib/registry/default/ui/code-block"
import {
  categories,
  type DocsCategory,
} from "@/lib/registry/registry-categories"
import { rootClasses } from "@/lib/registry/registry-root-classes"
import { ui } from "@/lib/registry/registry-ui"

interface SectionEntry {
  index: number
  name: string
  title: string
  rootClass?: string
  description?: string
  demo?: Component
}

interface CategoryBlock {
  category: DocsCategory
  entries: SectionEntry[]
}

interface TokenSwatch {
  label: string
  color?: string
  brand?: boolean
}

/** Number of the last hand-written section (`installation`, `tokens`). */
const STATIC_SECTIONS = 2

function pascalCase(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

function demoFor(name: string): Component | undefined {
  const entry = Index.default[`${pascalCase(name)}Demo`]
  return entry?.component
}

let counter = STATIC_SECTIONS
const blocks: CategoryBlock[] = categories.map((category) => ({
  category,
  entries: category.components.map((name) => {
    const item = ui.find((registryItem) => registryItem.name === name)
    counter += 1
    return {
      index: counter,
      name,
      title: item?.title ?? name,
      rootClass: rootClasses[name],
      description: item?.description,
      demo: demoFor(name),
    }
  }),
}))

const tokens: TokenSwatch[] = [
  { label: "--newt-brand · #5865f2", brand: true },
  { label: "--newt-online · #23a55a", color: "#23a55a" },
  { label: "--newt-idle · #f0b232", color: "#f0b232" },
  { label: "--newt-dnd · #f23f42", color: "#f23f42" },
  { label: "--newt-offline · #80848e", color: "#80848e" },
]

const installCommand = `# install the CLI
npx @wolfstar/newt-ui-vue@latest init

# add a component
npx @wolfstar/newt-ui-vue@latest add status-indicator embed slash-command

# list everything available
npx @wolfstar/newt-ui-vue@latest list`

useHead({ title: "newt/ui — Vue component spec" })
</script>

<template>
  <PageHeader />

  <div class="content">
    <ComponentSection
      :index="1"
      name="installation"
      title="Installation"
      description="Install the CLI and add components directly into your Vue or Nuxt project — same pattern as shadcn. No runtime dependency; components are copied into your codebase so you fully own them."
    >
      <Preview :code="installCommand">
        <CodeBlock class="w-full"
          ><CodeToken kind="comment"># install the CLI</CodeToken>
          npx @wolfstar/newt-ui-vue@latest init

          <CodeToken kind="comment"># add a component</CodeToken>
          npx @wolfstar/newt-ui-vue@latest add status-indicator embed
          slash-command

          <CodeToken kind="comment"># list everything available</CodeToken>
          npx @wolfstar/newt-ui-vue@latest list</CodeBlock
        >
      </Preview>
    </ComponentSection>

    <ComponentSection
      :index="2"
      name="tokens"
      title="Design tokens"
      description="Every component is built on CSS variables matching Discord's actual surface and accent colors, so themes stay consistent across light client, dark client, and AMOLED. Never hardcode a hex value — reference a --newt-* token."
    >
      <Preview>
        <Badge
          v-for="token in tokens"
          :key="token.label"
          dot
          :variant="token.brand ? 'brand' : 'default'"
          :style="token.color ? { color: token.color } : undefined"
        >
          {{ token.label }}
        </Badge>
      </Preview>
    </ComponentSection>

    <template v-for="block in blocks" :key="block.category.slug">
      <div class="category-heading">{{ block.category.label }}</div>
      <ComponentSection
        v-for="entry in block.entries"
        :key="entry.name"
        :index="entry.index"
        :name="entry.name"
        :title="entry.title"
        :root-class="entry.rootClass"
        :description="entry.description"
      >
        <Preview>
          <component :is="entry.demo" v-if="entry.demo" />
          <p v-else class="component-section__desc">No demo available.</p>
        </Preview>
      </ComponentSection>
    </template>
  </div>
</template>
