"use client"

import * as React from "react"

import { Avatar } from "@/registry/bases/newt/ui/avatar"
import { Button } from "@/registry/bases/newt/ui/button"
import { Skeleton } from "@/registry/bases/newt/ui/skeleton"

/*
 * A skeleton is hidden from screen readers, so the region says it is busy
 * with `aria-busy` while the placeholder stands in for the message.
 */
export default function SkeletonLoadingDemo() {
  const [loading, setLoading] = React.useState(true)

  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-4">
      <div aria-busy={loading} className="flex w-full gap-3">
        {loading ? (
          <>
            <Skeleton variant="avatar" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton variant="title" />
              <Skeleton variant="text" className="w-[80%]" />
            </div>
          </>
        ) : (
          <>
            <Avatar aria-hidden="true">M</Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-sm font-semibold text-newt-text-primary">
                Mira Okafor
              </span>
              <span className="text-sm text-newt-text-secondary">
                The reading list for next month is pinned.
              </span>
            </div>
          </>
        )}
      </div>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setLoading((current) => !current)}
      >
        {loading ? "Show the message" : "Show the placeholder"}
      </Button>
    </div>
  )
}
