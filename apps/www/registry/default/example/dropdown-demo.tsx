import {
  Dropdown,
  DropdownContent,
  DropdownDescription,
  DropdownDivider,
  DropdownIcon,
  DropdownItem,
  DropdownLabel,
} from "@/registry/default/ui/dropdown"

export default function DropdownDemo() {
  return (
    <Dropdown>
      <DropdownItem active>
        <DropdownIcon>{"⚡"}</DropdownIcon>
        <DropdownContent>
          <DropdownLabel>Option label</DropdownLabel>
          <DropdownDescription>Option description</DropdownDescription>
        </DropdownContent>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem>
        <DropdownIcon>{"⚙"}</DropdownIcon>
        <DropdownContent>
          <DropdownLabel>Another option</DropdownLabel>
          <DropdownDescription>Description</DropdownDescription>
        </DropdownContent>
      </DropdownItem>
    </Dropdown>
  )
}
