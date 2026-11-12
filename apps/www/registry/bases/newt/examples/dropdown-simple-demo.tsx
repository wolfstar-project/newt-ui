import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
} from "@/registry/bases/newt/ui/dropdown"

/*
 * The icon and the description are optional: a label alone makes a compact
 * action menu. The destructive action sits last, apart, in the danger colour.
 */
export default function DropdownSimpleDemo() {
  return (
    <Dropdown className="w-52">
      <DropdownItem>
        <DropdownLabel>Mark as read</DropdownLabel>
      </DropdownItem>
      <DropdownItem>
        <DropdownLabel>Mute channel</DropdownLabel>
      </DropdownItem>
      <DropdownItem>
        <DropdownLabel>Copy link</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem className="text-newt-danger hover:bg-newt-danger hover:text-newt-on-accent">
        <DropdownLabel>Leave server</DropdownLabel>
      </DropdownItem>
    </Dropdown>
  )
}
