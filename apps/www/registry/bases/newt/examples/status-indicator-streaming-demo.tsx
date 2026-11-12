import { Avatar } from "@/registry/bases/newt/ui/avatar"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/bases/newt/ui/status-indicator"

/* The fifth state: a member who is live, which outranks plain "online". */
export default function StatusIndicatorStreamingDemo() {
  return (
    <div className="flex items-center gap-3">
      <StatusIndicator aria-label="Streaming">
        <Avatar>R</Avatar>
        <StatusDot status="streaming" />
      </StatusIndicator>
      <div className="flex flex-col text-start">
        <span className="text-sm font-semibold text-newt-text-primary">
          rowan
        </span>
        <span className="text-xs text-newt-text-muted">
          Live · Speedrun practice
        </span>
      </div>
    </div>
  )
}
