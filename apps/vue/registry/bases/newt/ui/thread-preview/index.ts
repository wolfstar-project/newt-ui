export { default as ThreadPreview } from "./ThreadPreview.vue"
export { default as ThreadPreviewCount } from "./ThreadPreviewCount.vue"
export { default as ThreadPreviewLast } from "./ThreadPreviewLast.vue"
export { default as ThreadPreviewName } from "./ThreadPreviewName.vue"
export { default as ThreadPreviewSpine } from "./ThreadPreviewSpine.vue"

/** The English default. Pass `formatCount` to translate it. */
export function defaultThreadPreviewCount(count: number): string {
  return count === 1 ? "1 message" : `${count} messages`
}
