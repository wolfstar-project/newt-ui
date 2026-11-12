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
 * the parent holds the value and each item reports its click. Keyboard: the
 * chosen item is the one Tab lands on (the others are reached with the arrow
 * keys, Home and End), and Enter or Space chooses the focused one.
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
/** Where an arrow key, Home or End moves focus in a menu; `undefined` for any other key. */
function menuTarget(key: string, at: number, last: number): number | undefined {
  switch (key) {
    case "ArrowDown":
      return at >= last ? 0 : at + 1
    case "ArrowUp":
      return at <= 0 ? last : at - 1
    case "Home":
      return 0
    case "End":
      return last
    default:
      return undefined
  }
}

function onKeydown(event: KeyboardEvent) {
  const menu = event.currentTarget
  if (!(menu instanceof HTMLElement)) return
  const items = Array.from(
    menu.querySelectorAll<HTMLElement>("[role=menuitemradio]")
  )
  const at = items.findIndex((item) => item === document.activeElement)
  if (event.key === "Enter" || event.key === " ") {
    if (at === -1) return
    event.preventDefault()
    items[at]?.click()
    return
  }
  const target = menuTarget(event.key, at, items.length - 1)
  if (target !== undefined) {
    event.preventDefault()
    items[target]?.focus()
  }
}
</script>

<template>
  <Dropdown aria-label="Status" @keydown="onKeydown">
    <DropdownItem
      v-for="item in statuses"
      :key="item.value"
      role="menuitemradio"
      :aria-checked="status === item.value"
      :tabindex="status === item.value ? 0 : -1"
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
