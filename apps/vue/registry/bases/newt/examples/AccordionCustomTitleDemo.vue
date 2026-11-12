<script setup lang="ts">
import { Accordion, AccordionItem } from "~~/registry/bases/newt/ui/accordion"
import { Badge } from "~~/registry/bases/newt/ui/badge"

/* The heading takes more than text: here each one carries a count. */
</script>

<template>
  <Accordion class="max-w-md">
    <AccordionItem default-open>
      <template #title>
        <span class="flex items-center gap-2">
          Open reports
          <Badge variant="danger">3</Badge>
        </span>
      </template>
      Two for spam in the lounge, one for a display name.
    </AccordionItem>
    <AccordionItem>
      <template #title>
        <span class="flex items-center gap-2">
          Join requests
          <Badge variant="brand">12</Badge>
        </span>
      </template>
      Twelve people are waiting for a moderator to let them in.
    </AccordionItem>
    <AccordionItem>
      <template #title>
        <span class="flex items-center gap-2">
          Appeals
          <Badge>0</Badge>
        </span>
      </template>
      Nobody has appealed a ban this week.
    </AccordionItem>
  </Accordion>
</template>
