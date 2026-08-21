import { Skeleton } from "@/registry/default/ui/skeleton"

export default function SkeletonDemo() {
  return (
    <div className="flex w-full max-w-sm gap-3">
      <Skeleton variant="avatar" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton variant="title" />
        <Skeleton variant="text" className="w-[80%]" />
      </div>
    </div>
  )
}
