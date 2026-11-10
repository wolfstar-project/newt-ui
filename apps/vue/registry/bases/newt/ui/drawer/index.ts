import type { InjectionKey } from "vue"

export { default as Drawer } from "./Drawer.vue"
export { default as DrawerHeader } from "./DrawerHeader.vue"
export { default as DrawerBody } from "./DrawerBody.vue"
export { default as DrawerFooter } from "./DrawerFooter.vue"
export { default as DrawerClose } from "./DrawerClose.vue"

export interface DrawerContext {
  readonly close: () => void
  readonly titleId: string
}

export const drawerKey: InjectionKey<DrawerContext> = Symbol("newt-drawer")
