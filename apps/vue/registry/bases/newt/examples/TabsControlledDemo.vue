<script setup lang="ts">
import { computed, ref } from "vue"
import { Tabs, TabsList, TabsTrigger } from "~~/registry/bases/newt/ui/tabs"

/*
 * The active tab lives in the parent, so anything else on the page can read it
 * — or change it, as the button under the list does.
 */
const tab = ref("online")

const tabs = [
  { value: "online", label: "Online", summary: "4 friends online" },
  { value: "all", label: "All", summary: "27 friends" },
  { value: "pending", label: "Pending", summary: "2 pending requests" },
]

const summary = computed(
  () => tabs.find((item) => item.value === tab.value)?.summary
)
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <Tabs v-model="tab">
      <TabsList>
        <TabsTrigger v-for="item in tabs" :key="item.value" :value="item.value">
          {{ item.label }}
        </TabsTrigger>
      </TabsList>
    </Tabs>
    <p class="text-sm text-newt-text-secondary">{{ summary }}</p>
    <button
      type="button"
      class="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium text-newt-text-link hover:underline"
      @click="tab = 'pending'"
    >
      Review pending requests
    </button>
  </div>
</template>
