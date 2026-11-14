import { ScrollArea } from "@/registry/bases/newt/ui/scrollbar"

const servers = ["NU", "DS", "QA", "UX", "OP", "DX", "IO", "FX"]
const messages = Array.from({ length: 24 }, (_, i) => `Message line ${i + 1}`)

/*
 * Both thumbs stay hidden until the pointer is over their area, keyboard
 * focus is inside it, or it scrolls. The rail draws a short, thin overlay
 * thumb; the log keeps the native scrollbar.
 */
export default function ScrollbarAutoHideDemo() {
  return (
    <div className="flex h-[240px] w-full max-w-sm overflow-hidden rounded-md bg-newt-bg-elevated">
      <ScrollArea
        variant="overlay"
        autoHide
        focusable
        viewportLabel="Servers"
        className="w-[72px] shrink-0 bg-newt-bg-base [--newt-scrollbar-thumb-max-height:48px] [--newt-scrollbar-thumb-width:4px]"
        viewportClassName="flex flex-col items-center gap-2 py-3"
      >
        {servers.map((server) => (
          <span
            key={server}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-newt-bg-surface text-[14px] font-semibold text-newt-text-primary"
          >
            {server}
          </span>
        ))}
      </ScrollArea>
      <ScrollArea
        autoHide
        focusable
        viewportLabel="Messages"
        className="min-w-0 flex-1 p-3"
      >
        <ul className="flex flex-col gap-2 text-[14px] text-newt-text-secondary">
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
