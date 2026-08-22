# Setup — Vue & Nuxt

Works with Vue 3 (Vite or Nuxt 3). newt/ui is plain CSS — no Vue plugin needed.

---

## 1. Install via CLI

```bash
npx @wolfstar/newt-ui-vue@latest init
npx @wolfstar/newt-ui-vue@latest add button embed status-indicator timeline badge
```

---

## 2. Import tokens globally

### Vue 3 + Vite

In `src/main.ts` (or `src/main.js`):

```ts
import { createApp } from "vue"
import App from "./App.vue"

// Tokens first, then components
import "../styles/newt-tokens.css"
import "../components/ui/button.css"
import "../components/ui/embed.css"
import "../components/ui/status-indicator.css"
import "../components/ui/avatar.css"
import "../components/ui/timeline.css"

createApp(App).mount("#app")
```

In `index.html`, add `newt-root` to the body:

```html
<body class="newt-root">
  <div id="app"></div>
</body>
```

### Nuxt 3

In `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: [
    "~/styles/newt-tokens.css",
    "~/components/ui/button.css",
    "~/components/ui/embed.css",
    // add more as needed
  ],
})
```

In `app.vue` or your layout, add `newt-root` to the root element:

```vue
<template>
  <div class="newt-root">
    <NuxtPage />
  </div>
</template>
```

---

## 3. Using components in .vue files

Class names are identical to the HTML docs — just use `:class` for dynamic
variants.

```vue
<!-- components/DeployButton.vue -->
<template>
  <button
    :class="['newt-btn', variantClass, sizeClass]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant?: "primary" | "secondary" | "danger" | "success" | "link"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
}>()

const VARIANTS = {
  primary: "newt-btn--primary",
  secondary: "newt-btn--secondary",
  danger: "newt-btn--danger",
  success: "newt-btn--success",
  link: "newt-btn--link",
}

const SIZES = {
  sm: "newt-btn--sm",
  md: "",
  lg: "newt-btn--lg",
}

const variantClass = computed(() => VARIANTS[props.variant ?? "primary"])
const sizeClass = computed(() => SIZES[props.size ?? "md"])
</script>
```

---

## 4. Shard status dashboard

```vue
<!-- components/ShardList.vue -->
<template>
  <div>
    <div class="newt-channel-topic">
      <span class="newt-channel-topic__icon">#</span>
      <span class="newt-channel-topic__name">shard-health</span>
      <span class="newt-channel-topic__divider"></span>
      <span class="newt-channel-topic__desc"
        >{{ onlineCount }} / {{ shards.length }} shards healthy</span
      >
    </div>

    <div
      style="margin-top: 16px; display: flex; flex-direction: column; gap: 4px;"
    >
      <div v-for="shard in shards" :key="shard.id" class="newt-member">
        <div class="newt-status">
          <div class="newt-avatar av-1">{{ shard.id }}</div>
          <div
            :class="`newt-status__dot newt-status__dot--${statusDot(shard.health)}`"
          ></div>
        </div>
        <div class="newt-member__info">
          <span class="newt-member__name">Shard {{ shard.id }}</span>
          <span class="newt-member__role">{{ shard.guilds }} guilds</span>
        </div>
        <span class="newt-badge" :class="latencyBadge(shard.latency)">
          {{ shard.latency }}ms
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Shard {
  id: number
  health: "healthy" | "degraded" | "disconnected"
  guilds: number
  latency: number
}

const props = defineProps<{ shards: Shard[] }>()

const onlineCount = computed(
  () => props.shards.filter((s) => s.health === "healthy").length
)

function statusDot(health: string) {
  return (
    { healthy: "online", degraded: "idle", disconnected: "dnd" }[health] ??
    "offline"
  )
}

function latencyBadge(ms: number) {
  if (ms < 200) return "newt-badge--success"
  if (ms < 500) return "newt-badge--warning"
  return "newt-badge--danger"
}
</script>
```

---

## 5. Reactivity + newt-trace events

```vue
<!-- composables/useShards.ts -->
<script>
import { ref, onMounted, onUnmounted } from 'vue';

export function useShards(pollMs = 5000) {
  const shards = ref([]);
  let interval: ReturnType<typeof setInterval>;

  async function load() {
    const res = await fetch('/api/shards');
    shards.value = await res.json();
  }

  onMounted(() => {
    load();
    interval = setInterval(load, pollMs);
  });

  onUnmounted(() => clearInterval(interval));

  return { shards };
}
</script>
```

```vue
<!-- pages/dashboard.vue (Nuxt) or a view component -->
<template>
  <div style="padding: 24px;">
    <div v-if="shards.length === 0" class="newt-empty-state">
      <div class="newt-empty-state__icon">📡</div>
      <div class="newt-empty-state__title">Waiting for shards…</div>
      <div class="newt-empty-state__desc">
        Start newt-trace and connect your bot.
      </div>
    </div>
    <ShardList v-else :shards="shards" />
  </div>
</template>

<script setup lang="ts">
import { useShards } from "~/composables/useShards"
const { shards } = useShards(3000)
</script>
```

---

## 6. Nuxt auto-imports

If you're using Nuxt 3's auto-import for composables, place `useShards.ts` in
the `composables/` directory — Nuxt will import it automatically, no explicit
import needed in your pages.

```
composables/
  useShards.ts       ← auto-imported by Nuxt
components/
  ShardList.vue
  DeployButton.vue
styles/
  newt-tokens.css    ← from npx @wolfstar/newt-ui-vue init
```
