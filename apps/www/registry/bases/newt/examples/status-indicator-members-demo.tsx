import { Avatar } from "@/registry/bases/newt/ui/avatar"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/bases/newt/ui/status-indicator"

const MEMBERS = [
  { name: "juniper", status: "online", label: "Online" },
  { name: "sorrel", status: "idle", label: "Idle" },
  { name: "thistle", status: "dnd", label: "Do not disturb" },
  { name: "bracken", status: "offline", label: "Offline" },
] as const

/* A member list: the dot carries the state, the label says it in words. */
export default function StatusIndicatorMembersDemo() {
  return (
    <ul className="m-0 flex w-full max-w-[240px] list-none flex-col gap-1 p-0">
      {MEMBERS.map((member) => (
        <li
          key={member.name}
          className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-newt-bg-hover"
        >
          <StatusIndicator aria-label={member.label}>
            <Avatar>{member.name.charAt(0).toUpperCase()}</Avatar>
            <StatusDot status={member.status} />
          </StatusIndicator>
          <div className="flex min-w-0 flex-col text-start">
            <span className="truncate text-sm font-semibold text-newt-text-primary">
              {member.name}
            </span>
            <span className="text-xs text-newt-text-muted">{member.label}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
