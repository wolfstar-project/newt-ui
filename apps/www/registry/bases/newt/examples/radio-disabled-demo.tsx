import { Radio, RadioGroup } from "@/registry/bases/newt/ui/radio"

/* The arrow keys step over the disabled row rather than stopping on it. */
export default function RadioDisabledDemo() {
  return (
    <RadioGroup
      className="w-full max-w-sm"
      label="Stream quality"
      defaultValue="720"
    >
      <Radio value="720" description="Smooth on most connections.">
        720p
      </Radio>
      <Radio
        value="1080"
        description="Needs a boosted server to turn on."
        disabled
      >
        1080p
      </Radio>
      <Radio value="source" description="Whatever your screen sends.">
        Source
      </Radio>
    </RadioGroup>
  )
}
