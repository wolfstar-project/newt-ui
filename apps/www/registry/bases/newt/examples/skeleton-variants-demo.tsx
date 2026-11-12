import { Skeleton } from "@/registry/bases/newt/ui/skeleton"

/* `default` has no size of its own: it takes whatever shape the classes give it. */
export default function SkeletonVariantsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 text-xs text-newt-text-muted">
          avatar
        </span>
        <Skeleton variant="avatar" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 text-xs text-newt-text-muted">
          title
        </span>
        <div className="flex-1">
          <Skeleton variant="title" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 text-xs text-newt-text-muted">text</span>
        <div className="flex-1">
          <Skeleton variant="text" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 text-xs text-newt-text-muted">
          default
        </span>
        <div className="flex-1">
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
