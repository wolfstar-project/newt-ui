import { Progress, ProgressLabel } from "@/registry/bases/newt/ui/progress"

/* The label is outside the bar, so each bar repeats it as its `aria-label`. */
export default function ProgressVariantsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <ProgressLabel>
          <span>Uploading clip</span>
          <span>60%</span>
        </ProgressLabel>
        <Progress value={60} aria-label="Uploading clip" />
      </div>
      <div>
        <ProgressLabel>
          <span>Backup finished</span>
          <span>100%</span>
        </ProgressLabel>
        <Progress variant="success" value={100} aria-label="Backup finished" />
      </div>
      <div>
        <ProgressLabel>
          <span>Storage almost full</span>
          <span>92%</span>
        </ProgressLabel>
        <Progress
          variant="danger"
          value={92}
          aria-label="Storage almost full"
        />
      </div>
    </div>
  )
}
