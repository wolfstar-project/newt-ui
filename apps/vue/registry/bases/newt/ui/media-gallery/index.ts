export { default as MediaGallery } from "./MediaGallery.vue"
export { default as MediaGalleryItem } from "./MediaGalleryItem.vue"

/*
 * One to ten images in a mosaic. The layout is decided by how many there are,
 * not by what each one is: two side by side, three as one large and two
 * stacked, more than that in a grid. The count drives it because that is the
 * only thing the gallery knows before the images load.
 */
export function mediaGalleryLayout(count: number): string {
  if (count <= 1) return "grid-cols-1"
  if (count === 2) return "grid-cols-2"
  /* Three: the first takes the full height beside a stacked pair. */
  if (count === 3) return "grid-cols-2 grid-rows-2 [&>*:first-child]:row-span-2"
  if (count === 4) return "grid-cols-2"
  return "grid-cols-3"
}
