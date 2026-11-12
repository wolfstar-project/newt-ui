import {
  CheckboxGroup,
  CheckboxOption,
} from "@/registry/bases/newt/ui/checkbox-group"

export default function CheckboxGroupDescriptionsDemo() {
  return (
    <CheckboxGroup
      className="w-full max-w-[360px] gap-4"
      label="Notify me about"
      defaultValue={["mentions", "events"]}
    >
      <CheckboxOption
        value="mentions"
        description="When somebody names you or a role you hold."
      >
        Mentions
      </CheckboxOption>
      <CheckboxOption
        value="replies"
        description="When somebody answers one of your messages."
      >
        Replies
      </CheckboxOption>
      <CheckboxOption
        value="events"
        description="Fifteen minutes before an event you joined starts."
      >
        Event reminders
      </CheckboxOption>
    </CheckboxGroup>
  )
}
