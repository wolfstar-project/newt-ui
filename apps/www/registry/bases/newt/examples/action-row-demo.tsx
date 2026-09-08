import { ActionRow } from "@/registry/bases/newt/ui/action-row"
import { Button } from "@/registry/bases/newt/ui/button"

export default function ActionRowDemo() {
  return (
    <ActionRow aria-label="Message actions">
      <Button variant="primary">Accept</Button>
      <Button variant="secondary">Decline</Button>
    </ActionRow>
  )
}
