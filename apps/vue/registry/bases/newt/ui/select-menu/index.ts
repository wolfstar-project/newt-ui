import type { Component } from "vue"

export { default as SelectMenu } from "./SelectMenu.vue"

export interface SelectMenuOption {
  value: string
  label: string
  /** Secondary line under the label. */
  description?: string
  /**
   * Rendered before the label, in the row and on the trigger once chosen —
   * what the client's device pickers use to tell a microphone from a monitor
   * at a glance. The Vue analogue of React's node: pass a component, and the
   * menu sizes it.
   */
  icon?: Component
  /**
   * A muted aside after the label on the trigger, for what the option resolves
   * to. It is the first thing allowed to truncate.
   */
  note?: string
  disabled?: boolean
}
