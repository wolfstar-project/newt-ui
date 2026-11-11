"use client"

import * as React from "react"

import { Field, FieldHelp, Label } from "@/registry/bases/newt/ui/form-fields"
import { TagInput } from "@/registry/bases/newt/ui/tag-input"

export default function TagInputDemo() {
  const [tags, setTags] = React.useState<readonly string[]>([
    "moderation",
    "music",
  ])

  return (
    <Field className="w-full max-w-sm">
      <Label htmlFor="newt-tag-input-example">Server tags</Label>
      <TagInput
        id="newt-tag-input-example"
        placeholder="Add a tag"
        max={5}
        value={tags}
        onValueChange={setTags}
      />
      <FieldHelp>
        {tags.length} of 5. Press Enter or a comma to add one.
      </FieldHelp>
    </Field>
  )
}
