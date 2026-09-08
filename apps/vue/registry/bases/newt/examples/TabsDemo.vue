<script setup lang="ts">
import { Tabs, TabsTrigger } from "~~/registry/bases/newt/ui/tabs"
</script>

<template>
  <Tabs default-value="one">
    <TabsTrigger value="one">Tab one</TabsTrigger>
    <TabsTrigger value="two">Tab two</TabsTrigger>
    <TabsTrigger value="three">Tab three</TabsTrigger>
  </Tabs>
</template>
