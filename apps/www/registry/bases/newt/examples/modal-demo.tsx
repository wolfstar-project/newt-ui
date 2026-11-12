import { Button } from "@/registry/bases/newt/ui/button"
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

export default function ModalDemo() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="primary">Open modal</Button>
      </ModalTrigger>
      <ModalContent aria-describedby={undefined}>
        <ModalHeader>
          <ModalTitle>Modal title</ModalTitle>
        </ModalHeader>
        <ModalBody>Modal body content goes here.</ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="secondary">Cancel</Button>
          </ModalClose>
          <ModalClose asChild>
            <Button variant="danger">Confirm</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
