import { RoleTag } from "@/registry/bases/newt/ui/role-tag"

/* Without `RoleTagDot` the tag is a label; `color` still tints the text. */
export default function RoleTagPlainDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <RoleTag>Member</RoleTag>
      <RoleTag color="#f0b232">Event host</RoleTag>
      <RoleTag color="#eb459e">Artist</RoleTag>
    </div>
  )
}
