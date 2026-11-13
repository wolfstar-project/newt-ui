import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/bases/newt/ui/accordion"

export default function AccordionDemo() {
  return (
    <Accordion defaultValue="visibility" className="max-w-md">
      <AccordionItem value="visibility">
        <AccordionTrigger>Who can see this channel?</AccordionTrigger>
        <AccordionContent>
          Members with the Moderator role, and anyone you add by name.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="bans">
        <AccordionTrigger>Can I undo a ban?</AccordionTrigger>
        <AccordionContent>
          Yes. Open the ban list, find the member and choose Revoke.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="slowmode">
        <AccordionTrigger>What does slowmode do?</AccordionTrigger>
        <AccordionContent>
          It limits each member to one message per interval in this channel.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
