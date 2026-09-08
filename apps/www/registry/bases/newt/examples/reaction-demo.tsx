import { Reaction, ReactionGroup } from "@/registry/bases/newt/ui/reaction"

export default function ReactionDemo() {
  return (
    <ReactionGroup>
      <Reaction emoji="👍" count={12} defaultActive />
      <Reaction emoji="🚀" count={4} />
    </ReactionGroup>
  )
}
