import {
  CheckboxGroup,
  CheckboxOption,
} from "@/registry/bases/newt/ui/checkbox-group"

export default function CheckboxGroupInlineDemo() {
  return (
    <CheckboxGroup
      className="flex-row flex-wrap gap-x-6 gap-y-3"
      label="Where do you play?"
      defaultValue={["desktop"]}
    >
      <CheckboxOption value="desktop">Desktop</CheckboxOption>
      <CheckboxOption value="console">Console</CheckboxOption>
      <CheckboxOption value="mobile">Mobile</CheckboxOption>
    </CheckboxGroup>
  )
}
