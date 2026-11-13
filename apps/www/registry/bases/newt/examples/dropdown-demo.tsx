import { buttonVariants } from "@/registry/bases/newt/ui/button"
import {
  Dropdown,
  DropdownContent,
  DropdownIcon,
  DropdownItem,
  DropdownItemDescription,
  DropdownItemLabel,
  DropdownItemText,
  DropdownSeparator,
  DropdownTrigger,
} from "@/registry/bases/newt/ui/dropdown"

export default function DropdownDemo() {
  return (
    <Dropdown>
      <DropdownTrigger className={buttonVariants({ variant: "secondary" })}>
        Options
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem>
          <DropdownIcon>{"⚡"}</DropdownIcon>
          <DropdownItemText>
            <DropdownItemLabel>Option label</DropdownItemLabel>
            <DropdownItemDescription>
              Option description
            </DropdownItemDescription>
          </DropdownItemText>
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem>
          <DropdownIcon>{"⚙"}</DropdownIcon>
          <DropdownItemText>
            <DropdownItemLabel>Another option</DropdownItemLabel>
            <DropdownItemDescription>Description</DropdownItemDescription>
          </DropdownItemText>
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  )
}
