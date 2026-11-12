import { Avatar } from "@/registry/bases/newt/ui/avatar"
import { Badge } from "@/registry/bases/newt/ui/badge"
import { Card, CardDescription, CardTitle } from "@/registry/bases/newt/ui/card"

/* A header row built from other registry parts, then the card's own text. */
export default function CardProfileDemo() {
  return (
    <Card className="w-full max-w-sm">
      <div className="mb-3 flex items-center gap-3">
        <Avatar aria-hidden="true">R</Avatar>
        <div className="min-w-0 flex-1">
          <CardTitle className="mb-0 truncate">Riverbend Book Club</CardTitle>
          <CardDescription>128 members</CardDescription>
        </div>
        <Badge variant="success" dot>
          Open
        </Badge>
      </div>
      <CardDescription>
        One novel a month, a voice chat on the last Sunday, and no spoilers
        outside the reading channel.
      </CardDescription>
    </Card>
  )
}
