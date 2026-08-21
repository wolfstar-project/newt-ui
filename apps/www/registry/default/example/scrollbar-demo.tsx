import { ScrollArea } from "@/registry/default/ui/scrollbar"

const messages = Array.from({ length: 24 }, (_, i) => `Message line ${i + 1}`)

export default function ScrollbarDemo() {
  return (
    <ScrollArea className="max-h-[240px] w-full max-w-sm overflow-y-auto rounded-md bg-newt-bg-elevated p-3">
      <ul className="flex flex-col gap-2 text-[14px] text-newt-text-secondary">
        {messages.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </ScrollArea>
  )
}
