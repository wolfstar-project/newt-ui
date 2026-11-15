/*
 * No "use client" here: a Server Component imports the class strings as
 * strings. Only `ScrollArea`, which runs hooks, is a client component.
 */
export {
  ScrollArea,
  ScrollArea as Scrollbar,
  type ScrollAreaProps,
} from "@/registry/bases/newt/ui/scroll-area"
export {
  scrollbarAutoHideClassName,
  scrollbarClassName,
} from "@/registry/bases/newt/ui/scrollbar-classes"
