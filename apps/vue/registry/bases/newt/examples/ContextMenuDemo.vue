<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  ContextMenuShortcut,
} from "~~/registry/bases/newt/ui/context-menu"
</script>

<template>
  <ContextMenu>
    <ContextMenuItem>Action one</ContextMenuItem>
    <ContextMenuItem>
      Action two
      <ContextMenuShortcut>Ctrl+K</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuDivider />
    <ContextMenuItem variant="danger">Delete</ContextMenuItem>
  </ContextMenu>
</template>
