"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
} from "@/registry/default/ui/modal"

export default function ModalDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalHeader>Modal title</ModalHeader>
        <ModalBody>Modal body content goes here.</ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="secondary">Cancel</Button>
          </ModalClose>
          <Button variant="danger" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
