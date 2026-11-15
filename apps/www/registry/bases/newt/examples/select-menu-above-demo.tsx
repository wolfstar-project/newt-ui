import { SelectMenu } from "@/registry/bases/newt/ui/select-menu"

const OPTIONS = [
  { value: "news", label: "Announcements", emoji: "📣" },
  { value: "events", label: "Events", emoji: "🎉" },
  { value: "patches", label: "Patch notes", emoji: "🛠️" },
  { value: "games", label: "Game nights", emoji: "🎮" },
]

/*
 * A select under a message sits close to the composer, so it opens upwards.
 * The trigger takes the 40px height through its class hook, and each option
 * carries an emoji in place of an icon.
 */
export default function SelectMenuAboveDemo() {
  return (
    <SelectMenu
      variant="message"
      side="top"
      triggerClassName="min-h-10"
      options={OPTIONS}
      label="Notification role"
      placeholder="Choose what to hear about"
    />
  )
}
