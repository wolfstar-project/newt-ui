"use client"

import * as React from "react"

import { Button } from "@/registry/bases/newt/ui/button"
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
} from "@/registry/bases/newt/ui/modal"

const RULES = [
  "Be kind. Disagree with the idea, not with the person.",
  "Keep each channel on its topic; off-topic talk goes in the lounge.",
  "No spam, self-promotion or unsolicited direct messages.",
  "Mark spoilers, and keep anything not safe for work out entirely.",
  "Do not share anyone's personal details, including your own.",
  "Use a thread for a long discussion so the channel stays readable.",
  "Listen to the moderators. Appeal a decision in private, not in public.",
  "Report a problem with the report action instead of answering it.",
]

/*
 * Cap the body and let it scroll: the title and the actions stay where they
 * are however long the text gets.
 */
export default function ModalLongContentDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Read the rules
      </Button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalHeader>Server rules</ModalHeader>
        <ModalBody className="max-h-48 overflow-y-auto">
          <ol className="flex list-decimal flex-col gap-3 ps-5">
            {RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="secondary">Not now</Button>
          </ModalClose>
          <Button onClick={() => setOpen(false)}>I agree</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
