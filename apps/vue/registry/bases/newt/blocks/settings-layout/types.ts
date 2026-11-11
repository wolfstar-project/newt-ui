/*
 * The shape the layout reads. A block does not know your router; map your
 * sections onto this at the edge of it.
 */
export interface SettingsSection {
  id: string
  label: string
  /** A count shown beside the entry. */
  badge?: number
  /** For an entry that destroys something. It is never the current section. */
  danger?: boolean
}

export interface SettingsGroup {
  /** The small heading over the group. */
  label?: string
  sections: readonly SettingsSection[]
}
