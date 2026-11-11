<script setup lang="ts">
import { inject } from "vue"

import { drawerKey } from "."

/*
 * A plain button that closes the drawer. Like the popover's trigger it has no
 * look of its own; give it the classes of the button it should be.
 */
const drawer = inject(drawerKey)
if (drawer === undefined) {
  throw new Error("<DrawerClose> must be used inside a <Drawer>.")
}
</script>

<template>
  <button type="button" @click="drawer.close"><slot /></button>
</template>
