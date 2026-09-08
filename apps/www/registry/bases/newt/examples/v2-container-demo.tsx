import { ActionRow } from "@/registry/bases/newt/ui/action-row"
import { Button } from "@/registry/bases/newt/ui/button"
import { Divider } from "@/registry/bases/newt/ui/divider"
import { V2Container } from "@/registry/bases/newt/ui/v2-container"

export default function V2ContainerDemo() {
  return (
    <V2Container accentColor="var(--newt-brand)">
      <strong>Server rules</strong>
      <Divider spacing="sm" />
      <span>
        Be kind, keep it on topic, and read the pinned messages before asking.
      </span>
      <ActionRow aria-label="Rules actions">
        <Button variant="primary">I agree</Button>
        <Button variant="link">Read more</Button>
      </ActionRow>
    </V2Container>
  )
}
