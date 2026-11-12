"use client"

import * as React from "react"

import { Button } from "@/registry/bases/newt/ui/button"
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalHeader,
} from "@/registry/bases/newt/ui/modal"

/*
 * A dialog that only informs needs no footer: one `ModalClose` in the corner
 * is its way out. It sits outside the header so "Close" stays out of the
 * dialog's accessible name.
 */
export default function ModalCloseButtonDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        What&apos;s new
      </Button>
      <Modal open={open} onOpenChange={setOpen} className="relative">
        <ModalHeader className="pe-12">What&apos;s new</ModalHeader>
        <ModalBody>
          Threads now keep their place when you switch channels, and the member
          list remembers which roles you collapsed.
        </ModalBody>
        <ModalClose
          aria-label="Close"
          className="absolute end-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-newt-text-muted transition-colors duration-fast ease-newt hover:bg-newt-bg-hover hover:text-newt-text-primary"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="m4 4 8 8m0-8-8 8"
            />
          </svg>
        </ModalClose>
      </Modal>
    </>
  )
}
