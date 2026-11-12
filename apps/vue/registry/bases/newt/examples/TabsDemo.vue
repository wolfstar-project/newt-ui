<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "~~/registry/bases/newt/ui/tabs"
</script>

<template>
  <Tabs default-value="one">
    <TabsList>
      <TabsTrigger value="one">Tab one</TabsTrigger>
      <TabsTrigger value="two">Tab two</TabsTrigger>
      <TabsTrigger value="three">Tab three</TabsTrigger>
    </TabsList>
  </Tabs>
</template>
