import { Embed, EmbedDescription } from "@/registry/bases/newt/ui/embed"

/* Every part is optional: with no `color` the bar takes the brand colour. */
export default function EmbedMinimalDemo() {
  return (
    <Embed>
      <EmbedDescription>
        Your nickname on this server is now <strong>Rowan</strong>.
      </EmbedDescription>
    </Embed>
  )
}
