"use client"

import * as React from "react"

import { Button } from "@/registry/bases/newt/ui/button"
import {
  Field,
  FieldHelp,
  Input,
  Label,
} from "@/registry/bases/newt/ui/form-fields"
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/registry/bases/newt/ui/modal"

/*
 * The form wraps the body and the footer, so Enter in the field submits it.
 * The field is the dialog's first control, which is where focus lands.
 */
export default function ModalFormDemo() {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant="primary">Create channel</Button>
      </ModalTrigger>
      <ModalContent aria-describedby={undefined}>
        <ModalHeader>
          <ModalTitle>Create channel</ModalTitle>
        </ModalHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setOpen(false)
            setName("")
          }}
        >
          <ModalBody>
            <Field>
              <Label htmlFor="modal-form-channel-name">Channel name</Label>
              <Input
                id="modal-form-channel-name"
                placeholder="new-channel"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FieldHelp>Lowercase, with dashes instead of spaces.</FieldHelp>
            </Field>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="secondary">Cancel</Button>
            </ModalClose>
            <Button type="submit" disabled={name.trim() === ""}>
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
