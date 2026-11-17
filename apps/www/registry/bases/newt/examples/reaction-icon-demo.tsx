import { Reaction, ReactionGroup } from "@/registry/bases/newt/ui/reaction"

/* Stands in for any icon component; inline so the demo stays offline. */
const StarIcon = () => (
  <svg viewBox="0 0 24 24" focusable="false" className="h-4 w-4">
    <path
      fill="currentColor"
      d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"
    />
  </svg>
)

/* The children draw the emoji; `emojiAlt` still names it for a screen reader. */
export default function ReactionIconDemo() {
  return (
    <ReactionGroup>
      <Reaction emojiAlt="star" count={2} defaultActive>
        <StarIcon />
      </Reaction>
      <Reaction emoji="🔥" count={3} />
    </ReactionGroup>
  )
}
