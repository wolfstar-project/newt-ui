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
   * A unicode emoji drawn in the place of `icon`, for an option that has no
   * component to pass. `icon` wins when an option carries both.
   */
  emoji?: string
  /**
   * A muted aside after the label on the trigger, for what the option resolves
   * to. It is the first thing allowed to truncate.
   */
  note?: string
  disabled?: boolean
}

/**
 * What a select attached to a message may carry. The platform rejects a
 * payload with more, so a menu that rendered them would be showing something
 * that cannot exist.
 */
export const SELECT_MENU_MAX_OPTIONS = 25

/**
 * Where the menu is: in a message, or in a settings panel. The two are not the
 * same control — a message select caps its list, shows the scrollbar it needs
 * to say the list continues, and marks nothing as chosen, because the choice
 * is submitted rather than kept. A settings select has no cap and keeps a tick
 * against the row that is in force.
 */
export type SelectMenuVariant = "settings" | "message"

/**
 * The side of the trigger the panel opens on. The panel flips to the opposite
 * side when the preferred one has no room.
 */
export type SelectMenuSide = "top" | "right" | "bottom" | "left"

/** How the panel lines up with the trigger along its side. */
export type SelectMenuAlign = "start" | "center" | "end"
