<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "~~/registry/bases/newt/ui/context-menu"
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger as-child>
      <div
        tabindex="0"
        class="flex h-32 w-72 max-w-full items-center justify-center rounded-md border border-dashed border-newt-border text-sm text-newt-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"
      >
        Right click here
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem>Action one</ContextMenuItem>
      <ContextMenuItem>
        Action two
        <ContextMenuShortcut>Ctrl+K</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem variant="danger">Delete</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
