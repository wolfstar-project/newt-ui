import { Slider } from "@/registry/bases/newt/ui/slider"

const MARKS = [
  { value: 0, label: "0%" },
  { value: 100, label: "100%" },
]

export default function SliderDisabledDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-newt-text-primary">
          Input volume
        </span>
        <span className="text-newt-text-muted">No microphone found</span>
      </div>
      <Slider aria-label="Input volume" value={[40]} marks={MARKS} disabled />
    </div>
  )
}
