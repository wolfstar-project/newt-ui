import { Accordion, AccordionItem } from "@/registry/bases/newt/ui/accordion"
import { Badge } from "@/registry/bases/newt/ui/badge"

/* The heading takes more than text: here each one carries a count. */
export default function AccordionCustomTitleDemo() {
  return (
    <Accordion className="max-w-md">
      <AccordionItem
        title={
          <span className="flex items-center gap-2">
            Open reports
            <Badge variant="danger">3</Badge>
          </span>
        }
        defaultOpen
      >
        Two for spam in the lounge, one for a display name.
      </AccordionItem>
      <AccordionItem
        title={
          <span className="flex items-center gap-2">
            Join requests
            <Badge variant="brand">12</Badge>
          </span>
        }
      >
        Twelve people are waiting for a moderator to let them in.
      </AccordionItem>
      <AccordionItem
        title={
          <span className="flex items-center gap-2">
            Appeals
            <Badge>0</Badge>
          </span>
        }
      >
        Nobody has appealed a ban this week.
      </AccordionItem>
    </Accordion>
  )
}
