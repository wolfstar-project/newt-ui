<script setup lang="ts">
import { Tabs, TabsContent, TabsTrigger } from "~~/registry/bases/newt/ui/tabs"

/*
 * `TabsContent` reads the active tab from `Tabs`, so the panels sit inside it;
 * `flex-wrap` and `basis-full` put them on their own row under the triggers.
 */
</script>

<template>
  <Tabs default-value="overview" class="w-full max-w-sm flex-wrap">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="roles">Roles</TabsTrigger>
    <TabsTrigger value="invites">Invites</TabsTrigger>
    <TabsContent
      value="overview"
      class="basis-full px-2.5 pb-2 text-sm leading-5 text-newt-text-secondary"
    >
      Rename the server, change its icon and pick the channel new members land
      in.
    </TabsContent>
    <TabsContent
      value="roles"
      class="basis-full px-2.5 pb-2 text-sm leading-5 text-newt-text-secondary"
    >
      Three roles. Drag one above another to give it precedence.
    </TabsContent>
    <TabsContent
      value="invites"
      class="basis-full px-2.5 pb-2 text-sm leading-5 text-newt-text-secondary"
    >
      One active invite link, used 12 times, expiring in 6 days.
    </TabsContent>
  </Tabs>
</template>
