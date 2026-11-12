import { Radio, RadioGroup } from "@/registry/bases/newt/ui/radio"

export default function RadioInlineDemo() {
  return (
    <RadioGroup
      className="flex-row flex-wrap gap-x-5"
      label="Theme"
      defaultValue="dark"
    >
      <Radio value="dark">Dark</Radio>
      <Radio value="light">Light</Radio>
      <Radio value="system">Match system</Radio>
    </RadioGroup>
  )
}
