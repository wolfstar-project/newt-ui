<script setup lang="ts">
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~~/registry/bases/newt/ui/tabs"

/*
 * `Tabs` shares the state, `TabsList` holds the triggers, and each
 * `TabsContent` is a sibling of the list. Reka links every trigger to its
 * panel with `aria-controls` and `aria-labelledby`.
 */
</script>

<template>
  <Tabs default-value="overview" class="w-full max-w-sm">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="roles">Roles</TabsTrigger>
      <TabsTrigger value="invites">Invites</TabsTrigger>
    </TabsList>
    <TabsContent
      value="overview"
      class="px-2.5 pt-2 text-sm leading-5 text-newt-text-secondary"
    >
      Rename the server, change its icon and pick the channel new members land
      in.
    </TabsContent>
    <TabsContent
      value="roles"
      class="px-2.5 pt-2 text-sm leading-5 text-newt-text-secondary"
    >
      Three roles. Drag one above another to give it precedence.
    </TabsContent>
    <TabsContent
      value="invites"
      class="px-2.5 pt-2 text-sm leading-5 text-newt-text-secondary"
    >
      One active invite link, used 12 times, expiring in 6 days.
    </TabsContent>
  </Tabs>
</template>
