<script setup lang="ts">
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~~/registry/bases/newt/ui/drawer"
</script>

<template>
  <Drawer>
    <DrawerTrigger as-child>
      <Button variant="secondary">Open member details</Button>
    </DrawerTrigger>
    <DrawerContent :aria-describedby="undefined">
      <DrawerHeader>
        <DrawerTitle>Member details</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        Joined 14 March. Three roles, no warnings on record.
      </DrawerBody>
      <DrawerFooter>
        <DrawerClose as-child>
          <Button variant="secondary">Close</Button>
        </DrawerClose>
        <DrawerClose as-child>
          <Button>Edit roles</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
