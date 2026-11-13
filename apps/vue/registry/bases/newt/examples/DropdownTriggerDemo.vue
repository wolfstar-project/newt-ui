<script setup lang="ts">
import { ref } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownItemLabel,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from "~~/registry/bases/newt/ui/dropdown"

/*
 * `as-child` puts the menu state on your own button, and `v-model:open` lets
 * the parent own it. `@select` reports the chosen item; the menu then closes
 * and hands focus back to the button by itself.
 */
const open = ref(false)
const last = ref("nothing yet")

const actions = ["Invite people", "Create channel", "Server settings"]
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <Dropdown v-model:open="open">
      <DropdownTrigger as-child>
        <Button variant="secondary">Server menu</Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownGroup>
          <DropdownLabel>Server</DropdownLabel>
          <DropdownItem
            v-for="action in actions"
            :key="action"
            @select="last = action"
          >
            <DropdownItemLabel>{{ action }}</DropdownItemLabel>
          </DropdownItem>
        </DropdownGroup>
        <DropdownSeparator />
        <DropdownItem variant="danger" @select="last = 'Leave server'">
          <DropdownItemLabel>Leave server</DropdownItemLabel>
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
    <p class="m-0 text-sm text-newt-text-muted" aria-live="polite">
      The menu is {{ open ? "open" : "closed" }}. Last choice: {{ last }}.
    </p>
  </div>
</template>
