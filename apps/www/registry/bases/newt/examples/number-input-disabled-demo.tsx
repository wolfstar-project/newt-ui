import { Field, FieldHelp, Label } from "@/registry/bases/newt/ui/form-fields"
import { NumberInput } from "@/registry/bases/newt/ui/number-input"

export default function NumberInputDisabledDemo() {
  return (
    <Field className="items-start">
      <Label htmlFor="newt-number-input-disabled">Upload limit (MB)</Label>
      <NumberInput id="newt-number-input-disabled" value={25} disabled />
      <FieldHelp>Raised by your server&apos;s boost level.</FieldHelp>
    </Field>
  )
}
