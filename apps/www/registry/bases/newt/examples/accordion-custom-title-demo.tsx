import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/bases/newt/ui/accordion"
import { Badge } from "@/registry/bases/newt/ui/badge"

/* The heading takes more than text: here each one carries a count. */
export default function AccordionCustomTitleDemo() {
  return (
    <Accordion defaultValue="reports" className="max-w-md">
      <AccordionItem value="reports">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            Open reports
            <Badge variant="danger">3</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          Two for spam in the lounge, one for a display name.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="requests">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            Join requests
            <Badge variant="brand">12</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          Twelve people are waiting for a moderator to let them in.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="appeals">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            Appeals
            <Badge>0</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          Nobody has appealed a ban this week.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
