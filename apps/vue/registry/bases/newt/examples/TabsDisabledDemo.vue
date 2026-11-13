<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "~~/registry/bases/newt/ui/tabs"

/*
 * `disabled` on a trigger takes it out of the arrow-key order and the tab
 * order; the trigger already dims itself.
 */
</script>

<template>
  <Tabs default-value="messages">
    <TabsList>
      <TabsTrigger value="messages">Messages</TabsTrigger>
      <TabsTrigger value="threads">Threads</TabsTrigger>
      <TabsTrigger value="insights" disabled>Insights</TabsTrigger>
    </TabsList>
  </Tabs>
</template>
