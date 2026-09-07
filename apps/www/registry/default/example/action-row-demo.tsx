import { ActionRow } from "@/registry/default/ui/action-row"
import { Button } from "@/registry/default/ui/button"

export default function ActionRowDemo() {
  return (
    <ActionRow aria-label="Message actions">
      <Button variant="primary">Accept</Button>
      <Button variant="secondary">Decline</Button>
    </ActionRow>
  )
}
