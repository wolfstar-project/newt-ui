import { Badge } from "@/registry/bases/newt/ui/badge"

const CHANNELS = [
  { name: "announcements", count: 1, variant: "brand" },
  { name: "general", count: 12, variant: "danger" },
  { name: "off-topic", count: 3, variant: "default" },
] as const

/* A bare number means nothing to a screen reader, so each count says what it counts. */
export default function BadgeCountsDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      {CHANNELS.map((channel) => (
        <div
          key={channel.name}
          className="flex items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-sm text-newt-text-secondary"
        >
          <span className="truncate"># {channel.name}</span>
          <Badge variant={channel.variant}>
            {channel.count}
            <span className="sr-only"> unread</span>
          </Badge>
        </div>
      ))}
    </div>
  )
}
