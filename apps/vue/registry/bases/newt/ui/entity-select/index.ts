import type { Component } from "vue"

export { default as EntitySelect } from "./EntitySelect.vue"

/** What the list is drawn from. Mentionable mixes members and roles. */
export type EntityKind = "user" | "role" | "channel" | "mentionable"

export interface EntityOption {
  value: string
  label: string
  /**
   * A member's avatar, or the glyph a role or channel is known by. The Vue
   * analogue of React's node: pass a component, and the control sizes it.
   */
  icon?: Component
  /** Members carrying this role — shown beside the name, as the client does. */
  count?: number
  /** A short tag after the name. An app is the one that always has one. */
  badge?: string
  /** A role's colour, which its name takes in the list and in its chip. */
  color?: string
  disabled?: boolean
}

/**
 * What one of these may carry. The platform takes at most this many either
 * way — as the list it offers, and as the selection it accepts back.
 */
export const ENTITY_SELECT_MAX = 25

/** The line shown when the server has nothing of this kind to offer. */
export const entitySelectEmpty = {
  user: "No members to show",
  role: "No roles to show",
  channel: "No channels to show",
  mentionable: "Nothing to show",
} as const satisfies Record<EntityKind, string>
