<script setup lang="ts">
import { ref } from "vue"
import { Button, buttonVariants } from "~~/registry/bases/newt/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
} from "~~/registry/bases/newt/ui/drawer"

const open = ref(false)
</script>

<template>
  <Button variant="secondary" @click="open = true">
    Open member details
  </Button>
  <Drawer v-model:open="open">
    <DrawerHeader>Member details</DrawerHeader>
    <DrawerBody>
      Joined 14 March. Three roles, no warnings on record.
    </DrawerBody>
    <DrawerFooter>
      <DrawerClose :class="buttonVariants({ variant: 'secondary' })">
        Close
      </DrawerClose>
      <Button @click="open = false">Edit roles</Button>
    </DrawerFooter>
  </Drawer>
</template>
