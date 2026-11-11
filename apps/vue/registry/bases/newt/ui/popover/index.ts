import type { InjectionKey, Ref } from "vue"

export { default as Popover } from "./Popover.vue"
export { default as PopoverTrigger } from "./PopoverTrigger.vue"
export { default as PopoverContent } from "./PopoverContent.vue"

export interface PopoverContext {
  readonly open: Ref<boolean>
  /** Ties the trigger to the panel, and marks the root for outside presses. */
  readonly id: string
}

export const popoverKey: InjectionKey<PopoverContext> = Symbol("newt-popover")
