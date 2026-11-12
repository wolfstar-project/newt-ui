import {
  Embed,
  EmbedDescription,
  EmbedTitle,
} from "@/registry/bases/newt/ui/embed"

/* `color` takes any CSS colour, so a token keeps the bar on the theme. */
const NOTICES = [
  {
    color: "var(--newt-online)",
    title: "Deploy succeeded",
    description: "Build 482 is live on production.",
  },
  {
    color: "var(--newt-idle)",
    title: "Deploy is slow",
    description: "Build 483 has been queued for ten minutes.",
  },
  {
    color: "var(--newt-danger)",
    title: "Deploy failed",
    description: "Build 484 stopped at the test step.",
  },
]

export default function EmbedColorsDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      {NOTICES.map((notice) => (
        <Embed key={notice.title} color={notice.color}>
          <EmbedTitle>{notice.title}</EmbedTitle>
          <EmbedDescription>{notice.description}</EmbedDescription>
        </Embed>
      ))}
    </div>
  )
}
