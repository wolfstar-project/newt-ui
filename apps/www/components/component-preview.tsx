"use client"

import * as React from "react"

import { Index } from "@/__registry__"
import { cn } from "@/lib/utils"

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
}

export function ComponentPreview({
  name,
  className,
  ...props
}: ComponentPreviewProps) {
  const entry = Index.default[name]
  const Preview = entry?.component
  return (
    <div
      className={cn(
        "my-6 rounded-lg border border-newt-border bg-newt-bg-elevated p-8",
        className
      )}
      {...props}
    >
      <React.Suspense
        fallback={<p className="text-newt-text-muted">Loading…</p>}
      >
        {Preview ? (
          <Preview />
        ) : (
          <p className="text-newt-text-muted">
            Component {name} not found in registry.
          </p>
        )}
      </React.Suspense>
    </div>
  )
}
