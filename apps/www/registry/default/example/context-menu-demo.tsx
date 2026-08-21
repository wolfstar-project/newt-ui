import {
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  ContextMenuShortcut,
} from "@/registry/default/ui/context-menu"

export default function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuItem>Action one</ContextMenuItem>
      <ContextMenuItem>
        Action two
        <ContextMenuShortcut>Ctrl+K</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem variant="danger">Delete</ContextMenuItem>
    </ContextMenu>
  )
}
