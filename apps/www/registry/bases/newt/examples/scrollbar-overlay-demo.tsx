import { ScrollArea } from "@/registry/bases/newt/ui/scrollbar"

const channels = [
  "welcome",
  "rules",
  "announcements",
  "general",
  "introductions",
  "help",
  "showcase",
  "feedback",
  "off-topic",
  "music",
  "art",
  "events",
  "suggestions",
  "dev-log",
  "releases",
  "lounge",
]

/*
 * A column with a card floating over its foot. The thumb is drawn over the
 * rows, so they keep the full width, and the track stops above the card.
 */
export default function ScrollbarOverlayDemo() {
  return (
    <div className="relative w-full max-w-[240px]">
      <ScrollArea
        variant="overlay"
        focusable
        viewportLabel="Channels"
        className="h-[240px] rounded-md bg-newt-bg-surface [--newt-scrollbar-inset-end:60px]"
        viewportClassName="p-2 pb-[60px]"
      >
        <ul className="flex flex-col gap-0.5 text-[14px] text-newt-text-secondary">
          {channels.map((channel) => (
            <li
              key={channel}
              className="rounded-sm px-2 py-1.5 hover:bg-newt-bg-hover"
            >
              # {channel}
            </li>
          ))}
        </ul>
      </ScrollArea>
      <p className="absolute inset-x-2 bottom-2 rounded-md bg-newt-bg-floating px-3 py-2.5 text-[13px] font-medium text-newt-text-primary shadow-elevation-low">
        Riley is online
      </p>
    </div>
  )
}
