import { Badge } from "@/registry/default/ui/badge"

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="brand" dot>
        Brand
      </Badge>
      <Badge variant="success" dot>
        Online
      </Badge>
      <Badge variant="danger" dot>
        Error
      </Badge>
    </div>
  )
}
