<script setup lang="ts">
import { ref } from "vue"
import {
  Dropdown,
  DropdownContent,
  DropdownDescription,
  DropdownIcon,
  DropdownItem,
  DropdownLabel,
} from "~~/registry/bases/newt/ui/dropdown"

/*
 * `active` marks the current choice. The menu keeps no state of its own, so
 * the parent holds the value and each item reports its click.
 */
const status = ref("online")

const statuses: {
  value: string
  label: string
  description?: string
  dot: string
}[] = [
  { value: "online", label: "Online", dot: "bg-newt-online" },
  { value: "idle", label: "Idle", dot: "bg-newt-idle" },
  {
    value: "dnd",
    label: "Do not disturb",
    description: "You will not get desktop notifications.",
    dot: "bg-newt-dnd",
  },
  {
    value: "invisible",
    label: "Invisible",
    description: "You appear offline but keep full access.",
    dot: "bg-newt-offline",
  },
]
</script>

<template>
  <Dropdown aria-label="Status">
    <DropdownItem
      v-for="item in statuses"
      :key="item.value"
      role="menuitemradio"
      :aria-checked="status === item.value"
      :active="status === item.value"
      @click="status = item.value"
    >
      <DropdownIcon>
        <span :class="['inline-block h-2.5 w-2.5 rounded-full', item.dot]" />
      </DropdownIcon>
      <DropdownContent>
        <DropdownLabel>{{ item.label }}</DropdownLabel>
        <DropdownDescription v-if="item.description">
          {{ item.description }}
        </DropdownDescription>
      </DropdownContent>
    </DropdownItem>
  </Dropdown>
</template>
