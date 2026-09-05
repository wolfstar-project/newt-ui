import { InlineCode } from "@/registry/default/ui/inline-code"

export default function InlineCodeDemo() {
  return (
    <p className="text-sm text-newt-text-secondary">
      Run <InlineCode>pnpm install</InlineCode> to get started.
    </p>
  )
}
