<script setup lang="ts">
import { computed, ref } from "vue"
import { buttonVariants } from "~~/registry/bases/newt/ui/button"
import {
  Dropdown,
  DropdownContent,
  DropdownIcon,
  DropdownItemDescription,
  DropdownItemLabel,
  DropdownItemText,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownTrigger,
} from "~~/registry/bases/newt/ui/dropdown"

/*
 * The radio group holds the choice: the parent keeps the value and the group
 * reports each change. The checked item keeps the brand fill.
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

const current = computed(() =>
  statuses.find((item) => item.value === status.value)
)
</script>

<template>
  <Dropdown>
    <DropdownTrigger :class="buttonVariants({ variant: 'secondary' })">
      Status: {{ current?.label }}
    </DropdownTrigger>
    <DropdownContent>
      <DropdownRadioGroup v-model="status">
        <DropdownRadioItem
          v-for="item in statuses"
          :key="item.value"
          :value="item.value"
        >
          <DropdownIcon>
            <span
              :class="['inline-block h-2.5 w-2.5 rounded-full', item.dot]"
            />
          </DropdownIcon>
          <DropdownItemText>
            <DropdownItemLabel>{{ item.label }}</DropdownItemLabel>
            <DropdownItemDescription v-if="item.description">
              {{ item.description }}
            </DropdownItemDescription>
          </DropdownItemText>
        </DropdownRadioItem>
      </DropdownRadioGroup>
    </DropdownContent>
  </Dropdown>
</template>
