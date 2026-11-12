<script setup lang="ts">
import { ref } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
} from "~~/registry/bases/newt/ui/dropdown"

/*
 * The panel does not open itself. A button owns `open`, the wrapper is the
 * positioning context, and choosing an item or pressing Escape closes it.
 */
const open = ref(false)

const actions = ["Invite people", "Create channel", "Server settings"]
</script>

<template>
  <div class="relative min-h-52 w-60" @keydown.esc="open = false">
    <Button
      variant="secondary"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="open = !open"
    >
      Server menu
    </Button>
    <Dropdown v-if="open" class="absolute start-0 top-[calc(100%+4px)] z-10">
      <DropdownItem
        v-for="action in actions"
        :key="action"
        @click="open = false"
      >
        <DropdownLabel>{{ action }}</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem
        class="text-newt-danger hover:bg-newt-danger hover:text-newt-on-accent"
        @click="open = false"
      >
        <DropdownLabel>Leave server</DropdownLabel>
      </DropdownItem>
    </Dropdown>
  </div>
</template>
