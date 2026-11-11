"use client"

import * as React from "react"

import { Button, buttonVariants } from "@/registry/bases/newt/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
} from "@/registry/bases/newt/ui/drawer"

export default function DrawerDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open member details
      </Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerHeader>Member details</DrawerHeader>
        <DrawerBody>
          Joined 14 March. Three roles, no warnings on record.
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose className={buttonVariants({ variant: "secondary" })}>
            Close
          </DrawerClose>
          <Button onClick={() => setOpen(false)}>Edit roles</Button>
        </DrawerFooter>
      </Drawer>
    </>
  )
}
