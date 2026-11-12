import { Badge } from "@/registry/bases/newt/ui/badge"

/* Each variant says what is being reported; the word carries it too. */
export default function BadgeVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Member</Badge>
      <Badge variant="brand">New</Badge>
      <Badge variant="success">Verified</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Banned</Badge>
    </div>
  )
}
