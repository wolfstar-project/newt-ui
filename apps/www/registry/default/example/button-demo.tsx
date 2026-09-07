import { Button } from "@/registry/default/ui/button"

/* Inline so the demo never reaches out to the network for a placeholder. */
const EMOJI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='7' fill='%23f0b232'/%3E%3C/svg%3E"

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="success">Success</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="secondary" emoji={EMOJI}>
        With emoji
      </Button>
      <Button variant="link">Link button</Button>
    </div>
  )
}
