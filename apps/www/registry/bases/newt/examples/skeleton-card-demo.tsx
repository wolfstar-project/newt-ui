import { Card } from "@/registry/bases/newt/ui/card"
import { Skeleton } from "@/registry/bases/newt/ui/skeleton"

/* The placeholder keeps the card's real layout, so nothing jumps on arrival. */
export default function SkeletonCardDemo() {
  return (
    <Card className="flex w-full max-w-sm flex-col gap-3">
      <Skeleton className="h-28 w-full rounded-md" />
      <Skeleton variant="title" />
      <div className="flex flex-col gap-1.5">
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-[70%]" />
      </div>
    </Card>
  )
}
