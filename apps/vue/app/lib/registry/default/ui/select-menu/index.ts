export { default as SelectMenu } from "./SelectMenu.vue"

export interface SelectMenuOption {
  value: string
  label: string
  /** Secondary line under the label. */
  description?: string
  disabled?: boolean
}
