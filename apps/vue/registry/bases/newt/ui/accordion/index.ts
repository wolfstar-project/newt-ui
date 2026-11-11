import type { ComputedRef, InjectionKey } from "vue"

export { default as Accordion } from "./Accordion.vue"
export { default as AccordionItem } from "./AccordionItem.vue"

/* The shared `name` that makes the browser keep one section open. */
export const accordionKey: InjectionKey<ComputedRef<string | undefined>> =
  Symbol("newt-accordion")
