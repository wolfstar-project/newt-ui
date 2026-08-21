<script setup lang="ts">
import { computed } from "vue"

import { Button } from "@/lib/registry/default/ui/button"

interface ManifestRow {
  key: string
  value: string
  brand?: boolean
}

const { site, links } = useAppConfig()
const { componentCount } = useDocsNav()

const manifest = computed<ManifestRow[]>(() => [
  { key: "components", value: String(componentCount), brand: true },
  { key: "dependencies", value: "0" },
  { key: "license", value: site.license },
  { key: "install", value: site.cli },
  { key: "tokens", value: "CSS vars" },
  { key: "framework", value: "Vue 3 / Nuxt" },
])
</script>

<template>
  <header id="overview" class="page-header">
    <div class="page-header__main">
      <div class="page-header__eyebrow">
        <span>{{ site.name }}</span>
        <span>·</span>
        <span
          ><b>v{{ site.version }}</b></span
        >
        <span>·</span>
        <span>{{ site.channel }}</span>
      </div>
      <h1>
        <em>component spec —</em>Discord-styled UI, copy-pasted into your
        project.
      </h1>
      <p class="lead">
        A component library, design token system, and AI agent guide for
        building Discord-styled UI — bots, dashboards, and docs that look like
        they belong in the client. Built by Newt Devs, the team behind
        <strong>newt-dsl</strong> and <strong>newt-trace</strong>.
      </p>
      <div class="page-header__cta">
        <Button variant="primary" size="lg">Get started</Button>
        <Button variant="secondary" size="lg" :as-child="false">
          <a :href="links.repo">View on GitHub</a>
        </Button>
      </div>
    </div>
    <div class="page-header__manifest">
      <div class="manifest__heading">package.json</div>
      <div v-for="row in manifest" :key="row.key" class="manifest__row">
        <span class="manifest__key">{{ row.key }}</span>
        <span
          class="manifest__val"
          :class="{ 'manifest__val--brand': row.brand }"
          >{{ row.value }}</span
        >
      </div>
    </div>
  </header>
</template>
