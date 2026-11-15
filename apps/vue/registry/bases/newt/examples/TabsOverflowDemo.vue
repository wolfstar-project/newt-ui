<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "~~/registry/bases/newt/ui/tabs"

/*
 * Six tabs in a narrow panel. The list scrolls sideways instead of clipping,
 * and an arrow key scrolls the focused tab into view.
 */
const tabs = ["Members", "Media", "Files", "Links", "Threads", "Pins"]
</script>

<template>
  <div class="w-full max-w-[280px]">
    <Tabs default-value="members">
      <TabsList aria-label="Channel details">
        <TabsTrigger v-for="tab in tabs" :key="tab" :value="tab.toLowerCase()">
          {{ tab }}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
</template>
