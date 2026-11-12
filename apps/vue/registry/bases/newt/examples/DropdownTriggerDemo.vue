<script setup lang="ts">
import { nextTick, ref, watch } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
} from "~~/registry/bases/newt/ui/dropdown"

/*
 * The panel does not open itself. A button owns `open`, a wrapper the size of
 * the button is the positioning context, and the keyboard does what a menu
 * promises: opening moves focus to the first item, the arrows walk the items,
 * Enter or Space chooses one, and Escape closes and hands focus back.
 */
const open = ref(false)
const root = ref<HTMLElement | null>(null)

const actions = ["Invite people", "Create channel", "Server settings"]

function items(): HTMLElement[] {
  return Array.from(
    root.value?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []
  )
}

function close() {
  open.value = false
  root.value?.querySelector("button")?.focus()
}

watch(open, async (value) => {
  if (!value) return
  await nextTick()
  items()[0]?.focus()
})

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
  if (!open.value) return
  const all = items()
  const at = all.findIndex((item) => item === document.activeElement)
  const last = all.length - 1

  if (event.key === "Escape") {
    close()
  } else if (event.key === "Tab") {
    open.value = false
  } else if ((event.key === "Enter" || event.key === " ") && at !== -1) {
    event.preventDefault()
    all[at]?.click()
  } else {
    const target = menuTarget(event.key, at, last)
    if (target !== undefined) {
      event.preventDefault()
      all[target]?.focus()
    }
  }
}
</script>

<template>
  <div class="min-h-52 w-60">
    <div ref="root" class="relative inline-block" @keydown="onKeydown">
      <Button
        variant="secondary"
        aria-haspopup="menu"
        :aria-expanded="open"
        @click="open = !open"
      >
        Server menu
      </Button>
      <Dropdown v-if="open" class="absolute start-0 top-[calc(100%+4px)] z-10">
        <DropdownItem v-for="action in actions" :key="action" @click="close">
          <DropdownLabel>{{ action }}</DropdownLabel>
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem
          class="text-newt-danger hover:bg-newt-danger hover:text-newt-on-accent"
          @click="close"
        >
          <DropdownLabel>Leave server</DropdownLabel>
        </DropdownItem>
      </Dropdown>
    </div>
  </div>
</template>
