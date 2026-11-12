import { SelectMenu } from "@/registry/bases/newt/ui/select-menu"

const OPTIONS = [
  { value: "tank", label: "Tank", description: "Hold the front line" },
  { value: "healer", label: "Healer", description: "Keep the party standing" },
  { value: "ranged", label: "Ranged", description: "Damage from a distance" },
  { value: "melee", label: "Melee", description: "Damage up close" },
  { value: "support", label: "Support", description: "Buffs and utility" },
  { value: "scout", label: "Scout", description: "Find the route first" },
  { value: "crafter", label: "Crafter", description: "Gear for everyone" },
  { value: "caller", label: "Shot caller", description: "Lead the voice chat" },
  { value: "flex", label: "Flex", description: "Fill whatever is missing" },
  { value: "bench", label: "Bench", description: "On call if a slot opens" },
]

/*
 * The select a message carries: the list is capped, its scrollbar is always
 * drawn, and no row keeps a tick once the menu closes.
 */
export default function SelectMenuMessageDemo() {
  return (
    <SelectMenu
      variant="message"
      options={OPTIONS}
      label="Raid role"
      placeholder="Pick your role for tonight"
    />
  )
}
