import { Avatar } from "@/registry/default/ui/avatar"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/default/ui/status-indicator"

export default function StatusIndicatorDemo() {
  return (
    <div className="flex items-center gap-6">
      <StatusIndicator aria-label="Online">
        <Avatar>A</Avatar>
        <StatusDot status="online" />
      </StatusIndicator>
      <StatusIndicator aria-label="Idle">
        <Avatar>B</Avatar>
        <StatusDot status="idle" />
      </StatusIndicator>
      <StatusIndicator aria-label="Do not disturb">
        <Avatar>C</Avatar>
        <StatusDot status="dnd" />
      </StatusIndicator>
      <StatusIndicator aria-label="Offline">
        <Avatar>D</Avatar>
        <StatusDot status="offline" />
      </StatusIndicator>
    </div>
  )
}
