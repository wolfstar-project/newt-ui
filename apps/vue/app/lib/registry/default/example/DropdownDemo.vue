<script setup lang="ts">
import {
  Dropdown,
  DropdownContent,
  DropdownDescription,
  DropdownDivider,
  DropdownIcon,
  DropdownItem,
  DropdownLabel,
} from "@/lib/registry/default/ui/dropdown"
</script>

<template>
  <Dropdown>
    <DropdownItem active>
      <DropdownIcon>&#x26A1;</DropdownIcon>
      <DropdownContent>
        <DropdownLabel>Option label</DropdownLabel>
        <DropdownDescription>Option description</DropdownDescription>
      </DropdownContent>
    </DropdownItem>
    <DropdownDivider />
    <DropdownItem>
      <DropdownIcon>&#x2699;</DropdownIcon>
      <DropdownContent>
        <DropdownLabel>Another option</DropdownLabel>
        <DropdownDescription>Description</DropdownDescription>
      </DropdownContent>
    </DropdownItem>
  </Dropdown>
</template>
