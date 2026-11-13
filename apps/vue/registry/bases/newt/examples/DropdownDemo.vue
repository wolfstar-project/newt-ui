<script setup lang="ts">
import { buttonVariants } from "~~/registry/bases/newt/ui/button"
import {
  Dropdown,
  DropdownContent,
  DropdownIcon,
  DropdownItem,
  DropdownItemDescription,
  DropdownItemLabel,
  DropdownItemText,
  DropdownSeparator,
  DropdownTrigger,
} from "~~/registry/bases/newt/ui/dropdown"
</script>

<template>
  <Dropdown>
    <DropdownTrigger :class="buttonVariants({ variant: 'secondary' })">
      Options
    </DropdownTrigger>
    <DropdownContent>
      <DropdownItem>
        <DropdownIcon>&#x26A1;</DropdownIcon>
        <DropdownItemText>
          <DropdownItemLabel>Option label</DropdownItemLabel>
          <DropdownItemDescription>Option description</DropdownItemDescription>
        </DropdownItemText>
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem>
        <DropdownIcon>&#x2699;</DropdownIcon>
        <DropdownItemText>
          <DropdownItemLabel>Another option</DropdownItemLabel>
          <DropdownItemDescription>Description</DropdownItemDescription>
        </DropdownItemText>
      </DropdownItem>
    </DropdownContent>
  </Dropdown>
</template>
