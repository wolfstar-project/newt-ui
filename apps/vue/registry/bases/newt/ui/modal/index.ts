import type { InjectionKey } from "vue"

export { default as Modal } from "./Modal.vue"
export { default as ModalHeader } from "./ModalHeader.vue"
export { default as ModalBody } from "./ModalBody.vue"
export { default as ModalFooter } from "./ModalFooter.vue"
export { default as ModalClose } from "./ModalClose.vue"

export interface ModalContext {
  close: () => void
  titleId: string
}

export const MODAL_CONTEXT_KEY: InjectionKey<ModalContext> =
  Symbol("newt-modal")
