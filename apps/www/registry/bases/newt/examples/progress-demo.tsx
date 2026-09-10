import { Progress, ProgressLabel } from "@/registry/bases/newt/ui/progress"

export default function ProgressDemo() {
  return (
    <div className="w-full max-w-sm">
      <ProgressLabel>
        <span>Label</span>
        <span>50%</span>
      </ProgressLabel>
      <Progress value={50} />
    </div>
  )
}
