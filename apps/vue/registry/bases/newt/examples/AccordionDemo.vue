<script setup lang="ts">
import { Accordion, AccordionItem } from "~~/registry/bases/newt/ui/accordion"
</script>

<template>
  <Accordion class="max-w-md">
    <AccordionItem title="Who can see this channel?" default-open>
      Members with the Moderator role, and anyone you add by name.
    </AccordionItem>
    <AccordionItem title="Can I undo a ban?">
      Yes. Open the ban list, find the member and choose Revoke.
    </AccordionItem>
    <AccordionItem title="What does slowmode do?">
      It limits each member to one message per interval in this channel.
    </AccordionItem>
  </Accordion>
</template>
