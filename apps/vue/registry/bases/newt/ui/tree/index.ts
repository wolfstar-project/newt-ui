export { default as Tree } from "./Tree.vue"

/** One row. A node with `children` is a branch that opens and closes. */
export interface TreeNode {
  /** Unique across the whole tree. */
  id: string
  label: string
  /** A short sign before the label, such as `#`. */
  prefix?: string
  /** A count shown at the end of the row, such as unread messages. */
  badge?: number
  children?: readonly TreeNode[]
}
