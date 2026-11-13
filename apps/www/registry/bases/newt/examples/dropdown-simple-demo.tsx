import { buttonVariants } from "@/registry/bases/newt/ui/button"
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownItemLabel,
  DropdownSeparator,
  DropdownTrigger,
} from "@/registry/bases/newt/ui/dropdown"

/*
 * The icon and the description are optional: a label alone makes a compact
 * action menu. The destructive action sits last, apart, in the danger variant.
 */
export default function DropdownSimpleDemo() {
  return (
    <Dropdown>
      <DropdownTrigger className={buttonVariants({ variant: "secondary" })}>
        Channel actions
      </DropdownTrigger>
      <DropdownContent className="w-52">
        <DropdownItem>
          <DropdownItemLabel>Mark as read</DropdownItemLabel>
        </DropdownItem>
        <DropdownItem>
          <DropdownItemLabel>Mute channel</DropdownItemLabel>
        </DropdownItem>
        <DropdownItem>
          <DropdownItemLabel>Copy link</DropdownItemLabel>
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem variant="danger">
          <DropdownItemLabel>Leave server</DropdownItemLabel>
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  )
}
