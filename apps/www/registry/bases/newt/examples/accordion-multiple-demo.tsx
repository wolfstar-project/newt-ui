import { Accordion, AccordionItem } from "@/registry/bases/newt/ui/accordion"

/*
 * `multiple` drops the shared name, so opening one section leaves the others
 * as they are — here two start open and stay open.
 */
export default function AccordionMultipleDemo() {
  return (
    <Accordion type="multiple" className="max-w-md">
      <AccordionItem title="Notifications" defaultOpen>
        Only mentions, on every device you are signed in to.
      </AccordionItem>
      <AccordionItem title="Privacy" defaultOpen>
        Members of this server can message you directly.
      </AccordionItem>
      <AccordionItem title="Appearance">
        Compact messages, with avatars hidden.
      </AccordionItem>
    </Accordion>
  )
}
