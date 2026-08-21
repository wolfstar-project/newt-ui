import {
  Field,
  FieldHelp,
  Input,
  Label,
  Switch,
} from "@/registry/default/ui/form-fields"

export default function FormFieldsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Field>
        <Label htmlFor="newt-input-example">Label</Label>
        <Input id="newt-input-example" placeholder="Placeholder" />
        <FieldHelp>Helper text</FieldHelp>
      </Field>

      <div className="flex items-center justify-between text-newt-text-primary">
        <span>Toggle label</span>
        <Switch aria-label="Toggle label" />
      </div>
    </div>
  )
}
