import { Spoiler } from "@/registry/default/ui/spoiler"

export default function SpoilerDemo() {
  return (
    <p className="text-sm text-newt-text-primary">
      The ending was <Spoiler>hidden text</Spoiler> all along.
    </p>
  )
}
