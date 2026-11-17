export { default as ScrollArea } from "./ScrollArea.vue"

/**
 * Tailwind classes that give any scrollable container Discord-styled
 * scrollbars (thin, rounded thumb, transparent track).
 *
 * The thumb reads `--newt-scrollbar-thumb` and, under the pointer,
 * `--newt-scrollbar-thumb-hover`. Set either on the element or an ancestor.
 */
export const scrollbarClassName = [
  "[scrollbar-width:thin] [scrollbar-color:var(--newt-scrollbar-thumb,var(--newt-bg-active))_transparent]",
  "[&::-webkit-scrollbar]:h-4 [&::-webkit-scrollbar]:w-4",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:rounded-[var(--newt-radius-lg)] [&::-webkit-scrollbar-thumb]:border-4 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--newt-scrollbar-thumb,var(--newt-bg-active))] [&::-webkit-scrollbar-thumb]:bg-clip-padding",
  "[&::-webkit-scrollbar-thumb:hover]:bg-[var(--newt-scrollbar-thumb-hover,var(--newt-text-muted))] [&::-webkit-scrollbar-thumb:hover]:bg-clip-padding",
  "[&::-webkit-scrollbar-corner]:bg-transparent",
].join(" ")

/**
 * Add next to `scrollbarClassName` to hide the thumb until the pointer is
 * over the element or keyboard focus is inside it. Set `data-scrolling` on
 * the element to show it for any other reason; `<ScrollArea auto-hide>` does
 * that while the area scrolls.
 */
export const scrollbarAutoHideClassName = [
  "[&:not(:hover):not(:focus-visible):not(:has(:focus-visible)):not([data-scrolling])]:[scrollbar-color:transparent_transparent]",
  "[&:not(:hover):not(:focus-visible):not(:has(:focus-visible)):not([data-scrolling])::-webkit-scrollbar-thumb]:bg-transparent",
].join(" ")
