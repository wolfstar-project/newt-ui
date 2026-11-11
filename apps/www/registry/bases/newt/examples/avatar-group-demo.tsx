import { Avatar } from "@/registry/bases/newt/ui/avatar"
import { AvatarGroup } from "@/registry/bases/newt/ui/avatar-group"

export default function AvatarGroupDemo() {
  return (
    <div className="flex items-center gap-3 rounded-md bg-newt-bg-surface px-4 py-3">
      <AvatarGroup size="sm" overflow={2} aria-label="In voice: 5 members">
        <Avatar size="sm">A</Avatar>
        <Avatar size="sm" className="bg-newt-online">
          K
        </Avatar>
        <Avatar size="sm" className="bg-newt-danger">
          M
        </Avatar>
      </AvatarGroup>
      <span className="text-sm text-newt-text-secondary">5 in Lounge</span>
    </div>
  )
}
