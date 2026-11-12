"use client"

import * as React from "react"

import {
  Field,
  FieldHelp,
  Label,
  Textarea,
} from "@/registry/bases/newt/ui/form-fields"

const LIMIT = 120

export default function FormFieldsTextareaDemo() {
  const [topic, setTopic] = React.useState(
    "Patch notes, release dates and nothing else."
  )

  return (
    <Field className="w-full max-w-sm">
      <Label htmlFor="newt-textarea-example">Channel topic</Label>
      <Textarea
        id="newt-textarea-example"
        rows={3}
        maxLength={LIMIT}
        placeholder="Let everyone know what this channel is for"
        value={topic}
        onChange={(event) => setTopic(event.target.value)}
      />
      <FieldHelp>
        {topic.length} of {LIMIT} characters
      </FieldHelp>
    </Field>
  )
}
