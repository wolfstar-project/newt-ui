import { Reaction } from "@/registry/default/ui/reaction"

export default function ReactionDemo() {
  return (
    <div className="flex items-center gap-2">
      <Reaction emoji="👍" count={12} defaultActive />
      <Reaction emoji="🚀" count={4} />
    </div>
  )
}
