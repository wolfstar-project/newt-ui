"use client"

import * as React from "react"

import {
  Field,
  FieldHelp,
  Input,
  Label,
} from "@/registry/bases/newt/ui/form-fields"

/*
 * `invalid` is said once, on the field: the input inside reads it for its
 * border, and the help line swaps to the variant that is announced.
 */
export default function FormFieldsErrorDemo() {
  const [name, setName] = React.useState("Game Night!")
  const invalid = !/^[a-z0-9-]+$/.test(name)

  return (
    <Field invalid={invalid} className="w-full max-w-sm">
      <Label htmlFor="newt-field-error-example">Channel name</Label>
      <Input
        id="newt-field-error-example"
        value={name}
        onChange={(event) => setName(event.target.value)}
        aria-invalid={invalid}
        aria-describedby="newt-field-error-example-help"
      />
      {invalid ? (
        <FieldHelp id="newt-field-error-example-help" variant="error">
          Use lowercase letters, numbers and hyphens only.
        </FieldHelp>
      ) : (
        <FieldHelp id="newt-field-error-example-help">
          Members will see #{name}.
        </FieldHelp>
      )}
    </Field>
  )
}
