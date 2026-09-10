"use client"

import * as React from "react"

import { FileUpload } from "@/registry/bases/newt/ui/file-upload"

export default function FileUploadDemo() {
  const [chosen, setChosen] = React.useState<readonly string[]>([])

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-2">
      <FileUpload
        multiple
        hint="Up to 10 files under 500 MB."
        onFiles={(files) => setChosen(files.map((file) => file.name))}
      />
      {chosen.length === 0 ? null : (
        <p className="text-xs text-newt-text-muted">{chosen.join(", ")}</p>
      )}
    </div>
  )
}
