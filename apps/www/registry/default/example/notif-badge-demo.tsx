import { Avatar } from "@/registry/default/ui/avatar"
import { NotifBadge } from "@/registry/default/ui/notif-badge"

export default function NotifBadgeDemo() {
  return (
    <div className="flex items-center gap-8">
      <div className="relative inline-block">
        <Avatar>U</Avatar>
        <NotifBadge className="absolute -right-1 -top-1">3</NotifBadge>
      </div>

      <NotifBadge variant="unread" aria-label="Unread" />
    </div>
  )
}
