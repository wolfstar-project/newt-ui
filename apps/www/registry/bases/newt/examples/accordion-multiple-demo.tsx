import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/bases/newt/ui/accordion"

/*
 * `multiple` lets the sections open independently, so opening one leaves the
 * others as they are. Here two start open and stay open.
 */
export default function AccordionMultipleDemo() {
  return (
    <Accordion
      type="multiple"
      defaultValue={["notifications", "privacy"]}
      className="max-w-md"
    >
      <AccordionItem value="notifications">
        <AccordionTrigger>Notifications</AccordionTrigger>
        <AccordionContent>
          Only mentions, on every device you are signed in to.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="privacy">
        <AccordionTrigger>Privacy</AccordionTrigger>
        <AccordionContent>
          Members of this server can message you directly.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="appearance">
        <AccordionTrigger>Appearance</AccordionTrigger>
        <AccordionContent>
          Compact messages, with avatars hidden.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
